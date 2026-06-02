import React from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'indigo' | 'pink'
  loading?: boolean
  className?: string
  variant?: 'default' | 'gradient'
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'blue',
  loading = false,
  className = '',
  variant = 'default'
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600'
  }

  const gradientClasses = {
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20',
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20',
    green: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20',
    indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20',
    pink: 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/20',
    red: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20',
    yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/20'
  }



  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${variant === 'gradient' ? 'bg-gray-100' : colorClasses[color]}`}>
            <Icon className={`w-6 h-6 ${variant === 'gradient' ? 'text-gray-400' : ''}`} />
          </div>
          <div className="ml-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-20"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (variant === 'gradient') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden ${className}`}
      >
        {/* Background Decoration */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientClasses[color].split(' ')[1]} opacity-5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-10`} />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientClasses[color].split('dest-')[0]} text-white shadow-lg shadow-${color}-500/30`}>
              <Icon className="w-6 h-6" />
            </div>
            {change && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${changeType === 'positive' ? 'bg-green-50 text-green-700 border border-green-100' :
                changeType === 'negative' ? 'bg-red-50 text-red-700 border border-red-100' :
                  'bg-gray-50 text-gray-700 border border-gray-100'
                }`}>
                {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : ''} {change}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase">{title}</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <p className="text-3xl font-bold text-gray-900 tracking-tight leading-none">{value}</p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Default premium card style
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-white rounded-2xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden group ${className}`}
    >
      {/* Top Border Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color === 'blue' ? 'from-blue-500 to-indigo-500' :
        color === 'green' ? 'from-emerald-500 to-green-500' :
          color === 'purple' ? 'from-violet-500 to-purple-500' :
            color === 'orange' ? 'from-orange-500 to-amber-500' :
              color === 'red' ? 'from-rose-500 to-red-500' :
                'from-gray-500 to-slate-500'
        }`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${colorClasses[color]} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-semibold ${changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-600'} flex items-center`}>
            {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '•'} {change}
          </span>
          <span className="text-gray-400 ml-2 font-medium">vs last month</span>
        </div>
      )}
    </motion.div>
  )
}

export default StatCard
