import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchUserProfile, updateUserProfile, logout } from '../redux/slices/authSlice'
import { fetchActiveServices, fetchUserOrders } from '../redux/slices/orderSlice'
import { 
  User, Mail, Building, Phone, Calendar, Shield, Edit, Save, X, LogOut, 
  Loader2, CheckCircle, Clock, AlertCircle, CreditCard, Package, Zap,
  CalendarDays, TrendingUp, AlertTriangle
} from 'lucide-react'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const { activeServices, orders, isLoading: ordersLoading } = useAppSelector((state) => state.orders)
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  })
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'orders'>('profile')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    dispatch(fetchUserProfile())
    dispatch(fetchActiveServices())
    dispatch(fetchUserOrders())
  }, [dispatch, isAuthenticated, navigate])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        company: user.company || '',
        phone: user.phone || ''
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap()
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const getStatusColor = (status: string, endDate?: string) => {
    // Check if service is expired based on endDate
    if (endDate && new Date(endDate) < new Date()) {
      return 'text-red-600 bg-red-100'
    }
    
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'expired':
        return 'text-red-600 bg-red-100'
      case 'cancelled':
        return 'text-gray-600 bg-gray-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusIcon = (status: string, endDate?: string) => {
    // Check if service is expired based on endDate
    if (endDate && new Date(endDate) < new Date()) {
      return <AlertCircle className="w-4 h-4" />
    }
    
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'expired':
        return <AlertCircle className="w-4 h-4" />
      case 'cancelled':
        return <X className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string, endDate?: string) => {
    // Check if service is expired based on endDate
    if (endDate && new Date(endDate) < new Date()) {
      return 'Expired'
    }
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account and view your services</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'services', label: 'My Services', icon: Package },
                  { id: 'orders', label: 'Order History', icon: CreditCard }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span>{user.company || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user.phone || 'Not specified'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Services</h2>
                  {ordersLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                </div>

                {activeServices ? (
                  <div className="space-y-6">
                    {/* Active Plans */}
                    {activeServices.plans.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Package className="w-5 h-5 text-blue-600" />
                          Active Plans
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {activeServices.plans.map((plan) => (
                            <div key={plan._id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-medium text-gray-900">{plan.serviceName}</h4>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status, plan.endDate)}`}>
                                  {getStatusIcon(plan.status, plan.endDate)}
                                  {getStatusText(plan.status, plan.endDate)}
                                </span>
                              </div>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                  <span>Amount:</span>
                                  <span className="font-medium">₹{plan.finalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Billing:</span>
                                  <span className="font-medium capitalize">{plan.billingPeriod}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Valid until:</span>
                                  <span className="font-medium">{formatDate(plan.endDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Remaining:</span>
                                  <span className={`font-medium ${getRemainingDays(plan.endDate) < 7 && getRemainingDays(plan.endDate) > 0 ? 'text-red-600' : getRemainingDays(plan.endDate) === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {getRemainingDays(plan.endDate) === 0 ? 'Expired' : `${getRemainingDays(plan.endDate)} days`}
                                  </span>
                                </div>
                                {plan.verificationQuota?.totalAllowed ? (
                                  <div className="flex justify-between">
                                    <span>Usage:</span>
                                    <span
                                      className={`font-medium ${((Number(plan.verificationQuota?.remaining ?? (Number(plan.verificationQuota?.totalAllowed ?? 0) - Number(plan.verificationQuota?.used ?? 0))) <= 0) || (Number(plan.verificationQuota?.used ?? 0) >= Number(plan.verificationQuota?.totalAllowed ?? 0))) ? 'text-red-600' : ''}`}
                                    >
                                      {Number(plan.verificationQuota?.used ?? 0)}/{Number(plan.verificationQuota?.totalAllowed ?? 0)}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                              {plan.serviceDetails.features && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-500 mb-2">Features:</p>
                                  <div className="space-y-1">
                                    {plan.serviceDetails.features.slice(0, 3).map((feature, index) => (
                                      <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        {feature}
                                      </div>
                                    ))}
                                    {plan.serviceDetails.features.length > 3 && (
                                      <p className="text-xs text-gray-500">+{plan.serviceDetails.features.length - 3} more</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Active Verifications */}
                    {activeServices.verifications.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          Active Verifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {activeServices.verifications.map((verification) => (
                            <div key={verification._id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-medium text-gray-900">{verification.serviceName}</h4>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(verification.status, verification.endDate)}`}>
                                  {getStatusIcon(verification.status, verification.endDate)}
                                  {getStatusText(verification.status, verification.endDate)}
                                </span>
                              </div>
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                  <span>Type:</span>
                                  <span className="font-medium capitalize">{verification.serviceDetails.verificationType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Amount:</span>
                                  <span className="font-medium">₹{verification.finalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Valid until:</span>
                                  <span className="font-medium">{formatDate(verification.endDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Remaining:</span>
                                  <span className={`font-medium ${getRemainingDays(verification.endDate) < 7 && getRemainingDays(verification.endDate) > 0 ? 'text-red-600' : getRemainingDays(verification.endDate) === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {getRemainingDays(verification.endDate) === 0 ? 'Expired' : `${getRemainingDays(verification.endDate)} days`}
                                  </span>
                                </div>
                                {verification.verificationQuota?.totalAllowed ? (
                                  <div className="flex justify-between">
                                    <span>Usage:</span>
                                    <span
                                      className={`font-medium ${((Number(verification.verificationQuota?.remaining ?? (Number(verification.verificationQuota?.totalAllowed ?? 0) - Number(verification.verificationQuota?.used ?? 0))) <= 0) || (Number(verification.verificationQuota?.used ?? 0) >= Number(verification.verificationQuota?.totalAllowed ?? 0))) ? 'text-red-600' : ''}`}
                                    >
                                      {Number(verification.verificationQuota?.used ?? 0)}/{Number(verification.verificationQuota?.totalAllowed ?? 0)}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expired Services Section */}
                    {(() => {
                      const expiredPlans = activeServices?.plans?.filter(plan => 
                        plan.endDate && new Date(plan.endDate) < new Date()
                      ) || [];
                      const expiredVerifications = activeServices?.verifications?.filter(verification => 
                        verification.endDate && new Date(verification.endDate) < new Date()
                      ) || [];
                      
                      if (expiredPlans.length > 0 || expiredVerifications.length > 0) {
                        return (
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                              Expired Services
                            </h3>
                            
                            {expiredPlans.length > 0 && (
                              <div className="mb-6">
                                <h4 className="text-md font-medium text-gray-700 mb-3">Expired Plans</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {expiredPlans.map((plan) => (
                                    <div key={plan._id} className="border border-red-200 bg-red-50 rounded-lg p-4 opacity-75">
                                      <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-medium text-gray-900">{plan.serviceName}</h4>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                                          <AlertCircle className="w-4 h-4" />
                                          Expired
                                        </span>
                                      </div>
                                      <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                          <span>Amount:</span>
                                          <span className="font-medium">₹{plan.finalAmount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Billing:</span>
                                          <span className="font-medium capitalize">{plan.billingPeriod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Expired on:</span>
                                          <span className="font-medium">{formatDate(plan.endDate)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {expiredVerifications.length > 0 && (
                              <div>
                                <h4 className="text-md font-medium text-gray-700 mb-3">Expired Verifications</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {expiredVerifications.map((verification) => (
                                    <div key={verification._id} className="border border-red-200 bg-red-50 rounded-lg p-4 opacity-75">
                                      <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-medium text-gray-900">{verification.serviceName}</h4>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                                          <AlertCircle className="w-4 h-4" />
                                          Expired
                                        </span>
                                      </div>
                                      <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                          <span>Type:</span>
                                          <span className="font-medium capitalize">{verification.serviceDetails.verificationType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Amount:</span>
                                          <span className="font-medium">₹{verification.finalAmount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Expired on:</span>
                                          <span className="font-medium">{formatDate(verification.endDate)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* No Services */}
                    {(!activeServices || (activeServices.plans.length === 0 && activeServices.verifications.length === 0)) && (
                      <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Services</h3>
                        <p className="text-gray-600 mb-6">You haven't purchased any services yet.</p>
                        <button
                          onClick={() => navigate('/custom-pricing')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Zap className="w-4 h-4" />
                          Browse Services
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading your services...</p>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
                  {ordersLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{order.serviceName}</h4>
                            <p className="text-sm text-gray-600">Order ID: {order.orderId}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status, order.endDate)}`}>
                              {getStatusIcon(order.status, order.endDate)}
                              {getStatusText(order.status, order.endDate)}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">₹{order.finalAmount}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Type:</span>
                            <p className="capitalize">{order.orderType}</p>
                          </div>
                          <div>
                            <span className="font-medium">Billing:</span>
                            <p className="capitalize">{order.billingPeriod}</p>
                          </div>
                          <div>
                            <span className="font-medium">Payment:</span>
                            <p className="capitalize">{order.paymentMethod}</p>
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>
                            <p>{formatDate(order.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                    <button
                      onClick={() => navigate('/custom-pricing')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage 