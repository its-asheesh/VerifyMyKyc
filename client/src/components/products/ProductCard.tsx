"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Users, Zap, CheckCircle2, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"
import type { Product } from "../../types/product"
import { useQuery } from "@tanstack/react-query"
import { reviewApi } from "../../services/api/reviewApi"
import { Badge } from "../common/Badge"
import { Card } from "../common/Card"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = "grid" }) => {
  const isListView = viewMode === "list"

  // Fetch reviews stats (avg rating and count)
  const { data } = useQuery({
    queryKey: ["product-reviews", product.id],
    queryFn: () => reviewApi.getProductReviews(product.id, { page: 1, limit: 1 }),
    staleTime: 30_000,
  })

  // Generate a consistent random number between 500-1000 for each product based on product ID
  const generateUserCount = (productId: string, actualUsers?: number): string => {
    if (actualUsers !== undefined && actualUsers > 1000) {
      return actualUsers.toLocaleString()
    }

    let hash = 0
    for (let i = 0; i < productId.length; i++) {
      const char = productId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    const randomNum = Math.abs(hash) % 501 + 500
    return randomNum.toLocaleString()
  }

  const actualUsers = (product as any).userCount || (product as any).stats?.userCount || undefined
  const userCount = generateUserCount(product.id, actualUsers)

  return (
    <Link to={`/products/${product.id}`} className="block h-full group">
      <motion.div
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <Card
          noPadding
          className={`h-full border-gray-200 hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex flex-col ${isListView ? "flex-row items-center min-h-0" : ""}`}
        >
          {/* Image/Icon Section */}
          <div
            className={`${isListView ? "w-36 sm:w-48 h-auto min-h-[120px] self-stretch" : "h-32"
              } bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden group-hover:from-blue-100 group-hover:to-purple-100 transition-colors border-r border-gray-100`}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <ShieldCheck className="w-12 h-12 text-blue-300 group-hover:text-blue-500 transition-colors" />
            )}

            <div className="absolute top-2 right-2">
              <Badge
                variant={product.isActive ? "success" : "default"}
                size="sm"
              >
                {product.isActive ? "Active" : "Soon"}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className={`p-3 flex flex-col flex-1 ${isListView ? "py-3 sm:py-4" : ""}`}>
            <div className={`${isListView ? "flex-1" : "flex-1 space-y-1.5"}`}>
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="info" className="uppercase tracking-wider font-extrabold text-[10px] py-0.5">
                  {product.category.name}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="text-base font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1 tracking-tight">
                {product.title}
              </h3>

              {/* Description */}
              <p className={`text-gray-600 text-xs font-medium leading-relaxed line-clamp-2 ${isListView ? "mb-0" : "mb-2"}`}>
                {product.description}
              </p>
            </div>

            {/* Bottom Section */}
            <div className={`mt-3 pt-3 border-t border-gray-100 ${isListView ? "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto" : ""}`}>
              {/* Stats */}
              <div className={`flex justify-between items-center text-[10px] font-bold text-gray-600 ${isListView ? "justify-start gap-4 mb-0" : "mb-3"}`}>
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                  <Users className="w-3 h-3 text-blue-500" />
                  <span>{userCount} users</span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Instant</span>
                </div>
              </div>

              {/* CTA Button */}
              <div
                className={`inline-flex items-center justify-center gap-1.5 w-full bg-gray-900 text-white border border-transparent px-3 py-2 rounded-lg text-xs font-bold group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:shadow-md transition-all duration-200 ${isListView ? "w-full sm:w-auto mt-3 sm:mt-0" : ""
                  }`}
              >
                Start Verifying
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}
