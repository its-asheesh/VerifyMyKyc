"use client"

import React, { useMemo } from "react"
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
  showReadMore?: boolean
  onReadMore?: () => void
  email?: string
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  text,
  name,
  image,
  stars,
  position,
  company,
  verified = true,
  showReadMore,
  onReadMore,
  email,
}) => {
  const initial = useMemo(() => {
    if (email && typeof email === "string") {
      const local = email.split("@")[0]
      return (local?.[0] || email[0] || "?").toUpperCase()
    }
    return (name?.[0] || "?").toUpperCase()
  }, [email, name])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -6,
        transition: { duration: 0.3 },
      }}
      className="bg-white/95 backdrop-blur-sm border border-white/20 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative group h-[260px] flex flex-col"
    >
      {/* Quote Icon */}
      <div className="absolute top-3 right-3 text-blue-500/30 group-hover:text-blue-500/50 transition-colors duration-300">
        <Quote className="w-6 h-6" />
      </div>

      {/* Review Text */}
      <div className="flex-1 flex flex-col justify-start mb-3">
        <div className="relative h-24 overflow-hidden">
          <p className="text-gray-700 leading-relaxed text-sm font-medium whitespace-pre-line line-clamp-4">
            "{text}"
          </p>
          {showReadMore && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />
          )}
        </div>
        {showReadMore && (
          <div className="w-full mt-0.5">
            <button
              type="button"
              onClick={onReadMore}
              className="text-blue-600 hover:text-blue-700 font-semibold text-xs underline text-left"
            >
              Read more
            </button>
          </div>
        )}
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
          >
            <Star
              className={`w-4 h-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          </motion.div>
        ))}
        <span className="ml-1 text-xs font-semibold text-gray-600">{stars}.0</span>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-2 mt-auto">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full border-2 border-blue-100 shadow-md bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-700 font-bold text-sm select-none"
            aria-label={`Avatar of ${name}`}
            title={email || name}
          >
            {initial}
          </div>
          {verified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-xs">{name}</p>
          {position && (
            <p className="text-xs text-gray-500 truncate max-w-[140px]">
              {position} {company && `at ${company}`}
            </p>
          )}
          {verified && (
            <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
              <CheckCircle className="w-2.5 h-2.5" />
              Verified
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}