import axios from 'axios'

export type BlogStatus = 'draft' | 'published'

export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  coverImage?: string
  tags: string[]
  status: BlogStatus
  author?: string
  createdAt: string
  updatedAt: string
}

export interface AdminBlogListResponse {
  items: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

export interface CreateBlogPostData {
  title: string
  slug?: string
  excerpt?: string
  content: string
  coverImage?: string
  tags?: string[]
  status?: BlogStatus
  author?: string
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {}

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

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

class BlogApi {
  async getPosts(params?: { page?: number; limit?: number; status?: BlogStatus | ''; tag?: string; q?: string }): Promise<AdminBlogListResponse> {
    const response = await api.get('/blog/admin', { params })
    return response.data
  }

  async getPostById(id: string): Promise<BlogPost> {
    const response = await api.get(`/blog/admin/${id}`)
    return response.data.post
  }

  async createPost(data: CreateBlogPostData): Promise<BlogPost> {
    const response = await api.post('/blog/admin', data)
    return response.data.post
  }

  async updatePost(id: string, data: UpdateBlogPostData): Promise<BlogPost> {
    const response = await api.put(`/blog/admin/${id}`, data)
    return response.data.post
  }

  async deletePost(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/blog/admin/${id}`)
    return response.data
  }

  async togglePostStatus(id: string): Promise<BlogPost> {
    const response = await api.patch(`/blog/admin/${id}/toggle`)
    return response.data.post
  }
}

export default new BlogApi()
