# 🚀 HƯỚNG DẪN DEPLOY NHANH - VERCEL + RENDER

## ✅ Bước 1: Deploy Backend lên Render (5 phút)

### 1.1. Đăng ký/Đăng nhập Render
1. Truy cập: **https://render.com**
2. Click **"Get Started"** hoặc **"Sign In"**
3. Chọn **"Sign in with GitHub"** (khuyến nghị)
4. Authorize Render truy cập GitHub

### 1.2. Tạo Web Service cho Backend
1. Click **"New +"** ở góc phải trên
2. Chọn **"Web Service"**

### 1.3. Connect Repository
1. Tìm repository **"VAM-Insurance"** (hoặc VUHODEV/VAM-Insurance)
2. Click **"Connect"**
   - Nếu không thấy repo, click **"Configure GitHub account"** để grant access

### 1.4. Cấu hình Service

Điền các thông tin sau:

| Setting | Value |
|---------|-------|
| **Name** | `vam-backend` |
| **Region** | `Singapore` (hoặc gần nhất) |
| **Branch** | `main` |
| **Root Directory** | `Backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

### 1.5. Environment Variables

Trong phần **Environment Variables**, click **"Add Environment Variable"** và thêm:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.0` |
| `DATABASE_URL` | `sqlite:///./vam_insurance.db` |
| `FRONTEND_URL` | `https://vam-insurance.vercel.app` *(sẽ update sau)* |
| `ENVIRONMENT` | `production` |
| `SECRET_KEY` | `your-random-secret-key-here` *(generate random string)* |

**Tạo SECRET_KEY ngẫu nhiên:**
```bash
# Run trong terminal
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 1.6. Deploy
1. Click **"Create Web Service"**
2. Đợi 5-10 phút để Render build và deploy
3. ✅ Khi thấy **"Live"** → Deploy thành công!

### 1.7. Copy Backend URL
1. Tìm URL ở đầu trang (ví dụ: `https://vam-backend-abc123.onrender.com`)
2. **LƯU LẠI URL NÀY** - sẽ dùng cho Frontend

---

## ✅ Bước 2: Deploy Frontend lên Vercel (3 phút)

### 2.1. Đăng ký/Đăng nhập Vercel
1. Truy cập: **https://vercel.com**
2. Click **"Sign Up"** hoặc **"Login"**
3. Chọn **"Continue with GitHub"**
4. Authorize Vercel

### 2.2. Import Project
1. Click **"Add New..."** → **"Project"**
2. Tìm repository **"VAM-Insurance"**
3. Click **"Import"**

### 2.3. Cấu hình Project

#### Framework Preset
- Vercel tự động detect **Vite** → Để nguyên

#### Root Directory
1. Click **"Edit"** bên cạnh Root Directory
2. Chọn **`Frontend`**
3. Click **"Continue"**

#### Build Settings (tự động)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### Environment Variables
Click **"Add Environment Variable"** và thêm:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://vam-backend-abc123.onrender.com` |

⚠️ **QUAN TRỌNG:** Thay `https://vam-backend-abc123.onrender.com` bằng URL backend thật từ Bước 1.7

### 2.4. Deploy
1. Click **"Deploy"**
2. Đợi 2-3 phút
3. ✅ Khi thấy **"Congratulations!"** → Deploy thành công!

### 2.5. Copy Frontend URL
1. Click **"Continue to Dashboard"**
2. Copy URL (ví dụ: `https://vam-insurance.vercel.app`)

---

## ✅ Bước 3: Update CORS Backend (2 phút)

### 3.1. Quay lại Render Dashboard
1. Vào **https://dashboard.render.com**
2. Click vào service **"vam-backend"**

### 3.2. Update Environment Variable
1. Vào tab **"Environment"**
2. Tìm variable **`FRONTEND_URL`**
3. Click **"Edit"**
4. Thay đổi value thành: `https://vam-insurance.vercel.app` (URL frontend thật)
5. Click **"Save Changes"**

### 3.3. Redeploy Backend
1. Vào tab **"Manual Deploy"**
2. Click **"Deploy latest commit"**
3. Đợi 2-3 phút để redeploy

---

## ✅ Bước 4: Test Website (1 phút)

### 4.1. Mở Frontend URL
Truy cập: `https://vam-insurance.vercel.app`

### 4.2. Kiểm tra
1. ✅ Trang chủ load được
2. ✅ Login/Register hoạt động
3. ✅ Upload document hoạt động
4. ✅ Bản đồ hiển thị đúng

### 4.3. Kiểm tra API
Truy cập: `https://vam-backend-abc123.onrender.com/docs`
- ✅ Thấy Swagger UI → Backend OK

---

## 🎉 HOÀN TẤT!

### URLs của bạn:
- 🌐 **Frontend:** https://vam-insurance.vercel.app
- 🔧 **Backend:** https://vam-backend.onrender.com
- 📚 **API Docs:** https://vam-backend.onrender.com/docs

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Render Free Tier
- Backend sẽ **sleep sau 15 phút không hoạt động**
- Request đầu tiên sau khi sleep sẽ mất **30-60 giây** để wake up
- Giải pháp: Upgrade lên paid plan ($7/tháng) hoặc dùng cron job để ping

### Vercel Free Tier
- Bandwidth: 100GB/tháng
- Build time: 6000 phút/tháng
- Đủ dùng cho project cá nhân

### Database
- Đang dùng SQLite (file local)
- Data sẽ **MẤT** khi redeploy
- **Khuyến nghị:** Upgrade lên PostgreSQL cho production

---

## 🔄 Update Code và Auto Redeploy

Mỗi khi push code lên GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
```

- ✅ Vercel tự động redeploy Frontend
- ✅ Render tự động redeploy Backend
- ⏱️ Thời gian: 2-3 phút

---

## 🆘 Troubleshooting

### CORS Error
1. Kiểm tra `FRONTEND_URL` trong Render Environment
2. Kiểm tra `VITE_API_URL` trong Vercel Environment
3. Redeploy cả 2 services

### Backend 502 Error
1. Check logs trong Render Dashboard → Logs
2. Có thể backend đang sleep → Đợi 30s
3. Check build logs xem có lỗi gì

### Frontend không connect Backend
1. Mở Developer Console (F12)
2. Kiểm tra Network tab → API calls có đúng URL không
3. Update lại `VITE_API_URL` trong Vercel
4. Redeploy Frontend

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Check logs trên Render/Vercel
2. Đọc error message cẩn thận
3. Google error message + "Render" hoặc "Vercel"

**🎊 Chúc bạn deploy thành công!**
