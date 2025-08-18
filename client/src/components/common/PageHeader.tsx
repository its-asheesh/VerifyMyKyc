"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  children?: React.ReactNode
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  children,
  className = "",
}) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r from-blue-50 to-purple-50 py-6 md:py-10 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Header content only half width */}
          <div className="w-full md:w-1/2">
            {showBackButton && (
              <motion.button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3 transition-colors"
                whileHover={{ x: -4 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>

          {/* Children (actions) stay on right */}
          {children && <div className="ml-6">{children}</div>}
        </div>
      </div>
    </motion.div>
  )
}
