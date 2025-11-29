import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, ArrowRight, Star, TrendingUp, Shield, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { insurancePackages, formatPrice } from '../../data/insurancePackages'
import type { InsurancePackage } from '../../types/insurance'

export default function ComparisonPage() {
    // Pre-select 3 featured natural disaster packages for comparison
    const defaultPackages = useMemo(() => {
        const disaster = insurancePackages.filter(pkg => pkg.type === 'natural_disaster')
        return disaster.slice(0, 3).map(pkg => pkg.id)
    }, [])

    const [selectedPackages, setSelectedPackages] = useState<string[]>(defaultPackages)

    const comparedPackages = useMemo(() => {
        return selectedPackages
            .map(id => insurancePackages.find(pkg => pkg.id === id))
            .filter(Boolean) as InsurancePackage[]
    }, [selectedPackages])

    const handlePackageChange = (index: number, packageId: string) => {
        const newSelection = [...selectedPackages]
        newSelection[index] = packageId
        setSelectedPackages(newSelection)
    }

    // Compare features across packages
    const allFeatures = useMemo(() => {
        const features = new Set<string>()
        comparedPackages.forEach(pkg => {
            pkg.benefits.forEach((benefit: string) => features.add(benefit))
        })
        return Array.from(features)
    }, [comparedPackages])

    const getRecommendedIndex = (): number => {
        // Simple logic: Featured + mid-range price
        let bestIndex = 0
        let bestScore = 0

        comparedPackages.forEach((pkg, index) => {
            let score = 0
            if (pkg.featured) score += 10
            if (pkg.benefits.length >= 7) score += 5
            if (pkg.price >= 1500000 && pkg.price <= 3000000) score += 3 // Sweet spot

            if (score > bestScore) {
                bestScore = score
                bestIndex = index
            }
        })

        return bestIndex
    }

    const recommendedIndex = getRecommendedIndex()

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-cyan-50">
            {/* Header */}
            <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-sm font-semibold">So Sánh Thông Minh</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            So Sánh Gói Bảo Hiểm
                        </h1>
                        <p className="text-xl text-blue-100">
                            So sánh chi tiết các gói bảo hiểm để lựa chọn gói phù hợp nhất với bạn
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Package Selectors */}
                <Card className="mb-8 shadow-xl border-0">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-blue-600" />
                            Chọn Gói Bảo Hiểm Để So Sánh
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-4">
                            {[0, 1, 2].map((index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gói #{index + 1}
                                    </label>
                                    <select
                                        value={selectedPackages[index] || ''}
                                        onChange={(e) => handlePackageChange(index, e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 transition-all"
                                    >
                                        <option value="">-- Chọn gói --</option>
                                        {insurancePackages.map((pkg) => (
                                            <option key={pkg.id} value={pkg.id}>
                                                {pkg.shortName} - {formatPrice(pkg.price)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {comparedPackages.length === 0 ? (
                    <div className="text-center py-20">
                        <Shield className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Vui lòng chọn ít nhất 1 gói để bắt đầu so sánh</p>
                    </div>
                ) : (
                    <>
                        {/* Comparison Table */}
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            {comparedPackages.map((pkg, index) => (
                                <Card
                                    key={pkg.id}
                                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${index === recommendedIndex
                                        ? 'border-4 border-yellow-400 shadow-2xl'
                                        : 'border-2 border-gray-200'
                                        }`}
                                >
                                    {/* Recommended Badge */}
                                    {index === recommendedIndex && (
                                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center py-2 text-sm font-bold z-10">
                                            <div className="flex items-center justify-center gap-1">
                                                <Star className="w-4 h-4 fill-white" />
                                                <span>AI KHUYẾN NGHỊ</span>
                                                <Star className="w-4 h-4 fill-white" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Gradient Accent */}
                                    <div
                                        className={`absolute ${index === recommendedIndex ? 'top-9' : 'top-0'
                                            } left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600`}
                                    ></div>

                                    <CardHeader className={`${index === recommendedIndex ? 'pt-14' : 'pt-8'} pb-6 bg-gradient-to-br from-blue-50 to-cyan-50`}>
                                        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                                            {pkg.shortName}
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>

                                        {/* Price */}
                                        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-blue-100">
                                            <div className="text-3xl font-bold text-blue-700">
                                                {formatPrice(pkg.price)}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                Bảo hiểm: <span className="font-bold text-blue-600">{pkg.coverage}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{pkg.period}</div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-6">
                                        {/* Benefits */}
                                        <div className="space-y-3 mb-6">
                                            <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-600" />
                                                Quyền lợi:
                                            </h4>
                                            {allFeatures.map((feature, idx) => {
                                                const hasFeature = pkg.benefits.includes(feature)
                                                return (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        {hasFeature ? (
                                                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                        ) : (
                                                            <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                                                        )}
                                                        <span
                                                            className={`text-sm ${hasFeature ? 'text-gray-700' : 'text-gray-400 line-through'
                                                                }`}
                                                        >
                                                            {feature}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* CTA */}
                                        <div className="space-y-2">
                                            <Link to={`/natural-disaster/${pkg.id}`}>
                                                <Button
                                                    className={`w-full font-bold shadow-lg hover:shadow-xl transition-all group ${index === recommendedIndex
                                                        ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 hover:from-yellow-600 hover:via-orange-600 hover:to-yellow-700'
                                                        : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-700'
                                                        }`}
                                                >
                                                    <span>Xem Chi Tiết</span>
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                            <Link to={`/natural-disaster/application?package=${pkg.id}`}>
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold"
                                                >
                                                    Đăng Ký Ngay
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Comparison Tips */}
                        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Info className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                                            💡 Gợi Ý Chọn Gói Bảo Hiểm
                                        </h3>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    <strong>Gói Cơ Bản:</strong> Phù hợp nếu bạn cần bảo vệ cơ bản với chi phí thấp
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    <strong>Gói Tiêu Chuẩn:</strong> Được AI khuyến nghị - Cân bằng tốt giữa chi phí và quyền lợi
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span>
                                                    <strong>Gói Cao Cấp:</strong> Bảo vệ toàn diện, phù hợp với tài sản giá trị cao
                                                </span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Star className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5 fill-yellow-600" />
                                                <span>
                                                    Gói được đánh dấu <strong>"AI KHUYẾN NGHỊ"</strong> là lựa chọn tối ưu dựa trên phân tích của  hệ thống
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    )
}
