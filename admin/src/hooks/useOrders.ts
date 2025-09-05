import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import orderApi, { type UpdateOrderStatusData } from '../services/api/orderApi'

// Get all orders
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderApi.getAllOrders,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get order statistics
export const useOrderStats = () => {
  return useQuery({
    queryKey: ['orderStats'],
    queryFn: orderApi.getOrderStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: 1000,
  })
}

// Get order by ID
export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateOrderStatusData }) =>
      orderApi.updateOrderStatus(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orderStats'] })
    },
  })
}

// Get orders with filters
export const useOrdersWithFilters = (filters: {
  status?: string
  orderType?: string
  paymentStatus?: string
  userId?: string
}) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderApi.getOrdersWithFilters(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
} 