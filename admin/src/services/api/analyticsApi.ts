import BaseApi from './baseApi'

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

export interface AnalyticsDateRangeResponse {
  dateRange: {
    startDate: string
    endDate: string
  }
  metrics: {
    totalRevenue: number
    totalOrders: number
    completedOrders: number
    pendingOrders: number
    activeOrders: number
    expiredOrders: number
    failedOrders: number
    successRate: number
  }
  revenueTrend: RevenueTrendItem[]
  serviceDistribution: ServiceDistributionItem[]
}

class AnalyticsApi extends BaseApi {
  // Get analytics overview
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    console.log('Fetching analytics overview...')
    try {
      const response = await this.get<any>('/analytics/overview')
      console.log('Analytics overview response:', response)
      return response.data
    } catch (error) {
      console.error('Error fetching analytics overview:', error)
      throw error
    }
  }

  // Get analytics by date range
  async getAnalyticsByDateRange(startDate: string, endDate: string): Promise<AnalyticsDateRangeResponse> {
    const response = await this.get<any>('/analytics/date-range', {
      params: { startDate, endDate }
    })
    return response.data
  }

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<RecentActivityItem[]> {
    console.log('Fetching recent activity...')
    try {
      const response = await this.get<any>('/analytics/recent-activity', {
        params: { limit }
      })
      console.log('Recent activity response:', response)
      return response.data
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      throw error
    }
  }
}

export default new AnalyticsApi() 