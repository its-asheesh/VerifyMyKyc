import BaseApi from './baseApi'

export interface CouponData {
  code?: string
  name: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minimumAmount: number
  maximumDiscount?: number
  validFrom: string
  validUntil: string
  usageLimit: number
  applicableProducts: string[]
  applicableCategories: string[]
  userRestrictions: {
    newUsersOnly: boolean
    specificUsers: string[]
    minimumOrders: number
  }
  isActive?: boolean
}

export interface CouponStats {
  stats: {
    totalCoupons: number
    activeCoupons: number
    expiredCoupons: number
  }
  topUsedCoupons: Array<{
    _id: string
    code: string
    name: string
    usedCount: number
    usageLimit: number
  }>
  recentUsage: Array<{
    code: string
    name: string
    usageHistory: {
      usedAt: string
      discountApplied: number
    }
    userName: string
    orderNumber: string
  }>
}

export interface CouponListResponse {
  coupons: Array<{
    _id: string
    code: string
    name: string
    description: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    minimumAmount: number
    maximumDiscount?: number
    validFrom: string
    validUntil: string
    usageLimit: number
    usedCount: number
    isActive: boolean
    createdAt: string
    createdBy: {
      _id: string
      name: string
      email: string
    }
  }>
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

class CouponApi extends BaseApi {
  // Get all coupons with pagination and filters
  async getAllCoupons(params?: {
    page?: number
    limit?: number
    search?: string
    status?: 'active' | 'expired'
  }): Promise<CouponListResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)

    const response = await this.get<any>(`/coupons?${queryParams.toString()}`)
    return response.data
  }

  // Get coupon by ID
  async getCouponById(id: string) {
    const response = await this.get<any>(`/coupons/${id}`)
    return response.data.coupon
  }

  // Create new coupon
  async createCoupon(data: CouponData) {
    const response = await this.post<any>('/coupons', data)
    return response.data.coupon
  }

  // Update coupon
  async updateCoupon(id: string, data: Partial<CouponData>) {
    const response = await this.put<any>(`/coupons/${id}`, data)
    return response.data.coupon
  }

  // Delete coupon
  async deleteCoupon(id: string) {
    const response = await this.delete<any>(`/coupons/${id}`)
    return response
  }

  // Get coupon statistics
  async getCouponStats(): Promise<CouponStats> {
    const response = await this.get<any>('/coupons/stats')
    return response.data
  }

  // Generate coupon codes
  async generateCouponCodes(params: {
    count: number
    prefix?: string
    length?: number
  }) {
    const response = await this.get<any>('/coupons/generate', { params })
    return response.data.codes
  }

  // Validate coupon code (for testing)
  async validateCoupon(code: string, orderAmount: number, userId?: string) {
    const response = await this.post<any>('/coupons/validate', {
      code,
      orderAmount,
      userId
    })
    return response.data
  }
}

export default new CouponApi() 