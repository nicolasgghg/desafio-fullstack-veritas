import TaskItem from "./components/TaskItem";

function App() {
  const tasks = [
    {
      id: 1,
      title: "Learn React",
      status: "todo",
    },
    {
      id: 2,
      title: "Build the API",
      status: "in_progress",
    },
    {
      id: 3,
      title: "Finish the project",
      status: "done",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>

        <p className="mt-2 text-gray-600">Manage your tasks</p>

        <div className="mt-8 space-y-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
