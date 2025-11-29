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
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import AIGeoAnalystPanel from '../../components/AIGeoAnalystPanel'
import { 
  disasterLocations, 
  type DisasterLocation,
  getLocationsByStatus,
  searchLocationByProvince 
} from '../../data/disasterData'
import { insurancePackages } from '../../data/insurancePackages'

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
      {/* Page Header - Enhanced */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 py-16 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        {/* Decorative Floating Elements */}
        <div className="absolute top-10 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            {/* Icon Badge */}
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/30 border border-white/30">
                <CloudRain className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            </div>
            
            {/* Title & Description */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-white">Cập nhật trực tiếp</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-semibold text-white">{disasterLocations.length} Khu vực</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-3 text-white drop-shadow-lg">
                Bản Đồ Thiên Tai Việt Nam
              </h1>
              <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-3xl">
                🤖 Hệ thống AI giám sát thời gian thực · 🛡️ Gợi ý bảo hiểm thông minh · 📍 Định vị vị trí của bạn
              </p>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{statusStats.ngập_lụt}</p>
                  <p className="text-sm text-blue-100">Ngập lụt</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <Wind className="w-6 h-6 text-red-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{statusStats.cảnh_báo_bão}</p>
                  <p className="text-sm text-blue-100">Cảnh báo bão</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <CloudRain className="w-6 h-6 text-orange-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{statusStats.mưa_lớn}</p>
                  <p className="text-sm text-blue-100">Mưa lớn</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-300" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{statusStats.ổn_định}</p>
                  <p className="text-sm text-blue-100">Ổn định</p>
                </div>
              </div>
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
            {/* Search & Filter Bar - Enhanced */}
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 hover:shadow-3xl transition-all">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Search and Filter Row */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Search Input */}
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-focus-within:scale-110 transition-transform">
                          <Search className="text-white w-5 h-5" />
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Tìm kiếm tỉnh/thành phố (VD: Hà Nội, TP.HCM)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-20 pr-32 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 dark:bg-gray-700 transition-all shadow-sm font-medium text-base"
                      />
                      <Button 
                        onClick={handleSearch} 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      >
                        Tìm
                      </Button>
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-focus-within:scale-110 transition-transform">
                          <Filter className="text-white w-5 h-5" />
                        </div>
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as 'all' | DisasterLocation['status'])}
                        className="w-full pl-20 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200/50 dark:bg-gray-700 transition-all shadow-sm font-medium text-base appearance-none cursor-pointer"
                      >
                        <option value="all">📊 Tất cả khu vực ({filteredLocations.length})</option>
                        <option value="ngập_lụt">⚠️ Ngập lụt ({statusStats.ngập_lụt})</option>
                        <option value="cảnh_báo_bão">🚨 Cảnh báo bão ({statusStats.cảnh_báo_bão})</option>
                        <option value="mưa_lớn">🌧️ Mưa lớn ({statusStats.mưa_lớn})</option>
                        <option value="ổn_định">✅ Ổn định ({statusStats.ổn_định})</option>
                      </select>
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-blue-950/30 p-4 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white mb-1">Đang hiển thị {filteredLocations.length} khu vực</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Click vào marker trên bản đồ để xem chi tiết và gợi ý bảo hiểm từ AI</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Container - Enhanced */}
            <Card className="shadow-2xl border-0 overflow-hidden animate-fadeIn">
              <CardHeader className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 py-6 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl text-white">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold">Bản đồ tương tác</div>
                        <div className="text-sm text-blue-100 font-normal mt-1">{filteredLocations.length} điểm giám sát • Cập nhật trực tiếp</div>
                      </div>
                    </CardTitle>
                    <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-white">Live</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative">
                {/* Map Loading Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 z-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Đang tải bản đồ...</p>
                  </div>
                </div>
                
                <div style={{ height: '700px', width: '100%', position: 'relative', zIndex: 1 }}>
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
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 hover:shadow-3xl transition-all">
              <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-950/30">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Filter className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">Chú thích bản đồ</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-normal mt-0.5">Ý nghĩa các marker trên bản đồ</div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                  <div className="group relative bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-5 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                      {statusStats.ngập_lụt}
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg mx-auto mb-3 group-hover:scale-110 transition-transform">⚠️</div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-center mb-1">Ngập lụt</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Khu vực đang ngập</p>
                  </div>
                  
                  <div className="group relative bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-5 rounded-2xl border-2 border-red-200 dark:border-red-800 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                      {statusStats.cảnh_báo_bão}
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg mx-auto mb-3 group-hover:scale-110 transition-transform">🚨</div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-center mb-1">Cảnh báo bão</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Sắp có bão/áp thấp</p>
                  </div>
                  
                  <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-5 rounded-2xl border-2 border-orange-200 dark:border-orange-800 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                      {statusStats.mưa_lớn}
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg mx-auto mb-3 group-hover:scale-110 transition-transform">🌧️</div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-center mb-1">Mưa lớn</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Mưa to, lũ quét</p>
                  </div>
                  
                  <div className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-5 rounded-2xl border-2 border-green-200 dark:border-green-800 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {statusStats.ổn_định}
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg mx-auto mb-3 group-hover:scale-110 transition-transform">✅</div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-center mb-1">Ổn định</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Thời tiết bình thường</p>
                  </div>
                  
                  <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-5 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg mx-auto mb-3 group-hover:scale-110 transition-transform">📍</div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-center mb-1">Vị trí bạn</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Từ CCCD/CMND</p>
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

