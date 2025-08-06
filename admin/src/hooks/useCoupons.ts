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
  })
}

// Get coupon by ID
export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: ['coupon', id],
    queryFn: () => couponApi.getCouponById(id),
    enabled: !!id,
  })
}

// Get coupon statistics
export const useCouponStats = () => {
  return useQuery({
    queryKey: ['couponStats'],
    queryFn: () => couponApi.getCouponStats(),
  })
}

// Create coupon mutation
export const useCreateCoupon = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CouponData) => couponApi.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      queryClient.invalidateQueries({ queryKey: ['couponStats'] })
    },
  })
}

// Update coupon mutation
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CouponData> }) =>
      couponApi.updateCoupon(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      queryClient.invalidateQueries({ queryKey: ['coupon', id] })
      queryClient.invalidateQueries({ queryKey: ['couponStats'] })
    },
  })
}

// Delete coupon mutation
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => couponApi.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      queryClient.invalidateQueries({ queryKey: ['couponStats'] })
    },
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