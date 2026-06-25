import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Endpoints where a 401 means "your input was wrong" rather than "your session is invalid"
const SKIP_AUTO_LOGOUT_ON_401 = ['/mentor/me/password']

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || ''
    const skipLogout = SKIP_AUTO_LOGOUT_ON_401.some((path) => url.includes(path))
    if (err.response?.status === 401 && !skipLogout) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(err)
  }
)