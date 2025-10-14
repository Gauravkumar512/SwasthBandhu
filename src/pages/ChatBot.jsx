import React, { useState, useRef, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { 
  Send, 
  Bot, 
  User, 
  Activity, 
  AlertTriangle, 
  Heart,
  MessageCircle,
  FileText,
  TrendingUp,
  Clock
} from 'lucide-react'

const ChatBot = () => {
  const { user } = useAuth()
  const { aqiData, newsData, hospitals, emergencyAlerts, bedAvailability } = useData()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${user?.name}! I'm your AI healthcare assistant. I can help you with hospital management, patient surge predictions, resource allocation, and emergency alerts. How can I assist you today?`,
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    // AQI and Pollution related queries
    if (message.includes('aqi') || message.includes('pollution') || message.includes('air quality')) {
      const currentAqi = aqiData[aqiData.length - 1]?.aqi || 0
      const trend = aqiData.length > 1 ? aqiData[aqiData.length - 1].aqi - aqiData[aqiData.length - 2].aqi : 0
      
      return {
        content: `Current AQI is ${currentAqi}. ${trend > 0 ? 'AQI is increasing' : 'AQI is decreasing'} by ${Math.abs(trend)} points. ${currentAqi > 150 ? 'High pollution levels detected. Recommend increasing respiratory care capacity and alerting at-risk patients.' : 'Air quality is within acceptable limits.'}`,
        suggestions: [
          'Show AQI trends',
          'Alert respiratory patients',
          'Check bed availability'
        ]
      }
    }

    // Bed availability queries
    if (message.includes('bed') || message.includes('availability') || message.includes('occupancy')) {
      const totalAvailable = Object.values(bedAvailability).reduce((sum, beds) => 
        sum + (beds.general || 0) + (beds.icu || 0) + (beds.emergency || 0), 0
      )
      const totalBeds = hospitals.reduce((sum, hospital) => sum + hospital.totalBeds, 0)
      const occupancyRate = ((totalBeds - totalAvailable) / totalBeds * 100).toFixed(1)

      return {
        content: `Current bed occupancy is ${occupancyRate}%. Total available beds: ${totalAvailable} out of ${totalBeds}. ${occupancyRate > 80 ? 'High occupancy detected. Consider activating surge capacity protocols.' : 'Bed availability is adequate for current demand.'}`,
        suggestions: [
          'Show detailed bed breakdown',
          'Activate surge protocols',
          'Contact nearby hospitals'
        ]
      }
    }

    // Emergency alerts
    if (message.includes('emergency') || message.includes('alert') || message.includes('crisis')) {
      const activeAlerts = emergencyAlerts.filter(alert => 
        new Date(alert.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      )

      if (activeAlerts.length > 0) {
        return {
          content: `There are ${activeAlerts.length} active emergency alerts. Latest: "${activeAlerts[0].message}". Severity: ${activeAlerts[0].severity}. Immediate action may be required.`,
          suggestions: [
            'View all alerts',
            'Send hospital notification',
            'Activate emergency protocols'
          ]
        }
      } else {
        return {
          content: 'No active emergency alerts at this time. All systems are operating normally.',
          suggestions: [
            'Check system status',
            'Review recent alerts',
            'Test alert system'
          ]
        }
      }
    }

    // Disease outbreak queries
    if (message.includes('disease') || message.includes('outbreak') || message.includes('epidemic')) {
      const recentDiseaseNews = newsData.filter(news => 
        news.category === 'Disease' && 
        new Date(news.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      )

      if (recentDiseaseNews.length > 0) {
        return {
          content: `Recent disease alerts: "${recentDiseaseNews[0].title}". ${recentDiseaseNews[0].summary} Severity: ${recentDiseaseNews[0].severity}. Monitor patient symptoms and prepare for potential surge.`,
          suggestions: [
            'Review all disease alerts',
            'Update isolation protocols',
            'Stock medical supplies'
          ]
        }
      } else {
        return {
          content: 'No recent disease outbreaks reported. Continue standard monitoring protocols.',
          suggestions: [
            'Check global health alerts',
            'Review seasonal patterns',
            'Update vaccination protocols'
          ]
        }
      }
    }

    // Festival/Seasonal queries
    if (message.includes('festival') || message.includes('diwali') || message.includes('holi') || message.includes('seasonal')) {
      return {
        content: 'Festival seasons typically see increased patient volumes due to pollution, accidents, and food poisoning. Current recommendations: Increase emergency staff by 30%, stock additional respiratory medications, and prepare for 40% surge in emergency cases.',
        suggestions: [
          'Activate festival protocols',
          'Increase emergency staffing',
          'Stock festival supplies'
        ]
      }
    }

    // General help
    if (message.includes('help') || message.includes('what can you do')) {
      return {
        content: 'I can help you with: 1) Real-time AQI monitoring and pollution alerts, 2) Bed availability and occupancy tracking, 3) Emergency alert management, 4) Disease outbreak monitoring, 5) Festival surge predictions, 6) Resource allocation recommendations, 7) Hospital communication coordination.',
        suggestions: [
          'Show AQI data',
          'Check bed availability',
          'View emergency alerts',
          'Get surge predictions'
        ]
      }
    }

    // Default response
    return {
      content: 'I understand you need assistance. I can help with hospital management, patient surge predictions, resource allocation, and emergency alerts. Could you be more specific about what you need help with?',
      suggestions: [
        'Check AQI levels',
        'View bed availability',
        'See emergency alerts',
        'Get help'
      ]
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage)
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        suggestions: aiResponse.suggestions,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Healthcare Assistant</h1>
        <p className="text-gray-600">Get intelligent insights and recommendations for hospital management</p>
      </div>

      <div className="flex-1 flex gap-6">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          <div className="card flex-1 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-medical-600 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                    </div>
                    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(message.timestamp)}
                      </div>
                      {message.suggestions && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full bg-medical-600 text-white flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about AQI, bed availability, emergencies, or any hospital management topic..."
                  className="flex-1 input-field"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="w-80 space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current AQI</span>
                <span className="font-medium text-gray-900">
                  {aqiData[aqiData.length - 1]?.aqi || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Alerts</span>
                <span className="font-medium text-red-600">
                  {emergencyAlerts.filter(alert => 
                    new Date(alert.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                  ).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Beds</span>
                <span className="font-medium text-green-600">
                  {Object.values(bedAvailability).reduce((sum, beds) => 
                    sum + (beds.general || 0) + (beds.icu || 0) + (beds.emergency || 0), 0
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleSuggestionClick('Show AQI data')}
                className="w-full flex items-center p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View AQI Trends
              </button>
              <button
                onClick={() => handleSuggestionClick('Check bed availability')}
                className="w-full flex items-center p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Heart className="h-4 w-4 mr-2" />
                Bed Availability
              </button>
              <button
                onClick={() => handleSuggestionClick('View emergency alerts')}
                className="w-full flex items-center p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Alerts
              </button>
              <button
                onClick={() => handleSuggestionClick('Get surge predictions')}
                className="w-full flex items-center p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Activity className="h-4 w-4 mr-2" />
                Surge Predictions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBot
