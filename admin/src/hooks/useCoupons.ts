import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import couponApi from '../services/api/couponApi'
import type { CouponData } from '../services/api/couponApi'

// Get all coupons
export const useCoupons = (params?: {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'expired'
}) => {
  return useQuery({
    queryKey: ['coupons', params],
    queryFn: () => couponApi.getAllCoupons(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  })
}

// Get coupon by ID
export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: ['coupon', id],
    queryFn: () => couponApi.getCouponById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  })
}

// Get coupon statistics
export const useCouponStats = () => {
  return useQuery({
    queryKey: ['couponStats'],
    queryFn: () => couponApi.getCouponStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  })
}

// Create coupon mutation
export const useCreateCoupon = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CouponData) => couponApi.createCoupon(data),
    onSuccess: async () => {
      // Invalidate and refetch to ensure fresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['coupons'] }),
        queryClient.invalidateQueries({ queryKey: ['couponStats'] })
      ])
      // Force refetch to ensure UI updates immediately
      await queryClient.refetchQueries({ queryKey: ['coupons'] })
      await queryClient.refetchQueries({ queryKey: ['couponStats'] })
    },
    onError: (error) => {
      console.error('Failed to create coupon:', error)
    },
    retry: 1,
  })
}

// Update coupon mutation
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CouponData> }) =>
      couponApi.updateCoupon(id, data),
    onSuccess: async (_, { id }) => {
      // Invalidate and refetch to ensure fresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['coupons'] }),
        queryClient.invalidateQueries({ queryKey: ['coupon', id] }),
        queryClient.invalidateQueries({ queryKey: ['couponStats'] })
      ])
      // Force refetch to ensure UI updates immediately
      await queryClient.refetchQueries({ queryKey: ['coupons'] })
      await queryClient.refetchQueries({ queryKey: ['coupon', id] })
      await queryClient.refetchQueries({ queryKey: ['couponStats'] })
    },
    onError: (error) => {
      console.error('Failed to update coupon:', error)
    },
    retry: 1,
  })
}

// Delete coupon mutation
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => couponApi.deleteCoupon(id),
    onSuccess: async () => {
      // Invalidate and refetch to ensure fresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['coupons'] }),
        queryClient.invalidateQueries({ queryKey: ['couponStats'] })
      ])
      // Force refetch to ensure UI updates immediately
      await queryClient.refetchQueries({ queryKey: ['coupons'] })
      await queryClient.refetchQueries({ queryKey: ['couponStats'] })
    },
    onError: (error) => {
      console.error('Failed to delete coupon:', error)
    },
    retry: 1,
  })
}

// Generate coupon codes mutation
export const useGenerateCouponCodes = () => {
  return useMutation({
    mutationFn: (params: { count: number; prefix?: string; length?: number }) =>
      couponApi.generateCouponCodes(params),
  })
}

// Validate coupon mutation
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (params: { code: string; orderAmount: number; userId?: string }) =>
      couponApi.validateCoupon(params.code, params.orderAmount, params.userId),
  })
} 