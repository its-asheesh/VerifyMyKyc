"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { HowItWorksStep } from "../../data/productContent"

interface ProductHowItWorksProps {
  headline: string
  steps: HowItWorksStep[]
  note?: string
}

export const ProductHowItWorks: React.FC<ProductHowItWorksProps> = ({
  headline,
  steps,
  note,
}) => {
  if (!steps || steps.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {headline}
      </h2>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 items-start"
          >
            {/* Step Number */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
              {step.step}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Arrow (except for last step) */}
            {index < steps.length - 1 && (
              <div className="hidden md:flex items-center justify-center pt-2">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {note && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: steps.length * 0.1 }}
          className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-sm text-blue-800">{note}</p>
        </motion.div>
      )}
    </div>
  )
}

