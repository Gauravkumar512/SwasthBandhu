import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { 
  Pill, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Truck,
  Search,
  Filter,
  Plus,
  ShoppingCart,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

const MedicineBooking = () => {
  const { medicineAvailability } = useData()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [orderForm, setOrderForm] = useState({
    quantity: '',
    priority: 'normal',
    hospital: '',
    deliveryAddress: '',
    notes: ''
  })

  // Extended medicine data with more details
  const medicines = [
    {
      name: 'Paracetamol',
      available: 1500,
      required: 2000,
      status: 'low',
      price: 2.5,
      unit: 'tablets',
      category: 'Pain Relief',
      supplier: 'MediCorp Pharmaceuticals',
      expiryDate: '2024-12-31',
      lastRestocked: '2024-01-15'
    },
    {
      name: 'Oxygen',
      available: 500,
      required: 800,
      status: 'critical',
      price: 150,
      unit: 'cylinders',
      category: 'Life Support',
      supplier: 'OxyGen Solutions',
      expiryDate: '2025-06-30',
      lastRestocked: '2024-01-10'
    },
    {
      name: 'Antibiotics',
      available: 800,
      required: 600,
      status: 'sufficient',
      price: 45,
      unit: 'vials',
      category: 'Infection Control',
      supplier: 'AntibioMed Ltd',
      expiryDate: '2024-08-15',
      lastRestocked: '2024-01-20'
    },
    {
      name: 'Insulin',
      available: 200,
      required: 300,
      status: 'low',
      price: 120,
      unit: 'vials',
      category: 'Diabetes Care',
      supplier: 'DiabeCare Pharma',
      expiryDate: '2024-11-20',
      lastRestocked: '2024-01-12'
    },
    {
      name: 'Morphine',
      available: 100,
      required: 80,
      status: 'sufficient',
      price: 85,
      unit: 'vials',
      category: 'Pain Management',
      supplier: 'PainRelief Corp',
      expiryDate: '2024-09-10',
      lastRestocked: '2024-01-18'
    },
    {
      name: 'Saline Solution',
      available: 300,
      required: 500,
      status: 'low',
      price: 12,
      unit: 'bags',
      category: 'Fluid Therapy',
      supplier: 'FluidCare Medical',
      expiryDate: '2025-03-25',
      lastRestocked: '2024-01-08'
    }
  ]

  const hospitals = [
    { id: 1, name: 'Apollo Hospital', location: 'Mumbai' },
    { id: 2, name: 'Fortis Healthcare', location: 'Delhi' },
    { id: 3, name: 'Max Hospital', location: 'Bangalore' }
  ]

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || medicine.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'low': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'sufficient': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'low': return <TrendingDown className="h-4 w-4" />
      case 'sufficient': return <CheckCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getUrgencyLevel = (status) => {
    switch (status) {
      case 'critical': return 'Critical - Immediate restock required'
      case 'low': return 'Low stock - Restock recommended'
      case 'sufficient': return 'Stock levels adequate'
      default: return 'Unknown status'
    }
  }

  const handleOrderMedicine = (medicine) => {
    setSelectedMedicine(medicine)
    setOrderForm({
      quantity: '',
      priority: medicine.status === 'critical' ? 'urgent' : 'normal',
      hospital: '',
      deliveryAddress: '',
      notes: ''
    })
    setShowOrderForm(true)
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()
    
    if (!orderForm.quantity || !orderForm.hospital) {
      toast.error('Please fill in all required fields')
      return
    }

    // Simulate order processing
    toast.success(`Order placed successfully for ${orderForm.quantity} ${selectedMedicine.unit} of ${selectedMedicine.name}`)
    setShowOrderForm(false)
  }

  const getDaysUntilExpiry = (expiryDate) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine Management</h1>
          <p className="text-gray-600">Monitor medicine availability and place orders</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Medicine Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {medicines.filter(m => m.status === 'critical').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">
                {medicines.filter(m => m.status === 'low').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Adequate Stock</p>
              <p className="text-2xl font-bold text-green-600">
                {medicines.filter(m => m.status === 'sufficient').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Medicines</p>
              <p className="text-2xl font-bold text-blue-600">{medicines.length}</p>
            </div>
          </div>
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
                placeholder="Search medicines or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Stock Levels</option>
              <option value="critical">Critical</option>
              <option value="low">Low Stock</option>
              <option value="sufficient">Adequate Stock</option>
            </select>
          </div>
          <div>
            <button className="w-full btn-primary flex items-center justify-center">
              <Truck className="h-4 w-4 mr-2" />
              Track Orders
            </button>
          </div>
        </div>
      </div>

      {/* Medicine List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMedicines.map((medicine) => {
          const stockPercentage = (medicine.available / medicine.required) * 100
          const daysUntilExpiry = getDaysUntilExpiry(medicine.expiryDate)
          
          return (
            <div key={medicine.name} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                  <p className="text-sm text-gray-600">{medicine.category}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(medicine.status)}`}>
                  <div className="flex items-center">
                    {getStatusIcon(medicine.status)}
                    <span className="ml-1 capitalize">{medicine.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Stock Information */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Stock Level</span>
                    <span className="font-medium">
                      {medicine.available} / {medicine.required} {medicine.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stockPercentage >= 100 ? 'bg-green-500' :
                        stockPercentage >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{getUrgencyLevel(medicine.status)}</p>
                </div>

                {/* Medicine Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium ml-2">₹{medicine.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Supplier:</span>
                    <span className="font-medium ml-2">{medicine.supplier}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Restocked:</span>
                    <span className="font-medium ml-2">{new Date(medicine.lastRestocked).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expires in:</span>
                    <span className={`font-medium ml-2 ${
                      daysUntilExpiry < 30 ? 'text-red-600' :
                      daysUntilExpiry < 90 ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {daysUntilExpiry} days
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleOrderMedicine(medicine)}
                    disabled={medicine.status === 'sufficient'}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      medicine.status === 'sufficient'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1 inline" />
                    Order Now
                  </button>
                  <button className="flex-1 btn-secondary text-sm py-2">
                    <TrendingUp className="h-4 w-4 mr-1 inline" />
                    Restock
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order {selectedMedicine?.name}
            </h3>
            
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    required
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, quantity: e.target.value }))}
                    className="input-field flex-1 mr-2"
                    placeholder="Enter quantity"
                    min="1"
                  />
                  <span className="text-sm text-gray-600">{selectedMedicine?.unit}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital *
                </label>
                <select
                  required
                  value={orderForm.hospital}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, hospital: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select hospital</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name} - {hospital.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <select
                  value={orderForm.priority}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="input-field"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                  className="input-field"
                  rows="2"
                  placeholder="Enter delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-field"
                  rows="2"
                  placeholder="Any special requirements or notes"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Cost:</span>
                  <span className="font-medium">
                    ₹{orderForm.quantity && selectedMedicine ? 
                      (parseInt(orderForm.quantity) * selectedMedicine.price).toFixed(2) : 
                      '0.00'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">
                    {orderForm.priority === 'critical' ? '2-4 hours' :
                     orderForm.priority === 'urgent' ? '4-8 hours' :
                     '1-2 days'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOrderForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicineBooking
