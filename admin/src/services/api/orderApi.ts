import BaseApi from './baseApi'

// Types
export interface Order {
  _id: string
  orderId: string
  userId: {
    _id: string
    name: string
    email: string
  }
  orderType: 'verification' | 'plan'
  serviceName: string
  serviceDetails: {
    verificationType?: string
    planName?: string
    planType?: string
    features?: string[]
  }
  totalAmount: number
  finalAmount: number
  currency: string
  billingPeriod: 'one-time' | 'monthly' | 'yearly'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'card' | 'upi' | 'netbanking'
  transactionId?: string
  status: 'active' | 'expired' | 'cancelled'
  startDate: string
  endDate: string
  couponApplied?: {
    couponId: string
    code: string
    discount: number
    discountType: 'percentage' | 'fixed'
    discountValue: number
  }
  createdAt: string
  updatedAt: string
}

export interface OrderStats {
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  activeOrders: number
  expiredOrders: number
  totalRevenue: number
}

export interface UpdateOrderStatusData {
  status: 'active' | 'expired' | 'cancelled'
}

class OrderApi extends BaseApi {
  // Get all orders (admin only)
  async getAllOrders(): Promise<Order[]> {
    console.log('Fetching all orders...')
    const response = await this.get<any>('/orders')
    console.log('Orders response:', response)
    return response.data.orders
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order> {
    const response = await this.get<any>(`/orders/${orderId}`)
    return response.data.order
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId: string, data: UpdateOrderStatusData): Promise<Order> {
    console.log('Updating order status:', orderId, data)
    try {
      const response = await this.put<any>(`/orders/${orderId}/status`, data)
      console.log('Update order status success:', response)
      return response.data.order
    } catch (error: any) {
      console.error('Update order status error:', error.response?.data || error.message)
      throw error
    }
  }

  // Get order statistics (admin only)
  async getOrderStats(): Promise<OrderStats> {
    console.log('Fetching order stats...')
    const response = await this.get<any>('/orders/stats/overview')
    console.log('Order stats response:', response)
    return response.data
  }

  // Get orders with filters
  async getOrdersWithFilters(filters: {
    status?: string
    orderType?: string
    paymentStatus?: string
    userId?: string
  }): Promise<Order[]> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })

    const response = await this.get<any>(`/orders?${params.toString()}`)
    return response.data.orders
  }
}

export default new OrderApi() 