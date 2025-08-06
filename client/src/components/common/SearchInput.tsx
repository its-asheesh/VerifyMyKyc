"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { debounce } from "lodash"

interface SearchInputProps {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
  autoFocus?: boolean
  debounceMs?: number
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  onSearch,
  className = "",
  autoFocus = false,
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery)
    }, debounceMs),
    [onSearch, debounceMs],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative transition-all duration-300 ${isFocused ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search
            className={`w-5 h-5 transition-colors duration-300 ${isFocused ? "text-blue-500" : "text-gray-400"}`}
          />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-300"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
