import { useState } from 'react'

function TaskItem({ busyTask, task, onDelete, onToggle, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [isSaving, setIsSaving] = useState(false)
  const busyAction = busyTask?.id === task.id ? busyTask.action : null
  const isBusy = Boolean(busyAction)

  function handleCancel() {
    setTitle(task.title)
    setDescription(task.description || '')
    setIsEditing(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    setIsSaving(true)

    try {
      await onUpdate(task.id, {
        title: trimmedTitle,
        description: description.trim() || null,
        completed: task.completed,
      })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  if (isEditing) {
    return (
      <li className="task-item editing">
        <form className="edit-form" onSubmit={handleSubmit}>
          <input
            maxLength={100}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
          />
          <input
            maxLength={500}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
          />

          <div className="task-actions">
            <button disabled={isSaving || isBusy || !title.trim()} type="submit">
              {isSaving || busyAction === 'update' ? 'Saving...' : 'Save'}
            </button>
            <button
              className="secondary"
              disabled={isSaving || isBusy}
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h2>{task.title}</h2>
        {task.description && <p>{task.description}</p>}
      </div>

      <div className="task-actions">
        <button disabled={isBusy} onClick={() => setIsEditing(true)} type="button">
          Edit
        </button>
        <button disabled={isBusy} onClick={() => onToggle(task.id)} type="button">
          {busyAction === 'toggle'
            ? 'Updating...'
            : task.completed
              ? 'Mark Pending'
              : 'Mark Done'}
        </button>
        <button
          className="danger"
          disabled={isBusy}
          onClick={() => onDelete(task.id)}
          type="button"
        >
          {busyAction === 'delete' ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </li>
  )
}

export default TaskItem
