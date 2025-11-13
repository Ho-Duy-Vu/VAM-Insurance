"""
AI Insurance Geo-Analyst
Phân tích địa chỉ, thời tiết và đề xuất bảo hiểm theo vùng miền
"""
import re
from typing import Dict, List, Optional
from datetime import datetime

# Danh sách tỉnh thành theo vùng miền
REGION_MAPPING = {
    "Miền Bắc": [
        "hà nội", "hải phòng", "quảng ninh", "nam định", "thái bình",
        "bắc giang", "bắc ninh", "hải dương", "hưng yên", "vĩnh phúc",
        "phú thọ", "thái nguyên", "lạng sơn", "cao bằng", "lào cai",
        "yên bái", "tuyên quang", "hà giang", "điện biên", "lai châu",
        "sơn la", "hòa bình", "ninh bình"
    ],
    "Miền Trung": [
        "thanh hóa", "nghệ an", "hà tĩnh", "quảng bình", "quảng trị",
        "thừa thiên huế", "đà nẵng", "quảng nam", "quảng ngãi", "bình định",
        "phú yên", "khánh hòa", "ninh thuận", "bình thuận", "kon tum",
        "gia lai", "đắk lắk", "đắk nông", "lâm đồng"
    ],
    "Miền Nam": [
        "tp.hcm", "hồ chí minh", "sài gòn", "bình dương", "đồng nai",
        "bà rịa", "vũng tàu", "bình phước", "tây ninh", "long an",
        "tiền giang", "bến tre", "trà vinh", "vĩnh long", "đồng tháp",
        "an giang", "kiên giang", "cần thơ", "hậu giang", "sóc trăng",
        "bạc liêu", "cà mau"
    ]
}

# Mức độ rủi ro thiên tai theo tỉnh (dựa trên lịch sử)
HIGH_RISK_PROVINCES = {
    "hà tĩnh": {"risk": "Cao", "common_disasters": ["lũ lụt", "ngập úng", "bão"]},
    "nghệ an": {"risk": "Cao", "common_disasters": ["lũ lụt", "ngập úng", "bão"]},
    "quảng bình": {"risk": "Cao", "common_disasters": ["lũ lụt", "ngập úng"]},
    "quảng trị": {"risk": "Cao", "common_disasters": ["lũ lụt", "bão"]},
    "thừa thiên huế": {"risk": "Cao", "common_disasters": ["lũ lụt", "bão"]},
    "quảng nam": {"risk": "Cao", "common_disasters": ["lũ lụt", "bão", "sạt lở"]},
    "quảng ngãi": {"risk": "Cao", "common_disasters": ["bão", "lũ lụt"]},
    "quảng ninh": {"risk": "Cao", "common_disasters": ["bão", "sóng biển"]},
    "hải phòng": {"risk": "Trung bình", "common_disasters": ["bão", "ngập úng"]},
    "thanh hóa": {"risk": "Trung bình", "common_disasters": ["lũ lụt", "bão"]},
}

# Logic đề xuất bảo hiểm theo điều kiện thời tiết
INSURANCE_RULES = [
    {
        "keywords": ["bão", "cảnh báo bão", "siêu bão", "áp thấp nhiệt đới"],
        "package": "Bảo hiểm thiên tai tổng hợp",
        "percent": 95,
        "reason": "Khu vực có cảnh báo bão, nguy cơ thiệt hại cao về người và tài sản."
    },
    {
        "keywords": ["ngập", "mưa lớn", "mưa to", "triều cường"],
        "package": "Bảo hiểm phương tiện ngập nước",
        "percent": 90,
        "reason": "Nguy cơ ngập úng cao, phương tiện có thể bị hư hại do nước."
    },
    {
        "keywords": ["lụt", "lũ", "lũ quét", "ngập sâu"],
        "package": "Bảo hiểm nhà cửa thiên tai",
        "percent": 85,
        "reason": "Nguy cơ hư hại nhà cửa và tài sản do lũ lụt."
    },
    {
        "keywords": ["thời tiết khắc nghiệt", "mưa kéo dài", "rét đậm"],
        "package": "Bảo hiểm sức khỏe thiên tai",
        "percent": 80,
        "reason": "Thời tiết khắc nghiệt ảnh hưởng đến sức khỏe, nguy cơ bệnh tật cao."
    },
    {
        "keywords": ["giao thông nguy hiểm", "sương mù", "đường trơn"],
        "package": "Bảo hiểm tai nạn cá nhân",
        "percent": 75,
        "reason": "Điều kiện giao thông nguy hiểm, nguy cơ tai nạn cao."
    },
    {
        "keywords": ["sạt lở", "lở đất", "núi lở"],
        "package": "Bảo hiểm tài sản thiên tai",
        "percent": 88,
        "reason": "Nguy cơ sạt lở đất, ảnh hưởng đến tài sản và an toàn."
    }
]


class GeoAnalyst:
    """AI Insurance Geo-Analyst"""
    
    @staticmethod
    def detect_region(address: str) -> Optional[str]:
        """Xác định vùng miền từ địa chỉ"""
        address_lower = address.lower()
        
        for region, provinces in REGION_MAPPING.items():
            for province in provinces:
                if province in address_lower:
                    return region
        
        return None
    
    @staticmethod
    def extract_province(address: str) -> Optional[str]:
        """Trích xuất tên tỉnh/thành phố từ địa chỉ"""
        address_lower = address.lower()
        
        # Tìm trong tất cả các tỉnh
        all_provinces = []
        for provinces in REGION_MAPPING.values():
            all_provinces.extend(provinces)
        
        for province in all_provinces:
            if province in address_lower:
                return province.title()
        
        return None
    
    @staticmethod
    def get_risk_level(province: str, weather_condition: str) -> str:
        """Đánh giá mức độ rủi ro"""
        province_lower = province.lower()
        weather_lower = weather_condition.lower()
        
        # Kiểm tra tỉnh có trong danh sách rủi ro cao
        base_risk = HIGH_RISK_PROVINCES.get(province_lower, {}).get("risk", "Thấp")
        
        # Điều chỉnh dựa trên thời tiết
        high_risk_keywords = ["bão", "lũ", "lụt", "ngập", "sạt lở"]
        if any(keyword in weather_lower for keyword in high_risk_keywords):
            if base_risk == "Thấp":
                return "Trung bình"
            elif base_risk == "Trung bình":
                return "Cao"
            else:
                return "Rất cao"
        
        return base_risk
    
    @staticmethod
    def recommend_insurance(weather_condition: str, alert: str, province: str) -> List[Dict]:
        """Đề xuất gói bảo hiểm dựa trên điều kiện thời tiết"""
        recommendations = []
        combined_text = f"{weather_condition} {alert}".lower()
        
        for rule in INSURANCE_RULES:
            # Kiểm tra keywords
            if any(keyword in combined_text for keyword in rule["keywords"]):
                recommendations.append({
                    "package": rule["package"],
                    "percent": rule["percent"],
                    "reason": rule["reason"]
                })
        
        # Nếu là tỉnh rủi ro cao, thêm gói tổng hợp
        province_lower = province.lower()
        if province_lower in HIGH_RISK_PROVINCES and not any(r["package"] == "Bảo hiểm thiên tai tổng hợp" for r in recommendations):
            recommendations.insert(0, {
                "package": "Bảo hiểm thiên tai tổng hợp",
                "percent": 92,
                "reason": f"{province.title()} là khu vực thường xuyên chịu ảnh hưởng thiên tai."
            })
        
        # Sắp xếp theo % khuyến nghị
        recommendations.sort(key=lambda x: x["percent"], reverse=True)
        
        # Giới hạn top 5
        return recommendations[:5]
    
    @staticmethod
    def get_marker_color(weather_status: str, risk_level: str) -> str:
        """Xác định màu marker trên bản đồ"""
        weather_lower = weather_status.lower()
        
        if "bão" in weather_lower or "siêu bão" in weather_lower or risk_level == "Rất cao":
            return "red"
        elif "ngập" in weather_lower or "lụt" in weather_lower or "mưa lớn" in weather_lower:
            return "yellow"
        elif "mưa" in weather_lower or "cảnh báo" in weather_lower or risk_level == "Trung bình":
            return "orange"
        else:
            return "green"
    
    @staticmethod
    def analyze_user_location(user_profile: Dict, weather_data: Dict) -> Dict:
        """
        Phân tích toàn diện địa chỉ người dùng và đề xuất bảo hiểm
        
        Args:
            user_profile: {"full_name", "dob", "address", "place_of_origin", "document_type"}
            weather_data: {"source", "temperature", "condition", "alert"} - Optional, will query DB if not provided
        
        Returns:
            JSON với thông tin vùng, rủi ro, đề xuất bảo hiểm, bản đồ tổng quan
        """
        # Prioritize place_of_origin (quê quán) over address
        address = user_profile.get("place_of_origin") or user_profile.get("address", "")
        
        # Bước 1: Xác định vùng và tỉnh
        region = GeoAnalyst.detect_region(address)
        province = GeoAnalyst.extract_province(address)
        
        if not region or not province:
            return {
                "error": "Không thể xác định vùng miền từ địa chỉ",
                "address": address
            }
        
        # 🔥 Bước 2: Truy vấn DisasterLocation DB để lấy tình trạng lũ lụt thực tế
        disaster_data = None
        recommendations = []
        weather_condition = ""
        alert = ""
        risk_level = "Thấp"
        marker_color = "green"
        
        try:
            from app.database import SessionLocal
            from app.models import DisasterLocation
            import json
            
            db = SessionLocal()
            
            # Normalize province name for DB query
            province_normalized = province.title()
            
            # Special handling for common variations
            province_aliases = {
                'hồ chí minh': 'TP Hồ Chí Minh',
                'tp.hcm': 'TP Hồ Chí Minh',
                'hcm': 'TP Hồ Chí Minh',
                'sài gòn': 'TP Hồ Chí Minh',
                'vũng tàu': 'Bà Rịa - Vũng Tàu',
                'bà rịa': 'Bà Rịa - Vũng Tàu',
                'huế': 'Thừa Thiên Huế',
                'thừa thiên huế': 'Thừa Thiên Huế'
            }
            
            province_for_query = province_aliases.get(province.lower(), province_normalized)
            
            print(f"\n🌍 [GeoAnalyst] Querying DisasterLocation for: {province_for_query}")
            
            disaster_location = db.query(DisasterLocation).filter(
                DisasterLocation.province == province_for_query
            ).first()
            
            if disaster_location:
                print(f"   ✅ Found disaster data: {disaster_location.status} - {disaster_location.severity}")
                
                # Extract real disaster data from DB
                disaster_data = {
                    "province": disaster_location.province,
                    "region": disaster_location.region,
                    "status": disaster_location.status,
                    "severity": disaster_location.severity,
                    "marker_color": disaster_location.marker_color,
                    "advice": disaster_location.advice,
                    "detail": disaster_location.detail
                }
                
                # Override with real data from DB
                weather_condition = disaster_location.status.replace('_', ' ').title()
                alert = f"Mức độ: {disaster_location.severity}"
                risk_level = disaster_location.severity
                marker_color = disaster_location.marker_color
                
                # 🔥 Map recommended packages from DB
                if disaster_location.recommended_packages:
                    package_mapping = {
                        "bh_thien_tai_mien_bac": {
                            "package": "Bảo Hiểm Thiệt Hại Do Ngập Lụt",
                            "package_id": "flood-basic",
                            "percent": 95,
                            "reason": "Bảo vệ tài sản nhà cửa, đồ đạc khỏi thiệt hại do ngập lụt, lũ quét tại các vùng có nguy cơ cao"
                        },
                        "bh_thien_tai_mien_trung": {
                            "package": "Bảo Hiểm Thiệt Hại Do Bão",
                            "package_id": "storm-comprehensive",
                            "percent": 95,
                            "reason": "Bảo vệ toàn diện tài sản khỏi thiệt hại do bão, gió lốc, sét đánh tại khu vực ven biển"
                        },
                        "bh_xe_co_gioi": {
                            "package": "Bảo Hiểm Phương Tiện Thiên Tai",
                            "package_id": "disaster-vehicle",
                            "percent": 90,
                            "reason": "Bảo vệ xe ô tô, xe máy khỏi thiệt hại do ngập nước, bão, lũ, cây đổ"
                        },
                        "bh_xe_ngap_nuoc": {
                            "package": "Bảo Hiểm Xe Ngập Nước",
                            "package_id": "vehicle-flood",
                            "percent": 92,
                            "reason": "Bồi thường chi phí sửa chữa động cơ, hệ thống điện bị hư hỏng do ngập nước"
                        },
                        "bh_tai_san": {
                            "package": "Bảo Hiểm Tài Sản Gia Đình",
                            "package_id": "property-general",
                            "percent": 88,
                            "reason": "Bảo vệ tài sản, đồ đạc trong nhà khỏi thiệt hại do thiên tai"
                        },
                        "bh_nha_o": {
                            "package": "Bảo Hiểm Nhà Ở Trước Bão",
                            "package_id": "home-storm",
                            "percent": 93,
                            "reason": "Đảm bảo chi phí sửa chữa hoặc xây dựng lại nhà cửa bị hư hại do bão"
                        },
                        "bh_nha_cua": {
                            "package": "Bảo Hiểm Nhà Cửa Thiên Tai",
                            "package_id": "home-disaster",
                            "percent": 93,
                            "reason": "Bảo vệ nhà cửa khỏi thiệt hại do thiên tai (bão, lũ, sét đánh)"
                        },
                        "bh_than_the": {
                            "package": "Bảo Hiểm Thân Thể Tai Nạn",
                            "package_id": "personal-accident",
                            "percent": 85,
                            "reason": "Bảo vệ sức khỏe và tính mạng khi gặp tai nạn do thiên tai"
                        },
                        "bh_suc_khoe": {
                            "package": "Bảo Hiểm Sức Khỏe",
                            "package_id": "health-basic",
                            "percent": 80,
                            "reason": "Bảo vệ sức khỏe toàn diện, đặc biệt trong điều kiện thời tiết khắc nghiệt"
                        },
                        "bh_du_lich": {
                            "package": "Bảo Hiểm Du Lịch",
                            "package_id": "travel-insurance",
                            "percent": 75,
                            "reason": "Bảo vệ an toàn khi di chuyển trong điều kiện thiên tai"
                        },
                        "bh_nong_nghiep": {
                            "package": "Bảo Hiểm Nông Nghiệp",
                            "package_id": "agriculture",
                            "percent": 85,
                            "reason": "Bảo vệ mùa màng, vật nuôi khỏi thiệt hại do thiên tai"
                        }
                    }
                    
                    try:
                        if isinstance(disaster_location.recommended_packages, str):
                            pkg_list = json.loads(disaster_location.recommended_packages)
                        else:
                            pkg_list = disaster_location.recommended_packages
                        
                        for pkg_id in pkg_list:
                            if pkg_id in package_mapping:
                                pkg_info = package_mapping[pkg_id]
                                recommendations.append({
                                    "package": pkg_info["package"],
                                    "package_id": pkg_info["package_id"],
                                    "percent": pkg_info["percent"],
                                    "reason": f"⚠️ {disaster_location.province} - {weather_condition}: {pkg_info['reason']}"
                                })
                        
                        print(f"   ✅ Mapped {len(recommendations)} packages from DB")
                        
                    except Exception as e:
                        print(f"   ⚠️  Error parsing recommended_packages: {e}")
                        # Fallback to default recommendations
                        pass
            else:
                print(f"   ⚠️  No disaster data found for {province_for_query}, using fallback")
            
            db.close()
            
        except Exception as e:
            print(f"   ❌ Error querying DisasterLocation: {e}")
            import traceback
            traceback.print_exc()
        
        # Fallback to old logic if no disaster data or no recommendations
        if not recommendations:
            print("   📋 Using fallback recommendation logic")
            weather_condition = weather_data.get("condition", "Ổn định")
            alert = weather_data.get("alert", "")
            risk_level = GeoAnalyst.get_risk_level(province, f"{weather_condition} {alert}")
            recommendations = GeoAnalyst.recommend_insurance(weather_condition, alert, province)
            marker_color = GeoAnalyst.get_marker_color(f"{weather_condition} {alert}", risk_level)
        
        # Bước 5: Tạo map overview (các tỉnh lân cận hoặc cùng vùng)
        map_overview = GeoAnalyst.generate_map_overview(region, province)
        
        result = {
            "user_region": region,
            "user_province": province.title(),
            "weather_status": f"{weather_condition} - {alert}" if alert else weather_condition,
            "risk_level": risk_level,
            "marker_color": marker_color,
            "recommended_packages": recommendations,
            "map_overview": map_overview,
            "analysis_time": datetime.now().isoformat(),
            "user_marker": {
                "province": province.title(),
                "region": region,
                "weather": weather_condition,
                "risk": risk_level,
                "marker_color": marker_color  # Use real marker color from DB
            }
        }
        
        # Add disaster data if available
        if disaster_data:
            result["disaster_info"] = disaster_data
        
        return result
    
    @staticmethod
    def generate_map_overview(user_region: str, user_province: str) -> List[Dict]:
        """
        Tạo danh sách các tỉnh hiển thị trên bản đồ
        Sử dụng dữ liệu thực từ DisasterLocation DB
        """
        overview = []
        
        try:
            from app.database import SessionLocal
            from app.models import DisasterLocation
            
            db = SessionLocal()
            
            print(f"\n🗺️  [GeoAnalyst] Generating map overview for region: {user_region}")
            
            # Get all disaster locations from DB
            all_disasters = db.query(DisasterLocation).all()
            
            if all_disasters:
                print(f"   ✅ Found {len(all_disasters)} disaster locations in DB")
                
                # Prioritize provinces from the same region
                same_region = []
                other_regions = []
                
                for disaster in all_disasters:
                    disaster_dict = {
                        "province": disaster.province,
                        "region": disaster.region,
                        "weather": disaster.status.replace('_', ' ').title(),
                        "marker_color": disaster.marker_color,
                        "risk": disaster.severity,
                        "latitude": disaster.latitude,
                        "longitude": disaster.longitude,
                        "detail": disaster.detail[:100] + "..." if disaster.detail and len(disaster.detail) > 100 else disaster.detail
                    }
                    
                    # Map region names
                    region_map = {
                        "Bắc": "Miền Bắc",
                        "Trung": "Miền Trung", 
                        "Nam": "Miền Nam"
                    }
                    
                    disaster_region = region_map.get(disaster.region, disaster.region)
                    disaster_dict["region"] = disaster_region
                    
                    if disaster_region == user_region:
                        same_region.append(disaster_dict)
                    else:
                        other_regions.append(disaster_dict)
                
                # Add same region provinces first (limit 8)
                overview.extend(same_region[:8])
                
                # Add 2-3 provinces from other regions for comparison
                overview.extend(other_regions[:2])
                
                print(f"   ✅ Generated map overview with {len(overview)} locations")
                
            else:
                print(f"   ⚠️  No disaster data in DB, using fallback")
                # Fallback to sample data
                overview = GeoAnalyst._generate_fallback_map_overview(user_region)
            
            db.close()
            
        except Exception as e:
            print(f"   ❌ Error generating map overview: {e}")
            import traceback
            traceback.print_exc()
            # Fallback to sample data
            overview = GeoAnalyst._generate_fallback_map_overview(user_region)
        
        return overview
    
    @staticmethod
    def _generate_fallback_map_overview(user_region: str) -> List[Dict]:
        """Fallback map overview using sample data"""
        sample_weather_data = {
            "hà tĩnh": {"weather": "Ngập lụt", "marker_color": "red", "risk": "Cao"},
            "nghệ an": {"weather": "Ngập lụt", "marker_color": "red", "risk": "Cao"},
            "quảng bình": {"weather": "Ngập lụt", "marker_color": "red", "risk": "Cao"},
            "quảng trị": {"weather": "Ngập lụt", "marker_color": "red", "risk": "Cao"},
            "thừa thiên huế": {"weather": "Mưa lớn", "marker_color": "blue", "risk": "Trung bình"},
            "đà nẵng": {"weather": "Cảnh báo bão", "marker_color": "red", "risk": "Trung bình"},
            "quảng nam": {"weather": "Ngập lụt", "marker_color": "red", "risk": "Cao"},
            "quảng ngãi": {"weather": "Mưa lớn", "marker_color": "blue", "risk": "Trung bình"},
            "hà nội": {"weather": "Cảnh báo bão", "marker_color": "red", "risk": "Trung bình"},
            "hải phòng": {"weather": "Cảnh báo bão", "marker_color": "red", "risk": "Cao"},
            "quảng ninh": {"weather": "Cảnh báo bão", "marker_color": "red", "risk": "Cao"},
            "thái nguyên": {"weather": "Mưa lớn", "marker_color": "blue", "risk": "Trung bình"},
            "nam định": {"weather": "Ổn định", "marker_color": "green", "risk": "Thấp"},
            "tp.hcm": {"weather": "Ổn định", "marker_color": "green", "risk": "Thấp"},
            "cần thơ": {"weather": "Ổn định", "marker_color": "green", "risk": "Thấp"},
            "bà rịa - vũng tàu": {"weather": "Ổn định", "marker_color": "green", "risk": "Thấp"}
        }
        
        overview = []
        target_provinces = REGION_MAPPING.get(user_region, [])
        
        for province in target_provinces[:8]:  # Limit 8 provinces
            province_data = sample_weather_data.get(province.lower(), {
                "weather": "Ổn định",
                "marker_color": "green",
                "risk": "Thấp"
            })
            
            overview.append({
                "province": province.title(),
                "region": user_region,
                "weather": province_data["weather"],
                "marker_color": province_data["marker_color"],
                "risk": province_data["risk"]
            })
        
        # Add 1-2 provinces from other regions for comparison
        if user_region != "Miền Bắc":
            overview.append({
                "province": "Hà Nội",
                "region": "Miền Bắc",
                "weather": "Cảnh báo bão",
                "marker_color": "red",
                "risk": "Trung bình"
            })
        
        if user_region != "Miền Nam":
            overview.append({
                "province": "TP Hồ Chí Minh",
                "region": "Miền Nam",
                "weather": "Ổn định",
                "marker_color": "green",
                "risk": "Thấp"
            })
        
        return overview


# Gemini Prompt Template
GEMINI_PROMPT_TEMPLATE = """
Bạn là AI Insurance Geo-Analyst của hệ thống VAM Insurance.

Hãy phân tích dữ liệu JSON sau và trả về kết quả phân tích:

**Dữ liệu đầu vào:**
```json
{json_input}
```

**Yêu cầu:**
1. Đọc địa chỉ từ user_profile và xác định vùng miền (Bắc/Trung/Nam)
2. Dựa trên weather_data, đánh giá mức độ rủi ro thiên tai
3. Đề xuất các gói bảo hiểm phù hợp với % khuyến nghị
4. Tạo danh sách các tỉnh có tình hình thiên tai tương tự (map_overview)

**Quy tắc đề xuất bảo hiểm:**
- Có "bão" hoặc "cảnh báo bão" → Bảo hiểm thiên tai tổng hợp (95%)
- Có "ngập" hoặc "mưa lớn" → Bảo hiểm phương tiện ngập nước (90%)
- Có "lụt" hoặc "lũ" → Bảo hiểm nhà cửa thiên tai (85%)
- Thời tiết khắc nghiệt → Bảo hiểm sức khỏe thiên tai (80%)
- Giao thông nguy hiểm → Bảo hiểm tai nạn cá nhân (75%)

**Định dạng output (ONLY JSON, không có markdown):**
```json
{{
  "user_region": "string",
  "user_province": "string",
  "weather_status": "string",
  "risk_level": "string",
  "marker_color": "yellow|red|orange|green",
  "recommended_packages": [
    {{
      "package": "string",
      "percent": number,
      "reason": "string"
    }}
  ],
  "map_overview": [
    {{
      "province": "string",
      "region": "string",
      "weather": "string",
      "marker_color": "string",
      "risk": "string"
    }}
  ]
}}
```

Chỉ trả về JSON, không thêm giải thích.
"""


def generate_gemini_prompt(user_profile: Dict, weather_data: Dict) -> str:
    """Tạo prompt cho Gemini API"""
    import json
    
    json_input = json.dumps({
        "user_profile": user_profile,
        "weather_data": weather_data
    }, ensure_ascii=False, indent=2)
    
    return GEMINI_PROMPT_TEMPLATE.format(json_input=json_input)
