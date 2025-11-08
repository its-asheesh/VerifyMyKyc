import React from 'react'
import { motion } from 'framer-motion'
import { X, User, Mail, Phone, Building, MapPin, Clock, CheckCircle, XCircle, Crown, Shield } from 'lucide-react'
import type { User as UserType } from '../../services/api/userApi'
import { useVerifyUserEmail, useVerifyUserPhone } from '../../hooks/useUsers'

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, user }) => {
  const verifyUserEmail = useVerifyUserEmail()
  const verifyUserPhone = useVerifyUserPhone()

  if (!isOpen || !user) return null

  const handleVerifyEmail = async () => {
    try {
      await verifyUserEmail.mutateAsync(user.id)
      // The query will automatically refresh, but we can also close and reopen if needed
    } catch (error) {
      console.error('Failed to verify email:', error)
    }
  }

  const handleVerifyPhone = async () => {
    try {
      await verifyUserPhone.mutateAsync(user.id)
      // The query will automatically refresh, but we can also close and reopen if needed
    } catch (error) {
      console.error('Failed to verify phone:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

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
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-700">
                {user.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : 'NA'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </div>
                  </div>
                )}
                {user.company && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Company</p>
                      <p className="text-sm text-gray-600">{user.company}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Role</p>
                    <div className="flex items-center space-x-2">
                      {user.role === 'admin' ? (
                        <Crown className="w-4 h-4 text-purple-500" />
                      ) : (
                        <User className="w-4 h-4 text-blue-500" />
                      )}
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    {user.isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status</p>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    {user.emailVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Email Verified</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        user.emailVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                      {!user.emailVerified && user.email && (
                        <button
                          onClick={handleVerifyEmail}
                          disabled={verifyUserEmail.isPending}
                          className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          {verifyUserEmail.isPending ? 'Verifying...' : 'Verify'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 flex items-center justify-center">
                      {user.phoneVerified === true ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Phone Verified</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          user.phoneVerified === true
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.phoneVerified === true ? 'Verified' : 'Not Verified'}
                        </span>
                        {user.phoneVerified !== true && (
                          <button
                            onClick={handleVerifyPhone}
                            disabled={verifyUserPhone.isPending}
                            className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            {verifyUserPhone.isPending ? 'Verifying...' : 'Verify'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          {user.location && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.location.country && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Country</p>
                    <p className="text-sm text-gray-600">{user.location.country}</p>
                  </div>
                )}
                {user.location.city && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">City</p>
                    <p className="text-sm text-gray-600">{user.location.city}</p>
                  </div>
                )}
                {user.location.region && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Region</p>
                    <p className="text-sm text-gray-600">{user.location.region}</p>
                  </div>
                )}
                {user.location.timezone && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Timezone</p>
                    <p className="text-sm text-gray-600">{user.location.timezone}</p>
                  </div>
                )}
                {user.location.ipAddress && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">IP Address</p>
                    <p className="text-sm text-gray-600 font-mono">{user.location.ipAddress}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Activity Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Account Created</p>
                <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                <p className="text-xs text-gray-500">{formatRelativeDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-600">{formatDate(user.updatedAt)}</p>
                <p className="text-xs text-gray-500">{formatRelativeDate(user.updatedAt)}</p>
              </div>
              {user.lastLogin && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Login</p>
                  <p className="text-sm text-gray-600">{formatDate(user.lastLogin)}</p>
                  <p className="text-xs text-gray-500">{formatRelativeDate(user.lastLogin)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default UserDetailsModal
