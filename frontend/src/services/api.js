import axios from 'axios'

const api = axios.create({
  baseURL: 'https://leavemanagement-ogne.onrender.com',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

// Leave services
export const leaveService = {
  applyLeave: (data) => api.post('/leaves', data),
  getMyLeaves: () => api.get('/leaves/my'),
  getAllLeaves: () => api.get('/leaves'),
  updateLeaveStatus: (id, status, rejectionReason) => api.patch(`/leaves/${id}`, { status, rejectionReason }),
}

export default api
