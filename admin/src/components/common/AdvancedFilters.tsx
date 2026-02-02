import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react'
import SearchBar from './SearchBar'

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

  const hasActiveFilters = Object.entries(values).some(([key, value]) => {
    // Ignore search term, empty values, null, undefined, and default "all" values
    if (key === 'search' && !value) return false;
    if (value === '' || value === null || value === undefined) return false;
    // For dateRange, "all" is the default, so don't count it as active
    if (key === 'dateRange' && value === 'all') return false;
    // For custom date range, check if dates are actually set
    if (key === 'dateRange_start' || key === 'dateRange_end') {
      // Only count as active if dateRange is "custom" and dates are set
      return values.dateRange === 'custom' && value !== '';
    }
    return true;
  })

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="space-y-4">
        {/* Main Search and Basic Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
            />
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

            {/* More Filters toggle */}
            {filters.length > 2 && onToggleAdvanced && (
              <button
                onClick={() => onToggleAdvanced(!showAdvanced)}
                className={`flex items-center px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200 ${showAdvanced
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm hover:bg-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                aria-expanded={showAdvanced}
                aria-label="Toggle more filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                More Filters
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
            transition={{ duration: 0.2 }}
            className="border-t border-gray-200 pt-4 mt-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Additional Filters</h3>
                <span className="text-xs text-gray-500">
                  {filters.slice(2).length} filter{filters.slice(2).length !== 1 ? 's' : ''} available
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filters.slice(2).map((filter) => (
                  <div key={filter.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {filter.label}
                    </label>

                    {filter.type === 'select' && (
                      <>
                        <select
                          value={values[filter.key] || ''}
                          onChange={(e) => onChange(filter.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                        >
                          <option value="">All</option>
                          {filter.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {/* Show custom date range inputs when "custom" is selected */}
                        {filter.key === 'dateRange' && values[filter.key] === 'custom' && (
                          <div className="mt-2 space-y-2">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                              <input
                                type="date"
                                value={values[`${filter.key}_start`] || ''}
                                onChange={(e) => onChange(`${filter.key}_start`, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">End Date</label>
                              <input
                                type="date"
                                value={values[`${filter.key}_end`] || ''}
                                onChange={(e) => onChange(`${filter.key}_end`, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {filter.type === 'text' && (
                      <input
                        type="text"
                        placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}`}
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
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={values[`${filter.key}_start`] || ''}
                            onChange={(e) => onChange(`${filter.key}_start`, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">End Date</label>
                          <input
                            type="date"
                            value={values[`${filter.key}_end`] || ''}
                            onChange={(e) => onChange(`${filter.key}_end`, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdvancedFilters
