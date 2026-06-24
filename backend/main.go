package main

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // PostgreSQL driver
	"github.com/ulule/limiter/v3"
	mgin "github.com/ulule/limiter/v3/drivers/middleware/gin"
	"github.com/ulule/limiter/v3/drivers/store/memory"
)

type Proposal struct {
	ID             string    `json:"id"`
	SenderName     string    `json:"sender_name"`
	ReceiverName   string    `json:"receiver_name"`
	TemplateID     string    `json:"template_id"`
	CustomQuestion string    `json:"custom_question"`
	Status         string    `json:"status"`
	TrackerID      string    `json:"tracker_id"`
	CreatedAt      time.Time `json:"created_at"`
	CreatorViewed  bool      `json:"creator_viewed"`
}

var db *sql.DB

func generateUniqueID() string {
	bytes := make([]byte, 4)
	if _, err := rand.Read(bytes); err != nil {
		return "id"
	}
	return hex.EncodeToString(bytes)
}

//  BACKGROUND WORKER: Cleans up database dead-weight safely every 10 minutes
func startDatabaseJanitor(database *sql.DB) {
	for {
		time.Sleep(10 * time.Minute)

		// Deletes pending links, declined links, or links already viewed by creator older than 1 hour
		query := `
			DELETE FROM proposals 
			WHERE (status = 'pending' OR status = 'declined' OR creator_viewed = true)
			  AND created_at < NOW() - INTERVAL '1 hour'`

		result, err := database.Exec(query)
		if err != nil {
			log.Printf("Janitor Error: Failed to execute automated cleanup: %v", err)
			continue
		}

		rows, _ := result.RowsAffected()
		if rows > 0 {
			log.Printf("Janitor Clean: Successfully purged %d expired or completed rows from database.", rows)
		}
	}
}

func main() {
	var err error

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal(" Critical Configuration Error: DATABASE_URL variable is not set!")
	}

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open database connection:", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("Database unreachable. Check connection string credentials:", err)
	}

	//  Fire up the background cleanup worker
	go startDatabaseJanitor(db)

	r := gin.Default()
	r.Use(cors.Default())

	rate := limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  5,
	}
	store := memory.NewStore()
	rateLimitMiddleware := mgin.NewMiddleware(limiter.New(store, rate))

	//  POST: Create a proposal (Timer completely removed, handled by DB default timestamp)
	r.POST("/api/proposals", rateLimitMiddleware, func(c *gin.Context) {
		var req Proposal
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if req.CustomQuestion == "" {
			req.CustomQuestion = "Will you be my partner?"
		}

		proposalID := generateUniqueID()
		trackerID := "track-" + generateUniqueID()

		query := `INSERT INTO proposals (id, sender_name, receiver_name, template_id, custom_question, status, tracker_id) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7)`

		_, err = db.ExecContext(c.Request.Context(), query, proposalID, req.SenderName, req.ReceiverName, req.TemplateID, req.CustomQuestion, "pending", trackerID)
		if err != nil {
			log.Printf(" DB Insert Error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save proposal to cloud"})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"proposal_id": proposalID,
			"tracker_id":  trackerID,
		})
	})

	// 2. GET: Fetch details for the Crush (Strict 1-hour enforcement via SQL)
	r.GET("/api/proposals/:id", func(c *gin.Context) {
		id := c.Param("id")
		var p Proposal

		// Filters out links that have already cross-passed the 1-hour mark
		query := `
			SELECT id, sender_name, receiver_name, template_id, custom_question, status 
			FROM proposals 
			WHERE id = $1 AND created_at > NOW() - INTERVAL '1 hour'`

		err := db.QueryRowContext(c.Request.Context(), query, id).Scan(
			&p.ID, &p.SenderName, &p.ReceiverName, &p.TemplateID, &p.CustomQuestion, &p.Status,
		)

		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "This link has expired or never existed! 🥺"})
			return
		} else if err != nil {
			log.Printf(" DB Read Error (Crush Endpoint): %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database read error"})
			return
		}

		c.JSON(http.StatusOK, p)
	})

	// 3. POST: Crush responds to the link
	r.POST("/api/proposals/:id/respond", func(c *gin.Context) {
		id := c.Param("id")
		var body struct {
			Response string `json:"response"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
			return
		}

		// Enforce update only if it falls within the 1-hour active timeframe
		query := `UPDATE proposals SET status = $1 WHERE id = $2 AND created_at > NOW() - INTERVAL '1 hour'`
		result, err := db.ExecContext(c.Request.Context(), query, body.Response, id)
		if err != nil {
			log.Printf(" DB Update Error (Response Endpoint): %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
			return
		}

		rowsAffected, _ := result.RowsAffected()
		if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Proposal missing or expired"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "updated"})
	})

	// 4. GET: Route for Creator (Includes 1-hour lifespan check and flags viewed status)
	r.GET("/api/track/:tracker_id", func(c *gin.Context) {
		trackerID := c.Param("tracker_id")
		var p Proposal
		var id string

		query := `
			SELECT id, sender_name, receiver_name, template_id, custom_question, status 
			FROM proposals 
			WHERE tracker_id = $1 AND created_at > NOW() - INTERVAL '1 hour'`

		err := db.QueryRowContext(c.Request.Context(), query, trackerID).Scan(
			&id, &p.SenderName, &p.ReceiverName, &p.TemplateID, &p.CustomQuestion, &p.Status,
		)

		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"status": "expired",
				"error":  "This tracking link has completed its lifecycle or expired! 🕶️",
			})
			return
		} else if err != nil {
			log.Printf(" DB Read Error (Tracking Endpoint): %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database parsing error"})
			return
		}

		// Flipping the viewed flag so the Janitor knows it can safely wipe this record later
		if p.Status == "accepted" || p.Status == "declined" {
			updateQuery := `UPDATE proposals SET creator_viewed = true WHERE id = $1`
			if _, updateErr := db.ExecContext(context.Background(), updateQuery, id); updateErr != nil {
				log.Printf(" Warning: Failed to mark row %s as creator_viewed: %v", id, updateErr)
			} else {
				log.Printf(" Creator checked tracked status for %s. Marked as viewed.", id)
			}
		}

		c.JSON(http.StatusOK, p)
	})

	r.Run(":8080")
}