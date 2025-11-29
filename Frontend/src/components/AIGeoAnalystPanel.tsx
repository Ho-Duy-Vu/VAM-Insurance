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
    <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-4">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-b border-blue-700 py-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-base">AI Geo-Analyst</div>
              <div className="text-xs text-blue-100 font-normal">
                Phân tích thông minh địa lý
              </div>
            </div>
          </div>
          
          <div className="px-2.5 py-1 bg-white/20 rounded-md text-xs font-medium">
            AI
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {/* Upload Section */}
        <div>
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-5 rounded-2xl mb-4 border-2 border-blue-200 dark:border-blue-800 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-white text-sm">💡</span>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-300 font-bold">
                Hướng dẫn chụp ảnh CCCD:
              </p>
            </div>
            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-2 ml-10 list-none">
              <li className="flex items-start gap-2 bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
                <span className="text-blue-600 flex-shrink-0 font-bold">✓</span>
                <span>Chụp <strong className="text-blue-900 dark:text-blue-200">MẶT SAU</strong> của CCCD (có địa chỉ và quê quán)</span>
              </li>
              <li className="flex items-start gap-2 bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
                <span className="text-blue-600 flex-shrink-0 font-bold">✓</span>
                <span>Ảnh <strong className="text-blue-900 dark:text-blue-200">rõ nét</strong>, đủ ánh sáng, không bị mờ hoặc chói</span>
              </li>
              <li className="flex items-start gap-2 bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
                <span className="text-blue-600 flex-shrink-0 font-bold">✓</span>
                <span>CCCD nằm <strong className="text-blue-900 dark:text-blue-200">phẳng</strong>, không bị cong vênh</span>
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
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-2xl transition-all py-7 text-base font-bold rounded-xl relative overflow-hidden group"
            disabled={isAnalyzing}
            onClick={() => document.getElementById('cccd-upload-input')?.click()}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex items-center justify-center gap-2">
              <Upload className={`w-5 h-5 ${isAnalyzing ? 'animate-bounce' : ''}`} />
              {isAnalyzing ? '⏳ Đang phân tích với AI...' : '📤 Bắt đầu phân tích'}
            </div>
          </Button>

          {/* Progress bar */}
          {isAnalyzing && uploadProgress > 0 && (
            <div className="mt-5 space-y-3 bg-gradient-to-br from-white to-blue-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-2xl border-2 border-blue-300 dark:border-blue-700 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  Đang xử lý AI...
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-500 rounded-full shadow-lg relative overflow-hidden"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-xl">
                <p className="text-xs text-center text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center gap-2">
                  {uploadProgress < 40 ? (
                    <><span className="text-lg">📤</span> Đang tải lên tài liệu...</>
                  ) : uploadProgress < 70 ? (
                    <><span className="text-lg">🔍</span> AI đang trích xuất thông tin...</>
                  ) : uploadProgress < 90 ? (
                    <><span className="text-lg">🌍</span> AI đang phân tích địa điểm...</>
                  ) : (
                    <><span className="text-lg">✅</span> Phân tích hoàn tất!</>
                  )}
                </p>
              </div>
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
          <div className="space-y-5 pt-5 border-t-2 border-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 p-4 rounded-2xl border-2 border-green-300 dark:border-green-700 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-800 dark:text-gray-200">
                      Kết quả phân tích
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Phân tích thành công ✓</p>
                  </div>
                </div>
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
                  className="text-xs border-2 hover:bg-white hover:shadow-md transition-all font-semibold"
                >
                  🔄 Phân tích mới
                </Button>
              </div>
            </div>

            {/* User Location */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-5 rounded-2xl border-2 border-blue-300 dark:border-blue-700 space-y-3 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Thông tin vị trí</h4>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
                    <span className="text-base">📍</span>
                    Tỉnh/Thành phố
                  </span>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{analysisResult.user_province}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
                    <span className="text-base">🗺️</span>
                    Vùng miền
                  </span>
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{analysisResult.user_region}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
                    <span className="text-base">🌦️</span>
                    Tình hình thời tiết
                  </span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{analysisResult.weather_status}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    Mức độ rủi ro
                  </span>
                  <span className={`text-sm px-3 py-1.5 rounded-xl font-bold shadow-md ${getRiskColor(analysisResult.risk_level)}`}>
                    {analysisResult.risk_level}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Packages */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 p-5 rounded-2xl border-2 border-purple-300 dark:border-purple-700 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Gói bảo hiểm đề xuất
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Top {analysisResult.recommended_packages.length} gói phù hợp nhất</p>
                </div>
              </div>
              <div className="space-y-3">
                {analysisResult.recommended_packages.slice(0, 3).map((pkg, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-xl transition-all hover:border-purple-400 hover:-translate-y-0.5 relative overflow-hidden group">
                    {/* Rank Badge */}
                    <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center text-xs font-bold text-gray-900 shadow-md">
                      {idx + 1}
                    </div>
                    
                    <div className="flex items-start justify-between mb-3 pr-8">
                      <span className="text-sm font-bold flex-1 text-gray-800 dark:text-gray-200 leading-tight">{pkg.package}</span>
                    </div>
                    
                    {/* Match percentage bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Độ phù hợp</span>
                        <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {pkg.percent}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-sm"
                          style={{ width: `${pkg.percent}%` }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
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
          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl text-center border-2 border-dashed border-blue-300 dark:border-gray-600 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl animate-pulse">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <p className="text-base text-gray-800 dark:text-gray-200 font-bold mb-2">
                Sẵn sàng phân tích
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                Upload CCCD để AI phân tích <strong className="text-blue-700 dark:text-blue-400">địa chỉ</strong>, xác định <strong className="text-indigo-700 dark:text-indigo-400">vùng miền</strong> và đề xuất <strong className="text-purple-700 dark:text-purple-400">gói bảo hiểm</strong> phù hợp với rủi ro thiên tai
              </p>
              
              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-sm">
                  🤖 AI Phân tích
                </div>
                <div className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-sm">
                  ⚡ Nhanh chóng
                </div>
                <div className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-sm">
                  🎯 Chính xác
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
