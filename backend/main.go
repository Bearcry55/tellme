package main

import (
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
}

var db *sql.DB

func generateUniqueID() string {
	bytes := make([]byte, 4)
	if _, err := rand.Read(bytes); err != nil {
		return "id"
	}
	return hex.EncodeToString(bytes)
}

func main() {
	var err error

	// 🔐 Pull the Connection String safely from your local system/OS environment
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("❌ Critical Configuration Error: DATABASE_URL variable is not set in your environment!")
	}

	// Connect to Supabase PostgreSQL
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open database connection:", err)
	}
	defer db.Close()

	// Verify connection integrity
	err = db.Ping()
	if err != nil {
		log.Fatal("Database unreachable. Ensure your .env string contains valid credentials:", err)
	}

	r := gin.Default()
	r.Use(cors.Default())

	// 🛑 RATE LIMIT CONFIGURATION (5 requests per 1 minute interval)
	rate := limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  5,
	}
	store := memory.NewStore()
	rateLimitMiddleware := mgin.NewMiddleware(limiter.New(store, rate))

	// 1. POST: Create a proposal (Protected by Rate Limiting Middleware)
	r.POST("/api/proposals", rateLimitMiddleware, func(c *gin.Context) {
		var req Proposal
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 💡 THE FIX: If frontend sends an empty string, set the default question text
		if req.CustomQuestion == "" {
			req.CustomQuestion = "Will you be my partner?"
		}

		proposalID := generateUniqueID()
		trackerID := "track-" + generateUniqueID()

		query := `INSERT INTO proposals (id, sender_name, receiver_name, template_id, custom_question, status, tracker_id) 
		          VALUES ($1, $2, $3, $4, $5, $6, $7)`
		
		_, err = db.Exec(query, proposalID, req.SenderName, req.ReceiverName, req.TemplateID, req.CustomQuestion, "pending", trackerID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save proposal to the cloud database"})
			return
		}

		// ⏰ Safety net: Wipes unanswered links after 10 hours
		time.AfterFunc(10*time.Hour, func() {
			_, _ = db.Exec("DELETE FROM proposals WHERE id = $1 AND status = 'pending'", proposalID)
			log.Printf("🗑️ Safety Clean: Unanswered proposal %s expired.", proposalID)
		})

		c.JSON(http.StatusOK, gin.H{
			"proposal_id": proposalID,
			"tracker_id":  trackerID,
		})
	})

	// 2. GET: Fetch details for the Crush viewing the link
	r.GET("/api/proposals/:id", func(c *gin.Context) {
		id := c.Param("id")
		var p Proposal

		query := `SELECT id, sender_name, receiver_name, template_id, custom_question, status FROM proposals WHERE id = $1`
		err := db.QueryRow(query, id).Scan(&p.ID, &p.SenderName, &p.ReceiverName, &p.TemplateID, &p.CustomQuestion, &p.Status)

		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "This link has expired or never existed! 🥺"})
			return
		} else if err != nil {
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

		query := `UPDATE proposals SET status = $1 WHERE id = $2`
		result, err := db.Exec(query, body.Response, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
			return
		}

		rowsAffected, _ := result.RowsAffected()
		if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Proposal missing or expired"})
			return
		}

		if body.Response == "declined" {
			_, _ = db.Exec("DELETE FROM proposals WHERE id = $1", id)
		}

		c.JSON(http.StatusOK, gin.H{"status": "updated"})
	})

	// 4. GET: Route for Creator to check live updates (Self-Destruct on Read Trigger)
	r.GET("/api/track/:tracker_id", func(c *gin.Context) {
		trackerID := c.Param("tracker_id")
		var p Proposal
		var id string

		query := `SELECT id, sender_name, receiver_name, template_id, custom_question, status FROM proposals WHERE tracker_id = $1`
		err := db.QueryRow(query, trackerID).Scan(&id, &p.SenderName, &p.ReceiverName, &p.TemplateID, &p.CustomQuestion, &p.Status)

		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"status": "expired",
				"error":  "This tracking link has completed its lifecycle or expired! 🕶️",
			})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database parsing error"})
			return
		}

		if p.Status == "accepted" {
			time.AfterFunc(10*time.Second, func() {
				_, _ = db.Exec("DELETE FROM proposals WHERE id = $1", id)
				log.Printf("🗑️ Self-Destruct on Read: Creator saw the 'accepted' status. Row %s successfully wiped.", id)
			})
		}

		c.JSON(http.StatusOK, p)
	})

	r.Run(":8080")
}