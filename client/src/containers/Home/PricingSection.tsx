"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, Users, Zap, Shield } from "lucide-react"
// import { PricingCard } from "../../components/pricing/PricingCard"
// import { StatsCard } from "../../components/pricing/StatsCard"
import { verificationStats } from "../../utils/constants"
import { usePricingContext } from "../../context/PricingContext"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
}

const PricingSection: React.FC = () => {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [focusedCard, setFocusedCard] = useState<number | null>(0) // Start from 0
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly' | 'custom'>('monthly')
  
  const scrollRef = useRef<HTMLDivElement>(null) // Ref for scroll container

  // Fetch homepage pricing data from backend
  const { homepagePlans, homepageLoading, homepageError, getHomepagePlansByPeriod } = usePricingContext()

  // Filter plans by billing period
  const currentPlans = billingPeriod !== 'custom' ? getHomepagePlansByPeriod(billingPeriod) : []

  const handleBillingPeriodChange = (period: 'monthly' | 'yearly' | 'custom') => {
    if (period === 'custom') {
      navigate('/custom-pricing')
    } else {
      setBillingPeriod(period)
    }
  }

  // Get icon based on plan name
  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'Personal':
        return Users
      case 'Professional':
        return Zap
      case 'Business':
        return Shield
      default:
        return Users
    }
  }

  // Sync focusedCard with scroll position
  useEffect(() => {
    const container = scrollRef.current
    if (!container || !currentPlans?.length) return

    const handleScroll = () => {
      const width = container.clientWidth
      const scrollLeft = container.scrollLeft
      let index = Math.round(scrollLeft / width)

      // Clamp index
      index = Math.max(0, Math.min(index, currentPlans.length - 1))

      // Only update if changed
      if (index !== focusedCard) {
        setFocusedCard(index)
        setHoveredCard(index)
      }
    }

    // Use passive listener for performance
    container.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [currentPlans, focusedCard])

  return (
    <section id="pricing" className="py-10 md:py-16 px-4 md:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-30 -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm font-semibold text-blue-600 tracking-wider uppercase mb-3 flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4" />
            Pricing Plans
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-4"
          >
            Simple, Transparent Pricing
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Choose the perfect plan for your verification needs. All plans include our core features with varying
            limits.
          </motion.p>
        </motion.div>

        {/* Billing Period Toggle */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${billingPeriod === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
              onClick={() => handleBillingPeriodChange('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${billingPeriod === 'yearly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
              onClick={() => handleBillingPeriodChange('yearly')}
            >
              Yearly
            </button>
            <button
              className={`px-6 py-2 rounded-md font-semibold transition-colors duration-200 ${billingPeriod === 'custom' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'}`}
              onClick={() => handleBillingPeriodChange('custom')}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mb-12 md:mb-16">
          {/* Mobile: Scrollable Row with Snap */}
          <div
            ref={scrollRef}
            className="md:hidden flex overflow-x-auto snap-x snap-mandatory py-4 px-4 scrollbar-hide scroll-smooth"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {homepageLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="min-w-full snap-center flex-shrink-0 px-2">
                  <div className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded mb-3"></div>
                    <div className="h-7 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-2.5 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : homepageError ? (
              <div className="col-span-full text-center py-6 text-red-600 text-sm">
                Failed to load pricing. Please try again later.
              </div>
            ) : (
              currentPlans?.map((plan, index) => (
                <div
                  key={plan._id}
                  className="min-w-full snap-center flex-shrink-0 px-2"
                >
                  {/* <PricingCard
                    title={plan.name}
                    price={`₹${plan.price}`}
                    description={plan.description}
                    features={plan.features}
                    icon={getPlanIcon(plan.planName)}
                    color={plan.color as 'blue' | 'purple' | 'green' || "blue"}
                    highlighted={plan.highlighted}
                    popular={plan.popular}
                    isHovered={hoveredCard === index}
                    isFocused={focusedCard === index}
                    billingPeriod={billingPeriod}
                    planData={plan}
                    onHover={() => {
                      setHoveredCard(index)
                      setFocusedCard(index)
                    }}
                    onHoverEnd={() => setHoveredCard(null)}
                    onClick={() => {
                      // Tap: focus and scroll to this card
                      setFocusedCard(index)
                      setHoveredCard(index)
                      setTimeout(() => setHoveredCard(prev => prev === index ? null : prev), 1500)

                      // Scroll to this card if not already centered
                      if (scrollRef.current) {
                        const container = scrollRef.current
                        container.scrollTo({
                          left: index * container.clientWidth,
                          behavior: 'smooth',
                        })
                      }
                    }}
                  /> */}
                </div>
              ))
            )}
          </div>

          {/* Desktop: Grid Layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {homepageLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <motion.div key={index} variants={cardVariants}>
                  <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-3 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : homepageError ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-600">Failed to load pricing. Please try again later.</p>
              </div>
            ) : (
              currentPlans?.map((plan, index) => (
                <motion.div key={plan._id} variants={cardVariants}>
                  {/* <PricingCard
                    title={plan.name}
                    price={`₹${plan.price}`}
                    description={plan.description}
                    features={plan.features}
                    icon={getPlanIcon(plan.planName)}
                    color={plan.color as 'blue' | 'purple' | 'green' || "blue"}
                    highlighted={plan.highlighted}
                    popular={plan.popular}
                    isHovered={hoveredCard === index}
                    isFocused={focusedCard === index}
                    billingPeriod={billingPeriod}
                    planData={plan}
                    onHover={() => {
                      setHoveredCard(index)
                      setFocusedCard(index)
                    }}
                    onHoverEnd={() => setHoveredCard(null)}
                    onClick={() => {
                      setFocusedCard(index)
                      setHoveredCard(index)
                      setTimeout(() => setHoveredCard(prev => prev === index ? null : prev), 1500)
                    }}
                  /> */}
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-6 md:p-10 text-white shadow-2xl overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

          <div className="relative z-10">
            <div className="text-center mb-6 md:mb-10">
              <h3 className="text-xl md:text-2xl font-bold mb-3">Trusted by Thousands</h3>
              <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
                Our platform is trusted by individuals and businesses alike for secure and reliable verification
                services.
              </p>
            </div>

            {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {verificationStats.map((item, index) => (
                <StatsCard
                  key={index}
                  value={item.value}
                  label={item.label}
                  suffix={item.suffix}
                  prefix={item.prefix}
                  index={index}
                />
              ))}
            </div> */}
          </div>
        </motion.div>
      </div>

      <style>{`
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.05)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
        .bg-grid-white\\/10 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.1)'%3e%3cpath d='m0 .5h32m-32 32v-32'/%3e%3c/svg%3e");
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default PricingSection