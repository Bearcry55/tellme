package main

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// This structure handles the incoming data from Next.js
type Proposal struct {
	SenderName   string `json:"sender_name"`
	ReceiverName string `json:"receiver_name"`
	TemplateID   string `json:"template_id"`
}

// OUR TEMPORARY IN-MEMORY DATABASE
// Key: string (the unique ID), Value: Proposal (the names and template)
var proposalDatabase = make(map[string]Proposal)

// Helper function to generate a random short ID (e.g., "7f3a1b")
func generateUniqueID() string {
	bytes := make([]byte, 4)
	if _, err := rand.Read(bytes); err != nil {
		return "default-id"
	}
	return hex.EncodeToString(bytes)
}

func main() {
	r := gin.Default()

	// Enable CORS so Next.js can communicate with Go
	r.Use(cors.Default())

	// 1. POST Endpoint: Create and save a proposal dynamically
	r.POST("/api/proposals", func(c *gin.Context) {
		var req Proposal
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Generate a totally unique ID for this specific entry
		uniqueID := generateUniqueID()

		// Save the names directly into our map memory
		proposalDatabase[uniqueID] = req

		// Return the real, newly generated ID back to Next.js
		c.JSON(http.StatusOK, gin.H{
			"status":      "success",
			"proposal_id": uniqueID,
		})
	})

	// 2. GET Endpoint: Fetch the EXACT proposal dynamically by its ID
	r.GET("/api/proposals/:id", func(c *gin.Context) {
		id := c.Param("id")

		// Look inside the map memory to see if the ID exists
		proposal, exists := proposalDatabase[id]
		if !exists {
			c.JSON(http.StatusNotFound, gin.H{"error": "Proposal link has expired or doesn't exist!"})
			return
		}

		// Return the exact matching names back to Next.js
		c.JSON(http.StatusOK, proposal)
	})

	r.Run(":8080")
}