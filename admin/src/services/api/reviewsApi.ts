import axios from 'axios'

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface ReviewUser {
  _id?: string
  name?: string
  email?: string
}

export interface ReviewItem {
  _id: string
  userId?: string | ReviewUser
  productId: string
  rating: number
  title?: string
  comment: string
  status: ReviewStatus
  verified?: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminReviewsResponse {
  items: ReviewItem[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

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

export async function getReviews(params: {
  page?: number
  limit?: number
  status?: ReviewStatus | ''
  productId?: string
  userId?: string
  verified?: boolean | ''
} = {}): Promise<AdminReviewsResponse> {
  const { page = 1, limit = 10, status, productId, userId, verified } = params
  const response = await api.get('/reviews', {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
      ...(productId ? { productId } : {}),
      ...(userId ? { userId } : {}),
      ...(verified !== '' && typeof verified !== 'undefined' ? { verified } : {}),
    },
  })
  return response.data
}

export async function updateReview(id: string, data: Partial<Pick<ReviewItem, 'rating' | 'title' | 'comment' | 'status' | 'verified'>>): Promise<ReviewItem> {
  const response = await api.put(`/reviews/${id}`, data)
  return response.data
}

export async function deleteReview(id: string): Promise<{ success: boolean }> {
  const response = await api.delete(`/reviews/${id}`)
  return response.data
}

export async function setVerified(id: string, verified = true): Promise<ReviewItem> {
  const response = await api.patch(`/reviews/${id}/verify`, { verified })
  return response.data
}
