import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import type { User as UserType } from '../../services/api/userApi'
import { useAddUserTokens } from '../../hooks/useUsers'
import pricingApi from '../../services/api/pricingApi'

interface AddTokensModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
}

interface VerificationOption {
  verificationType: string
  title: string
  description?: string
}

const AddTokensModal: React.FC<AddTokensModalProps> = ({ isOpen, onClose, user }) => {
  const [verificationType, setVerificationType] = useState('')
  const [numberOfTokens, setNumberOfTokens] = useState<number>(1)
  const [validityDays, setValidityDays] = useState<number>(30)
  const [verificationOptions, setVerificationOptions] = useState<VerificationOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const addUserTokens = useAddUserTokens()

  useEffect(() => {
    if (isOpen) {
      loadVerificationOptions()
    }
  }, [isOpen])

  const loadVerificationOptions = async () => {
    try {
      setLoadingOptions(true)
      const verifications = await pricingApi.getAvailableVerifications()
      const options: VerificationOption[] = verifications.map((v: any) => ({
        verificationType: v.verificationType,
        title: v.title || v.verificationType,
        description: v.description
      }))
      setVerificationOptions(options)
      if (options.length > 0 && !verificationType) {
        setVerificationType(options[0].verificationType)
      }
    } catch (err: any) {
      setError('Failed to load verification types')
      console.error('Failed to load verification options:', err)
    } finally {
      setLoadingOptions(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!user) {
      setError('User not selected')
      return
    }

    if (!verificationType) {
      setError('Please select a verification type')
      return
    }

    if (numberOfTokens <= 0) {
      setError('Number of tokens must be greater than 0')
      return
    }

    if (validityDays <= 0) {
      setError('Validity days must be greater than 0')
      return
    }

    try {
      await addUserTokens.mutateAsync({
        userId: user.id,
        data: {
          verificationType,
          numberOfTokens,
          validityDays
        }
      })
      setSuccess(`Successfully added ${numberOfTokens} tokens for ${verificationOptions.find(v => v.verificationType === verificationType)?.title || verificationType}`)
      
      // Reset form after 2 seconds and close
      setTimeout(() => {
        setVerificationType('')
        setNumberOfTokens(1)
        setValidityDays(30)
        setSuccess(null)
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add tokens. Please try again.')
      console.error('Failed to add tokens:', err)
    }
  }

  if (!isOpen || !user) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Tokens</h2>
            <p className="text-sm text-gray-500 mt-1">
              Add verification tokens for {user.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Verification Type */}
          <div>
            <label htmlFor="verificationType" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Service
            </label>
            {loadingOptions ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading services...</span>
              </div>
            ) : (
              <select
                id="verificationType"
                value={verificationType}
                onChange={(e) => setVerificationType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a verification service</option>
                {verificationOptions.map((option) => (
                  <option key={option.verificationType} value={option.verificationType}>
                    {option.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Number of Tokens */}
          <div>
            <label htmlFor="numberOfTokens" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Tokens
            </label>
            <input
              type="number"
              id="numberOfTokens"
              min="1"
              value={numberOfTokens}
              onChange={(e) => setNumberOfTokens(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Number of verification tokens to add
            </p>
          </div>

          {/* Validity Days */}
          <div>
            <label htmlFor="validityDays" className="block text-sm font-medium text-gray-700 mb-2">
              Validity (Days)
            </label>
            <input
              type="number"
              id="validityDays"
              min="1"
              value={validityDays}
              onChange={(e) => setValidityDays(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Number of days the tokens will be valid
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addUserTokens.isPending || loadingOptions}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {addUserTokens.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Tokens'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default AddTokensModal

