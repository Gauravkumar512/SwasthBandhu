import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  AlertTriangle, 
  Users,
  Clock,
  MapPin,
  Bed,
  Activity
} from 'lucide-react'

const HospitalCommunication = () => {
  const { hospitals, emergencyAlerts } = useData()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('messages')
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [messageType, setMessageType] = useState('general')

  // Mock communication data
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'Apollo Hospital',
      to: 'Fortis Healthcare',
      message: 'We have a surge in respiratory cases. Can you spare 2 ICU beds?',
      type: 'emergency',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'sent',
      priority: 'high'
    },
    {
      id: 2,
      from: 'Fortis Healthcare',
      to: 'Apollo Hospital',
      message: 'We can provide 1 ICU bed immediately. Will coordinate transfer.',
      type: 'emergency',
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      status: 'received',
      priority: 'high'
    },
    {
      id: 3,
      from: 'Max Hospital',
      to: 'All Hospitals',
      message: 'High pollution alert in Bangalore region. Prepare for increased patient load.',
      type: 'alert',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'broadcast',
      priority: 'medium'
    }
  ])

  const messageTypes = [
    { value: 'general', label: 'General', icon: <MessageSquare className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
    { value: 'emergency', label: 'Emergency', icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-red-100 text-red-800' },
    { value: 'resource', label: 'Resource Sharing', icon: <Bed className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
    { value: 'alert', label: 'Alert', icon: <Activity className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-orange-500 bg-orange-50'
      case 'low': return 'border-l-blue-500 bg-blue-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getMessageTypeInfo = (type) => {
    return messageTypes.find(t => t.value === type) || messageTypes[0]
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedHospital) {
      toast.error('Please select a hospital and enter a message')
      return
    }

    const message = {
      id: Date.now(),
      from: user?.name || 'Current User',
      to: selectedHospital.name,
      message: newMessage,
      type: messageType,
      timestamp: new Date().toISOString(),
      status: 'sent',
      priority: messageType === 'emergency' ? 'high' : messageType === 'alert' ? 'medium' : 'low'
    }

    setMessages(prev => [message, ...prev])
    setNewMessage('')
    toast.success('Message sent successfully')
  }

  const handleBroadcastAlert = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter an alert message')
      return
    }

    const alert = {
      id: Date.now(),
      from: user?.name || 'System',
      to: 'All Hospitals',
      message: newMessage,
      type: 'alert',
      timestamp: new Date().toISOString(),
      status: 'broadcast',
      priority: 'high'
    }

    setMessages(prev => [alert, ...prev])
    setNewMessage('')
    toast.success('Alert broadcasted to all hospitals')
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hospital Communication</h2>
          <p className="text-gray-600">Coordinate with other hospitals for resource sharing and emergency response</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-primary flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            Emergency Call
          </button>
          <button className="btn-secondary flex items-center">
            <Video className="h-4 w-4 mr-2" />
            Video Conference
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hospital List */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Hospitals Network</h3>
            <div className="space-y-2">
              {hospitals.map((hospital) => {
                const isSelected = selectedHospital?.id === hospital.id
                const recentMessage = messages.find(m => 
                  m.from === hospital.name || m.to === hospital.name
                )
                
                return (
                  <button
                    key={hospital.id}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{hospital.name}</div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {hospital.location}
                        </div>
                        {recentMessage && (
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {recentMessage.message}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className={`w-2 h-2 rounded-full ${
                          hospital.availableBeds > 20 ? 'bg-green-500' :
                          hospital.availableBeds > 10 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <div className="text-xs text-gray-500">
                          {hospital.availableBeds} beds
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Communication Interface */}
        <div className="lg:col-span-2">
          <div className="card h-full flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'messages'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'alerts'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Emergency Alerts
              </button>
              <button
                onClick={() => setActiveTab('broadcast')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'broadcast'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Broadcast
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.filter(msg => {
                if (activeTab === 'messages') return msg.type !== 'alert' && msg.status !== 'broadcast'
                if (activeTab === 'alerts') return msg.type === 'alert' || msg.type === 'emergency'
                return true
              }).map((message) => {
                const typeInfo = getMessageTypeInfo(message.type)
                
                return (
                  <div key={message.id} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(message.priority)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          <div className="flex items-center">
                            {typeInfo.icon}
                            <span className="ml-1">{typeInfo.label}</span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {message.from} → {message.to}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{message.message}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        message.status === 'sent' ? 'bg-green-100 text-green-800' :
                        message.status === 'received' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {message.status}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-xs text-primary-600 hover:text-primary-700">
                          Reply
                        </button>
                        <button className="text-xs text-gray-500 hover:text-gray-700">
                          Forward
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 pt-4">
              {activeTab === 'broadcast' ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <select
                      value={messageType}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="input-field w-32"
                    >
                      {messageTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Enter broadcast message..."
                      className="input-field flex-1"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleBroadcastAlert}
                      className="btn-primary flex items-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Broadcast to All
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <select
                      value={selectedHospital?.id || ''}
                      onChange={(e) => {
                        const hospital = hospitals.find(h => h.id === parseInt(e.target.value))
                        setSelectedHospital(hospital)
                      }}
                      className="input-field w-48"
                    >
                      <option value="">Select hospital</option>
                      {hospitals.map(hospital => (
                        <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                      ))}
                    </select>
                    <select
                      value={messageType}
                      onChange={(e) => setMessageType(e.target.value)}
                      className="input-field w-32"
                    >
                      {messageTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="input-field flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="btn-primary flex items-center"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
            <span className="text-sm font-medium">Emergency Alert</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Bed className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium">Request Beds</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Staff Support</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Activity className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium">Resource Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HospitalCommunication
