"use client"

import type React from "react"
import { Shield } from "lucide-react"

interface ProductComplianceNoteProps {
  note: string
}

export const ProductComplianceNote: React.FC<ProductComplianceNoteProps> = ({
  note,
}) => {
  if (!note) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2">Compliance Note</h3>
          <p className="text-sm text-blue-800 leading-relaxed">{note}</p>
        </div>
      </div>
    </div>
  )
}

