import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize2, Minimize2, RefreshCw, Filter, ZoomIn, ZoomOut } from 'lucide-react'
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
  Cell,
  ReferenceArea
} from 'recharts'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartJSTooltip,
  Legend,
  Filler,
  TimeScale
} from 'chart.js'
import { Line as ChartJSLine, Bar as ChartJSBar } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartJSTooltip,
  Legend,
  Filler,
  TimeScale,
  zoomPlugin
)

interface ChartData {
  name?: string
  value?: number
  [key: string]: any
}

interface ChartConfig {
  type: 'area' | 'line' | 'bar' | 'pie' | 'chartjs-line' | 'chartjs-bar'
  data: ChartData[]
  dataKey: string
  xAxisDataKey?: string
  yAxisDataKey?: string
  title: string
  height?: number
  colors?: string[]
  gradient?: {
    id: string
    fromColor: string
    toColor: string
  }
  tooltip?: boolean
  grid?: boolean
  formatValue?: (value: any) => string
  fullWidth?: boolean
  zoomable?: boolean
  showDots?: boolean
  multipleLines?: Array<{
    dataKey: string
    color: string
    name: string
  }>
  useChartJS?: boolean
}

interface ChartGrid {
  charts: ChartConfig[]
  columns?: 1 | 2
}

interface AnalyticsControls {
  dateRange?: string
  onDateRangeChange?: (range: string) => void
  timeGranularity?: string
  onTimeGranularityChange?: (granularity: string) => void
  customStartDate?: string
  customEndDate?: string
  onCustomDateChange?: (startDate: string, endDate: string) => void
  onRefresh?: () => void
  isLoading?: boolean
  showDateRange?: boolean
  showTimeGranularity?: boolean
  showRefresh?: boolean
  dateRangeOptions?: { value: string; label: string }[]
  granularityOptions?: { value: string; label: string }[]
}

interface ResizableModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  subtitle: string
  icon: React.ReactNode
  gradientFrom: string
  gradientTo: string
  customHeader?: React.ReactNode
  analyticsControls?: AnalyticsControls
  chartGrid?: ChartGrid
}

const ResizableModal: React.FC<ResizableModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  icon,
  gradientFrom,
  gradientTo,
  customHeader,
  analyticsControls,
  chartGrid
}) => {
  const [isMaximized, setIsMaximized] = useState(false)
  const [size, setSize] = useState({ width: 1400, height: 900 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const resizeRef = useRef<HTMLDivElement>(null)

  // Zoom state management
  const [zoomStates, setZoomStates] = useState<{ [key: string]: any }>({})
  const [isZooming, setIsZooming] = useState<{ [key: string]: boolean }>({})

  // Monitor zoom state changes
  useEffect(() => {
    console.log('Zoom states changed:', zoomStates)
  }, [zoomStates])

  // Monitor analytics controls changes
  useEffect(() => {
    if (analyticsControls) {
      console.log('Analytics controls changed:', {
        dateRange: analyticsControls.dateRange,
        timeGranularity: analyticsControls.timeGranularity,
        customStartDate: analyticsControls.customStartDate,
        customEndDate: analyticsControls.customEndDate
      })
    }
  }, [analyticsControls])

  // Zoom functions
  const handleZoomStart = (chartId: string, e: any) => {
    if (!e || !e.activeLabel) return
    setIsZooming(prev => ({ ...prev, [chartId]: true }))
    setZoomStates(prev => ({
      ...prev,
      [chartId]: { ...prev[chartId], left: e.activeLabel, right: e.activeLabel, refAreaLeft: e.activeLabel, refAreaRight: e.activeLabel }
    }))
  }

  const handleZoomMove = (chartId: string, e: any) => {
    if (!isZooming[chartId] || !e || !e.activeLabel) return
    setZoomStates(prev => ({
      ...prev,
      [chartId]: { ...prev[chartId], refAreaRight: e.activeLabel }
    }))
  }

  const handleZoomEnd = (chartId: string) => {
    if (!isZooming[chartId]) return
    setIsZooming(prev => ({ ...prev, [chartId]: false }))
    
    const zoomState = zoomStates[chartId]
    console.log('Zoom drag ended for:', chartId, 'Current state:', zoomState)
    
    if (zoomState && zoomState.refAreaLeft === zoomState.refAreaRight) {
      console.log('Same start and end, resetting zoom')
      setZoomStates(prev => ({ ...prev, [chartId]: null }))
      return
    }

    const newZoomState = {
      left: zoomState.refAreaLeft,
      right: zoomState.refAreaRight,
      refAreaLeft: '',
      refAreaRight: ''
    }
    
    console.log('Setting new zoom state:', newZoomState)

    setZoomStates(prev => ({
      ...prev,
      [chartId]: newZoomState
    }))
  }

  const handleZoomReset = (chartId: string) => {
    setZoomStates(prev => ({ ...prev, [chartId]: null }))
  }

  const handleZoomIn = (chartId: string, config: ChartConfig) => {
    console.log('Zoom In clicked for:', chartId)
    const currentZoom = zoomStates[chartId]
    console.log('Current zoom state:', currentZoom)
    
    if (!currentZoom || !currentZoom.left || !currentZoom.right) {
      console.log('No current zoom state, cannot zoom in')
      return
    }

    const data = config.data
    console.log('Data length:', data.length)
    console.log('Data keys:', data[0] ? Object.keys(data[0]) : 'No data')
    
    const leftIndex = data.findIndex((item: any) => 
      item[config.xAxisDataKey || 'name'] === currentZoom.left
    )
    const rightIndex = data.findIndex((item: any) => 
      item[config.xAxisDataKey || 'name'] === currentZoom.right
    )
    
    console.log('Found indices:', { leftIndex, rightIndex })
    
    if (leftIndex === -1 || rightIndex === -1) {
      console.log('Could not find zoom boundaries in data')
      return
    }
    
    const start = Math.min(leftIndex, rightIndex)
    const end = Math.max(leftIndex, rightIndex)
    const range = end - start
    
    console.log('Current range:', { start, end, range })
    
    // Zoom in by reducing the range by 50%
    const newRange = Math.max(1, Math.floor(range * 0.5))
    const center = Math.floor((start + end) / 2)
    const newStart = Math.max(0, center - Math.floor(newRange / 2))
    const newEnd = Math.min(data.length - 1, newStart + newRange)
    
    const newZoomState = {
      left: data[newStart][config.xAxisDataKey || 'name'],
      right: data[newEnd][config.xAxisDataKey || 'name']
    }
    
    console.log('New zoom state:', newZoomState)
    
    setZoomStates(prev => {
      const newState = {
        ...prev,
        [chartId]: newZoomState
      }
      console.log('Updated zoom states:', newState)
      return newState
    })
  }

  const handleZoomOut = (chartId: string, config: ChartConfig) => {
    const currentZoom = zoomStates[chartId]
    if (!currentZoom || !currentZoom.left || !currentZoom.right) return

    const data = config.data
    const leftIndex = data.findIndex((item: any) => 
      item[config.xAxisDataKey || 'name'] === currentZoom.left
    )
    const rightIndex = data.findIndex((item: any) => 
      item[config.xAxisDataKey || 'name'] === currentZoom.right
    )
    
    if (leftIndex === -1 || rightIndex === -1) return
    
    const start = Math.min(leftIndex, rightIndex)
    const end = Math.max(leftIndex, rightIndex)
    const range = end - start
    
    // Zoom out by increasing the range by 100%
    const newRange = Math.min(data.length - 1, range * 2)
    const center = Math.floor((start + end) / 2)
    const newStart = Math.max(0, center - Math.floor(newRange / 2))
    const newEnd = Math.min(data.length - 1, newStart + newRange)
    
    const newZoomState = {
      left: data[newStart][config.xAxisDataKey || 'name'],
      right: data[newEnd][config.xAxisDataKey || 'name']
    }
    
    console.log('Zoom Out:', { chartId, currentZoom, newZoomState })
    
    setZoomStates(prev => ({
      ...prev,
      [chartId]: newZoomState
    }))
  }

  // Default analytics control options
  const defaultDateRangeOptions = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const defaultGranularityOptions = [
    { value: 'day', label: 'Daily' },
    { value: 'month', label: 'Monthly' },
    { value: 'year', label: 'Yearly' }
  ]

  const {
    dateRange = '6months',
    onDateRangeChange,
    timeGranularity = 'month',
    onTimeGranularityChange,
    customStartDate = '',
    customEndDate = '',
    onCustomDateChange,
    onRefresh,
    isLoading = false,
    showDateRange = false,
    showTimeGranularity = false,
    showRefresh = false,
    dateRangeOptions = defaultDateRangeOptions,
    granularityOptions = defaultGranularityOptions
  } = analyticsControls || {}

  // Set initial size based on screen size
  useEffect(() => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    // Calculate optimal size (85% of screen size with minimums to ensure header visibility)
    const optimalWidth = Math.max(1400, Math.min(screenWidth * 0.85, 1800))
    const optimalHeight = Math.max(1000, Math.min(screenHeight * 0.85, 1400)) // Increased minimum height
    
    // Calculate position to center the modal
    const centerX = (screenWidth - optimalWidth) / 2
    const centerY = Math.max(20, (screenHeight - optimalHeight) / 2) // Ensure at least 20px from top
    
    setSize({ width: optimalWidth, height: optimalHeight })
    setPosition({ x: centerX, y: centerY })
  }, [])

  const toggleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false)
      // Restore to optimal size with proper positioning
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const optimalWidth = Math.max(1400, Math.min(screenWidth * 0.85, 1800))
      const optimalHeight = Math.max(900, Math.min(screenHeight * 0.85, 1200))
      
      // Calculate position to center the modal
      const centerX = (screenWidth - optimalWidth) / 2
      const centerY = Math.max(20, (screenHeight - optimalHeight) / 2) // Ensure at least 20px from top
      
      setSize({ width: optimalWidth, height: optimalHeight })
      setPosition({ x: centerX, y: centerY })
    } else {
      setIsMaximized(true)
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 })
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return
    setIsDragging(true)
    const startX = e.clientX - position.x
    const startY = e.clientY - position.y

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return
    e.stopPropagation()
    setIsResizing(true)
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = size.width
    const startHeight = size.height

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(1200, startWidth + (e.clientX - startX))
      const newHeight = Math.max(900, startHeight + (e.clientY - startY)) // Increased minimum height
      setSize({ width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, isResizing])

  // Reusable chart component
  const renderChart = (config: ChartConfig, chartIndex: number) => {
    const defaultColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6B7280']
    const colors = config.colors || defaultColors
    const chartId = `chart-${chartIndex}`

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0]?.payload
        return (
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-medium text-gray-900">{label}</p>
            {payload.map((entry: any, index: number) => (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: {config.formatValue ? config.formatValue(entry.value) : entry.value}
              </p>
            ))}
          </div>
        )
      }
      return null
    }

    const commonProps = {
      data: config.data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    // Enhanced height for full-width charts
    const chartHeight = config.fullWidth ? (config.height || 400) : (config.height || 300)

    // Zoom state for this chart
    const zoomState = zoomStates[chartId]

    // Filter data based on zoom
    const getZoomedData = () => {
      if (!zoomState || !zoomState.left || !zoomState.right) return config.data
      
      const leftIndex = config.data.findIndex((item: any) => 
        item[config.xAxisDataKey || 'name'] === zoomState.left
      )
      const rightIndex = config.data.findIndex((item: any) => 
        item[config.xAxisDataKey || 'name'] === zoomState.right
      )
      
      if (leftIndex === -1 || rightIndex === -1) return config.data
      
      const start = Math.min(leftIndex, rightIndex)
      const end = Math.max(leftIndex, rightIndex)
      const filteredData = config.data.slice(start, end + 1)
      
      console.log('Filtering data:', {
        originalLength: config.data.length,
        filteredLength: filteredData.length,
        start,
        end,
        leftValue: zoomState.left,
        rightValue: zoomState.right
      })
      
      return filteredData
    }

    const chartData = getZoomedData()

    // Get the domain for XAxis based on zoom state
    const getXAxisDomain = () => {
      if (!zoomState || !zoomState.left || !zoomState.right) return undefined
      const domain = [zoomState.left, zoomState.right]
      console.log('XAxis domain:', domain)
      return domain
    }

    // Debug logging
    if (config.zoomable && zoomState) {
      console.log('Chart Render:', {
        chartId,
        originalDataLength: config.data.length,
        zoomedDataLength: chartData.length,
        zoomState,
        xAxisDomain: getXAxisDomain()
      })
    }

    // Process data for Chart.js based on analytics controls
    const getProcessedData = () => {
      let processedData = chartData
      
      // Note: Date range filtering is handled by parent components
      // This function only handles additional processing if needed
      
      // Apply time granularity for Chart.js if needed
      if (analyticsControls?.timeGranularity && analyticsControls.timeGranularity !== 'month') {
        console.log('Applying time granularity in ResizableModal:', analyticsControls.timeGranularity)
        // For Chart.js, we can adjust the data density based on granularity
        if (analyticsControls.timeGranularity === 'day' && processedData.length > 30) {
          // Sample data for daily view if too many points
          processedData = processedData.filter((_, index) => index % 2 === 0)
        }
      }
      
      return processedData
    }

    const finalData = getProcessedData()

    const renderZoomControls = () => {
      if (!config.zoomable) return null
      
      const hasZoom = zoomState && zoomState.left && zoomState.right
      
      return (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">Zoom:</span>
          <button
            onClick={() => handleZoomIn(chartId, config)}
            disabled={!hasZoom}
            className={`p-1 rounded text-gray-600 transition-colors ${
              hasZoom ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer' : 'bg-gray-100 text-gray-400'
            }`}
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoomOut(chartId, config)}
            disabled={!hasZoom}
            className={`p-1 rounded text-gray-600 transition-colors ${
              hasZoom ? 'bg-blue-100 hover:bg-blue-200 cursor-pointer' : 'bg-gray-100 text-gray-400'
            }`}
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoomReset(chartId)}
            disabled={!hasZoom}
            className={`p-1 rounded text-gray-600 transition-colors ${
              hasZoom ? 'bg-red-100 hover:bg-red-200 cursor-pointer' : 'bg-gray-100 text-gray-400'
            }`}
            title="Reset zoom"
          >
            <X className="w-4 h-4" />
          </button>
          {/* Test button to set initial zoom */}
          <button
            onClick={() => {
              if (config.data.length > 2) {
                const testZoom = {
                  left: config.data[1][config.xAxisDataKey || 'name'],
                  right: config.data[config.data.length - 2][config.xAxisDataKey || 'name']
                }
                console.log('Setting test zoom:', testZoom)
                setZoomStates(prev => ({
                  ...prev,
                  [chartId]: testZoom
                }))
              }
            }}
            className="p-1 bg-green-100 hover:bg-green-200 rounded text-gray-600 transition-colors cursor-pointer"
            title="Test zoom"
          >
            <span className="text-xs">Test</span>
          </button>
          {hasZoom && (
            <span className="text-xs text-gray-500 ml-2">
              {zoomState.left} - {zoomState.right}
            </span>
          )}
        </div>
      )
    }

    switch (config.type) {
      case 'area':
        return (
          <div>
            {renderZoomControls()}
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart 
                {...commonProps}
                data={finalData}
                onMouseDown={config.zoomable ? (e) => handleZoomStart(chartId, e) : undefined}
                onMouseMove={config.zoomable ? (e) => handleZoomMove(chartId, e) : undefined}
                onMouseUp={config.zoomable ? () => handleZoomEnd(chartId) : undefined}
              >
                {config.gradient && (
                  <defs>
                    <linearGradient id={config.gradient.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={config.gradient.fromColor} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={config.gradient.toColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                )}
                {config.grid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
                <XAxis 
                  dataKey={config.xAxisDataKey || 'name'} 
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                  interval={config.zoomable ? 0 : 'preserveStartEnd'}
                  domain={getXAxisDomain()}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                {config.tooltip && <Tooltip content={<CustomTooltip />} />}
                <Area
                  type="monotone"
                  dataKey={config.dataKey}
                  stroke={colors[0]}
                  strokeWidth={config.zoomable ? 2 : 3}
                  fill={config.gradient ? `url(#${config.gradient.id})` : colors[0]}
                  dot={config.showDots ? { fill: colors[0], strokeWidth: 2, r: 3 } : false}
                  activeDot={config.zoomable ? { r: 4, stroke: colors[0], strokeWidth: 2 } : { r: 6, stroke: colors[0], strokeWidth: 2 }}
                />
                {config.zoomable && zoomState && zoomState.refAreaLeft && zoomState.refAreaRight && (
                  <ReferenceArea
                    x1={zoomState.refAreaLeft}
                    x2={zoomState.refAreaRight}
                    strokeOpacity={0.3}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )

      case 'line':
        return (
          <div>
            {renderZoomControls()}
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart 
                {...commonProps}
                data={finalData}
                onMouseDown={config.zoomable ? (e) => handleZoomStart(chartId, e) : undefined}
                onMouseMove={config.zoomable ? (e) => handleZoomMove(chartId, e) : undefined}
                onMouseUp={config.zoomable ? () => handleZoomEnd(chartId) : undefined}
              >
                {config.grid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
                <XAxis 
                  dataKey={config.xAxisDataKey || 'name'} 
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                  interval={config.zoomable ? 0 : 'preserveStartEnd'}
                  domain={getXAxisDomain()}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                {config.tooltip && <Tooltip content={<CustomTooltip />} />}
                {config.multipleLines ? (
                  config.multipleLines.map((line, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={line.dataKey}
                      stroke={line.color}
                      strokeWidth={config.zoomable ? 2 : 3}
                      dot={config.showDots ? { fill: line.color, strokeWidth: 2, r: 3 } : { fill: line.color, strokeWidth: 2, r: 4 }}
                      activeDot={config.zoomable ? { r: 4, stroke: line.color, strokeWidth: 2 } : { r: 6, stroke: line.color, strokeWidth: 2 }}
                      name={line.name}
                    />
                  ))
                ) : (
                  <Line
                    type="monotone"
                    dataKey={config.dataKey}
                    stroke={colors[0]}
                    strokeWidth={config.zoomable ? 2 : 3}
                    dot={config.showDots ? { fill: colors[0], strokeWidth: 2, r: 3 } : { fill: colors[0], strokeWidth: 2, r: 4 }}
                    activeDot={config.zoomable ? { r: 4, stroke: colors[0], strokeWidth: 2 } : { r: 6, stroke: colors[0], strokeWidth: 2 }}
                  />
                )}
                {config.zoomable && zoomState && zoomState.refAreaLeft && zoomState.refAreaRight && (
                  <ReferenceArea
                    x1={zoomState.refAreaLeft}
                    x2={zoomState.refAreaRight}
                    strokeOpacity={0.3}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )

      case 'bar':
        return (
          <div>
            {renderZoomControls()}
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart 
                {...commonProps}
                data={finalData}
                onMouseDown={config.zoomable ? (e) => handleZoomStart(chartId, e) : undefined}
                onMouseMove={config.zoomable ? (e) => handleZoomMove(chartId, e) : undefined}
                onMouseUp={config.zoomable ? () => handleZoomEnd(chartId) : undefined}
              >
                {config.grid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
                <XAxis 
                  dataKey={config.xAxisDataKey || 'name'} 
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                  interval={config.zoomable ? 0 : 'preserveStartEnd'}
                  domain={getXAxisDomain()}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                {config.tooltip && <Tooltip content={<CustomTooltip />} />}
                <Bar 
                  dataKey={config.dataKey} 
                  fill={colors[0]} 
                  radius={[4, 4, 0, 0]} 
                />
                {config.zoomable && zoomState && zoomState.refAreaLeft && zoomState.refAreaRight && (
                  <ReferenceArea
                    x1={zoomState.refAreaLeft}
                    x2={zoomState.refAreaRight}
                    strokeOpacity={0.3}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie
                data={config.data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey={config.dataKey}
              >
                {config.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {config.tooltip && (
                <Tooltip 
                  formatter={(value: any) => [config.formatValue ? config.formatValue(value) : value, '']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        )

      case 'chartjs-line':
        return (
          <div style={{ height: chartHeight }}>
            <ChartJSLine
              data={{
                labels: finalData.map((item: any) => item[config.xAxisDataKey || 'name']),
                datasets: config.multipleLines ? 
                  config.multipleLines.map((line, index) => ({
                    label: line.name,
                    data: finalData.map((item: any) => item[line.dataKey]),
                    borderColor: line.color,
                    backgroundColor: line.color + '20',
                    fill: true,
                    tension: 0.4,
                    pointRadius: config.showDots ? 4 : 0,
                    pointHoverRadius: 6
                  })) :
                  [{
                    label: config.title,
                    data: finalData.map((item: any) => item[config.dataKey]),
                    borderColor: colors[0],
                    backgroundColor: colors[0] + '20',
                    fill: true,
                    tension: 0.4,
                    pointRadius: config.showDots ? 4 : 0,
                    pointHoverRadius: 6
                  }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.parsed.y;
                        return config.formatValue ? config.formatValue(value) : value.toString();
                      }
                    }
                  },
                  zoom: {
                    zoom: {
                      wheel: {
                        enabled: true,
                      },
                      pinch: {
                        enabled: true
                      },
                      mode: 'xy' as const,
                    },
                    pan: {
                      enabled: true,
                      mode: 'xy' as const,
                    }
                  }
                },
                scales: {
                  x: {
                    display: true,
                    title: {
                      display: false,
                    },
                    ticks: {
                      maxRotation: 45,
                      minRotation: 0
                    }
                  },
                  y: {
                    display: true,
                    title: {
                      display: false,
                    },
                    beginAtZero: true
                  }
                },
                interaction: {
                  intersect: false,
                  mode: 'index' as const,
                }
              }}
            />
          </div>
        )

      case 'chartjs-bar':
        return (
          <div style={{ height: chartHeight }}>
            <ChartJSBar
              data={{
                labels: finalData.map((item: any) => item[config.xAxisDataKey || 'name']),
                datasets: [{
                  label: config.title,
                  data: finalData.map((item: any) => item[config.dataKey]),
                  backgroundColor: colors[0],
                  borderColor: colors[0],
                  borderWidth: 1
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.parsed.y;
                        return config.formatValue ? config.formatValue(value) : value.toString();
                      }
                    }
                  },
                  zoom: {
                    zoom: {
                      wheel: {
                        enabled: true,
                      },
                      pinch: {
                        enabled: true
                      },
                      mode: 'xy' as const,
                    },
                    pan: {
                      enabled: true,
                      mode: 'xy' as const,
                    }
                  }
                },
                scales: {
                  x: {
                    display: true,
                    title: {
                      display: false,
                    },
                    ticks: {
                      maxRotation: 45,
                      minRotation: 0
                    }
                  },
                  y: {
                    display: true,
                    title: {
                      display: false,
                    },
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        )

      default:
        return null
    }
  }

  // Render chart grid
  const renderChartGrid = () => {
    if (!chartGrid) return null

    const columns = chartGrid.columns || 2
    const gridClass = columns === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'

    // Create a key that changes when analytics controls change
    const analyticsKey = analyticsControls ? 
      `${analyticsControls.dateRange}-${analyticsControls.timeGranularity}-${analyticsControls.customStartDate}-${analyticsControls.customEndDate}` : 
      'no-analytics'

    return (
      <div className={`grid ${gridClass} gap-6 mt-6`}>
        {chartGrid.charts.map((chart, index) => {
          const chartId = `chart-${index}`
          const zoomState = zoomStates[chartId]
          const zoomKey = zoomState ? `${zoomState.left}-${zoomState.right}` : 'no-zoom'
          
          return (
            <div 
              key={`${index}-${zoomKey}-${analyticsKey}`}
              className={`bg-white border border-gray-200 rounded-xl p-6 ${
                chart.fullWidth ? 'lg:col-span-2' : ''
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{chart.title}</h3>
              {renderChart(chart, index)}
            </div>
          )
        })}
      </div>
    )
  }

  // Render analytics controls
  const renderAnalyticsControls = () => {
    if (!analyticsControls) return null

    const getDateRangeLabel = (range: string) => {
      switch (range) {
        case '1month': return 'Last Month'
        case '3months': return 'Last 3 Months'
        case '6months': return 'Last 6 Months'
        case '1year': return 'Last Year'
        default: return range
      }
    }

    const getGranularityLabel = (granularity: string) => {
      switch (granularity) {
        case 'day': return 'Daily'
        case 'month': return 'Monthly'
        case 'year': return 'Yearly'
        default: return granularity
      }
    }

    return (
      <div className="flex items-center gap-2">
        {/* Time Granularity Control */}
        {showTimeGranularity && onTimeGranularityChange && (
          <div className="flex items-center gap-2 bg-blue-700 bg-opacity-20 rounded-lg p-2">
            <span className="text-white text-sm font-medium">View:</span>
            <select
              value={timeGranularity}
              onChange={(e) => onTimeGranularityChange(e.target.value)}
              className="bg-transparent text-white border-none text-sm focus:outline-none"
            >
              {granularityOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-gray-900">
                  {option.value === timeGranularity ? getGranularityLabel(option.value) : option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Range Controls */}
        {showDateRange && onDateRangeChange && (
          <div className="flex items-center gap-2 bg-blue-700 bg-opacity-20 rounded-lg p-2">
            <Filter className="w-4 h-4" />
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="bg-transparent text-white border-none text-sm focus:outline-none"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-gray-900">
                  {option.value === dateRange ? getDateRangeLabel(option.value) : option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Custom Date Range Inputs */}
        {dateRange === 'custom' && onCustomDateChange && (
          <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg p-2">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomDateChange(e.target.value, customEndDate)}
              className="bg-transparent text-white border-none text-sm focus:outline-none placeholder-white placeholder-opacity-70"
              placeholder="Start Date"
            />
            <span className="text-white text-sm">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomDateChange(customStartDate, e.target.value)}
              className="bg-transparent text-white border-none text-sm focus:outline-none placeholder-white placeholder-opacity-70"
              placeholder="End Date"
            />
          </div>
        )}
        
        {/* Refresh Button */}
        {showRefresh && onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 bg-blue-700 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-6"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden ${
              isMaximized ? 'w-full h-full' : ''
            }`}
            style={{
              width: isMaximized ? '100%' : `${size.width}px`,
              height: isMaximized ? '100%' : `${size.height}px`,
              transform: isMaximized ? 'none' : `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'default',
              maxHeight: isMaximized ? '100vh' : 'calc(100vh - 48px)', // Ensure it doesn't exceed viewport
              maxWidth: isMaximized ? '100vw' : 'calc(100vw - 48px)'   // Ensure it doesn't exceed viewport
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white p-6 flex-shrink-0 cursor-move`}
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    {icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-opacity-80">{subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {customHeader}
                  {renderAnalyticsControls()}
                  <button
                    onClick={toggleMaximize}
                    className="p-2 hover:bg-magenta-700 hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              {children}
              {renderChartGrid()}
            </div>

            {/* Resize Handle */}
            {!isMaximized && (
              <div
                ref={resizeRef}
                className="absolute bottom-0 right-0 w-6 h-6 cursor-nw-resize"
                onMouseDown={handleResizeMouseDown}
              >
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-gray-400 absolute bottom-1 right-1" />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ResizableModal 