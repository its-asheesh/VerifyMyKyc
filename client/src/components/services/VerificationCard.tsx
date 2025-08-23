"use client"

import { motion } from "framer-motion"
import { Clock, CheckCircle, Star } from "lucide-react"
import type { FC } from "react"
import { useQuery } from "@tanstack/react-query"
import { reviewApi } from "../..//services/api/reviewApi"

type VerificationCardProps = {
  title: string
  image: string
  demand: string
  demandLevel: "high" | "medium" | "low"
  verifications: number
  duration: string
  price: number
  rating: number
  reviews: number
  productId?: string
  remaining?: number
  expiresAt?: string
  link?: string
}

const gradientMap = {
  high: "bg-gradient-to-r from-red-500 to-pink-500",
  medium: "bg-gradient-to-r from-yellow-500 to-orange-500",
  low: "bg-gradient-to-r from-gray-400 to-gray-600",
}

export const VerificationCard: FC<VerificationCardProps> = ({
  title,
  image,
  demand,
  demandLevel,
  verifications,
  duration,
  price,
  rating,
  reviews,
  productId,
  link,
  remaining,
  expiresAt,
}) => {
  const formattedExpiry = expiresAt ? new Date(expiresAt).toLocaleDateString() : null

  const { data } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => reviewApi.getProductReviews(productId as string, { page: 1, limit: 1 }),
    enabled: !!productId,
    staleTime: 30_000,
  })

  const apiAvg = data?.stats?.avgRating
  const apiCount = data?.stats?.count
  const useApi = !!productId
  const avgDisplay = useApi
    ? typeof apiCount === "number" && apiCount > 0
      ? (apiAvg ?? 0).toFixed(1)
      : "0.0"
    : typeof rating === "number"
      ? rating.toFixed(1)
      : String(rating)
  const countDisplay = useApi ? (typeof apiCount === "number" && apiCount > 0 ? apiCount : 0) : reviews

  const handleGetStarted = () => {
    if (link) {
      window.location.href = link
    } else if (productId) {
      console.log("Navigate to product:", productId)
      // Add navigation logic here
    }
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="min-w-[160px] max-w-[160px] md:min-w-[320px] md:max-w-[320px] flex-shrink-0"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl h-[200px] md:h-full transition-all duration-300 overflow-hidden flex flex-col">
        <div className="w-full h-16 md:h-36 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="object-contain w-full h-full p-2"
            loading="lazy"
          />
        </div>

        <div className="p-3 md:p-4 space-y-2 md:space-y-3 flex-1 flex flex-col">
          <span
            className={`w-fit px-2 py-1 rounded-full text-white text-[10px] md:text-xs font-semibold ${gradientMap[demandLevel]} flex-shrink-0`}
          >
            {demand}
          </span>

          {(typeof remaining === "number" || formattedExpiry) && (
            <div className="flex flex-wrap gap-1 md:gap-2 flex-shrink-0">
              {typeof remaining === "number" && (
                <span
                  className={`inline-block px-2 py-1 rounded text-[8px] md:text-xs ${
                    remaining === 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}
                >
                  Remaining: {remaining}
                </span>
              )}
              {formattedExpiry && (
                <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-600 text-[8px] md:text-xs">
                  Expires: {formattedExpiry}
                </span>
              )}
            </div>
          )}

          <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-tight line-clamp-2 flex-shrink-0">
            {title}
          </h3>

          <div className="flex-1"></div>

          <div className="hidden md:flex items-center gap-1 text-xs md:text-sm text-gray-600">
            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
            <span>
              {avgDisplay} ({countDisplay} reviews)
            </span>
          </div>

          <div className="hidden md:flex flex-col md:flex-row md:justify-between text-xs md:text-sm text-gray-600 gap-1 md:gap-0">
            <span className="flex gap-1 items-center">
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
              <span className="truncate">{verifications}</span>
            </span>
            <span className="flex gap-1 items-center">
              <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
              <span className="truncate">{duration}</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 flex-shrink-0">
            <span className="hidden md:block text-orange-600 font-semibold text-sm md:text-base">₹{price}</span>
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200 w-full md:w-auto"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
