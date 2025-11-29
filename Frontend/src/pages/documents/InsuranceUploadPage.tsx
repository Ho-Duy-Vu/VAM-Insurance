/**
 * Insurance Upload Page
 * Upload documents for insurance application with AI analysis
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  ArrowLeft, 
  Sparkles,
  Clock,
  Shield,
  FileCheck,
  X,
  Image as ImageIcon,
  File
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { documentApi } from '../../api/client'
import { useInsuranceStore } from '../../store/insurance'
import { useDocumentStore } from '../../store/document'
import { formatPrice } from '../../data/insurancePackages'
import InsuranceRecommendationModal from '../../components/InsuranceRecommendationModal'
import { useToast } from '../../hooks/use-toast'

interface FileWithPreview extends File {
  preview?: string
}

export const InsuranceUploadPage: React.FC = () => {
  const navigate = useNavigate()
  const { selectedPackage, setExtractedData, setCurrentStep } = useInsuranceStore()
  const { showToast } = useToast()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([])
  const [processingStep, setProcessingStep] = useState<string>('')
  
  // Recommendation modal state
  const [showRecommendationModal, setShowRecommendationModal] = useState(false)
  const [recommendationData, setRecommendationData] = useState<{
    place_of_origin?: { text: string; region: string }
    address?: { text: string; region: string }
    recommended_packages?: Array<{ name: string; reason: string; priority: number }>
  } | null>(null)
  
  // Redirect if no package selected
  React.useEffect(() => {
    if (!selectedPackage) {
      navigate('/')
    }
  }, [selectedPackage, navigate])
  
  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [uploadedFiles])
  
  if (!selectedPackage) return null
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      await handleFiles(files)
    }
  }
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      await handleFiles(files)
    }
  }
  
  const handleFiles = async (files: File[]) => {
    try {
      setUploading(true)
      setUploadProgress(0)
      
      // Create preview URLs for images
      const filesWithPreview = files.map(file => {
        const fileWithPreview = file as FileWithPreview
        if (file.type.startsWith('image/')) {
          fileWithPreview.preview = URL.createObjectURL(file)
        }
        return fileWithPreview
      })
      setUploadedFiles(filesWithPreview)
      
      console.log(`📤 Uploading ${files.length} file(s) for insurance application...`)
      
      const documentIds: string[] = []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extractedDataArray: any[] = []
      
      // Process files sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log(`📤 [${i + 1}/${files.length}] Uploading:`, file.name)
        setProcessingStep(`Đang tải lên ${file.name}...`)
        setUploadProgress(((i + 1) / files.length) * 50)
        
        // Step 1: Upload file
        const result = await documentApi.uploadDocument(file)
        console.log(`✅ [${i + 1}/${files.length}] Upload success:`, result)
        
        // Step 2: Detect document type from filename
        const fileName = file.name.toLowerCase()
        const isVehicleDoc = fileName.includes('cavet') || 
                            fileName.includes('cà vẹt') || 
                            fileName.includes('ca vet') ||
                            fileName.includes('xe') ||
                            fileName.includes('vehicle') ||
                            fileName.includes('dang_ky_xe') ||
                            fileName.includes('dang-ky-xe') ||
                            fileName.includes('dangkyxe') ||
                            fileName.includes('giay_dang_ky') ||
                            fileName.includes('giay-dang-ky') ||
                            fileName.includes('registration')
        
        console.log(`   🔍 Analyzing file: "${file.name}"`)
        console.log(`   🔍 Lowercase: "${fileName}"`)
        console.log(`   🔍 Is vehicle doc: ${isVehicleDoc}`)
        
        // 🎯 SMART LOGIC: If this is the 2nd+ file, also try vehicle extraction
        const shouldExtractVehicle = isVehicleDoc || i > 0
        
        if (shouldExtractVehicle) {
          // Extract vehicle info
          console.log(`🚗 [${i + 1}/${files.length}] Extracting vehicle info...`)
          setProcessingStep(`Đang phân tích thông tin xe từ ${file.name}...`)
          try {
            const vehicleInfo = await documentApi.extractVehicleInfo(result.document_id)
            extractedDataArray.push({ ...vehicleInfo, isVehicle: true })
            console.log(`✅ [${i + 1}/${files.length}] Vehicle info extracted:`, vehicleInfo)
          } catch (error) {
            console.error(`❌ Vehicle extraction failed:`, error)
            // Fallback to person info
            setProcessingStep(`Đang phân tích thông tin cá nhân từ ${file.name}...`)
            const personInfo = await documentApi.extractPersonInfo(result.document_id)
            extractedDataArray.push({ ...personInfo, isVehicle: false })
          }
        } else {
          // Extract person info (CCCD/ID/Driver License)
          console.log(`👤 [${i + 1}/${files.length}] Extracting person info...`)
          setProcessingStep(`Đang phân tích thông tin cá nhân từ ${file.name}...`)
          const personInfo = await documentApi.extractPersonInfo(result.document_id)
          
          // Check for quota error
          if (personInfo.extractionStatus === 'quota_exceeded') {
            console.warn('⚠️ API quota exceeded:', personInfo.message)
            showToast('⚠️ ' + personInfo.message, 'warning', 7000)
          }
          
          extractedDataArray.push({ ...personInfo, isVehicle: false })
          console.log(`✅ [${i + 1}/${files.length}] Person info extracted:`, personInfo)
        }
        
        setUploadProgress(((i + 1) / files.length) * 100)
        documentIds.push(result.document_id)
      }
      
      setUploadProgress(100)
      
      // Store all document IDs and extracted data
      if (documentIds.length > 0) {
        useDocumentStore.getState().setUploadedDocumentIds(documentIds)
        
        // Merge all extracted data
        const mergedData = mergeExtractedData(extractedDataArray)
        setExtractedData(mergedData)
        
        console.log('✅ All files processed. Extracted data:', mergedData)
        
        // 🎯 NEW: Get insurance recommendation based on region
        try {
          console.log('🏠 Fetching insurance recommendations...')
          setProcessingStep('Đang phân tích khu vực và đề xuất bảo hiểm...')
          const recommendation = await documentApi.getInsuranceRecommendation(documentIds[0])
          console.log('✅ Recommendation received:', recommendation)
          
          if (recommendation && recommendation.recommendation) {
            console.log('📋 Setting recommendation data:', recommendation.recommendation)
            setRecommendationData(recommendation.recommendation)
            
            // Show modal if there are recommendations (Bắc/Trung region)
            if (recommendation.recommendation.recommended_packages?.length > 0) {
              console.log('🎯 Setting modal to OPEN with', recommendation.recommendation.recommended_packages.length, 'packages')
              console.log('📦 Packages:', recommendation.recommendation.recommended_packages)
              setShowRecommendationModal(true)
            } else {
              console.log('⚠️ No packages, going to form')
              // No recommendations (Nam region), proceed to form
              setCurrentStep('form')
              navigate('/insurance/application')
            }
          } else {
            console.log('❌ No recommendation object found')
            // No recommendation data, proceed to form
            setCurrentStep('form')
            navigate('/insurance/application')
          }
        } catch (error) {
          console.error('⚠️ Failed to get recommendations:', error)
          // Continue to form even if recommendation fails
          setCurrentStep('form')
          navigate('/insurance/application')
        }
      }
    } catch (error) {
      console.error('❌ Upload/Analysis failed:', error)
      showToast('Tải tệp hoặc phân tích thất bại. Vui lòng thử lại.', 'error', 5000)
    } finally {
      setUploading(false)
      setProcessingStep('')
    }
  }
  
  // Remove file from uploaded list
  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    // Revoke preview URL to avoid memory leak
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview!)
    }
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }
  
  // Merge extracted data from multiple documents (CCCD, Driver License, Vehicle Registration, etc.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergeExtractedData = (dataArray: any[]) => {
    // Priority: Take first non-null value from each field
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged: any = {
      // Person info fields
      fullName: null,
      dateOfBirth: null,
      gender: null,
      idNumber: null,
      address: null,
      phone: null,
      email: null,
      placeOfOrigin: null,
      nationality: null,
      issueDate: null,
      expiryDate: null,
      documentType: null,
      
      // Vehicle info fields
      vehicleType: null,
      licensePlate: null,
      chassisNumber: null,
      engineNumber: null,
      brand: null,
      model: null,
      manufacturingYear: null,
      color: null,
      engineCapacity: null,
      registrationDate: null,
      ownerName: null,
      ownerAddress: null
    }
    
    // Merge all data (take first non-null value for each field)
    dataArray.forEach((data) => {
      if (data) {
        Object.keys(merged).forEach(key => {
          if (merged[key] === null && data[key] !== null && data[key] !== undefined) {
            merged[key] = data[key]
          }
        })
      }
    })
    
    console.log('📊 Merged data (person + vehicle):', merged)
    return merged
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 shadow-xl">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang chủ
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Tải lên tài liệu</h1>
              <p className="text-blue-100">AI sẽ tự động phân tích và điền thông tin cho bạn</p>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">Tải tài liệu</span>
              </div>
              <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <span className="text-gray-500 dark:text-gray-400">Điền thông tin</span>
              </div>
              <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <span className="text-gray-500 dark:text-gray-400">Hoàn tất</span>
              </div>
            </div>
          </div>
          
          {/* Selected Package Info */}
          <Card className="mb-8 overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Gói bảo hiểm đã chọn</p>
                    <h3 className="text-2xl font-bold">
                      {selectedPackage.name}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {formatPrice(selectedPackage.price)} / {selectedPackage.period}
                    </p>
                  </div>
                </div>
                <CheckCircle className="w-12 h-12 text-green-300" />
              </div>
            </div>
          </Card>
          
          {/* Instructions */}
          <Card className="mb-8 border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Tài Liệu Cần Thiết</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 font-medium">
                    📋 Danh sách tài liệu:
                  </p>
                  <ul className="space-y-3">
                    {selectedPackage.requiredDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="flex-1">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                        💡 Mẹo để có kết quả tốt nhất:
                      </p>
                      <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-600">✓</span>
                          <span>Hình ảnh rõ nét, không bị mờ</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-600">✓</span>
                          <span>Chụp toàn bộ tài liệu, không bị cắt</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-600">✓</span>
                          <span>Ánh sáng đủ, tránh phản quang</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-600">✓</span>
                          <span>JPG, PNG, PDF (tối đa 10MB)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Upload Area */}
          <Card className="mb-8 border-0 shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-4 border-dashed rounded-2xl m-6 p-12 text-center transition-all duration-300
                  ${dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                  }
                  ${uploading ? 'pointer-events-none' : 'cursor-pointer'}
                `}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploading}
                />
                
                {uploading ? (
                  <div className="space-y-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center animate-pulse">
                      <Clock className="w-12 h-12 text-white" />
                    </div>
                    
                    <div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        🤖 AI đang phân tích tài liệu...
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {processingStep || 'Đang xử lý...'}
                      </p>
                    </div>
                    
                    <div className="max-w-md mx-auto">
                      <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-3">
                        {uploadProgress.toFixed(0)}% hoàn thành
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center">
                      <Upload className={`w-12 h-12 ${dragActive ? 'text-blue-600 scale-110' : 'text-gray-400'} transition-all`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {dragActive ? '📂 Thả file vào đây' : '☁️ Kéo thả file vào đây'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      hoặc{' '}
                      <span className="text-blue-600 dark:text-blue-400 font-semibold underline">
                        nhấp để chọn file
                      </span>
                      {' '}từ máy tính
                    </p>
                    
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>JPG, PNG</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        <span>PDF</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <span>Max 10MB</span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Uploaded Files List with Preview */}
              {uploadedFiles.length > 0 && !uploading && (
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Đã tải lên ({uploadedFiles.length} file)
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        uploadedFiles.forEach(file => {
                          if (file.preview) URL.revokeObjectURL(file.preview)
                        })
                        setUploadedFiles([])
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Xóa tất cả
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedFiles.map((file, idx) => (
                      <div 
                        key={idx} 
                        className="group relative bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-all"
                      >
                        {/* Preview or Icon */}
                        <div className="aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                          {file.preview ? (
                            <img 
                              src={file.preview} 
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <File className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        
                        {/* File Info */}
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFile(idx)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        {/* Success Badge */}
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          OK
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Thông tin của bạn được mã hóa và bảo mật tuyệt đối</span>
          </div>
        </div>
      </main>
    
      
      {/* Insurance Recommendation Modal */}
      <InsuranceRecommendationModal
        isOpen={showRecommendationModal}
        onClose={() => {
          setShowRecommendationModal(false)
          setCurrentStep('form')
          navigate('/insurance/application', { replace: true })
        }}
        placeOfOrigin={recommendationData?.place_of_origin}
        address={recommendationData?.address}
        recommendedPackages={recommendationData?.recommended_packages}
        onSelectPackage={(packageName) => {
          console.log('📦 User selected package:', packageName)
          
          // Close modal first
          setShowRecommendationModal(false)
          
          // Determine if this is a natural disaster package and map to packageId
          const lowerName = packageName.toLowerCase()
          let targetPackageId = ''
          let isNaturalDisaster = false
          
          if (lowerName.includes('ngập lụt') || lowerName.includes('lũ')) {
            isNaturalDisaster = true
            targetPackageId = 'flood-basic'
          } else if (lowerName.includes('bão') || lowerName.includes('gió')) {
            isNaturalDisaster = true
            targetPackageId = 'storm-comprehensive'
          } else if (lowerName.includes('phương tiện') || lowerName.includes('xe')) {
            isNaturalDisaster = true
            targetPackageId = 'disaster-vehicle'
          }
          
          if (isNaturalDisaster) {
            // Route to natural disaster application form with packageId
            console.log('🌊 Routing to natural disaster application form with packageId:', targetPackageId)
            // Use replace to avoid stacking upload page in history
            setTimeout(() => {
              navigate(`/natural-disaster/application?package=${targetPackageId}`, { replace: true })
            }, 100)
          } else {
            // Route to regular insurance application form
            console.log('📝 Routing to regular insurance application form')
            setCurrentStep('form')
            setTimeout(() => {
              navigate('/insurance/application', { replace: true })
            }, 100)
          }
        }}
      />
    </div>
  )
}


