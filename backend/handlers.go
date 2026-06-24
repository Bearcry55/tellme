package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// 1. POST: Create a proposal
func handleCreateProposal(c *gin.Context) {
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

	_, err := db.ExecContext(c.Request.Context(), query, proposalID, req.SenderName, req.ReceiverName, req.TemplateID, req.CustomQuestion, "pending", trackerID)
	if err != nil {
		log.Printf(" DB Insert Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save proposal to cloud"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"proposal_id": proposalID,
		"tracker_id":  trackerID,
	})
}

// 2. GET: Fetch details for the Crush
func handleGetProposal(c *gin.Context) {
	id := c.Param("id")
	var p Proposal

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
}

// 3. POST: Crush responds to the link
func handleRespondProposal(c *gin.Context) {
	id := c.Param("id")
	var body struct {
		Response string `json:"response"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	query := `UPDATE proposals SET status = $1 WHERE id = $2 AND created_at > NOW() - INTERVAL '1 hour'`
	result, err := db.ExecContext(c.Request.Context(), query, body.Response, id)
	if err != nil {
		log.Printf("DB Update Error (Response Endpoint): %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proposal missing or expired"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}

// 4. GET: Route for Creator
func handleTrackProposal(c *gin.Context) {
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

	if p.Status == "accepted" || p.Status == "declined" {
		updateQuery := `UPDATE proposals SET creator_viewed = true WHERE id = $1`
		if _, updateErr := db.ExecContext(context.Background(), updateQuery, id); updateErr != nil {
			log.Printf(" Warning: Failed to mark row %s as creator_viewed: %v", id, updateErr)
		} else {
			log.Printf(" Creator checked tracked status for %s. Marked as viewed.", id)
		}
	}

	c.JSON(http.StatusOK, p)
}