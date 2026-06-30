import { useEffect, useState } from 'react'
import './App.css'
import {
  createTask,
  deleteTask,
  getTasks,
  toggleTask,
  updateTask,
} from './api/tasks'
import StatusFilter from './components/StatusFilter'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

function getApiErrorMessage(error, fallbackMessage) {
  const detail = error.response?.data?.detail

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(' ')
  }

  if (typeof detail === 'string') {
    return detail
  }

  return fallbackMessage
}

function App() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [busyTask, setBusyTask] = useState(null)
  const [refreshVersion, setRefreshVersion] = useState(0)

  useEffect(() => {
    let shouldUpdateState = true

    async function loadTasks() {
      setIsLoading(true)
      setError('')

      try {
        const data = await getTasks(filter)

        if (shouldUpdateState) {
          setTasks(data)
        }
      } catch (requestError) {
        if (shouldUpdateState) {
          setError(
            getApiErrorMessage(
              requestError,
              'Could not load tasks. Check that the backend is running.',
            ),
          )
        }
      } finally {
        if (shouldUpdateState) {
          setIsLoading(false)
        }
      }
    }

    loadTasks()

    return () => {
      shouldUpdateState = false
    }
  }, [filter, refreshVersion])

  function refreshTasks() {
    setRefreshVersion((currentVersion) => currentVersion + 1)
  }

  async function handleCreate(task) {
    setError('')

    try {
      await createTask(task)
      refreshTasks()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not create task.'))
    }
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm('Delete this task?')

    if (!shouldDelete) {
      return
    }

    setError('')
    setBusyTask({ id, action: 'delete' })

    try {
      await deleteTask(id)
      refreshTasks()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not delete task.'))
    } finally {
      setBusyTask(null)
    }
  }

  async function handleToggle(id) {
    setError('')
    setBusyTask({ id, action: 'toggle' })

    try {
      await toggleTask(id)
      refreshTasks()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not update task.'))
    } finally {
      setBusyTask(null)
    }
  }

  async function handleUpdate(id, task) {
    setError('')
    setBusyTask({ id, action: 'update' })

    try {
      await updateTask(id, task)
      refreshTasks()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Could not save task.'))
      throw requestError
    } finally {
      setBusyTask(null)
    }
  }

  return (
    <main className="app">
      <section className="app-card">
        <header className="app-header">
          <p className="eyebrow">FastAPI + React</p>
          <h1>Task Manager</h1>
          <p>Create, filter, complete, and delete tasks.</p>
        </header>

        <TaskForm onCreate={handleCreate} />
        <StatusFilter filter={filter} onChange={setFilter} />

        {error && <p className="error">{error}</p>}
        {isLoading ? (
          <p className="empty-state">Loading tasks...</p>
        ) : (
          <TaskList
            busyTask={busyTask}
            filter={filter}
            tasks={tasks}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
          />
        )}
      </section>
    </main>
  )
}

export default App
