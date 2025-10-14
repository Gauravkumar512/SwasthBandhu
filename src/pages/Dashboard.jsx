import React from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Heart, 
  Bed,
  Thermometer,
  Calendar,
  MapPin
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Dashboard = () => {
  const { aqiData, newsData, hospitals, emergencyAlerts, bedAvailability } = useData()
  const { user } = useAuth()

  // Calculate statistics
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

  const stats = [
    {
      title: 'Current AQI Level',
      value: currentAqi,
      change: aqiTrend,
      icon: <Thermometer className="h-6 w-6" />,
      color: currentAqi > 150 ? 'text-alert-600' : currentAqi > 100 ? 'text-yellow-600' : 'text-medical-600',
      bgColor: currentAqi > 150 ? 'bg-alert-50' : currentAqi > 100 ? 'bg-yellow-50' : 'bg-medical-50'
    },
    {
      title: 'Bed Occupancy',
      value: `${occupancyRate}%`,
      change: occupancyRate > 80 ? 5 : -2,
      icon: <Bed className="h-6 w-6" />,
      color: occupancyRate > 80 ? 'text-alert-600' : 'text-medical-600',
      bgColor: occupancyRate > 80 ? 'bg-alert-50' : 'bg-medical-50'
    },
    {
      title: 'Active Alerts',
      value: activeAlerts,
      change: 0,
      icon: <AlertTriangle className="h-6 w-6" />,
      color: activeAlerts > 0 ? 'text-alert-600' : 'text-medical-600',
      bgColor: activeAlerts > 0 ? 'bg-alert-50' : 'bg-medical-50'
    },
    {
      title: 'Total Hospitals',
      value: hospitals.length,
      change: 0,
      icon: <Users className="h-6 w-6" />,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    }
  ]

  const getAqiStatus = (aqi) => {
    if (aqi <= 50) return { status: 'Good', color: '#22c55e' }
    if (aqi <= 100) return { status: 'Moderate', color: '#eab308' }
    if (aqi <= 150) return { status: 'Unhealthy for Sensitive', color: '#f97316' }
    if (aqi <= 200) return { status: 'Unhealthy', color: '#ef4444' }
    if (aqi <= 300) return { status: 'Very Unhealthy', color: '#8b5cf6' }
    return { status: 'Hazardous', color: '#7c2d12' }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}. Here's your healthcare overview.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                {stat.change !== 0 && (
                  <div className="flex items-center mt-1">
                    <TrendingUp className={`h-4 w-4 mr-1 ${stat.change > 0 ? 'text-alert-500' : 'text-medical-500'}`} />
                    <span className={`text-sm ${stat.change > 0 ? 'text-alert-500' : 'text-medical-500'}`}>
                      {Math.abs(stat.change)}% from last period
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AQI Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Air Quality Index Trends</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary-500"></div>
              <span className="text-sm text-gray-600">AQI Level</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aqiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                domain={[0, 300]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [
                  `${value} AQI`,
                  'Air Quality Index'
                ]}
                labelFormatter={(label) => `Month: ${label}`}
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
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Current Status:</span>
              <span 
                className="font-medium px-2 py-1 rounded"
                style={{ 
                  color: getAqiStatus(currentAqi).color,
                  backgroundColor: `${getAqiStatus(currentAqi).color}20`
                }}
              >
                {getAqiStatus(currentAqi).status}
              </span>
            </div>
          </div>
        </div>

        {/* Bed Availability Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Hospital Bed Availability</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-medical-500"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-alert-500"></div>
                <span className="text-sm text-gray-600">Occupied</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hospitals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#666"
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  `${value} beds`,
                  name === 'availableBeds' ? 'Available' : 'Total'
                ]}
              />
              <Bar dataKey="availableBeds" fill="#22c55e" name="availableBeds" />
              <Bar dataKey="totalBeds" fill="#ef4444" name="totalBeds" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent News and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Health News */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Health Alerts</h3>
          <div className="space-y-4">
            {newsData.slice(0, 3).map((news) => (
              <div key={news.id} className="border-l-4 border-gray-200 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{news.title}</h4>
                    <p className="text-gray-600 text-xs mt-1">{news.summary}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        news.severity === 'critical' ? 'bg-alert-100 text-alert-800' :
                        news.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {news.severity}
                      </span>
                      <span className="text-xs text-gray-500">{news.category}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">
                    {new Date(news.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Alerts */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Emergency Alerts</h3>
          <div className="space-y-4">
            {activeAlerts > 0 ? (
              emergencyAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="alert-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{alert.message}</p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="medical-card">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-medical-600 mr-2" />
                  <span className="text-sm text-medical-800">No active emergency alerts</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Activity className="h-5 w-5 text-primary-600 mr-2" />
            <span className="text-sm font-medium">View Analytics</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Heart className="h-5 w-5 text-medical-600 mr-2" />
            <span className="text-sm font-medium">Book Bed</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="h-5 w-5 text-alert-600 mr-2" />
            <span className="text-sm font-medium">Send Alert</span>
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-5 w-5 text-primary-600 mr-2" />
            <span className="text-sm font-medium">Manage Hospitals</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
