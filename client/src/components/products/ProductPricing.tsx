"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Check, Star, Shield, Zap, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import type { Product } from "../../types/product"
import { useVerificationPricing } from "../../hooks/usePricing"
import { useAppSelector } from "../../redux/hooks"
import { Button } from "../common/Button"
import { Card } from "../common/Card"
import { Section } from "../common/Section"

interface ProductPricingProps {
  product: Product
}

export const ProductPricing: React.FC<ProductPricingProps> = ({ product }) => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const handleChoosePlan = (tier: any) => {
    const verificationType = getVerificationType(product)


    // If not logged in, redirect to login with state
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

    // Navigate to checkout
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

  // Resolve verification type from product
  const getVerificationType = (prod: Product): string => {
    const id = (prod.id || '').toLowerCase()
    if ([
      'aadhaar',
      'pan',
      'drivinglicense',
      'gstin',
      'company',
      'voterid',
      'bank-account',
      'vehicle',
    ].includes(id)) return id

    const title = (prod.title || '').toLowerCase()
    if (title.includes('company') || title.includes('mca') || title.includes('cin') || title.includes('din')) return 'company'
    if (title.includes('pan')) return 'pan'
    if (title.includes('aadhaar')) return 'aadhaar'
    if (title.includes('driving license') || title.includes('drivinglicense')) return 'drivinglicense'
    if (title.includes('gstin')) return 'gstin'
    if (title.includes('voter')) return 'voterid'
    if (title.includes('bank account') || title.includes('bankaccount') || title.includes('banking')) return 'bankaccount'
    if (title.includes('vehicle') || title.includes('registration certificate')) return 'vehicle'
    if (title.includes('passport')) return 'passport'
    return ''
  }

  const verificationType = getVerificationType(product)
  const { data: verificationPricing, isLoading: verificationsLoading, error: verificationsError } = useVerificationPricing(verificationType)



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


  if (verificationsLoading) {
    return (
      <Section variant="gradient" className="rounded-3xl min-h-[600px] flex items-center justify-center">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading pricing information...</p>
        </div>
      </Section>
    )
  }

  // Use backend pricing if available
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
      color: "blue" as const,
      support: "Email support",
      period: "one-time",
      billingPeriod: 'custom' as const,
      popular: false
    }
  ] : []

  if (verificationsError || !verificationPricing) {
    return (
      <Section variant="gradient" className="rounded-3xl min-h-[600px] flex items-center justify-center">
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load pricing information. Please contact support.</p>
        </div>
      </Section>
    )
  }

  return (
    <Section variant="gradient" className="rounded-3xl min-h-[640px] relative" withContainer={false}>
      <div className="px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
            Choose Your Plan
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Flexible pricing options to match your verification needs and scale with your business
          </p>
        </motion.div>

        <div className="hidden md:block">
          {/* Desktop: Grid layout - 3 in a row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-gray-900">₹{tier.price}</span>
                    <span className="text-gray-500 text-sm">/{tier.name === 'One-time' ? 'check' : 'month'}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6">{tier.requests}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleChoosePlan(tier)}
                    className="w-full"
                    variant={tier.popular ? 'primary' : 'secondary'}
                  >
                    Choose Plan
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile & Small Screens: Horizontal Scroll */}
        <div className="md:hidden">
          <div className="flex space-x-6 overflow-x-auto pb-6 px-4 scrollbar-hide">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-72"
              >
                <Card>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-gray-900">₹{tier.price}</span>
                    <span className="text-gray-500 text-sm">/{tier.name === 'One-time' ? 'check' : 'month'}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleChoosePlan(tier)}
                    className="w-full"
                    variant={tier.popular ? 'primary' : 'secondary'}
                  >
                    Choose Plan
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Extra vertical space to increase scrollable area */}
        <div className="h-16 md:h-20"></div>
      </div>
    </Section >
  )
}