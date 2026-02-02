// src/hooks/usePricing.ts
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

// Legacy interface for backward compatibility
export interface PricingItem {
  _id: string
  component: string
  monthlyPrice: number
  yearlyPrice: number
  customPrice?: number
  title?: string
  description?: string
  features?: string[]
  highlighted?: boolean
  popular?: boolean
  color?: 'blue' | 'purple' | 'green'
}

// New interfaces for the updated pricing system
export interface HomepagePlan {
  _id: string
  planType: 'monthly' | 'yearly'
  planName: 'Personal' | 'Professional' | 'Business'
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
  popular?: boolean
  color?: string
  includesVerifications: string[]
  createdAt: string
  updatedAt: string
}

export interface VerificationPricing {
  _id: string
  verificationType: string // 'aadhaar', 'pan', 'drivinglicense', 'gstin'
  monthlyPrice: number
  yearlyPrice: number
  oneTimePrice: number
  title?: string
  description?: string
  // Separate features for each pricing tier
  oneTimeFeatures?: string[]
  monthlyFeatures?: string[]
  yearlyFeatures?: string[]
  // Per-tier quotas (as defined by admin)
  oneTimeQuota?: { count?: number; validityDays?: number }
  monthlyQuota?: { count?: number; validityDays?: number }
  yearlyQuota?: { count?: number; validityDays?: number }
  highlighted?: boolean
  popular?: boolean
  color?: string
  createdAt: string
  updatedAt: string
}

export interface AllPricingData {
  verificationPricing: VerificationPricing[]
  homepagePlans: HomepagePlan[]
}

// Hook for getting all pricing data
export const useAllPricing = () => {
  return useQuery<AllPricingData>({
    queryKey: ['all-pricing'],
    queryFn: async (): Promise<AllPricingData> => {
      const res = await axios.get('/api/pricing')
      return res.data as AllPricingData
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for getting homepage pricing (monthly/yearly plans)
export const useHomepagePricing = () => {
  return useQuery<HomepagePlan[]>({
    queryKey: ['homepage-pricing'],
    queryFn: async (): Promise<HomepagePlan[]> => {
      const res = await axios.get('/api/pricing/homepage-pricing')
      return res.data as HomepagePlan[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for getting homepage plans by billing period
export const useHomepagePlansByPeriod = (period: 'monthly' | 'yearly') => {
  return useQuery<HomepagePlan[]>({
    queryKey: ['homepage-pricing', period],
    queryFn: async (): Promise<HomepagePlan[]> => {
      const res = await axios.get(`/api/pricing/homepage-pricing/${period}`)
      return res.data as HomepagePlan[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!period,
  })
}

// Hook for getting available verifications (for custom selection)
export const useAvailableVerifications = () => {
  return useQuery<VerificationPricing[]>({
    queryKey: ['available-verifications'],
    queryFn: async (): Promise<VerificationPricing[]> => {
      const res = await axios.get('/api/pricing/available-verifications')
      return res.data as VerificationPricing[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for getting specific verification pricing
export const useVerificationPricing = (verificationType: string) => {
  return useQuery<VerificationPricing>({
    queryKey: ['verification-pricing', verificationType],
    queryFn: async (): Promise<VerificationPricing> => {

      const res = await axios.get(`/api/pricing/verification/${verificationType}`)

      return res.data as VerificationPricing
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!verificationType,
  })
}

// Legacy hook for backward compatibility
export const usePricing = () => {
  return useQuery<PricingItem[]>({
    queryKey: ['pricing'],
    queryFn: async (): Promise<PricingItem[]> => {
      const res = await axios.get('/api/pricing')
      return res.data as PricingItem[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}