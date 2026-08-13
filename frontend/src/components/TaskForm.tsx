import { useEffect, useState } from "react";
import { createTask, updateTask } from "../services/taskService";
import type { Task } from "../types/Task";

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
  taskToEdit?: Task;
  onTaskUpdated: (task: Task) => void;
  onCancel: () => void;
}

function TaskForm({
  onTaskCreated,
  taskToEdit,
  onTaskUpdated,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">("todo");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fills the form when editing an existing task
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
    }
  }, [taskToEdit]);

  //----
  // Helpers
  //----

  function resetForm() {
    setTitle("");
    setDescription("");
    setStatus("todo");
  }

  //----
  // Submit handler
  //----

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);

      if (taskToEdit) {
        const updatedTask = await updateTask(taskToEdit.id, {
          title,
          description,
          status,
        });

        onTaskUpdated(updatedTask);
      } else {
        const newTask = await createTask({
          title,
          description,
          status,
        });

        onTaskCreated(newTask);
      }

      resetForm();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900">
        {taskToEdit ? "Edit task" : "Create a new task"}
      </h2>

      <div className="mt-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter task description"
          rows={4}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>

        <select
          id="status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as "todo" | "in_progress" | "done")
          }
          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          {loading ? "Saving..." : taskToEdit ? "Update Task" : "Create Task"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
