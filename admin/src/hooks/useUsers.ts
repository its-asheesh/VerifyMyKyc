import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import userApi from '../services/api/userApi'
import type { User, UserStats, LocationAnalytics } from '../services/api/userApi'

// Get all users
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => userApi.getAllUsers(),
  })
}

// Get user statistics
export const useUserStats = () => {
  return useQuery<UserStats>({
    queryKey: ['userStats'],
    queryFn: () => userApi.getUserStats(),
  })
}

// Get location analytics
export const useLocationAnalytics = () => {
  return useQuery<LocationAnalytics>({
    queryKey: ['locationAnalytics'],
    queryFn: () => userApi.getLocationAnalytics(),
    retry: 1,
    retryDelay: 1000,
  })
}

// Get users with location data
export const useUsersWithLocation = () => {
  return useQuery<User[]>({
    queryKey: ['usersWithLocation'],
    queryFn: () => userApi.getUsersWithLocation(),
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

// Verify user email
export const useVerifyUserEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => userApi.verifyUserEmail(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
    },
  })
}

// Verify user phone
export const useVerifyUserPhone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => userApi.verifyUserPhone(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
    },
  })
}

// Add tokens for user
export const useAddUserTokens = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: {
      userId: string
      data: {
        verificationType: string
        numberOfTokens: number
        validityDays: number
      }
    }) => userApi.addUserTokens(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
    },
  })
} 