import { useState } from 'react'
import { Upload, MapPin, AlertTriangle, Shield, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { documentApi } from '../api/client'
import { analyzeDocumentLocation, type GeoAnalysisResult } from '../api/geoAnalyst'

interface AIGeoAnalystPanelProps {
  onUserLocationDetected?: (location: { lat: number; lng: number; province: string; region: string }) => void
}

export default function AIGeoAnalystPanel({ onUserLocationDetected }: AIGeoAnalystPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<GeoAnalysisResult | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setError(null)
    setIsAnalyzing(true)
    setUploadProgress(0)

    try {
      console.log('🚀 Uploading CCCD for geo-analysis...')
      setUploadProgress(10)

      // Step 1: Upload document
      const uploadResult = await documentApi.uploadDocument(file)
      const documentId = uploadResult.document_id
      console.log(`✅ Document uploaded: ${documentId}`)
      setUploadProgress(40)

      // Step 2: Extract person info
      console.log('👤 Extracting person info...')
      const personInfo = await documentApi.extractPersonInfo(documentId)
      
      // Check for quota error
      if (personInfo.extractionStatus === 'quota_exceeded') {
        console.warn('⚠️ API quota exceeded:', personInfo.message)
        setError(personInfo.message || 'Đã vượt quá giới hạn API')
        setUploadProgress(0)
        return
      }
      
      // Check for extraction failure (all fields null)
      if (personInfo.extractionStatus === 'failed') {
        console.warn('⚠️ Extraction failed:', personInfo.message)
        setError(personInfo.message || 'Không thể trích xuất thông tin từ ảnh')
        setUploadProgress(0)
        return
      }
      
      console.log('✅ Person info extracted:', personInfo)
      console.log('   📍 Address:', personInfo.address)
      console.log('   🏠 Place of Origin:', personInfo.placeOfOrigin)
      
      // Log full response for debugging
      if (!personInfo.address && !personInfo.placeOfOrigin) {
        console.error('⚠️ No address fields found. Full response:', personInfo)
      }
      
      setUploadProgress(70)

      // Step 3: Get address from person info - prioritize placeOfOrigin for disaster analysis
      const address = personInfo.placeOfOrigin || personInfo.address || ''
      
      if (!address) {
        console.error('❌ No address found in person info:', personInfo)
        
        // Better error message based on extraction status
        let errorMsg = 'Không tìm thấy địa chỉ trong CCCD.'
        
        if (!personInfo.fullName && !personInfo.idNumber) {
          errorMsg = '⚠️ Không thể đọc được thông tin từ ảnh. Vui lòng:\n' +
                     '• Chụp ảnh rõ nét hơn\n' +
                     '• Đảm bảo đủ ánh sáng\n' +
                     '• CCCD phải nằm phẳng, không bị che khuất\n' +
                     '• Thử lại với ảnh chất lượng tốt hơn'
        } else {
          errorMsg = '⚠️ Không tìm thấy thông tin địa chỉ/quê quán.\n' +
                     'Vui lòng chụp lại mặt sau CCCD (có địa chỉ thường trú và quê quán)'
        }
        
        throw new Error(errorMsg)
      }

      console.log(`📍 Detected address: ${address}`)

      // Step 4: Call real backend API for geo-analysis
      console.log('🌍 Analyzing location with backend API...')
      const locationAnalysis = await analyzeDocumentLocation(documentId)
      const geoAnalysis = locationAnalysis.analysis
      
      setAnalysisResult(geoAnalysis)
      console.log('✅ Geo-analysis complete:', geoAnalysis)
      setUploadProgress(90)

      // Step 5: Notify parent component về vị trí người dùng
      if (onUserLocationDetected) {
        // Get coordinates from disasterData helper
        const { findCoordinatesFromAddress } = await import('../data/disasterData')
        const coords = findCoordinatesFromAddress(address)
        
        if (coords) {
          console.log(`📌 Found coordinates: [${coords[0]}, ${coords[1]}]`)
          onUserLocationDetected({
            lat: coords[0],
            lng: coords[1],
            province: geoAnalysis.user_province,
            region: geoAnalysis.user_region
          })
        } else {
          console.warn('⚠️ Không tìm thấy tọa độ cho địa chỉ:', address)
          // Still set analysis result even if coordinates not found
        }
      }

      setUploadProgress(100)

    } catch (err) {
      console.error('❌ Geo-analysis failed:', err)
      setError(err instanceof Error ? err.message : 'Phân tích thất bại')
      setUploadProgress(0)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'rất cao':
      case 'cao':
        return 'text-red-600 bg-red-100'
      case 'trung bình':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-green-600 bg-green-100'
    }
  }

  return (
    <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 sticky top-4">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white rounded-t-xl py-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold">AI Geo-Analyst</div>
            <div className="text-xs text-blue-100 font-normal">Phân tích thông minh</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* Upload Section */}
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">
            📤 Upload CCCD/CMND để AI phân tích
          </p>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl mb-4 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">💡</span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                Lưu ý quan trọng:
              </p>
            </div>
            <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1.5 ml-8 list-none">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">✓</span>
                <span>Chụp <strong>MẶT SAU</strong> của CCCD (có địa chỉ và quê quán)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">✓</span>
                <span>Ảnh rõ nét, đủ ánh sáng, không bị mờ hoặc chói</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">✓</span>
                <span>CCCD nằm phẳng, không bị cong vênh</span>
              </li>
            </ul>
          </div>
          
          <input
            id="cccd-upload-input"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isAnalyzing}
          />
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all py-6 text-base font-semibold rounded-xl"
            disabled={isAnalyzing}
            onClick={() => document.getElementById('cccd-upload-input')?.click()}
          >
            <Upload className="w-5 h-5 mr-2" />
            {isAnalyzing ? '⏳ Đang phân tích...' : '📤 Upload CCCD/CMND'}
          </Button>

          {/* Progress bar */}
          {isAnalyzing && uploadProgress > 0 && (
            <div className="mt-4 space-y-2 bg-white dark:bg-gray-700 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Đang xử lý...
                </span>
                <span className="text-xs font-bold text-blue-600">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 transition-all duration-500 rounded-full shadow-lg"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                {uploadProgress < 40 ? '📤 Đang tải lên...' : 
                 uploadProgress < 70 ? '🔍 Đang trích xuất thông tin...' : 
                 uploadProgress < 90 ? '🌍 Đang phân tích địa điểm...' : 
                 '✅ Hoàn tất!'}
              </p>
            </div>
          )}

          {uploadedFile && !error && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-xs text-green-700 dark:text-green-300 font-medium flex items-center gap-2">
                <span>✅</span>
                <span className="flex-1 truncate">{uploadedFile.name}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg">❌</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">Lỗi phân tích</p>
                  <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-line leading-relaxed">{error}</p>
                  
                  {/* Retry buttons */}
                  <div className="mt-4 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setError(null)
                        setUploadProgress(0)
                        setUploadedFile(null)
                        document.getElementById('cccd-upload-input')?.click()
                      }}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-xs shadow-md"
                    >
                      🔄 Thử lại
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setError(null)
                        setUploadProgress(0)
                        setUploadedFile(null)
                      }}
                      className="text-xs border-2"
                    >
                      Đóng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Result */}
        {analysisResult && (
          <div className="space-y-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                Kết quả phân tích
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setAnalysisResult(null)
                  setUploadedFile(null)
                  setError(null)
                  setUploadProgress(0)
                }}
                className="text-xs border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                🔄 Upload lại
              </Button>
            </div>

            {/* User Location */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
                  <span>📍</span>
                  Vị trí của bạn
                </span>
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{analysisResult.user_province}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
                  <span>🗺️</span>
                  Vùng miền
                </span>
                <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{analysisResult.user_region}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
                  <span>🌦️</span>
                  Tình hình
                </span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{analysisResult.weather_status}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
                  <span>⚠️</span>
                  Mức rủi ro
                </span>
                <span className={`text-sm px-3 py-1.5 rounded-full font-bold shadow-sm ${getRiskColor(analysisResult.risk_level)}`}>
                  {analysisResult.risk_level}
                </span>
              </div>
            </div>

            {/* Recommended Packages */}
            <div>
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                Gói bảo hiểm đề xuất
              </h4>
              <div className="space-y-3">
                {analysisResult.recommended_packages.slice(0, 3).map((pkg, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 hover:shadow-lg transition-all hover:border-blue-400">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-bold flex-1 text-gray-800 dark:text-gray-200">{pkg.package}</span>
                      <span className="text-base font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 px-2.5 py-1 rounded-lg ml-2 shadow-sm">
                        {pkg.percent}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                      {pkg.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Info */}
            <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-sm">
              <p className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-blue-700 dark:text-blue-400">Vị trí của bạn</strong> đã được đánh dấu trên bản đồ bằng marker màu xanh dương <strong>📍</strong>
                </span>
              </p>
            </div>

            {/* Analysis Time */}
            <div className="text-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                ⏰ Phân tích lúc: {new Date(analysisResult.analysis_time).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        )}

        {/* Info when no analysis */}
        {!analysisResult && !isAnalyzing && !error && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
              Chưa có dữ liệu phân tích
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Upload CCCD để AI phân tích địa chỉ, xác định vùng miền và đề xuất gói bảo hiểm phù hợp với rủi ro thiên tai tại khu vực của bạn
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
