import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { 
  MapPin, 
  Phone, 
  Bed, 
  Activity,
  Search,
  Filter,
  Plus
} from 'lucide-react'

const HospitalManagement = () => {
  const { hospitals, bedAvailability, updateBedAvailability } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [showAddHospital, setShowAddHospital] = useState(false)
  

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesLocation = !filterLocation || hospital.location === filterLocation
    return matchesSearch && matchesLocation
  })

  const locations = [...new Set(hospitals.map(h => h.location))]

  const getOccupancyColor = (available, total) => {
    const occupancy = ((total - available) / total) * 100
    if (occupancy > 90) return 'text-red-600 bg-red-50'
    if (occupancy > 80) return 'text-orange-600 bg-orange-50'
    if (occupancy > 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getOccupancyStatus = (available, total) => {
    const occupancy = ((total - available) / total) * 100
    if (occupancy > 90) return 'Critical'
    if (occupancy > 80) return 'High'
    if (occupancy > 70) return 'Moderate'
    return 'Low'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hospital Management</h1>
          <p className="text-gray-600">Monitor and manage hospital resources and capacity</p>
        </div>
        <button
          onClick={() => setShowAddHospital(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Hospital
        </button>
      </div>

      

      {/* Hospital list */}
        <>
          {/* Filters */}
          <div className="card">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search hospitals or specialties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="input-field pl-10"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => {
          const beds = bedAvailability[hospital.id] || { general: 0, icu: 0, emergency: 0 }
          const totalAvailable = beds.general + beds.icu + beds.emergency
          const occupancyColor = getOccupancyColor(totalAvailable, hospital.totalBeds)
          const occupancyStatus = getOccupancyStatus(totalAvailable, hospital.totalBeds)

          return (
            <div key={hospital.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hospital.location}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${occupancyColor}`}>
                  {occupancyStatus} Occupancy
                </div>
              </div>

              <div className="space-y-4">
                {/* Contact */}
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {hospital.contact}
                </div>

                {/* Bed Availability */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm">Bed Availability</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{beds.general}</div>
                      <div className="text-xs text-gray-600">General</div>
                      <div className="text-xs text-gray-500">/ {hospital.totalBeds - hospital.icuBeds}</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <div className="text-lg font-semibold text-red-600">{beds.icu}</div>
                      <div className="text-xs text-gray-600">ICU</div>
                      <div className="text-xs text-gray-500">/ {hospital.icuBeds}</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                      <div className="text-lg font-semibold text-yellow-600">{beds.emergency}</div>
                      <div className="text-xs text-gray-600">Emergency</div>
                      <div className="text-xs text-gray-500">/ 20</div>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2 pt-2 border-t border-gray-200">
                  <button className="flex-1 btn-primary text-sm py-2">
                    <Bed className="h-4 w-4 mr-1" />
                    Book Bed
                  </button>
                  <button className="flex-1 btn-secondary text-sm py-2">
                    <Activity className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )
        })}
          </div>
        </>

      {/* Add Hospital Modal */}
      {showAddHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Hospital</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Name
                </label>
                <input type="text" className="input-field" placeholder="Enter hospital name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input type="text" className="input-field" placeholder="Enter location" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Beds
                </label>
                <input type="number" className="input-field" placeholder="Enter total beds" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ICU Beds
                </label>
                <input type="number" className="input-field" placeholder="Enter ICU beds" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact
                </label>
                <input type="text" className="input-field" placeholder="Enter contact number" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddHospital(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Add Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default HospitalManagement
