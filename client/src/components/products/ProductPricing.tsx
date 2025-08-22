"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Check, Star, Shield, Zap, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import type { Product } from "../../types/product"
import { useVerificationPricing } from "../../hooks/usePricing"
import { PricingCard } from "../pricing/PricingCard"
import { useAppSelector } from "../../redux/hooks"

interface ProductPricingProps {
  product: Product
}

export const ProductPricing: React.FC<ProductPricingProps> = ({ product }) => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  
  const handleChoosePlan = (tier: any) => {
    const verificationType = getVerificationType(product)
    console.log('=== PRODUCT PAGE DEBUG ===')
    console.log('Product title:', product.title)
    console.log('Detected verification type:', verificationType)
    console.log('Selected services array:', [verificationType])
    
    // If not logged in, redirect to login with a helpful message and the intended checkout payload
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          message: 'Please login to continue to checkout',
          redirectTo: '/checkout',
          nextState: {
            selectedPlan: tier.name,
            billingPeriod: tier.period === 'one-time' ? 'one-time' : tier.period === 'month' ? 'monthly' : 'yearly',
            selectedServices: [verificationType],
            productInfo: product,
            tierInfo: tier,
          },
        },
      })
      return
    }
    
    // Navigate to checkout page with the selected plan and product info
    navigate('/checkout', {
      state: {
        selectedPlan: tier.name,
        billingPeriod: tier.period === 'one-time' ? 'one-time' : tier.period === 'month' ? 'monthly' : 'yearly',
        selectedServices: [verificationType],
        productInfo: product,
        tierInfo: tier
      }
    })
  }

  const handlePlanHover = (planName: string) => {
    setSelectedPlan(planName)
  }

  const handlePlanLeave = () => {
    setSelectedPlan(null)
  }
  
  // Resolve verification type from product (prefer stable id, fallback to title)
  const getVerificationType = (prod: Product): string => {
    const id = (prod.id || '').toLowerCase()
    if ([
      'aadhaar',
      'pan',
      'drivinglicense',
      'gstin',
      'company',
      'voterid',
      'bankaccount',
      'vehicle',
    ].includes(id)) return id

    const title = (prod.title || '').toLowerCase()
    // Important: check company/MCA first to avoid matching 'pan' inside 'company'
    if (title.includes('company') || title.includes('mca') || title.includes('cin') || title.includes('din')) return 'company'
    if (title.includes('pan')) return 'pan'
    if (title.includes('aadhaar')) return 'aadhaar'
    if (title.includes('driving license') || title.includes('drivinglicense')) return 'drivinglicense'
    if (title.includes('gstin')) return 'gstin'
    if (title.includes('voter')) return 'voterid'
    if (title.includes('bank account') || title.includes('bankaccount') || title.includes('banking')) return 'bankaccount'
    // RC product mapping (avoid overly-broad "vehicle" to prevent misclassification)
    if (title.includes('vehicle') || title.includes('registration certificate')) return 'vehicle'
    return ''
  }

  const verificationType = getVerificationType(product)
  const { data: verificationPricing, isLoading: verificationsLoading, error: verificationsError } = useVerificationPricing(verificationType)

  console.log('Product title:', product.title)
  console.log('Verification type:', verificationType)
  console.log('Verification pricing data:', verificationPricing)

  // Get icon based on verification type
  const getVerificationIcon = (verificationType: string) => {
    switch (verificationType) {
      case 'aadhaar':
        return Shield
      case 'pan':
        return Users
      case 'drivinglicense':
        return Zap
      case 'gstin':
        return Star
      default:
        return Shield
    }
  }

  // If we have backend pricing data, use it; otherwise fall back to mock data
  const pricingTiers = verificationPricing ? [
    {
      name: "One-time",
      price: verificationPricing.oneTimePrice,
      requests: (() => {
        const c = verificationPricing.oneTimeQuota?.count
        const v = verificationPricing.oneTimeQuota?.validityDays
        const base = c ? `Includes ${c} verification${c > 1 ? 's' : ''}` : 'Single verification'
        return v && v > 0 ? `${base} • valid ${v} days` : base
      })(),
      features: verificationPricing.oneTimeFeatures || [],
      color: "blue" as const, // Changed from gray to blue since PricingCard doesn't support gray
      support: "Email support",
      period: "one-time",
      billingPeriod: 'custom' as const,
      popular: false
    },
    {
      name: "Monthly",
      price: verificationPricing.monthlyPrice,
      requests: (() => {
        const c = verificationPricing.monthlyQuota?.count
        const v = verificationPricing.monthlyQuota?.validityDays
        const base = c ? `Includes ${c} verification${c > 1 ? 's' : ''}` : 'Unlimited verifications'
        return v && v > 0 ? `${base} • valid ${v} days` : base
      })(),
      features: verificationPricing.monthlyFeatures || [],
      color: "blue" as const,
      support: "Priority support",
      period: "month",
      billingPeriod: 'monthly' as const,
      popular: true
    },
    {
      name: "Yearly",
      price: verificationPricing.yearlyPrice,
      requests: (() => {
        const c = verificationPricing.yearlyQuota?.count
        const v = verificationPricing.yearlyQuota?.validityDays
        const base = c ? `Includes ${c} verification${c > 1 ? 's' : ''}` : 'Unlimited verifications'
        return v && v > 0 ? `${base} • valid ${v} days` : base
      })(),
      features: verificationPricing.yearlyFeatures || [],
      color: "purple" as const,
      support: "24/7 support",
      period: "year",
      billingPeriod: 'yearly' as const,
      popular: false
    },
  ] : [
    {
      name: "Free",
      ...product.pricing.free,
      requests: String(product.pricing.free.requests),
      color: "blue" as const, // Changed from gray to blue
      period: "month",
      billingPeriod: 'monthly' as const,
      popular: false
    },
    {
      name: "Basic",
      ...product.pricing.basic,
      requests: String(product.pricing.basic.requests),
      color: "blue" as const,
      period: "month",
      billingPeriod: 'monthly' as const,
      popular: false
    },
    {
      name: "Premium",
      ...product.pricing.premium,
      requests: String(product.pricing.premium.requests),
      color: "purple" as const,
      period: "month",
      billingPeriod: 'monthly' as const,
      popular: true
    },
  ]

  console.log('Pricing tiers:', pricingTiers)

  if (verificationsLoading) {
    return (
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading pricing information...</p>
        </div>
      </section>
    )
  }

  if (verificationsError) {
    return (
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load pricing information. Using default pricing.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Flexible pricing options to match your verification needs and scale with your business
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <PricingCard
              title={tier.name}
              price={`₹${tier.price}`}
              description={tier.requests}
              features={tier.features}
              icon={getVerificationIcon(verificationType)}
              color={tier.color}
              popular={tier.popular}
              isHovered={selectedPlan === tier.name}
              billingPeriod={tier.billingPeriod}
              onHover={() => handlePlanHover(tier.name)}
              onHoverEnd={handlePlanLeave}
              planData={{
                name: tier.name,
                price: String(tier.price),
                description: tier.requests,
                features: tier.features,
                planType: tier.billingPeriod,
                planName: tier.name,
                support: tier.support,
                period: tier.period
              }}
              onChoosePlan={(planData) => handleChoosePlan(tier)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
