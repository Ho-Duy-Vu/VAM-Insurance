"""
Seed disaster locations from Frontend mock data to database
Run this script once to populate disaster_locations table
"""

import json
from datetime import datetime
from app.database import SessionLocal, init_db
from app.models import DisasterLocation

# Mock data from Frontend/src/data/disasterData.ts
DISASTER_LOCATIONS = [
    # ===== MIỀN BẮC =====
    {
        "id": "hanoi",
        "province": "Hà Nội",
        "region": "Bắc",
        "latitude": "21.0285",
        "longitude": "105.8542",
        "status": "cảnh_báo_bão",
        "marker_color": "red",
        "severity": "Trung bình",
        "advice": "Sắp có áp thấp nhiệt đới gây mưa lớn. Nguy cơ ngập úng khu vực trũng thấp.",
        "detail": "Dự báo mưa to đến rất to trong 3-5 ngày tới. Người dân cần chủ động phòng tránh, gia cố tài sản.",
        "recommended_packages": ["bh_thien_tai_mien_bac", "bh_xe_co_gioi", "bh_tai_san"]
    },
    {
        "id": "hai-phong",
        "province": "Hải Phòng",
        "region": "Bắc",
        "latitude": "20.8449",
        "longitude": "106.6881",
        "status": "cảnh_báo_bão",
        "marker_color": "red",
        "severity": "Cao",
        "advice": "Vùng ven biển có nguy cơ cao chịu ảnh hưởng bão. Khuyến cáo di dời người và tài sản.",
        "detail": "Bão số 7 đang tiến vào vùng biển Bắc Bộ. Cấm biển, sơ tán dân vùng nguy hiểm.",
        "recommended_packages": ["bh_thien_tai_mien_bac", "bh_nha_o", "bh_than_the"]
    },
    {
        "id": "quang-ninh",
        "province": "Quảng Ninh",
        "region": "Bắc",
        "latitude": "21.0064",
        "longitude": "107.2925",
        "status": "cảnh_báo_bão",
        "marker_color": "red",
        "severity": "Cao",
        "advice": "Vùng ven biển nguy cơ cao bị ảnh hưởng bão, sóng lớn. Cần neo đậu tàu thuyền.",
        "detail": "Khu vực Hạ Long, Cẩm Phả có gió giật mạnh, sóng cao 3-5m. Cấm biển toàn tỉnh.",
        "recommended_packages": ["bh_thien_tai_mien_bac", "bh_tai_san", "bh_du_lich"]
    },
    {
        "id": "thai-nguyen",
        "province": "Thái Nguyên",
        "region": "Bắc",
        "latitude": "21.5671",
        "longitude": "105.8252",
        "status": "mưa_lớn",
        "marker_color": "blue",
        "severity": "Trung bình",
        "advice": "Mưa lớn kéo dài, nguy cơ sạt lở đất vùng núi. Cảnh giác với lũ quét.",
        "detail": "Các huyện miền núi cần theo dõi mực nước suối, khe. Di dời nếu có dấu hiệu nguy hiểm.",
        "recommended_packages": ["bh_thien_tai_mien_bac", "bh_nha_o", "bh_suc_khoe"]
    },
    {
        "id": "nam-dinh",
        "province": "Nam Định",
        "region": "Bắc",
        "latitude": "20.4389",
        "longitude": "106.1621",
        "status": "ổn_định",
        "marker_color": "green",
        "severity": "Thấp",
        "advice": "Thời tiết ổn định. Nên duy trì bảo hiểm sức khỏe và tài sản định kỳ.",
        "detail": "Hiện không có cảnh báo thiên tai. Khuyến khích mua bảo hiểm phòng ngừa rủi ro.",
        "recommended_packages": ["bh_suc_khoe", "bh_xe_co_gioi"]
    },
    
    # ===== MIỀN TRUNG =====
    {
        "id": "nghe-an",
        "province": "Nghệ An",
        "region": "Trung",
        "latitude": "18.6792",
        "longitude": "105.6828",
        "status": "ngập_lụt",
        "marker_color": "red",
        "severity": "Cao",
        "advice": "Khu vực đang ngập sâu do mưa lũ kéo dài. Cần di dời khẩn cấp người và tài sản.",
        "detail": "Nhiều xã vùng trũng bị cô lập. Mực nước lũ cao hơn báo động 3. Huy động lực lượng cứu hộ.",
        "recommended_packages": ["bh_thien_tai_mien_trung", "bh_nha_o", "bh_xe_co_gioi"]
    },
    {
        "id": "ha-tinh",
        "province": "Hà Tĩnh",
        "region": "Trung",
        "latitude": "18.3559",
        "longitude": "105.9050",
        "status": "ngập_lụt",
        "marker_color": "red",
        "severity": "Cao",
        "advice": "Khu vực thường xuyên ngập sâu. Cần bảo hiểm ngập nước cho phương tiện và tài sản.",
        "detail": "Lũ lụt diện rộng, nhiều tuyến đường bị chia cắt. Thiệt hại nặng về tài sản và mùa màng.",
        "recommended_packages": ["bh_thien_tai_mien_trung", "bh_xe_ngap_nuoc", "bh_nha_cua"]
    },
    {
        "id": "quang-binh",
        "province": "Quảng Bình",
        "region": "Trung",
        "latitude": "17.4676",
        "longitude": "106.6234",
        "status": "ngập_lụt",
        "marker_color": "red",
        "severity": "Cao",
        "advice": "Vùng núi có nguy cơ sạt lở cao. Vùng đồng bằng ngập lụt nghiêm trọng.",
        "detail": "Đập thủy điện xả lũ, mực nước sông lên cao. Hàng nghìn hộ dân bị ngập, cần cứu trợ.",
        "recommended_packages": ["bh_thien_tai_mien_trung", "bh_tai_san", "bh_suc_khoe"]
    },
    {
        "id": "quang-tri",
        "province": "Quảng Trị",
        "region": "Trung",
        "latitude": "16.7504",
        "longitude": "107.1857",
        "status": "ngập_lụt",
        "marker_color": "red",
        "severity": "Cao",
        "advice": "Lũ lịch sử, nhiều khu vực ngập sâu 3-5m. Di dời dân khẩn cấp.",
        "detail": "Đông Hà, Quảng Trị ngập nặng. Giao thông tê liệt, thiệt hại lớn về người và tài sản.",
        "recommended_packages": ["bh_thien_tai_mien_trung", "bh_nha_o", "bh_than_the"]
    },
    {
        "id": "thua-thien-hue",
        "province": "Thừa Thiên Huế",
        "region": "Trung",
        "latitude": "16.4637",
        "longitude": "107.5909",
        "status": "mưa_lớn",
        "marker_color": "blue",
        "severity": "Trung bình",
        "advice": "Mưa lớn kéo dài, nguy cơ ngập úng và sạt lở. Theo dõi sát diễn biến thời tiết.",
        "detail": "TP Huế và các huyện miền núi có mưa to đến rất to. Cảnh báo lũ quét, sạt lở đất.",
        "recommended_packages": ["bh_thien_tai_mien_trung", "bh_xe_co_gioi", "bh_nha_o"]
    },
    {
        "id": "da-nang",
        "province": "Đà Nẵng",
        "region": "Trung",
        "latitude": "16.0544",
        "longitude": "108.2022",
        "status": "cảnh_báo_bão",
        "marker_color": "red",
        "severity": "Trung bình",
        "advice": "Cảnh báo bão, sóng lớn. Du khách nên hủy hoặc hoãn chuyến đi.",
        "detail": "Bãi biển đóng cửa, cấm tắm biển. Các resort ven biển chằng chống tài sản.",
        "recommended_packages": ["bh_thien_tai_mien_trung", "bh_du_lich", "bh_tai_san"]
    },
    {
        "id": "quang-nam",
        "province": "Quảng Nam",
        "region": "Trung",
        "latitude": "15.5394",
        "longitude": "108.0191",
        "status": "ngập_lụt",
        "marker_color": "red",
        "severity": "Cao",
        "advice": "Lũ lớn, nhiều điểm sạt lở nghiêm trọng. Hội An ngập sâu, cô lập nhiều xã miền núi.",
        "detail": "Phố cổ Hội An ngập 1-2m. Nam Trà My, Bắc Trà My bị cô lập hoàn toàn do sạt lở.",
        "recommended_packages": ["bh_thien_tai_mien_trung", "bh_nha_o", "bh_du_lich"]
    },
    {
        "id": "quang-ngai",
        "province": "Quảng Ngãi",
        "region": "Trung",
        "latitude": "15.1214",
        "longitude": "108.8044",
        "status": "mưa_lớn",
        "marker_color": "blue",
        "severity": "Trung bình",
        "advice": "Mưa lớn diện rộng, cảnh báo lũ quét vùng núi. Nguy cơ ngập úng vùng trũng.",
        "detail": "Các huyện Ba Tơ, Sơn Tây, Trà Bồng có mưa rất to. Theo dõi mực nước các hồ chứa.",
        "recommended_packages": ["bh_thien_tai_mien_trung", "bh_tai_san", "bh_suc_khoe"]
    },
    
    # ===== MIỀN NAM =====
    {
        "id": "tp-hcm",
        "province": "TP Hồ Chí Minh",
        "region": "Nam",
        "latitude": "10.8231",
        "longitude": "106.6297",
        "status": "ổn_định",
        "marker_color": "green",
        "severity": "Thấp",
        "advice": "Thời tiết ổn định, không có cảnh báo thiên tai. Khuyến khích bảo hiểm phòng ngừa.",
        "detail": "Mùa khô, nắng nhẹ. Người dân nên duy trì bảo hiểm y tế và tài sản thường xuyên.",
        "recommended_packages": ["bh_suc_khoe", "bh_xe_co_gioi", "bh_nha_o"]
    },
    {
        "id": "can-tho",
        "province": "Cần Thơ",
        "region": "Nam",
        "latitude": "10.0452",
        "longitude": "105.7469",
        "status": "ổn_định",
        "marker_color": "green",
        "severity": "Thấp",
        "advice": "Thời tiết thuận lợi cho hoạt động nông nghiệp. Nên mua bảo hiểm mùa màng.",
        "detail": "Mực nước sông ổn định. Khuyến khích bảo hiểm nông nghiệp và tài sản.",
        "recommended_packages": ["bh_nong_nghiep", "bh_suc_khoe"]
    },
    {
        "id": "ba-ria-vung-tau",
        "province": "Bà Rịa - Vũng Tàu",
        "region": "Nam",
        "latitude": "10.5417",
        "longitude": "107.2430",
        "status": "ổn_định",
        "marker_color": "green",
        "severity": "Thấp",
        "advice": "Biển êm, thời tiết đẹp. Thích hợp cho du lịch, vui chơi giải trí.",
        "detail": "Không có cảnh báo thiên tai. Du khách nên mua bảo hiểm du lịch để an tâm.",
        "recommended_packages": ["bh_du_lich", "bh_suc_khoe"]
    }
]

def seed_disaster_locations():
    """Seed disaster locations to database"""
    
    print("\n🌍 Starting disaster locations seeding...")
    print(f"📊 Total locations to seed: {len(DISASTER_LOCATIONS)}")
    
    # Initialize database
    init_db()
    db = SessionLocal()
    
    try:
        # Clear existing data (optional - comment out if you want to keep existing data)
        # existing_count = db.query(DisasterLocation).count()
        # if existing_count > 0:
        #     print(f"⚠️  Found {existing_count} existing locations. Deleting...")
        #     db.query(DisasterLocation).delete()
        #     db.commit()
        
        # Seed new data
        added_count = 0
        skipped_count = 0
        
        for loc_data in DISASTER_LOCATIONS:
            # Check if location already exists
            existing = db.query(DisasterLocation).filter(
                DisasterLocation.id == loc_data['id']
            ).first()
            
            if existing:
                print(f"⏭️  Skipping {loc_data['province']} - already exists")
                skipped_count += 1
                continue
            
            # Create new location
            location = DisasterLocation(
                id=loc_data['id'],
                province=loc_data['province'],
                region=loc_data['region'],
                latitude=loc_data['latitude'],
                longitude=loc_data['longitude'],
                status=loc_data['status'],
                marker_color=loc_data['marker_color'],
                severity=loc_data['severity'],
                advice=loc_data['advice'],
                detail=loc_data['detail'],
                recommended_packages=json.dumps(loc_data['recommended_packages'], ensure_ascii=False),
                weather_info=None,  # Will be populated by weather service
                last_updated=datetime.utcnow(),
                created_at=datetime.utcnow()
            )
            
            db.add(location)
            added_count += 1
            print(f"✅ Added: {loc_data['province']} ({loc_data['region']}) - {loc_data['status']}")
        
        db.commit()
        
        print(f"\n✅ Seeding complete!")
        print(f"   📊 Total processed: {len(DISASTER_LOCATIONS)}")
        print(f"   ✅ Added: {added_count}")
        print(f"   ⏭️  Skipped: {skipped_count}")
        print(f"\n💡 Next step: Run weather update to fetch real-time data")
        print(f"   POST http://localhost:8000/api/disaster-locations/update-weather")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Seeding failed: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    seed_disaster_locations()
