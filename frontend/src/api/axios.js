import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

// Attach the JWT (stored in localStorage) to every request, as a fallback
// alongside the httpOnly cookie set by the backend on login/signup.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lumiframe_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
