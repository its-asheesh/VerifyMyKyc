export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Review {
  _id: string
  userId: { _id: string; name?: string; email?: string } | string
  productId: string
  rating: number
  title?: string
  comment: string
  status: ReviewStatus
  createdAt: string
  updatedAt: string
}

export interface ReviewListResponse {
  items: Review[]
  pagination: { page: number; limit: number; total: number }
  stats?: { avgRating: number; count: number }
}
