"use client"

import type React from "react"
import { motion } from "framer-motion"

interface FilterTab {
  id: string
  label: string
  count?: number
}

interface FilterTabsProps {
  tabs: FilterTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, activeTab, onTabChange, className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeTab === tab.id
              ? "text-white bg-blue-600 shadow-lg"
              : "text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          )}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-blue-600 rounded-full -z-10"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}
