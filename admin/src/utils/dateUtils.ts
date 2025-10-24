// Core utilities for date formatting and manipulation
export type DateFormat = 'short' | 'long' | 'relative' | 'datetime' | 'time'

export interface DateFormatOptions {
  includeTime?: boolean
  timezone?: string
  locale?: string
}

// Format date based on type
export const formatDate = (
  dateString: string | Date, 
  format: DateFormat = 'short',
  options: DateFormatOptions = {}
): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const { locale = 'en-US' } = options

  switch (format) {
    case 'short':
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    
    case 'long':
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    
    case 'datetime':
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    
    case 'time':
      return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
      })
    
    case 'relative':
      return formatRelativeDate(date)
    
    default:
      return date.toLocaleDateString(locale)
  }
}

// Format relative date (e.g., "2 days ago", "1 week ago")
export const formatRelativeDate = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - targetDate.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

// Format currency (Indian Rupees)
export const formatCurrency = (
  amount: number | undefined | null,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00'
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

// Format number with commas
export const formatNumber = (
  num: number | undefined | null,
  locale: string = 'en-IN'
): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return '0'
  }
  
  return new Intl.NumberFormat(locale).format(num)
}

// Format percentage
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

// Get date range for filtering
export const getDateRange = (range: 'last7days' | 'last30days' | 'last90days' | 'custom', customRange?: { start: string; end: string }) => {
  const now = new Date()
  
  switch (range) {
    case 'last7days':
      return {
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        end: now
      }
    case 'last30days':
      return {
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        end: now
      }
    case 'last90days':
      return {
        start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        end: now
      }
    case 'custom':
      if (!customRange?.start || !customRange?.end) {
        return { start: new Date(0), end: now }
      }
      return {
        start: new Date(customRange.start),
        end: new Date(customRange.end)
      }
    default:
      return { start: new Date(0), end: now }
  }
}

// Check if date is within range
export const isDateInRange = (date: Date | string, range: { start: Date; end: Date }): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date
  return targetDate >= range.start && targetDate <= range.end
}

// Generate timestamp for file names
export const generateTimestamp = (): string => {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`
}
