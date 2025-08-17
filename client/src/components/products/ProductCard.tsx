"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Star, Users, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import type { Product } from "../../types/product"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = "grid" }) => {
  const isListView = viewMode === "list"

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
        isListView ? "flex items-center" : ""
      }`}
    >
      {/* Image Section */}
      <div
        className={`${isListView ? "w-48 h-32" : "h-48"} bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden`}
      >
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
            }`}
          >
            {product.isActive ? "Active" : "Coming Soon"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={`p-6 ${isListView ? "flex-1" : ""}`}>
        <div className={`${isListView ? "flex items-start justify-between" : "space-y-4"}`}>
          <div className={isListView ? "flex-1 pr-6" : ""}>
            {/* Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {product.category.name}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>

            {/* Description */}
            <p className={`text-gray-600 leading-relaxed ${isListView ? "mb-0" : "mb-4"}`}>{product.description}</p>

            {/* Features - Only show in grid view or first 3 in list view */}
            <div className={`flex flex-wrap gap-2 ${isListView ? "mt-3" : "mb-4"}`}>
              {product.features.slice(0, isListView ? 3 : 4).map((feature, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {feature}
                </span>
              ))}
              {product.features.length > (isListView ? 3 : 4) && (
                <span className="text-xs text-gray-500">+{product.features.length - (isListView ? 3 : 4)} more</span>
              )}
            </div>
          </div>

          {/* Pricing and CTA */}
          <div className={`${isListView ? "text-right" : "space-y-4"}`}>
            {/* Pricing */}
            <div className={isListView ? "mb-4" : ""}>
              <div className="text-sm text-gray-500 mb-1">Starting from</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{product.pricing.free.price}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
            </div>

            {/* Stats */}
            <div className={`flex gap-4 text-sm text-gray-600 ${isListView ? "justify-end mb-4" : "justify-between"}`}>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.8</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>1.2k users</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>99.9% uptime</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to={`/products/${product.id}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group/btn"
            >
              Learn More
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
