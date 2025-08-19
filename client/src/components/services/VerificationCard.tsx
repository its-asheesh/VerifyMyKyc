// src/components/services/VerificationCard.tsx
"use client"

import { Card, CardContent, Typography, Chip, Button } from "@mui/material"
import { motion } from "framer-motion"
import { Clock, CheckCircle, Star } from "lucide-react"
import type { FC } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { reviewApi } from "../../services/api/reviewApi"

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

  // Fetch rating stats when productId is provided; fall back to props otherwise
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
    ? (typeof apiCount === 'number' && apiCount > 0 ? (apiAvg ?? 0).toFixed(1) : "0.0")
    : (typeof rating === 'number' ? rating.toFixed(1) : String(rating))
  const countDisplay = useApi
    ? (typeof apiCount === 'number' && apiCount > 0 ? apiCount : 0)
    : reviews
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="min-w-[320px] max-w-[320px] flex-shrink-0"
    >
      <Card className="overflow-hidden shadow-md hover:shadow-xl h-full">
        <div className="w-full h-36 bg-slate-50 flex items-center justify-center overflow-hidden">
          <img
            src={image}
            alt={title}
            width={300}
            height={140}
            className="object-contain"
            loading="lazy"
          />
        </div>

        <CardContent className="space-y-3">
          <Chip
            label={demand}
            className={`text-white text-xs font-semibold ${gradientMap[demandLevel]} !rounded-full`}
          />

          {(typeof remaining === 'number' || formattedExpiry) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {typeof remaining === 'number' && (
                <Chip
                  label={`Remaining: ${remaining}`}
                  color={remaining === 0 ? "error" : "success"}
                  size="small"
                />
              )}
              {formattedExpiry && (
                <Chip label={`Expires: ${formattedExpiry}`} size="small" />
              )}
            </div>
          )}

          <Typography variant="h6" fontWeight={600} className="text-gray-800">
            {title}
          </Typography>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            {avgDisplay} ({countDisplay} reviews)
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex gap-1 items-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {verifications} Verifications
            </span>
            <span className="flex gap-1 items-center">
              <Clock className="w-4 h-4 text-blue-500" />
              {duration}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <Typography variant="h6" className="text-orange-600">
              ₹{price}
            </Typography>
            {link ? (
              <Link to={link}>
                <Button variant="contained" size="small" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            ) : (
            <Button variant="contained" size="small" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
