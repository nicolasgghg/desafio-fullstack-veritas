import type { Task } from "../types/Task";
import TaskItem from "./TaskItem";

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: number, status: Task["status"]) => void;
}

function KanbanColumn({ title, tasks, onDelete, onEdit, onStatusChange }: KanbanColumnProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-gray-900">{title}</h2>

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