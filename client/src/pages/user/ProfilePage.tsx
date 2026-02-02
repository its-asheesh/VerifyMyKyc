import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import type { RootState } from '../../redux/store'
import { updateUserProfile, logout } from '../../redux/slices/authSlice'
import { fetchActiveServices, fetchUserOrders, type Order } from '../../redux/slices/orderSlice'
import {
  User, Mail, Building, Phone, Shield, Edit, LogOut,
  Loader2, FileCheck, BadgeCheck, ShieldCheck, RefreshCw, PlusCircle, Lock
} from 'lucide-react'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading: authLoading } = useAppSelector((state: RootState) => state.auth)
  const { activeServices, orders } = useAppSelector((state: RootState) => state.orders)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  })
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'orders'>('services')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
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
    if (endDate && new Date(endDate) < new Date()) return 'text-red-600 bg-red-50 border-red-200'
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'expired': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-amber-600 bg-amber-50 border-amber-200'
    }
  }

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const toSlug = (value?: string) => {
    if (!value) return ''
    return value.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  const handleOpenService = (item: Order) => {
    try {
      if (item.orderType === 'verification') {
        const type = toSlug(item?.serviceDetails?.verificationType)
        if (type) { navigate(`/products/${type}`); return }
      } else if (item.orderType === 'plan') {
        const plan = toSlug(item?.serviceDetails?.planName)
        if (plan) { navigate(`/plans/${plan}`); return }
      }
    } catch {
      // ignore
    }
    navigate('/custom-pricing')
  }

  // Calculate grouped verifications outside JSX with null safety
  type GroupedVerifications = Record<string, Order & { ids: string[]; verificationQuota: { totalAllowed: number; used: number } }>;

  const groupedVerifications = activeServices?.verifications?.reduce((acc: GroupedVerifications, curr: Order) => {
    if (!curr) return acc; // Skip if verification is undefined

    const name = curr.serviceName;
    if (!name) return acc; // Skip if no service name

    if (!acc[name]) {
      acc[name] = {
        ...curr,
        verificationQuota: {
          totalAllowed: Number(curr.verificationQuota?.totalAllowed || 0),
          used: Number(curr.verificationQuota?.used || 0),
          remaining: Number(curr.verificationQuota?.remaining || 0),
          validityDays: Number(curr.verificationQuota?.validityDays || 0)
        },
        ids: [curr._id]
      };
    } else {
      acc[name].verificationQuota.totalAllowed += Number(curr.verificationQuota?.totalAllowed || 0);
      acc[name].verificationQuota.used += Number(curr.verificationQuota?.used || 0);
      if (curr.endDate && new Date(curr.endDate) > new Date(acc[name].endDate || 0)) {
        acc[name].endDate = curr.endDate;
      }
      if (curr._id) acc[name].ids.push(curr._id);
    }
    return acc;
  }, {}) || {};

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!isAuthenticated || !user) return null

  // Calculate Quick Stats
  // Calculate Quick Stats

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans text-gray-900">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Authentic Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                {/* User Identity Card */}
                <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BadgeCheck className="w-24 h-24" />
                  </div>
                  <div className="relative z-10 flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 text-white font-bold text-xl shadow-inner">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg leading-tight">{user?.name}</h2>
                      <div className="flex items-center gap-1 text-blue-300 text-xs font-medium mt-1 bg-blue-500/20 px-2 py-0.5 rounded-full w-fit border border-blue-500/30">
                        <BadgeCheck className="w-3 h-3" /> Verified User
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Navigation */}
                <nav className="p-4 bg-white space-y-2">
                  {[
                    { id: 'services', label: 'My Services', icon: ShieldCheck },
                    { id: 'orders', label: 'Transaction History', icon: FileCheck },
                    { id: 'profile', label: 'Account Settings', icon: User },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as 'profile' | 'services' | 'orders')}
                      className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-sm font-medium transition-all duration-200 border-l-4 ${activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                        }`}
                    >
                      <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                      {item.label}
                    </button>
                  ))}

                  <div className="my-2 border-t border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-l-4 border-transparent"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </nav>
              </div>

              {/* Security Badge */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <Lock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Secure Connection</p>
                  <p className="text-xs text-blue-600">Your data is encrypted and protected.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'services' && (
                  <div className="space-y-8">
                    {/* Trust Stats */}
                    {/* Services List */}
                    {activeServices ? (
                      <div className="space-y-8">
                        {/* Verifications */}
                        {activeServices.verifications.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                Active Verification
                              </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {Object.values(groupedVerifications).map((verification) => {
                                const daysRemaining = getRemainingDays(verification.endDate);
                                const isExpiringSoon = daysRemaining <= 7;

                                return (
                                  <div
                                    key={verification._id}
                                    className="group bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                                    onClick={() => handleOpenService(verification)}
                                  >
                                    {/* Security Strip */}
                                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 to-purple-600" />

                                    <div className="p-5">
                                      <div className="flex justify-between items-start mb-4">
                                        <div>
                                          <div className="flex items-center gap-2 mb-1">
                                            <BadgeCheck className="w-4 h-4 text-blue-600" />
                                            <h4 className="font-bold text-gray-900 text-lg">{verification.serviceName}</h4>
                                          </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider ${Number(verification.verificationQuota?.used) >= Number(verification.verificationQuota?.totalAllowed)
                                          ? 'text-red-600 bg-red-50 border-red-200'
                                          : getStatusColor(verification.status, verification.endDate)
                                          }`}>
                                          {Number(verification.verificationQuota?.used) >= Number(verification.verificationQuota?.totalAllowed)
                                            ? 'Exhausted'
                                            : (isExpiringSoon ? 'Expiring' : 'Active')}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm border-t border-b border-gray-100 py-3 bg-gray-50/50 -mx-5 px-5">
                                        <div>
                                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Valid Until</p>
                                          <p className="font-semibold text-gray-800">{formatDate(verification.endDate)}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Remaining</p>
                                          <p className={`font-semibold ${isExpiringSoon ? 'text-red-600' : 'text-blue-600'}`}>
                                            {daysRemaining} Days
                                          </p>
                                        </div>
                                      </div>

                                      {verification.verificationQuota?.totalAllowed ? (
                                        <div className="mb-4">
                                          <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-500 font-medium">Usage Limit</span>
                                            <span className="text-gray-900 font-bold">
                                              {Number(verification.verificationQuota?.used ?? 0)} / {Number(verification.verificationQuota?.totalAllowed ?? 0)}
                                            </span>
                                          </div>
                                          <div className="w-full bg-gray-100 rounded-full h-1.5 border border-gray-200">
                                            <div
                                              className={`h-full rounded-full transition-all duration-500 ${Number(verification.verificationQuota?.used) >= Number(verification.verificationQuota?.totalAllowed) ? 'bg-red-500' : 'bg-green-500'}`}
                                              style={{ width: `${Math.min(100, (Number(verification.verificationQuota?.used) / Number(verification.verificationQuota?.totalAllowed)) * 100)}%` }}
                                            />
                                          </div>
                                        </div>
                                      ) : null}

                                      {isExpiringSoon ? (
                                        <button className="w-full py-2.5 rounded-lg bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-2">
                                          <RefreshCw className="w-4 h-4" />
                                          Renew Now
                                        </button>
                                      ) : (
                                        <button className="w-full py-2.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-2">
                                          <PlusCircle className="w-4 h-4" />
                                          Purchase Credits
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Plans */}
                        {activeServices.plans.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-purple-600" />
                                Subscription Plans
                              </h3>
                              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-100">
                                {activeServices.plans.length} Active Plans
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {activeServices.plans.map((plan: Order) => {
                                const daysRemaining = getRemainingDays(plan.endDate);
                                const isExpiringSoon = daysRemaining <= 7;

                                return (
                                  <div key={plan._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-purple-300 transition-all shadow-sm group">
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{plan.serviceName}</h4>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-bold rounded border border-purple-100 uppercase tracking-wide">
                                          {plan.billingPeriod} Plan
                                        </span>
                                      </div>
                                      <span className={`px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider ${getStatusColor(plan.status, plan.endDate)}`}>
                                        Active
                                      </span>
                                    </div>

                                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                                      <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span>Expiration Date</span>
                                        <span className="font-semibold text-gray-900">{formatDate(plan.endDate)}</span>
                                      </div>
                                      <div className="flex justify-between pt-1">
                                        <span>Time Remaining</span>
                                        <span className={`font-semibold ${isExpiringSoon ? 'text-red-600' : 'text-purple-600'}`}>
                                          {daysRemaining} days
                                        </span>
                                      </div>
                                    </div>

                                    {isExpiringSoon ? (
                                      <button className="w-full py-2.5 rounded-lg bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-2">
                                        <RefreshCw className="w-4 h-4" />
                                        Renew Subscription
                                      </button>
                                    ) : (
                                      <button className="w-full py-2.5 rounded-lg bg-purple-50 text-purple-700 font-semibold text-sm hover:bg-purple-100 border border-purple-200 transition-colors flex items-center justify-center gap-2">
                                        <PlusCircle className="w-4 h-4" />
                                        Extend Plan
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Empty State */}
                        {(!activeServices || (activeServices.plans.length === 0 && activeServices.verifications.length === 0)) && (
                          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Protections</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                              Your account currently has no active verification services or plans.
                            </p>
                            <button
                              onClick={() => navigate('/products')}
                              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold transition-all shadow-md hover:shadow-lg"
                            >
                              Browse Services
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-200 bg-gray-50">
                      <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {orders.length > 0 ? (
                        orders.map((order: Order) => (
                          <div key={order.orderId} className="p-5 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 text-blue-600">
                                  <FileCheck className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900">{order.serviceName}</h4>
                                  <div className="flex items-center gap-3 mt-1 text-xs font-mono text-gray-500">
                                    <span>ID: {order.orderId}</span>
                                    <span>•</span>
                                    <span>{formatDate(order.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                                <span className={`px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider ${order.paymentStatus === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}>
                                  {order.paymentStatus}
                                </span>
                                <p className="text-lg font-bold text-gray-900">₹{order.finalAmount}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center text-gray-500">No transactions found</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Profile Settings Tab */}
                {activeTab === 'profile' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
                        <p className="text-gray-500 text-sm mt-1">Manage your personal and security information</p>
                      </div>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Details
                        </button>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm"
                          >
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {[
                        { label: 'Full Name', key: 'name', icon: User, type: 'text' },
                        { label: 'Email Address', key: 'email', icon: Mail, type: 'email', disabled: true },
                        { label: 'Company / Organization', key: 'company', icon: Building, type: 'text' },
                        { label: 'Phone Number', key: 'phone', icon: Phone, type: 'tel' },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">{field.label}</label>
                          <div className="relative">
                            <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={field.type}
                              value={formData[field.key as keyof typeof formData]}
                              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                              disabled={!isEditing || field.disabled}
                              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-all text-sm font-medium text-gray-900"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage