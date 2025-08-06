import { useQuery } from '@tanstack/react-query'
import analyticsApi from '../services/api/analyticsApi'
import type { AnalyticsOverview, RecentActivityItem } from '../services/api/analyticsApi'

// Hook to fetch analytics overview
export const useAnalyticsOverview = () => {
  return useQuery<AnalyticsOverview>({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      console.log('useAnalyticsOverview: Starting API call...')
      try {
        const result = await analyticsApi.getAnalyticsOverview()
        console.log('useAnalyticsOverview: API call successful:', result)
        return result
      } catch (error) {
        console.error('useAnalyticsOverview: API call failed:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: 1000,
  })
}

// Hook to fetch analytics by date range
export const useAnalyticsByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ['analytics', 'date-range', startDate, endDate],
    queryFn: () => analyticsApi.getAnalyticsByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch recent activity
export const useRecentActivity = (limit: number = 10) => {
  return useQuery<RecentActivityItem[]>({
    queryKey: ['analytics', 'recent-activity', limit],
    queryFn: async () => {
      console.log('useRecentActivity: Starting API call...')
      try {
        const result = await analyticsApi.getRecentActivity(limit)
        console.log('useRecentActivity: API call successful:', result)
        return result
      } catch (error) {
        console.error('useRecentActivity: API call failed:', error)
        throw error
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    retry: 3,
    retryDelay: 1000,
  })
} 