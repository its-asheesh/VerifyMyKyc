import axios from 'axios'

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

class OrderApi {
  // Get all orders (admin only)
  async getAllOrders(): Promise<Order[]> {
    console.log('Fetching all orders...')
    const response = await api.get('/orders')
    console.log('Orders response:', response.data)
    return response.data.data.orders
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`)
    return response.data.data.order
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId: string, data: UpdateOrderStatusData): Promise<Order> {
    console.log('Updating order status:', orderId, data)
    try {
      const response = await api.put(`/orders/${orderId}/status`, data)
      console.log('Update order status success:', response.data)
      return response.data.data.order
    } catch (error: any) {
      console.error('Update order status error:', error.response?.data || error.message)
      throw error
    }
  }

  // Get order statistics (admin only)
  async getOrderStats(): Promise<OrderStats> {
    console.log('Fetching order stats...')
    const response = await api.get('/orders/stats/overview')
    console.log('Order stats response:', response.data)
    return response.data.data
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

    const response = await api.get(`/orders?${params.toString()}`)
    return response.data.data.orders
  }
}

export default new OrderApi() 