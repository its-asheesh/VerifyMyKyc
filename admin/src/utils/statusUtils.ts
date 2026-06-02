// Core utilities for status management
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff,
  Crown,
  User,
  Shield
} from 'lucide-react'

export type StatusType = 
  | 'active' | 'inactive' | 'expired' | 'cancelled' | 'pending' 
  | 'completed' | 'failed' | 'refunded' | 'published' | 'draft'
  | 'verified' | 'unverified' | 'upcoming' | 'limit-reached'

export type StatusColor = 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray' | 'orange'

export interface StatusConfig {
  color: StatusColor
  icon: React.ComponentType<{ className?: string }>
  label: string
}

export const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  // General statuses
  active: {
    color: 'green',
    icon: CheckCircle,
    label: 'Active'
  },
  inactive: {
    color: 'red',
    icon: XCircle,
    label: 'Inactive'
  },
  expired: {
    color: 'red',
    icon: AlertCircle,
    label: 'Expired'
  },
  cancelled: {
    color: 'gray',
    icon: X,
    label: 'Cancelled'
  },
  pending: {
    color: 'yellow',
    icon: Clock,
    label: 'Pending'
  },
  
  // Payment statuses
  completed: {
    color: 'green',
    icon: CheckCircle,
    label: 'Completed'
  },
  failed: {
    color: 'red',
    icon: XCircle,
    label: 'Failed'
  },
  refunded: {
    color: 'blue',
    icon: Shield,
    label: 'Refunded'
  },
  
  // Content statuses
  published: {
    color: 'green',
    icon: Eye,
    label: 'Published'
  },
  draft: {
    color: 'gray',
    icon: EyeOff,
    label: 'Draft'
  },
  
  // Verification statuses
  verified: {
    color: 'green',
    icon: CheckCircle,
    label: 'Verified'
  },
  unverified: {
    color: 'red',
    icon: XCircle,
    label: 'Unverified'
  },
  
  // Special statuses
  upcoming: {
    color: 'yellow',
    icon: Clock,
    label: 'Upcoming'
  },
  'limit-reached': {
    color: 'orange',
    icon: AlertCircle,
    label: 'Limit Reached'
  }
}

export const STATUS_COLORS: Record<StatusColor, string> = {
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  gray: 'bg-gray-100 text-gray-800',
  orange: 'bg-orange-100 text-orange-800'
}

export const STATUS_ICON_COLORS: Record<StatusColor, string> = {
  green: 'text-green-500',
  red: 'text-red-500',
  yellow: 'text-yellow-500',
  blue: 'text-blue-500',
  purple: 'text-purple-500',
  gray: 'text-gray-500',
  orange: 'text-orange-500'
}

// Utility functions
export const getStatusConfig = (status: string): StatusConfig => {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-') as StatusType
  return STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.inactive
}

export const getStatusColor = (status: string): string => {
  const config = getStatusConfig(status)
  return STATUS_COLORS[config.color]
}

export const getStatusIcon = (status: string) => {
  const config = getStatusConfig(status)
  return {
    component: config.icon,
    className: `w-4 h-4 ${STATUS_ICON_COLORS[config.color]}`
  }
}

export const getStatusLabel = (status: string): string => {
  const config = getStatusConfig(status)
  return config.label
}

// Role-specific utilities
export const getRoleConfig = (role: string) => {
  return role === 'admin' 
    ? { color: 'purple', icon: Crown, label: 'Admin' }
    : { color: 'blue', icon: User, label: 'User' }
}

export const getRoleColor = (role: string): string => {
  const config = getRoleConfig(role)
  const color = config?.color as keyof typeof STATUS_COLORS
  // Fallback to gray if color is invalid
  return STATUS_COLORS[color] || STATUS_COLORS.gray
}

export const getRoleIcon = (role: string) => {
  const config = getRoleConfig(role)
  const color = config?.color as keyof typeof STATUS_ICON_COLORS
  // Fallback to gray if color is invalid
  return {
    component: config.icon,
    className: `w-4 h-4 ${STATUS_ICON_COLORS[color] || STATUS_ICON_COLORS.gray}`
  }
}
