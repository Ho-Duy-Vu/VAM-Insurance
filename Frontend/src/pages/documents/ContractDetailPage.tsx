/**
 * Contract Detail Page - Trang chi tiết hợp đồng bảo hiểm
 * Hiển thị đầy đủ thông tin hợp đồng, lịch sử thanh toán, điều khoản
 */

import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { 
  FileText, 
  Download, 
  Printer,
  ArrowLeft,
  CheckCircle,
  Shield,
  Calendar,
  DollarSign,
  CreditCard,
  Car,
  Home,
  Heart,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Clock
} from 'lucide-react'

interface InsurancePurchase {
  id: number
  package_name: string
  package_type: string
  insurance_company: string | null
  customer_name: string
  customer_phone: string
  customer_email: string | null
  coverage_amount: string | null
  premium_amount: string
  payment_frequency: string | null
  start_date: string | null
  end_date: string | null
  vehicle_type: string | null
  license_plate: string | null
  payment_method: string | null
  payment_status: string
  policy_number: string | null
  status: string
  created_at: string
  updated_at: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PACKAGE_TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  'TNDS': Car,
  'Sức khỏe': Heart,
  'Thiên tai': Home,
  'Nhà cửa': Home,
  'Xe cộ': Car,
  'default': Shield
}

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const [purchase, setPurchase] = useState<InsurancePurchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    // Try to get purchase from navigation state first
    if (location.state?.purchase) {
      setPurchase(location.state.purchase)
      setLoading(false)
      return
    }

    // Otherwise, fetch from API
    const fetchPurchaseDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8000/insurance-purchases/${id}`)
        
        if (!response.ok) {
          throw new Error('Không thể tải thông tin hợp đồng')
        }
        
        const data = await response.json()
        setPurchase(data)
      } catch (error) {
        console.error('Error loading purchase detail:', error)
        alert('Không thể tải thông tin hợp đồng. Vui lòng thử lại sau.')
        navigate('/my-documents')
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseDetail()
  }, [id, location.state, navigate])

  const handleDownloadContract = async () => {
    if (!purchase) return
    
    try {
      setDownloading(true)
      
      const response = await fetch(`http://localhost:8000/insurance-purchases/${purchase.id}/download-contract`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf'
        }
      })
      
      if (!response.ok) {
        throw new Error('Không thể tải hợp đồng')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `HopDong_${purchase.policy_number || purchase.id}_${purchase.customer_name}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('✅ Đã tải hợp đồng thành công')
    } catch (error) {
      console.error('❌ Lỗi tải hợp đồng:', error)
      alert('Không thể tải hợp đồng. Vui lòng thử lại sau.')
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (amount: string) => {
    // If amount already contains VND or formatting, return as-is
    if (amount && (amount.includes('VNĐ') || amount.includes('VND') || amount.includes('/'))) {
      return amount
    }
    
    // Otherwise, format as currency
    try {
      const numAmount = parseInt(amount.replace(/\D/g, ''))
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(numAmount)
    } catch {
      return amount
    }
  }

  const getPackageIcon = (packageType: string) => {
    const Icon = PACKAGE_TYPE_ICONS[packageType] || PACKAGE_TYPE_ICONS['default']
    return <Icon className="w-6 h-6" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 border border-green-200 font-semibold">
            <CheckCircle className="w-5 h-5" />
            Đang hiệu lực
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 font-semibold">
            <Clock className="w-5 h-5" />
            Chờ xử lý
          </span>
        )
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-semibold">
            <AlertCircle className="w-5 h-5" />
            Hết hạn
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 border border-red-200 font-semibold">
            <AlertCircle className="w-5 h-5" />
            Đã hủy
          </span>
        )
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Đã thanh toán
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 text-sm font-medium">
            <Clock className="w-4 h-4" />
            Chờ thanh toán
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            Thất bại
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin hợp đồng...</p>
        </div>
      </div>
    )
  }

  if (!purchase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy hợp đồng</h2>
            <p className="text-gray-600 mb-6">Hợp đồng này không tồn tại hoặc đã bị xóa.</p>
            <Button onClick={() => navigate('/my-documents')} className="bg-indigo-600 hover:bg-indigo-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-12 px-4 print:hidden overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <Button
            onClick={() => navigate('/my-documents')}
            variant="outline"
            className="mb-6 bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl border-4 border-white/40 flex items-center justify-center shadow-2xl">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
                    Chi tiết hợp đồng bảo hiểm
                  </h1>
                  <p className="text-blue-100 text-lg font-medium">
                    Hợp đồng #{purchase.policy_number || purchase.id}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadContract}
                disabled={downloading}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 font-bold border-0 shadow-xl"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Tải PDF
                  </>
                )}
              </Button>
              <Button
                onClick={handlePrint}
                className="bg-white/10 border-2 border-white/30 hover:bg-white/20 backdrop-blur-sm text-white font-semibold"
              >
                <Printer className="w-4 h-4 mr-2" />
                In hợp đồng
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="border-2 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl ${
                      purchase.package_type === 'TNDS' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' :
                      purchase.package_type === 'Sức khỏe' ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white' :
                      purchase.package_type === 'Thiên tai' ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' :
                      'bg-gradient-to-br from-green-500 to-green-600 text-white'
                    } flex items-center justify-center border-4 border-white shadow-xl`}>
                      {getPackageIcon(purchase.package_type)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{purchase.package_name}</h2>
                      <p className="text-gray-700 font-semibold text-lg">{purchase.insurance_company || 'VAM Insurance'}</p>
                    </div>
                  </div>
                  {getStatusBadge(purchase.status)}
                </div>
              </div>
            </Card>

            {/* Package Information */}
            <Card className="border-2 rounded-2xl shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-900">Thông tin gói bảo hiểm</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-semibold">Tên gói bảo hiểm</p>
                    <p className="text-lg font-bold text-gray-900">{purchase.package_name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-semibold">Loại bảo hiểm</p>
                    <p className="text-lg font-bold text-gray-900">{purchase.package_type}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-semibold">Công ty bảo hiểm</p>
                    <p className="text-lg font-bold text-gray-900">{purchase.insurance_company || 'VAM Insurance'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-semibold">Số hợp đồng</p>
                    <p className="text-lg font-bold text-indigo-600">{purchase.policy_number || 'Đang cập nhật'}</p>
                  </div>
                  {purchase.coverage_amount && (
                    <div className="md:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                      <p className="text-sm text-gray-700 font-semibold mb-2">Số tiền bảo hiểm tối đa</p>
                      <p className="text-3xl font-bold text-green-700">{formatCurrency(purchase.coverage_amount)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Coverage Period */}
            <Card className="border-2 rounded-2xl shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b-2">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-900">Thời hạn bảo hiểm</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-semibold">Ngày bắt đầu</p>
                    <p className="text-lg font-bold text-gray-900">{purchase.start_date || 'Chưa xác định'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-semibold">Ngày kết thúc</p>
                    <p className="text-lg font-bold text-gray-900">{purchase.end_date || 'Chưa xác định'}</p>
                  </div>
                  {purchase.payment_frequency && (
                    <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-700 font-semibold mb-1">Tần suất đóng phí</p>
                      <p className="text-lg font-bold text-blue-700">{purchase.payment_frequency}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="border-2 rounded-2xl shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-900">Thông tin người mua bảo hiểm</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      Họ và tên
                    </p>
                    <p className="text-lg font-bold text-gray-900">{purchase.customer_name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-600" />
                      Số điện thoại
                    </p>
                    <p className="text-lg font-bold text-gray-900">{purchase.customer_phone}</p>
                  </div>
                  {purchase.customer_email && (
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-sm text-gray-600 font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4 text-purple-600" />
                        Email
                      </p>
                      <p className="text-lg font-bold text-gray-900">{purchase.customer_email}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information (if applicable) */}
            {purchase.vehicle_type && (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-indigo-600" />
                    Thông tin phương tiện
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Loại xe</p>
                      <p className="text-lg font-semibold">{purchase.vehicle_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Biển số xe</p>
                      <p className="text-lg font-semibold text-indigo-600">{purchase.license_plate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Payment Information */}
            <Card className="border-4 border-green-200 rounded-2xl shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white border-b-4 border-green-300">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border-2 border-white/40">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <span className="drop-shadow-lg">Thông tin thanh toán</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                  <p className="text-sm text-gray-700 font-semibold mb-2">Phí bảo hiểm</p>
                  <p className="text-4xl font-bold text-green-700">{formatCurrency(purchase.premium_amount)}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 font-semibold">Phương thức thanh toán</p>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-gray-200">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    <p className="text-lg font-bold text-gray-900">{purchase.payment_method || 'Chưa xác định'}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 font-semibold">Trạng thái thanh toán</p>
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                    {getPaymentStatusBadge(purchase.payment_status)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Thông tin quan trọng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ngày tạo hợp đồng</p>
                  <p className="font-semibold">{new Date(purchase.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Cập nhật lần cuối</p>
                  <p className="font-semibold">{new Date(purchase.updated_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">Hỗ trợ khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Hotline</p>
                    <p className="font-bold text-indigo-600">1900 xxxx</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-bold text-indigo-600">support@vam.vn</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Văn phòng</p>
                    <p className="font-semibold">TP. Hồ Chí Minh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

