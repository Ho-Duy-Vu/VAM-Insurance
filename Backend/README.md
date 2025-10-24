# ADE Insurance Document Intelligence Backend API

Mock AI Document Processing API for Insurance Documents with FastAPI, SQLite, and file storage.

## 🚀 Features

- **Document Upload**: Support PDF, PNG, JPG files
- **AI Processing Simulation**: Mock AI processing with realistic delays
- **Job Status Tracking**: Real-time processing status and progress
- **Document Analysis**: Mock overlay regions, markdown, and JSON extraction
- **Database Storage**: SQLite for document metadata and job tracking
- **File Storage**: Local filesystem for uploaded documents
- **API Documentation**: Swagger UI and OpenAPI specs
- **CORS Support**: Frontend integration ready

## 📋 Requirements

- Python 3.12+
- FastAPI
- SQLite
- Local filesystem storage

## ⚡ Quick Start

### 1. Install Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

### 2. Start the Server

```bash
python main.py
```

The API will be available at:
- **API Server**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 3. Test the API

```bash
# Upload a document
curl -X POST "http://localhost:8000/documents/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@sample.pdf"

# Start processing
curl -X POST "http://localhost:8000/documents/{document_id}/process"

# Check job status
curl "http://localhost:8000/jobs/{job_id}"

# Get document data after processing
curl "http://localhost:8000/documents/{document_id}"
curl "http://localhost:8000/documents/{document_id}/overlay"
curl "http://localhost:8000/documents/{document_id}/markdown"
curl "http://localhost:8000/documents/{document_id}/json"
```

## 📚 API Endpoints

### Document Management
- `POST /documents/upload` - Upload document file
- `GET /documents/{id}` - Get document metadata
- `POST /documents/{id}/process` - Start AI processing

### Job Processing
- `GET /jobs/{job_id}` - Get processing status and progress

### Document Analysis
- `GET /documents/{id}/overlay` - Get overlay regions (bounding boxes)
- `GET /documents/{id}/markdown` - Get structured markdown content
- `GET /documents/{id}/json` - Get extracted fields as JSON

## 🗂️ Project Structure

```
Backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── ade.db              # SQLite database (auto-created)
├── app/
│   ├── __init__.py
│   ├── database.py     # Database configuration
│   ├── models.py       # SQLAlchemy models
│   └── schemas.py      # Pydantic schemas
├── mock/
│   ├── sample_overlay.json    # Mock overlay regions
│   ├── sample_markdown.md     # Mock markdown content
│   └── sample_fields.json     # Mock extracted fields
└── data/
    └── docs/           # Uploaded documents storage
```

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: SQLite database path (default: `sqlite:///./ade.db`)
- `UPLOAD_DIR`: Document storage directory (default: `./data/docs/`)

### CORS Configuration
Currently configured to allow:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:5174` (Vite dev server alt)
- `http://localhost:3000` (React dev server)

## 📊 Database Schema

### Documents Table
- `id` (TEXT PRIMARY KEY) - Document UUID
- `filename` (TEXT) - Original filename
- `status` (TEXT) - Processing status (NOT_STARTED, PROCESSING, DONE, ERROR)
- `created_at` (DATETIME) - Upload timestamp

### Pages Table
- `id` (INTEGER PRIMARY KEY) - Auto-increment ID
- `document_id` (TEXT FK) - Reference to document
- `page_index` (INTEGER) - Page number (0-based)
- `image_url` (TEXT) - URL to page image

### Jobs Table
- `id` (TEXT PRIMARY KEY) - Job UUID
- `document_id` (TEXT FK) - Reference to document
- `status` (TEXT) - Job status (PROCESSING, DONE, ERROR)
- `progress` (INTEGER) - Progress percentage (0-100)
- `created_at` (DATETIME) - Job start time
- `error_message` (TEXT) - Error details if failed

## 🧪 Mock Data

The API returns realistic mock data for document analysis:

### Overlay Regions
- Text regions with bounding boxes
- Signature areas
- Form fields and tables
- Highlighting and annotations

### Markdown Content
- Structured document analysis
- Tables and lists
- Professional formatting
- Insurance-specific terminology

### JSON Fields
- Policy information
- Animal records
- Veterinary certification
- Compliance data
- Metadata and confidence scores

## 🔄 Processing Flow

1. **Upload**: `POST /documents/upload` → Returns `document_id`
2. **Process**: `POST /documents/{id}/process` → Returns `job_id`
3. **Monitor**: `GET /jobs/{job_id}` → Track progress (0-100%)
4. **Analyze**: After status = "DONE":
   - `GET /documents/{id}` → Document metadata
   - `GET /documents/{id}/overlay` → Visual regions
   - `GET /documents/{id}/markdown` → Structured content
   - `GET /documents/{id}/json` → Extracted data

## 🚀 Development

### Run in Development Mode
```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Code Formatting
```bash
pip install black isort
black .
isort .
```

### API Testing
Use the built-in Swagger UI at http://localhost:8000/docs for interactive API testing.

## 📝 Notes

- This is a **mock implementation** for demonstration purposes
- No real AI processing is performed
- Processing delays are simulated for realistic UX
- All analysis results are static mock data
- File storage is local filesystem (not cloud storage)
- Database is SQLite (not production-grade)

## 🔗 Integration

This backend is designed to work with the ADE Insurance Frontend React application. Ensure both servers are running:

- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:8000

The frontend will automatically connect to the backend API for document processing.