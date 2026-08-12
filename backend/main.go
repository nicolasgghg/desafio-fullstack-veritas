package backend

import (
	"net/http"
)

func main() {

	// Tasks routes
	http.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {

		switch r.Method {

		case http.MethodGet:
			getTasks(w, r)

		case http.MethodPost:
			createTask(w, r)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/tasks/", func(w http.ResponseWriter, r *http.Request) {

		switch r.Method {

		case http.MethodPut:
			updateTask(w, r)

		case http.MethodDelete:
			deleteTask(w, r)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Start server on port 8080
	http.ListenAndServe(":8080", nil)
}
