"use client"

import type React from "react"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import type { ProductShortHighlight } from "../../data/productContent"

interface ProductShortHighlightsProps {
  highlights: ProductShortHighlight[]
}

export const ProductShortHighlights: React.FC<ProductShortHighlightsProps> = ({
  highlights,
}) => {
  if (!highlights || highlights.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Short Highlights</h3>
      <div className="grid grid-cols-1 gap-3">
        {highlights.map((highlight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-xl">{highlight.icon}</span>
            <span className="text-gray-700">{highlight.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

