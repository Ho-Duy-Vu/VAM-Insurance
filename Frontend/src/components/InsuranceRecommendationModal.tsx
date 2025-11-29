import { X, Shield, Droplets, Wind, CloudRain, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'

interface RecommendationPackage {
  name: string
  reason: string
  priority: number
}

interface InsuranceRecommendationModalProps {
  isOpen: boolean
  onClose: () => void
  placeOfOrigin?: {
    text: string
    region: string
  }
  address?: {
    text: string
    region: string
  }
  recommendedPackages?: RecommendationPackage[]
  onSelectPackage?: (packageName: string) => void
}

export default function InsuranceRecommendationModal({
  isOpen,
  onClose,
  placeOfOrigin,
  address,
  recommendedPackages = [],
  onSelectPackage
}: InsuranceRecommendationModalProps) {
  // Debug logs
  console.log('🎯 Modal render - isOpen:', isOpen, 'packages:', recommendedPackages?.length)
  console.log('📦 Modal props:', { placeOfOrigin, address, recommendedPackages })
  
  if (!isOpen) return null

  const regionInfo = placeOfOrigin || address
  const hasRecommendations = recommendedPackages.length > 0

  // Map package name to icon
  const getPackageIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('ngập lụt') || lowerName.includes('lũ')) {
      return <Droplets className="w-8 h-8" />
    } else if (lowerName.includes('bão') || lowerName.includes('gió')) {
      return <Wind className="w-8 h-8" />
    } else if (lowerName.includes('phương tiện') || lowerName.includes('xe')) {
      return <CloudRain className="w-8 h-8" />
    }
    return <Shield className="w-8 h-8" />
  }

  // Get package color
  const getPackageColor = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('ngập lụt') || lowerName.includes('lũ')) {
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700'
      }
    } else if (lowerName.includes('bão') || lowerName.includes('gió')) {
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-200',
        button: 'bg-indigo-600 hover:bg-indigo-700'
      }
    } else if (lowerName.includes('phương tiện') || lowerName.includes('xe')) {
      return {
        bg: 'bg-cyan-50',
        text: 'text-cyan-600',
        border: 'border-cyan-200',
        button: 'bg-cyan-600 hover:bg-cyan-700'
      }
    }
    return {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      border: 'border-gray-200',
      button: 'bg-gray-600 hover:bg-gray-700'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col my-8">
        {/* Warning Banner - Separate from Card */}
        {hasRecommendations && (
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 text-white rounded-t-2xl shadow-xl mb-0 animate-in slide-in-from-top duration-300">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <AlertTriangle className="w-7 h-7 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    ⚠️ CẢNH BÁO RỦI RO THIÊN TAI
                  </h3>
                  <p className="text-sm text-white/95 leading-relaxed">
                    Khu vực của bạn thuộc vùng có nguy cơ cao về bão lũ và thiên tai. 
                    Chúng tôi đề xuất các gói bảo hiểm phù hợp để bảo vệ tài sản của bạn.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-lg flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content Card */}
        <Card className={`${hasRecommendations ? 'rounded-t-none border-t-0' : 'rounded-2xl'} border-2 border-blue-200 shadow-2xl animate-in slide-in-from-bottom duration-300 flex-1 overflow-hidden flex flex-col`}>
          {/* Close button for non-warning case */}
          {!hasRecommendations && (
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}
          
          <CardContent className="p-8 overflow-y-auto flex-1">
            {/* Region Info */}
            {regionInfo && (
              <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">📊 Thông tin đã phân tích</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-gray-700 min-w-[90px]">
                          {placeOfOrigin ? '🏡 Quê quán:' : '📍 Địa chỉ:'}
                        </span>
                        <span className="text-gray-900 flex-1">{regionInfo.text}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700 min-w-[90px]">🗺️ Vùng miền:</span>
                        <span className="px-3 py-1 bg-blue-600 text-white font-bold rounded-full text-sm">
                          {regionInfo.region === 'Bac' ? 'Miền Bắc' :
                           regionInfo.region === 'Trung' ? 'Miền Trung' :
                           regionInfo.region === 'Nam' ? 'Miền Nam' : 'Chưa xác định'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {hasRecommendations ? (
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                    <span className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-xl">
                      🎯
                    </span>
                    Gói bảo hiểm được đề xuất
                  </h2>
                  <p className="text-gray-600 text-base">
                    Dựa trên phân tích AI về khu vực của bạn, chúng tôi khuyến nghị các gói bảo hiểm sau:
                  </p>
                </div>

                <div className="space-y-5">
                  {recommendedPackages.map((pkg, index) => {
                    const colors = getPackageColor(pkg.name)
                    const icon = getPackageIcon(pkg.name)

                    return (
                      <Card
                        key={index}
                        className={`border-2 ${colors.border} hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 animate-in slide-in-from-left`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-5">
                            {/* Icon */}
                            <div className={`${colors.bg} ${colors.text} p-5 rounded-2xl flex-shrink-0 shadow-md`}>
                              {icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="mb-3">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                  {pkg.name}
                                </h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-300 rounded-full">
                                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm font-bold text-orange-700">
                                    Độ ưu tiên: {(pkg.priority * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>

                              <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-gray-700 leading-relaxed">
                                  {pkg.reason}
                                </p>
                              </div>

                              {/* Key Benefits */}
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  <span>Bảo vệ toàn diện</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  <span>Bồi thường nhanh</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  <span>Hỗ trợ 24/7</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  <span>Giá ưu đãi</span>
                                </div>
                              </div>

                              {/* CTA Button */}
                              <Button
                                className={`w-full ${colors.button} text-white font-bold py-6 text-base shadow-lg hover:shadow-xl transition-all`}
                                onClick={() => {
                                  onSelectPackage?.(pkg.name)
                                }}
                              >
                                <span className="flex items-center justify-center gap-2">
                                  🛡️ Đăng ký ngay - Bảo vệ tài sản
                                  <ArrowRight className="w-5 h-5" />
                                </span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Footer CTA */}
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 via-blue-50 to-indigo-50 border-2 border-green-300 rounded-2xl shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        💡 Bảo vệ ngay hôm nay - Yên tâm mọi ngày mai
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        Đừng để thiên tai làm bạn bất ngờ. Đăng ký ngay để được bảo vệ toàn diện!
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <CheckCircle2 className="w-14 h-14 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Khu vực có mức độ rủi ro thấp
                  </h3>
                  <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
                    Dựa trên phân tích, khu vực của bạn có mức độ rủi ro thiên tai thấp.
                  </p>
                  <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base font-semibold shadow-lg">
                    Đóng
                  </Button>
                </div>
              </>
            )}

            {/* Close button at bottom */}
            {hasRecommendations && (
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-gray-600 hover:bg-gray-100 px-8 py-3 text-base font-semibold"
                >
                  Xem sau
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
