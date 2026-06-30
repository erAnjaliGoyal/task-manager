import { useState } from 'react'

function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      return
    }

    setIsSubmitting(true)

    try {
      await onCreate({
        title: trimmedTitle,
        description: trimmedDescription || null,
      })
      setTitle('')
      setDescription('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
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
      <button disabled={isSubmitting || !title.trim()} type="submit">
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  )
}

export default TaskForm
