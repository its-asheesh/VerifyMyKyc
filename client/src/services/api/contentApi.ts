import BaseApi from "./baseApi"

import type { BlogListResponse, BlogPost } from "../../types/blog"
import type { Review, ReviewListResponse, ReviewStatus } from "../../types/review"

export interface CarouselSlide {
    _id: string
    title: string
    subtitle: string
    description: string
    imageUrl: string
    buttonText: string
    buttonLink: string
    isActive: boolean
    order: number
    createdAt: string
    updatedAt: string
}

class ContentApi extends BaseApi {
    // ---------------------------------------------------------------------------
    // Blog Services
    // ---------------------------------------------------------------------------
    // Public: list published posts
    async getPublicPosts(params?: { page?: number; limit?: number; tag?: string; q?: string }) {
        return this.get<BlogListResponse>(`/blog/public`, { params, skipAuth: true })
    }

    // Public: get post by slug
    async getPostBySlug(slug: string) {
        return this.get<BlogPost>(`/blog/public/${slug}`, { skipAuth: true })
    }

    // ---------------------------------------------------------------------------
    // Review Services
    // ---------------------------------------------------------------------------
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
    async adminListReviews(params?: { status?: ReviewStatus; productId?: string; userId?: string; page?: number; limit?: number }) {
        return this.get<{ items: Review[]; pagination: { page: number; limit: number; total: number } }>(`/reviews`, { params })
    }

    // Admin: update review
    async adminUpdateReview(id: string, payload: Partial<Pick<Review, 'rating' | 'title' | 'comment' | 'status'>>) {
        return this.put<Review>(`/reviews/${id}`, payload)
    }

    // Admin: delete review
    async adminDeleteReview(id: string) {
        return this.delete<{ success: boolean }>(`/reviews/${id}`)
    }

    // ---------------------------------------------------------------------------
    // Carousel Services
    // ---------------------------------------------------------------------------
    // Get all active carousel slides (public)
    async getCarouselSlides(): Promise<CarouselSlide[]> {
        // Note: Carousel API was using a separate axios instance in the original file.
        // We can use the BaseApi's axios instance or create a new one if needed.
        // Assuming BaseApi's instance is compatible (baseURL /api).
        // However, the original carouselApi used `axios.create({ baseURL: '/api' })` and `api.get('/carousel')`.
        // BaseApi usually appends the prefix passed in constructor.
        // If we use `this.get('/carousel')` with `new ContentApi('/api')`, it might result in `/api/carousel` which is correct.
        // But `BaseApi` usually handles auth headers. The original `carouselApi` didn't seem to use auth headers for this public endpoint.
        // `this.get` in BaseApi likely adds auth headers if token exists, which is fine.

        return this.get<{ slides: CarouselSlide[] }>('/carousel', { skipAuth: true }).then(res => res.slides)
    }
}

export const contentApi = new ContentApi("/api")
