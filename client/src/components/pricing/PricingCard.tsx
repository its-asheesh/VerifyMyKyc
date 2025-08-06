"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Check, type LucideIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  icon: LucideIcon
  color: "blue" | "purple" | "green"
  highlighted?: boolean
  popular?: boolean
  isHovered?: boolean
  isFocused?: boolean
  billingPeriod?: 'monthly' | 'yearly' | 'custom'
  onHover?: () => void
  onHoverEnd?: () => void
  planData?: any // Full plan data from backend
  onChoosePlan?: (planData: any) => void // Callback for when plan is chosen
}

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  color = "blue",
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "primary" | "ghost"
  size?: "default" | "sm" | "lg"
  color?: "blue" | "purple" | "green"
  [key: string]: any
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const getVariantClasses = () => {
    const colorClasses = {
      blue: {
        default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
        outline: "border-2 border-gray-200 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50",
        ghost: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
      },
      purple: {
        default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg",
        outline: "border-2 border-gray-200 bg-white text-gray-700 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50",
        ghost: "text-gray-700 hover:text-purple-600 hover:bg-purple-50",
      },
      green: {
        default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        primary: "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg",
        outline: "border-2 border-gray-200 bg-white text-gray-700 hover:border-green-500 hover:text-green-600 hover:bg-green-50",
        ghost: "text-gray-700 hover:text-green-600 hover:bg-green-50",
      },
    }

    return colorClasses[color][variant] || colorClasses.blue[variant]
  }

  const sizeClasses = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-10 px-5 text-base",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${getVariantClasses()} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  icon: IconComponent,
  color,
  highlighted = false,
  popular = false,
  isHovered = false,
  isFocused = false,
  billingPeriod = 'monthly',
  onHover,
  onHoverEnd,
  planData,
  onChoosePlan,
}) => {
  const navigate = useNavigate()

  const handleChoosePlan = () => {
    if (onChoosePlan) {
      // Use the callback if provided (for product pages)
      onChoosePlan(planData || {
        name: title,
        price: price,
        description: description,
        features: features,
        planType: billingPeriod,
        planName: title.split(' ')[0]
      })
    } else {
      // Default navigation (for homepage pricing)
      navigate('/checkout', {
        state: {
          selectedPlan: title,
          billingPeriod: billingPeriod,
          planDetails: planData ? {
            name: planData.name,
            price: planData.price,
            description: planData.description,
            features: planData.features,
            planType: planData.planType,
            planName: planData.planName
          } : {
            name: title,
            price: price,
            description: description,
            features: features,
            planType: billingPeriod,
            planName: title.split(' ')[0] // Extract plan name (Personal, Professional, Business)
          },
          selectedServices: [] // Empty array since this is from homepage pricing
        }
      })
    }
  }

  const getCardColors = () => {
    const isActive = isHovered || isFocused || highlighted

    if (color === "purple") {
      return {
        border: isActive ? "border-purple-500" : "border-gray-200",
        bg: isActive ? "bg-purple-50" : "bg-white",
        iconBg: "bg-purple-500",
      }
    } else if (color === "green") {
      return {
        border: isActive ? "border-green-500" : "border-gray-200",
        bg: isActive ? "bg-green-50" : "bg-white",
        iconBg: "bg-green-500",
      }
    } else {
      return {
        border: isActive ? "border-blue-500" : "border-gray-200",
        bg: isActive ? "bg-blue-50" : "bg-white",
        iconBg: "bg-blue-500",
      }
    }
  }

  const colors = getCardColors()
  const isActive = isHovered || isFocused || highlighted

  // Determine the price and label based on billingPeriod
  let displayPrice = price
  let periodLabel = billingPeriod === 'yearly' ? '/year' : '/month'
  
  return (
    <motion.div
      whileHover={{
        y: -6,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      onHoverStart={onHover}
      onHoverEnd={onHoverEnd}
      className={`relative rounded-xl border-2 transition-all duration-300 ${colors.border} ${colors.bg} shadow-lg hover:shadow-xl overflow-visible group cursor-pointer flex flex-col h-full`}
      style={{
        transform: isActive ? "scale(1.02)" : "scale(1)",
        minHeight: "480px",
      }}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
            Most Popular
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 md:p-6 flex flex-col h-full">
        {/* Top spacing for popular badge */}
        {popular && <div className="h-3"></div>}

        {/* Icon and Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center shadow-md`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-bold text-gray-900">{displayPrice}</span>
            <span className="text-gray-600 text-sm">{periodLabel}</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2.5 mb-6 flex-grow">
          {features.map((feature, featureIndex) => (
            <motion.div
              key={featureIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: featureIndex * 0.1 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-gray-700 text-sm">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          <Button 
            variant={isActive ? "primary" : "outline"} 
            color={color}
            className="w-full" 
            size="lg"
            onClick={handleChoosePlan}
          >
            Choose Plan
          </Button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-xl ${
          color === "purple"
            ? "from-purple-500 to-pink-500"
            : color === "green"
              ? "from-green-500 to-emerald-500"
              : "from-blue-500 to-cyan-500"
        }`}
      />
    </motion.div>
  )
}
