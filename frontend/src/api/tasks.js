import axios from 'axios'
const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTasks(completed = null) {
  const params = completed === null ? {} : { completed }
  const response = await axios.get(`${API_URL}/tasks/`, { params })
  return response.data
}

export async function createTask(task) {
  const response = await axios.post(`${API_URL}/tasks/`, task)
  return response.data
}

export async function updateTask(id, task) {
  const response = await axios.put(`${API_URL}/tasks/${id}`, task)
  return response.data
}

export async function deleteTask(id) {
  await axios.delete(`${API_URL}/${id}`)
}

export async function toggleTask(id) {
  const response = await axios.patch(`${API_URL}/tasks/${id}/toggle`)
  return response.data
}
