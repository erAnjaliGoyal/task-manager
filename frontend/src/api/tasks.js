import axios from 'axios'

const API_URL = 'http://localhost:8000/tasks'

export async function getTasks(completed = null) {
  const params = completed === null ? {} : { completed }
  const response = await axios.get(`${API_URL}/`, { params })
  return response.data
}

export async function createTask(task) {
  const response = await axios.post(`${API_URL}/`, task)
  return response.data
}

export async function updateTask(id, task) {
  const response = await axios.put(`${API_URL}/${id}`, task)
  return response.data
}

export async function deleteTask(id) {
  await axios.delete(`${API_URL}/${id}`)
}

export async function toggleTask(id) {
  const response = await axios.patch(`${API_URL}/${id}/toggle`)
  return response.data
}
