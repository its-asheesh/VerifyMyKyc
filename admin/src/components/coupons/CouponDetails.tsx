import React from 'react'
import { useCoupon } from '../../hooks/useCoupons'
import { X, Calendar, Users, Tag, TrendingUp, Loader2 } from 'lucide-react'

interface CouponDetailsProps {
  couponId: string
  onClose: () => void
}

const CouponDetails: React.FC<CouponDetailsProps> = ({ couponId, onClose }) => {
  const { data: coupon, isLoading, error } = useCoupon(couponId)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error || !coupon) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p className="text-red-600">Failed to load coupon details</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = () => {
    const now = new Date()
    const validFrom = new Date(coupon.validFrom)
    const validUntil = new Date(coupon.validUntil)
    
    if (!coupon.isActive) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Inactive</span>
    }
    
    if (now < validFrom) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Upcoming</span>
    }
    
    if (now > validUntil) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Expired</span>
    }
    
    if (coupon.usedCount >= coupon.usageLimit) {
      return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Limit Reached</span>
    }
    
    return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Coupon Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Tag className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">{coupon.name}</h3>
              </div>
              {getStatusBadge()}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Coupon Code</p>
                <p className="text-lg font-mono text-gray-900">{coupon.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Description</p>
                <p className="text-gray-900">{coupon.description}</p>
              </div>
            </div>
          </div>

          {/* Discount Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-gray-900">Discount</h4>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
              </p>
              {coupon.maximumDiscount && coupon.discountType === 'percentage' && (
                <p className="text-sm text-gray-500">Max: ₹{coupon.maximumDiscount}</p>
              )}
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-gray-900">Usage</h4>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {coupon.usedCount} / {coupon.usageLimit}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium text-gray-900">Minimum Amount</h4>
              </div>
              <p className="text-2xl font-bold text-purple-600">₹{coupon.minimumAmount}</p>
            </div>
          </div>

          {/* Validity Period */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Validity Period</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Valid From</p>
                <p className="font-medium">{new Date(coupon.validFrom).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valid Until</p>
                <p className="font-medium">{new Date(coupon.validUntil).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Applicability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Applicable Products/Services</h4>
              <div className="flex flex-wrap gap-2">
                {coupon.applicableProducts.map((product: string, index: number) => {
                  const getProductLabel = (product: string) => {
                    const labels: { [key: string]: string } = {
                      'all': 'All Products & Services',
                      'pan': 'PAN Card Verification',
                      'aadhaar': 'Aadhaar Card Verification',
                      'gstin': 'GSTIN Verification',
                      'drivinglicense': 'Driving License Verification',
                      'mca': 'MCA Verification',
                      'personal': 'Personal Plan Verifications',
                      'professional': 'Professional Plan Verifications',
                      'business': 'Business Plan Verifications',
                      'basic-plan': 'Basic Plan',
                      'premium-plan': 'Premium Plan',
                      'enterprise-plan': 'Enterprise Plan',
                      'starter-plan': 'Starter Plan'
                    }
                    return labels[product] || product
                  }
                  
                  return (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {getProductLabel(product)}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Applicable Categories</h4>
              <div className="flex flex-wrap gap-2">
                {coupon.applicableCategories.map((category: string, index: number) => {
                  const getCategoryLabel = (category: string) => {
                    const labels: { [key: string]: string } = {
                      'all': 'All Categories',
                      'personal': 'Personal Verification',
                      'business': 'Business Verification',
                      'government': 'Government Documents',
                      'plan': 'Subscription Plans'
                    }
                    return labels[category] || category
                  }
                  
                  return (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {getCategoryLabel(category)}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>

          {/* User Restrictions */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">User Restrictions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">New Users Only</p>
                <p className="font-medium">{coupon.userRestrictions.newUsersOnly ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Minimum Orders Required</p>
                <p className="font-medium">{coupon.userRestrictions.minimumOrders}</p>
              </div>
            </div>
          </div>

          {/* Usage History */}
          {coupon.usageHistory && coupon.usageHistory.length > 0 && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Recent Usage History</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Discount Applied</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Used At</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupon.usageHistory.slice(0, 10).map((usage: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {usage.userId?.name || 'Unknown User'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {usage.orderId?.orderNumber || 'N/A'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          ₹{usage.discountApplied}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {new Date(usage.usedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Created By */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Created By</h4>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {coupon.createdBy?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{coupon.createdBy?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{coupon.createdBy?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Created Date */}
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Created Date</h4>
            <p className="text-gray-900">{new Date(coupon.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CouponDetails 