import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, User, Mail, Building, Clock,
  CheckCircle, XCircle, Crown, Shield, Calendar,
  Globe, Smartphone
} from 'lucide-react'
import type { User as UserType } from '../../services/api/userApi'
import { useVerifyUserEmail, useVerifyUserPhone } from '../../hooks/useUsers'
import { formatDate } from '../../utils/dateUtils'


interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
  onStatusToggle: (userId: string) => void
  onRoleChange: (userId: string, newRole: 'user' | 'admin') => void
  onAddTokens: (user: UserType) => void
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  onStatusToggle,
  onRoleChange,
  onAddTokens
}) => {
  const verifyUserEmail = useVerifyUserEmail()
  const verifyUserPhone = useVerifyUserPhone()

  if (!isOpen || !user) return null

  const handleVerifyEmail = async () => {
    try {
      await verifyUserEmail.mutateAsync(user.id)
    } catch (error) {
      console.error('Failed to verify email:', error)
    }
  }

  const handleVerifyPhone = async () => {
    try {
      await verifyUserPhone.mutateAsync(user.id)
    } catch (error) {
      console.error('Failed to verify phone:', error)
    }
  }



  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="absolute top-4 left-6 text-white/90 font-medium tracking-wide text-sm uppercase">User Profile</div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pb-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-6 gap-5 relative z-10">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-black/5">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-4xl font-bold text-indigo-600 select-none">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-300'}`} title={user.isActive ? 'Active' : 'Inactive'}></div>
              </div>

              <div className="flex-1 min-w-0 pb-2">
                <h2 className="text-3xl font-bold text-gray-900 truncate tracking-tight">{user.name}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1.5">
                  <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${user.role === 'admin'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                    {user.role === 'admin' ? <Crown className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {user.role}
                  </div>
                  {user.company && (
                    <div className="flex items-center text-gray-600">
                      <Building className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      <span className="truncate max-w-[200px]">{user.company}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  onClick={() => onAddTokens(user)}
                  className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-95"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Add Tokens
                </button>
                <button
                  onClick={() => onStatusToggle(user.id)}
                  className={`p-2 rounded-lg border transition-colors ${user.isActive
                    ? 'border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200'
                    : 'border-green-200 text-green-600 hover:bg-green-50'
                    }`}
                  title={user.isActive ? 'Deactivate User' : 'Activate User'}
                >
                  {user.isActive ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Verification Alert */}
            {(!user.emailVerified || (user.phone && !user.phoneVerified)) && (
              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-3">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-900">Verification Pending</h3>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-xs text-yellow-700">
                    {!user.emailVerified && (
                      <div className="flex items-center gap-2">
                        <span>Email not verified</span>
                        <button
                          onClick={handleVerifyEmail}
                          disabled={verifyUserEmail.isPending}
                          className="underline hover:text-yellow-900 disabled:opacity-50"
                        >
                          {verifyUserEmail.isPending ? 'Sending...' : 'Verify Now'}
                        </button>
                      </div>
                    )}
                    {user.phone && !user.phoneVerified && (
                      <div className="flex items-center gap-2">
                        <span>Phone not verified</span>
                        <button
                          onClick={handleVerifyPhone}
                          disabled={verifyUserPhone.isPending}
                          className="underline hover:text-yellow-900 disabled:opacity-50"
                        >
                          {verifyUserPhone.isPending ? 'Sending...' : 'Verify Now'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      {user.emailVerified && <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5"><CheckCircle className="w-3 h-3" /> Verified</p>}
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                        {user.phoneVerified && <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5"><CheckCircle className="w-3 h-3" /> Verified</p>}
                      </div>
                    </div>
                  )}
                  {user.company && (
                    <div className="flex items-start gap-3">
                      <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-900">{user.company}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity & Location */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Activity & Location</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Joined</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt, 'long')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Last Login</p>
                      <p className="text-sm font-medium text-gray-900">{user.lastLogin ? formatDate(user.lastLogin, 'long') : 'Never'}</p>
                    </div>
                  </div>
                  {user.location && (
                    <div className="flex items-start gap-3 pt-1">
                      <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-gray-900">{[user.location.city, user.location.region, user.location.country].filter(Boolean).join(', ') || 'Unknown Location'}</p>
                        {user.location.ipAddress && <p className="text-xs text-gray-500 mt-0.5 font-mono">{user.location.ipAddress}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span className="font-mono">{user.id}</span>
            <button
              onClick={() => onRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
              className="text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UserDetailsModal
