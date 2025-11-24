import React, { useState, useMemo } from 'react'
import { useCoupons, useCouponStats, useDeleteCoupon } from '../hooks/useCoupons'
import { useToast } from '../context/ToastContext'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  TrendingUp,
  Calendar,
  Users,
  Tag,
  Loader2,
  AlertCircle
} from 'lucide-react'
import CouponForm from '../components/coupons/CouponForm'
import CouponDetails from '../components/coupons/CouponDetails'

// Import reusable components
import { StatCard, DataTable, StatusBadge, AdvancedFilters } from '../components/common'
import { exportToExcel, formatters } from '../utils/exportUtils'
import { formatDate, formatCurrency } from '../utils/dateUtils'
import type { Column } from '../components/common/DataTable'

const CouponManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all')
  const [currentPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<string | null>(null)
  const [viewingCoupon, setViewingCoupon] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'createdAt', direction: 'desc' })

  const { data: couponsData, isLoading, error } = useCoupons({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter
  })

  const { data: stats, isLoading: statsLoading } = useCouponStats()
  const deleteCouponMutation = useDeleteCoupon()
  const { showSuccess, showError } = useToast()

  // Filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'expired', label: 'Expired' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]

  // Table columns configuration
  const columns: Column[] = [
    {
      key: 'code',
      label: 'Coupon Code',
      sortable: true,
      render: (value, _row) => (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm font-medium text-gray-900">{value}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard(value)
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Copy to clipboard"
          >
            <Copy className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {value || 'No description'}
        </div>
      )
    },
    {
      key: 'discountType',
      label: 'Discount',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <span className="font-medium text-gray-900">
            {value === 'percentage' 
              ? `${row.discountValue}%` 
              : formatCurrency(row.discountValue)
            }
          </span>
          <div className="text-xs text-gray-500 capitalize">{value}</div>
        </div>
      )
    },
    {
      key: 'usageLimit',
      label: 'Usage',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <span className="font-medium text-gray-900">
            {row.usedCount || 0} / {value || '∞'}
          </span>
          <div className="text-xs text-gray-500">
            {value ? `${Math.round(((row.usedCount || 0) / value) * 100)}% used` : 'Unlimited'}
          </div>
        </div>
      )
    },
    {
      key: 'validFrom',
      label: 'Valid Period',
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="text-gray-900">{formatDate(value, 'short')}</div>
          <div className="text-xs text-gray-500">to {formatDate(row.validUntil, 'short')}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (_value, row) => getCouponStatusBadge(row)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setViewingCoupon(row._id)
            }}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setEditingCoupon(row._id)
              setShowForm(true)
            }}
            className="p-1 hover:bg-blue-100 rounded text-blue-600"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row._id)
            }}
            className="p-1 hover:bg-red-100 rounded text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  const coupons = couponsData?.items || []

  const filteredAndSortedCoupons = useMemo(() => {
    let filtered = coupons.filter(coupon => {
      const matchesSearch = 
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coupon.description && coupon.description.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || getCouponStatus(coupon) === statusFilter
      
      return matchesSearch && matchesStatus
    })

    // Sort coupons
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortConfig.field) {
        case 'code':
          aValue = a.code.toLowerCase()
          bValue = b.code.toLowerCase()
          break
        case 'discountType':
          aValue = a.discountType
          bValue = b.discountType
          break
        case 'usageLimit':
          aValue = a.usageLimit || 0
          bValue = b.usageLimit || 0
          break
        case 'validFrom':
          aValue = new Date(a.validFrom)
          bValue = new Date(b.validFrom)
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [coupons, searchTerm, statusFilter, sortConfig])

  const getCouponStatus = (coupon: any) => {
    const now = new Date()
    const validFrom = new Date(coupon.validFrom)
    const validUntil = new Date(coupon.validUntil)
    
    if (!coupon.isActive) return 'inactive'
    if (now < validFrom) return 'upcoming'
    if (now > validUntil) return 'expired'
    if (coupon.usedCount >= coupon.usageLimit) return 'limit-reached'
    return 'active'
  }

  const getCouponStatusBadge = (coupon: any) => {
    const status = getCouponStatus(coupon)
    return <StatusBadge status={status} />
  }

  const handleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleFilterChange = (key: string, value: any) => {
    if (key === 'search') {
      setSearchTerm(value)
    } else if (key === 'status') {
      setStatusFilter(value)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCouponMutation.mutateAsync(id)
        showSuccess('Coupon deleted successfully!')
      } catch (error) {
        console.error('Failed to delete coupon:', error)
        showError('Failed to delete coupon. Please try again.')
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    showSuccess('Coupon code copied to clipboard!')
  }

  const handleFormSubmit = async (_data: any) => {
    // Form submission is handled inside CouponForm component
    // This is just a placeholder for FormModal compatibility
    // The actual submission logic is in CouponForm.handleSubmit
  }

  // Export coupons to Excel
  const exportCouponsToExcel = () => {
    const exportColumns = [
      { key: 'code', label: 'Coupon Code' },
      { key: 'description', label: 'Description' },
      { key: 'discountType', label: 'Discount Type' },
      { key: 'discountValue', label: 'Discount Value' },
      { key: 'usageLimit', label: 'Usage Limit' },
      { key: 'usedCount', label: 'Used Count' },
      { key: 'validFrom', label: 'Valid From', formatter: formatters.date },
      { key: 'validUntil', label: 'Valid Until', formatter: formatters.date },
      { key: 'isActive', label: 'Is Active', formatter: formatters.boolean },
      { key: 'createdAt', label: 'Created At', formatter: formatters.datetime }
    ]

    exportToExcel(filteredAndSortedCoupons, exportColumns, {
      filename: 'coupons',
      includeTimestamp: true
    })
  }

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-gray-600">Failed to load coupons</p>
          <p className="text-sm text-red-500 mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-600">Manage discount coupons and promotional codes</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportCouponsToExcel}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Coupon
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Coupons"
            value={stats.totalCoupons}
            icon={Tag}
            color="blue"
            loading={statsLoading}
          />
          <StatCard
            title="Active Coupons"
            value={stats.activeCoupons}
            icon={TrendingUp}
            color="green"
            loading={statsLoading}
          />
          <StatCard
            title="Total Usage"
            value={stats.totalUsage}
            icon={Users}
            color="purple"
            loading={statsLoading}
          />
          <StatCard
            title="This Month"
            value={stats.newCouponsThisMonth}
            icon={Calendar}
            color="orange"
            loading={statsLoading}
          />
        </div>
      )}

      {/* Filters */}
      <AdvancedFilters
        filters={filterConfig}
        values={{
          search: searchTerm,
          status: statusFilter
        }}
        onChange={handleFilterChange}
        onClear={clearFilters}
        searchPlaceholder="Search coupons by code or description..."
      />

      {/* Coupons Table */}
      <DataTable
        data={filteredAndSortedCoupons}
        columns={columns}
        loading={isLoading}
        error={(error as unknown as Error)?.message}
        sortConfig={sortConfig}
        onSort={handleSort}
        emptyMessage="No coupons found"
      />

      {/* Coupon Form Modal */}
      {showForm && (
        <CouponForm
          editingCouponId={editingCoupon}
          onClose={() => {
            setShowForm(false)
            setEditingCoupon(null)
          }}
        />
      )}

      {/* Coupon Details Modal */}
      {viewingCoupon && (
        <CouponDetails
          couponId={viewingCoupon}
          onClose={() => setViewingCoupon(null)}
        />
      )}
    </div>
  )
}

export default CouponManagement