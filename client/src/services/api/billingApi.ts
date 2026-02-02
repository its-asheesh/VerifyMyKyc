import BaseApi from './baseApi'
import axios from 'axios'

export interface CouponValidationResponse {
    coupon: {
        id: string
        code: string
        name: string
        description: string
        discountType: 'percentage' | 'fixed'
        discountValue: number
        minimumAmount: number
        maximumDiscount?: number
    }
    discount: number
    finalAmount: number
    originalAmount: number
}

export interface CouponApplicationResponse {
    order: unknown
    coupon: {
        id: string
        code: string
        name: string
        discount: number
        finalAmount: number
    }
}

class BillingApi extends BaseApi {
    // ---------------------------------------------------------------------------
    // Coupon Services
    // ---------------------------------------------------------------------------
    // Validate coupon code (public endpoint - no auth required)
    async validateCoupon(
        code: string,
        orderAmount: number,
        userId?: string,
        serviceType?: string,
        category?: string
    ): Promise<CouponValidationResponse> {
        const response = await axios.post<{ success: boolean, data: CouponValidationResponse }>('/api/coupons/validate', {
            code,
            orderAmount,
            userId,
            serviceType,
            category
        })
        return response.data.data
    }

    // Apply coupon to order (requires authentication)
    async applyCoupon(code: string, orderId: string): Promise<CouponApplicationResponse> {
        const response = await this.post<CouponApplicationResponse>('/coupons/apply', {
            code,
            orderId
        })
        return response
    }
}

export const billingApi = new BillingApi('/api')
