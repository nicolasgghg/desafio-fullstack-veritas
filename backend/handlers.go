package backend

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
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
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	if task.Title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}
	if task.Status == "" {
		http.Error(w, "Status is required", http.StatusBadRequest)
		return
	}
	if task.Status != "todo" &&
		task.Status != "in_progress" &&
		task.Status != "done" {
		http.Error(w, "Invalid status", http.StatusBadRequest)
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

// Update task by ID
func updateTask(w http.ResponseWriter, r *http.Request) {
	id, err := getTaskID(r)

	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if _, exists := tasks[id]; !exists {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	var task Task

	err = json.NewDecoder(r.Body).Decode(&task)

	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if task.Title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}

	if task.Status == "" {
		http.Error(w, "Status is required", http.StatusBadRequest)
		return
	}

	if task.Status != "todo" &&
		task.Status != "in_progress" &&
		task.Status != "done" {
		http.Error(w, "Invalid status", http.StatusBadRequest)
		return
	}

	task.ID = id
	tasks[id] = task

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(task)
}

// Extract task ID from URL
func getTaskID(r *http.Request) (int, error) {
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")

	if len(parts) < 2 {
		return 0, strconv.ErrSyntax
	}

	id, err := strconv.Atoi(parts[1])

	if err != nil {
		return 0, err
	}

	return id, nil
}
