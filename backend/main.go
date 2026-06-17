package main

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Structural template layout now tracks status and dynamic response timestamps
type Proposal struct {
	SenderName   string    `json:"sender_name"`
	ReceiverName string    `json:"receiver_name"`
	TemplateID   string    `json:"template_id"`
	Status       string    `json:"status"`        // "pending", "accepted", "rejected"
	TrackerID    string    `json:"tracker_id"`    // Secret key for the creator
	AnsweredAt   time.Time `json:"answered_at"`   // When they clicked the button
}

// Global in-memory data store map
var proposalDatabase = make(map[string]Proposal)
// Reverse lookup map so we can find a proposal using its secret Tracker ID
var trackerLookup = make(map[string]string)

func generateUniqueID() string {
	bytes := make([]byte, 4)
	if _, err := rand.Read(bytes); err != nil {
		return "id"
	}
	return hex.EncodeToString(bytes)
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	// 1. POST: Create a proposal and return BOTH links
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

		// Save to our map memory
		proposalDatabase[proposalID] = req
		trackerLookup[trackerID] = proposalID

		c.JSON(http.StatusOK, gin.H{
			"proposal_id": proposalID,
			"tracker_id":  trackerID,
		})
	})

	// 2. GET: Fetch data for the Crush viewing the page
	r.GET("/api/proposals/:id", func(c *gin.Context) {
		id := c.Param("id")
		proposal, exists := proposalDatabase[id]
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})
			return
		}
		c.JSON(http.StatusOK, proposal)
	})

	// 3. POST: Crush clicks "YES" or "NO" -> Update the status
	r.POST("/api/proposals/:id/respond", func(c *gin.Context) {
		id := c.Param("id")
		var body struct {
			Response string `json:"response"` // "accepted" or "rejected"
		}
		if err := c.ShouldBindJSON(&body); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid body"})
			return
		}

		proposal, exists := proposalDatabase[id]
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "Proposal not found"})
			return
		}

		// Update the values in memory
		proposal.Status = body.Response
		proposal.AnsweredAt = time.Now()
		proposalDatabase[id] = proposal

		c.JSON(http.StatusOK, gin.H{"status": "updated"})
	})

	// 4. GET: Secret route for Creator to check the status live
	r.GET("/api/track/:tracker_id", func(c *gin.Context) {
		trackerID := c.Param("tracker_id")
		proposalID, exists := trackerLookup[trackerID]
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "Tracker link invalid"})
			return
		}

		proposal := proposalDatabase[proposalID]
		c.JSON(http.StatusOK, proposal)
	})

	r.Run(":8080")
}