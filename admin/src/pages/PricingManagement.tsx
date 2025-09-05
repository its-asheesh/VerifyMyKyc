import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2,
  DollarSign, 
  Users, 
  Shield,
  Check,
  X,
  Loader2
} from 'lucide-react'
import { useToast } from '../context/ToastContext'
import PricingForm from '../components/pricing/PricingForm'
import {
  useVerificationPricing,
  useHomepagePlans,
  useAddVerificationPricing,
  useEditVerificationPricing,
  useDeleteVerificationPricing,
  useAddHomepagePlan,
  useEditHomepagePlan,
  useDeleteHomepagePlan
} from '../hooks/usePricing'
import type { VerificationPricing, HomepagePlan } from '../services/api/pricingApi'

const PricingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'homepage' | 'verification'>('homepage')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<VerificationPricing | HomepagePlan | null>(null)

  // API hooks
  const { 
    data: verificationPricing, 
    isLoading: verificationLoading, 
    error: verificationError 
  } = useVerificationPricing()
  
  const { 
    data: homepagePlans, 
    isLoading: homepageLoading, 
    error: homepageError 
  } = useHomepagePlans()

  // Mutation hooks
  const addVerificationMutation = useAddVerificationPricing()
  const editVerificationMutation = useEditVerificationPricing()
  const deleteVerificationMutation = useDeleteVerificationPricing()
  const addHomepageMutation = useAddHomepagePlan()
  const editHomepageMutation = useEditHomepagePlan()
  const deleteHomepageMutation = useDeleteHomepagePlan()
  const { showSuccess, showError } = useToast()

  // Debug information
  console.log('Pricing Management Debug:', {
    verificationPricing,
    verificationLoading,
    verificationError,
    homepagePlans,
    homepageLoading,
    homepageError,
    isArray: {
      verificationPricing: Array.isArray(verificationPricing),
      homepagePlans: Array.isArray(homepagePlans)
    }
  })

  const handleAdd = () => {
    setEditingPlan(null)
    setShowAddModal(true)
  }

  const handleEdit = (plan: VerificationPricing | HomepagePlan) => {
    setEditingPlan(plan)
    setShowAddModal(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (activeTab === 'verification') {
          await deleteVerificationMutation.mutateAsync(id)
          showSuccess('Verification pricing deleted successfully!')
        } else {
          await deleteHomepageMutation.mutateAsync(id)
          showSuccess('Homepage plan deleted successfully!')
        }
      } catch (error) {
        console.error('Delete failed:', error)
        showError('Failed to delete item. Please try again.')
      }
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingPlan) {
        // Edit existing
        if (activeTab === 'verification') {
          await editVerificationMutation.mutateAsync({ id: editingPlan._id, data })
          showSuccess('Verification pricing updated successfully!')
        } else {
          await editHomepageMutation.mutateAsync({ id: editingPlan._id, data })
          showSuccess('Homepage plan updated successfully!')
        }
      } else {
        // Add new
        if (activeTab === 'verification') {
          await addVerificationMutation.mutateAsync(data)
          showSuccess('Verification pricing added successfully!')
        } else {
          await addHomepageMutation.mutateAsync(data)
          showSuccess('Homepage plan added successfully!')
        }
      }
      setShowAddModal(false)
    } catch (error) {
      console.error('Submit failed:', error)
      showError('Failed to save item. Please try again.')
    }
  }

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Personal':
        return <Users className="w-5 h-5" />
      case 'Professional':
        return <Shield className="w-5 h-5" />
      case 'Business':
        return <DollarSign className="w-5 h-5" />
      default:
        return <DollarSign className="w-5 h-5" />
    }
  }

  const getVerificationIcon = (type: string) => {
    switch (type) {
      case 'aadhaar':
        return '🆔'
      case 'pan':
        return '💳'
      case 'drivinglicense':
        return '🚗'
      case 'gstin':
        return '🏢'
      case 'vehicle':
        return '🚗'
      default:
        return '📄'
    }
  }

  const isLoading = verificationLoading || homepageLoading
  const hasError = verificationError || homepageError

  // Ensure data is arrays
  const safeHomepagePlans = Array.isArray(homepagePlans) ? homepagePlans : []
  const safeVerificationPricing = Array.isArray(verificationPricing) ? verificationPricing : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600">Manage verification pricing and homepage plans</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {activeTab === 'verification' ? 'Verification' : 'Plan'}
        </button>
      </div>

      {/* Error Display */}
      {hasError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading pricing data</h3>
              <p className="text-sm text-red-600 mt-1">
                {verificationError?.message || homepageError?.message || 'Failed to load pricing information'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('homepage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'homepage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Homepage Plans
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'verification'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Verification Pricing
          </button>
        </nav>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTab === 'homepage' ? (
            // Homepage Plans
            safeHomepagePlans.map((plan) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      plan.color === 'blue' ? 'bg-blue-100' :
                      plan.color === 'purple' ? 'bg-purple-100' :
                      plan.color === 'green' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {getPlanIcon(plan.planName)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.planType} • {plan.planName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.highlighted && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Featured
                      </span>
                    )}
                    {plan.popular && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900">₹{plan.price}</p>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{plan.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            // Verification Pricing
            safeVerificationPricing.map((verification) => (
              <motion.div
                key={verification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getVerificationIcon(verification.verificationType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {verification.title || verification.verificationType}
                      </h3>
                      <p className="text-sm text-gray-500">{verification.verificationType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {verification.highlighted && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Featured
                      </span>
                    )}
                    {verification.popular && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">{verification.description}</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="font-semibold text-gray-900">₹{verification.monthlyPrice}</p>
                      <p className="text-gray-500">Monthly</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="font-semibold text-gray-900">₹{verification.yearlyPrice}</p>
                      <p className="text-gray-500">Yearly</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="font-semibold text-gray-900">₹{verification.oneTimePrice}</p>
                      <p className="text-gray-500">One Time</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <div className="space-y-3">
                    {/* One Time Features */}
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-1">One Time:</h5>
                      <ul className="space-y-1">
                        {verification.oneTimeFeatures?.slice(0, 2).map((feature, index) => (
                          <li key={index} className="flex items-center text-xs text-gray-600">
                            <Check className="w-3 h-3 text-green-500 mr-1" />
                            {feature}
                          </li>
                        ))}
                        {verification.oneTimeFeatures && verification.oneTimeFeatures.length > 2 && (
                          <li className="text-xs text-gray-500">
                            +{verification.oneTimeFeatures.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Monthly Features */}
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-1">Monthly:</h5>
                      <ul className="space-y-1">
                        {verification.monthlyFeatures?.slice(0, 2).map((feature, index) => (
                          <li key={index} className="flex items-center text-xs text-gray-600">
                            <Check className="w-3 h-3 text-green-500 mr-1" />
                            {feature}
                          </li>
                        ))}
                        {verification.monthlyFeatures && verification.monthlyFeatures.length > 2 && (
                          <li className="text-xs text-gray-500">
                            +{verification.monthlyFeatures.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Yearly Features */}
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-1">Yearly:</h5>
                      <ul className="space-y-1">
                        {verification.yearlyFeatures?.slice(0, 2).map((feature, index) => (
                          <li key={index} className="flex items-center text-xs text-gray-600">
                            <Check className="w-3 h-3 text-green-500 mr-1" />
                            {feature}
                          </li>
                        ))}
                        {verification.yearlyFeatures && verification.yearlyFeatures.length > 2 && (
                          <li className="text-xs text-gray-500">
                            +{verification.yearlyFeatures.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(verification)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(verification._id)}
                    className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !hasError && (
        activeTab === 'homepage' ? 
          (safeHomepagePlans.length === 0) :
          (safeVerificationPricing.length === 0)
      ) && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === 'homepage' ? 'plans' : 'verification pricing'} found
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first {activeTab === 'homepage' ? 'plan' : 'verification pricing'}.
          </p>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add {activeTab === 'homepage' ? 'Plan' : 'Verification'}
          </button>
        </div>
      )}

      {/* Pricing Form Modal */}
      <PricingForm
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEditingPlan(null)
        }}
        onSubmit={handleSubmit}
        isLoading={
          addVerificationMutation.isPending ||
          editVerificationMutation.isPending ||
          addHomepageMutation.isPending ||
          editHomepageMutation.isPending
        }
        type={activeTab}
        editData={editingPlan}
      />
    </div>
  )
}

export default PricingManagement 