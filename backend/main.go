package backend

import (
	"net/http"
)

func main() {

	//tasks route handlers
	http.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {

		switch r.Method {

		case http.MethodGet:
			getTasks(w, r)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Start server on port 8080
	http.ListenAndServe(":8080", nil)
}
