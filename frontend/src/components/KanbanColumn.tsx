import type { Task } from "../types/Task";
import TaskItem from "./TaskItem";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: number, status: Task["status"]) => void;
}

// Renders one Kanban column (e.g. "To Do") with its list of tasks.
// Used once per status in App.tsx to avoid repeating the same section markup.
function KanbanColumn({
  title,
  tasks,
  onDelete,
  onEdit,
  onStatusChange,
}: KanbanColumnProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        {title}{" "}
        <span className="text-sm font-normal text-gray-500">
          ({tasks.length})
        </span>
      </h2>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </section>
  );
}

export default KanbanColumn;
