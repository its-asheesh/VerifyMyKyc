import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  IndianRupee, 
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  Loader2
} from 'lucide-react'
import { useAnalyticsOverview } from '../hooks/useAnalytics'

const Analytics: React.FC = () => {
  const { data: analyticsData, isLoading, error } = useAnalyticsOverview()

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Analytics</h3>
            <div className="mt-2 text-sm text-red-700">
              Failed to load analytics data. Please try again later.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">No Data Available</h3>
            <div className="mt-2 text-sm text-yellow-700">
              No analytics data available yet. Data will appear once orders and users are created.
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { metrics, revenueTrend, serviceDistribution, topPlans, userGrowth } = analyticsData

  // Prepare metrics for display
  const displayMetrics = [
    {
      name: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      change: formatPercentage(metrics.revenueChange),
      changeType: metrics.revenueChange >= 0 ? 'increase' : 'decrease',
      icon: IndianRupee,
      color: 'bg-green-500'
    },
    {
      name: 'Total Users',
      value: formatNumber(metrics.totalUsers),
      change: formatPercentage(metrics.usersChange),
      changeType: metrics.usersChange >= 0 ? 'increase' : 'decrease',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Orders',
      value: formatNumber(metrics.totalOrders),
      change: formatPercentage(metrics.ordersChange),
      changeType: metrics.ordersChange >= 0 ? 'increase' : 'decrease',
      icon: Activity,
      color: 'bg-purple-500'
    },
    {
      name: 'Success Rate',
      value: `${metrics.successRate}%`,
      change: 'N/A',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Track your platform performance and user engagement</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayMetrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              {metric.change !== 'N/A' && (
                <div className="flex items-center mt-4">
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-sm text-gray-600">Monthly revenue over the last 6 months</p>
            </div>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          
          {revenueTrend.length > 0 ? (
            <div className="space-y-4">
              {revenueTrend.map((item, index) => (
                <div key={item.month} className="flex items-center">
                  <div className="w-16 text-sm font-medium text-gray-600">{item.month}</div>
                  <div className="flex-1 ml-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(item.value / Math.max(...revenueTrend.map(d => d.value))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.value)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No revenue data available yet
            </div>
          )}
        </motion.div>

        {/* Service Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Service Distribution</h3>
              <p className="text-sm text-gray-600">Verification requests by service type</p>
            </div>
            <PieChart className="w-6 h-6 text-gray-400" />
          </div>
          
          {serviceDistribution.length > 0 ? (
            <div className="space-y-4">
              {serviceDistribution.map((service, index) => (
                <div key={service.service} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">{service.service}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{service.count} requests</span>
                    <span className="text-sm font-medium text-gray-900">{service.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No service data available yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Performing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Plans</h3>
          {topPlans.length > 0 ? (
            <div className="space-y-3">
              {topPlans.map((plan, index) => (
                <div key={plan.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{plan.name}</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(plan.revenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No plan data available yet
            </div>
          )}
        </motion.div>

        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          {userGrowth.length > 0 ? (
            <div className="space-y-3">
              {userGrowth.slice(-3).map((item, index) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <span className="text-sm font-medium text-green-600">+{item.newUsers}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No user growth data available yet
            </div>
          )}
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Orders</span>
              <span className="text-sm font-medium text-gray-900">{formatNumber(metrics.activeOrders)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-sm font-medium text-green-600">{metrics.successRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-sm font-medium text-gray-900">{formatNumber(metrics.totalOrders)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics 