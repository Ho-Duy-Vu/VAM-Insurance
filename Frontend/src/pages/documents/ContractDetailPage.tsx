/**
 * Contract Detail Page - Trang chi tiết hợp đồng bảo hiểm
 * Hiển thị đầy đủ thông tin hợp đồng, lịch sử thanh toán, điều khoản
 */

import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '..\/..\/components\/ui/card'
import { Button } from '..\/..\/components\/ui/button'
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
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseInt(amount))
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4 print:hidden">
        <div className="container mx-auto">
          <Button
            onClick={() => navigate('/my-documents')}
            variant="outline"
            className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <FileText className="w-10 h-10" />
                Chi tiết hợp đồng bảo hiểm
              </h1>
              <p className="text-indigo-100 text-lg">
                Hợp đồng #{purchase.policy_number || purchase.id}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadContract}
                disabled={downloading}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
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
                className="bg-white/10 border border-white/20 hover:bg-white/20"
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl ${
                      purchase.package_type === 'TNDS' ? 'bg-blue-100 text-blue-700' :
                      purchase.package_type === 'Sức khỏe' ? 'bg-pink-100 text-pink-700' :
                      purchase.package_type === 'Thiên tai' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    } flex items-center justify-center border-2`}>
                      {getPackageIcon(purchase.package_type)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{purchase.package_name}</h2>
                      <p className="text-gray-600">{purchase.insurance_company || 'VAM Insurance'}</p>
                    </div>
                  </div>
                  {getStatusBadge(purchase.status)}
                </div>
              </CardContent>
            </Card>

            {/* Package Information */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Thông tin gói bảo hiểm
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tên gói bảo hiểm</p>
                    <p className="text-lg font-semibold">{purchase.package_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Loại bảo hiểm</p>
                    <p className="text-lg font-semibold">{purchase.package_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Công ty bảo hiểm</p>
                    <p className="text-lg font-semibold">{purchase.insurance_company || 'VAM Insurance'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số hợp đồng</p>
                    <p className="text-lg font-semibold text-indigo-600">{purchase.policy_number || 'Đang cập nhật'}</p>
                  </div>
                  {purchase.coverage_amount && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Số tiền bảo hiểm</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(purchase.coverage_amount)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Coverage Period */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Thời hạn bảo hiểm
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ngày bắt đầu</p>
                    <p className="text-lg font-semibold">{purchase.start_date || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ngày kết thúc</p>
                    <p className="text-lg font-semibold">{purchase.end_date || 'Chưa xác định'}</p>
                  </div>
                  {purchase.payment_frequency && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Tần suất đóng phí</p>
                      <p className="text-lg font-semibold">{purchase.payment_frequency}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Thông tin người mua bảo hiểm
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Họ và tên
                    </p>
                    <p className="text-lg font-semibold">{purchase.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Số điện thoại
                    </p>
                    <p className="text-lg font-semibold">{purchase.customer_phone}</p>
                  </div>
                  {purchase.customer_email && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </p>
                      <p className="text-lg font-semibold">{purchase.customer_email}</p>
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
            <Card className="border-2 border-indigo-200">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Thông tin thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phí bảo hiểm</p>
                  <p className="text-3xl font-bold text-indigo-600">{formatCurrency(purchase.premium_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phương thức thanh toán</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <p className="text-lg font-semibold">{purchase.payment_method || 'Chưa xác định'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Trạng thái thanh toán</p>
                  {getPaymentStatusBadge(purchase.payment_status)}
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

