package main

import (
    "database/sql"
    "log"
    "os"
    "time"
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
    _ "github.com/lib/pq"
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

func main() {
    if err := godotenv.Load(); err != nil {
        log.Println("No .env file found, relying on system environment variables")
    }
    var err error
    connStr := os.Getenv("DATABASE_URL")

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open database connection:", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("Database unreachable. Check connection string credentials:", err)
	}

	//  Fire up the background cleanup worker (Instant run + 10m ticker)
	go startDatabaseJanitor(db)

	r := gin.Default()
	r.Use(cors.Default())

	rate := limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  5,
	}
	store := memory.NewStore()
	rateLimitMiddleware := mgin.NewMiddleware(limiter.New(store, rate))

	// Endpoints bound to your handler functions
	r.POST("/api/proposals", rateLimitMiddleware, handleCreateProposal)
	r.GET("/api/proposals/:id", handleGetProposal)
	r.POST("/api/proposals/:id/respond", handleRespondProposal)
	r.GET("/api/track/:tracker_id", handleTrackProposal)

	r.Run(":8080")
}