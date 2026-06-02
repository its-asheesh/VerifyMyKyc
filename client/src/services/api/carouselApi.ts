import axios from 'axios'

interface CarouselResponse {
  success: boolean
  data: {
    slides: CarouselSlide[]
  }
}

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

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

class CarouselApi {
  // Get all active carousel slides (public)
  async getCarouselSlides(): Promise<CarouselSlide[]> {
    const response = await api.get<CarouselResponse>('/carousel')
    return response.data.data.slides
  }
}

export default new CarouselApi() 