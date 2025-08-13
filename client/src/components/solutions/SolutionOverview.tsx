"use client"

import type React from "react"
import type { Solution } from "../../types/solution"

export const SolutionOverview: React.FC<{ solution: Solution }> = ({ solution }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <img src={solution.image || "/placeholder.svg"} alt={solution.title} className="w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">{solution.title}</h3>
          <p className="text-gray-600">{solution.description}</p>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Industry:</span> {solution.industry.name}
          </div>
        </div>
      </div>
    </div>
  )
}


