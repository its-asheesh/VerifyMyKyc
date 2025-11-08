import BaseApi from "./baseApi"
import type { Review, ReviewListResponse, ReviewStatus } from "../../types/review"

class ReviewApi extends BaseApi {
  // Public: approved reviews across all products
  async getPublicReviews(params?: { page?: number; limit?: number }) {
    return this.get<ReviewListResponse>(`/reviews/public`, { params, skipAuth: true })
  }

  // Public: approved reviews for a product
  async getProductReviews(productId: string, params?: { page?: number; limit?: number }) {
    return this.get<ReviewListResponse>(`/reviews/product/${productId}`, { params, skipAuth: true })
  }

  // Auth: create review
  async createReview(payload: { productId: string; rating: number; title?: string; comment: string; verified?: boolean }) {
    return this.post<Review>(`/reviews`, payload)
  }

  // Admin: list all reviews
  async adminList(params?: { status?: ReviewStatus; productId?: string; userId?: string; page?: number; limit?: number }) {
    return this.get<{ items: Review[]; pagination: { page: number; limit: number; total: number } }>(`/reviews`, { params })
  }

  // Admin: update review
  async adminUpdate(id: string, payload: Partial<Pick<Review, 'rating' | 'title' | 'comment' | 'status'>>) {
    return this.put<Review>(`/reviews/${id}`, payload)
  }

  // Admin: delete review
  async adminDelete(id: string) {
    return this.delete<{ success: boolean }>(`/reviews/${id}`)
  }
}

export const reviewApi = new ReviewApi()
