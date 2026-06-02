import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tag, Check, X, Loader2 } from 'lucide-react'
import couponApi from '../../services/api/couponApi'
import type { CouponValidationResponse } from '../../services/api/couponApi'
import type { RootState } from '../../redux/store'

interface CouponInputProps {
  orderAmount: number
  onCouponApplied: (couponData: CouponValidationResponse) => void
  onCouponRemoved: () => void
  appliedCoupon?: CouponValidationResponse | null
  serviceType?: string
  category?: string
}

const CouponInput: React.FC<CouponInputProps> = ({
  orderAmount,
  onCouponApplied,
  onCouponRemoved,
  appliedCoupon,
  serviceType,
  category
}) => {
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const user = useSelector((state: RootState) => state.auth.user)

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code')
      return
    }

    setIsValidating(true)
    setError('')
    setSuccess('')

    try {

      const result = await couponApi.validateCoupon(
        couponCode.trim().toUpperCase(),
        orderAmount,
        user?.id,
        serviceType,
        category
      )

      setSuccess('Coupon applied successfully!')
      onCouponApplied(result)
      setCouponCode('')
    } catch (error: any) {
      console.error('Coupon validation error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      })

      // Log the exact error response
      if (error.response?.data) {
        console.error('Backend error response:', error.response.data)
      }

      let errorMessage = 'Invalid coupon code'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
      // Reset any previously applied coupon on error
      onCouponRemoved()
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveCoupon = () => {
    onCouponRemoved()
    setError('')
    setSuccess('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleValidateCoupon()
    }
  }

  if (appliedCoupon && appliedCoupon.coupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">
                Coupon Applied: {appliedCoupon.coupon.code}
              </p>
              <p className="text-sm text-green-700">
                {appliedCoupon.coupon.name} - {appliedCoupon.coupon.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-900">
              -₹{appliedCoupon.discount.toFixed(2)}
            </p>
            <p className="text-sm text-green-700">
              Final: ₹{appliedCoupon.finalAmount.toFixed(2)}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemoveCoupon}
          className="mt-3 text-sm text-green-600 hover:text-green-800 underline"
        >
          Remove coupon
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            id="coupon-code"
            name="coupon-code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter coupon code"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isValidating}
          />
        </div>
        <button
          onClick={handleValidateCoupon}
          disabled={isValidating || !couponCode.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isValidating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Apply
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>• Enter your coupon code to get instant discounts</p>
        <p>• Minimum order amount may apply</p>
        <p>• One coupon per order</p>
      </div>
    </div>
  )
}

export default CouponInput 