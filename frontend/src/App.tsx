import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import { deleteTask, getTasks, updateTask } from "./services/taskService";
import type { Task } from "./types/Task";
import Modal from "./components/Modal";
import KanbanColumn from "./components/KanbanColumn";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Derived lists: split tasks by status so each Kanban column
  // only receives the tasks it should render.
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  //----
  // Initial data fetch
  //----

  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error(error);
        setLoadError("Não foi possível carregar as tarefas.");
      } finally {
        setIsLoading(false);
      }
    }
    loadTasks();
  }, []);

  //----
  // Task handlers
  //----

  // Add the newly created task to local state (backend already assigned the id)
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

  // Quick status change from the task card (used to move tasks between columns).
  // The backend PUT replaces the whole task, so we send the full object
  // with only the status field changed.
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

  // Opens the modal in edit mode, pre-filling the form with the selected task
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

  //----
  // Render
  //----

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Tarefas</h1>

        <p className="mt-2 text-gray-600">Gerencie suas tarefas</p>
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

        {/* Kanban board: one column per task status, side by side on larger screens */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <KanbanColumn
            title="A Fazer"
            tasks={todoTasks}
            onDelete={handleTaskDeleted}
            onEdit={handleEditTask}
            onStatusChange={handleStatusChange}
          />
          <KanbanColumn
            title="Em Progresso"
            tasks={inProgressTasks}
            onDelete={handleTaskDeleted}
            onEdit={handleEditTask}
            onStatusChange={handleStatusChange}
          />
          <KanbanColumn
            title="Concluídas"
            tasks={doneTasks}
            onDelete={handleTaskDeleted}
            onEdit={handleEditTask}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </main>
  );
}

export default App;