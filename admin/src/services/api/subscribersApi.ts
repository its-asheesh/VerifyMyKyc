import axios from 'axios'

export interface Subscriber {
  _id: string
  email: string
  createdAt: string
  updatedAt: string
}

// Shape returned by backend controller
export interface SubscribersResponse {
  success: boolean
  data: Subscriber[]
  pagination: {
    total: number
    page: number
    totalPages: number
  }
}

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach admin token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getSubscribers = async (
  page = 1,
  limit = 10
): Promise<SubscribersResponse> => {
  const response = await api.get('/subscribers', { params: { page, limit } })
  return response.data
}

export const deleteSubscriber = async (id: string): Promise<void> => {
  await api.delete(`/subscribers/${id}`)
}

export const exportSubscribers = async (
  format: 'excel' | 'csv' | 'json'
): Promise<void> => {
  const response = await api.get('/subscribers/export', {
    params: { format },
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  const extension = format === 'excel' ? 'xlsx' : format === 'csv' ? 'csv' : 'json'
  const filename = `subscribers.${extension}`

  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()

  link.remove()
  window.URL.revokeObjectURL(url)
}
