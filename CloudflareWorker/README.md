# CloudflareWorker README

## VAM Insurance API - Cloudflare Workers

Serverless REST API backend cho VAM Insurance Platform, chạy trên Cloudflare Workers với edge computing.

## 🏗️ Kiến trúc

```
Cloudflare Workers (API)
    ↓
┌───────────────────────────────────┐
│  R2 Storage     │  D1 Database    │
│  (Files)        │  (SQLite)       │
└───────────────────────────────────┘
    ↓                   ↓
External APIs:    Gemini AI
                  OpenWeather
```

## 📁 Cấu trúc Project

```
CloudflareWorker/
├── src/
│   ├── index.ts              # Main Worker entry point
│   ├── middleware/
│   │   └── cors.ts           # CORS handling
│   └── routes/
│       ├── health.ts         # Health check
│       ├── auth.ts           # Authentication (JWT)
│       ├── documents.ts      # Document management
│       ├── disasters.ts      # Disaster locations
│       ├── insurance.ts      # Insurance packages
│       ├── weather.ts        # Weather API integration
│       └── geo-analyst.ts    # AI geo-analysis
├── schema.sql                # D1 database schema
├── wrangler.toml             # Cloudflare config
├── package.json
└── tsconfig.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm hoặc yarn
- Cloudflare account
- Wrangler CLI

### Installation

```bash
# Install dependencies
npm install

# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Setup Resources

```bash
# Create D1 Database
wrangler d1 create vam_insurance_db

# Create R2 Buckets
wrangler r2 bucket create vam-documents
wrangler r2 bucket create vam-images

# Create KV Namespace
wrangler kv:namespace create "CACHE"

# Import database schema
wrangler d1 execute vam_insurance_db --file=schema.sql
```

### Configure Secrets

```bash
# Set API keys
wrangler secret put GEMINI_API_KEY
wrangler secret put OPENWEATHER_API_KEY
wrangler secret put SECRET_KEY
wrangler secret put FRONTEND_URL
```

### Development

```bash
# Run local dev server
npm run dev

# Worker runs at http://localhost:8787
```

### Deployment

```bash
# Deploy to Cloudflare
npm run deploy

# Or with Wrangler
wrangler deploy
```

## 🔗 API Endpoints

### Health & Status

```
GET  /health              - Health check
```

### Authentication

```
POST /auth/register       - User registration
POST /auth/login          - User login
GET  /auth/me             - Get current user
```

### Documents

```
GET  /documents           - List documents
POST /documents/upload    - Upload document
GET  /documents/:id       - Get document details
```

### Disaster Locations

```
GET  /disaster-locations          - List all locations
POST /disaster-locations          - Create location
GET  /disaster-locations/:id      - Get location details
```

### Insurance

```
GET  /insurance/packages          - List insurance packages
POST /insurance/applications      - Create application
```

### Weather

```
GET  /weather/:lat/:lon   - Get weather by coordinates
```

### Geo Analyst

```
POST /geo-analyst/analyze - Analyze location for risks
```

## 🔐 Environment Variables

### Secrets (via Wrangler)

```bash
GEMINI_API_KEY          # Google Gemini AI API key
OPENWEATHER_API_KEY     # OpenWeatherMap API key
SECRET_KEY              # JWT signing secret (32+ chars)
FRONTEND_URL            # Frontend origin for CORS
```

### Variables (in wrangler.toml)

```toml
ENVIRONMENT = "production"
MAX_FILE_SIZE_MB = "10"
JWT_EXPIRE_MINUTES = "10080"
```

## 📦 Bindings

### D1 Database

```typescript
env.DB.prepare("SELECT * FROM users").all()
```

### R2 Storage

```typescript
await env.DOCUMENTS.put("file.pdf", fileData)
await env.IMAGES.get("image.jpg")
```

### KV Cache

```typescript
await env.CACHE.put("key", "value", { expirationTtl: 3600 })
await env.CACHE.get("key")
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:8787/health

# Weather API
curl http://localhost:8787/weather/21.0285/105.8542

# Insurance packages
curl http://localhost:8787/insurance/packages
```

## 📊 Monitoring

### View Logs

```bash
# Real-time logs
wrangler tail

# Specific deployment
wrangler tail --env production
```

### Database Queries

```bash
# Execute SQL
wrangler d1 execute vam_insurance_db --command="SELECT * FROM users"

# Backup database
wrangler d1 export vam_insurance_db --output=backup.sql
```

## 🚨 Troubleshooting

### Worker Error 1101

```bash
# Check logs
wrangler tail

# Verify bindings in wrangler.toml
# Ensure all secrets are set
wrangler secret list
```

### CORS Issues

```bash
# Update FRONTEND_URL secret
wrangler secret put FRONTEND_URL

# Redeploy
wrangler deploy
```

### Database Errors

```bash
# Recreate schema
wrangler d1 execute vam_insurance_db --file=schema.sql

# Check tables
wrangler d1 execute vam_insurance_db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

## 📈 Performance

### Free Tier Limits

- ✅ 100,000 requests/day
- ✅ 10ms CPU time/request
- ✅ 128MB memory/request
- ✅ R2: 10GB storage, unlimited bandwidth
- ✅ D1: 5GB storage, 5 million rows

### Optimization Tips

1. Use KV for caching frequently accessed data
2. Minimize database queries per request
3. Stream large R2 objects
4. Set appropriate cache headers

## 🔄 CI/CD

### GitHub Actions (Coming soon)

```yaml
# Auto-deploy on push to main
name: Deploy Worker
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
```

## 📚 Documentation

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
- [R2 Storage Docs](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Test locally với `npm run dev`
4. Deploy to preview: `wrangler deploy --env preview`
5. Create Pull Request

## 📄 License

MIT License - VAM Team 2025

---

**Built with ❤️ using Cloudflare Workers**
