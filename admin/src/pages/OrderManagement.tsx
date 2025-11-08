import React, { useState, useEffect, useMemo } from 'react'
import { 
  Package, 
  CheckCircle, Clock, AlertCircle,
  IndianRupee,  Loader2, BarChart
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
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
  const [searchParams, setSearchParams] = useSearchParams()
  const dateRangeFromUrl = searchParams.get('dateRange')
  
  const [filters, setFilters] = useState({
    status: '',
    orderType: '',
    paymentStatus: '',
    serviceName: '',
    search: ''
  })
  const [dateRangeFilter, setDateRangeFilter] = useState(dateRangeFromUrl || 'all')
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(!!dateRangeFromUrl)
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'createdAt', direction: 'desc' })
  const [isOrderChartOpen, setIsOrderChartOpen] = useState(false)
  const queryClient = useQueryClient()

  // Update date range filter when URL parameter changes
  useEffect(() => {
    if (dateRangeFromUrl) {
      setDateRangeFilter(dateRangeFromUrl)
      setShowAdvancedFilters(true)
      // Clear the URL parameter after applying
      setSearchParams({}, { replace: true })
    }
  }, [dateRangeFromUrl, setSearchParams])

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

  // All available products in the system
  const allProducts = [
    { value: '', label: 'All Products' },
    { value: 'pan', label: 'PAN Card Verification' },
    { value: 'aadhaar', label: 'Aadhaar Verification' },
    { value: 'passport', label: 'Passport Verification' },
    { value: 'drivinglicense', label: 'Driving License Verification' },
    { value: 'driving license', label: 'Driving License Verification' },
    { value: 'voterid', label: 'Voter ID Verification' },
    { value: 'voter id', label: 'Voter ID Verification' },
    { value: 'gstin', label: 'GSTIN Verification' },
    { value: 'company', label: 'Company Verification (MCA)' },
    { value: 'mca', label: 'Company Verification (MCA)' },
    { value: 'vehicle', label: 'Vehicle Verification' },
    { value: 'ccrv', label: 'Criminal Case Record Verification' },
    { value: 'bank-account', label: 'Bank Account Verification' },
    { value: 'bank account', label: 'Bank Account Verification' },
    { value: 'epfo', label: 'EPFO Verification' }
  ]

  // Get unique service names from orders that might not be in the static list
  const dynamicServiceOptions = useMemo(() => {
    const uniqueServices = Array.from(new Set(orders.map(order => order.serviceName).filter(Boolean)))
    const staticServiceValues = allProducts.map(p => p.value.toLowerCase())
    
    // Find services that aren't in our static list
    const additionalServices = uniqueServices
      .filter(service => {
        const serviceLower = service.toLowerCase()
        return !staticServiceValues.some(staticValue => 
          serviceLower.includes(staticValue) || staticValue.includes(serviceLower)
        )
      })
      .map(service => ({
        value: service.toLowerCase(),
        label: service
      }))
    
    return additionalServices
  }, [orders])

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
      key: 'serviceName',
      label: 'Product/Service',
      type: 'select' as const,
      options: [
        ...allProducts,
        ...dynamicServiceOptions
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
    },
    {
      key: 'dateRange',
      label: 'Date Range',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Time' },
        { value: '1day', label: 'Last 1 Day' },
        { value: '7days', label: 'Last 7 Days' },
        { value: '1month', label: 'Last 1 Month' },
        { value: '3months', label: 'Last 3 Months' },
        { value: '6months', label: 'Last 6 Months' },
        { value: '1year', label: 'Last 1 Year' },
        { value: '5years', label: 'Last 5 Years' },
        { value: 'custom', label: 'Custom Range' }
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
      const matchesServiceName = !filters.serviceName || (() => {
        const orderService = order.serviceName.toLowerCase().trim()
        const filterService = filters.serviceName.toLowerCase().trim()
        
        // Exact match
        if (orderService === filterService) return true
        
        // Normalize spaces and check if one contains the other
        const normalizedOrder = orderService.replace(/\s+/g, ' ')
        const normalizedFilter = filterService.replace(/\s+/g, ' ')
        
        if (normalizedOrder.includes(normalizedFilter) || normalizedFilter.includes(normalizedOrder)) {
          return true
        }
        
        // Handle common product name variations
        const productMappings: Record<string, string[]> = {
          'pan': ['pan', 'pan card'],
          'aadhaar': ['aadhaar', 'aadhar'],
          'passport': ['passport'],
          'drivinglicense': ['driving license', 'driving licence', 'drivinglicense', 'dl'],
          'voterid': ['voter id', 'voterid', 'voter', 'epic'],
          'gstin': ['gstin', 'gst'],
          'company': ['company', 'mca'],
          'vehicle': ['vehicle', 'rc'],
          'ccrv': ['ccrv', 'criminal'],
          'bank-account': ['bank account', 'bank-account', 'bank'],
          'epfo': ['epfo', 'uan']
        }
        
        // Check if both order and filter match any product mapping
        for (const [productKey, variations] of Object.entries(productMappings)) {
          const orderMatches = variations.some(v => normalizedOrder.includes(v))
          const filterMatches = variations.some(v => normalizedFilter.includes(v) || productKey === normalizedFilter)
          if (orderMatches && filterMatches) return true
        }
        
        return false
      })()
      const matchesOrderType = !filters.orderType || order.orderType === filters.orderType
      const matchesPaymentStatus = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus
      
      // Date range filter
      const matchesDateRange = (() => {
        if (dateRangeFilter === 'all') return true
        
        const orderDate = new Date(order.createdAt)
        const now = new Date()
        
        switch (dateRangeFilter) {
          case '1day':
            const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
            return orderDate >= oneDayAgo
          case '7days':
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return orderDate >= sevenDaysAgo
          case '1month':
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return orderDate >= oneMonthAgo
          case '3months':
            const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
            return orderDate >= threeMonthsAgo
          case '6months':
            const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
            return orderDate >= sixMonthsAgo
          case '1year':
            const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            return orderDate >= oneYearAgo
          case '5years':
            const fiveYearsAgo = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000)
            return orderDate >= fiveYearsAgo
          case 'custom':
            if (!customDateRange.start || !customDateRange.end) return true
            const startDate = new Date(customDateRange.start)
            const endDate = new Date(customDateRange.end)
            endDate.setHours(23, 59, 59, 999) // Include the entire end date
            return orderDate >= startDate && orderDate <= endDate
          default:
            return true
        }
      })()
      
      return matchesSearch && matchesStatus && matchesServiceName && matchesOrderType && matchesPaymentStatus && matchesDateRange
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
  }, [orders, filters, sortConfig, dateRangeFilter, customDateRange])

  // Calculate filtered stats based on filtered orders
  const filteredStats = useMemo(() => {
    const filteredRevenue = filteredAndSortedOrders
      .filter(order => order.paymentStatus === 'completed')
      .reduce((sum, order) => sum + (order.finalAmount || 0), 0)
    
    const filteredActiveOrders = filteredAndSortedOrders.filter(order => order.status === 'active').length
    const filteredPendingOrders = filteredAndSortedOrders.filter(order => order.paymentStatus === 'pending').length
    
    return {
      totalOrders: filteredAndSortedOrders.length,
      activeOrders: filteredActiveOrders,
      totalRevenue: filteredRevenue,
      pendingOrders: filteredPendingOrders
    }
  }, [filteredAndSortedOrders])

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleFilterChange = (key: string, value: any) => {
    if (key === 'dateRange') {
      setDateRangeFilter(value)
      // Clear custom date range if switching away from "custom"
      if (value !== 'custom') {
        setCustomDateRange({ start: '', end: '' })
      }
    } else if (key === 'dateRange_start') {
      setCustomDateRange(prev => ({ ...prev, start: value }))
    } else if (key === 'dateRange_end') {
      setCustomDateRange(prev => ({ ...prev, end: value }))
    } else {
      setFilters(prev => ({ ...prev, [key]: value }))
    }
  }

  const clearFilters = () => {
    setFilters({ status: '', orderType: '', paymentStatus: '', serviceName: '', search: '' })
    setDateRangeFilter('all')
    setCustomDateRange({ start: '', end: '' })
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={dateRangeFilter !== 'all' ? "Filtered Orders" : "Total Orders"}
          value={dateRangeFilter !== 'all' ? filteredStats.totalOrders : (stats?.totalOrders || 0)}
          icon={Package}
          color="blue"
          loading={statsLoading}
        />
        <StatCard
          title={dateRangeFilter !== 'all' ? "Filtered Active" : "Active Orders"}
          value={dateRangeFilter !== 'all' ? filteredStats.activeOrders : (stats?.activeOrders || 0)}
          icon={CheckCircle}
          color="green"
          loading={statsLoading}
        />
        <StatCard
          title={dateRangeFilter !== 'all' ? "Filtered Revenue" : "Total Revenue"}
          value={formatCurrency(dateRangeFilter !== 'all' ? filteredStats.totalRevenue : (stats?.totalRevenue || 0))}
          icon={IndianRupee}
          color="purple"
          loading={statsLoading}
        />
        <StatCard
          title={dateRangeFilter !== 'all' ? "Filtered Pending" : "Pending Orders"}
          value={dateRangeFilter !== 'all' ? filteredStats.pendingOrders : (stats?.pendingOrders || 0)}
          icon={Clock}
          color="orange"
          loading={statsLoading}
        />
      </div>

      {/* Filters */}
      <AdvancedFilters
        filters={filterConfig}
        values={{
          ...filters,
          dateRange: dateRangeFilter,
          dateRange_start: customDateRange.start,
          dateRange_end: customDateRange.end
        }}
        onChange={handleFilterChange}
        onClear={clearFilters}
        searchPlaceholder="Search orders by ID, service, customer name or email..."
        showAdvanced={showAdvancedFilters}
        onToggleAdvanced={setShowAdvancedFilters}
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