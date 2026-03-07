import { ref, computed } from 'vue'
import { authService } from './api.js'

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const token = ref(localStorage.getItem('token') || null)

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isEmployee = computed(() => user.value?.role === 'employee')
  const isEmployer = computed(() => user.value?.role === 'employer')

  const setAuth = (data) => {
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const login = async (credentials) => {
    const response = await authService.login(credentials)
    setAuth(response.data)
    return response.data
  }

  const register = async (userData) => {
    const response = await authService.register(userData)
    setAuth(response.data)
    return response.data
  }

  const logout = () => {
    clearAuth()
  }

  return {
    user,
    token,
    isLoggedIn,
    isEmployee,
    isEmployer,
    login,
    register,
    logout,
  }
}
