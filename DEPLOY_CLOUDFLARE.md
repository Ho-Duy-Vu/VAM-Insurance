# 🚀 HƯỚNG DẪN DEPLOY: VERCEL + CLOUDFLARE

## Tổng quan Kiến trúc

```
User → Frontend (Vercel) → Backend API (Cloudflare Workers)
                                ↓
                         Storage (R2) + Database (D1)
```

**Công nghệ:**
- ✅ Frontend: React + Vite → Vercel (Free tier)
- ✅ Backend API: Cloudflare Workers (Free: 100k requests/day)
- ✅ File Storage: Cloudflare R2 (Free: 10GB)
- ✅ Database: Cloudflare D1 (Free: 5GB SQLite)
- ✅ CDN: Cloudflare (Unlimited bandwidth)

**Chi phí:** $0/tháng (hoàn toàn miễn phí!)

---

## PHASE 1: SETUP CLOUDFLARE BACKEND

### Bước 1.1: Tạo tài khoản Cloudflare

1. Truy cập: https://dash.cloudflare.com/sign-up
2. Đăng ký với email
3. Verify email
4. Đăng nhập vào Dashboard

### Bước 1.2: Cài đặt Wrangler CLI

```powershell
# Cài globally
npm install -g wrangler

# Verify
wrangler --version

# Login Cloudflare
wrangler login
# Browser sẽ mở → Authorize Wrangler
```

### Bước 1.3: Tạo D1 Database

```powershell
# Tại thư mục CloudflareWorker
cd CloudflareWorker

# Tạo D1 database
wrangler d1 create vam_insurance_db

# Output sẽ cho database_id, copy nó
# Ví dụ: database_id = "abc123-def456-..."
```

**Cập nhật `wrangler.toml`:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "vam_insurance_db"
database_id = "PASTE-DATABASE-ID-HERE"  # ← Paste database_id vào đây
```

**Chạy migration schema:**
```powershell
# Import database schema
wrangler d1 execute vam_insurance_db --file=schema.sql
```

### Bước 1.4: Tạo R2 Buckets

```powershell
# Tạo bucket cho documents
wrangler r2 bucket create vam-documents

# Tạo bucket cho images
wrangler r2 bucket create vam-images

# Tạo preview buckets cho development
wrangler r2 bucket create vam-documents-preview
wrangler r2 bucket create vam-images-preview
```

### Bước 1.5: Tạo KV Namespace (Cache)

```powershell
# Tạo KV namespace
wrangler kv:namespace create "CACHE"

# Output sẽ cho KV id, copy nó
# Ví dụ: id = "xyz789..."

# Tạo preview namespace
wrangler kv:namespace create "CACHE" --preview

# Copy preview_id cũng
```

**Cập nhật `wrangler.toml`:**
```toml
[[kv_namespaces]]
binding = "CACHE"
id = "PASTE-KV-ID-HERE"  # ← Paste KV id
preview_id = "PASTE-PREVIEW-ID-HERE"  # ← Paste preview id
```

### Bước 1.6: Setup Secrets

```powershell
# Set Gemini API key
wrangler secret put GEMINI_API_KEY
# Paste: AIzaSyCvn-V0fWPTaifPP_NODge4lc2GHYzQKLk

# Set OpenWeather API key
wrangler secret put OPENWEATHER_API_KEY
# Paste: 1c8c738430cf26c39b8c3f7a23d18bf3

# Set JWT secret (tạo random string mạnh)
wrangler secret put SECRET_KEY
# Paste: (random string 32+ characters)

# Set frontend URL (tạm thời dùng localhost, sẽ update sau)
wrangler secret put FRONTEND_URL
# Paste: http://localhost:5173
```

### Bước 1.7: Install Dependencies

```powershell
# Tại CloudflareWorker folder
npm install
```

### Bước 1.8: Test Local Development

```powershell
# Start local dev server
npm run dev

# Worker chạy tại: http://localhost:8787
```

**Test endpoints:**
```powershell
# Health check
curl http://localhost:8787/health

# Weather API
curl "http://localhost:8787/weather/21.0285/105.8542"
```

### Bước 1.9: Deploy Worker lên Cloudflare

```powershell
# Deploy to production
npm run deploy

# Hoặc:
wrangler deploy

# Output sẽ hiện URL:
# ✨ https://vam-insurance-api.your-subdomain.workers.dev
```

**📝 LƯU URL NÀY** - Bạn sẽ cần nó cho Frontend!

---

## PHASE 2: SETUP VERCEL FRONTEND

### Bước 2.1: Tạo tài khoản Vercel

1. Truy cập: https://vercel.com
2. Click "Sign Up"
3. Chọn "Continue with GitHub"
4. Authorize Vercel

### Bước 2.2: Update Frontend Environment

**Tại `Frontend/.env.production`:**
```env
VITE_API_URL=https://vam-insurance-api.your-subdomain.workers.dev
```
← Thay bằng Worker URL từ Bước 1.9

**Commit changes:**
```powershell
cd "d:\DỰ ÁN CHUNG\DU_AN_CUA_VU\VAM_TEAM"
git add Frontend/.env.production
git commit -m "Update API URL to Cloudflare Worker"
git push origin main
```

### Bước 2.3: Deploy lên Vercel

1. Tại Vercel Dashboard → Click "Add New Project"
2. Import Git Repository → Chọn `VAM-Insurance`
3. Configure Project:
   ```
   Framework Preset: Vite
   Root Directory: Frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Node.js Version: 18.x
   ```

4. Environment Variables → Add:
   ```
   VITE_API_URL = https://vam-insurance-api.your-subdomain.workers.dev
   ```

5. Click "Deploy"

6. Đợi 2-3 phút → Frontend URL:
   ```
   https://vam-insurance.vercel.app
   ```

### Bước 2.4: Update CORS trên Worker

**Update Cloudflare Worker secret:**
```powershell
cd CloudflareWorker

# Update FRONTEND_URL với Vercel URL thật
wrangler secret put FRONTEND_URL
# Paste: https://vam-insurance.vercel.app

# Redeploy Worker
npm run deploy
```

---

## PHASE 3: TESTING & VERIFICATION

### ✅ Test Backend (Cloudflare Worker)

```powershell
# Health check
curl https://vam-insurance-api.your-subdomain.workers.dev/health

# Expected response:
# {
#   "status": "healthy",
#   "service": "VAM Insurance API",
#   "version": "2.0.0",
#   "features": { ... }
# }
```

### ✅ Test Frontend (Vercel)

1. Mở browser: `https://vam-insurance.vercel.app`
2. Mở DevTools → Console
3. Không có CORS errors
4. Network tab → thấy requests đến Cloudflare Worker

### ✅ Test Full Stack Integration

```javascript
// Tại browser console (https://vam-insurance.vercel.app)
fetch('https://vam-insurance-api.your-subdomain.workers.dev/insurance/packages')
  .then(r => r.json())
  .then(console.log)

// Should return insurance packages array
```

---

## PHASE 4: OPTIONAL CUSTOM DOMAIN

### Nếu bạn có domain riêng (e.g., `vaminsurance.com`)

#### Frontend Custom Domain (Vercel)

1. Vercel Dashboard → Project Settings → Domains
2. Add domain: `vaminsurance.com` hoặc `app.vaminsurance.com`
3. Follow DNS instructions từ Vercel
4. SSL tự động được cấp

#### Backend Custom Domain (Cloudflare)

1. Cloudflare Dashboard → Workers & Pages
2. Click vào Worker `vam-insurance-api`
3. Settings → Triggers → Custom Domains
4. Add: `api.vaminsurance.com`
5. DNS sẽ tự động update

**Update CORS:**
```powershell
wrangler secret put FRONTEND_URL
# Paste: https://app.vaminsurance.com

wrangler deploy
```

---

## 🔄 WORKFLOW DEPLOY MỚI

### Khi thay đổi Frontend:

```powershell
git add .
git commit -m "Update frontend feature"
git push origin main

# Vercel tự động deploy (1-2 phút)
```

### Khi thay đổi Backend (Worker):

```powershell
cd CloudflareWorker
# Edit src files...

npm run deploy

# Or test locally first:
npm run dev
# ... test ...
npm run deploy
```

### Khi thay đổi Database Schema:

```powershell
# Edit schema.sql
wrangler d1 execute vam_insurance_db --file=schema.sql

# Hoặc run migrations manually:
wrangler d1 execute vam_insurance_db --command="ALTER TABLE..."
```

---

## 📊 MONITORING & LOGS

### Cloudflare Worker Logs

```powershell
# Real-time logs
wrangler tail

# Hoặc xem tại Dashboard:
# https://dash.cloudflare.com → Workers & Pages → vam-insurance-api → Logs
```

### Vercel Deployment Logs

1. Vercel Dashboard → Project → Deployments
2. Click vào deployment → View Build Logs

### D1 Database Queries

```powershell
# Query database
wrangler d1 execute vam_insurance_db --command="SELECT * FROM users LIMIT 5"

# Backup database
wrangler d1 export vam_insurance_db --output=backup.sql
```

### R2 Storage Management

```powershell
# List objects in bucket
wrangler r2 object list vam-documents

# Download object
wrangler r2 object get vam-documents/file.pdf --file=downloaded.pdf
```

---

## 🛠️ TROUBLESHOOTING

### Frontend không kết nối được Backend

**Check:**
1. `VITE_API_URL` trong `.env.production` đúng chưa?
2. Redeploy Vercel với env variable mới
3. Check CORS: `FRONTEND_URL` secret trên Worker đã update?

**Fix:**
```powershell
# Update Worker CORS
cd CloudflareWorker
wrangler secret put FRONTEND_URL
# Paste Vercel URL
wrangler deploy
```

### Worker Error 1101 (Worker threw exception)

**Check logs:**
```powershell
wrangler tail
# Gây lỗi để xem log realtime
```

**Common issues:**
- Thiếu secret: `wrangler secret list` → check tất cả secrets đã set
- Database binding lỗi: Check `database_id` trong `wrangler.toml`
- Syntax error: Run `npm run dev` local test trước

### Database "table not found"

**Recreate schema:**
```powershell
wrangler d1 execute vam_insurance_db --file=schema.sql
```

### CORS Error "not allowed by Access-Control-Allow-Origin"

**Update FRONTEND_URL:**
```powershell
wrangler secret put FRONTEND_URL
# Paste exact Vercel URL (no trailing slash)
wrangler deploy
```

---

## 💡 TIPS & BEST PRACTICES

### 1. Development Workflow

```powershell
# Terminal 1: Frontend
cd Frontend
npm run dev
# http://localhost:5173

# Terminal 2: Backend Worker
cd CloudflareWorker
npm run dev
# http://localhost:8787

# Terminal 3: Watch logs
cd CloudflareWorker
wrangler tail --env production
```

### 2. Environment Management

- Development: `npm run dev` → uses `.dev.vars` (local secrets)
- Production: `wrangler deploy` → uses Cloudflare secrets

**Create `.dev.vars`:**
```env
GEMINI_API_KEY=AIzaSyCvn-V0fWPTaifPP_NODge4lc2GHYzQKLk
OPENWEATHER_API_KEY=1c8c738430cf26c39b8c3f7a23d18bf3
SECRET_KEY=dev-secret-key-123
FRONTEND_URL=http://localhost:5173
```

### 3. Free Tier Limits

**Cloudflare Workers:**
- ✅ 100,000 requests/day
- ✅ 10ms CPU time/request
- ❌ Không hỗ trợ long-running processes

**Cloudflare R2:**
- ✅ 10GB storage
- ✅ Unlimited egress bandwidth
- ✅ 1 million Class A operations/month

**Cloudflare D1:**
- ✅ 5GB storage
- ✅ 5 million rows
- ✅ 25 million read operations/day

**Vercel:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS

---

## 📚 NEXT STEPS

### Sau khi deploy thành công:

1. ✅ **Test toàn bộ features:**
   - User registration/login
   - Document upload (khi implement R2)
   - Disaster map
   - Insurance packages

2. ✅ **Setup monitoring:**
   - Cloudflare Analytics
   - Vercel Analytics
   - Error tracking (Sentry)

3. ✅ **Optimize performance:**
   - Enable caching với KV
   - Compress images trên R2
   - Setup CDN cache headers

4. ✅ **Security hardening:**
   - Rate limiting
   - Input validation
   - SQL injection prevention

---

## 🎉 KẾT QUẢ CUỐI CÙNG

**Frontend URL:** https://vam-insurance.vercel.app  
**Backend API:** https://vam-insurance-api.your-subdomain.workers.dev  
**API Docs:** (Thêm Swagger UI sau)

**Live Endpoints:**
- `GET /health` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /insurance/packages` - Insurance packages
- `GET /disaster-locations` - Disaster locations
- `GET /weather/:lat/:lon` - Weather data

---

**🚀 Chúc mừng! Project đã deploy thành công lên Vercel + Cloudflare!**

*Tài liệu này được tạo bởi VAM Team - November 2025*
