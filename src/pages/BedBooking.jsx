import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { 
  Bed, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar,
  User,
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const BedBooking = () => {
  const { hospitals, bedAvailability, bookBed } = useData()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBedType, setFilterBedType] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    patientName: '',
    patientAge: '',
    patientPhone: '',
    bedType: '',
    urgency: 'normal',
    medicalCondition: '',
    expectedStay: ''
  })

  const bedTypes = [
    { value: 'general', label: 'General Ward', icon: <Bed className="h-4 w-4" /> },
    { value: 'icu', label: 'ICU', icon: <AlertCircle className="h-4 w-4" /> },
    { value: 'emergency', label: 'Emergency', icon: <Clock className="h-4 w-4" /> }
  ]

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !filterLocation || hospital.location === filterLocation
    return matchesSearch && matchesLocation
  })

  const locations = [...new Set(hospitals.map(h => h.location))]

  const getAvailableBeds = (hospitalId, bedType) => {
    return bedAvailability[hospitalId]?.[bedType] || 0
  }

  const handleBookBed = async (hospitalId, bedType) => {
    const result = bookBed(hospitalId, bedType)
    if (result.success) {
      setSelectedHospital(hospitals.find(h => h.id === hospitalId))
      setBookingForm(prev => ({ ...prev, bedType }))
      setShowBookingForm(true)
      toast.success('Bed available! Please fill the booking form.')
    } else {
      toast.error(result.error || 'Failed to book bed')
    }
  }

  const handleSubmitBooking = (e) => {
    e.preventDefault()
    // Here you would typically send the booking data to your backend
    toast.success('Bed booking confirmed! You will receive a confirmation SMS.')
    setShowBookingForm(false)
    setBookingForm({
      patientName: '',
      patientAge: '',
      patientPhone: '',
      bedType: '',
      urgency: 'normal',
      medicalCondition: '',
      expectedStay: ''
    })
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'normal': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bed Booking</h1>
          <p className="text-gray-600">Find and book available hospital beds</p>
        </div>
        <div className="text-sm text-gray-500">
          Logged in as: <span className="font-medium">{user?.name}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <select
              value={filterBedType}
              onChange={(e) => setFilterBedType(e.target.value)}
              className="input-field"
            >
              <option value="">All Bed Types</option>
              {bedTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="input-field"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hospital List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredHospitals.map((hospital) => (
          <div key={hospital.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {hospital.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Phone className="h-4 w-4 mr-1" />
                  {hospital.contact}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Available Beds</h4>
              
              <div className="grid grid-cols-1 gap-3">
                {bedTypes.map((bedType) => {
                  const available = getAvailableBeds(hospital.id, bedType.value)
                  const isAvailable = available > 0
                  
                  return (
                    <div key={bedType.value} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="text-gray-600 mr-3">
                          {bedType.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{bedType.label}</div>
                          <div className="text-sm text-gray-600">
                            {available} bed{available !== 1 ? 's' : ''} available
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBookBed(hospital.id, bedType.value)}
                        disabled={!isAvailable}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isAvailable
                            ? 'bg-primary-600 hover:bg-primary-700 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable ? 'Book Now' : 'Unavailable'}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Specialties */}
              <div>
                <h5 className="font-medium text-gray-900 text-sm mb-2">Specialties</h5>
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
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Book Bed - {selectedHospital?.name}
            </h3>
            
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.patientName}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, patientName: e.target.value }))}
                  className="input-field"
                  placeholder="Enter patient name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    value={bookingForm.patientAge}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, patientAge: e.target.value }))}
                    className="input-field"
                    placeholder="Age"
                    min="0"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.patientPhone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, patientPhone: e.target.value }))}
                    className="input-field"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bed Type
                </label>
                <select
                  value={bookingForm.bedType}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, bedType: e.target.value }))}
                  className="input-field"
                >
                  {bedTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level
                </label>
                <select
                  value={bookingForm.urgency}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, urgency: e.target.value }))}
                  className="input-field"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Condition
                </label>
                <textarea
                  value={bookingForm.medicalCondition}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, medicalCondition: e.target.value }))}
                  className="input-field"
                  rows="3"
                  placeholder="Describe the medical condition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Stay Duration
                </label>
                <select
                  value={bookingForm.expectedStay}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, expectedStay: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select duration</option>
                  <option value="1-3 days">1-3 days</option>
                  <option value="4-7 days">4-7 days</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2+ weeks">2+ weeks</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BedBooking
