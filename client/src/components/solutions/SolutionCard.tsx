"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Building, CheckCircle, Users, Star, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import type { Solution } from "../../types/solution"

interface SolutionCardProps {
  solution: Solution
}

export const SolutionCard: React.FC<SolutionCardProps> = ({ solution }) => {
  // Align some display stats with ProductCard
  const avgDisplay = "0.0"

  // Generate a consistent random number between 500-1000 for each solution based on solution ID
  // If actual users exceed 1000, show actual count instead
  const generateUserCount = (solutionId: string, actualUsers?: number): string => {
    // If actual users exist and exceed 1000, use actual count
    if (actualUsers !== undefined && actualUsers > 1000) {
      return actualUsers.toLocaleString()
    }
    
    // Otherwise, generate consistent random number between 500-1000
    // Use solution ID as seed for consistent random number
    let hash = 0
    for (let i = 0; i < solutionId.length; i++) {
      const char = solutionId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    // Generate number between 500 and 1000
    const randomNum = Math.abs(hash) % 501 + 500
    return randomNum.toLocaleString()
  }

  // Check if solution has actual user count (from stats or analytics)
  const actualUsers = (solution as any).userCount || (solution as any).stats?.userCount || undefined
  const userCount = generateUserCount(solution.id, actualUsers)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group 
        flex flex-col h-full min-h-[400px]`}
    >
      {/* Image Section */}
      <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
        <img
          src={solution.image || "/placeholder.svg"}
          alt={solution.title}
          className="w-full h-full object-contain rounded-t-xl p-1 md:p-2 group-hover:scale-110 transition-transform duration-300 "
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800`}
          >
            {solution.industry.name}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={"p-6 flex flex-col flex-1"}>
        {/* Top Section */}
        <div className={"flex-1 space-y-4"}>
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {solution.industry.name}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {solution.title}
          </h3>

          {/* Description */}
          <p className={`text-gray-600 leading-relaxed line-clamp-3`}>
            {solution.description}
          </p>

          {/* Features - map from benefits */}
          <div className={`flex flex-wrap gap-2 mb-4`}>
            {solution.benefits.slice(0, 4).map((benefit, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {benefit}
              </span>
            ))}
            {solution.benefits.length > 4 && (
              <span className="text-xs text-gray-500">+{solution.benefits.length - 4} more</span>
            )}
          </div>
        </div>

        {/* Bottom Section (match ProductCard) */}
        <div className={`space-y-3 mt-2`}>
          {/* Stats */}
          <div
            className={`flex gap-4 text-sm text-gray-600 justify-between mb-4`}
          >
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{avgDisplay}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{userCount} users</span>
            </div>
            <div className="flex items-center gap-">
              <Zap className="w-4 h-4" />
              <span>99.9% uptime</span>
            </div>
          </div>

          {/* CTA Button (match ProductCard layout) */}
          <Link
            to={`/solutions/${solution.id}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group/btn w-full sm:w-auto justify-center sm:justify-start"
          >
            Start Verifying
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
