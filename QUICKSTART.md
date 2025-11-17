# ⚡ QUICK START - DEPLOY NGAY BÂY GIỜ!

## 🎯 Mục tiêu: Deploy trong 30 phút

**Yêu cầu:**
- ✅ Node.js 18+ đã cài
- ✅ Git đã cài
- ✅ Tài khoản GitHub
- ✅ Code đã push lên GitHub

---

## 📝 CHECKLIST 5 BƯỚC

### ☐ BƯỚC 1: Setup Cloudflare (10 phút)

```powershell
# 1. Cài Wrangler
npm install -g wrangler

# 2. Login Cloudflare
wrangler login
# → Browser mở → Click "Allow"

# 3. Tạo D1 Database
cd CloudflareWorker
wrangler d1 create vam_insurance_db
# → Copy database_id

# 4. Update wrangler.toml
# Paste database_id vào dòng 22

# 5. Import schema
wrangler d1 execute vam_insurance_db --file=schema.sql

# 6. Tạo R2 buckets
wrangler r2 bucket create vam-documents
wrangler r2 bucket create vam-images

# 7. Tạo KV namespace
wrangler kv:namespace create "CACHE"
# → Copy id và preview_id
# → Paste vào wrangler.toml dòng 29-31

# 8. Set secrets
wrangler secret put GEMINI_API_KEY
# Paste: AIzaSyCvn-V0fWPTaifPP_NODge4lc2GHYzQKLk

wrangler secret put OPENWEATHER_API_KEY
# Paste: 1c8c738430cf26c39b8c3f7a23d18bf3

wrangler secret put SECRET_KEY
# Paste: (tạo random string 32 chars)

wrangler secret put FRONTEND_URL
# Paste: http://localhost:5173 (tạm thời)

# 9. Install dependencies
npm install

# 10. Deploy!
npm run deploy
# → Copy Worker URL: https://vam-insurance-api.xxx.workers.dev
```

**✅ Xong Bước 1!** Backend đã live!

---

### ☐ BƯỚC 2: Setup Vercel (5 phút)

```powershell
# 1. Update Frontend API URL
# Edit: Frontend/.env.production
VITE_API_URL=https://vam-insurance-api.xxx.workers.dev
# ← Paste Worker URL từ Bước 1

# 2. Commit & push
git add Frontend/.env.production
git commit -m "Update API URL"
git push origin main
```

**Tại Vercel Dashboard:**

1. https://vercel.com → Login với GitHub
2. "Add New Project" → Import `VAM-Insurance`
3. Settings:
   - Framework: **Vite**
   - Root Directory: **Frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Environment Variables:
   - `VITE_API_URL` = (Worker URL từ Bước 1)
5. Click **"Deploy"**
6. Đợi 2 phút → Copy Vercel URL

**✅ Xong Bước 2!** Frontend đã live!

---

### ☐ BƯỚC 3: Update CORS (2 phút)

```powershell
cd CloudflareWorker

# Update FRONTEND_URL với Vercel URL thật
wrangler secret put FRONTEND_URL
# Paste: https://vam-insurance.vercel.app (URL từ Bước 2)

# Redeploy Worker
npm run deploy
```

**✅ Xong Bước 3!** CORS đã đúng!

---

### ☐ BƯỚC 4: Test (3 phút)

```powershell
# Test Backend
curl https://vam-insurance-api.xxx.workers.dev/health

# Expected: {"status":"healthy",...}
```

**Test Frontend:**
1. Mở: https://vam-insurance.vercel.app
2. Mở DevTools → Console
3. Không có CORS errors → ✅
4. Network tab → Requests đến Worker → ✅

**✅ Xong Bước 4!** Mọi thứ hoạt động!

---

### ☐ BƯỚC 5: Verify (5 phút)

**Test các endpoints:**

```javascript
// Tại browser console (https://vam-insurance.vercel.app)

// 1. Insurance packages
fetch('https://vam-insurance-api.xxx.workers.dev/insurance/packages')
  .then(r => r.json())
  .then(console.log)

// 2. Disaster locations
fetch('https://vam-insurance-api.xxx.workers.dev/disaster-locations')
  .then(r => r.json())
  .then(console.log)

// 3. Weather
fetch('https://vam-insurance-api.xxx.workers.dev/weather/21.0285/105.8542')
  .then(r => r.json())
  .then(console.log)
```

**✅ Xong Bước 5!** Đã deploy thành công!

---

## 🎉 KẾT QUẢ

**Frontend:** https://vam-insurance.vercel.app  
**Backend:** https://vam-insurance-api.xxx.workers.dev  

**Chi phí:** $0/tháng (Free tier)  
**Uptime:** 99.9%  
**Global CDN:** ✅  
**Auto HTTPS:** ✅  

---

## 🚨 NẾU CÓ VẤN ĐỀ

### Frontend không load được Backend

**Fix:**
```powershell
# 1. Check .env.production
cat Frontend/.env.production
# → Phải có VITE_API_URL đúng

# 2. Redeploy Vercel
# Tại Vercel Dashboard → Deployments → Redeploy
```

### CORS Error

**Fix:**
```powershell
cd CloudflareWorker
wrangler secret put FRONTEND_URL
# Paste exact Vercel URL (không có / cuối)
npm run deploy
```

### Worker Error 1101

**Fix:**
```powershell
# Check logs
wrangler tail

# Check secrets
wrangler secret list
# → Phải có đủ 4 secrets

# Recreate database
wrangler d1 execute vam_insurance_db --file=schema.sql
```

---

## 📞 HỖ TRỢ

**Chi tiết đầy đủ:** Đọc `DEPLOY_CLOUDFLARE.md`

**Logs:**
```powershell
# Worker logs
wrangler tail

# Vercel logs
# Dashboard → Project → Deployments → View Logs
```

---

## 🔄 REDEPLOY

**Frontend (tự động):**
```powershell
git add .
git commit -m "Update feature"
git push origin main
# Vercel auto-deploy trong 1-2 phút
```

**Backend:**
```powershell
cd CloudflareWorker
npm run deploy
```

---

**🚀 XONG! Bạn đã có production app chạy trên Vercel + Cloudflare!**

*Tạo bởi VAM Team - November 2025*
