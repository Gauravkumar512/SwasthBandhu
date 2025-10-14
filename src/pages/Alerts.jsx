import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { 
  AlertTriangle, 
  Bell, 
  Send, 
  Plus, 
  Clock, 
  MapPin, 
  Users,
  Phone,
  MessageSquare,
  Activity,
  Shield,
  Zap
} from 'lucide-react'

const Alerts = () => {
  const { emergencyAlerts, hospitals, addEmergencyAlert } = useData()
  const { user } = useAuth()
  const [showCreateAlert, setShowCreateAlert] = useState(false)
  const [alertForm, setAlertForm] = useState({
    type: 'pollution_spike',
    severity: 'medium',
    message: '',
    affectedHospitals: [],
    autoNotify: true
  })

  const alertTypes = [
    { value: 'pollution_spike', label: 'Pollution Spike', icon: <Activity className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
    { value: 'disease_outbreak', label: 'Disease Outbreak', icon: <Shield className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
    { value: 'festival_surge', label: 'Festival Surge', icon: <Users className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
    { value: 'equipment_shortage', label: 'Equipment Shortage', icon: <Zap className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'staff_shortage', label: 'Staff Shortage', icon: <Users className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    { value: 'natural_disaster', label: 'Natural Disaster', icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' }
  ]

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
  ]

  const getAlertTypeInfo = (type) => {
    return alertTypes.find(t => t.value === type) || alertTypes[0]
  }

  const getSeverityInfo = (severity) => {
    return severityLevels.find(s => s.value === severity) || severityLevels[1]
  }

  const handleCreateAlert = (e) => {
    e.preventDefault()
    
    if (!alertForm.message.trim()) {
      toast.error('Please enter an alert message')
      return
    }

    const newAlert = {
      id: Date.now(),
      type: alertForm.type,
      severity: alertForm.severity,
      message: alertForm.message,
      timestamp: new Date().toISOString(),
      createdBy: user?.name || 'System',
      affectedHospitals: alertForm.affectedHospitals
    }

    addEmergencyAlert(newAlert)
    
    // Simulate sending notifications
    if (alertForm.autoNotify) {
      toast.success('Alert created and notifications sent to affected hospitals')
    } else {
      toast.success('Alert created successfully')
    }

    setAlertForm({
      type: 'pollution_spike',
      severity: 'medium',
      message: '',
      affectedHospitals: [],
      autoNotify: true
    })
    setShowCreateAlert(false)
  }

  const handleHospitalToggle = (hospitalId) => {
    setAlertForm(prev => ({
      ...prev,
      affectedHospitals: prev.affectedHospitals.includes(hospitalId)
        ? prev.affectedHospitals.filter(id => id !== hospitalId)
        : [...prev.affectedHospitals, hospitalId]
    }))
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const activeAlerts = emergencyAlerts.filter(alert => 
    new Date(alert.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emergency Alerts</h1>
          <p className="text-gray-600">Monitor and manage emergency situations and alerts</p>
        </div>
        <button
          onClick={() => setShowCreateAlert(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </button>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">
                {emergencyAlerts.filter(a => a.severity === 'critical').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Bell className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">
                {emergencyAlerts.filter(a => a.severity === 'high').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-yellow-600">{activeAlerts.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {emergencyAlerts.length - activeAlerts.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Last 7 days</span>
          </div>
        </div>

        <div className="space-y-4">
          {emergencyAlerts.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No alerts created yet</p>
            </div>
          ) : (
            emergencyAlerts.map((alert) => {
              const typeInfo = getAlertTypeInfo(alert.type)
              const severityInfo = getSeverityInfo(alert.severity)
              
              return (
                <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          <div className="flex items-center">
                            {typeInfo.icon}
                            <span className="ml-1">{typeInfo.label}</span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${severityInfo.color}`}>
                          {severityInfo.label}
                        </div>
                      </div>
                      
                      <p className="text-gray-900 font-medium mb-2">{alert.message}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(alert.timestamp)}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {alert.affectedHospitals?.length || 0} hospitals affected
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Created by {alert.createdBy}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Emergency Alert</h3>
            
            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Type *
                </label>
                <select
                  value={alertForm.type}
                  onChange={(e) => setAlertForm(prev => ({ ...prev, type: e.target.value }))}
                  className="input-field"
                >
                  {alertTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level *
                </label>
                <select
                  value={alertForm.severity}
                  onChange={(e) => setAlertForm(prev => ({ ...prev, severity: e.target.value }))}
                  className="input-field"
                >
                  {severityLevels.map(severity => (
                    <option key={severity.value} value={severity.value}>{severity.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Message *
                </label>
                <textarea
                  value={alertForm.message}
                  onChange={(e) => setAlertForm(prev => ({ ...prev, message: e.target.value }))}
                  className="input-field"
                  rows="3"
                  placeholder="Describe the emergency situation and required actions..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affected Hospitals
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {hospitals.map(hospital => (
                    <label key={hospital.id} className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alertForm.affectedHospitals.includes(hospital.id)}
                        onChange={() => handleHospitalToggle(hospital.id)}
                        className="mr-2"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{hospital.name}</div>
                        <div className="text-xs text-gray-600">{hospital.location}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoNotify"
                  checked={alertForm.autoNotify}
                  onChange={(e) => setAlertForm(prev => ({ ...prev, autoNotify: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="autoNotify" className="text-sm text-gray-700">
                  Automatically notify affected hospitals via SMS and email
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAlert(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Alerts
