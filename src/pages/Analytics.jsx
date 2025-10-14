import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  AlertTriangle, 
  Heart,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'

const Analytics = () => {
  const { aqiData, newsData, hospitals, emergencyAlerts, bedAvailability } = useData()
  const [timeRange, setTimeRange] = useState('month')
  const [selectedMetric, setSelectedMetric] = useState('overview')

  // Calculate analytics data
  const totalBeds = hospitals.reduce((sum, hospital) => sum + hospital.totalBeds, 0)
  const availableBeds = Object.values(bedAvailability).reduce((sum, beds) => 
    sum + (beds.general || 0) + (beds.icu || 0) + (beds.emergency || 0), 0
  )
  const occupancyRate = ((totalBeds - availableBeds) / totalBeds * 100).toFixed(1)

  const currentAqi = aqiData[aqiData.length - 1]?.aqi || 0
  const aqiTrend = aqiData.length > 1 ? 
    aqiData[aqiData.length - 1].aqi - aqiData[aqiData.length - 2].aqi : 0

  const activeAlerts = emergencyAlerts.filter(alert => 
    new Date(alert.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length

  // Prepare data for charts
  const bedOccupancyData = hospitals.map(hospital => ({
    name: hospital.name.split(' ')[0], // Short name for chart
    total: hospital.totalBeds,
    occupied: hospital.totalBeds - (bedAvailability[hospital.id]?.general || 0) - (bedAvailability[hospital.id]?.icu || 0) - (bedAvailability[hospital.id]?.emergency || 0),
    available: (bedAvailability[hospital.id]?.general || 0) + (bedAvailability[hospital.id]?.icu || 0) + (bedAvailability[hospital.id]?.emergency || 0)
  }))

  const alertTypeData = emergencyAlerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1
    return acc
  }, {})

  const alertPieData = Object.entries(alertTypeData).map(([type, count]) => ({
    name: type.replace('_', ' ').toUpperCase(),
    value: count,
    color: type === 'pollution_spike' ? '#ef4444' :
           type === 'disease_outbreak' ? '#f97316' :
           type === 'festival_surge' ? '#8b5cf6' :
           type === 'equipment_shortage' ? '#eab308' :
           '#6b7280'
  }))

  const newsCategoryData = newsData.reduce((acc, news) => {
    acc[news.category] = (acc[news.category] || 0) + 1
    return acc
  }, {})

  const newsBarData = Object.entries(newsCategoryData).map(([category, count]) => ({
    category,
    count,
    severity: newsData.filter(n => n.category === category).reduce((sum, n) => 
      sum + (n.severity === 'critical' ? 3 : n.severity === 'high' ? 2 : 1), 0
    )
  }))

  // Mock monthly trends data
  const monthlyTrendsData = [
    { month: 'Jan', patients: 1200, aqi: 180, alerts: 3 },
    { month: 'Feb', patients: 1350, aqi: 165, alerts: 2 },
    { month: 'Mar', patients: 1100, aqi: 190, alerts: 4 },
    { month: 'Apr', patients: 1450, aqi: 220, alerts: 6 },
    { month: 'May', patients: 1600, aqi: 250, alerts: 8 },
    { month: 'Jun', patients: 1400, aqi: 200, alerts: 5 },
    { month: 'Jul', patients: 1300, aqi: 175, alerts: 3 },
    { month: 'Aug', patients: 1500, aqi: 210, alerts: 7 },
    { month: 'Sep', patients: 1700, aqi: 280, alerts: 10 },
    { month: 'Oct', patients: 1800, aqi: 320, alerts: 12 },
    { month: 'Nov', patients: 1650, aqi: 290, alerts: 9 },
    { month: 'Dec', patients: 1550, aqi: 270, alerts: 8 }
  ]

  const keyMetrics = [
    {
      title: 'Bed Occupancy Rate',
      value: `${occupancyRate}%`,
      change: occupancyRate > 80 ? 5 : -2,
      icon: <Heart className="h-6 w-6" />,
      color: occupancyRate > 80 ? 'text-red-600' : 'text-green-600',
      bgColor: occupancyRate > 80 ? 'bg-red-50' : 'bg-green-50'
    },
    {
      title: 'Current AQI',
      value: currentAqi,
      change: aqiTrend,
      icon: <Activity className="h-6 w-6" />,
      color: currentAqi > 150 ? 'text-red-600' : currentAqi > 100 ? 'text-yellow-600' : 'text-green-600',
      bgColor: currentAqi > 150 ? 'bg-red-50' : currentAqi > 100 ? 'bg-yellow-50' : 'bg-green-50'
    },
    {
      title: 'Active Alerts',
      value: activeAlerts,
      change: 0,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: activeAlerts > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: activeAlerts > 0 ? 'bg-red-50' : 'bg-green-50'
    },
    {
      title: 'Total Hospitals',
      value: hospitals.length,
      change: 0,
      icon: <Users className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ]

  const handleExportData = () => {
    // Simulate data export
    const data = {
      timestamp: new Date().toISOString(),
      metrics: keyMetrics,
      bedOccupancy: bedOccupancyData,
      aqiTrend: aqiData,
      alerts: emergencyAlerts,
      news: newsData
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hospital-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights and data visualization</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-32"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={handleExportData}
            className="btn-secondary flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="btn-primary flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                {metric.change !== 0 && (
                  <div className="flex items-center mt-1">
                    {metric.change > 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1 text-green-500" />
                    )}
                    <span className={`text-sm ${metric.change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {Math.abs(metric.change)}% from last period
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <div className={metric.color}>
                  {metric.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AQI Trends */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Air Quality Trends</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">AQI Level</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aqiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} domain={[0, 400]} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value} AQI`, 'Air Quality Index']}
              />
              <Line 
                type="monotone" 
                dataKey="aqi" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bed Occupancy by Hospital */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Bed Occupancy by Hospital</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Occupied</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bedOccupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="occupied" stackId="a" fill="#ef4444" name="Occupied" />
              <Bar dataKey="available" stackId="a" fill="#22c55e" name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert Types Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Alert Types Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={alertPieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {alertPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Health News Categories */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Health News Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={newsBarData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#666" fontSize={12} />
              <YAxis dataKey="category" type="category" stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Patient Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="patients" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-medium text-green-800 mb-2">Resource Optimization</h4>
            <p className="text-sm text-green-700">
              Bed utilization is {occupancyRate > 70 ? 'high' : 'optimal'}. 
              {occupancyRate > 70 ? ' Consider expanding capacity during peak seasons.' : ' Current allocation is efficient.'}
            </p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <h4 className="font-medium text-orange-800 mb-2">Air Quality Impact</h4>
            <p className="text-sm text-orange-700">
              Current AQI level of {currentAqi} is {currentAqi > 150 ? 'concerning' : 'acceptable'}. 
              {currentAqi > 150 ? ' Prepare for increased respiratory cases.' : ' Monitor for seasonal changes.'}
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-medium text-blue-800 mb-2">Alert Management</h4>
            <p className="text-sm text-blue-700">
              {activeAlerts} active alerts require attention. 
              {activeAlerts > 0 ? ' Review and address critical issues promptly.' : ' System is operating normally.'}
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Hospital Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospital
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Beds
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hospitals.map((hospital) => {
                const available = (bedAvailability[hospital.id]?.general || 0) + 
                                (bedAvailability[hospital.id]?.icu || 0) + 
                                (bedAvailability[hospital.id]?.emergency || 0)
                const occupancy = ((hospital.totalBeds - available) / hospital.totalBeds * 100).toFixed(1)
                
                return (
                  <tr key={hospital.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {hospital.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hospital.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hospital.totalBeds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {available}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {occupancy}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        occupancy > 90 ? 'bg-red-100 text-red-800' :
                        occupancy > 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {occupancy > 90 ? 'Critical' :
                         occupancy > 70 ? 'High' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
