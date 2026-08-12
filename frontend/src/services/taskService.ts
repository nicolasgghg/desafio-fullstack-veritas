import type { Task } from "../types/Task"

const API_URL = "http://localhost:8080"

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`)

  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return response.json()
}

export async function createTask(
  task: Omit<Task, "id">
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    throw new Error("Failed to create task")
  }

  return response.json()
}