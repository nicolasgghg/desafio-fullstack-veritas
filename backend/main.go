package main

import (
	"net/http"
)

func main() {

	// Tasks routes
	http.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {

		enableCORS(w)

		switch r.Method {

		case http.MethodGet:
			getTasks(w, r)

		case http.MethodPost:
			createTask(w, r)

		case http.MethodOptions:
			w.WriteHeader(http.StatusNoContent)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/tasks/", func(w http.ResponseWriter, r *http.Request) {

		enableCORS(w)

		switch r.Method {

		case http.MethodPut:
			updateTask(w, r)

		case http.MethodDelete:
			deleteTask(w, r)

		case http.MethodGet:
			getTask(w, r)

		case http.MethodOptions:
			w.WriteHeader(http.StatusNoContent)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Start server on port 8080
	http.ListenAndServe(":8080", nil)
}
