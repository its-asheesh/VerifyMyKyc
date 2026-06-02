import React from 'react'
import { getStatusConfig, getStatusColor, getStatusLabel, STATUS_ICON_COLORS } from '../../utils/statusUtils'
import type { StatusType } from '../../utils/statusUtils'

export interface StatusBadgeProps {
  status: StatusType | string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true, 
  className = '' 
}) => {
  const config = getStatusConfig(status)
  const colorClass = getStatusColor(status)
  const label = getStatusLabel(status)
  const IconComponent = config.icon
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${colorClass} ${className}`}>
      {showIcon && (
        <span className={iconSizes[size]}>
          <IconComponent className={`w-4 h-4 ${STATUS_ICON_COLORS[config.color]}`} />
        </span>
      )}
      {label}
    </span>
  )
}

export default StatusBadge
