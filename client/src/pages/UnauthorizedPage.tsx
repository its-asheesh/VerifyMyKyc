import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, Home, User } from 'lucide-react'
import { BackButton } from '../components/common/BackButton'
import { useAppSelector } from '../redux/hooks'

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to access this page
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10"
        >
          <div className="text-center space-y-6">
            <div className="text-gray-500">
              <p className="mb-2">
                Current role: <span className="font-semibold capitalize">{user?.role || 'Unknown'}</span>
              </p>
              <p className="text-sm">
                This page requires different permissions than your current role.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                View Profile
              </button>

              <BackButton label="Go Back" className="w-full justify-center" />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If you believe this is an error, please contact your administrator.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UnauthorizedPage 