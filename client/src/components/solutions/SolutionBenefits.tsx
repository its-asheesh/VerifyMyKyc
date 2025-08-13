"use client"

import type React from "react"
import type { Solution } from "../../types/solution"

export const SolutionBenefits: React.FC<{ solution: Solution }> = ({ solution }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h3>
      <div className="flex flex-wrap gap-2">
        {solution.benefits.map((benefit, idx) => (
          <span key={idx} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
            {benefit}
          </span>
        ))}
      </div>
    </div>
  )
}


