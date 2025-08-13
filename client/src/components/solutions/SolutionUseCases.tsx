"use client"

import type React from "react"
import type { Solution } from "../../types/solution"
import { CheckCircle } from "lucide-react"

export const SolutionUseCases: React.FC<{ solution: Solution }> = ({ solution }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Use Cases</h3>
      <div className="space-y-3">
        {solution.useCases.map((uc, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">{uc.title}</div>
              <div className="text-sm text-gray-600">{uc.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


