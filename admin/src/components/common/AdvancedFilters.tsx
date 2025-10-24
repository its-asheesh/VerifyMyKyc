import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'text' | 'date' | 'daterange'
  options?: FilterOption[]
  placeholder?: string
}

export interface AdvancedFiltersProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  onClear: () => void
  searchPlaceholder?: string
  showAdvanced?: boolean
  onToggleAdvanced?: (show: boolean) => void
  className?: string
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  values,
  onChange,
  onClear,
  searchPlaceholder = 'Search...',
  showAdvanced = false,
  onToggleAdvanced,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(values.search || '')

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onChange('search', value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onClear()
  }

  const hasActiveFilters = Object.values(values).some(value => 
    value !== '' && value !== null && value !== undefined
  )

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        {/* Main Search and Basic Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Basic filters */}
            {filters.slice(0, 2).map((filter) => (
              <div key={filter.key}>
                {filter.type === 'select' && (
                  <select
                    value={values[filter.key] || ''}
                    onChange={(e) => onChange(filter.key, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            
            {/* Advanced filters toggle */}
            {filters.length > 2 && onToggleAdvanced && (
              <button
                onClick={() => onToggleAdvanced(!showAdvanced)}
                className={`flex items-center px-3 py-2 border rounded-md text-sm transition-colors ${
                  showAdvanced
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Advanced
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>
            )}
            
            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && filters.length > 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filters.slice(2).map((filter) => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {filter.label}
                  </label>
                  
                  {filter.type === 'select' && (
                    <select
                      value={values[filter.key] || ''}
                      onChange={(e) => onChange(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">All</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {filter.type === 'text' && (
                    <input
                      type="text"
                      placeholder={filter.placeholder}
                      value={values[filter.key] || ''}
                      onChange={(e) => onChange(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  )}
                  
                  {filter.type === 'date' && (
                    <input
                      type="date"
                      value={values[filter.key] || ''}
                      onChange={(e) => onChange(filter.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  )}
                  
                  {filter.type === 'daterange' && (
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        placeholder="Start date"
                        value={values[`${filter.key}_start`] || ''}
                        onChange={(e) => onChange(`${filter.key}_start`, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <input
                        type="date"
                        placeholder="End date"
                        value={values[`${filter.key}_end`] || ''}
                        onChange={(e) => onChange(`${filter.key}_end`, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdvancedFilters
