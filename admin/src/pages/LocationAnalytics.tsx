import React, { useState } from 'react'
import { useLocationAnalytics, useUsersWithLocation } from '../hooks/useUsers'
import { MapPin, Users, Globe, TrendingUp, Calendar, Loader2, AlertCircle, BarChart3, PieChart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'

// Modern World Map Component using react-simple-maps
const WorldMap: React.FC<{ locationStats: any[] }> = ({ locationStats }) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [tooltipContent, setTooltipContent] = useState<string>("")
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 })

  // World map data URL
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

  // Country coordinates for markers
  const countryCoordinates: { [key: string]: [number, number] } = {
    'United States': [-95.7129, 37.0902],
    'India': [78.9629, 20.5937],
    'United Kingdom': [-0.1278, 51.5074],
    'Canada': [-106.3468, 56.1304],
    'Australia': [133.7751, -25.2744],
    'Germany': [10.4515, 51.1657],
    'France': [2.2137, 46.2276],
    'Japan': [138.2529, 36.2048],
    'Brazil': [-51.9253, -14.2350],
    'Mexico': [-102.5528, 23.6345],
    'Singapore': [103.8198, 1.3521],
    'Netherlands': [5.2913, 52.1326],
    'Sweden': [18.0686, 60.1282],
    'Switzerland': [8.2275, 46.8182],
    'South Korea': [127.7669, 35.9078]
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1']

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  const getCountryColor = (countryName: string) => {
    const stat = locationStats.find(s => s.country === countryName)
    if (!stat) return "#F5F5F5" // Default light gray for countries without data
    
    const userCount = stat.userCount
    if (userCount >= 10) return "#FF6B6B" // Red for high user count
    if (userCount >= 5) return "#4ECDC4"  // Teal for medium user count
    return "#45B7D1" // Blue for low user count
  }

  const getCountryOpacity = (countryName: string) => {
    const stat = locationStats.find(s => s.country === countryName)
    return stat ? 0.8 : 0.3
  }

  const handleZoomChange = (newPosition: any) => {
    setPosition(newPosition)
    setZoom(newPosition.zoom)
  }

  const zoomToCountry = (countryName: string) => {
    const coords = countryCoordinates[countryName]
    if (coords) {
      setPosition({ coordinates: coords, zoom: 4 })
      setZoom(4)
    }
  }

  const resetZoom = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 })
    setZoom(1)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Global User Distribution
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={resetZoom}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Reset View
          </button>
          <span className="text-xs text-gray-500">
            Zoom: {zoom.toFixed(1)}x
          </span>
        </div>
      </div>
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 147
          }}
          onMouseMove={handleMouseMove}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleZoomChange}
            maxZoom={8}
            minZoom={1}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => {
                  const countryName = geo.properties.name
                  const color = getCountryColor(countryName)
                  const opacity = getCountryOpacity(countryName)
                  const stat = locationStats.find(s => s.country === countryName)
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      opacity={opacity}
                      style={{
                        default: { outline: 'none' },
                        hover: { 
                          fill: color,
                          opacity: 1,
                          outline: 'none',
                          cursor: 'pointer'
                        },
                        pressed: { outline: 'none' }
                      }}
                      onMouseEnter={() => {
                        if (stat) {
                          setHoveredCountry(countryName)
                          setTooltipContent(`${countryName}: ${stat.userCount} users`)
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null)
                        setTooltipContent("")
                      }}
                      onClick={() => {
                        if (stat) {
                          zoomToCountry(countryName)
                        }
                      }}
                    />
                  )
                })
              }
            </Geographies>

            {/* Country Labels - Show when zoomed in */}
            {zoom > 2 && (
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const countryName = geo.properties.name
                    const stat = locationStats.find(s => s.country === countryName)
                    
                    if (!stat) return null
                    
                    return (
                      <text
                        key={`label-${geo.rsmKey}`}
                        textAnchor="middle"
                        style={{
                          fontFamily: "system-ui",
                          fill: "#374151",
                          fontSize: Math.max(8, Math.min(12, zoom * 2)),
                          fontWeight: "bold",
                          pointerEvents: "none"
                        }}
                      >
                        {countryName}
                      </text>
                    )
                  })
                }
              </Geographies>
            )}

            {/* User markers */}
            {locationStats.map((stat, index) => {
              const coords = countryCoordinates[stat.country]
              if (!coords) return null
              
              const color = COLORS[index % COLORS.length]
              const markerSize = Math.max(3, Math.min(12, stat.userCount * zoom))
              
              return (
                <Marker key={stat.country} coordinates={coords}>
                  <circle
                    r={markerSize}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    opacity={0.8}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => {
                      setHoveredCountry(stat.country)
                      setTooltipContent(`${stat.country}: ${stat.userCount} users`)
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null)
                      setTooltipContent("")
                    }}
                    onClick={() => zoomToCountry(stat.country)}
                  />
                  {/* User count label - always visible */}
                  <text
                    textAnchor="middle"
                    y={-markerSize - 5}
                    style={{
                      fontFamily: "system-ui",
                      fill: "#374151",
                      fontSize: Math.max(8, Math.min(14, zoom * 2)),
                      fontWeight: "bold",
                      pointerEvents: "none"
                    }}
                  >
                    {stat.userCount}
                  </text>
                  {/* Country name label - show when zoomed */}
                  {zoom > 1.5 && (
                    <text
                      textAnchor="middle"
                      y={markerSize + 15}
                      style={{
                        fontFamily: "system-ui",
                        fill: "#6B7280",
                        fontSize: Math.max(6, Math.min(10, zoom * 1.5)),
                        fontWeight: "500",
                        pointerEvents: "none"
                      }}
                    >
                      {stat.country}
                    </text>
                  )}
                </Marker>
              )
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltipContent && (
          <div
            className="absolute bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded pointer-events-none z-10"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y - 10
            }}
          >
            {tooltipContent}
          </div>
        )}

        {/* Zoom Instructions */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-2 shadow-sm">
          <div className="text-xs text-gray-600">
            <div>🖱️ Scroll to zoom</div>
            <div>🖱️ Drag to pan</div>
            <div>🖱️ Click country to focus</div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-sm">
          <div className="text-xs font-medium text-gray-700 mb-2">User Count</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">1-4</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <span className="text-xs text-gray-600">5-9</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">10+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const LocationAnalytics: React.FC = () => {
  const { data: analytics, isLoading, error } = useLocationAnalytics()
  const { data: users, isLoading: usersLoading } = useUsersWithLocation()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  if (isLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-gray-600">Failed to load location analytics</p>
          <p className="text-sm text-red-500 mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">No location data available</p>
      </div>
    )
  }

  const { locationStats, totalUsersWithLocation, topCities, recentLocationActivity } = analytics

  // Prepare data for charts
  const countryChartData = locationStats.map(stat => ({
    name: stat.country,
    users: stat.userCount,
    cities: stat.cityCount
  }))

  const cityChartData = topCities.map(city => ({
    name: city._id,
    users: city.count,
    country: city.country
  }))

  const pieChartData = locationStats.slice(0, 5).map((stat, index) => ({
    name: stat.country,
    value: stat.userCount,
    color: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index]
  }))

  // Get selected country data
  const selectedCountryData = selectedCountry 
    ? locationStats.find(stat => stat.country === selectedCountry)
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Location Analytics</h1>
          <p className="text-gray-600">Track user distribution across the globe</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {totalUsersWithLocation} users with location data
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Countries</p>
              <p className="text-2xl font-bold text-gray-900">{locationStats.length}</p>
            </div>
            <Globe className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Country</p>
              <p className="text-lg font-bold text-gray-900">
                {locationStats[0]?.country || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                {locationStats[0]?.userCount || 0} users
              </p>
            </div>
            <MapPin className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top City</p>
              <p className="text-lg font-bold text-gray-900">
                {topCities[0]?._id || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                {topCities[0]?.count || 0} users
              </p>
            </div>
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Activity</p>
              <p className="text-lg font-bold text-gray-900">
                {recentLocationActivity.length}
              </p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* World Map */}
        <WorldMap locationStats={locationStats} />

        {/* Country Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-green-600" />
            User Distribution by Country
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Country Details Panel */}
      {selectedCountryData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {selectedCountryData.country} Details
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const coords = countryCoordinates[selectedCountryData.country]
                  if (coords) {
                    setPosition({ coordinates: coords, zoom: 4 })
                    setZoom(4)
                  }
                }}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Focus on Map
              </button>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{selectedCountryData.userCount}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{selectedCountryData.cityCount}</p>
              <p className="text-sm text-gray-600">Cities</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{selectedCountryData.regionCount}</p>
              <p className="text-sm text-gray-600">Regions</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Top Cities:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCountryData.cities.map((city, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <MapPin className="w-3 h-3 mr-1" />
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Countries List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          Countries with Users
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locationStats.map((stat, index) => (
            <div
              key={stat.country}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedCountry === stat.country 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => {
                setSelectedCountry(stat.country)
                // Also zoom to the country on the map
                const coords = countryCoordinates[stat.country]
                if (coords) {
                  setPosition({ coordinates: coords, zoom: 4 })
                  setZoom(4)
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{stat.country}</h4>
                  <p className="text-sm text-gray-500">{stat.cityCount} cities</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{stat.userCount}</p>
                  <p className="text-xs text-gray-500">users</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {stat.cities.slice(0, 2).map((city, cityIndex) => (
                    <span key={cityIndex} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {city}
                    </span>
                  ))}
                  {stat.cities.length > 2 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      +{stat.cities.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Countries Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Users by Country
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cities Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            Users by City
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Details Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          User Location Details
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timezone
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.location?.country || 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.location?.city || 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.location?.region || 'None'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.location?.timezone || 'None'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-600" />
          Recent Location Activity (Last 30 Days)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Users
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentLocationActivity.slice(0, 10).map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity._id.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity._id.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      +{activity.count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LocationAnalytics 