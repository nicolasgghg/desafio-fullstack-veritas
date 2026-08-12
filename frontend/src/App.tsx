import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import { deleteTask, getTasks } from "./services/taskService";
import type { Task } from "./types/Task";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadTasks();
  }, []);

  function handleTaskCreated(task: Task) {
    setTasks((currentTasks) => [...currentTasks, task]);
  }

  async function handleTaskDeleted(id: number) {
    try {
      await deleteTask(id);

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditTask(task: Task) {
    setTaskToEdit(task);
  }

  function handleTaskUpdated(task: Task) {
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id ? task : currentTask,
      ),
    );

    setTaskToEdit(undefined);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>

        <p className="mt-2 text-gray-600">Manage your tasks</p>

        <TaskForm
          onTaskCreated={handleTaskCreated}
          taskToEdit={taskToEdit}
          onTaskUpdated={handleTaskUpdated}
        />

        <div className="mt-8 space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleTaskDeleted}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
