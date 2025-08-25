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
    console.log("Searching for verification type:", verificationType);
    console.log("Available verifications:", availableVerifications);
    
    if (!availableVerifications) {
      console.log("No available verifications found");
      return undefined;
    }
    
    const found = availableVerifications.find(ver => 
      ver.verificationType?.toLowerCase() === verificationType.toLowerCase()
    );
    
    console.log("Found pricing:", found);
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

export const usePricingContext = () => {
  const context = useContext(PricingContext)
  if (context === undefined) {
    throw new Error('usePricingContext must be used within a PricingProvider')
  }
  return context
}