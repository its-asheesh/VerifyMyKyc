"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

interface FaqItemProps {
  question: string
  answer: string
  isActive: boolean
  onToggle: () => void
  index: number
}

export const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isActive, onToggle, index }) => {
  const highlightBrand = (text: string) => {
    if (text.includes("VerifyMyKyc")) {
      const parts = text.split("VerifyMyKyc")
      return (
        <>
          {parts[0]}
          <span className="font-bold text-blue-600">VerifyMyKyc</span>
          {parts[1]}
        </>
      )
    }
    return text
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white"
    >
      <motion.div
        className="flex justify-between items-center cursor-pointer p-6 hover:bg-gray-50/50 transition-colors duration-300"
        onClick={onToggle}
        whileHover={{ x: 4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-4">{highlightBrand(question)}</h3>
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          {isActive ? <Minus className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-gray-500" />}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
