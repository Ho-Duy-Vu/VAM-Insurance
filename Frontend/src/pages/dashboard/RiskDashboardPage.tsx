import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import {
    TrendingUp, TrendingDown, AlertTriangle, Shield, MapPin, Calendar,
    ThermometerSun, Droplets, Wind, AlertCircle, CheckCircle, ArrowRight, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

export default function RiskDashboardPage() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '1y'>('30d')

    // Mock user data - in real app, fetch from API
    const userData = {
        name: 'Nguyễn Văn A',
        hometown: 'Hà Tĩnh',
        region: 'Miền Trung',
        currentRiskScore: 7.2, // out of 10
        trend: 'increasing', // increasing, decreasing, stable
        lastUpdated: '2025-11-28'
    }

    // Risk score timeline (12 months)
    const riskTimeline = [
        { month: 'T1', score: 3.2, incidents: 0 },
        { month: 'T2', score: 3.5, incidents: 0 },
        { month: 'T3', score: 4.1, incidents: 1 },
        { month: 'T4', score: 5.2, incidents: 2 },
        { month: 'T5', score: 6.8, incidents: 3 },
        { month: 'T6', score: 7.5, incidents: 5 },
        { month: 'T7', score: 8.2, incidents: 7 },
        { month: 'T8', score: 8.9, incidents: 8 },
        { month: 'T9', score: 7.8, incidents: 6 },
        { month: 'T10', score: 8.1, incidents: 7 },
        { month: 'T11', score: 7.2, incidents: 4 },
        { month: 'T12', score: 6.5, incidents: 3 }
    ]

    // Regional comparison
    const regionalComparison = [
        { region: 'Hà Tĩnh\n(Bạn)', risk: 7.2, color: '#ef4444' },
        { region: 'Nghệ An', risk: 7.8, color: '#f59e0b' },
        { region: 'Quảng Bình', risk: 8.1, color: '#f59e0b' },
        { region: 'Quảng Trị', risk: 8.5, color: '#dc2626' },
        { region: 'Hà Nội', risk: 4.2, color: '#22c55e' },
        { region: 'TP.HCM', risk: 2.8, color: '#22c55e' }
    ]

    // 7-day forecast
    const weekForecast = [
        { day: 'T2', risk: 7.2, weather: '🌧️', temp: 24 },
        { day: 'T3', risk: 7.5, weather: '🌧️', temp: 23 },
        { day: 'T4', risk: 8.1, weather: '⛈️', temp: 22 },
        { day: 'T5', risk: 8.8, weather: '⛈️', temp: 21 },
        { day: 'T6', risk: 7.9, weather: '🌧️', temp: 23 },
        { day: 'T7', risk: 6.5, weather: '🌥️', temp: 25 },
        { day: 'CN', risk: 5.2, weather: '☀️', temp: 27 }
    ]

    // Risk factors breakdown
    const riskFactors = [
        { factor: 'Lũ lụt', value: 8.5, fullMark: 10 },
        { factor: 'Bão', value: 7.2, fullMark: 10 },
        { factor: 'Mưa lớn', value: 7.8, fullMark: 10 },
        { factor: 'Sạt lở', value: 6.2, fullMark: 10 },
        { factor: 'Ngập úng', value: 8.0, fullMark: 10 }
    ]

    const getRiskColor = (score: number) => {
        if (score >= 8) return 'text-red-600 bg-red-50'
        if (score >= 6) return 'text-orange-600 bg-orange-50'
        if (score >= 4) return 'text-yellow-600 bg-yellow-50'
        return 'text-green-600 bg-green-50'
    }

    const getRiskLabel = (score: number) => {
        if (score >= 8) return 'Rất cao'
        if (score >= 6) return 'Cao'
        if (score >= 4) return 'Trung bình'
        return 'Thấp'
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
            {/* Header */}
            <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-8 h-8" />
                                <h1 className="text-3xl md:text-4xl font-bold">Dashboard Rủi Ro</h1>
                            </div>
                            <p className="text-blue-100">
                                Phân tích rủi ro thiên tai cá nhân hóa cho {userData.hometown}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-blue-200">Cập nhật lần cuối</div>
                            <div className="font-semibold">{userData.lastUpdated}</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                {/* Risk Score Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {/* Main Risk Score */}
                    <Card className="md:col-span-2 border-2 border-blue-200 shadow-xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                                Điểm Rủi Ro Hiện Tại
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-4">
                                <div className={`text-6xl font-bold ${getRiskColor(userData.currentRiskScore).split(' ')[0]}`}>
                                    {userData.currentRiskScore}
                                    <span className="text-2xl text-gray-400">/10</span>
                                </div>
                                <div className="mb-2">
                                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(userData.currentRiskScore)}`}>
                                        {userData.trend === 'increasing' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        {getRiskLabel(userData.currentRiskScore)}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2">
                                        {userData.trend === 'increasing' ? '↑ Tăng 0.9 điểm so với tháng trước' : '↓ Giảm 0.5 điểm'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Info */}
                    <Card className="shadow-lg">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Khu Vực
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{userData.hometown}</div>
                            <div className="text-sm text-gray-600">{userData.region}</div>
                            <div className="mt-3 text-xs text-blue-600 font-semibold">
                                Vùng nguy cơ cao
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Alerts */}
                    <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                Cảnh Báo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">3</div>
                            <div className="text-sm text-gray-700 mt-1">Cảnh báo đang hoạt động</div>
                            <Link to="/notifications">
                                <Button variant="link" className="px-0 h-auto text-orange-600 mt-2">
                                    Xem chi tiết →
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Risk Timeline */}
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                Biến Động Rủi Ro 12 Tháng
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={riskTimeline}>
                                    <defs>
                                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRisk)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div className="text-sm text-blue-900">
                                    📈 <strong>Xu hướng:</strong> Rủi ro tăng cao trong mùa mưa bão (T5-T10)
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Regional Comparison */}
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-cyan-600" />
                                So Sánh Với Vùng Lân Cận
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={regionalComparison}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="region" style={{ fontSize: '12px' }} />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Bar dataKey="risk" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-4 p-3 bg-cyan-50 rounded-lg">
                                <div className="text-sm text-cyan-900">
                                    📊 Mức độ rủi ro trung bình của {userData.hometown}: <strong>7.2/10</strong>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* 7-Day Forecast */}
                    <Card className="lg:col-span-2 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                Dự Báo Rủi Ro 7 Ngày Tới
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={weekForecast}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="risk"
                                        stroke="#a855f7"
                                        strokeWidth={3}
                                        dot={{ fill: '#a855f7', r: 6 }}
                                        name="Điểm rủi ro"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-7 gap-2 mt-4">
                                {weekForecast.map((day, idx) => (
                                    <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                                        <div className="text-xs font-semibold text-gray-600">{day.day}</div>
                                        <div className="text-2xl my-1">{day.weather}</div>
                                        <div className="text-xs text-gray-500">{day.temp}°C</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-red-50 rounded-lg border-2 border-red-200">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-red-900">
                                        <strong>Cảnh báo:</strong> Rủi ro cao nhất vào T5 (8.8/10) - Dự báo mưa lớn và gió mạnh
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Factors Radar */}
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Wind className="w-5 h-5 text-indigo-600" />
                                Phân Tích Yếu Tố
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <RadarChart data={riskFactors}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="factor" style={{ fontSize: '11px' }} />
                                    <PolarRadiusAxis domain={[0, 10]} />
                                    <Radar name="Mức độ rủi ro" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                </RadarChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Yếu tố cao nhất:</span>
                                    <span className="font-bold text-red-600">Lũ lụt (8.5)</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Yếu tố thấp nhất:</span>
                                    <span className="font-bold text-yellow-600">Sạt lở (6.2)</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Recommendations */}
                <Card className="shadow-2xl border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
                    <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 border-b-2 border-yellow-400">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Shield className="w-6 h-6 text-yellow-700" />
                            🤖 Khuyến Nghị Từ AI
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900 mb-2">
                                        ⚠️ Mức độ rủi ro của bạn đang ở mức CAO (7.2/10)
                                    </h4>
                                    <p className="text-gray-700 mb-3">
                                        Dựa trên phân tích quê quán <strong>{userData.hometown}</strong> và dự báo 7 ngày tới,
                                        chúng tôi phát hiện nguy cơ lũ lụt và ngập úng rất cao trong tuần này.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-5 shadow-md border-2 border-orange-200">
                                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Bạn nên mua thêm các gói bảo hiểm sau:
                                </h5>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div>
                                            <div className="font-semibold text-gray-900">Bảo Hiểm Thiệt Hại Do Ngập Lụt</div>
                                            <div className="text-sm text-gray-600">Bảo vệ tối đa 500 triệu</div>
                                        </div>
                                        <Link to="/natural-disaster/flood-basic">
                                            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                                                <span>Xem gói</span>
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                                        <div>
                                            <div className="font-semibold text-gray-900">Bảo Hiểm Phương Tiện Thiên Tai</div>
                                            <div className="text-sm text-gray-600">Bảo vệ xe khỏi ngập nước</div>
                                        </div>
                                        <Link to="/natural-disaster/disaster-vehicle">
                                            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
                                                <span>Xem gói</span>
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-3 border-t border-orange-200">
                                <div className="flex-1 text-sm text-gray-600">
                                    💡 <strong>Lời khuyên:</strong> Hãy chuẩn bị kế hoạch sơ tán và dự trữ lương thực cho 3-5 ngày
                                </div>
                                <Link to="/products">
                                    <Button variant="outline" className="border-2 border-orange-400 text-orange-700 hover:bg-orange-50">
                                        Xem tất cả gói
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
