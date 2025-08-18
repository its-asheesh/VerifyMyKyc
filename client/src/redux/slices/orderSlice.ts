import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// Types
export interface Order {
  _id: string
  orderId: string
  orderType: 'verification' | 'plan'
  serviceName: string
  serviceDetails: {
    verificationType?: string
    planName?: string
    planType?: 'monthly' | 'yearly' | 'one-time'
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
  // Present for verification orders; mirrors backend order.model.ts
  verificationQuota?: {
    totalAllowed: number
    used: number
    remaining: number
    validityDays: number
    expiresAt?: string
  }
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

export interface UserServices {
  verifications: Order[]
  plans: Order[]
}

export interface CreateOrderData {
  orderType: 'verification' | 'plan'
  serviceName: string
  serviceDetails: {
    verificationType?: string
    planName?: string
    planType?: 'monthly' | 'yearly' | 'one-time'
    features?: string[]
  }
  totalAmount: number
  finalAmount: number
  billingPeriod: 'one-time' | 'monthly' | 'yearly'
  paymentMethod: 'card' | 'upi' | 'netbanking'
  couponApplied?: {
    couponId: string
    code: string
    discount: number
    discountType: 'percentage' | 'fixed'
    discountValue: number
  }
}

export interface ProcessPaymentData {
  orderId: string
  transactionId: string
}

export interface OrderState {
  orders: Order[]
  activeServices: UserServices | null
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: OrderState = {
  orders: [],
  activeServices: null,
  isLoading: false,
  error: null,
}

// API base URL
const API_BASE_URL = '/api'

// Helper function to make API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }

  return data
}

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: CreateOrderData, { rejectWithValue }) => {
    try {
      const response = await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      })
      return response.data.order
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create order')
    }
  }
)

export const processPayment = createAsyncThunk(
  'orders/processPayment',
  async (paymentData: ProcessPaymentData, { rejectWithValue }) => {
    try {
      const response = await apiCall('/orders/process-payment', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      })
      return response.data.order
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to process payment')
    }
  }
)

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('/orders/my-orders')
      return response.data.orders
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders')
    }
  }
)

export const fetchActiveServices = createAsyncThunk(
  'orders/fetchActiveServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiCall('/orders/my-services')
      return response.data.services
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch active services')
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await apiCall(`/orders/${orderId}/cancel`, {
        method: 'PUT',
      })
      return response.data.order
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel order')
    }
  }
)

// Order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearOrders: (state) => {
      state.orders = []
      state.activeServices = null
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders.unshift(action.payload)
        state.error = null
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Process Payment
    builder
      .addCase(processPayment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isLoading = false
        // Update the order in the list
        const index = state.orders.findIndex(order => order._id === action.payload._id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        state.error = null
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch User Orders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload
        state.error = null
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch Active Services
    builder
      .addCase(fetchActiveServices.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchActiveServices.fulfilled, (state, action) => {
        state.isLoading = false
        state.activeServices = action.payload
        state.error = null
      })
      .addCase(fetchActiveServices.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false
        // Update the order in the list
        const index = state.orders.findIndex(order => order._id === action.payload._id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        state.error = null
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearOrders } = orderSlice.actions
export default orderSlice.reducer 