"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Star, Quote, CheckCircle } from "lucide-react"

interface ReviewCardProps {
  text: string
  name: string
  image: string
  stars: number
  position?: string
  company?: string
  verified?: boolean
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  text,
  name,
  image,
  stars,
  position,
  company,
  verified = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3 },
      }}
      className="bg-white/95 backdrop-blur-sm border border-white/20 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative group min-h-[280px] flex flex-col"
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-blue-500/30 group-hover:text-blue-500/50 transition-colors duration-300">
        <Quote className="w-8 h-8" />
      </div>

      {/* Review Text */}
      <div className="flex-grow mb-6">
        <p className="text-gray-700 leading-relaxed text-sm md:text-base font-medium">"{text}"</p>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Star className={`w-4 h-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </motion.div>
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-600">{stars}.0</span>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={image || "/placeholder.svg?height=48&width=48"}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border-3 border-blue-100 shadow-md"
          />
          {verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{name}</p>
          {position && (
            <p className="text-xs text-gray-500">
              {position} {company && `at ${company}`}
            </p>
          )}
          {verified && (
            <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" />
              Verified Customer
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
