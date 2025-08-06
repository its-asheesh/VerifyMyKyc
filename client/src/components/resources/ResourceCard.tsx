"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Clock, User, ArrowRight, Download, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import { type Resource, ResourceType } from "../../types/resource"

interface ResourceCardProps {
  resource: Resource
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getTypeColor = (type: ResourceType) => {
    switch (type) {
      case ResourceType.DOCUMENTATION:
        return "bg-blue-100 text-blue-800"
      case ResourceType.API_REFERENCE:
        return "bg-green-100 text-green-800"
      case ResourceType.CASE_STUDY:
        return "bg-purple-100 text-purple-800"
      case ResourceType.TUTORIAL:
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case ResourceType.TUTORIAL:
        return <ExternalLink className="w-4 h-4" />
      default:
        return <Download className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Image Section */}
      {resource.featuredImage && (
        <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
          <img
            src={resource.featuredImage || "/placeholder.svg"}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Type Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(resource.type)}`}>
            {resource.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
          {getTypeIcon(resource.type)}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed line-clamp-3">{resource.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {resource.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{resource.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{resource.readTime} min read</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/resources/${resource.id}`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group/btn w-full justify-center"
        >
          Read More
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
