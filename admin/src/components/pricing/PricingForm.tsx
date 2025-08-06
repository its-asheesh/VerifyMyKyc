import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Loader2 } from 'lucide-react'
import type { VerificationPricing, HomepagePlan } from '../../services/api/pricingApi'

interface PricingFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading: boolean
  type: 'verification' | 'homepage'
  editData?: VerificationPricing | HomepagePlan | null
}

interface FormData {
  // Verification pricing fields
  verificationType: string
  monthlyPrice: number
  yearlyPrice: number
  oneTimePrice: number
  title: string
  description: string
  // Separate features for each pricing tier
  oneTimeFeatures: string[]
  monthlyFeatures: string[]
  yearlyFeatures: string[]
  highlighted: boolean
  popular: boolean
  color: string
  
  // Homepage plan fields
  planType: 'monthly' | 'yearly'
  planName: 'Personal' | 'Professional' | 'Business'
  name: string
  price: number
  includesVerifications: string[]
}

const PricingForm: React.FC<PricingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  type,
  editData
}) => {
  const [formData, setFormData] = useState<FormData>({
    // Verification pricing fields
    verificationType: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    oneTimePrice: 0,
    title: '',
    description: '',
    // Separate features for each pricing tier
    oneTimeFeatures: [''],
    monthlyFeatures: [''],
    yearlyFeatures: [''],
    highlighted: false,
    popular: false,
    color: '',
    
    // Homepage plan fields
    planType: 'monthly',
    planName: 'Personal',
    name: '',
    price: 0,
    includesVerifications: []
  })

  useEffect(() => {
    if (editData) {
      console.log('EditData received:', editData)
      console.log('Type:', type)
      
      // Handle different data types properly
      if (type === 'verification') {
        const verificationData = editData as VerificationPricing
        console.log('Verification data:', verificationData)
        setFormData({
          verificationType: verificationData.verificationType || '',
          monthlyPrice: verificationData.monthlyPrice || 0,
          yearlyPrice: verificationData.yearlyPrice || 0,
          oneTimePrice: verificationData.oneTimePrice || 0,
          title: verificationData.title || '',
          description: verificationData.description || '',
          // Separate features for each pricing tier
          oneTimeFeatures: verificationData.oneTimeFeatures || [''],
          monthlyFeatures: verificationData.monthlyFeatures || [''],
          yearlyFeatures: verificationData.yearlyFeatures || [''],
          highlighted: verificationData.highlighted || false,
          popular: verificationData.popular || false,
          color: verificationData.color || '',
          planType: 'monthly',
          planName: 'Personal',
          name: '',
          price: 0,
          includesVerifications: []
        })
      } else {
        const homepageData = editData as HomepagePlan
        console.log('Homepage data:', homepageData)
        console.log('Homepage features:', homepageData.features)
        setFormData({
          verificationType: '',
          monthlyPrice: 0,
          yearlyPrice: 0,
          oneTimePrice: 0,
          title: '',
          description: homepageData.description || '',
          // For homepage plans, use the features field and populate monthlyFeatures
          oneTimeFeatures: [''],
          monthlyFeatures: homepageData.features || [''],
          yearlyFeatures: [''],
          highlighted: homepageData.highlighted || false,
          popular: homepageData.popular || false,
          color: homepageData.color || '',
          planType: homepageData.planType || 'monthly',
          planName: homepageData.planName || 'Personal',
          name: homepageData.name || '',
          price: homepageData.price || 0,
          includesVerifications: homepageData.includesVerifications || []
        })
      }
    } else {
      // Reset form for new entry
      setFormData({
        verificationType: '',
        monthlyPrice: 0,
        yearlyPrice: 0,
        oneTimePrice: 0,
        title: '',
        description: '',
        // Separate features for each pricing tier
        oneTimeFeatures: [''],
        monthlyFeatures: [''],
        yearlyFeatures: [''],
        highlighted: false,
        popular: false,
        color: '',
        planType: 'monthly',
        planName: 'Personal',
        name: '',
        price: 0,
        includesVerifications: []
      })
    }
  }, [editData, type])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFeatureChange = (tier: 'oneTime' | 'monthly' | 'yearly', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`${tier}Features`]: (prev[`${tier}Features` as keyof FormData] as string[]).map((feature, i) => 
        i === index ? value : feature
      )
    }))
  }

  const addFeature = (tier: 'oneTime' | 'monthly' | 'yearly') => {
    setFormData(prev => ({
      ...prev,
      [`${tier}Features`]: [...(prev[`${tier}Features` as keyof FormData] as string[]), '']
    }))
  }

  const removeFeature = (tier: 'oneTime' | 'monthly' | 'yearly', index: number) => {
    setFormData(prev => ({
      ...prev,
      [`${tier}Features`]: (prev[`${tier}Features` as keyof FormData] as string[]).filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty features
    const submitData = type === 'verification'
      ? {
          verificationType: formData.verificationType,
          monthlyPrice: formData.monthlyPrice,
          yearlyPrice: formData.yearlyPrice,
          oneTimePrice: formData.oneTimePrice,
          title: formData.title,
          description: formData.description,
          oneTimeFeatures: formData.oneTimeFeatures.filter(f => f.trim() !== ''),
          monthlyFeatures: formData.monthlyFeatures.filter(f => f.trim() !== ''),
          yearlyFeatures: formData.yearlyFeatures.filter(f => f.trim() !== ''),
          highlighted: formData.highlighted,
          popular: formData.popular,
          color: formData.color
        }
      : {
          planType: formData.planType,
          planName: formData.planName,
          name: formData.name,
          price: formData.price,
          description: formData.description,
          features: formData.monthlyFeatures.filter(f => f.trim() !== ''), // Use monthlyFeatures for homepage plans
          highlighted: formData.highlighted,
          popular: formData.popular,
          color: formData.color,
          includesVerifications: formData.includesVerifications.length > 0
            ? formData.includesVerifications
            : ['aadhaar', 'pan', 'drivinglicense', 'gstin'] // Default to all verifications
        }
    
    console.log('Submitting data:', submitData)
    onSubmit(submitData)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {editData ? 'Edit' : 'Add'} {type === 'verification' ? 'Verification Pricing' : 'Homepage Plan'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {type === 'verification' ? (
            // Verification Pricing Fields
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Type *
                  </label>
                  <input
                    type="text"
                    value={formData.verificationType}
                    onChange={(e) => handleInputChange('verificationType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., aadhaar, pan, drivinglicense"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Aadhaar Verification"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Price *
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyPrice}
                    onChange={(e) => handleInputChange('monthlyPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yearly Price *
                  </label>
                  <input
                    type="number"
                    value={formData.yearlyPrice}
                    onChange={(e) => handleInputChange('yearlyPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    One Time Price *
                  </label>
                  <input
                    type="number"
                    value={formData.oneTimePrice}
                    onChange={(e) => handleInputChange('oneTimePrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            // Homepage Plan Fields
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type *
                  </label>
                  <select
                    value={formData.planType}
                    onChange={(e) => handleInputChange('planType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <select
                    value={formData.planName}
                    onChange={(e) => handleInputChange('planName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Personal">Personal</option>
                    <option value="Professional">Professional</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Personal Monthly"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Included Verifications
                </label>
                <div className="space-y-2">
                  {['aadhaar', 'pan', 'drivinglicense', 'gstin'].map((verification) => (
                    <div key={verification} className="flex items-center">
                      <input
                        type="checkbox"
                        id={verification}
                        checked={formData.includesVerifications.includes(verification)}
                        onChange={(e) => {
                          const newVerifications = e.target.checked
                            ? [...formData.includesVerifications, verification]
                            : formData.includesVerifications.filter(v => v !== verification)
                          handleInputChange('includesVerifications', newVerifications)
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={verification} className="ml-2 text-sm text-gray-700 capitalize">
                        {verification}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter description..."
              required
            />
          </div>

          {type === 'verification' ? (
            // Separate features for each pricing tier
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  One Time Features
                </label>
                <div className="space-y-2">
                  {formData.oneTimeFeatures.map((feature: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange('oneTime', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`One Time Feature ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature('oneTime', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addFeature('oneTime')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add One Time Feature
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Monthly Features
                </label>
                <div className="space-y-2">
                  {formData.monthlyFeatures.map((feature: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange('monthly', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Monthly Feature ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature('monthly', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addFeature('monthly')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Monthly Feature
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Yearly Features
                </label>
                <div className="space-y-2">
                  {formData.yearlyFeatures.map((feature: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange('yearly', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Yearly Feature ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature('yearly', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addFeature('yearly')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Yearly Feature
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Single features section for homepage plans
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                {formData.monthlyFeatures.map((feature: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange('monthly', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature('monthly', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFeature('monthly')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Feature
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="highlighted"
                checked={formData.highlighted}
                onChange={(e) => handleInputChange('highlighted', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="highlighted" className="ml-2 text-sm text-gray-700">
                Highlighted
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="popular"
                checked={formData.popular}
                onChange={(e) => handleInputChange('popular', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="popular" className="ml-2 text-sm text-gray-700">
                Popular
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., blue, purple, green"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editData ? 'Update' : 'Save'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default PricingForm 