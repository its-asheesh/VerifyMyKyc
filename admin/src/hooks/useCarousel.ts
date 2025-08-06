import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import carouselApi, { type CarouselSlide, type CreateCarouselSlideData, type UpdateCarouselSlideData } from '../services/api/carouselApi'

// Hook for getting all carousel slides
export const useCarouselSlides = () => {
  return useQuery<CarouselSlide[]>({
    queryKey: ['carousel-slides'],
    queryFn: carouselApi.getAllCarouselSlides,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Hook for getting a specific carousel slide
export const useCarouselSlide = (id: string) => {
  return useQuery<CarouselSlide>({
    queryKey: ['carousel-slide', id],
    queryFn: () => carouselApi.getCarouselSlideById(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
}

// Hook for creating a new carousel slide
export const useCreateCarouselSlide = () => {
  const queryClient = useQueryClient()
  
  return useMutation<CarouselSlide, Error, CreateCarouselSlideData>({
    mutationFn: carouselApi.createCarouselSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carousel-slides'] })
    },
  })
}

// Hook for updating a carousel slide
export const useUpdateCarouselSlide = () => {
  const queryClient = useQueryClient()
  
  return useMutation<CarouselSlide, Error, { id: string; data: UpdateCarouselSlideData }>({
    mutationFn: ({ id, data }) => carouselApi.updateCarouselSlide(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['carousel-slides'] })
      queryClient.invalidateQueries({ queryKey: ['carousel-slide', id] })
    },
  })
}

// Hook for deleting a carousel slide
export const useDeleteCarouselSlide = () => {
  const queryClient = useQueryClient()
  
  return useMutation<{ message: string }, Error, string>({
    mutationFn: carouselApi.deleteCarouselSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carousel-slides'] })
    },
  })
}

// Hook for toggling carousel slide status
export const useToggleCarouselSlideStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation<CarouselSlide, Error, string>({
    mutationFn: carouselApi.toggleCarouselSlideStatus,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['carousel-slides'] })
      queryClient.invalidateQueries({ queryKey: ['carousel-slide', id] })
    },
  })
}

// Hook for reordering carousel slides
export const useReorderCarouselSlides = () => {
  const queryClient = useQueryClient()
  
  return useMutation<{ message: string }, Error, { id: string; order: number }[]>({
    mutationFn: carouselApi.reorderCarouselSlides,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carousel-slides'] })
    },
  })
} 