import type { Task } from "../types/Task";

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: number, status: Task["status"]) => void;
}

function TaskItem({ task, onDelete, onEdit, onStatusChange }: TaskItemProps) {
  return (
    <div className="flex min-w-0 items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="min-w-0 flex-1">
        <h2 className="break-words font-semibold text-gray-900">
          {task.title}
        </h2>

        <p className="mt-1 break-words text-sm text-gray-600">
          {task.description}
        </p>
      </div>

      <div className="ml-4 flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete
        </button>

        {/* Quick status change without opening the modal — lets the user
            move a task between columns directly from the card. */}
        <select
          value={task.status}
          onChange={(event) =>
            onStatusChange(task.id, event.target.value as Task["status"])
          }
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}

export default TaskItem;
