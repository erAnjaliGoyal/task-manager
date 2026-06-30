import TaskItem from './TaskItem'

function getEmptyMessage(filter) {
  if (filter === true) {
    return 'No completed tasks yet.'
  }

  if (filter === false) {
    return 'No pending tasks. Everything is done.'
  }

  return 'No tasks yet. Add your first task above.'
}

function TaskList({ busyTask, filter, tasks, onDelete, onToggle, onUpdate }) {
  if (tasks.length === 0) {
    return <p className="empty-state">{getEmptyMessage(filter)}</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          busyTask={busyTask}
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  )
}

export default TaskList
