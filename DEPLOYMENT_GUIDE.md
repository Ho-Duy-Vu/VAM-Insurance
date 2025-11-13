# 🚀 HƯỚNG DẪN DEPLOY VAM INSURANCE PROJECT

## 📋 Mục lục
1. [Chuẩn bị trước khi deploy](#chuẩn-bị)
2. [Option 1: Vercel + Render (Miễn phí)](#option-1-vercel--render)
3. [Option 2: VPS (DigitalOcean/AWS)](#option-2-vps)
4. [Option 3: Docker Deployment](#option-3-docker)
5. [Cấu hình môi trường](#cấu-hình-môi-trường)

---

## 🔧 Chuẩn bị

### 1. Tạo tài khoản các dịch vụ cần thiết

**Frontend (chọn 1):**
- ✅ [Vercel](https://vercel.com) (Khuyến nghị)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)

**Backend (chọn 1):**
- ✅ [Render](https://render.com) (Khuyến nghị - Free tier)
- [Railway](https://railway.app)
- [Fly.io](https://fly.io)
- [Heroku](https://heroku.com)

**Database:**
- SQLite (đang dùng) - OK cho development
- PostgreSQL - Khuyến nghị cho production

### 2. Push code lên GitHub

```bash
# Khởi tạo git repository (nếu chưa có)
cd "D:\DỰ ÁN CHUNG\DU_AN_CUA_VU\VAM_TEAM"
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Tạo repository trên GitHub rồi push
git remote add origin https://github.com/VUHODEV/VAM-Insurance.git
git branch -M main
git push -u origin main
```

---

## ⭐ Option 1: Vercel + Render (MIỄN PHÍ)

### A. Deploy Frontend lên Vercel

#### Bước 1: Chuẩn bị Frontend

1. **Tạo file `.env.production` trong thư mục Frontend:**

```env
VITE_API_URL=https://your-backend.onrender.com
```

2. **Update `vite.config.ts` nếu cần:**

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
```

#### Bước 2: Deploy

1. Truy cập https://vercel.com
2. Click "New Project"
3. Import repository từ GitHub: `VAM-Insurance`
4. Cấu hình:
   - **Framework Preset:** Vite
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_URL` = `https://your-backend.onrender.com`

5. Click "Deploy"
6. Đợi 2-3 phút → Done! 🎉

**URL Frontend:** `https://vam-insurance.vercel.app`

---

### B. Deploy Backend lên Render

#### Bước 1: Chuẩn bị Backend

1. **Tạo file `render.yaml` trong thư mục Backend:**

```yaml
services:
  - type: web
    name: vam-backend
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: DATABASE_URL
        value: sqlite:///./vam_insurance.db
```

2. **Update `main.py` để hỗ trợ CORS:**

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vam-insurance.vercel.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Bước 2: Deploy

1. Truy cập https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository: `VAM-Insurance`
4. Cấu hình:
   - **Name:** `vam-backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** `Backend`
   - **Instance Type:** Free

5. Environment Variables:
   - `PYTHON_VERSION` = `3.11.0`
   - `DATABASE_URL` = `sqlite:///./vam_insurance.db`
   - `GEMINI_API_KEY` = `your-api-key` (nếu có)

6. Click "Create Web Service"
7. Đợi 5-10 phút để build → Done! 🎉

**URL Backend:** `https://vam-backend.onrender.com`

#### Bước 3: Cập nhật Frontend với Backend URL

Quay lại Vercel → Settings → Environment Variables:
- Update `VITE_API_URL` = `https://vam-backend.onrender.com`
- Redeploy

---

## 🖥️ Option 2: Deploy lên VPS (DigitalOcean/AWS)

### A. Chuẩn bị VPS

1. **Tạo VPS:**
   - DigitalOcean Droplet (Ubuntu 22.04, $6/tháng)
   - AWS EC2 (t2.micro, free tier)
   - Vultr, Linode

2. **SSH vào VPS:**

```bash
ssh root@your-server-ip
```

3. **Cài đặt dependencies:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3 python3-pip python3-venv -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 (process manager)
sudo npm install -g pm2
```

### B. Deploy Backend

```bash
# Clone repository
cd /var/www
git clone https://github.com/VUHODEV/VAM-Insurance.git
cd VAM-Insurance/Backend

# Setup Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run with PM2
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" --name vam-backend
pm2 save
pm2 startup
```

### C. Deploy Frontend

```bash
cd /var/www/VAM-Insurance/Frontend

# Install dependencies
npm install

# Build
npm run build

# Copy build to Nginx
sudo cp -r dist/* /var/www/html/
```

### D. Cấu hình Nginx

```bash
sudo nano /etc/nginx/sites-available/vam-insurance
```

Nội dung:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/vam-insurance /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### E. Setup SSL (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

---

## 🐳 Option 3: Docker Deployment

### A. Tạo Dockerfile cho Backend

**File: `Backend/Dockerfile`**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### B. Tạo Dockerfile cho Frontend

**File: `Frontend/Dockerfile`**

```dockerfile
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**File: `Frontend/nginx.conf`**

```nginx
server {
    listen 80;
    server_name _;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

### C. Docker Compose

**File: `docker-compose.yml` (root của project)**

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./Backend/data:/app/data
    environment:
      - DATABASE_URL=sqlite:///./vam_insurance.db
    restart: unless-stopped

  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### D. Deploy với Docker

```bash
# Build và chạy
docker-compose up -d

# Kiểm tra logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🔐 Cấu hình môi trường

### Backend Environment Variables

Tạo file `Backend/.env`:

```env
# Database
DATABASE_URL=sqlite:///./vam_insurance.db

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Keys
GEMINI_API_KEY=your-gemini-api-key

# CORS
ALLOWED_ORIGINS=https://vam-insurance.vercel.app,http://localhost:5173

# File Storage
UPLOAD_DIR=./data
MAX_FILE_SIZE=10485760  # 10MB
```

### Frontend Environment Variables

Tạo file `Frontend/.env.production`:

```env
VITE_API_URL=https://vam-backend.onrender.com
```

---

## ✅ Checklist trước khi deploy

### Backend
- [ ] Update CORS origins với domain thật
- [ ] Thêm `.env` vào `.gitignore`
- [ ] Cấu hình database (SQLite → PostgreSQL cho production)
- [ ] Setup error logging (Sentry)
- [ ] Enable rate limiting
- [ ] Backup strategy cho database

### Frontend
- [ ] Update API URL trong `.env.production`
- [ ] Optimize images và assets
- [ ] Enable production build optimization
- [ ] Setup analytics (Google Analytics)
- [ ] Test responsive design
- [ ] PWA configuration (optional)

### Security
- [ ] Change all default passwords/secrets
- [ ] Enable HTTPS
- [ ] Setup firewall rules
- [ ] Regular backups
- [ ] Monitor logs

---

## 🔄 CI/CD (Tự động deploy khi push code)

### GitHub Actions cho Vercel + Render

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          cd Frontend
          npm install
          npm run build
        # Vercel tự động deploy khi detect push

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: echo "Render auto-deploys from main branch"
```

---

## 📊 Monitoring & Maintenance

### Theo dõi uptime
- [UptimeRobot](https://uptimerobot.com) - Free monitoring
- [Pingdom](https://pingdom.com)

### Error tracking
- [Sentry](https://sentry.io) - Free tier
- [LogRocket](https://logrocket.com)

### Analytics
- Google Analytics
- [Plausible](https://plausible.io)

---

## 🆘 Troubleshooting

### Backend không start được
```bash
# Kiểm tra logs
pm2 logs vam-backend

# Restart
pm2 restart vam-backend
```

### Frontend 404 errors
- Kiểm tra `try_files` trong Nginx config
- Verify build output directory

### CORS errors
- Cập nhật `allow_origins` trong `main.py`
- Check browser console cho error details

---

## 📞 Support

Nếu gặp vấn đề, check:
1. GitHub Issues của project
2. Documentation của platform (Vercel, Render)
3. Stack Overflow

---

**🎉 Chúc bạn deploy thành công!**
