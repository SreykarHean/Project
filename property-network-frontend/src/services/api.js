import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the server says the session is no longer valid (expired token,
// or a buyer who was banned mid-session), clear local auth and send
// them to login instead of leaving broken/blank pages behind.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      const message = error.response?.data?.message
      localStorage.removeItem('token')
      if (message) {
        alert(message)
      }
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api