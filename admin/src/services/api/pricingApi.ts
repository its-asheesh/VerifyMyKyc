import BaseApi from './baseApi'

// Types matching backend models
export interface VerificationPricing {
  _id: string
  verificationType: string
  monthlyPrice: number
  yearlyPrice: number
  oneTimePrice: number
  title?: string
  description?: string
  // Separate features for each pricing tier
  oneTimeFeatures?: string[]
  monthlyFeatures?: string[]
  yearlyFeatures?: string[]
  // Per-tier verification quotas
  oneTimeQuota?: { count: number; validityDays: number }
  monthlyQuota?: { count: number; validityDays: number }
  yearlyQuota?: { count: number; validityDays: number }
  highlighted?: boolean
  popular?: boolean
  color?: string
  createdAt: string
  updatedAt: string
}

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

export interface AllPricingData {
  verificationPricing: VerificationPricing[]
  homepagePlans: HomepagePlan[]
}

class PricingApi extends BaseApi {
  // ==================== VERIFICATION PRICING ====================

  // Get all verification pricing
  async getAllVerificationPricing(): Promise<VerificationPricing[]> {
    console.log('Fetching verification pricing...')
    const response = await this.get<any>('/pricing/verification')
    console.log('Verification pricing response:', response)
    return response
  }

  // Get verification pricing by type
  async getVerificationPricingByType(verificationType: string): Promise<VerificationPricing> {
    const response = await this.get<any>(`/pricing/verification/${verificationType}`)
    return response
  }

  // Add verification pricing
  async addVerificationPricing(data: Omit<VerificationPricing, '_id' | 'createdAt' | 'updatedAt'>): Promise<VerificationPricing> {
    console.log('Adding verification pricing with data:', data)
    try {
      const response = await this.post<any>('/pricing/verification', data)
      console.log('Add verification pricing success:', response)
      return response
    } catch (error: any) {
      console.error('Add verification pricing error:', error.response?.data || error.message)
      throw error
    }
  }

  // Edit verification pricing
  async editVerificationPricing(id: string, data: Partial<VerificationPricing>): Promise<VerificationPricing> {
    const response = await this.put<any>(`/pricing/verification/${id}`, data)
    return response
  }

  // Delete verification pricing
  async deleteVerificationPricing(id: string): Promise<{ message: string }> {
    const response = await this.delete<any>(`/pricing/verification/${id}`)
    return response
  }

  // ==================== HOMEPAGE PLANS ====================

  // Get all homepage plans
  async getAllHomepagePlans(): Promise<HomepagePlan[]> {
    console.log('Fetching homepage plans...')
    const response = await this.get<any>('/pricing/homepage')
    console.log('Homepage plans response:', response)
    return response
  }

  // Get homepage plan by type
  async getHomepagePlanByType(planType: string): Promise<HomepagePlan> {
    const response = await this.get<any>(`/pricing/homepage/${planType}`)
    return response
  }

  // Add homepage plan
  async addHomepagePlan(data: Omit<HomepagePlan, '_id' | 'createdAt' | 'updatedAt'>): Promise<HomepagePlan> {
    console.log('Adding homepage plan with data:', data)
    try {
      const response = await this.post<any>('/pricing/homepage', data)
      console.log('Add homepage plan success:', response)
      return response
    } catch (error: any) {
      console.error('Add homepage plan error:', error.response?.data || error.message)
      throw error
    }
  }

  // Edit homepage plan
  async editHomepagePlan(id: string, data: Partial<HomepagePlan>): Promise<HomepagePlan> {
    console.log('Editing homepage plan with ID:', id, 'and data:', data)
    const response = await this.put<any>(`/pricing/homepage/${id}`, data)
    console.log('Edit homepage plan response:', response)
    return response
  }

  // Delete homepage plan
  async deleteHomepagePlan(id: string): Promise<{ message: string }> {
    const response = await this.delete<any>(`/pricing/homepage/${id}`)
    return response
  }

  // ==================== COMBINED ENDPOINTS ====================

  // Get all pricing data
  async getAllPricing(): Promise<AllPricingData> {
    const response = await this.get<any>('/pricing')
    return response
  }

  // Get homepage pricing
  async getHomepagePricing(): Promise<HomepagePlan[]> {
    const response = await this.get<any>('/pricing/homepage-pricing')
    return response
  }

  // Get homepage plans by period
  async getHomepagePlansByPeriod(period: 'monthly' | 'yearly'): Promise<HomepagePlan[]> {
    const response = await this.get<any>(`/pricing/homepage-pricing/${period}`)
    return response
  }

  // Get available verifications
  async getAvailableVerifications(): Promise<VerificationPricing[]> {
    const response = await this.get<any>('/pricing/available-verifications')
    return response
  }
}

export default new PricingApi() 