import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, X, Loader2 } from 'lucide-react'

interface VerificationConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
  serviceName: string
  formData: Record<string, any>
  tokenCost?: number
}

export const VerificationConfirmDialog: React.FC<VerificationConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  serviceName,
  formData,
  tokenCost = 1
}) => {
  // Extract key form data for display
  const getDisplayData = () => {
    const displayData: { label: string; value: any }[] = []
    
    // Common fields to show
    const commonFields = ['name', 'document_number', 'pan', 'aadhaar', 'mobile', 'email', 'account_number', 'ifsc', 'vpa']
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value && value !== '' && commonFields.includes(key)) {
        let displayValue = value
        
        // Mask sensitive data
        if (key === 'account_number' && typeof value === 'string') {
          displayValue = value.replace(/.(?=.{4})/g, 'X')
        } else if (key === 'pan' && typeof value === 'string') {
          displayValue = value.replace(/.(?=.{2})/g, 'X')
        } else if (key === 'aadhaar' && typeof value === 'string') {
          displayValue = value.replace(/.(?=.{4})/g, 'X')
        }
        
        displayData.push({
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: displayValue
        })
      }
    })
    
    return displayData.slice(0, 5) // Show max 5 fields
  }

  const displayData = getDisplayData()

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
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Verification</h3>
                  <p className="text-sm text-gray-600">Please review your details before proceeding</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Service Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Service: {serviceName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-amber-700">
                    This verification will consume {tokenCost} verification token{tokenCost > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Form Data Preview */}
              {displayData.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Details to be verified:</h4>
                  <div className="space-y-2">
                    {displayData.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">{item.label}:</span>
                        <span className="text-sm text-gray-900 font-mono">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-900 mb-1">Important Notice</h4>
                    <p className="text-sm text-amber-800">
                      Once you proceed, this verification will consume your token. Please ensure all details are correct before confirming.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm & Verify
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
