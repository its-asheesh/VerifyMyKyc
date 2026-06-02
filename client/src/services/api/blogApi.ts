import BaseApi from "./baseApi"
import type { BlogListResponse, BlogPost } from "../../types/blog"

class BlogApi extends BaseApi {
  // Public: list published posts
  async getPublicPosts(params?: { page?: number; limit?: number; tag?: string; q?: string }) {
    return this.get<BlogListResponse>(`/blog/public`, { params, skipAuth: true })
  }

  // Public: get post by slug
  async getPostBySlug(slug: string) {
    return this.get<BlogPost>(`/blog/public/${slug}`, { skipAuth: true })
  }
}

export const blogApi = new BlogApi()
