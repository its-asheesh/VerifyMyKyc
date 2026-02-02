"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { BackButton } from "../components/common/BackButton"
import { usePricingContext } from "../context/PricingContext"

const CustomPricingPage: React.FC = () => {
  const navigate = useNavigate()
  const { availableVerifications, verificationsLoading, verificationsError } = usePricingContext()
  const [selectedVerifications, setSelectedVerifications] = useState<string[]>([])

  const handleVerificationToggle = (verificationType: string) => {
    setSelectedVerifications(prev =>
      prev.includes(verificationType)
        ? prev.filter(v => v !== verificationType)
        : [...prev, verificationType]
    )
  }

  const handleContinue = () => {
    if (selectedVerifications.length === 1) {
      // Map verification types to product IDs
      const productIdMap: { [key: string]: string } = {
        'pan': '1',
        'aadhaar': '2',
        'drivinglicense': '4',
        'gstin': '5' // Assuming GSTIN would be ID 5
      }

      const productId = productIdMap[selectedVerifications[0]]
      if (productId) {
        navigate(`/products/${productId}`)
      } else {
        // Fallback to products page with identity category
        navigate('/products?category=identity')
      }
    } else if (selectedVerifications.length > 1) {
      // Navigate to checkout page for multiple services
      navigate('/checkout', {
        state: { selectedVerifications }
      })
    }
  }

  const getVerificationIcon = (verificationType: string) => {
    switch (verificationType) {
      case 'aadhaar':
        return '🆔'
      case 'pan':
        return '💳'
      case 'drivinglicense':
        return '🚗'
      case 'gstin':
        return '🏢'
      default:
        return '📄'
    }
  }

  const getVerificationColor = (verificationType: string) => {
    switch (verificationType) {
      case 'aadhaar':
        return 'from-blue-500 to-blue-600'
      case 'pan':
        return 'from-green-500 to-green-600'
      case 'drivinglicense':
        return 'from-purple-500 to-purple-600'
      case 'gstin':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Choose Your Verifications</h1>
              <p className="text-gray-600 mt-1">Select the verification services you need</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {verificationsLoading ? (
          // Loading state
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading verification options...</p>
          </div>
        ) : verificationsError ? (
          // Error state
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load verification options. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          // Success state
          <>
            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Select Verification Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the verification services you need. You can select multiple services or focus on a specific one.
                Each service includes comprehensive verification features and API access.
              </p>
            </motion.div>

            {/* Verification Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {availableVerifications?.map((verification, index) => (
                <motion.div
                  key={verification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedVerifications.includes(verification.verificationType)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => handleVerificationToggle(verification.verificationType)}
                >
                  {/* Selection indicator */}
                  {selectedVerifications.includes(verification.verificationType) && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-r ${getVerificationColor(verification.verificationType)} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                    {getVerificationIcon(verification.verificationType)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {verification.title || verification.verificationType}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">
                    {verification.description}
                  </p>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">One-time:</span>
                      <span className="font-semibold">₹{verification.oneTimePrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monthly:</span>
                      <span className="font-semibold">₹{verification.monthlyPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Yearly:</span>
                      <span className="font-semibold">₹{verification.yearlyPrice}</span>
                    </div>
                  </div>

                  {/* Features */}
                  {verification.oneTimeFeatures && verification.oneTimeFeatures.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Includes:</p>
                      <ul className="space-y-1">
                        {verification.oneTimeFeatures.slice(0, 3).map((feature, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <button
                onClick={handleContinue}
                disabled={selectedVerifications.length === 0}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${selectedVerifications.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
              >
                {selectedVerifications.length === 0
                  ? 'Select a verification service'
                  : selectedVerifications.length === 1
                    ? `View ${selectedVerifications[0]} product details`
                    : `Proceed to Checkout (${selectedVerifications.length} services)`}
              </button>
            </motion.div>

            {/* Selection Summary */}
            {selectedVerifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <h3 className="font-semibold text-blue-900 mb-2">Selected Services:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVerifications.map(verificationType => {
                    const verification = availableVerifications?.find(v => v.verificationType === verificationType)
                    return (
                      <span
                        key={verificationType}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {getVerificationIcon(verificationType)}
                        {verification?.title || verificationType}
                      </span>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CustomPricingPage 