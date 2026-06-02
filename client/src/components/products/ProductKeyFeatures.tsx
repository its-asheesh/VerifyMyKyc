"use client"

import type React from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import type { KeyFeature } from "../../data/productContent"

interface ProductKeyFeaturesProps {
  headline: string
  features: KeyFeature[]
}

export const ProductKeyFeatures: React.FC<ProductKeyFeaturesProps> = ({
  headline,
  features,
}) => {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        {headline}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 items-start"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

