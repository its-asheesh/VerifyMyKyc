import React, { useState, useEffect } from 'react'
import { useCreateCoupon, useUpdateCoupon, useCoupon } from '../../hooks/useCoupons'
import { useToast } from '../../context/ToastContext'
import type { CouponData } from '../../services/api/couponApi'
import { X, Save, Loader2, Sparkles } from 'lucide-react'

interface CouponFormProps {
  onClose: () => void
  editingCouponId?: string | null
}

const CouponForm: React.FC<CouponFormProps> = ({ onClose, editingCouponId }) => {
  const [formData, setFormData] = useState<CouponData>({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minimumAmount: 0,
    maximumDiscount: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    applicableProducts: ['all'],
    applicableCategories: ['all'],
    userRestrictions: {
      newUsersOnly: false,
      specificUsers: [],
      minimumOrders: 0
    },
    isActive: true
  })

  const [autoGenerateCode, setAutoGenerateCode] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const createCouponMutation = useCreateCoupon()
  const updateCouponMutation = useUpdateCoupon()
  const { data: editingCoupon, isLoading: loadingCoupon } = useCoupon(editingCouponId || '')
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    if (editingCoupon) {
      setFormData({
        name: editingCoupon.name,
        description: editingCoupon.description,
        discountType: editingCoupon.discountType,
        discountValue: editingCoupon.discountValue,
        minimumAmount: editingCoupon.minimumAmount,
        maximumDiscount: editingCoupon.maximumDiscount,
        validFrom: new Date(editingCoupon.validFrom).toISOString().split('T')[0],
        validUntil: new Date(editingCoupon.validUntil).toISOString().split('T')[0],
        usageLimit: editingCoupon.usageLimit,
        applicableProducts: editingCoupon.applicableProducts,
        applicableCategories: editingCoupon.applicableCategories,
        userRestrictions: editingCoupon.userRestrictions,
        isActive: editingCoupon.isActive,
        code: editingCoupon.code
      })
      setAutoGenerateCode(false)
    }
  }, [editingCoupon])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingCouponId) {
        await updateCouponMutation.mutateAsync({
          id: editingCouponId,
          data: formData
        })
        showSuccess('Coupon updated successfully!')
      } else {
        await createCouponMutation.mutateAsync(formData)
        showSuccess('Coupon created successfully!')
      }
      onClose()
    } catch (error) {
      console.error('Failed to save coupon:', error)
      showError('Failed to save coupon. Please try again.')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUserRestrictionChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      userRestrictions: {
        ...prev.userRestrictions,
        [field]: value
      }
    }))
  }

  if (loadingCoupon) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingCouponId ? 'Edit Coupon' : 'Create New Coupon'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  disabled={autoGenerateCode}
                  placeholder="Enter coupon code or leave empty for auto-generation"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setAutoGenerateCode(!autoGenerateCode)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" />
                  {autoGenerateCode ? 'Manual' : 'Auto'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Summer Sale 20% Off"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the coupon offer..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Discount Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => handleInputChange('discountType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                required
                min="0"
                step={formData.discountType === 'percentage' ? '0.01' : '1'}
                value={formData.discountValue}
                onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value))}
                placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {formData.discountType === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Discount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maximumDiscount || ''}
                  onChange={(e) => handleInputChange('maximumDiscount', parseFloat(e.target.value) || undefined)}
                  placeholder="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Validity and Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid From *
              </label>
              <input
                type="date"
                required
                value={formData.validFrom}
                onChange={(e) => handleInputChange('validFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid Until *
              </label>
              <input
                type="date"
                required
                value={formData.validUntil}
                onChange={(e) => handleInputChange('validUntil', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Limit *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.usageLimit}
                onChange={(e) => handleInputChange('usageLimit', parseInt(e.target.value))}
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Order Amount (₹)
            </label>
            <input
              type="number"
              min="0"
              value={formData.minimumAmount}
              onChange={(e) => handleInputChange('minimumAmount', parseFloat(e.target.value))}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Advanced Options */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-6 border-t pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Products/Services
                </label>
                <select
                  multiple
                  value={formData.applicableProducts}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    handleInputChange('applicableProducts', values)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Products & Services</option>
                  <optgroup label="Verification Services">
                    <option value="pan">PAN Card Verification</option>
                    <option value="aadhaar">Aadhaar Card Verification</option>
                    <option value="gstin">GSTIN Verification</option>
                    <option value="drivinglicense">Driving License Verification</option>
                    <option value="mca">MCA Verification</option>
                  </optgroup>
                  <optgroup label="Plan Verification Services">
                    <option value="personal">Personal Plan Verifications</option>
                    <option value="professional">Professional Plan Verifications</option>
                    <option value="business">Business Plan Verifications</option>
                  </optgroup>
                  <optgroup label="Plans">
                    <option value="basic-plan">Basic Plan</option>
                    <option value="premium-plan">Premium Plan</option>
                    <option value="enterprise-plan">Enterprise Plan</option>
                    <option value="starter-plan">Starter Plan</option>
                  </optgroup>
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple. Leave "All Products & Services" selected for universal coupons.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Categories
                </label>
                <select
                  multiple
                  value={formData.applicableCategories}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    handleInputChange('applicableCategories', values)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="personal">Personal Verification</option>
                  <option value="business">Business Verification</option>
                  <option value="government">Government Documents</option>
                  <option value="plan">Subscription Plans</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple. Leave "All Categories" selected for universal coupons.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.userRestrictions.newUsersOnly}
                      onChange={(e) => handleUserRestrictionChange('newUsersOnly', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">New Users Only</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Orders Required
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.userRestrictions.minimumOrders}
                    onChange={(e) => handleUserRestrictionChange('minimumOrders', parseInt(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCouponMutation.isPending || updateCouponMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {(createCouponMutation.isPending || updateCouponMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              <Save className="w-4 h-4" />
              {editingCouponId ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CouponForm 