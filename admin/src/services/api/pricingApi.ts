import axios from 'axios'

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

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

class PricingApi {
  // ==================== VERIFICATION PRICING ====================
  
  // Get all verification pricing
  async getAllVerificationPricing(): Promise<VerificationPricing[]> {
    console.log('Fetching verification pricing...')
    const response = await api.get('/pricing/verification')
    console.log('Verification pricing response:', response.data)
    return response.data
  }

  // Get verification pricing by type
  async getVerificationPricingByType(verificationType: string): Promise<VerificationPricing> {
    const response = await api.get(`/pricing/verification/${verificationType}`)
    return response.data
  }

  // Add verification pricing
  async addVerificationPricing(data: Omit<VerificationPricing, '_id' | 'createdAt' | 'updatedAt'>): Promise<VerificationPricing> {
    console.log('Adding verification pricing with data:', data)
    try {
      const response = await api.post('/pricing/verification', data)
      console.log('Add verification pricing success:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Add verification pricing error:', error.response?.data || error.message)
      throw error
    }
  }

  // Edit verification pricing
  async editVerificationPricing(id: string, data: Partial<VerificationPricing>): Promise<VerificationPricing> {
    const response = await api.put(`/pricing/verification/${id}`, data)
    return response.data
  }

  // Delete verification pricing
  async deleteVerificationPricing(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/pricing/verification/${id}`)
    return response.data
  }

  // ==================== HOMEPAGE PLANS ====================
  
  // Get all homepage plans
  async getAllHomepagePlans(): Promise<HomepagePlan[]> {
    console.log('Fetching homepage plans...')
    const response = await api.get('/pricing/homepage')
    console.log('Homepage plans response:', response.data)
    return response.data
  }

  // Get homepage plan by type
  async getHomepagePlanByType(planType: string): Promise<HomepagePlan> {
    const response = await api.get(`/pricing/homepage/${planType}`)
    return response.data
  }

  // Add homepage plan
  async addHomepagePlan(data: Omit<HomepagePlan, '_id' | 'createdAt' | 'updatedAt'>): Promise<HomepagePlan> {
    console.log('Adding homepage plan with data:', data)
    try {
      const response = await api.post('/pricing/homepage', data)
      console.log('Add homepage plan success:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Add homepage plan error:', error.response?.data || error.message)
      throw error
    }
  }

  // Edit homepage plan
  async editHomepagePlan(id: string, data: Partial<HomepagePlan>): Promise<HomepagePlan> {
    console.log('Editing homepage plan with ID:', id, 'and data:', data)
    const response = await api.put(`/pricing/homepage/${id}`, data)
    console.log('Edit homepage plan response:', response.data)
    return response.data
  }

  // Delete homepage plan
  async deleteHomepagePlan(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/pricing/homepage/${id}`)
    return response.data
  }

  // ==================== COMBINED ENDPOINTS ====================
  
  // Get all pricing data
  async getAllPricing(): Promise<AllPricingData> {
    const response = await api.get('/pricing')
    return response.data
  }

  // Get homepage pricing
  async getHomepagePricing(): Promise<HomepagePlan[]> {
    const response = await api.get('/pricing/homepage-pricing')
    return response.data
  }

  // Get homepage plans by period
  async getHomepagePlansByPeriod(period: 'monthly' | 'yearly'): Promise<HomepagePlan[]> {
    const response = await api.get(`/pricing/homepage-pricing/${period}`)
    return response.data
  }

  // Get available verifications
  async getAvailableVerifications(): Promise<VerificationPricing[]> {
    const response = await api.get('/pricing/available-verifications')
    return response.data
  }
}

export default new PricingApi() 