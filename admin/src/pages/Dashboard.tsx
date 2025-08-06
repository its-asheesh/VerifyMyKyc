import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  Shield,
  Settings,
  Package,
  BarChart3,
  FileText,
  Calendar,
  Loader2,
  BarChart
} from 'lucide-react'
import { useAnalyticsOverview } from '../hooks/useAnalytics'
import { useRecentActivity } from '../hooks/useAnalytics'

const Dashboard: React.FC = () => {
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useAnalyticsOverview()
  const { data: recentActivityData, isLoading: activityLoading, error: activityError } = useRecentActivity(10)

  // Format currency
  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₹0.00'
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  // Prepare stats from real data
  const stats = analyticsData ? [
    {
      title: 'Total Revenue',
      value: formatCurrency(analyticsData.metrics.totalRevenue),
      change: formatPercentage(analyticsData.metrics.revenueChange),
      changeType: analyticsData.metrics.revenueChange >= 0 ? 'positive' : 'negative',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Total Users',
      value: formatNumber(analyticsData.metrics.totalUsers),
      change: formatPercentage(analyticsData.metrics.usersChange),
      changeType: analyticsData.metrics.usersChange >= 0 ? 'positive' : 'negative',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Orders',
      value: formatNumber(analyticsData.metrics.activeOrders),
      change: formatPercentage(analyticsData.metrics.ordersChange),
      changeType: analyticsData.metrics.ordersChange >= 0 ? 'positive' : 'negative',
      icon: CreditCard,
      color: 'green'
    },
    {
      title: 'Success Rate',
      value: `${analyticsData.metrics.successRate}%`,
      change: 'vs last month',
      changeType: 'positive',
      icon: Shield,
      color: 'orange'
    }
  ] : []

  const quickActions = [
    {
      title: 'Manage Pricing',
      description: 'Update verification and plan pricing',
      icon: CreditCard,
      link: '/pricing',
      color: 'blue'
    },
    {
      title: 'Order Management',
      description: 'View and manage user orders',
      icon: Package,
      link: '/orders',
      color: 'green'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and roles',
      icon: Users,
      link: '/users',
      color: 'purple'
    },
    {
      title: 'Coupon Management',
      description: 'Create and manage discount coupons',
      icon: BarChart3,
      link: '/coupons',
      color: 'orange'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics and reports',
      icon: BarChart,
      link: '/analytics',
      color: 'indigo'
    },
    {
      title: 'Location Analytics',
      description: 'View user location analytics',
      icon: Activity,
      link: '/location-analytics',
      color: 'pink'
    }
  ]

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 bg-blue-100'
      case 'green':
        return 'text-green-600 bg-green-100'
      case 'purple':
        return 'text-purple-600 bg-purple-100'
      case 'orange':
        return 'text-orange-600 bg-orange-100'
      case 'indigo':
        return 'text-indigo-600 bg-indigo-100'
      case 'pink':
        return 'text-pink-600 bg-pink-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return CreditCard
      case 'user':
        return Users
      default:
        return Activity
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-green-600 bg-green-100'
      case 'user':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  // Loading state
  if (analyticsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (analyticsError || activityError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              Failed to load dashboard data. Please try again later.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your verification platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${getIconColor(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="xl:grid-cols-3 gap-8 mb-8">
        {/* Quick Actions */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getIconColor(action.color)} group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivityData?.slice(0, 5).map((activity, index) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id || index} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timeAgo}</p>
                      {activity.amount && (
                        <p className="text-xs text-green-600 font-medium mt-1">
                          {formatCurrency(activity.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                to="/analytics"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all activity →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 