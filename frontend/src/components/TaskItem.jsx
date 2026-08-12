function TaskItem({ task }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="font-semibold text-gray-900">
          {task.title}
        </h2>

        <span className="text-sm text-gray-500">
          {task.status}
        </span>
      </div>
    </div>
  )
}

export default TaskItem