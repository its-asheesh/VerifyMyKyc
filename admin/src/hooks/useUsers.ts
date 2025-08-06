import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import userApi, { type User, type UpdateUserRoleData, type UserStats, type LocationAnalytics } from '../services/api/userApi'

// Get all users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAllUsers,
  })
}

// Get user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: userApi.getUserStats,
  })
}

// Get location analytics
export const useLocationAnalytics = () => {
  return useQuery({
    queryKey: ['locationAnalytics'],
    queryFn: userApi.getLocationAnalytics,
    retry: 1,
    retryDelay: 1000,
  })
}

// Get users with location data
export const useUsersWithLocation = () => {
  return useQuery({
    queryKey: ['usersWithLocation'],
    queryFn: userApi.getUsersWithLocation,
  })
}

// Update user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'user' | 'admin' }) =>
      userApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
    },
  })
}

// Toggle user status
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId: string) => userApi.toggleUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
    },
  })
}

// Update user location
export const useUpdateUserLocation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, locationData }: { 
      userId: string; 
      locationData: {
        country?: string
        city?: string
        region?: string
        timezone?: string
        ipAddress?: string
      }
    }) => userApi.updateUserLocation(userId, locationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['locationAnalytics'] })
    },
  })
} 