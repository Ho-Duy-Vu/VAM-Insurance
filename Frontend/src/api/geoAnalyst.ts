/**
 * AI Insurance Geo-Analyst API Client
 * Tích hợp với backend để phân tích địa chỉ và đề xuất bảo hiểm
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface UserProfile {
  full_name: string
  dob: string
  address: string
  document_type: string
}

export interface WeatherData {
  source: string
  temperature: string
  condition: string
  alert: string
}

export interface InsuranceRecommendation {
  package: string
  percent: number
  reason: string
}

export interface ProvinceOverview {
  province: string
  region: string
  weather: string
  marker_color: 'yellow' | 'red' | 'orange' | 'green'
  risk: string
}

export interface UserMarker {
  province: string
  region: string
  weather: string
  risk: string
  marker_color: 'blue'
}

export interface GeoAnalysisResult {
  user_region: string
  user_province: string
  weather_status: string
  risk_level: string
  marker_color: 'yellow' | 'red' | 'orange' | 'green'
  recommended_packages: InsuranceRecommendation[]
  map_overview: ProvinceOverview[]
  analysis_time: string
  user_marker: UserMarker
}

export interface AnalyzeWeatherInsuranceRequest {
  user_profile: UserProfile
  weather_data: WeatherData
}

/**
 * Phân tích địa chỉ và thời tiết để đề xuất bảo hiểm
 */
export async function analyzeWeatherInsurance(
  request: AnalyzeWeatherInsuranceRequest
): Promise<GeoAnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/analyze-weather-insurance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to analyze weather insurance')
  }

  return response.json()
}

/**
 * Phân tích document đã upload để trích xuất địa chỉ và phân tích vị trí
 */
export async function analyzeDocumentLocation(
  documentId: string
): Promise<{
  document_id: string
  analysis: GeoAnalysisResult
  message: string
}> {
  const response = await fetch(
    `${API_BASE_URL}/analyze-document-location?document_id=${documentId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to analyze document location')
  }

  return response.json()
}

/**
 * Mock function để test mà không cần gọi API thật
 * @deprecated Không còn sử dụng - Đã chuyển sang sử dụng API thật
 * @see analyzeDocumentLocation
 * @see analyzeWeatherInsurance
 */
export function mockGeoAnalysis(address: string): GeoAnalysisResult {
  // Detect region from address
  const addressLower = address.toLowerCase()
  let region = 'Miền Nam'
  let province = 'TP.HCM'
  let risk_level = 'Thấp'
  let weather_status = 'Ổn định'
  let marker_color: 'yellow' | 'red' | 'orange' | 'green' = 'green'

  if (addressLower.includes('hà tĩnh')) {
    region = 'Miền Trung'
    province = 'Hà Tĩnh'
    risk_level = 'Cao'
    weather_status = 'Ngập lụt nghiêm trọng'
    marker_color = 'yellow'
  } else if (
    addressLower.includes('nghệ an') ||
    addressLower.includes('quảng bình') ||
    addressLower.includes('quảng trị')
  ) {
    region = 'Miền Trung'
    province = addressLower.includes('nghệ an')
      ? 'Nghệ An'
      : addressLower.includes('quảng bình')
        ? 'Quảng Bình'
        : 'Quảng Trị'
    risk_level = 'Cao'
    weather_status = 'Lũ lụt'
    marker_color = 'yellow'
  } else if (
    addressLower.includes('hà nội') ||
    addressLower.includes('hải phòng') ||
    addressLower.includes('quảng ninh')
  ) {
    region = 'Miền Bắc'
    province = addressLower.includes('hà nội')
      ? 'Hà Nội'
      : addressLower.includes('hải phòng')
        ? 'Hải Phòng'
        : 'Quảng Ninh'
    risk_level = 'Cao'
    weather_status = 'Cảnh báo bão'
    marker_color = 'red'
  }

  return {
    user_region: region,
    user_province: province,
    weather_status: weather_status,
    risk_level: risk_level,
    marker_color: marker_color,
    recommended_packages: [
      {
        package: 'Bảo hiểm thiên tai tổng hợp',
        percent: 95,
        reason: `Khu vực ${province} có ${weather_status.toLowerCase()}, nguy cơ thiệt hại cao.`,
      },
      {
        package: 'Bảo hiểm phương tiện ngập nước',
        percent: 90,
        reason: 'Nguy cơ ngập úng cao, phương tiện có thể bị hư hại.',
      },
      {
        package: 'Bảo hiểm nhà cửa thiên tai',
        percent: 85,
        reason: 'Bảo vệ tài sản nhà cửa khỏi thiên tai.',
      },
    ],
    map_overview: [
      {
        province: 'Hà Tĩnh',
        region: 'Miền Trung',
        weather: 'Ngập lụt',
        marker_color: 'yellow',
        risk: 'Cao',
      },
      {
        province: 'Nghệ An',
        region: 'Miền Trung',
        weather: 'Mưa to',
        marker_color: 'yellow',
        risk: 'Trung bình',
      },
      {
        province: 'Hà Nội',
        region: 'Miền Bắc',
        weather: 'Cảnh báo bão',
        marker_color: 'red',
        risk: 'Cao',
      },
    ],
    analysis_time: new Date().toISOString(),
    user_marker: {
      province: province,
      region: region,
      weather: weather_status,
      risk: risk_level,
      marker_color: 'blue',
    },
  }
}
