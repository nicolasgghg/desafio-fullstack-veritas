package backend

import (
	"encoding/json"
	"net/http"
)

// In-memory task storage
var tasks = make(map[int]Task)
var nextID = 1

//----
// Task handlers
//----

// List all tasks
func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(tasks)
}

// Create a new task
func createTask(w http.ResponseWriter, r *http.Request) {
	var task Task

	err := json.NewDecoder(r.Body).Decode(&task)

	// Validations
	if err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}
	if task.Title == "" {
		http.Error(w, "O título é obrigatório", http.StatusBadRequest)
		return
	}
	if task.Status == "" {
		http.Error(w, "O status é obrigatório", http.StatusBadRequest)
		return
	}
	if task.Status != "todo" &&
		task.Status != "in_progress" &&
		task.Status != "done" {
		http.Error(w, "Status inválido", http.StatusBadRequest)
		return
	}

	// Generate ID
	task.ID = nextID
	nextID++

	tasks[task.ID] = task

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(task)
}
