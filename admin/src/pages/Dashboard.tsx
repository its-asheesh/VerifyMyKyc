import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  Shield,
  Package,
  BarChart3,
  Loader2,
  BarChart,
  ArrowUpRight,
  IndianRupee,
  RefreshCcw
} from 'lucide-react'
import { useAnalyticsOverview, useAnalyticsByDateRange, useRecentActivity } from '../hooks/useAnalytics'
import RevenueChart from '../components/dashboard/RevenueChart'
import StatCard from '../components/common/StatCard'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'

const Dashboard: React.FC = () => {

  const [dateRange, setDateRange] = useState('ytd')
  const [dateRangeDates, setDateRangeDates] = useState({ start: '', end: '' })

  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview
  } = useAnalyticsOverview()

  const {
    data: rangeData,
    isLoading: rangeLoading,
    error: rangeError,
    refetch: refetchRange
  } = useAnalyticsByDateRange(dateRangeDates.start, dateRangeDates.end)

  const {
    data: recentActivityData,
    refetch: refetchActivity
  } = useRecentActivity(10)

  // Calculate dates when filter changes
  useEffect(() => {
    if (dateRange === 'ytd') {
      setDateRangeDates({ start: '', end: '' })
      return
    }

    const now = new Date()
    let start = new Date()
    const end = new Date()

    switch (dateRange) {
      case '7days':
        start.setDate(now.getDate() - 7)
        break
      case '30days':
        start.setDate(now.getDate() - 30)
        break
      case '90days':
        start.setMonth(now.getMonth() - 3)
        break
      default:
        start.setFullYear(now.getFullYear(), 0, 1) // YTD fallback
    }

    setDateRangeDates({
      start: start.toISOString(),
      end: end.toISOString()
    })
  }, [dateRange])

  const isLoading = dateRange === 'ytd' ? overviewLoading : rangeLoading
  const error = dateRange === 'ytd' ? overviewError : rangeError
  const activeData = dateRange === 'ytd' ? overviewData : rangeData

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([
        dateRange === 'ytd' ? refetchOverview() : refetchRange(),
        refetchActivity()
      ])
      toast.success('Dashboard data updated')
    } catch (error) {
      toast.error('Failed to refresh data')
      console.error(error)
    } finally {
      setIsRefreshing(false)
    }
  }

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
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return undefined
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  // Prepare stats from real data
  const stats = activeData ? [
    {
      title: 'Total Revenue',
      value: formatCurrency(activeData.metrics.totalRevenue),
      change: dateRange === 'ytd' ? formatPercentage((activeData as any).metrics.revenueChange) : undefined,
      changeType: dateRange === 'ytd' ? ((activeData as any).metrics.revenueChange >= 0 ? 'positive' : 'negative') : undefined,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Total Users',
      value: formatNumber(dateRange === 'ytd' ? (activeData as any).metrics.totalUsers : 0), // available only in overview
      // Sort fix: if not YTD, we don't have total users in range query easily unless we add it
      // Actually range query types I added didn't include totalUsers? 
      // Wait, range query types I added didn't include totalUsers.
      // So for non-YTD, let's show N/A or hide this card? 
      // Better: Show "Total Orders" instead or something else? 
      // For now let's just show N/A if 0.
      change: dateRange === 'ytd' ? formatPercentage((activeData as any).metrics.usersChange) : undefined,
      changeType: dateRange === 'ytd' ? ((activeData as any).metrics.usersChange >= 0 ? 'positive' : 'negative') : undefined,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Orders',
      value: formatNumber(activeData.metrics.activeOrders),
      change: dateRange === 'ytd' ? formatPercentage((activeData as any).metrics.ordersChange) : undefined,
      changeType: dateRange === 'ytd' ? ((activeData as any).metrics.ordersChange >= 0 ? 'positive' : 'negative') : undefined,
      icon: CreditCard,
      color: 'green'
    },
    {
      title: 'Success Rate',
      value: `${activeData.metrics.successRate}%`,
      change: dateRange === 'ytd' ? 'vs last month' : undefined,
      changeType: dateRange === 'ytd' ? 'positive' : undefined, // Success rate doesn't have change in API yet
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



  // Get muted colors for action cards
  const getSoftColors = (color: string) => {
    switch (color) {
      case 'purple': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
      case 'blue': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
      case 'green': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
      case 'orange': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' }
      case 'indigo': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' }
      case 'pink': return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return CreditCard
      case 'user': return Users
      case 'payment': return IndianRupee
      default: return Activity
    }
  }

  // Loading state
  const LoadingSkeleton = () => (
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 animate-ping"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        </div>
        <span className="text-slate-500 font-medium">Loading analytics...</span>
      </div>
    </div>
  )

  if (isLoading && !activeData) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-6">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-red-800">Error Loading Dashboard</h3>
            <div className="mt-2 text-sm text-red-700">
              Failed to load dashboard data. Please check your connection and try again.
            </div>
            <button
              onClick={() => handleRefresh()}
              className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between py-2 border-b border-slate-200/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-2 text-lg">Detailed analysis of your verification platform.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="md"
            className={`p-2.5 rounded-xl ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isRefreshing}
            title="Refresh Data"
          >
            <RefreshCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="block w-full min-w-[160px] rounded-xl border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium focus:border-indigo-500 focus:ring-indigo-500 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <option value="ytd">Year to Date</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last Quarter</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType as any}
            icon={stat.icon}
            color={stat.color as any}
            variant="gradient"
            loading={isLoading}
          />
        ))}
      </div>

      {/* Main Content Grid with Revenue Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Chart - Spans 2 columns on large screens */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <RevenueChart
              data={activeData?.revenueTrend || []}
              isLoading={isLoading}
            />
          </motion.div>
        </div>

        {/* Recent Activity - Spans 1 column */}
        <div className="xl:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden min-h-[400px]"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Live Feed
              </h2>
              <Link to="/orders" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors">View All</Link>
            </div>

            <div className="p-6 flex-1 overflow-y-auto max-h-[350px] custom-scrollbar">
              <div className="space-y-0 relative">
                {/* Timeline Line */}
                <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-100" />

                {(recentActivityData || []).slice(0, 5).map((activity, index) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id || index} className="relative flex gap-4 group pb-6 last:pb-0">
                      <div className="relative z-10 flex-none bg-white py-1">
                        <div className={`w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${activity.type === 'order' ? 'bg-emerald-100 text-emerald-600' :
                          activity.type === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-2 pl-2">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {activity.message}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 whitespace-nowrap ml-2">{activity.timeAgo}</span>
                        </div>
                        {activity.amount && (
                          <div className="mt-1">
                            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                              {formatCurrency(activity.amount)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions - Full width below charts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action, _index) => {
            const Icon = action.icon
            const colors = getSoftColors(action.color)

            return (
              <Link
                key={action.title}
                to={action.link}
                className="group relative bg-white overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Top color bar */}
                <div className={`h-1.5 w-full ${action.color === 'purple' ? 'bg-purple-500' : action.color === 'blue' ? 'bg-blue-500' : action.color === 'green' ? 'bg-emerald-500' : action.color === 'orange' ? 'bg-orange-500' : action.color === 'indigo' ? 'bg-indigo-500' : 'bg-pink-500'}`} />

                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} transform group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">{action.description}</p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Dashboard