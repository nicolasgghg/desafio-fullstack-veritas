import type { Task } from "../types/Task";

interface TaskItemProps {
  task: Task;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

function TaskItem({ task, onDelete, onEdit }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="font-semibold text-gray-900">{task.title}</h2>

        <p className="mt-1 text-sm text-gray-600">{task.description}</p>

        <span className="mt-2 inline-block text-sm text-gray-500">
          {task.status}
        </span>
      </div>
      <div className="flex gap-2">
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
      </div>
    </div>
  );
}

export default TaskItem;
