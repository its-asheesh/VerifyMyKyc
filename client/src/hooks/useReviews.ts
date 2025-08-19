import { useQuery } from '@tanstack/react-query'
import { reviewApi } from '../services/api/reviewApi'
import type { ReviewListResponse } from '../types/review'

// Hook to fetch approved public reviews across all products (all categories)
export const usePublicReviews = (params?: { page?: number; limit?: number }) => {
  return useQuery<ReviewListResponse>({
    queryKey: ['public-reviews', params?.page || 1, params?.limit || 20],
    queryFn: () => reviewApi.getPublicReviews(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
