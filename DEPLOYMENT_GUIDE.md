# 🚀 Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide will help you deploy the VAM Insurance application with:
- **Frontend**: React/Vite on Vercel
- **Backend**: FastAPI on Render

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier)
- Render account (free tier)
- Your API keys ready:
  - `GEMINI_API_KEY`
  - `OPENWEATHER_API_KEY`

---

## 🎯 Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select `VAM-Insurance` repository

### Step 3: Configure Build Settings

**Basic Settings:**
- **Name**: `vam-insurance-api` (or your preferred name)
- **Region**: Choose closest to your users (e.g., Singapore, Oregon)
- **Branch**: `main`
- **Root Directory**: `Backend`
- **Runtime**: `Python 3`
- **Build Command**:
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**:
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

**Instance Type:**
- Select **Free** tier

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `PYTHON_VERSION` | `3.11.0` | Python version |
| `GEMINI_API_KEY` | `your-gemini-api-key` | From Google AI Studio |
| `OPENWEATHER_API_KEY` | `your-openweather-key` | From OpenWeatherMap |
| `SECRET_KEY` | *Generate random 32+ chars* | For JWT tokens |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` | 7 days |
| `FRONTEND_URL` | `https://vam-insurance.vercel.app` | Will update after Vercel deploy |
| `DATABASE_URL` | `sqlite:///./insurance.db` | SQLite database |
| `HOST` | `0.0.0.0` | Listen on all interfaces |

**To generate SECRET_KEY (32+ characters):**
```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Or use online generator
# https://randomkeygen.com/
```

### Step 5: Deploy Backend

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build to complete
3. Once deployed, you'll get a URL like:
   ```
   https://vam-insurance-api.onrender.com
   ```
4. **Copy this URL** - you'll need it for Frontend setup

### Step 6: Test Backend API

Visit these endpoints to verify:
- Health check: `https://your-app.onrender.com/health`
- API docs: `https://your-app.onrender.com/docs`

Expected response from `/health`:
```json
{
  "status": "healthy",
  "timestamp": 1700000000.0
}
```

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment Variables

1. Open `Frontend/.env.production`
2. Replace the API URL with your Render backend URL:
   ```env
   VITE_API_URL=https://vam-insurance-api.onrender.com
   ```

3. Commit the change:
   ```bash
   git add Frontend/.env.production
   git commit -m "Update production API URL"
   git push origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository `VAM-Insurance`
4. Configure project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Environment Variables** (click "Add"):
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://vam-insurance-api.onrender.com` |

6. Click **"Deploy"**
7. Wait 2-3 minutes for deployment
8. You'll get a URL like:
   ```
   https://vam-insurance.vercel.app
   ```

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to Frontend
cd Frontend

# Deploy
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name: vam-insurance
# - Directory: ./
# - Override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: dist
```

### Step 3: Update Backend CORS Settings

Now that you have your Vercel URL, update the backend:

1. Go back to **Render Dashboard**
2. Select your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   https://vam-insurance.vercel.app
   ```
5. Click **"Save Changes"**
6. Backend will automatically redeploy

---

## ✅ Part 3: Verify Full-Stack Deployment

### Test the Integration

1. Visit your Vercel app: `https://vam-insurance.vercel.app`
2. Open browser DevTools (F12) → Network tab
3. Try these features:
   - Register a new account
   - Login
   - Upload a document
   - Check disaster map
   - View insurance packages

4. Check API calls in Network tab:
   - Should go to: `https://vam-insurance-api.onrender.com`
   - Status should be: `200 OK`
   - No CORS errors

### Common Issues & Solutions

#### ❌ CORS Error
**Problem**: `Access-Control-Allow-Origin` error in browser console

**Solution**:
1. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Check Render logs for CORS-related messages
3. Redeploy backend if needed

#### ❌ 404 on API Calls
**Problem**: Frontend gets 404 when calling backend

**Solution**:
1. Check `Frontend/.env.production` has correct `VITE_API_URL`
2. Verify backend is deployed and healthy: `/health` endpoint
3. Rebuild frontend on Vercel

#### ❌ 500 Internal Server Error
**Problem**: Backend returns 500 errors

**Solution**:
1. Check Render logs: Dashboard → Your Service → "Logs" tab
2. Verify all environment variables are set correctly
3. Check database initialization in logs

#### ⚠️ Render Free Tier Spin Down
**Note**: Render free tier spins down after 15 minutes of inactivity

**Impact**:
- First request after idle = 30-60 seconds cold start
- Subsequent requests = fast

**Solution**: Upgrade to paid tier ($7/month) for always-on service

---

## 🔧 Maintenance & Updates

### Update Backend Code

```bash
# Make changes to Backend code
git add Backend/
git commit -m "Update backend feature"
git push origin main

# Render will auto-deploy from GitHub
```

### Update Frontend Code

```bash
# Make changes to Frontend code
git add Frontend/
git commit -m "Update frontend feature"
git push origin main

# Vercel will auto-deploy from GitHub
```

### Update Environment Variables

**Backend (Render)**:
1. Dashboard → Service → "Environment"
2. Update variables
3. Save (auto-redeploys)

**Frontend (Vercel)**:
1. Dashboard → Project → "Settings" → "Environment Variables"
2. Update variables
3. Redeploy: "Deployments" → "..." → "Redeploy"

---

## 📊 Monitoring & Logs

### Backend Logs (Render)
- Dashboard → Service → "Logs" tab
- Real-time logs
- Filter by severity

### Frontend Logs (Vercel)
- Dashboard → Project → "Deployments" → Click deployment → "Logs"
- Build logs
- Runtime logs

### Analytics
- Vercel: Built-in analytics (paid feature)
- Render: Metrics tab (CPU, Memory, Response time)

---

## 💰 Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Vercel** | ✅ Unlimited deployments<br>100GB bandwidth/month<br>100 builds/day | $20/month<br>1TB bandwidth<br>6000 build minutes |
| **Render** | ✅ 750 hours/month<br>Spins down after 15min idle<br>512MB RAM | $7/month<br>Always-on<br>512MB RAM |
| **Total Free** | $0/month | - |
| **Total Paid** | - | $27/month |

---

## 🎓 Next Steps

1. ✅ Set up custom domain (optional)
   - Vercel: Project Settings → Domains
   - Update `FRONTEND_URL` in Render

2. ✅ Enable HTTPS (automatic on both platforms)

3. ✅ Set up monitoring/alerts
   - Render: Email notifications
   - Vercel: Slack/Discord integrations

4. ✅ Database backup (SQLite)
   - Render: Disk persistence is NOT guaranteed on free tier
   - Consider upgrading to PostgreSQL for production

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com/
- Vite Docs: https://vitejs.dev/

---

## 🎉 You're Live!

Your app is now deployed:
- 🌐 Frontend: `https://vam-insurance.vercel.app`
- 🔧 Backend: `https://vam-insurance-api.onrender.com`
- 📚 API Docs: `https://vam-insurance-api.onrender.com/docs`

Happy deploying! 🚀
