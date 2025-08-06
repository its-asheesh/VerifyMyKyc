import React, { createContext, useContext } from "react"
import { useHomepagePricing, useHomepagePlansByPeriod, useAvailableVerifications, useVerificationPricing } from "../hooks/usePricing"
import type { HomepagePlan, VerificationPricing } from "../hooks/usePricing"

interface PricingContextType {
  // Homepage pricing
  homepagePlans: HomepagePlan[] | undefined
  homepageLoading: boolean
  homepageError: any
  
  // Available verifications for custom selection
  availableVerifications: VerificationPricing[] | undefined
  verificationsLoading: boolean
  verificationsError: any
  
  // Helper functions
  getHomepagePlanByType: (planType: 'monthly' | 'yearly') => HomepagePlan | undefined
  getHomepagePlansByPeriod: (period: 'monthly' | 'yearly') => HomepagePlan[] | undefined
  getVerificationPricingByType: (verificationType: string) => VerificationPricing | undefined
  getVerificationPricing: (verificationType: string) => {
    data: VerificationPricing | undefined
    isLoading: boolean
    error: any
  }
}

const PricingContext = createContext<PricingContextType | undefined>(undefined)

export const PricingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Homepage pricing (monthly/yearly plans)
  const { 
    data: homepagePlans, 
    isLoading: homepageLoading, 
    error: homepageError 
  } = useHomepagePricing()

  // Available verifications for custom selection
  const { 
    data: availableVerifications, 
    isLoading: verificationsLoading, 
    error: verificationsError 
  } = useAvailableVerifications()

  // Helper function to get homepage plan by type
  const getHomepagePlanByType = (planType: 'monthly' | 'yearly'): HomepagePlan | undefined => {
    return homepagePlans?.find(plan => plan.planType === planType)
  }

  // Helper function to get homepage plans by billing period
  const getHomepagePlansByPeriod = (period: 'monthly' | 'yearly'): HomepagePlan[] | undefined => {
    return homepagePlans?.filter(plan => plan.planType === period)
  }

  // Helper function to get verification pricing by type - This needs to be fixed
  // We can't use availableVerifications because it doesn't include features
  // Instead, we'll need to use the useVerificationPricing hook directly in components
  const getVerificationPricingByType = (verificationType: string): VerificationPricing | undefined => {
    // This function is deprecated - use getVerificationPricing instead
    console.warn('getVerificationPricingByType is deprecated. Use getVerificationPricing instead.')
    return undefined
  }

  // Helper function to get verification pricing with loading state
  const getVerificationPricing = (verificationType: string) => {
    const { data, isLoading, error } = useVerificationPricing(verificationType)
    return { data, isLoading, error }
  }

  return (
    <PricingContext.Provider value={{
      // Homepage pricing
      homepagePlans,
      homepageLoading,
      homepageError,
      
      // Available verifications
      availableVerifications,
      verificationsLoading,
      verificationsError,
      
      // Helper functions
      getHomepagePlanByType,
      getHomepagePlansByPeriod,
      getVerificationPricingByType,
      getVerificationPricing
    }}>
      {children}
    </PricingContext.Provider>
  )
}

export const usePricingContext = () => {
  const context = useContext(PricingContext)
  if (context === undefined) {
    throw new Error('usePricingContext must be used within a PricingProvider')
  }
  return context
} 