"use client"

import type React from "react"
import { motion } from "framer-motion"
import { CheckCircle, Zap, Shield, Clock, Users, BarChart } from "lucide-react"
import type { Product } from "../../types/product"

interface ProductFeaturesProps {
  product: Product
}

export const ProductFeatures: React.FC<ProductFeaturesProps> = ({ product }) => {
  const featureIcons = [Zap, Shield, Clock, Users, BarChart, CheckCircle]

  return (
    <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to implement secure and reliable verification in your applications
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {product.features.map((feature, index) => {
          const IconComponent = featureIcons[index % featureIcons.length]

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature}</h3>
              <p className="text-gray-600 text-sm">
                Advanced implementation of {feature.toLowerCase()} with enterprise-grade security and performance.
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
// Compare this snippet from client/src/components/products/ProductCard.tsx: