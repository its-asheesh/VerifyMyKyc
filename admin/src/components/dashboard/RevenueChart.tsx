import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { TrendingUp } from 'lucide-react'

// Types
import type { RevenueTrendItem } from '../../services/api/analyticsApi'
import { formatCurrency } from '../../utils/dateUtils'

interface RevenueChartProps {
  data: RevenueTrendItem[]
  isLoading?: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <p className="text-indigo-600 text-lg font-bold">
          {formatCurrency(payload[0].value as number)}
        </p>
      </div>
    )
  }
  return null
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-[350px] bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-center">
        <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  // Calculate generic trend (mock logic for visual, or real if we had previous period)
  // For now just checking if last value > first value
  const isPositiveTrend = data.length > 1 && data[data.length - 1].value >= data[0].value

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Revenue Trends
          </h2>
          <p className="text-sm text-slate-500 mt-1">Monthly revenue performance</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPositiveTrend ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
            {isPositiveTrend ? '+ Growth' : '- Decline'}
          </span>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `₹${value >= 1000 ? `${value / 1000}k` : value}`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RevenueChart