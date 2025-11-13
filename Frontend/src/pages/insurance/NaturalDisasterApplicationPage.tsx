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
import { Card, CardContent, CardHeader, CardTitle } from '..\/..\/components\/ui/card'
import { Button } from '..\/..\/components\/ui/button'
import { useInsuranceStore } from '..\/..\/store\/insurance'
import { getPackageById, formatPrice } from '..\/..\/data\/insurancePackages'
import type { NaturalDisasterInsuranceApplication } from '..\/..\/types\/insurance'
import { documentApi } from '..\/..\/api\/client'

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
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Quay lại
          </Button>
          
          <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Đơn Đăng Ký Bảo Hiểm Thiên Tai</h1>
                  <p className="text-blue-100">
                    Gói: {packageData.name} - {formatPrice(packageData.price)}/{packageData.period}
                  </p>
                </div>
                <Shield className="w-16 h-16 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {sections.map((section, idx) => {
              const Icon = section.icon
              const isActive = idx === currentSection
              const isCompleted = idx < currentSection
              
              return (
                <React.Fragment key={section.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white scale-110 shadow-lg'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className={`mt-2 text-xs font-medium text-center ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                      {section.title}
                    </p>
                  </div>
                  {idx < sections.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Form Sections */}
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          {currentSection === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  Thông Tin Chủ Tài Sản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Document Upload Section */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6 rounded-lg border-2 border-dashed border-blue-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        🤖 Upload Tài Liệu - AI Tự Động Điền
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Tải lên CCCD/CMND để hệ thống AI tự động trích xuất và điền thông tin vào form
                      </p>
                      
                      <div className="space-y-4">
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
                            className={`inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
                              isExtracting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <Upload className="w-5 h-5" />
                            {isExtracting ? 'Đang xử lý...' : 'Chọn tài liệu (CCCD/CMND/PDF)'}
                          </label>
                        </div>

                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Đang xử lý...</span>
                              <span className="font-medium text-blue-600">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {extractionStatus && (
                          <div className={`flex items-center gap-2 p-3 rounded-lg ${
                            extractionStatus.includes('✅') 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                              : extractionStatus.includes('❌')
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}>
                            {extractionStatus.includes('Đang') && (
                              <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                            )}
                            <span className="text-sm font-medium">{extractionStatus}</span>
                          </div>
                        )}

                        {uploadedDocuments.length > 0 && (
                          <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{uploadedDocuments[0].name}</p>
                              <p className="text-xs text-gray-500">
                                {(uploadedDocuments[0].size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(0)}
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-xs text-yellow-800 dark:text-yellow-400">
                          💡 <strong>Mẹo:</strong> Chụp ảnh rõ nét, đủ sáng, không bị mờ để AI trích xuất chính xác nhất. 
                          Hỗ trợ: JPG, PNG, PDF (tối đa 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6" />

                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 ${
                        errors.ho_ten ? 'border-red-500' : ''
                      }`}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.ho_ten && <p className="text-red-500 text-xs mt-1">{errors.ho_ten}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày sinh</label>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Giới tính</label>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nu">Nữ</option>
                      <option value="Khac">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 ${
                        errors.so_giay_to ? 'border-red-500' : ''
                      }`}
                      placeholder="001234567890"
                    />
                    {errors.so_giay_to && <p className="text-red-500 text-xs mt-1">{errors.so_giay_to}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nghề nghiệp</label>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                      placeholder="Kỹ sư"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nơi làm việc</label>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                      placeholder="Công ty ABC"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Thông Tin Liên Hệ
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Địa chỉ thường trú</label>
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
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                        placeholder="123 Đường ABC, Quận 1, TP.HCM"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Địa chỉ liên lạc</label>
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
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                        placeholder="Để trống nếu trùng với địa chỉ thường trú"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
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
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 ${
                          errors.sdt ? 'border-red-500' : ''
                        }`}
                        placeholder="0912345678"
                      />
                      {errors.sdt && <p className="text-red-500 text-xs mt-1">{errors.sdt}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
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
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 ${
                          errors.email ? 'border-red-500' : ''
                        }`}
                        placeholder="example@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentSection === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-6 h-6 text-blue-600" />
                  Thông Tin Tài Sản Cần Bảo Hiểm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Loại tài sản</label>
                    <select
                      value={formData.thong_tin_tai_san.loai_tai_san}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          loai_tai_san: e.target.value as 'Nha_o' | 'Can_ho' | 'Phuong_tien' | 'Hang_hoa'
                        }
                      }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    >
                      <option value="Nha_o">Nhà ở</option>
                      <option value="Can_ho">Căn hộ</option>
                      <option value="Phuong_tien">Phương tiện</option>
                      <option value="Hang_hoa">Hàng hóa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 ${
                        errors.gia_tri ? 'border-red-500' : ''
                      }`}
                      placeholder="500000000"
                    />
                    {errors.gia_tri && <p className="text-red-500 text-xs mt-1">{errors.gia_tri}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 ${
                        errors.dia_chi_tai_san ? 'border-red-500' : ''
                      }`}
                      placeholder="456 Đường XYZ, Quận 2, TP.HCM"
                    />
                    {errors.dia_chi_tai_san && <p className="text-red-500 text-xs mt-1">{errors.dia_chi_tai_san}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Diện tích (m²)</label>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Năm xây dựng</label>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                      placeholder="2020"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Kiểu nhà</label>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                      placeholder="Nhà cấp 4, biệt thự, chung cư..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Vật liệu xây dựng</label>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                      placeholder="Bê tông, gạch, gỗ..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Số tầng</label>
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
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tình trạng hiện tại</label>
                    <select
                      value={formData.thong_tin_tai_san.tinh_trang_hien_tai}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        thong_tin_tai_san: {
                          ...prev.thong_tin_tai_san,
                          tinh_trang_hien_tai: e.target.value
                        }
                      }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                    >
                      <option value="Tốt">Tốt</option>
                      <option value="Khá">Khá</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Cần sửa chữa">Cần sửa chữa</option>
                    </select>
                  </div>
                </div>

                {/* Disaster History */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    Lịch Sử Thiên Tai
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Đã từng gặp thiên tai?</label>
                      <select
                        value={formData.lich_su_thiet_hai?.da_gap_thien_tai}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          lich_su_thiet_hai: {
                            ...prev.lich_su_thiet_hai,
                            da_gap_thien_tai: e.target.value as 'Co' | 'Khong'
                          }
                        }))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                      >
                        <option value="Khong">Không</option>
                        <option value="Co">Có</option>
                      </select>
                    </div>

                    {formData.lich_su_thiet_hai?.da_gap_thien_tai === 'Co' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Mô tả thiệt hại</label>
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
                            rows={3}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                            placeholder="Mô tả chi tiết thiệt hại đã xảy ra..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Năm xảy ra</label>
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
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                            placeholder="2023"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentSection === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Gói Bảo Hiểm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {packageData.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{packageData.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Phí bảo hiểm</p>
                      <p className="text-2xl font-bold text-blue-600">{formatPrice(packageData.price)}</p>
                      <p className="text-sm text-gray-500">/{packageData.period}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span>Mức bảo hiểm: <strong>{packageData.coverage}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Thời hạn: <strong>{packageData.period}</strong></span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Quyền lợi bảo hiểm:</h3>
                  <div className="grid gap-2">
                    {packageData.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phương thức thanh toán</label>
                  <select
                    value={formData.phuong_thuc_thanh_toan.phuong_thuc}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      phuong_thuc_thanh_toan: {
                        ...prev.phuong_thuc_thanh_toan,
                        phuong_thuc: e.target.value as 'Tien_mat' | 'Chuyen_khoan' | 'The_tin_dung' | 'Vi_dien_tu'
                      }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                  >
                    <option value="Chuyen_khoan">Chuyển khoản ngân hàng</option>
                    <option value="The_tin_dung">Thẻ tín dụng</option>
                    <option value="Vi_dien_tu">Ví điện tử</option>
                    <option value="Tien_mat">Tiền mặt</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {currentSection === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-6 h-6 text-blue-600" />
                  Hình Ảnh Tài Sản & Xác Nhận
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tải lên hình ảnh tài sản (tối thiểu 4 góc)
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
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
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Click để tải ảnh hoặc kéo thả vào đây
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        Hỗ trợ: JPG, PNG, GIF (Tối đa 10MB/ảnh)
                      </span>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Tài sản ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Xác nhận thông tin</h3>
                  
                  <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Họ tên:</span>
                      <span className="font-medium">{formData.chu_tai_san.thong_tin_ca_nhan.ho_ten}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Số CCCD:</span>
                      <span className="font-medium">{formData.chu_tai_san.thong_tin_ca_nhan.giay_to.so}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Địa chỉ tài sản:</span>
                      <span className="font-medium text-right">{formData.thong_tin_tai_san.dia_chi_tai_san}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Giá trị tài sản:</span>
                      <span className="font-medium">{formatPrice(Number(formData.thong_tin_tai_san.gia_tri_uoc_tinh))}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Gói bảo hiểm:</span>
                      <span className="font-medium">{packageData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Phí bảo hiểm:</span>
                      <span className="font-bold text-blue-600">{formatPrice(packageData.price)}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 rounded-r-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
                          <li>• Thông tin sai lệch có thể ảnh hưởng đến quá trình bồi thường</li>
                          <li>• Hợp đồng có hiệu lực sau 7 ngày kể từ ngày thanh toán</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentSection === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>

            {currentSection < sections.length - 1 ? (
              <Button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                Tiếp tục
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận & Thanh toán'}
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </main>

    </div>
  )
}


