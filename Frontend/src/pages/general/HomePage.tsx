import { useNavigate } from 'react-router-dom'
import { 
  Shield, 
  Heart, 
  Users, 
  Plane, 
  LifeBuoy, 
  Car,
  Sparkles,
  ArrowRight,
  MapPin,
  CloudRain,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { InsurancePackagesSection } from '../../components/InsurancePackagesSection'

interface InsuranceType {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const insuranceTypes: InsuranceType[] = [
  {
    id: 'accident',
    title: 'Tai nạn cá nhân',
    description: 'Bảo vệ toàn diện cho các rủi ro tai nạn bất ngờ',
    icon: <Shield className="w-8 h-8" />,
    color: 'text-trust-600',
    bgColor: 'bg-trust-50'
  },
  {
    id: 'health',
    title: 'Sức khỏe',
    description: 'Chi trả viện phí, phẫu thuật và điều trị nội trú',
    icon: <Heart className="w-8 h-8" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'social',
    title: 'Bảo hiểm xã hội',
    description: 'Quyền lợi người lao động theo luật định',
    icon: <Users className="w-8 h-8" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'travel',
    title: 'Du lịch quốc tế',
    description: 'An tâm mọi chuyến đi với bảo hiểm toàn cầu',
    icon: <Plane className="w-8 h-8" />,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50'
  },
  {
    id: 'life',
    title: 'Nhân thọ',
    description: 'Bảo vệ tương lai cho gia đình bạn',
    icon: <LifeBuoy className="w-8 h-8" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 'property',
    title: 'Tài sản - Ô tô / Nhà ở',
    description: 'Bảo vệ tài sản khỏi thiệt hại và mất mát',
    icon: <Car className="w-8 h-8" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section - AI & Natural Disaster Protection */}
        <section className="relative overflow-hidden min-h-[95vh] flex items-center bg-gradient-to-br from-[#0a192f] via-[#1e3a5f] to-[#2c5282]">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Tech Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
            
            {/* Dynamic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-transparent to-cyan-900/70"></div>
            
            {/* Glowing orbs for depth - AI theme */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            
            {/* Weather/Storm visual elements */}
            <div className="absolute top-20 right-20 opacity-20">
              <CloudRain className="w-40 h-40 text-cyan-300 animate-pulse" />
            </div>
            <div className="absolute bottom-32 left-20 opacity-15">
              <Shield className="w-48 h-48 text-blue-300" />
            </div>
            
            {/* Animated particles - AI neural network effect */}
            <div className="absolute inset-0 opacity-40">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                ></div>
              ))}
            </div>
          </div>
        
          <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Main Message */}
                <div className="space-y-8 text-center lg:text-left">
                  {/* AI Badge */}
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-md border-2 border-yellow-400/40 rounded-full text-yellow-300 text-sm font-bold shadow-lg">
                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <span>Powered by AI Technology</span>
                  </div>

                  {/* Main Heading - emphasizing AI + Storm Protection */}
                  <div className="space-y-4">
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight">
                      <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                        AI Bảo Vệ Bạn
                      </span>
                      <br />
                      <span className="text-white drop-shadow-2xl">
                        Khỏi Bão Lũ
                      </span>
                    </h1>
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                      <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                      <CloudRain className="w-8 h-8 text-cyan-400" />
                      <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"></div>
                    </div>
                  </div>

                  <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed drop-shadow-lg">
                    Hệ thống <span className="font-bold text-cyan-300">AI thông minh</span> phân tích rủi ro thiên tai,{' '}
                    <span className="font-bold text-yellow-300">cảnh báo bão lũ</span> và gợi ý gói bảo hiểm phù hợp nhất cho bạn.
                  </p>

                  {/* AI Features with Icons */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-bold text-lg mb-1">Bản Đồ Thiên Tai AI</h3>
                        <p className="text-blue-200 text-sm">Theo dõi lũ lụt, bão thời gian thực trên toàn quốc</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-bold text-lg mb-1">AI Tự Động Điền Form</h3>
                        <p className="text-blue-200 text-sm">Trích xuất thông tin từ CCCD, giấy tờ trong 5 giây</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-bold text-lg mb-1">Gợi Ý Thông Minh</h3>
                        <p className="text-blue-200 text-sm">AI phân tích vùng của bạn và đề xuất gói bảo hiểm tối ưu</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                    <Button
                      onClick={() => navigate('/disaster-map')}
                      className="group bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 text-white px-8 py-7 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
                    >
                      <CloudRain className="w-6 h-6 mr-2" />
                      Xem Bản Đồ Bão Lũ
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <Button
                      onClick={() => {
                        document.getElementById('insurance-packages')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="bg-white/10 backdrop-blur-md text-white hover:bg-white/25 border-2 border-white/40 hover:border-white/70 px-8 py-7 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
                    >
                      <Shield className="w-5 h-5 mr-2" />
                      Các Gói Bảo Hiểm
                    </Button>
                  </div>
                </div>

                {/* Right Column - Visual Stats & Alert Cards */}
                <div className="space-y-6 lg:pl-8">
                  {/* Real-time Alert Card */}
                  <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-red-400/40 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-300 font-bold text-sm uppercase tracking-wide">Cảnh Báo Thời Gian Thực</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">🌊 Ngập Lụt Miền Trung</h3>
                    <p className="text-blue-100 mb-6">
                      AI phát hiện <span className="font-bold text-yellow-300">7 tỉnh</span> đang có nguy cơ ngập cao. 
                      Hệ thống đề xuất gói bảo hiểm thiên tai cho khu vực này.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        Mức độ: Cao
                      </div>
                      <div className="text-blue-200 text-sm">
                        Cập nhật: 5 phút trước
                      </div>
                    </div>
                  </div>

                  {/* AI Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
                      <div className="text-5xl font-bold text-cyan-400 mb-2">12K+</div>
                      <div className="text-blue-200 text-sm">Người dùng được AI bảo vệ</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
                      <div className="text-5xl font-bold text-yellow-400 mb-2">98%</div>
                      <div className="text-blue-200 text-sm">Độ chính xác AI</div>
                    </div>
                  </div>

                  {/* Safe Zone Indicator */}
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-3xl p-6 border-2 border-green-400/40">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                        ✅
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg">Khu Vực An Toàn</h4>
                        <p className="text-green-200 text-sm">Miền Nam: Không có cảnh báo thiên tai</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Packages Section - MAIN FEATURE */}
        <InsurancePackagesSection />

      {/* Insurance Types Grid */}
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Các loại bảo hiểm chúng tôi hỗ trợ
          </h2>
          <p className="text-base md:text-lg text-gray-600 px-4">
            AI của chúng tôi có thể phân tích và tư vấn cho mọi loại hợp đồng bảo hiểm
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {insuranceTypes.map((type) => (
            <Card 
              key={type.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-trust-400 overflow-hidden"
            >
              <CardHeader className="pb-3">
                <div className={`w-14 h-14 md:w-16 md:h-16 ${type.bgColor} rounded-2xl flex items-center justify-center ${type.color} mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {type.icon}
                </div>
                
                <CardTitle className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-trust-600 transition-colors">
                  {type.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                  {type.description}
                </CardDescription>

                <div className="flex items-center text-trust-600 font-medium group-hover:gap-2 transition-all text-sm md:text-base">
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      </main>
    </div>
  )
}

