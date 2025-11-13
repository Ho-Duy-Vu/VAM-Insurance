import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { 
  AlertTriangle, 
  CloudRain, 
  Shield, 
  MapPin, 
  Wind,
  Droplets,
  Thermometer,
  Search,
  Filter,
  Home,
  Car,
  Heart,
  Umbrella
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '..\/..\/components\/ui/card'
import { Button } from '..\/..\/components\/ui/button'
import AIGeoAnalystPanel from '..\/..\/components\/AIGeoAnalystPanel'
import { 
  disasterLocations, 
  type DisasterLocation,
  getLocationsByStatus,
  searchLocationByProvince 
} from '..\/..\/data\/disasterData'
import { insurancePackages } from '..\/..\/data\/insurancePackages'

// Fix Leaflet default marker icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons
const createCustomIcon = (color: string, emoji: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      ">
        <span style="transform: rotate(45deg);">${emoji}</span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

const markerIcons = {
  yellow: createCustomIcon('#facc15', '⚠️'),
  red: createCustomIcon('#ef4444', '🚨'),
  green: createCustomIcon('#22c55e', '✅'),
  orange: createCustomIcon('#f97316', '🌧️'),
  user: createCustomIcon('#3b82f6', '📍')
}

interface InsuranceRecommendationModalProps {
  location: DisasterLocation | null
  onClose: () => void
  onBuyInsurance: (packageId: string) => void
}

const InsuranceRecommendationModal: React.FC<InsuranceRecommendationModalProps> = ({
  location,
  onClose,
  onBuyInsurance
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (location) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [location])

  if (!location) return null

  const getPackageIcon = (packageName: string) => {
    if (packageName.includes('nhà') || packageName.includes('tài sản')) return <Home className="w-5 h-5" />
    if (packageName.includes('xe')) return <Car className="w-5 h-5" />
    if (packageName.includes('sức khỏe') || packageName.includes('thân thể')) return <Heart className="w-5 h-5" />
    return <Umbrella className="w-5 h-5" />
  }

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-green-100 text-green-800 border-green-300'
    }
  }

  const recommendedPackageDetails = location.recommended_packages
    .map(pkgName => insurancePackages.find(pkg => 
      pkg.name.toLowerCase().includes(pkgName.toLowerCase()) ||
      pkgName.toLowerCase().includes(pkg.name.toLowerCase())
    ))
    .filter(Boolean)

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <MapPin className="w-7 h-7" />
                {location.province}
              </h2>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getSeverityColor(location.severity)} font-semibold`}>
                <AlertTriangle className="w-5 h-5" />
                {location.status.replace(/_/g, ' ').toUpperCase()}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Tình hình hiện tại */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border-l-4 border-blue-600">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              Tình hình hiện tại
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{location.advice}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{location.detail}</p>
          </div>

          {/* Thông tin thời tiết */}
          {location.weatherInfo && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Nhiệt độ</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{location.weatherInfo.temperature}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Lượng mưa</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{location.weatherInfo.rainfall}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-5 h-5 text-cyan-600" />
                  <span className="font-semibold">Gió</span>
                </div>
                <p className="text-2xl font-bold text-cyan-600">{location.weatherInfo.windSpeed}</p>
              </div>
            </div>
          )}

          {/* Gói bảo hiểm được gợi ý */}
          <div>
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              🤖 AI Gợi Ý Gói Bảo Hiểm Phù Hợp
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Dựa trên tình hình thiên tai tại {location.province}, hệ thống AI khuyến nghị các gói bảo hiểm sau:
            </p>
            
            <div className="space-y-4">
              {recommendedPackageDetails.length > 0 ? (
                recommendedPackageDetails.map((pkg) => pkg && (
                  <div 
                    key={pkg.id}
                    className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-5 hover:shadow-lg transition-all hover:border-blue-400"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                        {getPackageIcon(pkg.name)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{pkg.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{pkg.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-blue-600">{pkg.price.toLocaleString('vi-VN')}đ</span>
                            <span className="text-sm text-gray-500">/{pkg.period}</span>
                          </div>
                          <Button
                            onClick={() => onBuyInsurance(pkg.id)}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                          >
                            Mua ngay
                          </Button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {pkg.benefits.slice(0, 3).map((benefit, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
                            >
                              ✓ {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Không tìm thấy gói bảo hiểm phù hợp</p>
                </div>
              )}
            </div>
          </div>

          {/* Cập nhật */}
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center pt-4 border-t">
            Cập nhật lúc: {location.lastUpdated}
          </div>
        </div>
      </div>
    </div>
  )
}

// Component để fly to location
const FlyToLocation: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap()
  
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5
    })
  }, [center, zoom, map])
  
  return null
}

export const DisasterMapPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedLocation, setSelectedLocation] = useState<DisasterLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | DisasterLocation['status']>('all')
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
    province: string
    region: string
  } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.0, 106.0]) // Trung tâm Việt Nam
  const [mapZoom, setMapZoom] = useState(6)

  const filteredLocations = disasterLocations.filter(loc => {
    const matchesSearch = searchQuery === '' || 
      loc.province.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || loc.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleSearch = () => {
    if (searchQuery) {
      const found = searchLocationByProvince(searchQuery)
      if (found) {
        setMapCenter(found.coordinates)
        setMapZoom(10)
        setSelectedLocation(found)
      }
    }
  }

  const handleMarkerClick = (location: DisasterLocation) => {
    setSelectedLocation(location)
  }

  const handleBuyInsurance = (packageId: string) => {
    setSelectedLocation(null)
    navigate(`/packages/${packageId}`)
  }

  const handleUserLocationDetected = (location: {
    lat: number
    lng: number
    province: string
    region: string
  }) => {
    console.log('📍 User location detected:', location)
    setUserLocation(location)
    setMapCenter([location.lat, location.lng])
    setMapZoom(10)
  }

  const statusStats = {
    ngập_lụt: getLocationsByStatus('ngập_lụt').length,
    cảnh_báo_bão: getLocationsByStatus('cảnh_báo_bão').length,
    mưa_lớn: getLocationsByStatus('mưa_lớn').length,
    ổn_định: getLocationsByStatus('ổn_định').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Page Header - Redesigned */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white py-12 px-4 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <CloudRain className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-1">
                Bản Đồ Thiên Tai Việt Nam
              </h1>
              <p className="text-blue-100 text-base md:text-lg">
                🤖 AI theo dõi thời gian thực · 🛡️ Gợi ý bảo hiểm thông minh
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* AI Geo-Analyst Panel - Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <AIGeoAnalystPanel onUserLocationDetected={handleUserLocationDetected} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search & Filter Bar - Improved */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm tỉnh/thành phố..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 dark:bg-gray-700 transition-all shadow-sm"
                      />
                    </div>
                    <Button 
                      onClick={handleSearch} 
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Tìm
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Filter className="text-blue-600 dark:text-blue-400 w-5 h-5" />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | DisasterLocation['status'])}
                      className="flex-1 px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 dark:bg-gray-700 transition-all shadow-sm font-medium"
                    >
                      <option value="all">Tất cả khu vực ({filteredLocations.length})</option>
                      <option value="ngập_lụt">⚠️ Ngập lụt ({statusStats.ngập_lụt})</option>
                      <option value="cảnh_báo_bão">🚨 Cảnh báo bão ({statusStats.cảnh_báo_bão})</option>
                      <option value="mưa_lớn">🌧️ Mưa lớn ({statusStats.mưa_lớn})</option>
                      <option value="ổn_định">✅ Ổn định ({statusStats.ổn_định})</option>
                    </select>
                  </div>
                </div>

                {/* Statistics - Enhanced */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="group bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-5 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Ngập lụt</p>
                    <p className="text-3xl font-bold text-yellow-700">{statusStats.ngập_lụt}</p>
                    <p className="text-xs text-yellow-600 mt-1">khu vực</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-5 rounded-xl border-2 border-red-200 dark:border-red-800 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <Wind className="w-6 h-6 text-red-600" />
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Cảnh báo bão</p>
                    <p className="text-3xl font-bold text-red-700">{statusStats.cảnh_báo_bão}</p>
                    <p className="text-xs text-red-600 mt-1">khu vực</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-5 rounded-xl border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <CloudRain className="w-6 h-6 text-orange-600" />
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Mưa lớn</p>
                    <p className="text-3xl font-bold text-orange-700">{statusStats.mưa_lớn}</p>
                    <p className="text-xs text-orange-600 mt-1">khu vực</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-5 rounded-xl border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="w-6 h-6 text-green-600" />
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Ổn định</p>
                    <p className="text-3xl font-bold text-green-700">{statusStats.ổn_định}</p>
                    <p className="text-xs text-green-600 mt-1">khu vực</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Container - Enhanced */}
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white py-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MapPin className="w-6 h-6" />
                  Bản đồ tương tác - {filteredLocations.length} điểm
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div style={{ height: '650px', width: '100%', position: 'relative', zIndex: 1 }}>
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: '100%', width: '100%', zIndex: 1 }}
                    scrollWheelZoom={true}
                    zoomControl={true}
                  >
                    <FlyToLocation center={mapCenter} zoom={mapZoom} />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Disaster Markers */}
                    {filteredLocations.map((location) => (
                      <Marker
                        key={location.id}
                        position={location.coordinates}
                        icon={markerIcons[location.marker_color]}
                        eventHandlers={{
                          click: () => handleMarkerClick(location)
                        }}
                      >
                        <Popup>
                          <div className="p-3 min-w-[280px]">
                            <h3 className="font-bold text-lg mb-2 text-gray-800">{location.province}</h3>
                            <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold mb-3 ${
                              location.marker_color === 'red' ? 'bg-red-100 text-red-800' :
                              location.marker_color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                              location.marker_color === 'orange' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {location.status.replace(/_/g, ' ').toUpperCase()}
                            </div>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{location.advice}</p>
                            <button
                              onClick={() => handleMarkerClick(location)}
                              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                            >
                              📋 Xem chi tiết & Gói bảo hiểm
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {/* User Location Marker */}
                    {userLocation && (
                      <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={markerIcons.user}
                      >
                        <Popup>
                          <div className="p-3 min-w-[240px]">
                            <h3 className="font-bold text-base mb-2 flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-blue-600" />
                              Vị trí của bạn
                            </h3>
                            <div className="space-y-1.5">
                              <p className="text-sm"><strong className="text-blue-600">Tỉnh/TP:</strong> {userLocation.province}</p>
                              <p className="text-sm"><strong className="text-blue-600">Vùng:</strong> {userLocation.region}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 italic">📱 Từ thông tin CCCD/CMND</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>

            {/* Legend - Enhanced */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  Chú thích bản đồ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">⚠️</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Ngập lụt</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Khu vực đang ngập</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">🚨</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Cảnh báo bão</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Sắp có bão/áp thấp</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">🌧️</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Mưa lớn</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Mưa to, lũ quét</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">✅</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Ổn định</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Thời tiết bình thường</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md">📍</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Vị trí bạn</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Từ CCCD/CMND</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Insurance Recommendation Modal */}
      {selectedLocation && (
        <InsuranceRecommendationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onBuyInsurance={handleBuyInsurance}
        />
      )}
    </div>
  )
}

