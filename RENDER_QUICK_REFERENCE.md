# Quick Reference: Render Dashboard Settings

## 🔧 Backend Service Configuration

### Build & Deploy Settings

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Service Details
- **Name**: `vam-insurance-api`
- **Region**: Singapore / Oregon (choose closest)
- **Branch**: `main`
- **Root Directory**: `Backend`
- **Runtime**: Python 3
- **Python Version**: `3.11.0`
- **Instance Type**: Free

---

## 🔐 Environment Variables

Copy and paste these into Render dashboard:

```
PYTHON_VERSION=3.11.0
GEMINI_API_KEY=your-gemini-api-key-here
OPENWEATHER_API_KEY=your-openweather-key-here
SECRET_KEY=generate-32-char-random-string
ACCESS_TOKEN_EXPIRE_MINUTES=10080
FRONTEND_URL=https://vam-insurance.vercel.app
DATABASE_URL=sqlite:///./insurance.db
HOST=0.0.0.0
```

### Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## ✅ Deployment Checklist

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Set Root Directory to `Backend`
- [ ] Copy Build Command
- [ ] Copy Start Command
- [ ] Add all Environment Variables
- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes
- [ ] Copy your Render URL (e.g., `https://vam-insurance-api.onrender.com`)
- [ ] Update `Frontend/.env.production` with Render URL
- [ ] Deploy to Vercel
- [ ] Update `FRONTEND_URL` in Render with Vercel URL
- [ ] Test full-stack integration

---

## 🌐 Expected URLs

After deployment:
- Backend API: `https://vam-insurance-api.onrender.com`
- API Docs: `https://vam-insurance-api.onrender.com/docs`
- Health Check: `https://vam-insurance-api.onrender.com/health`
- Frontend: `https://vam-insurance.vercel.app`

---

## 🐛 Troubleshooting

### Build fails?
- Check `requirements.txt` exists in `Backend/` folder
- Verify Python version is 3.11.0
- Check Render build logs

### Service crashes on start?
- Verify Start Command is correct
- Check all environment variables are set
- Look at Render runtime logs

### CORS errors?
- Ensure `FRONTEND_URL` matches your Vercel URL exactly
- Include `https://` in the URL
- Redeploy backend after changing FRONTEND_URL

### API returns 404?
- Check Root Directory is set to `Backend`
- Verify `main.py` exists in Backend folder
- Check Render logs for startup errors
