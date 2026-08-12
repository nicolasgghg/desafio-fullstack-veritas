import type { Task } from "../types/Task";

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="font-semibold text-gray-900">{task.title}</h2>

        <p className="mt-1 text-sm text-gray-600">{task.description}</p>

        <span className="mt-2 inline-block text-sm text-gray-500">
          {task.status}
        </span>
      </div>
    </div>
  );
}

export default TaskItem;
