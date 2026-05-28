# 🛡️ VAM Insurance Platform

<div align="center">

![VAM Insurance](https://img.shields.io/badge/VAM-Insurance-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)

**Nền tảng Bảo hiểm Thông minh Kết hợp AI & Phân tích Rủi ro Thiên tai**

[🎬 Demo Video](#-demo--video-giới-thiệu) • [🚀 Bắt Đầu](#-cài-đặt--khởi-chạy) • [📖 Tài Liệu](#-tài-liệu-api) • [🤝 Đóng Góp](#-đóng-góp)

</div>

---

## 📺 Demo & Video Giới Thiệu

### 🎥 YouTube Demo

[![VAM Insurance Demo](https://img.shields.io/badge/▶️_Xem_Demo_Trên_YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/iPgthVh4_4k?si=0KfPDx3UUM9nl2nt)


### 🎯 Các Tính Năng Demo

- ✅ Xử lý tài liệu thông minh với AI
- ✅ Phân tích rủi ro thiên tai theo thời gian thực
- ✅ Chatbot tư vấn bảo hiểm AI
- ✅ Bản đồ tương tác hiển thị vùng rủi ro
- ✅ Quy trình mua bảo hiểm hoàn chỉnh

---

## 📋 Tổng Quan

VAM Insurance là nền tảng bảo hiểm kỹ thuật số toàn diện, kết hợp **xử lý tài liệu thông minh**, **phân tích rủi ro thiên tai**, và **đề xuất bảo hiểm cá nhân hóa**. Nền tảng tận dụng công nghệ AI để cung cấp phân tích tài liệu tự động, giám sát thiên tai theo thời gian thực, và giải pháp bảo hiểm phù hợp cho cá nhân và doanh nghiệp.


---

## ✨ Tính Năng Chính

### 🤖 Xử Lý Tài Liệu Thông Minh

Nền tảng cung cấp khả năng phân tích tài liệu tiên tiến được hỗ trợ bởi **Google Gemini AI**, cho phép trích xuất và xác thực thông tin hợp đồng bảo hiểm tự động.

**Khả năng:**
- 📄 Hỗ trợ đa định dạng: PDF, PNG, JPG, JPEG
- 🔍 OCR tiếng Việt chính xác cao với Gemini Vision
- 🎯 Trích xuất dữ liệu có cấu trúc từ CCCD, giấy phép lái xe, hợp đồng bảo hiểm
- 🖼️ Đánh dấu vùng trực quan (Visual Region Highlighting)
- ✏️ Chỉnh sửa dữ liệu đã trích xuất qua giao diện trực quan
- 📊 Xuất thông tin dạng JSON, Markdown, DOCX

**Loại tài liệu hỗ trợ:**
- CCCD/CMND (Căn cước công dân)
- Bằng lái xe (Driver License)  
- Hợp đồng bảo hiểm (Insurance Policies)
- Giấy đăng ký xe (Vehicle Registration)
- Hộ chiếu (Passport)

### 🌍 Phân Tích Rủi Ro Thiên Tai

Giám sát thiên tai theo thời gian thực và đánh giá rủi ro giúp người dùng đưa ra quyết định sáng suốt về phạm vi bảo hiểm.

**Tính năng:**
- 🗺️ Bản đồ thiên tai tương tác với **Leaflet** & **React Leaflet**
- ⛈️ Dữ liệu thời tiết thời gian thực từ **OpenWeatherMap API**
- 📍 Phân tích vùng miền (Bắc - Trung - Nam Việt Nam)
- 📈 Theo dõi sự kiện lịch sử và xu hướng rủi ro
- 🎯 Báo cáo đánh giá rủi ro theo địa điểm
- 🔔 Cảnh báo thiên tai (Bão, Lũ lụt, Ngập úng, Sạt lở)

**Dữ liệu thời tiết:**
- Nhiệt độ, độ ẩm, áp suất, lượng mưa
- Tốc độ gió (phát hiện bão)
- Dự báo 5 ngày
- Cập nhật mỗi 10 phút
- Ngôn ngữ: Tiếng Việt

### 💬 Tư Vấn Bảo Hiểm Được Hỗ Trợ AI

Chatbot thông minh cung cấp hướng dẫn bảo hiểm cá nhân hóa, trả lời câu hỏi về các lựa chọn bảo vệ, điều khoản hợp đồng và quy trình bồi thường.

**Khả năng:**
- 🧠 Powered by **Google Gemini Pro** với context window lớn
- 🎯 Đề xuất sản phẩm dựa trên nhu cầu cá nhân
- 🗣️ Giải thích thuật ngữ bảo hiểm phức tạp bằng ngôn ngữ đơn giản
- 🏠 Tư vấn theo vùng miền (Bắc/Trung/Nam)
- 🔒 Bảo mật thông tin cá nhân (CCCD, địa chỉ, điện thoại)
- 📱 Floating widget tiện lợi trên mọi trang
- 🌊 Cross-sell & Up-sell: Combo Nhân thọ + Sức khỏe + Thiên tai

### 🧭 Phân Tích Địa Lý Thông Minh (Geo Intelligence)

**AI Insurance Geo-Analyst** phân tích địa chỉ, thời tiết và rủi ro để đề xuất bảo hiểm phù hợp.

**Chức năng:**
- 🗾 Nhận diện vùng miền từ địa chỉ (23 tỉnh Bắc, 19 tỉnh Trung, 22 tỉnh Nam)
- ⚠️ Phát hiện tỉnh có rủi ro cao (Quảng Bình, Hà Tĩnh, Nghệ An, Quảng Nam, v.v.)
- 🌦️ Phân tích điều kiện thời tiết & cảnh báo thiên tai
- 📋 Đề xuất gói bảo hiểm theo logic AI (95% Bảo hiểm bão, 90% Ngập nước, v.v.)
- 📊 Báo cáo chi tiết với lý do khuyến nghị

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                    VAM Insurance Platform                    │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
         ┌──────▼──────┐           ┌───────▼────────┐
         │   Frontend   │◄─────────►│    Backend     │
         │  React 19    │   REST    │   FastAPI      │
         │  TypeScript  │    API    │   Python 3.11  │
         └──────┬───────┘           └────────┬───────┘
                │                            │
      ┌─────────┼────────────┐      ┌────────┼──────────┐
      │         │            │      │        │          │
   ┌──▼──┐  ┌──▼───┐  ┌────▼──┐ ┌─▼──┐  ┌──▼───┐  ┌──▼───┐
   │Vite │  │Zustand│ │TanStack│ │SQLite│ │Gemini│ │Weather│
   │     │  │       │ │ Query │  │ DB   │ │ AI   │ │  API  │
   └─────┘  └───────┘ └────────┘ └──────┘ └──────┘ └───────┘
```

### Frontend Architecture
- **Framework:** React 19.1.1 với TypeScript 5.9.3
- **Build Tool:** Vite 7.1.14 (Rolldown bundler)
- **Styling:** TailwindCSS 3.4.0 + Radix UI Components
- **State:** Zustand 5.0.8 (lightweight)
- **Routing:** React Router DOM 7.9.4
- **Data Fetching:** TanStack Query 5.90.5
- **Maps:** Leaflet 1.9.4 + React Leaflet 5.0.0
- **Canvas:** Konva 10.0.7 + React Konva (Document annotation)
- **Markdown:** React Markdown + remark-gfm
- **Icons:** Lucide React 0.547.0 (1000+ icons)

### Backend Infrastructure
- **Framework:** FastAPI 0.104.1 (async support)
- **Server:** Uvicorn 0.24.0 with ASGI
- **ORM:** SQLAlchemy 2.0.23 (async capabilities)
- **Validation:** Pydantic 2.5.0
- **Auth:** JWT (PyJWT 2.8.0 + python-jose)
- **Password:** bcrypt 4.2.1
- **Database:** SQLite (dev) / PostgreSQL (production)

### AI & External APIs
- **Google Gemini AI** (google-generativeai 0.8.3)
  - Vision: OCR tiếng Việt, phát hiện vùng tài liệu
  - Pro: Tư vấn bảo hiểm, trích xuất dữ liệu có cấu trúc
  - Flash: Phân tích địa lý & thời tiết nhanh
  
- **OpenWeatherMap API** (via httpx 0.27.0)
  - Current Weather (cập nhật 10 phút)
  - 5-day Forecast
  - Vietnamese localization

### Document Processing
- **PyMuPDF (fitz)** 1.23.18 - PDF rendering
- **Pillow** 10.2.0 - Image processing
- **python-docx** 0.8.11 - Word documents
- **pdf2image** 1.16.3 - PDF to image conversion
- **ReportLab** 4.0.7 - Dynamic PDF generation

### Deployment Stack
- **Frontend:** Vercel (Global CDN, auto-deploy)
- **Backend:** Cloudflare Workers (Edge computing)
- **Storage:** Cloudflare R2 (S3-compatible)
- **Database:** Cloudflare D1 (Serverless SQLite)
- **Cost:** Free tier cho cả stack

---

## 🚀 Cài Đặt & Khởi Chạy

### Yêu Cầu Hệ Thống

- **Node.js** 18+ (cho Frontend)
- **Python** 3.11+ (cho Backend)
- **Git** (cho version control)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Ho-Duy-Vu/VAM-Insurance.git
cd VAM-Insurance
```

### 2️⃣ Cài Đặt Backend

```bash
cd Backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Cấu hình biến môi trường (.env)
echo "SECRET_KEY=your-secret-key-change-in-production" > .env
echo "GEMINI_API_KEY=your-google-gemini-api-key" >> .env
echo "OPENWEATHER_API_KEY=your-openweather-api-key" >> .env
echo "ACCESS_TOKEN_EXPIRE_MINUTES=10080" >> .env

# Khởi động server
python main.py
```

**Backend sẽ chạy tại:** `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 3️⃣ Cài Đặt Frontend

```bash
cd Frontend

# Cài đặt dependencies
npm install

# Khởi động development server
npm run dev
```

**Frontend sẽ chạy tại:** `http://localhost:5173`

### 4️⃣ Seed Database (Tùy chọn)

```bash
cd Backend
python seed_disaster_locations.py
```

Lệnh này sẽ tạo dữ liệu mẫu cho các địa điểm thiên tai tại Việt Nam.

---

## 📁 Cấu Trúc Dự Án

```
VAM_TEAM/
├── 📄 README.md                      # Tài liệu chính
├── 🔙 Backend/                       # FastAPI Backend
│   ├── main.py                       # Entry point
│   ├── run.py                        # Alternative runner
│   ├── requirements.txt              # Python dependencies
│   ├── render.yaml                   # Render deployment config
│   ├── seed_disaster_locations.py    # Database seeder
│   ├── 📦 app/
│   │   ├── __init__.py
│   │   ├── database.py               # SQLAlchemy config
│   │   ├── models.py                 # Database models
│   │   ├── schemas.py                # Pydantic schemas
│   │   ├── ai_service.py             # Gemini AI integration
│   │   ├── chat_service.py           # Insurance chatbot
│   │   ├── weather_service.py        # OpenWeatherMap API
│   │   └── geo_analyst.py            # Geo intelligence
│   ├── 📂 data/
│   │   ├── docs/                     # Uploaded documents
│   │   └── images/                   # Processed images
│   └── 🧪 mock/
│       ├── sample_fields.json
│       ├── sample_markdown.md
│       └── sample_overlay.json
│
└── 🎨 Frontend/                      # React Frontend
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── 📂 src/
    │   ├── App.tsx                   # Main app component
    │   ├── main.tsx                  # Entry point
    │   ├── 🔌 api/
    │   │   ├── client.ts             # API client
    │   │   ├── geoAnalyst.ts         # Geo API
    │   │   └── types.ts              # API types
    │   ├── 🧩 components/
    │   │   ├── AIGeoAnalystPanel.tsx
    │   │   ├── FloatingChatWidget.tsx
    │   │   ├── InsuranceChatbot.tsx
    │   │   ├── OverlayCanvas.tsx     # Document annotation
    │   │   ├── MarkdownRenderer.tsx
    │   │   ├── JsonEditor.tsx
    │   │   └── ui/                   # Radix UI components
    │   ├── 📄 pages/
    │   │   ├── general/              # Home, About, Contact
    │   │   ├── auth/                 # Login, Register
    │   │   ├── insurance/            # Products, Application
    │   │   ├── documents/            # Document management
    │   │   ├── disaster/             # Disaster map
    │   │   ├── dashboard/            # Risk dashboard
    │   │   └── user/                 # Profile, Settings
    │   ├── 🛣️ routes/
    │   │   └── index.tsx             # React Router config
    │   ├── 🗄️ store/
    │   │   ├── document.ts           # Zustand store
    │   │   └── insurance.ts
    │   ├── 📊 data/
    │   │   ├── disasterData.ts
    │   │   └── insurancePackages.ts  # Mock packages
    │   ├── 🎣 hooks/
    │   │   ├── use-auth.ts
    │   │   ├── use-theme.ts
    │   │   └── use-toast.ts
    │   └── 🎨 contexts/
    │       ├── auth-context.tsx
    │       └── theme-context.ts
```

---

## 📖 Tài Liệu API

### 🔐 Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "Nguyễn Văn A",
  "phone": "0901234567"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: {
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": { ... }
}
```

### 📄 Document Processing Endpoints

#### Upload Document
```http
POST /documents/upload
Content-Type: multipart/form-data

file: [PDF/PNG/JPG file]

Response: {
  "document_id": "uuid-here",
  "filename": "document.pdf",
  "status": "NOT_STARTED"
}
```

#### Process Document (AI Analysis)
```http
POST /documents/{document_id}/process

Response: {
  "job_id": "job-uuid",
  "status": "PROCESSING",
  "progress": 0
}
```

#### Get Processing Status
```http
GET /jobs/{job_id}

Response: {
  "id": "job-uuid",
  "status": "DONE",
  "progress": 100,
  "document_id": "doc-uuid"
}
```

#### Get Extracted Data
```http
# JSON Format
GET /documents/{document_id}/json

# Markdown Format
GET /documents/{document_id}/markdown

# Visual Overlay (Bounding Boxes)
GET /documents/{document_id}/overlay
```

### 🌍 Disaster & Weather Endpoints

#### Get Disaster Locations
```http
GET /api/disasters

Response: [
  {
    "id": 1,
    "name": "Hà Tĩnh",
    "latitude": 18.3426,
    "longitude": 105.9019,
    "disaster_type": "Lũ lụt",
    "severity": "Cao",
    "status": "active",
    "weather_info": { ... }
  }
]
```

#### Create Disaster Location
```http
POST /api/disasters
Content-Type: application/json

{
  "name": "Quảng Bình",
  "latitude": 17.4738,
  "longitude": 106.6222,
  "disaster_type": "Bão",
  "severity": "Cao",
  "description": "Vùng thường xuyên bị ảnh hưởng bởi bão"
}
```

#### Update Weather Data
```http
POST /api/disasters/update-weather

Response: {
  "updated": 15,
  "failed": 0
}
```

### 🧭 Geo Analyst Endpoints

#### Analyze Address & Weather
```http
POST /api/geo-analyst/analyze
Content-Type: application/json

{
  "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
  "weatherDescription": "Mưa to, triều cường"
}

Response: {
  "region": "Miền Nam",
  "risk_level": "Cao",
  "insurance_recommendations": [
    {
      "package": "Bảo hiểm phương tiện ngập nước",
      "confidence": 90,
      "reason": "Nguy cơ ngập úng cao..."
    }
  ]
}
```

### 💬 Chat Endpoints

#### Chat with Insurance Advisor
```http
POST /api/chat
Content-Type: application/json

{
  "message": "Tôi ở miền Trung, nên mua bảo hiểm gì?",
  "conversationHistory": [],
  "userDocument": null
}

Response: {
  "response": "🌊 Miền Trung đang trong mùa bão lũ!..."
}
```

---

## 🎯 Luồng Sử Dụng (User Flows)

### 1. Mua Bảo Hiểm Mới

```
1. Trang chủ → Khám phá các gói bảo hiểm
2. Chọn gói phù hợp → Xem chi tiết quyền lợi
3. Nhấn "Mua ngay"
4. Upload CCCD/CMND → AI tự động điền form
5. Upload giấy đăng ký xe (nếu cần)
6. Xác nhận thông tin → Chọn phương thức thanh toán
7. Thanh toán → Nhận hợp đồng điện tử
```

### 2. Phân Tích Rủi Ro Thiên Tai

```
1. Menu → "Bản đồ thiên tai"
2. Xem các điểm đỏ (rủi ro cao) trên bản đồ
3. Click vào điểm → Xem chi tiết thời tiết & rủi ro
4. Panel bên phải → Nhận đề xuất bảo hiểm từ AI
5. Nhấn "Mua bảo hiểm phù hợp"
```

### 3. Tư Vấn Qua Chatbot

```
1. Click icon chat góc phải màn hình
2. Hỏi: "Tôi cần bảo hiểm gì cho xe máy?"
3. AI phân tích → Đề xuất 2-3 gói phù hợp
4. Click "Xem chi tiết gói" → Chuyển đến trang sản phẩm
```

### 4. Quản Lý Hợp Đồng

```
1. Đăng nhập → Menu "Hợp đồng của tôi"
2. Xem danh sách hợp đồng đang có hiệu lực
3. Click vào hợp đồng → Xem chi tiết, tải PDF
4. Nộp yêu cầu bồi thường (nếu cần)
```

---

## 🔒 Bảo Mật & Authentication

### JWT Token Authentication
- **Algorithm:** HS256
- **Expire:** 7 days (10080 minutes)
- **Storage:** localStorage (Frontend)
- **Header:** `Authorization: Bearer <token>`

### Password Security
- **Hashing:** bcrypt (cost factor 12)
- **Validation:** Min 8 characters, phải có chữ hoa, chữ thường, số

### CORS Policy
- **Allowed Origins:** `http://localhost:5173` (dev), production URL
- **Methods:** GET, POST, PUT, DELETE
- **Headers:** Content-Type, Authorization

### Data Protection
- ❌ KHÔNG tiết lộ CCCD, địa chỉ chi tiết, số điện thoại trong chatbot
- ✅ Chỉ sử dụng vùng miền (Bắc/Trung/Nam) để tư vấn
- 🔐 Mã hóa dữ liệu nhạy cảm trong database
- 🛡️ Input validation với Pydantic schemas

---

## 💼 Các Trường Hợp Sử Dụng (Use Cases)

### 👤 Cho Người Dùng Cá Nhân

- ✅ Upload CCCD để tự động điền form bảo hiểm
- ✅ Nhận đề xuất bảo hiểm dựa trên địa chỉ & rủi ro thiên tai
- ✅ Khám phá vùng rủi ro cao trên bản đồ
- ✅ So sánh các gói bảo hiểm khác nhau
- ✅ Tư vấn 24/7 qua chatbot AI

### 🏢 Cho Đại Lý Bảo Hiểm

- ✅ Xử lý tài liệu tự động → Giảm nhập liệu thủ công
- ✅ Trích xuất thông tin hợp đồng nhanh chóng
- ✅ Công cụ trực quan để trình bày sản phẩm cho khách hàng
- ✅ Báo cáo đánh giá rủi ro tích hợp
- ✅ Quản lý khách hàng và hợp đồng hiệu quả

### 🏠 Cho Chủ Nhà

- ✅ Đánh giá rủi ro thiên tai cho địa điểm cụ thể
- ✅ Hiểu rõ yêu cầu bảo hiểm phù hợp cho tài sản
- ✅ Theo dõi sự kiện thiên tai lịch sử trong khu vực
- ✅ Quyết định sáng suốt về nhu cầu bảo hiểm tài sản

---

## 🎨 Tính Năng Nâng Cao

### Document Intelligence
- ✅ Xử lý PDF nhiều trang với tách trang tự động
- ✅ OCR & trích xuất văn bản độ chính xác cao
- ✅ Phát hiện & phân loại vùng tài liệu (text, table, signature)
- ✅ Đầu ra JSON có cấu trúc với validation
- ✅ Chỉnh sửa dữ liệu đã trích xuất qua giao diện trực quan
- ✅ Xuất thông tin dạng JSON, Markdown, DOCX

### Risk Assessment
- ✅ Phân tích độ dễ bị tổn thương địa lý trước thiên tai
- ✅ Tích hợp dữ liệu thời tiết hiện tại & dự báo
- ✅ Tạo báo cáo rủi ro toàn diện với visualization
- ✅ Dữ liệu thiên tai lịch sử cho phân tích xu hướng dài hạn

### AI Capabilities
- ✅ Natural language understanding (Gemini Pro)
- ✅ Context-aware responses (8K+ context window)
- ✅ Multi-turn conversations với memory
- ✅ Sentiment analysis cho customer satisfaction
- ✅ Auto-suggest insurance packages

---

## 🛠️ Scripts & Commands

### Backend Commands

```bash
# Development
python main.py                        # Start FastAPI server
python run.py                          # Alternative runner

# Database
python seed_disaster_locations.py     # Seed disaster data

# Testing (nếu có)
pytest                                 # Run tests
pytest --cov                           # With coverage
```

### Frontend Commands

```bash
# Development
npm run dev                            # Start Vite dev server
npm run build                          # Build for production
npm run preview                        # Preview production build

# Code Quality
npm run lint                           # Run ESLint
npm run lint:fix                       # Fix lint errors

# Type Checking
tsc --noEmit                           # Check TypeScript errors
```

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Tự động deploy khi push lên GitHub
git push origin main

# Hoặc deploy thủ công
cd Frontend
npm run build
# Upload folder dist/ lên Vercel Dashboard
```

**Environment Variables (Vercel):**
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (Render / Cloudflare Workers)

**Render:**
```yaml
# render.yaml đã có sẵn
services:
  - type: web
    name: vam-insurance-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: python main.py
```

**Cloudflare Workers:**
```bash
# Cần chuyển đổi sang Cloudflare Workers format
# Hoặc sử dụng Cloudflare Pages Functions
```

**Environment Variables:**
```
SECRET_KEY=your-production-secret-key
GEMINI_API_KEY=your-gemini-api-key
OPENWEATHER_API_KEY=your-openweather-key
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

---

## 🧪 Testing

### Backend Testing

```python
# tests/test_ai_service.py
def test_analyze_document():
    result = analyze_auto_document(image_path)
    assert result["status"] == "success"
    assert "fullName" in result["data"]
```

### Frontend Testing

```typescript
// Có thể thêm Vitest hoặc Jest
import { render, screen } from '@testing-library/react'
import HomePage from './pages/general/HomePage'

test('renders homepage', () => {
  render(<HomePage />)
  expect(screen.getByText(/VAM Insurance/i)).toBeInTheDocument()
})
```

---

## 📦 Dependencies

### Backend Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | 0.104.1 | Web framework |
| uvicorn | 0.24.0 | ASGI server |
| sqlalchemy | 2.0.23 | ORM |
| pydantic | 2.5.0 | Data validation |
| google-generativeai | 0.8.3 | Gemini AI |
| PyMuPDF | 1.23.18 | PDF processing |
| Pillow | 10.2.0 | Image processing |
| httpx | 0.27.0 | HTTP client |
| python-jose | 3.3.0 | JWT |
| bcrypt | 4.2.1 | Password hashing |

### Frontend Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.1.1 | UI framework |
| typescript | 5.9.3 | Type safety |
| vite | 7.1.14 | Build tool |
| @tanstack/react-query | 5.90.5 | Data fetching |
| zustand | 5.0.8 | State management |
| react-router-dom | 7.9.4 | Routing |
| tailwindcss | 3.4.0 | Styling |
| leaflet | 1.9.4 | Maps |
| konva | 10.0.7 | Canvas |
| react-markdown | 10.1.0 | Markdown |

---

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! 

### Cách Đóng Góp

1. **Fork** repository
2. **Clone** fork của bạn:
   ```bash
   git clone https://github.com/YOUR_USERNAME/VAM-Insurance.git
   ```
3. **Tạo branch** mới:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Commit** thay đổi:
   ```bash
   git commit -m "Add some amazing feature"
   ```
5. **Push** lên branch:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Tạo Pull Request** trên GitHub

### Coding Standards

- **Backend:** Follow PEP 8 (Python)
- **Frontend:** Follow ESLint config
- **Commits:** Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Documentation:** Update README khi thêm feature mới

---

## 📝 License

Dự án này được cấp phép theo giấy phép **MIT License**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

```
MIT License

Copyright (c) 2026 VAM Insurance Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software")...
```

---

## 👥 Đội Ngũ Phát Triển

- **Product Owner:** [Tên]
- **Tech Lead:** [Tên]
- **Backend Developer:** [Tên]
- **Frontend Developer:** [Tên]
- **UI/UX Designer:** [Tên]
- **QA Engineer:** [Tên]

---

## 📞 Liên Hệ & Hỗ Trợ

- **GitHub Issues:** [https://github.com/Ho-Duy-Vu/VAM-Insurance/issues](https://github.com/Ho-Duy-Vu/VAM-Insurance/issues)
- **Email:** support@vam-insurance.com
- **Website:** [https://vam-insurance.vercel.app](https://vam-insurance.vercel.app)
- **Documentation:** [https://docs.vam-insurance.com](https://docs.vam-insurance.com)

---

## 🙏 Acknowledgments

- **Google Gemini AI** - Cung cấp khả năng AI mạnh mẽ
- **OpenWeatherMap** - Dữ liệu thời tiết thời gian thực
- **Vercel** - Hosting frontend miễn phí
- **Cloudflare** - Edge computing infrastructure
- **Radix UI** - Accessible component primitives
- **Shadcn UI** - Beautiful component examples
- **Leaflet** - Interactive maps
- **FastAPI Community** - Excellent documentation

---

## 🗺️ Roadmap

### Q1 2026
- ✅ MVP Launch với core features
- ✅ Gemini AI integration
- ✅ Disaster map với OpenWeatherMap
- 🔲 Mobile app (React Native)

### Q2 2026
- 🔲 Payment gateway integration (VNPay, Momo)
- 🔲 Email notifications (SendGrid)
- 🔲 SMS alerts (Twilio)
- 🔲 Advanced analytics dashboard

### Q3 2026
- 🔲 Multi-language support (English, Chinese)
- 🔲 Voice assistant (Google Speech API)
- 🔲 Blockchain insurance contracts
- 🔲 IoT device integration

### Q4 2026
- 🔲 AI-powered claim processing
- 🔲 Predictive analytics for disasters
- 🔲 Partner insurance company API integration
- 🔲 B2B enterprise features

---

<div align="center">

**[⬆ Về Đầu Trang](#-vam-insurance-platform)**

Made with ❤️ by VAM Team | © 2026 VAM Insurance Platform

[![GitHub stars](https://img.shields.io/github/stars/Ho-Duy-Vu/VAM-Insurance?style=social)](https://github.com/Ho-Duy-Vu/VAM-Insurance/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Ho-Duy-Vu/VAM-Insurance?style=social)](https://github.com/Ho-Duy-Vu/VAM-Insurance/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/Ho-Duy-Vu/VAM-Insurance?style=social)](https://github.com/Ho-Duy-Vu/VAM-Insurance/watchers)

</div>


### Insurance Recommendation
AI-driven product matching considers user profiles, location data, and risk factors to suggest optimal coverage options. The recommendation engine explains policy features and benefits in clear language, compares multiple insurance packages side-by-side, and adapts suggestions based on budget constraints and coverage preferences.

### User Experience
The responsive design ensures seamless access across desktop, tablet, and mobile devices. Theme customization allows users to switch between light and dark modes for comfortable viewing. Real-time progress indicators keep users informed during document processing, and interactive visualizations make complex data accessible and understandable.

## Deployment

The platform is production-ready with fully serverless deployment architecture. The frontend deploys to **Vercel** with automatic builds triggered by GitHub commits, global CDN distribution for fast load times, and environment-based configuration. The backend runs on **Cloudflare Workers** at the edge with sub-50ms response times globally, automatic HTTPS, DDoS protection, and unlimited bandwidth. File uploads are stored in **Cloudflare R2** with 10GB free storage, and data persists in **Cloudflare D1** serverless database. This architecture eliminates server maintenance while providing enterprise-grade performance and reliability on free tiers.

## Development

The codebase maintains high standards with TypeScript for type safety across the frontend, Pydantic for data validation in the backend, and comprehensive error handling throughout the application. The development environment supports hot module replacement for rapid development, environment-based configuration for different deployment stages, and modular component architecture for maintainability.

## Innovation

VAM Insurance represents the convergence of traditional insurance services with modern AI technology. By automating document processing, providing intelligent risk analysis, and offering personalized recommendations, the platform transforms how users interact with insurance products. The system reduces administrative overhead, improves decision-making through data-driven insights, and makes insurance accessible and understandable for everyone.

---

**VAM Insurance Platform** - Intelligent Insurance Solutions for a Safer Future

*Powered by AI Technology | Built for Users | Designed for Scale*
