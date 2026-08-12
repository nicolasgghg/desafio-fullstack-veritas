import type { Task } from "../types/Task"

const API_URL = "http://localhost:8080"

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`)

  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return response.json()
}