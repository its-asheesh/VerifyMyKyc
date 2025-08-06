import axios from 'axios'

// Types
export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  company?: string
  phone?: string
  avatar?: string
  isActive: boolean
  lastLogin?: string
  emailVerified: boolean
  location?: {
    country?: string
    city?: string
    region?: string
    timezone?: string
    ipAddress?: string
  }
  createdAt: string
  updatedAt: string
}

export interface UpdateUserRoleData {
  role: 'user' | 'admin'
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  adminUsers: number
  regularUsers: number
  newUsersThisMonth: number
}

export interface LocationStats {
  country: string
  userCount: number
  cityCount: number
  regionCount: number
  cities: string[]
  regions: string[]
}

export interface TopCity {
  _id: string
  count: number
  country: string
}

export interface LocationAnalytics {
  locationStats: LocationStats[]
  totalUsersWithLocation: number
  topCities: TopCity[]
  recentLocationActivity: Array<{
    _id: {
      country: string
      date: string
    }
    count: number
  }>
}

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle 401 errors
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

class UserApi {
  async getAllUsers(): Promise<User[]> {
    return api.get('/auth/users').then(res => res.data.data.users)
  }

  async getUserStats(): Promise<UserStats> {
    return api.get('/auth/users/stats').then(res => res.data.data)
  }

  async getLocationAnalytics(): Promise<LocationAnalytics> {
    return api.get('/auth/users/location-analytics').then(res => res.data.data)
  }

  async getUsersWithLocation(): Promise<User[]> {
    return api.get('/auth/users/with-location').then(res => res.data.data.users)
  }

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    return api.put(`/auth/users/${userId}/role`, { role }).then(res => res.data.data.user)
  }

  async toggleUserStatus(userId: string): Promise<User> {
    return api.put(`/auth/users/${userId}/toggle-status`).then(res => res.data.data.user)
  }

  async updateUserLocation(userId: string, locationData: {
    country?: string
    city?: string
    region?: string
    timezone?: string
    ipAddress?: string
  }): Promise<User> {
    return api.put(`/auth/users/${userId}/location`, locationData).then(res => res.data.data.user)
  }
}

export default new UserApi() 