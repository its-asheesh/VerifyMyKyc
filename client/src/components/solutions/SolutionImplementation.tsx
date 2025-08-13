"use client"

import type React from "react"
import type { Solution } from "../../types/solution"

export const SolutionImplementation: React.FC<{ solution: Solution }> = ({ solution }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Implementation Steps</h3>
      <ol className="space-y-3 list-decimal pl-6">
        {solution.implementation.map((step) => (
          <li key={step.step} className="text-gray-700">
            <span className="font-medium text-gray-900">{step.title}:</span> {step.description}
            <span className="ml-2 text-xs text-gray-500">({step.duration})</span>
          </li>
        ))}
      </ol>
    </div>
  )
}


