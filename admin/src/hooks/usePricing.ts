import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import pricingApi from '../services/api/pricingApi'
import type { VerificationPricing, HomepagePlan } from '../services/api/pricingApi'

// ==================== VERIFICATION PRICING HOOKS ====================

export const useVerificationPricing = () => {
  return useQuery({
    queryKey: ['verification-pricing'],
    queryFn: pricingApi.getAllVerificationPricing,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useVerificationPricingByType = (verificationType: string) => {
  return useQuery({
    queryKey: ['verification-pricing', verificationType],
    queryFn: () => pricingApi.getVerificationPricingByType(verificationType),
    enabled: !!verificationType,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAddVerificationPricing = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Omit<VerificationPricing, '_id' | 'createdAt' | 'updatedAt'>) =>
      pricingApi.addVerificationPricing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verification-pricing'] })
      queryClient.invalidateQueries({ queryKey: ['all-pricing'] })
    },
  })
}

export const useEditVerificationPricing = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VerificationPricing> }) =>
      pricingApi.editVerificationPricing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verification-pricing'] })
      queryClient.invalidateQueries({ queryKey: ['all-pricing'] })
    },
  })
}

export const useDeleteVerificationPricing = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => pricingApi.deleteVerificationPricing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verification-pricing'] })
      queryClient.invalidateQueries({ queryKey: ['all-pricing'] })
    },
  })
}

// ==================== HOMEPAGE PLANS HOOKS ====================

export const useHomepagePlans = () => {
  return useQuery({
    queryKey: ['homepage-plans'],
    queryFn: pricingApi.getAllHomepagePlans,
    staleTime: 5 * 60 * 1000,
  })
}

export const useHomepagePlanByType = (planType: string) => {
  return useQuery({
    queryKey: ['homepage-plans', planType],
    queryFn: () => pricingApi.getHomepagePlanByType(planType),
    enabled: !!planType,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAddHomepagePlan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Omit<HomepagePlan, '_id' | 'createdAt' | 'updatedAt'>) =>
      pricingApi.addHomepagePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-plans'] })
      queryClient.invalidateQueries({ queryKey: ['all-pricing'] })
    },
  })
}

export const useEditHomepagePlan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HomepagePlan> }) =>
      pricingApi.editHomepagePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-plans'] })
      queryClient.invalidateQueries({ queryKey: ['all-pricing'] })
    },
  })
}

export const useDeleteHomepagePlan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => pricingApi.deleteHomepagePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-plans'] })
      queryClient.invalidateQueries({ queryKey: ['all-pricing'] })
    },
  })
}

// ==================== COMBINED HOOKS ====================

export const useAllPricing = () => {
  return useQuery({
    queryKey: ['all-pricing'],
    queryFn: pricingApi.getAllPricing,
    staleTime: 5 * 60 * 1000,
  })
}

export const useHomepagePricing = () => {
  return useQuery({
    queryKey: ['homepage-pricing'],
    queryFn: pricingApi.getHomepagePricing,
    staleTime: 5 * 60 * 1000,
  })
}

export const useHomepagePlansByPeriod = (period: 'monthly' | 'yearly') => {
  return useQuery({
    queryKey: ['homepage-pricing', period],
    queryFn: () => pricingApi.getHomepagePlansByPeriod(period),
    enabled: !!period,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAvailableVerifications = () => {
  return useQuery({
    queryKey: ['available-verifications'],
    queryFn: pricingApi.getAvailableVerifications,
    staleTime: 5 * 60 * 1000,
  })
} 