import { useQuery } from '@tanstack/react-query'
import carouselApi, { type CarouselSlide } from '../services/api/carouselApi'

// Hook for getting carousel slides
export const useCarouselSlides = () => {
  return useQuery<CarouselSlide[]>({
    queryKey: ['carousel-slides'],
    queryFn: carouselApi.getCarouselSlides,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
} 