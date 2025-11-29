import { Shield, Heart, Users, Plane, Car, Home, Building, Briefcase, Baby, ArrowRight, CheckCircle2, Droplets, Wind, CloudRain, AlertTriangle, Star, TrendingUp, Award, Clock, Phone, MessageCircle, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { insurancePackages, formatPrice } from '../../data/insurancePackages'

interface Product {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  features: string[]
  price: string
  popular?: boolean
  rating?: number
}

const products: Product[] = [
  {
    id: 'health',
    title: 'Bảo hiểm sức khỏe',
    description: 'Bảo vệ sức khỏe toàn diện cho bạn và gia đình',
    icon: <Heart className="w-10 h-10" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    features: [
      'Chi trả viện phí không giới hạn',
      'Khám chữa bệnh nội trú và ngoại trú',
      'Phẫu thuật và điều trị đặc biệt',
      'Xét nghiệm và chẩn đoán hình ảnh',
      'Thuốc men theo toa bác sĩ'
    ],
    price: 'Từ 200.000đ/tháng',
    popular: true,
    rating: 4.9
  },
  {
    id: 'accident',
    title: 'Bảo hiểm tai nạn cá nhân',
    description: 'Bảo vệ toàn diện trước các rủi ro tai nạn',
    icon: <Shield className="w-10 h-10" />,
    color: 'text-trust-600',
    bgColor: 'bg-trust-50',
    features: [
      'Bồi thường tử vong do tai nạn',
      'Chi phí điều trị thương tật',
      'Trợ cấp thu nhập khi nghỉ việc',
      'Bảo vệ 24/7 mọi lúc mọi nơi',
      'Không cần khám sức khỏe'
    ],
    price: 'Từ 150.000đ/tháng',
    rating: 4.8
  },
  {
    id: 'social',
    title: 'Bảo hiểm xã hội',
    description: 'Quyền lợi người lao động theo luật định',
    icon: <Users className="w-10 h-10" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    features: [
      'Chế độ ốm đau, thai sản',
      'Lương hưu khi nghỉ việc',
      'Trợ cấp thất nghiệp',
      'Tai nạn lao động, bệnh nghề nghiệp',
      'Tử tuất'
    ],
    price: 'Theo quy định nhà nước',
    rating: 4.7
  },
  {
    id: 'travel',
    title: 'Bảo hiểm du lịch',
    description: 'An tâm khám phá thế giới',
    icon: <Plane className="w-10 h-10" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: [
      'Y tế khẩn cấp khi đi du lịch',
      'Hủy chuyến đi bất khả kháng',
      'Thất lạc hành lý',
      'Chậm chuyến bay',
      'Hỗ trợ khẩn cấp 24/7'
    ],
    price: 'Từ 100.000đ/chuyến',
    rating: 4.6
  },
  {
    id: 'car',
    title: 'Bảo hiểm ô tô',
    description: 'Bảo vệ xe và tài xế trên mọi hành trình',
    icon: <Car className="w-10 h-10" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    features: [
      'Bảo hiểm vật chất xe',
      'Trách nhiệm dân sự bắt buộc',
      'Tai nạn lái xe, hành khách',
      'Hỗ trợ sửa chữa khẩn cấp',
      'Đền bù thiệt hại bên thứ 3'
    ],
    price: 'Từ 500.000đ/năm',
    popular: true,
    rating: 4.8
  },
  {
    id: 'home',
    title: 'Bảo hiểm nhà cửa',
    description: 'Bảo vệ tài sản và tổ ấm của bạn',
    icon: <Home className="w-10 h-10" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    features: [
      'Cháy nổ, thiên tai',
      'Trộm cắp, mất trộm',
      'Thiệt hại nội thất',
      'Trách nhiệm dân sự',
      'Chi phí thuê nhà tạm'
    ],
    price: 'Từ 300.000đ/năm',
    rating: 4.7
  },
  {
    id: 'business',
    title: 'Bảo hiểm doanh nghiệp',
    description: 'Bảo vệ toàn diện cho doanh nghiệp',
    icon: <Building className="w-10 h-10" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    features: [
      'Tài sản doanh nghiệp',
      'Trách nhiệm nghề nghiệp',
      'Gián đoạn kinh doanh',
      'Tai nạn lao động',
      'Bảo hiểm hàng hóa'
    ],
    price: 'Liên hệ tư vấn',
    rating: 4.9
  },
  {
    id: 'life',
    title: 'Bảo hiểm nhân thọ',
    description: 'Bảo vệ tương lai gia đình bạn',
    icon: <Briefcase className="w-10 h-10" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    features: [
      'Quyền lợi tử vong',
      'Thương tật toàn bộ vĩnh viễn',
      'Bệnh hiểm nghèo',
      'Tích lũy tiết kiệm',
      'Miễn đóng phí bảo hiểm'
    ],
    price: 'Từ 500.000đ/tháng',
    rating: 4.8
  },
  {
    id: 'children',
    title: 'Bảo hiểm cho trẻ em',
    description: 'Đầu tư cho tương lai con trẻ',
    icon: <Baby className="w-10 h-10" />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    features: [
      'Chi phí giáo dục đại học',
      'Bệnh tật, tai nạn',
      'Miễn đóng phí nếu người đóng tử vong',
      'Tích lũy cho con',
      'Khuyến học, học bổng'
    ],
    price: 'Từ 250.000đ/tháng',
    rating: 4.7
  }
]

export default function ProductsPage() {
  // Map product IDs to their corresponding package detail routes
  const getProductDetailRoute = (productId: string): string => {
    const routeMap: Record<string, string> = {
      'health': '/packages/health-family',
      'accident': '/packages/life-basic',
      'social': '/packages/mandatory-health',
      'travel': '/packages/health-international',
      'car': '/packages/vehicle-comprehensive',
      'home': '/natural-disaster/flood-basic',
      'business': '/packages/life-premium',
      'life': '/packages/life-premium',
      'children': '/packages/health-family'
    }
    return routeMap[productId] || '/products'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <main className="flex-1">
        {/* Premium Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white py-24 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              {/* Trust Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                  <BadgeCheck className="w-5 h-5 text-cyan-300" />
                  <span className="text-sm font-semibold text-cyan-100">Đáng tin cậy bởi hơn 500,000+ khách hàng</span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center leading-tight">
                Sản Phẩm Bảo Hiểm
                <span className="block text-cyan-300 mt-2">Toàn Diện & Chuyên Nghiệp</span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed text-center max-w-3xl mx-auto mb-12">
                Khám phá đa dạng các gói bảo hiểm được thiết kế riêng cho nhu cầu của bạn.
                Bảo vệ toàn diện với công nghệ AI tiên tiến.
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2">500K+</div>
                  <div className="text-sm text-blue-200">Khách hàng</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2">₫2.5T+</div>
                  <div className="text-sm text-blue-200">Bồi thường chi trả</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2">98.5%</div>
                  <div className="text-sm text-blue-200">Hài lòng</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2">24/7</div>
                  <div className="text-sm text-blue-200">Hỗ trợ</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-16 fill-current text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
            </svg>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-4">
                <Shield className="w-4 h-4" />
                <span className="font-semibold text-sm">CÁC SẢN PHẨM BẢO HIỂM</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Lựa Chọn Gói Bảo Hiểm Phù Hợp
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Từ bảo hiểm sức khỏe đến bảo vệ tài sản, chúng tôi có giải pháp cho mọi nhu cầu
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="relative border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 group overflow-hidden bg-white"
                >
                  {/* Popular Badge */}
                  {product.popular && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1.5 rounded-bl-2xl rounded-tr-xl shadow-lg">
                        <div className="flex items-center gap-1 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-white" />
                          PHỔ BIẾN
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gradient Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"></div>

                  <CardHeader className="pb-4 pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`relative w-16 h-16 ${product.bgColor} rounded-2xl flex items-center justify-center ${product.color} group-hover:scale-110 transition-transform shadow-lg`}>
                        {product.icon}
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-2xl water-shimmer opacity-40"></div>
                      </div>

                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-200">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-yellow-700">{product.rating}</span>
                        </div>
                      )}
                    </div>

                    <CardTitle className="text-xl md:text-2xl mb-2 text-gray-900">{product.title}</CardTitle>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Price */}
                    <div className="mb-5 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100">
                      <div className="text-sm text-gray-600 mb-1">Phí bảo hiểm</div>
                      <div className="text-lg font-bold text-blue-700">{product.price}</div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2.5 mb-6">
                      <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        Quyền lợi bảo hiểm:
                      </h4>
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 pl-6">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2.5">
                      <Link to={getProductDetailRoute(product.id)} className="block">
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all group"
                        >
                          <span>Xem Chi Tiết</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link to="/contact" className="block">
                        <Button
                          variant="outline"
                          className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Tư Vấn Miễn Phí
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Credibility Section */}
        <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Tại Sao Chọn VAM Insurance?
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Giải Quyết Nhanh</h3>
                  <p className="text-sm text-gray-600">Giám định 24h, chi trả trong 5-7 ngày</p>
                </div>

                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Uy Tín Cao</h3>
                  <p className="text-sm text-gray-600">Được cấp phép và giám sát bởi Bộ Tài Chính</p>
                </div>

                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Công Nghệ AI</h3>
                  <p className="text-sm text-gray-600">Phân tích thông minh, đề xuất phù hợp nhất</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Natural Disaster Insurance Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold text-sm">BẢO HIỂM THIÊN TAI</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Bảo Vệ Tài Sản Khỏi Thiên Tai
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Đặc biệt dành cho khu vực Miền Bắc và Miền Trung - Bảo vệ nhà cửa, tài sản khỏi ngập lụt, bão, lũ quét
              </p>
            </div>

            {/* Natural Disaster Packages */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {insurancePackages
                .filter(pkg => pkg.type === 'natural_disaster')
                .map((pkg) => {
                  const iconMap: Record<string, React.ReactNode> = {
                    Droplets: <Droplets className="w-10 h-10" />,
                    Wind: <Wind className="w-10 h-10" />,
                    CloudRain: <CloudRain className="w-10 h-10" />
                  }

                  const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
                    blue: {
                      bg: 'bg-blue-50',
                      text: 'text-blue-600',
                      border: 'border-blue-200',
                      badge: 'bg-blue-600'
                    },
                    cyan: {
                      bg: 'bg-cyan-50',
                      text: 'text-cyan-600',
                      border: 'border-cyan-200',
                      badge: 'bg-cyan-600'
                    },
                    slate: {
                      bg: 'bg-slate-50',
                      text: 'text-slate-600',
                      border: 'border-slate-200',
                      badge: 'bg-slate-600'
                    }
                  }

                  const colors = colorMap[pkg.color] || colorMap.blue

                  return (
                    <Card
                      key={pkg.id}
                      className={`relative border-2 ${colors.border} hover:shadow-2xl transition-all duration-300 group overflow-hidden bg-white`}
                    >
                      {pkg.featured && (
                        <div className="absolute top-0 left-0 right-0 z-10">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center py-2 text-sm font-bold">
                            ⭐ PHỔ BIẾN NHẤT
                          </div>
                        </div>
                      )}

                      {/* Gradient Accent */}
                      <div className={`absolute ${pkg.featured ? 'top-9' : 'top-0'} left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600`}></div>

                      <CardHeader className={`${colors.bg} ${pkg.featured ? 'pt-12' : 'pt-6'}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center ${colors.text} shadow-lg group-hover:scale-110 transition-transform`}>
                            {iconMap[pkg.icon] || <Shield className="w-10 h-10" />}
                            <div className="absolute inset-0 rounded-2xl water-shimmer opacity-30"></div>
                          </div>
                          <span className={`text-xs font-bold ${colors.badge} text-white px-3 py-1.5 rounded-full`}>
                            {pkg.period}
                          </span>
                        </div>
                        <CardTitle className="text-xl md:text-2xl mb-2">{pkg.shortName}</CardTitle>
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                      </CardHeader>

                      <CardContent className="pt-6">
                        {/* Price */}
                        <div className={`${colors.bg} rounded-xl p-4 mb-6 text-center border-2 ${colors.border}`}>
                          <div className="text-2xl md:text-3xl font-bold text-gray-900">
                            {formatPrice(pkg.price)}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Bảo hiểm: <span className={`font-bold ${colors.text}`}>{pkg.coverage}</span>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-2.5 mb-6">
                          <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                            <CheckCircle2 className={`w-4 h-4 ${colors.text}`} />
                            Quyền lợi:
                          </h4>
                          {pkg.benefits.slice(0, 4).map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 pl-6">
                              <div className={`w-1.5 h-1.5 ${colors.text} rounded-full mt-2 flex-shrink-0`}></div>
                              <span className="text-sm text-gray-700">{benefit}</span>
                            </div>
                          ))}
                          {pkg.benefits.length > 4 && (
                            <p className="text-xs text-gray-500 italic pl-6">
                              + {pkg.benefits.length - 4} quyền lợi khác...
                            </p>
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="space-y-2.5">
                          <Link to={`/natural-disaster/${pkg.id}`}>
                            <Button
                              className={`w-full ${colors.badge} hover:opacity-90 text-white font-bold shadow-lg hover:shadow-xl transition-all group`}
                            >
                              <span>Xem Chi Tiết</span>
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                          <Link to={`/natural-disaster/application?package=${pkg.id}`}>
                            <Button
                              variant="outline"
                              className={`w-full border-2 ${colors.border} ${colors.text} hover:${colors.bg} font-semibold`}
                            >
                              Đăng Ký Ngay
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>

            {/* Info Banner */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-yellow-300" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Tại sao cần bảo hiểm thiên tai?</h3>
                  <ul className="space-y-2 text-blue-100">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                      <span>Miền Bắc & Miền Trung thường xuyên chịu ảnh hưởng bão, lũ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                      <span>Thiệt hại tài sản có thể lên đến hàng trăm triệu đồng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                      <span>Giám định nhanh 24h, thanh toán trong 5-7 ngày</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                      <span>Chỉ từ 1,2 triệu/năm - Bảo vệ toàn diện tài sản của bạn</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Shield className="w-10 h-10 text-cyan-300" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Không chắc chọn gói bảo hiểm nào?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Để AI của VAM Insurance phân tích hồ sơ và đề xuất gói bảo hiểm phù hợp nhất cho bạn
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/">
                  <Button size="lg" className=" text-blue-900 hover:bg-gray-100 px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all group">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Phân Tích Hồ Sơ Ngay
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-blue-900 hover:bg-gray-100 px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all group">
                    <Phone className="w-5 h-5 mr-2" />
                    Gọi Tư Vấn: 1900-xxxx
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-sm text-blue-200 mb-4">Được tin tưởng bởi các đối tác hàng đầu</p>
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
                  <div className="text-2xl font-bold">VCCI</div>
                  <div className="text-2xl font-bold">ISO 9001</div>
                  <div className="text-2xl font-bold">Bộ Tài Chính</div>
                  <div className="text-2xl font-bold">VietQR</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
