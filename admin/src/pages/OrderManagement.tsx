import React, { useState, useEffect, useMemo } from 'react'
import { 
  Package, 
  CheckCircle, Clock, AlertCircle,
  IndianRupee,  Loader2, BarChart
} from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useOrders, useOrderStats, useUpdateOrderStatus } from '../hooks/useOrders'
import { useAnalyticsOverview } from '../hooks/useAnalytics'
import OrderAnalyticsChart from '../components/dashboard/OrderAnalyticsChart'
import { useQueryClient } from '@tanstack/react-query'

// Import reusable components
import StatCard from '../components/common/StatCard'
import DataTable from '../components/common/DataTable'
import StatusBadge from '../components/common/StatusBadge'
import AdvancedFilters from '../components/common/AdvancedFilters'
import { exportToExcel, formatters } from '../utils/exportUtils'
import { formatDate, formatCurrency } from '../utils/dateUtils'
import type { Column } from '../components/common/DataTable'

const OrderManagement: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    orderType: '',
    paymentStatus: '',
    search: ''
  })
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'createdAt', direction: 'desc' })
  const [isOrderChartOpen, setIsOrderChartOpen] = useState(false)
  const queryClient = useQueryClient()

  // Fetch data using React Query
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useOrders()
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useOrderStats()
  const analyticsData = useAnalyticsOverview().data
  const updateOrderStatus = useUpdateOrderStatus()
  const { showSuccess, showError } = useToast()

  // Debug logging
  useEffect(() => {
    console.log('OrderManagement - stats data:', stats)
  }, [stats])

  // Refetch stats when chart opens to ensure fresh data
  useEffect(() => {
    if (isOrderChartOpen) {
      refetchStats()
      queryClient.invalidateQueries({ queryKey: ['orderStats'] })
    }
  }, [isOrderChartOpen, refetchStats, queryClient])

  // Filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'expired', label: 'Expired' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    },
    {
      key: 'orderType',
      label: 'Order Type',
      type: 'select' as const,
      options: [
        { value: 'subscription', label: 'Subscription' },
        { value: 'one-time', label: 'One-time' }
      ]
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      type: 'select' as const,
      options: [
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' }
      ]
    }
  ]

  // Table columns configuration
  const columns: Column[] = [
    {
      key: 'serviceName',
      label: 'Service',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">ID: {row.orderId}</div>
          <div className="text-xs text-gray-400 capitalize">{row.orderType}</div>
        </div>
      )
    },
    {
      key: 'userId',
      label: 'Customer',
      render: (value) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {value?.name || 'Unknown User'}
          </div>
          <div className="text-sm text-gray-500">
            {value?.email || 'No email'}
          </div>
        </div>
      )
    },
    {
      key: 'finalAmount',
      label: 'Amount',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{formatCurrency(value)}</div>
          <div className="text-xs text-gray-500 capitalize">{row.billingPeriod}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      sortable: true,
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value) => formatDate(value, 'datetime')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center justify-end space-x-2">
          <select
            value={row.status}
            onChange={(e) => handleStatusUpdate(row._id, e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )
    }
  ]

  // Filtered and sorted orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = 
        order.orderId.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.serviceName.toLowerCase().includes(filters.search.toLowerCase()) ||
        (order.userId?.name || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (order.userId?.email || '').toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesStatus = !filters.status || order.status === filters.status
      const matchesOrderType = !filters.orderType || order.orderType === filters.orderType
      const matchesPaymentStatus = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus
      
      return matchesSearch && matchesStatus && matchesOrderType && matchesPaymentStatus
    })

    // Sort orders
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortConfig.field) {
        case 'serviceName':
          aValue = a.serviceName.toLowerCase()
          bValue = b.serviceName.toLowerCase()
          break
        case 'finalAmount':
          aValue = a.finalAmount ?? 0
          bValue = b.finalAmount ?? 0
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'status':
        case 'paymentStatus':
          aValue = a[sortConfig.field]
          bValue = b[sortConfig.field]
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [orders, filters, sortConfig])

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ status: '', orderType: '', paymentStatus: '', search: '' })
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, data: { status: newStatus as 'active' | 'expired' | 'cancelled' } })
      showSuccess('Order status updated successfully!')
    } catch (error) {
      console.error('Failed to update order status:', error)
      showError('Failed to update order status. Please try again.')
    }
  }

  // Export orders to Excel
  const exportOrdersToExcel = () => {
    const exportColumns = [
      { key: 'orderId', label: 'Order ID' },
      { key: 'serviceName', label: 'Service' },
      { key: 'orderType', label: 'Order Type' },
      { key: 'userId.name', label: 'Customer Name' },
      { key: 'userId.email', label: 'Customer Email' },
      { key: 'finalAmount', label: 'Amount (INR)', formatter: formatters.currency },
      { key: 'billingPeriod', label: 'Billing Period' },
      { key: 'status', label: 'Status', formatter: formatters.status },
      { key: 'paymentStatus', label: 'Payment Status', formatter: formatters.status },
      { key: 'paymentMethod', label: 'Payment Method' },
      { key: 'createdAt', label: 'Created At', formatter: formatters.datetime }
    ]

    exportToExcel(filteredAndSortedOrders, exportColumns, {
      filename: 'orders',
      includeTimestamp: true
    })
  }

  if (ordersLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading orders...</span>
      </div>
    )
  }

  if (ordersError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Orders
          </h3>
          <p className="text-gray-600">
            Failed to load order data. Please try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage all user orders and payments</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportOrdersToExcel}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Excel
          </button>
          <button
            onClick={() => setIsOrderChartOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <BarChart className="w-4 h-4 mr-2" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={Package}
            color="blue"
            loading={statsLoading}
          />
          <StatCard
            title="Active Orders"
            value={stats.activeOrders}
            icon={CheckCircle}
            color="green"
            loading={statsLoading}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={IndianRupee}
            color="purple"
            loading={statsLoading}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={Clock}
            color="orange"
            loading={statsLoading}
          />
        </div>
      )}

      {/* Filters */}
      <AdvancedFilters
        filters={filterConfig}
        values={filters}
        onChange={handleFilterChange}
        onClear={clearFilters}
        searchPlaceholder="Search orders by ID, service, customer name or email..."
      />

      {/* Orders Table */}
      <DataTable
        data={filteredAndSortedOrders}
        columns={columns}
        loading={ordersLoading}
        error={(ordersError as unknown as Error)?.message}
        sortConfig={sortConfig}
        onSort={handleSort}
        emptyMessage="No orders found"
      />

      {/* Order Analytics Chart Modal */}
      <OrderAnalyticsChart 
        isOpen={isOrderChartOpen}
        onClose={() => setIsOrderChartOpen(false)}
        data={analyticsData}
        orderStats={stats}
      />
    </div>
  )
}

export default OrderManagement