import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, ShoppingCart, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NoQuotaDialogProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  verificationType?: string
}

export const NoQuotaDialog: React.FC<NoQuotaDialogProps> = ({
  isOpen,
  onClose,
  serviceName,
  verificationType = 'verification'
}) => {
  const navigate = useNavigate()

  const handlePurchaseClick = () => {
    onClose()
    // Navigate to pricing page - adjust path as needed
    navigate('/pricing')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">No Verification Quota</h3>
                  <p className="text-sm text-gray-600">You need to purchase verification tokens</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Service Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Service: {serviceName}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  To use this verification service, you need to purchase a verification plan.
                </p>
              </div>

              {/* Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-900 mb-1">Verification Quota Required</h4>
                    <p className="text-sm text-red-800">
                      Your verification quota has been exhausted or you haven't purchased any verification tokens yet.
                      Please purchase a plan to continue using verification services.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">What you'll get:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Access to all verification services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Flexible pricing plans (one-time, monthly, yearly)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>Secure and instant verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>24/7 support and assistance</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchaseClick}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                View Pricing Plans
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

