package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"log"
	"time"
)

// Helper: Generates unique IDs for the links
func generateUniqueID() string {
	bytes := make([]byte, 4)
	if _, err := rand.Read(bytes); err != nil {
		return "id"
	}
	return hex.EncodeToString(bytes)
}

//  BACKGROUND WORKER: Sweeps IMMEDIATELY on boot, then every 10 minutes
func startDatabaseJanitor(database *sql.DB) {
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()

	runCleanup := func() {
		// Rule 1: Clean standard handled/viewed links after 1 hour
		// Rule 2: Force wipe ANY abandoned dead weight after 2 hours
		query := `
			DELETE FROM proposals 
			WHERE ((status = 'pending' OR status = 'declined' OR creator_viewed = true) AND created_at < NOW() - INTERVAL '1 hour')
			   OR (created_at < NOW() - INTERVAL '2 hours')`

		result, err := database.Exec(query)
		if err != nil {
			log.Printf(" Janitor Error: Failed to execute automated cleanup: %v", err)
			return
		}

		rows, _ := result.RowsAffected()
		if rows > 0 {
			log.Printf(" Janitor Clean: Successfully purged %d expired or completed rows from database.", rows)
		}
	}

	// 1. Kick off an immediate execution sweep when server boots up
	log.Println(" Janitor Worker Initialized: Running immediate startup database sweep...")
	runCleanup()

	// 2. Loop continuously on the 10-minute interval ticker channel
	for range ticker.C {
		runCleanup()
	}
}