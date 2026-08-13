import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import { deleteTask, getTasks, updateTask } from "./services/taskService";
import type { Task } from "./types/Task";
import Modal from "./components/Modal";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error(error);
        setLoadError("Is not possible loading tasks.");
      } finally {
        setIsLoading(false);
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

  async function handleStatusChange(id: number, status: Task["status"]) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const updated = await updateTask(id, { ...task, status });
      setTasks((current) => current.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditTask(task: Task) {
    setTaskToEdit(task);
    setIsModalOpen(true);
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
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>

        <p className="mt-2 text-gray-600">Manage your tasks</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Nova tarefa
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTaskToEdit(undefined);
          }}
        >
          <TaskForm
            onTaskCreated={(task) => {
              handleTaskCreated(task);
              setIsModalOpen(false);
            }}
            taskToEdit={taskToEdit}
            onTaskUpdated={(task) => {
              handleTaskUpdated(task);
              setIsModalOpen(false);
            }}
            onCancel={() => {
              setIsModalOpen(false);
              setTaskToEdit(undefined);
            }}
          />
        </Modal>

        {isLoading && (
          <p className="mt-4 text-sm text-gray-500">Carregando tarefas...</p>
        )}

        {loadError && <p className="mt-4 text-sm text-red-600">{loadError}</p>}
        
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">To Do</h2>

            <div className="space-y-3">
              {todoTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={handleTaskDeleted}
                  onEdit={handleEditTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              In Progress
            </h2>

            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={handleTaskDeleted}
                  onEdit={handleEditTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Done</h2>

            <div className="space-y-3">
              {doneTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onDelete={handleTaskDeleted}
                  onEdit={handleEditTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
