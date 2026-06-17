package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Proposal struct {
	SenderName     string    `json:"sender_name"`
	ReceiverName   string    `json:"receiver_name"`
	TemplateID     string    `json:"template_id"`
	CustomQuestion string    `json:"custom_question"` // New field for user text string payloads
	Status         string    `json:"status"`
	TrackerID      string    `json:"tracker_id"`
	CreatedAt      time.Time `json:"created_at"`
}

const (
	DATA_FILE   = "proposals.json"
	EXPIRY_TIME = 24 * time.Hour
)

var (
	proposalDatabase = make(map[string]Proposal)
	trackerLookup    = make(map[string]string)
	dbMutex          sync.Mutex
)

func generateUniqueID() string {
	bytes := make([]byte, 4)
	if _, err := rand.Read(bytes); err != nil {
		return "id"
	}
	return hex.EncodeToString(bytes)
}

func saveDataToFile() {
	bytes, err := json.MarshalIndent(proposalDatabase, "", "  ")
	if err != nil {
		return
	}
	_ = os.WriteFile(DATA_FILE, bytes, 0644)
}

func loadDataFromFile() {
	if _, err := os.Stat(DATA_FILE); os.IsNotExist(err) {
		return
	}
	bytes, err := os.ReadFile(DATA_FILE)
	if err != nil {
		return
	}
	dbMutex.Lock()
	defer dbMutex.Unlock()
	if err := json.Unmarshal(bytes, &proposalDatabase); err == nil {
		for propID, proposal := range proposalDatabase {
			trackerLookup[proposal.TrackerID] = propID
		}
	}
}

func startExpiryCleaner() {
	go func() {
		for {
			time.Sleep(1 * time.Minute)
			dbMutex.Lock()
			now := time.Now()
			hasChanges := false
			for id, proposal := range proposalDatabase {
				if now.Sub(proposal.CreatedAt) > EXPIRY_TIME {
					delete(trackerLookup, proposal.TrackerID)
					delete(proposalDatabase, id)
					hasChanges = true
				}
			}
			if hasChanges {
				saveDataToFile()
			}
			dbMutex.Unlock()
		}
	}()
}

func main() {
	loadDataFromFile()
	startExpiryCleaner()

	r := gin.Default()
	r.Use(cors.Default())

	r.POST("/api/proposals", func(c *gin.Context) {
		var req Proposal
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		proposalID := generateUniqueID()
		trackerID := "track-" + generateUniqueID()

		req.Status = "pending"
		req.TrackerID = trackerID
		req.CreatedAt = time.Now()

		dbMutex.Lock()
		proposalDatabase[proposalID] = req
		trackerLookup[trackerID] = proposalID
		saveDataToFile()
		dbMutex.Unlock()

		c.JSON(http.StatusOK, gin.H{
			"proposal_id": proposalID,
			"tracker_id":  trackerID,
		})
	})

	r.GET("/api/proposals/:id", func(c *gin.Context) {
		id := c.Param("id")
		dbMutex.Lock()
		proposal, exists := proposalDatabase[id]
		dbMutex.Unlock()
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "This link has expired or never existed! 🥺"})
			return
		}
		c.JSON(http.StatusOK, proposal)
	})

	r.POST("/api/proposals/:id/respond", func(c *gin.Context) {
		id := c.Param("id")
		var body struct {
			Response string `json:"response"`
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
			return
		}
		dbMutex.Lock()
		proposal, exists := proposalDatabase[id]
		if !exists {
			dbMutex.Unlock()
			c.JSON(http.StatusNotFound, gin.H{"error": "Proposal missing"})
			return
		}
		proposal.Status = body.Response
		proposalDatabase[id] = proposal
		saveDataToFile()
		dbMutex.Unlock()
		c.JSON(http.StatusOK, gin.H{"status": "updated"})
	})

	r.GET("/api/track/:tracker_id", func(c *gin.Context) {
		trackerID := c.Param("tracker_id")
		dbMutex.Lock()
		proposalID, exists := trackerLookup[trackerID]
		if !exists {
			dbMutex.Unlock()
			c.JSON(http.StatusNotFound, gin.H{"error": "Tracking link expired or invalid"})
			return
		}
		proposal := proposalDatabase[proposalID]
		dbMutex.Unlock()
		c.JSON(http.StatusOK, proposal)
	})

	r.Run(":8080")
}