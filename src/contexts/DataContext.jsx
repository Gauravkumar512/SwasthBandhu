import React, { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [aqiData, setAqiData] = useState([])
  const [newsData, setNewsData] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [emergencyAlerts, setEmergencyAlerts] = useState([])
  const [bedAvailability, setBedAvailability] = useState({})
  const [medicineAvailability, setMedicineAvailability] = useState({})

  useEffect(() => {
    // Initialize with mock data
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Mock AQI data for the last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const aqiData = months.map((month, index) => ({
      month,
      aqi: Math.floor(Math.random() * 200) + 50,
      pollutionLevel: Math.random() > 0.5 ? 'High' : 'Moderate'
    }))
    setAqiData(aqiData)

    // Mock news data
    const newsData = [
      {
        id: 1,
        title: 'Rising Respiratory Issues During Diwali Festival',
        summary: 'Hospitals report 40% increase in respiratory cases due to firecracker pollution.',
        date: new Date().toISOString(),
        severity: 'high',
        category: 'Pollution'
      },
      {
        id: 2,
        title: 'Monsoon Dengue Outbreak Alert',
        summary: 'Health department issues alert for potential dengue outbreak in Mumbai region.',
        date: new Date(Date.now() - 86400000).toISOString(),
        severity: 'medium',
        category: 'Disease'
      },
      {
        id: 3,
        title: 'Air Quality Index Reaches Hazardous Levels',
        summary: 'AQI levels in Delhi exceed 400, hospitals prepare for surge in patients.',
        date: new Date(Date.now() - 172800000).toISOString(),
        severity: 'critical',
        category: 'Pollution'
      }
    ]
    setNewsData(newsData)

    // Mock hospital data - expanded with more hospitals across India
    const hospitals = [
      // Mumbai hospitals
      { id: 1, name: 'Apollo Hospital', location: 'Mumbai', latitude: 19.0760, longitude: 72.8777, totalBeds: 500, availableBeds: 45, icuBeds: 50, availableIcu: 8, specialties: ['Cardiology', 'Neurology', 'Emergency'], contact: '+91-22-1234-5678', email: 'info@apollohospitals.com', website: 'https://www.apollohospitals.com' },
      { id: 2, name: 'Kokilaben Hospital', location: 'Mumbai', latitude: 19.1080, longitude: 72.9060, totalBeds: 350, availableBeds: 28, icuBeds: 35, availableIcu: 6, specialties: ['Oncology', 'Cardiology', 'Emergency'], contact: '+91-22-2345-6789', email: 'contact@kokilabenhospital.com', website: 'https://www.kokilabenhospital.com' },
      { id: 3, name: 'Lilavati Hospital', location: 'Mumbai', latitude: 19.0520, longitude: 72.8400, totalBeds: 300, availableBeds: 32, icuBeds: 30, availableIcu: 5, specialties: ['Orthopedics', 'Neurology', 'Emergency'], contact: '+91-22-3456-7890', email: 'info@lilavatihospital.com', website: 'https://www.lilavatihospital.com' },
      { id: 4, name: 'Nanavati Hospital', location: 'Mumbai', latitude: 19.1200, longitude: 72.8500, totalBeds: 400, availableBeds: 38, icuBeds: 40, availableIcu: 7, specialties: ['Cardiology', 'Oncology', 'Emergency'], contact: '+91-22-4567-8901', email: 'contact@nanavatihospital.com', website: 'https://www.nanavatihospital.com' },
      
      // Delhi hospitals
      { id: 5, name: 'Fortis Healthcare', location: 'Delhi', latitude: 28.6139, longitude: 77.2090, totalBeds: 300, availableBeds: 23, icuBeds: 30, availableIcu: 5, specialties: ['Oncology', 'Pediatrics', 'Emergency'], contact: '+91-11-9876-5432' },
      { id: 6, name: 'AIIMS Delhi', location: 'Delhi', latitude: 28.5670, longitude: 77.2100, totalBeds: 800, availableBeds: 120, icuBeds: 80, availableIcu: 15, specialties: ['Cardiology', 'Neurology', 'Emergency', 'Pediatrics'], contact: '+91-11-2658-8500' },
      { id: 7, name: 'Max Hospital Saket', location: 'Delhi', latitude: 28.5400, longitude: 77.2400, totalBeds: 250, availableBeds: 18, icuBeds: 25, availableIcu: 4, specialties: ['Orthopedics', 'Cardiology', 'Emergency'], contact: '+91-11-2651-5050' },
      { id: 8, name: 'Sir Ganga Ram Hospital', location: 'Delhi', latitude: 28.6500, longitude: 77.2000, totalBeds: 400, availableBeds: 35, icuBeds: 40, availableIcu: 8, specialties: ['Cardiology', 'Neurology', 'Emergency'], contact: '+91-11-2575-1000' },
      
      // Bangalore hospitals
      { id: 9, name: 'Max Hospital', location: 'Bangalore', latitude: 12.9716, longitude: 77.5946, totalBeds: 400, availableBeds: 67, icuBeds: 40, availableIcu: 12, specialties: ['Orthopedics', 'Cardiology', 'Emergency'], contact: '+91-80-5555-1234' },
      { id: 10, name: 'Manipal Hospital', location: 'Bangalore', latitude: 12.9500, longitude: 77.6200, totalBeds: 350, availableBeds: 42, icuBeds: 35, availableIcu: 9, specialties: ['Cardiology', 'Oncology', 'Emergency'], contact: '+91-80-2502-4444' },
      { id: 11, name: 'Fortis Hospital', location: 'Bangalore', latitude: 12.9200, longitude: 77.6000, totalBeds: 300, availableBeds: 25, icuBeds: 30, availableIcu: 6, specialties: ['Neurology', 'Orthopedics', 'Emergency'], contact: '+91-80-6621-4444' },
      { id: 12, name: 'Apollo Hospital', location: 'Bangalore', latitude: 12.9800, longitude: 77.5800, totalBeds: 450, availableBeds: 38, icuBeds: 45, availableIcu: 10, specialties: ['Cardiology', 'Oncology', 'Emergency'], contact: '+91-80-2630-4444' },
      
      // Chennai hospitals
      { id: 13, name: 'Apollo Hospital', location: 'Chennai', latitude: 13.0827, longitude: 80.2707, totalBeds: 500, availableBeds: 55, icuBeds: 50, availableIcu: 11, specialties: ['Cardiology', 'Neurology', 'Emergency'], contact: '+91-44-2829-3333' },
      { id: 14, name: 'Fortis Malar Hospital', location: 'Chennai', latitude: 13.0500, longitude: 80.2500, totalBeds: 300, availableBeds: 28, icuBeds: 30, availableIcu: 6, specialties: ['Oncology', 'Cardiology', 'Emergency'], contact: '+91-44-4200-2222' },
      { id: 15, name: 'MIOT Hospital', location: 'Chennai', latitude: 13.1000, longitude: 80.2900, totalBeds: 350, availableBeds: 32, icuBeds: 35, availableIcu: 7, specialties: ['Orthopedics', 'Neurology', 'Emergency'], contact: '+91-44-2249-2288' },
      
      // Hyderabad hospitals
      { id: 16, name: 'Apollo Hospital', location: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, totalBeds: 400, availableBeds: 42, icuBeds: 40, availableIcu: 8, specialties: ['Cardiology', 'Oncology', 'Emergency'], contact: '+91-40-2355-5555' },
      { id: 17, name: 'Continental Hospital', location: 'Hyderabad', latitude: 17.4200, longitude: 78.4500, totalBeds: 300, availableBeds: 25, icuBeds: 30, availableIcu: 5, specialties: ['Neurology', 'Orthopedics', 'Emergency'], contact: '+91-40-6716-9999' },
      { id: 18, name: 'KIMS Hospital', location: 'Hyderabad', latitude: 17.3600, longitude: 78.5200, totalBeds: 350, availableBeds: 30, icuBeds: 35, availableIcu: 7, specialties: ['Cardiology', 'Oncology', 'Emergency'], contact: '+91-40-4488-5000' },
      
      // Kolkata hospitals
      { id: 19, name: 'Apollo Gleneagles Hospital', location: 'Kolkata', latitude: 22.5726, longitude: 88.3639, totalBeds: 400, availableBeds: 38, icuBeds: 40, availableIcu: 8, specialties: ['Cardiology', 'Neurology', 'Emergency'], contact: '+91-33-2320-3040' },
      { id: 20, name: 'Fortis Hospital', location: 'Kolkata', latitude: 22.5500, longitude: 88.3800, totalBeds: 300, availableBeds: 22, icuBeds: 30, availableIcu: 4, specialties: ['Oncology', 'Pediatrics', 'Emergency'], contact: '+91-33-6628-4444' },
      { id: 21, name: 'AMRI Hospital', location: 'Kolkata', latitude: 22.5900, longitude: 88.3500, totalBeds: 350, availableBeds: 28, icuBeds: 35, availableIcu: 6, specialties: ['Cardiology', 'Orthopedics', 'Emergency'], contact: '+91-33-6661-6666' },
      
      // Pune hospitals
      { id: 22, name: 'Apollo Hospital', location: 'Pune', latitude: 18.5204, longitude: 73.8567, totalBeds: 300, availableBeds: 35, icuBeds: 30, availableIcu: 6, specialties: ['Cardiology', 'Neurology', 'Emergency'], contact: '+91-20-4340-4444' },
      { id: 23, name: 'Ruby Hall Clinic', location: 'Pune', latitude: 18.5000, longitude: 73.8800, totalBeds: 400, availableBeds: 42, icuBeds: 40, availableIcu: 8, specialties: ['Oncology', 'Cardiology', 'Emergency'], contact: '+91-20-6645-5555' },
      { id: 24, name: 'Sahyadri Hospital', location: 'Pune', latitude: 18.5400, longitude: 73.8200, totalBeds: 250, availableBeds: 20, icuBeds: 25, availableIcu: 5, specialties: ['Orthopedics', 'Neurology', 'Emergency'], contact: '+91-20-2444-4444' },
      
      // Ahmedabad hospitals
      { id: 25, name: 'Apollo Hospital', location: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, totalBeds: 350, availableBeds: 32, icuBeds: 35, availableIcu: 7, specialties: ['Cardiology', 'Oncology', 'Emergency'], contact: '+91-79-6670-1000' },
      { id: 26, name: 'Zydus Hospital', location: 'Ahmedabad', latitude: 23.0500, longitude: 72.6000, totalBeds: 300, availableBeds: 25, icuBeds: 30, availableIcu: 5, specialties: ['Neurology', 'Orthopedics', 'Emergency'], contact: '+91-79-6670-2000' },
      { id: 27, name: 'Sterling Hospital', location: 'Ahmedabad', latitude: 22.9900, longitude: 72.5400, totalBeds: 400, availableBeds: 38, icuBeds: 40, availableIcu: 8, specialties: ['Cardiology', 'Oncology', 'Emergency'], contact: '+91-79-4000-9000' }
    ]
    setHospitals(hospitals)

    // Mock emergency alerts
    const alerts = [
      {
        id: 1,
        type: 'pollution_spike',
        message: 'High pollution alert: AQI levels exceeding 300 in Mumbai region',
        severity: 'high',
        timestamp: new Date().toISOString(),
        affectedHospitals: [1, 2]
      },
      {
        id: 2,
        type: 'disease_outbreak',
        message: 'Dengue outbreak detected in South Mumbai - hospitals on high alert',
        severity: 'critical',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        affectedHospitals: [1, 3]
      }
    ]
    setEmergencyAlerts(alerts)

    // Mock bed availability
    setBedAvailability({
      1: { general: 45, icu: 8, emergency: 12 },
      2: { general: 23, icu: 5, emergency: 8 },
      3: { general: 67, icu: 12, emergency: 15 }
    })

    // Mock medicine availability
    setMedicineAvailability({
      'Paracetamol': { available: 1500, required: 2000, status: 'low' },
      'Oxygen': { available: 500, required: 800, status: 'critical' },
      'Antibiotics': { available: 800, required: 600, status: 'sufficient' }
    })
  }

  const addEmergencyAlert = (alert) => {
    setEmergencyAlerts(prev => [alert, ...prev])
  }

  const updateBedAvailability = (hospitalId, bedType, count) => {
    setBedAvailability(prev => ({
      ...prev,
      [hospitalId]: {
        ...prev[hospitalId],
        [bedType]: count
      }
    }))
  }

  const bookBed = (hospitalId, bedType) => {
    const current = bedAvailability[hospitalId]?.[bedType] || 0
    if (current > 0) {
      updateBedAvailability(hospitalId, bedType, current - 1)
      return { success: true }
    }
    return { success: false, error: 'No beds available' }
  }

  const value = {
    aqiData,
    newsData,
    hospitals,
    emergencyAlerts,
    bedAvailability,
    medicineAvailability,
    addEmergencyAlert,
    updateBedAvailability,
    bookBed
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
