import { useState } from "react";
import { createTask } from "../services/taskService";

function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">("todo");
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        try {
          await createTask({
            title,
            description,
            status,
          });

          setTitle("");
          setDescription("");
          setStatus("todo");
        } catch (error) {
          console.error(error);
        }
      }}
      className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900">Create a new task</h2>

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

      <button
        type="submit"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Create Task
      </button>
    </form>
  );
}

export default TaskForm;
