export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  coverImage?: string
  tags: string[]
  status: 'draft' | 'published'
  author?: string
  createdAt: string
  updatedAt: string
}

export interface BlogListResponse {
  items: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}
