import axios from 'axios'

// Types
export interface AnalyticsMetrics {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  activeOrders: number
  successRate: number
  revenueChange: number
  ordersChange: number
  usersChange: number
}

export interface RevenueTrendItem {
  month: string
  value: number
}

export interface ServiceDistributionItem {
  service: string
  count: number
  percentage: number
}

export interface TopPlanItem {
  name: string
  revenue: number
  count: number
}

export interface UserGrowthItem {
  month: string
  newUsers: number
}

export interface AnalyticsOverview {
  metrics: AnalyticsMetrics
  revenueTrend: RevenueTrendItem[]
  serviceDistribution: ServiceDistributionItem[]
  topPlans: TopPlanItem[]
  userGrowth: UserGrowthItem[]
}

export interface RecentActivityItem {
  id: string
  type: 'order' | 'user' | 'payment' | 'verification'
  message: string
  time: string
  timeAgo: string
  user: string
  userName: string
  company: string
  amount?: number
  status?: string
  orderId?: string
}

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Analytics API Error:', error.response?.data || error.message)
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

class AnalyticsApi {
  // Get analytics overview
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    console.log('Fetching analytics overview...')
    try {
      const response = await api.get('/analytics/overview')
      console.log('Analytics overview response:', response.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching analytics overview:', error)
      throw error
    }
  }

  // Get analytics by date range
  async getAnalyticsByDateRange(startDate: string, endDate: string): Promise<any[]> {
    const response = await api.get('/analytics/date-range', {
      params: { startDate, endDate }
    })
    return response.data.data
  }

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<RecentActivityItem[]> {
    console.log('Fetching recent activity...')
    try {
      const response = await api.get('/analytics/recent-activity', {
        params: { limit }
      })
      console.log('Recent activity response:', response.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      throw error
    }
  }
}

export default new AnalyticsApi() 