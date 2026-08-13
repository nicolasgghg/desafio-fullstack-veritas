import type { Task } from "../types/Task";

// URL backend.
const API_URL = "http://localhost:8080";

//----
// Helpers
//----

async function extractErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const text = await response.text();
    return text || fallback;
  } catch {
    return fallback;
  }
}

//----
// Task requests
//----

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      "Failed to fetch tasks",
    );
    throw new Error(message);
  }

  return response.json();
}

export async function createTask(task: Omit<Task, "id">): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      "Failed to create task",
    );
    throw new Error(message);
  }

  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      "Failed to delete task",
    );
    throw new Error(message);
  }
}

export async function updateTask(
  id: number,
  task: Omit<Task, "id">,
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      "Failed to update task",
    );
    throw new Error(message);
  }

  return response.json();
}
