import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin, Navigation, Bed, LocateFixed, RefreshCw, Linkedin } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useData } from '../contexts/DataContext'

const team = [
  { 
    name: 'Gaurav Kumar', 
    email: 'gauravskumar03@gmail.com', 
    skills: 'Frontend and Backend Developer ', 
    linkedin: 'Gaurav',
    linkedinUrl: 'https://www.linkedin.com/in/gaurav-kumar-22592b30b/',
    mobile: '8588069817',
    avatar: '/Gaurav.png'
  },
  { 
    name: 'Dhruv Kesarwani', 
    email: 'dhruvkesarwani383@gmail.com', 
    skills: 'AI Agents and System Design', 
    linkedin: 'Dhruv',
    linkedinUrl: 'https://www.linkedin.com/in/dhruv-kesarwani-97b72b342/',
    mobile: '7080810684',
    avatar: '/Dhruv.png'
  },
  { 
    name: 'Ayush Gupta', 
    email: 'ayushg2500@gmail.com', 
    skills: 'AI Agents and Deployment', 
    linkedin: 'Ayush',
    linkedinUrl: 'https://www.linkedin.com/in/ayush-gupta-2a3582322/',
    mobile: '8171801471',
    avatar: '/Ayush.jpg'
  },
  { 
    name: 'Kushagra Srivastava', 
    email: 'kushagrasrivastava123456@gmail.com', 
    skills: 'UI/UX Designer and Project Manager', 
    linkedin: 'Kushagra',
    linkedinUrl: 'https://www.linkedin.com/in/kushagra-srivastava-a45b61213/',
    mobile: '6397011464',
    avatar: '/Kushagra.jpg'
  },
]

const news = [
  { title: 'City Hospital launches new emergency wing', date: 'Oct 2025', summary: 'Expanded capacity for critical care and faster triage.' },
  { title: 'Seasonal flu vaccination drive begins', date: 'Oct 2025', summary: 'Hospitals coordinate to ensure adequate vaccine supply.' },
  { title: 'Air quality advisory issued', date: 'Oct 2025', summary: 'Public urged to limit outdoor activity during peak pollution hours.' },
]

const Landing = () => {
  const { hospitals } = useData()

  // useEffect(() => {
  //   console.log('Hospitals data:', hospitals)  // ✅ will log hospitals whenever they change
  // }, [hospitals])


  const CITY_COORDS = {
    Ahmedabad: { lat: 23.0225, lng: 72.5714 },
    Agra: { lat: 27.1767, lng: 78.0081 },
    Ajmer: { lat: 26.4499, lng: 74.6399 },
    Aligarh: { lat: 27.8974, lng: 78.088 },
    Amritsar: { lat: 31.634, lng: 74.8723 },
    Aurangabad: { lat: 19.8762, lng: 75.3433 },
    Bangalore: { lat: 12.9716, lng: 77.5946 },
    Bareilly: { lat: 28.367, lng: 79.4304 },
    Bhopal: { lat: 23.2599, lng: 77.4126 },
    Bhubaneswar: { lat: 20.2961, lng: 85.8245 },
    Bikaner: { lat: 28.0229, lng: 73.3119 },
    Chandigarh: { lat: 30.7333, lng: 76.7794 },
    Chennai: { lat: 13.0827, lng: 80.2707 },
    Coimbatore: { lat: 11.0168, lng: 76.9558 },
    Cuttack: { lat: 20.4625, lng: 85.8828 },
    Dehradun: { lat: 30.3165, lng: 78.0322 },
    Delhi: { lat: 28.6139, lng: 77.209 },
    Dhanbad: { lat: 23.7957, lng: 86.4304 },
    Faridabad: { lat: 28.4089, lng: 77.3178 },
    Ghaziabad: { lat: 28.6692, lng: 77.4538 },
    Goa: { lat: 15.2993, lng: 74.124 },
    Gorakhpur: { lat: 26.7606, lng: 83.3732 },
    Guntur: { lat: 16.3067, lng: 80.4365 },
    Gurgaon: { lat: 28.4595, lng: 77.0266 },
    Guwahati: { lat: 26.1445, lng: 91.7362 },
    Gwalior: { lat: 26.2183, lng: 78.1828 },
    Hyderabad: { lat: 17.385, lng: 78.4867 },
    Indore: { lat: 22.7196, lng: 75.8577 },
    Jaipur: { lat: 26.9124, lng: 75.7873 },
    Jabalpur: { lat: 23.1815, lng: 79.9864 },
    Jamshedpur: { lat: 22.8046, lng: 86.2029 },
    Jodhpur: { lat: 26.2389, lng: 73.0243 },
    Kanpur: { lat: 26.4499, lng: 80.3319 },
    Kochi: { lat: 9.9312, lng: 76.2673 },
    Kolhapur: { lat: 16.705, lng: 74.2433 },
    Kolkata: { lat: 22.5726, lng: 88.3639 },
    Kozhikode: { lat: 11.2588, lng: 75.7804 },
    Lucknow: { lat: 26.8467, lng: 80.9462 },
    Ludhiana: { lat: 30.9009, lng: 75.8573 },
    Madurai: { lat: 9.9252, lng: 78.1198 },
    Mangaluru: { lat: 12.9141, lng: 74.856 },
    Meerut: { lat: 28.9845, lng: 77.7064 },
    Mumbai: { lat: 19.076, lng: 72.8777 },
    Mysuru: { lat: 12.2958, lng: 76.6394 },
    Nagpur: { lat: 21.1458, lng: 79.0882 },
    Nashik: { lat: 19.9975, lng: 73.7898 },
    Navi_Mumbai: { lat: 19.033, lng: 73.0297 },
    Noida: { lat: 28.5355, lng: 77.391 },
    Patna: { lat: 25.5941, lng: 85.1376 },
    Prayagraj: { lat: 25.4358, lng: 81.8463 },
    Pune: { lat: 18.5204, lng: 73.8567 },
    Raipur: { lat: 21.2514, lng: 81.6296 },
    Rajkot: { lat: 22.3039, lng: 70.8022 },
    Ranchi: { lat: 23.3441, lng: 85.3096 },
    Surat: { lat: 21.1702, lng: 72.8311 },
    Srinagar: { lat: 34.0837, lng: 74.7973 },
    Thane: { lat: 19.2183, lng: 72.9781 },
    Tiruchirappalli: { lat: 10.7905, lng: 78.7047 },
    Tirupati: { lat: 13.6288, lng: 79.4192 },
    Udaipur: { lat: 24.5854, lng: 73.7125 },
    Vadodara: { lat: 22.3072, lng: 73.1812 },
    Varanasi: { lat: 25.3176, lng: 82.9739 },
    Vijayawada: { lat: 16.5062, lng: 80.648 },
    Visakhapatnam: { lat: 17.6868, lng: 83.2185 }
  }

  const [userLocation, setUserLocation] = useState(null)
  const [geoError, setGeoError] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [fallbackCity, setFallbackCity] = useState('')
  const [selectedMarkerLabel, setSelectedMarkerLabel] = useState('')
  const [latInput, setLatInput] = useState('')
  const [lngInput, setLngInput] = useState('')
  const [realHospitals, setRealHospitals] = useState([])
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false)
  const [useRealData, setUseRealData] = useState(true)
  const [realDataFailed, setRealDataFailed] = useState(false)

  const NEAR_MAX_KM = 30
  const NEARBY_MIN_KM = 30
  const NEARBY_MAX_KM = 200

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation not supported by your browser')
      return
    }
    setIsLocating(true)
    setGeoError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setIsLocating(false)
      },
      (err) => {
        const code = err?.code
        if (code === 1) setGeoError('Permission denied. Please allow location access or choose a city below.')
        else if (code === 2) setGeoError('Position unavailable. Try again or choose a city below.')
        else if (code === 3) setGeoError('Location request timed out. Try again or choose a city below.')
        else setGeoError('Unable to fetch your location. Choose a city below.')
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    )
  }

  useEffect(() => {
    requestLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!userLocation) return
    if (!selectedMarkerLabel) {
      setSelectedMarkerLabel(`${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`)
    }
    setLatInput(userLocation.lat.toFixed(5))
    setLngInput(userLocation.lng.toFixed(5))
  }, [userLocation, selectedMarkerLabel])

  useEffect(() => {
    if (!fallbackCity) return
    const coords = CITY_COORDS[fallbackCity]
    if (coords) {
      setUserLocation({ lat: coords.lat, lng: coords.lng })
      setSelectedMarkerLabel(fallbackCity)
      return
    }
  }, [fallbackCity])

  // Fetch real hospitals when location changes
  useEffect(() => {
    if (userLocation) {
      fetchHospitalsFromOverpass(userLocation.lat, userLocation.lng)
    }
  }, [userLocation])

  // Function to fetch hospitals from Overpass API
  const fetchHospitalsFromOverpass = async (lat, lng, radius = 20000) => {
    setIsLoadingHospitals(true)
    setRealDataFailed(false)
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          way["amenity"="hospital"](around:${radius},${lat},${lng});
          relation["amenity"="hospital"](around:${radius},${lat},${lng});
        );
        out center;
      `
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      
      if (!response.ok) throw new Error('Failed to fetch hospitals')
      
      const data = await response.json()
      
      if (!data.elements || data.elements.length === 0) {
        setRealDataFailed(true)
        setRealHospitals([])
        return []
      }
      
      const hospitalData = data.elements.map((element, index) => {
        const lat = element.lat || element.center?.lat
        const lng = element.lon || element.center?.lng
        const name = element.tags?.name || `Hospital ${index + 1}`
        const phone = element.tags?.['contact:phone'] || element.tags?.phone || 'Contact not available'
        const website = element.tags?.website || ''
        
        return {
          id: `real_${element.id || index}`,
          name: name,
          location: element.tags?.['addr:city'] || element.tags?.['addr:suburb'] || 'Unknown',
          latitude: lat,
          longitude: lng,
          totalBeds: Math.floor(Math.random() * 200) + 50, // Random beds for demo
          availableBeds: Math.floor(Math.random() * 30) + 5,
          icuBeds: Math.floor(Math.random() * 20) + 5,
          availableIcu: Math.floor(Math.random() * 5) + 1,
          specialties: ['Emergency', 'General Medicine', 'Surgery'],
          contact: phone,
          website: website,
          isReal: true
        }
      })
      
      setRealHospitals(hospitalData)
      setRealDataFailed(false)
      return hospitalData
    } catch (error) {
      console.error('Error fetching hospitals from Overpass API:', error)
      setRealDataFailed(true)
      setRealHospitals([])
      return []
    } finally {
      setIsLoadingHospitals(false)
    }
  }

  // Use real hospitals if available, otherwise fallback to mock data
  const currentHospitals = realHospitals.length > 0 ? realHospitals : hospitals

  // Debug logging (disabled to avoid referencing hooks before initialization)

  const sortedByDistance = useMemo(() => {
    if (!userLocation) return []
    const toRad = (d) => (d * Math.PI) / 180
    const R = 6371
    const dist = (lat1, lon1, lat2, lon2) => {
      const dLat = toRad(lat2 - lat1)
      const dLon = toRad(lon2 - lon1)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    }
    return currentHospitals
      .map(h => ({
        ...h,
        distanceKm: h.latitude && h.longitude ? dist(userLocation.lat, userLocation.lng, h.latitude, h.longitude) : Infinity
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
  }, [userLocation, currentHospitals])

  const topHospitalsNearby = useMemo(() => {
    if (!userLocation) return []
    // Show all hospitals within the range, not just those >= NEAR_MAX_KM
    const list = sortedByDistance.filter(h => h.distanceKm <= NEARBY_MAX_KM)
    return list.slice(0, 8)
  }, [sortedByDistance, userLocation])

  const defaultCenter = useMemo(() => ({ lat: userLocation?.lat ?? 20.5937, lng: userLocation?.lng ?? 78.9629 }), [userLocation])

  const userIcon = useMemo(() => L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }), [])

  const MapClickUpdater = () => {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat
        const lng = e.latlng.lng
        setUserLocation({ lat, lng })
        setLatInput(lat.toFixed(5))
        setLngInput(lng.toFixed(5))
        if (!selectedMarkerLabel) setSelectedMarkerLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      }
    })
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Navigation */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <span className="ml-3 text-xl font-bold tracking-tight">SwasthBandhu</span>
          </div>
          <nav className="flex items-center space-x-6">
            <a href="#news" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Health News</a>
            <a href="#hospitals" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Find Hospitals</a>
            <a href="#about" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Our Team</a>
            <Link to="/login" className="bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all">Login</Link>
          </nav>
        </div>
      </header>

      {/* Main - Latest Health News */}
      <main>
        <section id="news" className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Latest Health News</h2>
              <p className="text-gray-600 text-lg">Stay updated with the latest healthcare developments</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((n, idx) => (
                <div key={idx} className="group h-full rounded-xl p-6 bg-white shadow-md hover:shadow-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-xs uppercase tracking-wide text-indigo-600 font-semibold mb-3">{n.date}</div>
                  <div className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{n.title}</div>
                  <div className="text-gray-600 text-sm leading-relaxed">{n.summary}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Hospitals Nearby */}
        <section id="hospitals" className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Find Hospitals Near You</h2>
              <p className="text-gray-600 text-lg">Discover nearby hospitals with real-time bed availability</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Search & Filter</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {realDataFailed && (
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    Using fallback data
                  </span>
                )}
                {userLocation && (
                  <button 
                    onClick={() => fetchHospitalsFromOverpass(userLocation.lat, userLocation.lng)} 
                    className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 font-medium shadow-md hover:shadow-lg transition-all" 
                    disabled={isLoadingHospitals}
                  >
                    {isLoadingHospitals ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Refresh'}
                  </button>
                )}
                <button onClick={requestLocation} className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 font-medium shadow-md hover:shadow-lg transition-all" disabled={isLocating}>
                  {isLocating ? 'Locating…' : 'Use my location'}
                </button>
                <input
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  onBlur={() => {
                    const v = parseFloat(latInput)
                    if (Number.isFinite(v) && userLocation) setUserLocation({ lat: v, lng: userLocation.lng })
                  }}
                  placeholder="Latitude (e.g., 19.0760)"
                  className="input-field w-32"
                />
                <input
                  value={lngInput}
                  onChange={(e) => setLngInput(e.target.value)}
                  onBlur={() => {
                    const v = parseFloat(lngInput)
                    if (Number.isFinite(v) && userLocation) setUserLocation({ lat: userLocation.lat, lng: v })
                  }}
                  placeholder="Longitude (e.g., 72.8777)"
                  className="input-field w-32"
                />
                <button
                  className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-white hover:bg-gray-900 font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={() => {
                    const la = parseFloat(latInput)
                    const lo = parseFloat(lngInput)
                    if (Number.isFinite(la) && Number.isFinite(lo)) {
                      setUserLocation({ lat: la, lng: lo })
                      if (!selectedMarkerLabel) setSelectedMarkerLabel(`${la.toFixed(5)}, ${lo.toFixed(5)}`)
                    }
                  }}
                >
                  Set
                </button>
                <select value={fallbackCity} onChange={(e) => setFallbackCity(e.target.value)} className="input-field w-44">
                  <option value="">Or choose city</option>
                  {Object.keys(CITY_COORDS).map(c => (
                    <option key={c} value={c}>{c.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
            {!userLocation && (
              <div className="text-xs text-red-600 mb-3">{geoError}</div>
            )}
            {/* Map Section - Centered */}
            <div className="mb-8">
              <div className="w-full h-96 overflow-hidden rounded-2xl border-2 border-indigo-100 shadow-xl mx-auto max-w-4xl relative z-0">
                <MapContainer center={defaultCenter} zoom={userLocation ? 12 : 5} className="w-full h-full z-0">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                  {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                      <Popup>
                        {selectedMarkerLabel || `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`}
                      </Popup>
                    </Marker>
                  )}
                  {currentHospitals.filter(h => h.latitude && h.longitude).map(h => (
                    <Marker key={h.id} position={[h.latitude, h.longitude]} icon={userIcon} eventHandlers={{ click: () => setSelectedMarkerLabel(h.name) }}>
                      <Popup>
                        <div className="text-sm font-medium">{h.name}</div>
                        <div className="text-xs text-gray-600">{h.location}</div>
                        {h.contact && (<div className="text-xs text-gray-600">{h.contact}</div>)}
                        {h.isReal && <div className="text-xs text-green-600 font-semibold">Real Data</div>}
                      </Popup>
                    </Marker>
                  ))}
                  <MapClickUpdater />
                </MapContainer>
              </div>
            </div>

            {/* Hospital Data Section - Horizontal Row */}
            <div className="space-y-4">
              {isLoadingHospitals ? (
                <div className="flex items-center justify-center p-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
                  <span className="ml-2 text-sm text-gray-600">Loading hospitals...</span>
                </div>
              ) : topHospitalsNearby.length === 0 ? (
                <div className="text-sm text-gray-600 p-4 text-center">
                  {realDataFailed ? 'No hospitals found in this area. Using fallback data.' : 'No hospitals within 200 km range'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {topHospitalsNearby.map(h => (
                    <div key={h.id} className="group p-5 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-xl bg-white transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{h.name}</div>
                        {h.isReal && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">Real</span>}
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        <div className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {h.location}
                        </div>
                        
                        {h.contact && h.contact !== 'Contact not available' && (
                          <div className="text-sm text-gray-600 flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {h.contact}
                          </div>
                        )}
                        
                        {h.email && (
                          <div className="text-sm text-gray-600 flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {h.email}
                          </div>
                        )}
                        
                        {h.website && (
                          <div className="text-sm text-blue-600 flex items-center">
                            <a href={h.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-2">
                        <strong>Specializations:</strong> {h.specialties?.join(', ')}
                      </div>
                      
                      <div className="text-sm text-gray-700 flex items-center mb-2">
                        <Bed className="h-4 w-4 mr-2" />
                        <span>Beds: {h.availableBeds} / {h.totalBeds} available</span>
                      </div>
                      
                      {Number.isFinite(h.distanceKm) && (
                        <div className="text-sm text-gray-500 mb-3 flex items-center">
                          <Navigation className="h-4 w-4 mr-2" />
                          {h.distanceKm.toFixed(1)} km away
                        </div>
                      )}
                      
                      <button 
                        onClick={() => { 
                          setUserLocation({ lat: h.latitude, lng: h.longitude }); 
                          setSelectedMarkerLabel(h.name) 
                        }} 
                        className="w-full text-sm text-white bg-indigo-600 hover:bg-indigo-700 inline-flex items-center justify-center py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        <LocateFixed className="h-4 w-4 mr-2" /> Mark on Map
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Bottom - About Us */}
      <section id="about" className="bg-gradient-to-b from-white to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-gray-600 text-lg">Passionate individuals dedicated to transforming healthcare</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((m, idx) => (
              <div key={idx} className="group bg-white border-2 border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-center mb-4">
                  <img 
                    src={m.avatar} 
                    alt={m.name}
                    className="w-24 h-24 rounded-full border-4 border-indigo-100 shadow-lg group-hover:border-indigo-300 group-hover:scale-110 transition-all duration-300"
                  />
                </div>
                <div className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-indigo-600 transition-colors">{m.name}</div>
              
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-700 flex items-center justify-center">
                    <Linkedin className="h-4 w-4 mr-2 flex-shrink-0 text-indigo-600" />
                    <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition font-medium">
                      LinkedIn Profile
                    </a>
                  </div>
                  
                  <div className="text-xs text-gray-600 flex items-start justify-center">
                    <Mail className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                    <span className="break-all">{m.email}</span>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <span className="inline-block px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full group-hover:bg-indigo-100 transition-colors">
                    {m.skills}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-white font-semibold mb-2">Resources</div>
              <ul className="space-y-1 text-sm">
                <li>Gov Health</li>
                <li>Hospital Directory</li>
                <li>Emergency Services</li>
              </ul>
            </div>
            <div className="md:col-span-3 flex items-end justify-end">
              <div className="text-sm">Contact <span className="text-white">support@citycare.gov</span> • 1800-000-000</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

