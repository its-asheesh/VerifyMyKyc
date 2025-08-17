"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Building, CheckCircle, Users } from "lucide-react"
import { Link } from "react-router-dom"
import type { Solution } from "../../types/solution"

interface SolutionCardProps {
  solution: Solution
}

export const SolutionCard: React.FC<SolutionCardProps> = ({ solution }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Image Section */}
      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
        <img
          src={solution.image || "/placeholder.svg"}
          alt={solution.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Building className="w-3 h-3" />
            {solution.industry.name}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {solution.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed line-clamp-3">{solution.description}</p>

        {/* Use Cases */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900">Key Use Cases:</h4>
          <div className="space-y-1">
            {solution.useCases.slice(0, 2).map((useCase, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{useCase.title}</span>
              </div>
            ))}
            {solution.useCases.length > 2 && (
              <span className="text-xs text-gray-500 ml-6">+{solution.useCases.length - 2} more use cases</span>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap gap-2">
          {solution.benefits.slice(0, 3).map((benefit, index) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              {benefit}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-600 pt-4 border-t">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{solution.caseStudies.length} case studies</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{solution.implementation.length} steps</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/solutions/${solution.id}`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group/btn w-full justify-center"
        >
          Learn More
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
