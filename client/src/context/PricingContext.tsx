import React, { createContext, useContext } from "react"
import { useHomepagePricing, useAvailableVerifications } from "../hooks/usePricing"
import type { HomepagePlan, VerificationPricing } from "../hooks/usePricing"

interface PricingContextType {
  // Homepage pricing
  homepagePlans: HomepagePlan[] | undefined
  homepageLoading: boolean
  homepageError: unknown

  // Available verifications for custom selection
  availableVerifications: VerificationPricing[] | undefined
  verificationsLoading: boolean
  verificationsError: unknown

  // Helper functions
  getHomepagePlanByType: (planType: 'monthly' | 'yearly') => HomepagePlan | undefined
  getHomepagePlansByPeriod: (period: 'monthly' | 'yearly') => HomepagePlan[] | undefined
  getVerificationPricingByType: (verificationType: string) => VerificationPricing | undefined
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

  // FIXED: Proper implementation to find verification pricing by type
  const getVerificationPricingByType = (verificationType: string): VerificationPricing | undefined => {


    if (!availableVerifications) {

      return undefined;
    }

    const found = availableVerifications.find(ver =>
      ver.verificationType?.toLowerCase() === verificationType.toLowerCase()
    );


    return found;
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
      getVerificationPricingByType
    }}>
      {children}
    </PricingContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePricingContext = () => {
  const context = useContext(PricingContext)
  if (context === undefined) {
    throw new Error('usePricingContext must be used within a PricingProvider')
  }
  return context
}