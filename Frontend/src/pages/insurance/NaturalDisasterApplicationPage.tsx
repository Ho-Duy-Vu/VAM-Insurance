import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  Home,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Upload,
  Shield,
  Camera,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useInsuranceStore } from '../../store/insurance'
import { getPackageById, formatPrice } from '../../data/insurancePackages'
import type { NaturalDisasterInsuranceApplication } from '../../types/insurance'
import { documentApi } from '../../api/client'

export default function NaturalDisasterApplicationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const packageId = searchParams.get('package')
  
  const { extractedData, setApplicationData, setCurrentStep, setSelectedPackage } = useInsuranceStore()
  
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<NaturalDisasterInsuranceApplication>({
    chu_tai_san: {
      loai_chu_the: 'Ca_nhan',
      thong_tin_ca_nhan: {
        ho_ten: '',
        ngay_sinh: '',
        gioi_tinh: 'Nam',
        giay_to: {
          loai: 'CCCD',
          so: '',
          ngay_cap: '',
          noi_cap: ''
        },
        quoc_tich: 'Việt Nam',
        nghe_nghiep: '',
        noi_lam_viec: ''
      },
      thong_tin_lien_he: {
        dia_chi_thuong_tru: '',
        dia_chi_lien_lac: '',
        sdt: '',
        email: ''
      }
    },
    thong_tin_tai_san: {
      loai_tai_san: 'Nha_o',
      dia_chi_tai_san: '',
      dien_tich: '',
      gia_tri_uoc_tinh: '',
      nam_xay_dung: '',
      kieu_nha: '',
      vat_lieu_xay_dung: '',
      so_tang: '1',
      tinh_trang_hien_tai: 'Tốt'
    },
    goi_bao_hiem: {
      loai_bao_hiem: 'Ngap_lut',
      muc_bao_hiem: '500000000',
      thoi_han_tu: '',
      thoi_han_den: '',
      phi_bao_hiem: ''
    },
    danh_sach_tai_san_chi_tiet: [],
    lich_su_thiet_hai: {
      da_gap_thien_tai: 'Khong'
    },
    phuong_thuc_thanh_toan: {
      phuong_thuc: 'Chuyen_khoan'
    }
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionStatus, setExtractionStatus] = useState<string>('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const packageData = packageId ? getPackageById(packageId) : null

  useEffect(() => {
    if (!packageData) {
      navigate('/products')
      return
    }

    setSelectedPackage(packageData)
    
    // Set insurance type based on package
    let insuranceType: 'Ngap_lut' | 'Bao' | 'Phuong_tien_thien_tai' | 'Toan_dien' = 'Ngap_lut'
    if (packageData.id.includes('flood')) insuranceType = 'Ngap_lut'
    else if (packageData.id.includes('storm')) insuranceType = 'Bao'
    else if (packageData.id.includes('vehicle')) insuranceType = 'Phuong_tien_thien_tai'
    
    setFormData(prev => ({
      ...prev,
      goi_bao_hiem: {
        ...prev.goi_bao_hiem,
        loai_bao_hiem: insuranceType,
        muc_bao_hiem: packageData.coverage.replace(/[^\d]/g, '') || '500000000',
        phi_bao_hiem: packageData.price.toString()
      }
    }))

    // Auto-fill from extracted data
    if (extractedData) {
      setFormData(prev => ({
        ...prev,
        chu_tai_san: {
          ...prev.chu_tai_san,
          thong_tin_ca_nhan: {
            ...prev.chu_tai_san.thong_tin_ca_nhan,
            ho_ten: (extractedData.fullName as string) || '',
            ngay_sinh: (extractedData.dateOfBirth as string) || '',
            gioi_tinh: (extractedData.gender as 'Nam' | 'Nu' | 'Khac') || 'Nam',
            giay_to: {
              ...prev.chu_tai_san.thong_tin_ca_nhan.giay_to,
              so: (extractedData.idNumber as string) || '',
              noi_cap: (extractedData.placeOfOrigin as string) || ''
            }
          },
          thong_tin_lien_he: {
            ...prev.chu_tai_san.thong_tin_lien_he,
            dia_chi_thuong_tru: (extractedData.address as string) || '',
            dia_chi_lien_lac: (extractedData.address as string) || '',
            sdt: (extractedData.phone as string) || '',
            email: (extractedData.email as string) || ''
          }
        },
        thong_tin_tai_san: {
          ...prev.thong_tin_tai_san,
          dia_chi_tai_san: (extractedData.address as string) || ''
        }
      }))
    }
  }, [packageData, extractedData, navigate, packageId, setSelectedPackage])

  if (!packageData) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setUploadedDocuments([file])
    setIsExtracting(true)
    setExtractionStatus('Đang tải lên và phân tích tài liệu...')
    setUploadProgress(0)

    try {
      console.log(`📤 Uploading document for Natural Disaster Insurance: ${file.name}`)
      
      // Step 1: Upload document to backend
      setUploadProgress(30)
      const result = await documentApi.uploadDocument(file)
      console.log(`✅ Upload success:`, result)
      
      setUploadProgress(60)
      setExtractionStatus('Đang trích xuất thông tin bằng AI...')
      
      // Step 2: Extract person info using AI
      const extractedInfo = await documentApi.extractPersonInfo(result.document_id)
      console.log(`✅ Person info extracted:`, extractedInfo)
      
      setUploadProgress(100)
      setExtractionStatus('✅ Trích xuất thành công!')

      // Step 3: Auto-fill form with extracted data
      if (extractedInfo && extractedInfo.fullName) {
        setFormData(prev => ({
          ...prev,
          chu_tai_san: {
            ...prev.chu_tai_san,
            thong_tin_ca_nhan: {
              ...prev.chu_tai_san.thong_tin_ca_nhan,
              ho_ten: extractedInfo.fullName || '',
              ngay_sinh: extractedInfo.dateOfBirth || '',
              gioi_tinh: extractedInfo.gender === 'Nữ' ? 'Nu' : extractedInfo.gender === 'Khác' ? 'Khac' : 'Nam',
              giay_to: {
                ...prev.chu_tai_san.thong_tin_ca_nhan.giay_to,
                loai: extractedInfo.documentType === 'CCCD' ? 'CCCD' : 
                     extractedInfo.documentType === 'CMND' ? 'CMND' : 'Ho_chieu',
                so: extractedInfo.idNumber || '',
                ngay_cap: extractedInfo.issueDate || '',
                noi_cap: extractedInfo.placeOfOrigin || ''
              },
              quoc_tich: extractedInfo.nationality || 'Việt Nam'
            },
            thong_tin_lien_he: {
              ...prev.chu_tai_san.thong_tin_lien_he,
              dia_chi_thuong_tru: extractedInfo.address || '',
              dia_chi_lien_lac: extractedInfo.address || '',
              sdt: extractedInfo.phone || '',
              email: extractedInfo.email || ''
            }
          }
        }))
        
        console.log('✅ Form auto-filled with AI extracted data')
      }

      setTimeout(() => {
        setExtractionStatus('')
        setUploadProgress(0)
      }, 3000)
    } catch (error) {
      console.error('❌ Error uploading/extracting document:', error)
      setExtractionStatus('❌ Lỗi khi xử lý tài liệu. Vui lòng nhập thủ công hoặc thử lại.')
      setTimeout(() => {
        setExtractionStatus('')
        setUploadProgress(0)
      }, 5000)
    } finally {
      setIsExtracting(false)
    }
  }

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const sections = [
    { id: 0, title: 'Thông tin chủ tài sản', icon: User },
    { id: 1, title: 'Thông tin tài sản', icon: Home },
    { id: 2, title: 'Gói bảo hiểm', icon: Shield },
    { id: 3, title: 'Hình ảnh & Xác nhận', icon: Camera }
  ]

  const validateCurrentSection = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (currentSection === 0) {
      if (!formData.chu_tai_san.thong_tin_ca_nhan.ho_ten) {
        newErrors.ho_ten = 'Vui lòng nhập họ tên'
      }
      if (!formData.chu_tai_san.thong_tin_ca_nhan.giay_to.so) {
        newErrors.so_giay_to = 'Vui lòng nhập số CCCD'
      }
      if (!formData.chu_tai_san.thong_tin_lien_he.sdt) {
        newErrors.sdt = 'Vui lòng nhập số điện thoại'
      }
      if (!formData.chu_tai_san.thong_tin_lien_he.email) {
        newErrors.email = 'Vui lòng nhập email'
      }
    } else if (currentSection === 1) {
      if (!formData.thong_tin_tai_san.dia_chi_tai_san) {
        newErrors.dia_chi_tai_san = 'Vui lòng nhập địa chỉ tài sản'
      }
      if (!formData.thong_tin_tai_san.gia_tri_uoc_tinh) {
        newErrors.gia_tri = 'Vui lòng nhập giá trị ước tính'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentSection()) {
      setCurrentSection(prev => Math.min(prev + 1, sections.length - 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setCurrentSection(prev => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!validateCurrentSection()) {
      return
    }

    setIsSubmitting(true)
    try {
      // Calculate dates
      const today = new Date()
      const oneYearLater = new Date(today)
      oneYearLater.setFullYear(today.getFullYear() + 1)

      const finalData = {
        ...formData,
        goi_bao_hiem: {
          ...formData.goi_bao_hiem,
          thoi_han_tu: today.toISOString().split('T')[0],
          thoi_han_den: oneYearLater.toISOString().split('T')[0]
        }
      }

      setApplicationData(finalData as unknown as typeof formData)
      setCurrentStep('payment')
      navigate('/insurance/payment')
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-cyan-950/20">
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header with Hero Design */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Quay lại
          </Button>
          
          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-8 shadow-2xl mb-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Bảo hiểm thiên tai</span>
                  </div>
                  <h1 className="text-4xl font-bold mb-3 text-white drop-shadow-lg">
                    Đơn Đăng Ký Bảo Hiểm Thiên Tai
                  </h1>
                  <p className="text-blue-50 text-lg max-w-2xl">
                    Hoàn tất thông tin dưới đây để hoàn thiện hồ sơ đăng ký bảo hiểm của bạn
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Package Info Card */}
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Gói đã chọn</p>
                    <h3 className="text-xl font-bold text-white">{packageData.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-100 mb-1">Phí bảo hiểm</p>
                    <p className="text-2xl font-bold text-white">{formatPrice(packageData.price)}</p>
                    <p className="text-xs text-blue-100">/{packageData.period}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Steps */}
        <div className="mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              {sections.map((section, idx) => {
                const Icon = section.icon
                const isActive = idx === currentSection
                const isCompleted = idx < currentSection
                
                return (
                  <React.Fragment key={section.id}>
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-semibold transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white scale-110 shadow-xl shadow-blue-500/50'
                            : isCompleted
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-7 h-7" />
                        ) : (
                          <Icon className={`w-7 h-7 ${isActive ? 'animate-pulse' : ''}`} />
                        )}
                      </div>
                      <p className={`mt-3 text-sm font-semibold text-center transition-colors ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : isCompleted 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-500'
                      }`}>
                        {section.title}
                      </p>
                      {isActive && (
                        <div className="mt-2 w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                      )}
                    </div>
                    {idx < sections.length - 1 && (
                      <div className="flex-1 h-1.5 mx-3 rounded-full relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <div 
                          className={`absolute inset-0 transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 w-full' 
                              : 'w-0'
                          }`} 
                        />
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          {currentSection === 0 && (
            <div className="animate-fadeIn">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-b">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span>Thông Tin Chủ Tài Sản</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* AI Document Upload Section - Enhanced */}
                <div className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-blue-950/30 p-8 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 rounded-full -ml-12 -mb-12" />
                  
                  <div className="relative z-10 flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 animate-pulse">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold">🤖 AI Tự Động Điền Thông Tin</h3>
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold rounded-full shadow-lg">
                          Khuyên dùng
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        Upload CCCD/CMND của bạn và để AI làm phần còn lại! Hệ thống sẽ tự động trích xuất 
                        và điền tất cả thông tin vào form trong vài giây.
                      </p>
                      
                      <div className="space-y-5">
                        <div>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleDocumentUpload}
                            className="hidden"
                            id="document-upload"
                            disabled={isExtracting}
                          />
                          <label
                            htmlFor="document-upload"
                            className={`group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden ${
                              isExtracting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
                            }`}
                          >
                            {/* Shimmer Effect */}
                            {!isExtracting && (
                              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            )}
                            
                            <Upload className={`w-5 h-5 relative z-10 ${isExtracting ? 'animate-bounce' : ''}`} />
                            <span className="relative z-10 font-semibold">
                              {isExtracting ? 'Đang xử lý...' : 'Chọn tài liệu (CCCD/CMND/PDF)'}
                            </span>
                          </label>
                        </div>

                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="space-y-3 animate-fadeIn">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">Đang xử lý tài liệu...</span>
                              </div>
                              <span className="font-bold text-blue-600">{uploadProgress}%</span>
                            </div>
                            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                              <div
                                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_100%] animate-shimmer transition-all duration-300 rounded-full shadow-lg"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {extractionStatus && (
                          <div className={`flex items-center gap-3 p-4 rounded-xl border-2 animate-fadeIn ${
                            extractionStatus.includes('✅') 
                              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                              : extractionStatus.includes('❌')
                              ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                              : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                          }`}>
                            {extractionStatus.includes('Đang') && (
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            )}
                            <span className="font-semibold flex-1">{extractionStatus}</span>
                          </div>
                        )}

                        {uploadedDocuments.length > 0 && (
                          <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-lg animate-fadeIn">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white truncate">{uploadedDocuments[0].name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {(uploadedDocuments[0].size / 1024).toFixed(2)} KB • Đã xử lý thành công
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(0)}
                              className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border-l-4 border-yellow-400">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 text-2xl">💡</div>
                          <div>
                            <p className="font-semibold text-yellow-900 dark:text-yellow-400 mb-2">Mẹo để AI trích xuất chính xác:</p>
                            <ul className="text-sm text-yellow-800 dark:text-yellow-500 space-y-1">
                              <li>✓ Chụp ảnh rõ nét, đủ sáng, không bị mờ hoặc lóa</li>
                              <li>✓ Đảm bảo toàn bộ tài liệu nằm trong khung hình</li>
                              <li>✓ Hỗ trợ: JPG, PNG, PDF (tối đa 10MB)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-500 rounded-full shadow-sm">
                      Hoặc nhập thủ công
                    </span>
                  </div>
                </div>

                {/* Personal Info - Enhanced */}
                <div>
                  <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    Thông tin cá nhân
                  </h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.chu_tai_san.thong_tin_ca_nhan.ho_ten}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chu_tai_san: {
                            ...prev.chu_tai_san,
                            thong_tin_ca_nhan: {
                              ...prev.chu_tai_san.thong_tin_ca_nhan,
                              ho_ten: e.target.value
                            }
                          }
                        }))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all ${
                          errors.ho_ten ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 group-hover:border-blue-300'
                        }`}
                        placeholder="Nguyễn Văn A"
                      />
                      {errors.ho_ten && (
                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.ho_ten}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={formData.chu_tai_san.thong_tin_ca_nhan.ngay_sinh}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chu_tai_san: {
                            ...prev.chu_tai_san,
                            thong_tin_ca_nhan: {
                              ...prev.chu_tai_san.thong_tin_ca_nhan,
                              ngay_sinh: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Giới tính
                      </label>
                      <select
                        value={formData.chu_tai_san.thong_tin_ca_nhan.gioi_tinh}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chu_tai_san: {
                            ...prev.chu_tai_san,
                            thong_tin_ca_nhan: {
                              ...prev.chu_tai_san.thong_tin_ca_nhan,
                              gioi_tinh: e.target.value as 'Nam' | 'Nu' | 'Khac'
                            }
                          }
                        }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nu">Nữ</option>
                        <option value="Khac">Khác</option>
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Số CCCD/CMND <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.chu_tai_san.thong_tin_ca_nhan.giay_to.so}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chu_tai_san: {
                            ...prev.chu_tai_san,
                            thong_tin_ca_nhan: {
                              ...prev.chu_tai_san.thong_tin_ca_nhan,
                              giay_to: {
                                ...prev.chu_tai_san.thong_tin_ca_nhan.giay_to,
                                so: e.target.value
                              }
                            }
                          }
                        }))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all ${
                          errors.so_giay_to ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 group-hover:border-blue-300'
                        }`}
                        placeholder="001234567890"
                      />
                      {errors.so_giay_to && (
                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.so_giay_to}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Nghề nghiệp
                      </label>
                      <input
                        type="text"
                        value={formData.chu_tai_san.thong_tin_ca_nhan.nghe_nghiep}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chu_tai_san: {
                            ...prev.chu_tai_san,
                            thong_tin_ca_nhan: {
                              ...prev.chu_tai_san.thong_tin_ca_nhan,
                              nghe_nghiep: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                        placeholder="Kỹ sư"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Nơi làm việc
                      </label>
                      <input
                        type="text"
                        value={formData.chu_tai_san.thong_tin_ca_nhan.noi_lam_viec}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chu_tai_san: {
                            ...prev.chu_tai_san,
                            thong_tin_ca_nhan: {
                              ...prev.chu_tai_san.thong_tin_ca_nhan,
                              noi_lam_viec: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                        placeholder="Công ty ABC"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info - Enhanced */}
                <div>
                  <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    Thông Tin Liên Hệ
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="md:col-span-2 group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Địa chỉ thường trú
                      </label>
                      <input
                        type="text"
                        value={formData.chu_tai_san.thong_tin_lien_he.dia_chi_thuong_tru}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chu_tai_san: {
                            ...prev.chu_tai_san,
                            thong_tin_lien_he: {
                              ...prev.chu_tai_san.thong_tin_lien_he,
                              dia_chi_thuong_tru: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                        placeholder="123 Đường ABC, Quận 1, TP.HCM"
                      />
                    </div>

                    <div className="md:col-span-2 group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Địa chỉ liên lạc
                      </label>
                      <input
                        type="text"
                        value={formData.chu_tai_san.thong_tin_lien_he.dia_chi_lien_lac}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chu_tai_san: {
                            ...prev.chu_tai_san,
                            thong_tin_lien_he: {
                              ...prev.chu_tai_san.thong_tin_lien_he,
                              dia_chi_lien_lac: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                        placeholder="Để trống nếu trùng với địa chỉ thường trú"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.chu_tai_san.thong_tin_lien_he.sdt}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chu_tai_san: {
                            ...prev.chu_tai_san,
                            thong_tin_lien_he: {
                              ...prev.chu_tai_san.thong_tin_lien_he,
                              sdt: e.target.value
                            }
                          }
                        }))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all ${
                          errors.sdt ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 group-hover:border-blue-300'
                        }`}
                        placeholder="0912345678"
                      />
                      {errors.sdt && (
                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.sdt}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.chu_tai_san.thong_tin_lien_he.email}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          chu_tai_san: {
                            ...prev.chu_tai_san,
                            thong_tin_lien_he: {
                              ...prev.chu_tai_san.thong_tin_lien_he,
                              email: e.target.value
                            }
                          }
                        }))}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all ${
                          errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 group-hover:border-blue-300'
                        }`}
                        placeholder="example@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {currentSection === 1 && (
            <div className="animate-fadeIn">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <span>Thông Tin Tài Sản Cần Bảo Hiểm</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Loại tài sản
                    </label>
                    <select
                      value={formData.thong_tin_tai_san.loai_tai_san}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          loai_tai_san: e.target.value as 'Nha_o' | 'Can_ho' | 'Phuong_tien' | 'Hang_hoa'
                        }
                      }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                    >
                      <option value="Nha_o">🏠 Nhà ở</option>
                      <option value="Can_ho">🏢 Căn hộ</option>
                      <option value="Phuong_tien">🚗 Phương tiện</option>
                      <option value="Hang_hoa">📦 Hàng hóa</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Giá trị ước tính (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.thong_tin_tai_san.gia_tri_uoc_tinh}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          gia_tri_uoc_tinh: e.target.value
                        }
                      }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all ${
                        errors.gia_tri ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 group-hover:border-blue-300'
                      }`}
                      placeholder="500000000"
                    />
                    {errors.gia_tri && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.gia_tri}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Địa chỉ tài sản <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.thong_tin_tai_san.dia_chi_tai_san}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          dia_chi_tai_san: e.target.value
                        }
                      }))}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all ${
                        errors.dia_chi_tai_san ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700 group-hover:border-blue-300'
                      }`}
                      placeholder="456 Đường XYZ, Quận 2, TP.HCM"
                    />
                    {errors.dia_chi_tai_san && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.dia_chi_tai_san}
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Diện tích (m²)
                    </label>
                    <input
                      type="number"
                      value={formData.thong_tin_tai_san.dien_tich}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          dien_tich: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                      placeholder="100"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Năm xây dựng
                    </label>
                    <input
                      type="text"
                      value={formData.thong_tin_tai_san.nam_xay_dung}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          nam_xay_dung: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                      placeholder="2020"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Kiểu nhà
                    </label>
                    <input
                      type="text"
                      value={formData.thong_tin_tai_san.kieu_nha}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          kieu_nha: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                      placeholder="Nhà cấp 4, biệt thự, chung cư..."
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Vật liệu xây dựng
                    </label>
                    <input
                      type="text"
                      value={formData.thong_tin_tai_san.vat_lieu_xay_dung}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          vat_lieu_xay_dung: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                      placeholder="Bê tông, gạch, gỗ..."
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Số tầng
                    </label>
                    <input
                      type="text"
                      value={formData.thong_tin_tai_san.so_tang}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          so_tang: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                      placeholder="1"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Tình trạng hiện tại
                    </label>
                    <select
                      value={formData.thong_tin_tai_san.tinh_trang_hien_tai}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          tinh_trang_hien_tai: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300"
                    >
                      <option value="Tốt">✅ Tốt</option>
                      <option value="Khá">👍 Khá</option>
                      <option value="Trung bình">⚠️ Trung bình</option>
                      <option value="Cần sửa chữa">🔧 Cần sửa chữa</option>
                    </select>
                  </div>
                </div>

                {/* Disaster History - Enhanced */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-6 rounded-2xl border-2 border-orange-200 dark:border-orange-800">
                  <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    </div>
                    Lịch Sử Thiên Tai
                  </h3>
                  
                  <div className="space-y-5">
                    <div className="group">
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Tài sản đã từng gặp thiên tai?
                      </label>
                      <select
                        value={formData.lich_su_thiet_hai?.da_gap_thien_tai}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lich_su_thiet_hai: {
                            ...prev.lich_su_thiet_hai,
                            da_gap_thien_tai: e.target.value as 'Co' | 'Khong'
                          }
                        }))}
                        className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-800 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:bg-gray-800 transition-all group-hover:border-orange-300"
                      >
                        <option value="Khong">❌ Không</option>
                        <option value="Co">✅ Có</option>
                      </select>
                    </div>

                    {formData.lich_su_thiet_hai?.da_gap_thien_tai === 'Co' && (
                      <div className="space-y-5 animate-fadeIn">
                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Mô tả chi tiết thiệt hại
                          </label>
                          <textarea
                            value={formData.lich_su_thiet_hai?.mo_ta_thiet_hai || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              lich_su_thiet_hai: {
                                da_gap_thien_tai: prev.lich_su_thiet_hai?.da_gap_thien_tai || 'Co',
                                mo_ta_thiet_hai: e.target.value,
                                nam_xay_ra: prev.lich_su_thiet_hai?.nam_xay_ra,
                                da_boi_thuong: prev.lich_su_thiet_hai?.da_boi_thuong
                              }
                            }))}
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-800 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:bg-gray-800 transition-all"
                            placeholder="Vui lòng mô tả cụ thể loại thiên tai, mức độ thiệt hại, và các thiệt hại về tài sản..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                            Năm xảy ra
                          </label>
                          <input
                            type="text"
                            value={formData.lich_su_thiet_hai?.nam_xay_ra || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              lich_su_thiet_hai: {
                                da_gap_thien_tai: prev.lich_su_thiet_hai?.da_gap_thien_tai || 'Co',
                                mo_ta_thiet_hai: prev.lich_su_thiet_hai?.mo_ta_thiet_hai,
                                nam_xay_ra: e.target.value,
                                da_boi_thuong: prev.lich_su_thiet_hai?.da_boi_thuong
                              }
                            }))}
                            className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-800 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:bg-gray-800 transition-all"
                            placeholder="2023"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {currentSection === 2 && (
            <div className="animate-fadeIn">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-b">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span>Gói Bảo Hiểm</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* Package Info Card - Enhanced */}
                <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 p-8 rounded-2xl shadow-2xl text-white overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '32px 32px'
                    }} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Gói được chọn</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-3">
                          {packageData.name}
                        </h3>
                        <p className="text-blue-100 text-lg leading-relaxed">{packageData.description}</p>
                      </div>
                      <div className="hidden md:block ml-6">
                        <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                          <p className="text-sm text-blue-100 mb-1">Phí bảo hiểm</p>
                          <p className="text-4xl font-bold">{formatPrice(packageData.price)}</p>
                          <p className="text-sm text-blue-100 mt-1">/{packageData.period}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-100">Mức bảo hiểm</p>
                          <p className="font-bold text-lg">{packageData.coverage}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-100">Thời hạn</p>
                          <p className="font-bold text-lg">{packageData.period}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits - Enhanced */}
                <div>
                  <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    Quyền lợi bảo hiểm
                  </h3>
                  <div className="grid gap-3">
                    {packageData.benefits.map((benefit, idx) => (
                      <div key={idx} className="group flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method - Enhanced */}
                <div>
                  <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    Phương thức thanh toán
                  </h3>
                  <div className="group">
                    <select
                      value={formData.phuong_thuc_thanh_toan.phuong_thuc}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        phuong_thuc_thanh_toan: {
                          ...prev.phuong_thuc_thanh_toan,
                          phuong_thuc: e.target.value as 'Tien_mat' | 'Chuyen_khoan' | 'The_tin_dung' | 'Vi_dien_tu'
                        }
                      }))}
                      className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 transition-all group-hover:border-blue-300 text-base font-medium"
                    >
                      <option value="Chuyen_khoan">🏦 Chuyển khoản ngân hàng</option>
                      <option value="The_tin_dung">💳 Thẻ tín dụng</option>
                      <option value="Vi_dien_tu">📱 Ví điện tử (MoMo, ZaloPay...)</option>
                      <option value="Tien_mat">💵 Tiền mặt</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {currentSection === 3 && (
            <div className="animate-fadeIn">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <span>Hình Ảnh Tài Sản & Xác Nhận</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* Image Upload - Enhanced */}
                <div>
                  <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                      <Camera className="w-4 h-4 text-indigo-600" />
                    </div>
                    Hình ảnh tài sản (tối thiểu 4 góc)
                  </h3>
                  
                  <div className="relative border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-2xl p-10 text-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all group overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                      }} />
                    </div>
                    
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center relative z-10"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                        <Upload className="w-10 h-10 text-white" />
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Tải lên hình ảnh tài sản
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Click để chọn file hoặc kéo thả vào đây
                      </span>
                      <span className="text-xs text-gray-500 mt-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                        Hỗ trợ: JPG, PNG, GIF • Tối đa 10MB/ảnh
                      </span>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-indigo-400 dark:group-hover:border-indigo-600 transition-all shadow-lg">
                            <img
                              src={img}
                              alt={`Tài sản ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-xl flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 hover:scale-110 transform"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Ảnh {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirmation Summary - Enhanced */}
                <div>
                  <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    Xác nhận thông tin
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-950/20 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start pb-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Họ tên</span>
                          <span className="font-bold text-gray-900 dark:text-white">{formData.chu_tai_san.thong_tin_ca_nhan.ho_ten}</span>
                        </div>
                        <div className="flex justify-between items-start pb-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Số CCCD</span>
                          <span className="font-bold text-gray-900 dark:text-white">{formData.chu_tai_san.thong_tin_ca_nhan.giay_to.so}</span>
                        </div>
                        <div className="flex justify-between items-start pb-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Địa chỉ tài sản</span>
                          <span className="font-bold text-right text-gray-900 dark:text-white max-w-xs">{formData.thong_tin_tai_san.dia_chi_tai_san}</span>
                        </div>
                        <div className="flex justify-between items-start pb-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Giá trị tài sản</span>
                          <span className="font-bold text-gray-900 dark:text-white">{formatPrice(Number(formData.thong_tin_tai_san.gia_tri_uoc_tinh))}</span>
                        </div>
                        <div className="pt-3">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Gói bảo hiểm</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{packageData.name}</span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="text-base font-semibold text-gray-900 dark:text-white">Phí bảo hiểm</span>
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">{formatPrice(packageData.price)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Important Notice */}
                    <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-2xl shadow-xl overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                          backgroundSize: '20px 20px'
                        }} />
                      </div>
                      
                      <div className="relative z-10 flex items-start gap-4 text-white">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <AlertCircle className="w-6 h-6" />
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-lg mb-3">Lưu ý quan trọng</p>
                          <ul className="space-y-2 text-sm text-blue-50">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <span>Vui lòng kiểm tra kỹ tất cả thông tin trước khi xác nhận</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <span>Thông tin sai lệch có thể ảnh hưởng đến quá trình bồi thường</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <span>Hợp đồng có hiệu lực sau 7 ngày kể từ ngày thanh toán thành công</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <span>Bạn sẽ nhận được email xác nhận và hợp đồng điện tử sau khi hoàn tất</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {/* Enhanced Navigation Buttons */}
          <div className="flex justify-between items-center mt-10 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentSection === 0}
              className="group flex items-center gap-2 px-8 py-6 text-base font-semibold rounded-xl border-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Quay lại
            </Button>

            {currentSection < sections.length - 1 ? (
              <Button
                type="submit"
                className="group flex items-center gap-2 px-8 py-6 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5"
              >
                Tiếp tục
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group relative flex items-center gap-3 px-10 py-6 text-base font-bold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all hover:-translate-y-0.5 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Shimmer Effect */}
                {!isSubmitting && (
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                )}
                
                <span className="relative z-10">{isSubmitting ? 'Đang xử lý...' : 'Xác nhận & Thanh toán'}</span>
                {!isSubmitting && <CheckCircle className="w-5 h-5 relative z-10" />}
              </Button>
            )}
          </div>
        </form>
      </main>

    </div>
  )
}


