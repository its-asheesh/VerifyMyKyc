"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Filter, X } from "lucide-react"

interface ProductFiltersProps {
  isOpen: boolean
  onClose: () => void
  filters: {
    category: string
    priceRange: [number, number]
    features: string[]
  }
  onFiltersChange: (filters: any) => void
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ isOpen, onClose, filters, onFiltersChange }) => {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter content would go here */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Category</h4>
            {/* Category filters */}
          </div>

          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            {/* Price range slider */}
          </div>

          <div>
            <h4 className="font-medium mb-3">Features</h4>
            {/* Feature checkboxes */}
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
