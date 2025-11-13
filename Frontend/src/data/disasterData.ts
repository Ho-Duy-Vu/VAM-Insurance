export interface DisasterLocation {
  id: string
  province: string
  region: 'Bắc' | 'Trung' | 'Nam'
  coordinates: [number, number] // [lat, lng]
  status: 'ngập_lụt' | 'cảnh_báo_bão' | 'ổn_định' | 'mưa_lớn'
  marker_color: 'yellow' | 'red' | 'green' | 'orange'
  severity: 'critical' | 'warning' | 'safe' | 'moderate'
  advice: string
  detail: string
  recommended_packages: string[]
  lastUpdated: string
  weatherInfo?: {
    temperature?: string
    rainfall?: string
    windSpeed?: string
  }
}

// Dữ liệu thực tế về tình hình thiên tai các tỉnh Việt Nam
export const disasterLocations: DisasterLocation[] = [
  // ===== MIỀN BẮC =====
  {
    id: 'hanoi',
    province: 'Hà Nội',
    region: 'Bắc',
    coordinates: [21.0285, 105.8542],
    status: 'cảnh_báo_bão',
    marker_color: 'red',
    severity: 'warning',
    advice: 'Sắp có áp thấp nhiệt đới gây mưa lớn. Nguy cơ ngập úng khu vực trũng thấp.',
    detail: 'Dự báo mưa to đến rất to trong 3-5 ngày tới. Người dân cần chủ động phòng tránh, gia cố tài sản.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Ngập Lụt', 'Bảo Hiểm Phương Tiện Thiên Tai', 'Bảo Hiểm Sức Khỏe Gia Đình'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '24-28°C',
      rainfall: '100-200mm',
      windSpeed: '50-75 km/h'
    }
  },
  {
    id: 'hai-phong',
    province: 'Hải Phòng',
    region: 'Bắc',
    coordinates: [20.8449, 106.6881],
    status: 'cảnh_báo_bão',
    marker_color: 'red',
    severity: 'critical',
    advice: 'Vùng ven biển có nguy cơ cao chịu ảnh hưởng bão. Khuyến cáo di dời người và tài sản.',
    detail: 'Bão số 7 đang tiến vào vùng biển Bắc Bộ. Cấm biển, sơ tán dân vùng nguy hiểm.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Bão', 'Bảo Hiểm Nhân Thọ Cao Cấp', 'Bảo Hiểm Sức Khỏe Gia Đình'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '22-26°C',
      rainfall: '200-350mm',
      windSpeed: '80-120 km/h'
    }
  },
  {
    id: 'quang-ninh',
    province: 'Quảng Ninh',
    region: 'Bắc',
    coordinates: [21.0064, 107.2925],
    status: 'cảnh_báo_bão',
    marker_color: 'red',
    severity: 'critical',
    advice: 'Vùng ven biển nguy cơ cao bị ảnh hưởng bão, sóng lớn. Cần neo đậu tàu thuyền.',
    detail: 'Khu vực Hạ Long, Cẩm Phả có gió giật mạnh, sóng cao 3-5m. Cấm biển toàn tỉnh.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Bão', 'Bảo Hiểm Sức Khỏe Gia Đình', 'Bảo Hiểm Y Tế Quốc Tế'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '20-25°C',
      rainfall: '150-300mm',
      windSpeed: '90-130 km/h'
    }
  },
  {
    id: 'thai-nguyen',
    province: 'Thái Nguyên',
    region: 'Bắc',
    coordinates: [21.5671, 105.8252],
    status: 'mưa_lớn',
    marker_color: 'orange',
    severity: 'moderate',
    advice: 'Mưa lớn kéo dài, nguy cơ sạt lở đất vùng núi. Cảnh giác với lũ quét.',
    detail: 'Các huyện miền núi cần theo dõi mực nước suối, khe. Di dời nếu có dấu hiệu nguy hiểm.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Ngập Lụt', 'Bảo Hiểm Nhân Thọ Cao Cấp', 'Bảo Hiểm Sức Khỏe Gia Đình'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '22-27°C',
      rainfall: '80-150mm',
      windSpeed: '30-50 km/h'
    }
  },
  {
    id: 'nam-dinh',
    province: 'Nam Định',
    region: 'Bắc',
    coordinates: [20.4389, 106.1621],
    status: 'ổn_định',
    marker_color: 'green',
    severity: 'safe',
    advice: 'Thời tiết ổn định. Nên duy trì bảo hiểm sức khỏe và tài sản định kỳ.',
    detail: 'Hiện không có cảnh báo thiên tai. Khuyến khích mua bảo hiểm phòng ngừa rủi ro.',
    recommended_packages: ['Bảo Hiểm Sức Khỏe Gia Đình', 'Bảo Hiểm Phương Tiện Thiên Tai'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '25-30°C',
      rainfall: '10-30mm',
      windSpeed: '15-25 km/h'
    }
  },

  // ===== MIỀN TRUNG =====
  {
    id: 'nghe-an',
    province: 'Nghệ An',
    region: 'Trung',
    coordinates: [18.6792, 105.6828],
    status: 'ngập_lụt',
    marker_color: 'yellow',
    severity: 'critical',
    advice: 'Khu vực đang ngập sâu do mưa lũ kéo dài. Cần di dời khẩn cấp người và tài sản.',
    detail: 'Nhiều xã vùng trũng bị cô lập. Mực nước lũ cao hơn báo động 3. Huy động lực lượng cứu hộ.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Ngập Lụt', 'Bảo Hiểm Nhân Thọ Cao Cấp', 'Bảo Hiểm Phương Tiện Thiên Tai'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '24-29°C',
      rainfall: '300-500mm',
      windSpeed: '40-60 km/h'
    }
  },
  {
    id: 'ha-tinh',
    province: 'Hà Tĩnh',
    region: 'Trung',
    coordinates: [18.3559, 105.9050],
    status: 'ngập_lụt',
    marker_color: 'yellow',
    severity: 'critical',
    advice: 'Khu vực thường xuyên ngập sâu. Cần bảo hiểm ngập nước cho phương tiện và tài sản.',
    detail: 'Lũ lụt diện rộng, nhiều tuyến đường bị chia cắt. Thiệt hại nặng về tài sản và mùa màng.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Ngập Lụt', 'Bảo Hiểm Phương Tiện Thiên Tai', 'Bảo Hiểm Nhà Ở An Toàn'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '23-28°C',
      rainfall: '350-600mm',
      windSpeed: '45-70 km/h'
    }
  },
  {
    id: 'quang-binh',
    province: 'Quảng Bình',
    region: 'Trung',
    coordinates: [17.4676, 106.6234],
    status: 'ngập_lụt',
    marker_color: 'yellow',
    severity: 'critical',
    advice: 'Vùng núi có nguy cơ sạt lở cao. Vùng đồng bằng ngập lụt nghiêm trọng.',
    detail: 'Đập thủy điện xả lũ, mực nước sông lên cao. Hàng nghìn hộ dân bị ngập, cần cứu trợ.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Ngập Lụt', 'Bảo Hiểm Sức Khỏe Gia Đình', 'Bảo Hiểm Nhân Thọ Cao Cấp'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '23-27°C',
      rainfall: '400-700mm',
      windSpeed: '50-80 km/h'
    }
  },
  {
    id: 'quang-tri',
    province: 'Quảng Trị',
    region: 'Trung',
    coordinates: [16.7504, 107.1857],
    status: 'ngập_lụt',
    marker_color: 'yellow',
    severity: 'critical',
    advice: 'Lũ lịch sử, nhiều khu vực ngập sâu 3-5m. Di dời dân khẩn cấp.',
    detail: 'Đông Hà, Quảng Trị ngập nặng. Giao thông tê liệt, thiệt hại lớn về người và tài sản.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Ngập Lụt', 'Bảo Hiểm Nhân Thọ Cao Cấp', 'Bảo Hiểm Sức Khỏe Gia Đình'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '24-28°C',
      rainfall: '500-800mm',
      windSpeed: '60-90 km/h'
    }
  },
  {
    id: 'thua-thien-hue',
    province: 'Thừa Thiên Huế',
    region: 'Trung',
    coordinates: [16.4637, 107.5909],
    status: 'mưa_lớn',
    marker_color: 'orange',
    severity: 'warning',
    advice: 'Mưa lớn kéo dài, nguy cơ ngập úng và sạt lở. Theo dõi sát diễn biến thời tiết.',
    detail: 'TP Huế và các huyện miền núi có mưa to đến rất to. Cảnh báo lũ quét, sạt lở đất.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Ngập Lụt', 'Bảo Hiểm Phương Tiện Thiên Tai', 'Bảo Hiểm Nhân Thọ Cao Cấp'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '24-29°C',
      rainfall: '200-400mm',
      windSpeed: '40-65 km/h'
    }
  },
  {
    id: 'da-nang',
    province: 'Đà Nẵng',
    region: 'Trung',
    coordinates: [16.0544, 108.2022],
    status: 'cảnh_báo_bão',
    marker_color: 'red',
    severity: 'warning',
    advice: 'Cảnh báo bão, sóng lớn. Du khách nên hủy hoặc hoãn chuyến đi.',
    detail: 'Bãi biển đóng cửa, cấm tắm biển. Các resort ven biển chằng chống tài sản.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Bão', 'Bảo Hiểm Y Tế Quốc Tế', 'Bảo Hiểm Sức Khỏe Gia Đình'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '25-30°C',
      rainfall: '150-250mm',
      windSpeed: '70-100 km/h'
    }
  },
  {
    id: 'quang-nam',
    province: 'Quảng Nam',
    region: 'Trung',
    coordinates: [15.5394, 108.0191],
    status: 'ngập_lụt',
    marker_color: 'yellow',
    severity: 'critical',
    advice: 'Lũ lớn, nhiều điểm sạt lở nghiêm trọng. Hội An ngập sâu, cô lập nhiều xã miền núi.',
    detail: 'Phố cổ Hội An ngập 1-2m. Nam Trà My, Bắc Trà My bị cô lập hoàn toàn do sạt lở.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Ngập Lụt', 'Bảo Hiểm Nhân Thọ Cao Cấp', 'Bảo Hiểm Y Tế Quốc Tế'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '23-28°C',
      rainfall: '400-650mm',
      windSpeed: '55-85 km/h'
    }
  },
  {
    id: 'quang-ngai',
    province: 'Quảng Ngãi',
    region: 'Trung',
    coordinates: [15.1214, 108.8044],
    status: 'mưa_lớn',
    marker_color: 'orange',
    severity: 'warning',
    advice: 'Mưa lớn diện rộng, cảnh báo lũ quét vùng núi. Nguy cơ ngập úng vùng trũng.',
    detail: 'Các huyện Ba Tơ, Sơn Tây, Trà Bồng có mưa rất to. Theo dõi mực nước các hồ chứa.',
    recommended_packages: ['Bảo Hiểm Thiệt Hại Do Ngập Lụt', 'Bảo Hiểm Sức Khỏe Gia Đình', 'Bảo Hiểm Nhân Thọ Cao Cấp'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '24-29°C',
      rainfall: '180-300mm',
      windSpeed: '40-60 km/h'
    }
  },

  // ===== MIỀN NAM =====
  {
    id: 'tp-hcm',
    province: 'TP Hồ Chí Minh',
    region: 'Nam',
    coordinates: [10.8231, 106.6297],
    status: 'ổn_định',
    marker_color: 'green',
    severity: 'safe',
    advice: 'Thời tiết ổn định, không có cảnh báo thiên tai. Khuyến khích bảo hiểm phòng ngừa.',
    detail: 'Mùa khô, nắng nhẹ. Người dân nên duy trì bảo hiểm y tế và tài sản thường xuyên.',
    recommended_packages: ['Bảo Hiểm Sức Khỏe Gia Đình', 'Bảo Hiểm Phương Tiện Thiên Tai', 'Bảo Hiểm Nhân Thọ Cao Cấp'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '28-34°C',
      rainfall: '10-30mm',
      windSpeed: '10-20 km/h'
    }
  },
  {
    id: 'can-tho',
    province: 'Cần Thơ',
    region: 'Nam',
    coordinates: [10.0452, 105.7469],
    status: 'ổn_định',
    marker_color: 'green',
    severity: 'safe',
    advice: 'Thời tiết thuận lợi cho hoạt động nông nghiệp. Nên mua bảo hiểm mùa màng.',
    detail: 'Mực nước sông ổn định. Khuyến khích bảo hiểm nông nghiệp và tài sản.',
    recommended_packages: ['Bảo Hiểm Sức Khỏe Gia Đình', 'Bảo Hiểm Xe Toàn Diện'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '27-33°C',
      rainfall: '20-50mm',
      windSpeed: '15-25 km/h'
    }
  },
  {
    id: 'ba-ria-vung-tau',
    province: 'Bà Rịa - Vũng Tàu',
    region: 'Nam',
    coordinates: [10.5417, 107.2430],
    status: 'ổn_định',
    marker_color: 'green',
    severity: 'safe',
    advice: 'Biển êm, thời tiết đẹp. Thích hợp cho du lịch, vui chơi giải trí.',
    detail: 'Không có cảnh báo thiên tai. Du khách nên mua bảo hiểm du lịch để an tâm.',
    recommended_packages: ['Bảo Hiểm Y Tế Quốc Tế', 'Bảo Hiểm Sức Khỏe Gia Đình'],
    lastUpdated: '2025-10-29',
    weatherInfo: {
      temperature: '26-32°C',
      rainfall: '15-40mm',
      windSpeed: '12-22 km/h'
    }
  }
]

// Helper functions
export const getLocationsByRegion = (region: 'Bắc' | 'Trung' | 'Nam') => {
  return disasterLocations.filter(loc => loc.region === region)
}

export const getLocationsByStatus = (status: DisasterLocation['status']) => {
  return disasterLocations.filter(loc => loc.status === status)
}

export const getLocationsBySeverity = (severity: DisasterLocation['severity']) => {
  return disasterLocations.filter(loc => loc.severity === severity)
}

export const searchLocationByProvince = (provinceName: string) => {
  return disasterLocations.find(loc => 
    loc.province.toLowerCase().includes(provinceName.toLowerCase())
  )
}

// Geocoding helper - tìm tọa độ từ địa chỉ
export const findCoordinatesFromAddress = (address: string): [number, number] | null => {
  // Tìm tỉnh/thành trong địa chỉ
  const location = disasterLocations.find(loc => 
    address.toLowerCase().includes(loc.province.toLowerCase())
  )
  return location ? location.coordinates : null
}

// Gợi ý gói bảo hiểm dựa vào vùng
export const getRecommendedPackagesByRegion = (region: 'Bắc' | 'Trung' | 'Nam'): string[] => {
  const locations = getLocationsByRegion(region)
  const packages = new Set<string>()
  
  locations.forEach(loc => {
    loc.recommended_packages.forEach(pkg => packages.add(pkg))
  })
  
  return Array.from(packages)
}
