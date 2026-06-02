import React, { useState } from 'react';
import { useLocationAnalytics, useUsersWithLocation } from '../hooks/useUsers';
import {
  MapPin,
  Users,
  Globe,
  TrendingUp,
  Calendar,
  Loader2,
  AlertCircle,
  BarChart3,
  PieChart as LucidePieChart
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie as RechartsPie,
  PieChart as RechartsPieChart,
  Cell
} from 'recharts';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Button, DataTable, StatCard } from '../components/common';


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
};

// COLORS for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1'];

// World Map Component
const WorldMap: React.FC<{
  locationStats: Array<{
    country: string;
    userCount: number;
    cityCount: number;
    regionCount: number;
    cities: string[];
  }>;
  position: { coordinates: [number, number]; zoom: number };
  setPosition: React.Dispatch<React.SetStateAction<{ coordinates: [number, number]; zoom: number }>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}> = ({ locationStats, position, setPosition, setZoom }) => {
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const getCountryColor = (countryName: string) => {
    const stat = locationStats.find(s => s.country === countryName);
    if (!stat) return "#F5F5F5";
    const userCount = stat.userCount;
    if (userCount >= 10) return "#FF6B6B";
    if (userCount >= 5) return "#4ECDC4";
    return "#45B7D1";
  };

  const getCountryOpacity = (countryName: string) => {
    const stat = locationStats.find(s => s.country === countryName);
    return stat ? 0.8 : 0.3;
  };

  const handleZoomChange = (newPosition: any) => {
    setPosition(newPosition);
    setZoom(newPosition.zoom);
  };

  const zoomToCountry = (countryName: string) => {
    const coords = countryCoordinates[countryName];
    if (coords) {
      setPosition({ coordinates: coords, zoom: 4 });
      setZoom(4);
    }
  };

  const resetZoom = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
    setZoom(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-600" />
          Global User Distribution
        </h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={resetZoom}
            variant="ghost"
            size="sm"
            className="text-blue-700 bg-blue-100 hover:bg-blue-200 border-transparent" // Maintaining existing custom style overrides essentially or use variant logic if it matches. Existing was blue-100.
          >
            Reset View
          </Button>
          <span className="text-xs text-gray-500">
            Zoom: {position.zoom.toFixed(1)}x
          </span>
        </div>
      </div>

      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 147 }}
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
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const color = getCountryColor(countryName);
                  const opacity = getCountryOpacity(countryName);

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
                        hover: { fill: color, opacity: 1, outline: 'none', cursor: 'pointer' },
                        pressed: { outline: 'none' }
                      }}
                      onMouseEnter={() => {
                        const stat = locationStats.find(s => s.country === countryName);
                        if (stat) {
                          setTooltipContent(`${countryName}: ${stat.userCount} users`);
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent('');
                      }}
                      onClick={() => {
                        const stat = locationStats.find(s => s.country === countryName);
                        if (stat) zoomToCountry(countryName);
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* User markers */}
            {locationStats.map((stat) => {
              const coords = countryCoordinates[stat.country];
              if (!coords) return null;

              const color = COLORS[locationStats.indexOf(stat) % COLORS.length];
              const markerSize = Math.max(3, Math.min(12, stat.userCount * position.zoom));

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
                      setTooltipContent(`${stat.country}: ${stat.userCount} users`);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    onClick={() => zoomToCountry(stat.country)}
                  />
                  <text
                    textAnchor="middle"
                    y={-markerSize - 5}
                    style={{
                      fontFamily: "system-ui",
                      fill: "#374151",
                      fontSize: Math.max(8, Math.min(14, position.zoom * 2)),
                      fontWeight: "bold",
                      pointerEvents: "none"
                    }}
                  >
                    {stat.userCount}
                  </text>
                  {position.zoom > 1.5 && (
                    <text
                      textAnchor="middle"
                      y={markerSize + 15}
                      style={{
                        fontFamily: "system-ui",
                        fill: "#6B7280",
                        fontSize: Math.max(6, Math.min(10, position.zoom * 1.5)),
                        fontWeight: "500",
                        pointerEvents: "none"
                      }}
                    >
                      {stat.country}
                    </text>
                  )}
                </Marker>
              );
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
  );
};

const LocationAnalytics: React.FC = () => {
  const { data: analytics, isLoading, error } = useLocationAnalytics();
  const { data: users, isLoading: usersLoading } = useUsersWithLocation();

  // Zoom & position state
  const [position, setPosition] = useState({ coordinates: [0, 0] as [number, number], zoom: 1 });
  const [_zoom, setZoom] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  if (isLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
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
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">No location data available</p>
      </div>
    );
  }

  const { locationStats, totalUsersWithLocation, topCities, recentLocationActivity } = analytics;

  // Prepare data for charts
  const countryChartData = locationStats.map(stat => ({
    name: stat.country,
    users: stat.userCount,
    cities: stat.cityCount
  }));

  const cityChartData = topCities.map(city => ({
    name: city._id,
    users: city.count,
    country: city.country
  }));

  const pieChartData = locationStats.slice(0, 5).map((stat, index) => ({
    name: stat.country,
    value: stat.userCount,
    color: COLORS[index % COLORS.length]
  }));

  // Get selected country data
  const selectedCountryData = selectedCountry
    ? locationStats.find(stat => stat.country === selectedCountry)
    : null;

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
        <StatCard
          title="Total Countries"
          value={locationStats.length}
          icon={Globe}
          color="blue"
          loading={isLoading}
        />

        <StatCard
          title="Top Country"
          value={locationStats[0]?.country || 'N/A'}
          change={locationStats[0] ? `${locationStats[0].userCount} users` : undefined}
          changeType="neutral"
          icon={MapPin}
          color="green"
          loading={isLoading}
        />

        <StatCard
          title="Top City"
          value={topCities[0]?._id || 'N/A'}
          change={topCities[0] ? `${topCities[0].count} users` : undefined}
          changeType="neutral"
          icon={MapPin}
          color="purple"
          loading={isLoading}
        />

        <StatCard
          title="Recent Activity"
          value={recentLocationActivity.length}
          change="Last 30 days"
          changeType="neutral"
          icon={TrendingUp}
          color="orange"
          loading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* World Map */}
        <WorldMap
          locationStats={locationStats}
          position={position}
          setPosition={setPosition}
          setZoom={setZoom}
        />

        {/* Country Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LucidePieChart className="w-5 h-5 text-green-600" />
            User Distribution by Country
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <RechartsPie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieChartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </RechartsPie>
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
              <Button
                onClick={() => {
                  const coords = countryCoordinates[selectedCountryData.country];
                  if (coords) {
                    setPosition({ coordinates: coords, zoom: 4 });
                    setZoom(4);
                  }
                }}
                variant="ghost"
                size="sm"
                className="text-blue-700 bg-blue-100 hover:bg-blue-200 border-transparent"
              >
                Focus on Map
              </Button>
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
              {selectedCountryData.cities.map((city, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
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
          {locationStats.map((stat) => (
            <div
              key={stat.country}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${selectedCountry === stat.country
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
                }`}
              onClick={() => {
                setSelectedCountry(stat.country);
                const coords = countryCoordinates[stat.country];
                if (coords) {
                  setPosition({ coordinates: coords, zoom: 4 });
                  setZoom(4);
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
                  {stat.cities.slice(0, 2).map((city, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                    >
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
          <DataTable
            columns={[
              { key: 'name', label: 'User Name', render: (_, user) => user.name },
              { key: 'country', label: 'Country', render: (_, user) => user.location?.country || 'None' },
              { key: 'city', label: 'City', render: (_, user) => user.location?.city || 'None' },
              { key: 'region', label: 'Region', render: (_, user) => user.location?.region || 'None' },
              { key: 'timezone', label: 'Timezone', render: (_, user) => user.location?.timezone || 'None' }
            ]}
            data={users || []}
            className="shadow-none border-0" // Removing conflicting styles if needed, or DataTable handles it
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-600" />
          Recent Location Activity (Last 30 Days)
        </h3>
        <div className="overflow-x-auto">
          <DataTable
            columns={[
              { key: 'date', label: 'Date', render: (_, item) => item._id.date },
              { key: 'country', label: 'Country', render: (_, item) => item._id.country },
              {
                key: 'count',
                label: 'New Users',
                render: (count) => (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +{count}
                  </span>
                )
              }
            ]}
            data={recentLocationActivity.slice(0, 10)}
            className="shadow-none border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationAnalytics;