package main

import (
	"encoding/json"
	"errors"
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

	taskList := []Task{}

	for _, task := range tasks {
		taskList = append(taskList, task)
	}

	json.NewEncoder(w).Encode(taskList)
}

// List task by ID
func getTask(w http.ResponseWriter, r *http.Request) {
	id, err := getIDFromURL(r)

	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	task, err := findTaskByID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

// Create a new task
func createTask(w http.ResponseWriter, r *http.Request) {
	var task Task

	err := json.NewDecoder(r.Body).Decode(&task)

	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	err = validateTask(task)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
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
	id, err := getIDFromURL(r)

	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = findTaskByID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	var task Task

	err = json.NewDecoder(r.Body).Decode(&task)

	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	err = validateTask(task)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	task.ID = id
	tasks[id] = task

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(task)
}

// Delete task by ID
func deleteTask(w http.ResponseWriter, r *http.Request) {
	id, err := getIDFromURL(r)

	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	_, err = findTaskByID(id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	delete(tasks, id)

	w.WriteHeader(http.StatusNoContent)
}

//----
// Helper functions
//----

// Validate task data
func validateTask(task Task) error {
	if task.Title == "" {
		return errors.New("Title is required")
	}

	if task.Status == "" {
		return errors.New("Status is required")
	}

	if task.Status != "todo" &&
		task.Status != "in_progress" &&
		task.Status != "done" {
		return errors.New("Invalid status")
	}

	return nil
}

// Find task by ID
func findTaskByID(id int) (Task, error) {
	task, exists := tasks[id]

	if !exists {
		return Task{}, errors.New("Task not found")
	}

	return task, nil
}

// Extract ID from URL
func getIDFromURL(r *http.Request) (int, error) {
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

// Configure CORS headers
func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
