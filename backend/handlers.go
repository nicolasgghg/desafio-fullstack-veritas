package backend

import (
	"encoding/json"
	"net/http"
)

// In-memory task storage
var tasks = make(map[int]Task)
var nextID = 1

// Task handlers
func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(tasks)
}
