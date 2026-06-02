import axios from 'axios'

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

export interface CreateCarouselSlideData {
  title: string
  subtitle: string
  description: string
  imageUrl: string
  buttonText: string
  buttonLink: string
  isActive?: boolean
  order?: number
}

export interface UpdateCarouselSlideData extends Partial<CreateCarouselSlideData> {}

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

class CarouselApi {
  // Get all carousel slides (admin)
  async getAllCarouselSlides(): Promise<CarouselSlide[]> {
    const response = await api.get('/carousel/admin')
    return response.data.data.slides
  }

  // Get carousel slide by ID
  async getCarouselSlideById(id: string): Promise<CarouselSlide> {
    const response = await api.get(`/carousel/admin/${id}`)
    return response.data.data.slide
  }

  // Create new carousel slide
  async createCarouselSlide(data: CreateCarouselSlideData): Promise<CarouselSlide> {
    const response = await api.post('/carousel/admin', data)
    return response.data.data.slide
  }

  // Update carousel slide
  async updateCarouselSlide(id: string, data: UpdateCarouselSlideData): Promise<CarouselSlide> {
    const response = await api.put(`/carousel/admin/${id}`, data)
    return response.data.data.slide
  }

  // Delete carousel slide
  async deleteCarouselSlide(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/carousel/admin/${id}`)
    return response.data
  }

  // Toggle carousel slide status
  async toggleCarouselSlideStatus(id: string): Promise<CarouselSlide> {
    const response = await api.patch(`/carousel/admin/${id}/toggle`)
    return response.data.data.slide
  }

  // Reorder carousel slides
  async reorderCarouselSlides(slides: { id: string; order: number }[]): Promise<{ message: string }> {
    const response = await api.post('/carousel/admin/reorder', { slides })
    return response.data
  }
}

export default new CarouselApi() 