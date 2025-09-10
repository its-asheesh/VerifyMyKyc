import React from 'react'
import { TrendingUp, Calendar, IndianRupee } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import ResizableModal from './ResizableModal'
import { useOrderStats } from '../../hooks/useOrders'

interface RevenueChartProps {
  isOpen: boolean
  onClose: () => void
  data: any
}

const RevenueChart: React.FC<RevenueChartProps> = ({ isOpen, onClose, data }) => {
  // Get real order statistics data
  const { data: orderStats } = useOrderStats()

  // Helper function to assign colors to services - must be defined before usage
  const getServiceColor = (serviceName: string) => {
    const colors = {
      'Aadhaar Verification': '#8B5CF6',
      'PAN Verification': '#3B82F6',
      'Driving License': '#10B981',
      'GSTIN Verification': '#F59E0B',
      'MCA Verification': '#EF4444',
      'default': '#6B7280'
    }
    return colors[serviceName as keyof typeof colors] || colors.default
  }

  // Use the exact same data from metrics and real order stats - EXACTLY like OrderManagement page
  const totalRevenue = data?.metrics?.totalRevenue || orderStats?.totalRevenue || 0
  const totalOrders = data?.metrics?.totalOrders || orderStats?.totalOrders || 0
  const completedOrders = orderStats?.completedOrders || 0
  const pendingOrders = orderStats?.pendingOrders || 0
  const activeOrders = orderStats?.activeOrders || 0
  const expiredOrders = orderStats?.expiredOrders || 0
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  // Use the exact same data from analytics API that's used in dashboard cards
  const revenueData = data?.revenueTrend?.map((item: any, _index: number) => ({
    month: item.month,
    revenue: item.value,
    // Use exact same order data structure as OrderManagement page
    orders: orderStats?.totalOrders || 0,
    completedOrders: orderStats?.completedOrders || 0,
    pendingOrders: orderStats?.pendingOrders || 0,
    activeOrders: orderStats?.activeOrders || 0,
    users: Math.floor(item.value / 5000) + Math.floor(Math.random() * 10)
  })) || [
    { month: 'Jan', revenue: 45000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 12 },
    { month: 'Feb', revenue: 52000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 18 },
    { month: 'Mar', revenue: 48000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 15 },
    { month: 'Apr', revenue: 61000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 22 },
    { month: 'May', revenue: 55000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 20 },
    { month: 'Jun', revenue: 72000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 28 },
    { month: 'Jul', revenue: 68000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 25 },
    { month: 'Aug', revenue: 75000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 30 },
    { month: 'Sep', revenue: 82000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 35 },
    { month: 'Oct', revenue: 78000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 32 },
    { month: 'Nov', revenue: 85000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 38 },
    { month: 'Dec', revenue: 92000, orders: 0, completedOrders: 0, pendingOrders: 0, activeOrders: 0, users: 42 }
  ]

  // Use the exact same service distribution data from API
  const serviceDistribution = data?.serviceDistribution?.map((item: any) => ({
    name: item.service,
    value: item.percentage,
    color: getServiceColor(item.service)
  })) || [
    { name: 'Aadhaar Verification', value: 35, color: '#8B5CF6' },
    { name: 'PAN Verification', value: 25, color: '#3B82F6' },
    { name: 'Driving License', value: 20, color: '#10B981' },
    { name: 'GSTIN Verification', value: 15, color: '#F59E0B' },
    { name: 'MCA Verification', value: 5, color: '#EF4444' }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-purple-600 font-semibold">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-green-600">
            Completed Orders: {payload[1]?.value || 0}
          </p>
          <p className="text-orange-600">
            Pending Orders: {payload[2]?.value || 0}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResizableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Revenue Analytics"
      subtitle="Comprehensive revenue insights and trends"
      icon={<TrendingUp className="w-6 h-6" />}
      gradientFrom="from-purple-600"
      gradientTo="to-blue-600"
    >
      <div className="p-6 space-y-6">
        {/* Summary Cards - Using exact same data as dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Revenue</p>
                <p className="text-xl font-bold text-purple-900">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                <p className="text-xl font-bold text-blue-900">
                  {totalOrders.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Completed Orders</p>
                <p className="text-xl font-bold text-green-900">
                  {completedOrders.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">Avg. Order Value</p>
                <p className="text-xl font-bold text-orange-900">
                  {formatCurrency(averageOrderValue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Orders vs Revenue Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders vs Revenue</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  yAxisId="left"
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  yAxisId="right"
                  orientation="right"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="completedOrders" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="pendingOrders" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Service Distribution */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Distribution</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {serviceDistribution.map((service: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: service.color }}
                    />
                    <span className="text-gray-700">{service.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{service.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: completedOrders, color: '#10B981' },
                    { name: 'Pending', value: pendingOrders, color: '#F59E0B' },
                    { name: 'Active', value: activeOrders, color: '#3B82F6' },
                    { name: 'Expired', value: expiredOrders, color: '#EF4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Completed', value: completedOrders, color: '#10B981' },
                    { name: 'Pending', value: pendingOrders, color: '#F59E0B' },
                    { name: 'Active', value: activeOrders, color: '#3B82F6' },
                    { name: 'Expired', value: expiredOrders, color: '#EF4444' }
                  ].map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [value, 'Orders']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {[
                { name: 'Completed', value: completedOrders, color: '#10B981' },
                { name: 'Pending', value: pendingOrders, color: '#F59E0B' },
                { name: 'Active', value: activeOrders, color: '#3B82F6' },
                { name: 'Expired', value: expiredOrders, color: '#EF4444' }
              ].map((status: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-gray-700">{status.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{status.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Growth</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ResizableModal>
  )
}

export default RevenueChart 