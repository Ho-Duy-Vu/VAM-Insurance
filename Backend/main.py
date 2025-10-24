"""
ADE Insurance Document Intelligence Backend API
FastAPI server with mock AI processing capabilities
"""

from fastapi import FastAPI, HTTPException, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, PlainTextResponse
from contextlib import asynccontextmanager
import os
import uuid
import asyncio
import aiofiles
from datetime import datetime
from typing import Optional, List
import json

# PDF and Image processing imports
try:
    import fitz  # PyMuPDF
    PDF_PROCESSING_AVAILABLE = True
except ImportError:
    PDF_PROCESSING_AVAILABLE = False
    print("Warning: PyMuPDF not installed. PDF processing will be limited.")

try:
    from PIL import Image
    IMAGE_PROCESSING_AVAILABLE = True
except ImportError:
    IMAGE_PROCESSING_AVAILABLE = False
    print("Warning: Pillow not installed. Image processing will be limited.")

from app.database import init_db, get_db
from app.models import Document, Job, Page
from app.schemas import (
    DocumentResponse,
    JobResponse,
    UploadResponse,
    RegionResponse,
    ProcessingRequest
)

# PDF Processing Functions
async def process_pdf_to_images(pdf_path: str, document_id: str) -> List[str]:
    """
    Convert PDF pages to individual images
    Returns list of image file paths
    """
    if not PDF_PROCESSING_AVAILABLE:
        # Fallback: create a single page for PDF
        return [pdf_path]
    
    image_paths = []
    
    try:
        # Open PDF
        pdf_doc = fitz.open(pdf_path)
        
        for page_num in range(len(pdf_doc)):
            # Get page
            page = pdf_doc.load_page(page_num)
            
            # Convert to image (300 DPI for good quality)
            mat = fitz.Matrix(2.0, 2.0)  # 2x zoom = ~300 DPI
            pix = page.get_pixmap(matrix=mat)
            
            # Save as PNG
            image_path = f"data/images/{document_id}_page_{page_num + 1}.png"
            pix.save(image_path)
            image_paths.append(image_path)
            
        pdf_doc.close()
        
    except Exception as e:
        print(f"Error processing PDF: {e}")
        # Fallback: return original PDF path
        return [pdf_path]
    
    return image_paths

async def process_image_file(image_path: str, document_id: str, page_index: int = 0) -> str:
    """
    Process single image file (resize if needed)
    Returns processed image path
    """
    if not IMAGE_PROCESSING_AVAILABLE:
        return image_path
        
    try:
        # Open and potentially resize image
        with Image.open(image_path) as img:
            # If image is too large, resize it
            max_size = (2048, 2048)
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Save processed image
                processed_path = f"data/images/{document_id}_page_{page_index + 1}_processed.png"
                img.save(processed_path, "PNG")
                return processed_path
                
    except Exception as e:
        print(f"Error processing image: {e}")
        
    return image_path

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    # Create data directories if they don't exist
    os.makedirs("data/docs", exist_ok=True)
    os.makedirs("data/images", exist_ok=True)
    yield
    # Shutdown (cleanup if needed)

# Initialize FastAPI app
app = FastAPI(
    title="ADE Insurance Document Intelligence API",
    description="Mock AI Document Processing API for Insurance Documents",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (uploaded documents and images)
app.mount("/data", StaticFiles(directory="data"), name="data")

# Mock job storage (in production, use Redis/RQ)
jobs_storage = {}

@app.get("/")
async def root():
    return {
        "message": "ADE Insurance Document Intelligence API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.post("/documents/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a document file and create a new document record
    """
    try:
        # Generate unique document ID
        document_id = str(uuid.uuid4())
        
        # Get file extension
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ['.pdf', '.png', '.jpg', '.jpeg']:
            raise HTTPException(status_code=400, detail="Unsupported file format. Only PDF, PNG, JPG are allowed.")
        
        # Save file to local storage
        # Save images to images folder, documents to docs folder
        if file_ext in ['.png', '.jpg', '.jpeg']:
            file_path = f"data/images/{document_id}{file_ext}"
        else:
            file_path = f"data/docs/{document_id}{file_ext}"
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Create document record in database
        db = get_db()
        document = Document(
            id=document_id,
            filename=file.filename,
            status="NOT_STARTED",
            created_at=datetime.utcnow()
        )
        db.add(document)
        
        # Process file and create page records
        if file_ext == '.pdf':
            # Process PDF to images
            image_paths = await process_pdf_to_images(file_path, document_id)
            
            # Create page records for each PDF page
            for i, img_path in enumerate(image_paths):
                # Convert absolute path to URL path
                if img_path.startswith('data/'):
                    image_url = f"/{img_path}"
                else:
                    image_url = f"/data/docs/{document_id}{file_ext}"
                    
                page = Page(
                    document_id=document_id,
                    page_index=i,
                    image_url=image_url
                )
                db.add(page)
        else:
            # Single image file
            processed_image_path = await process_image_file(file_path, document_id, 0)
            
            # Convert absolute path to URL path
            if processed_image_path.startswith('data/'):
                image_url = f"/{processed_image_path}"
            else:
                image_url = f"/data/images/{document_id}{file_ext}"
            
            page = Page(
                document_id=document_id,
                page_index=0,
                image_url=image_url
            )
            db.add(page)
        
        db.commit()
        
        return UploadResponse(document_id=document_id)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/documents/{document_id}/process")
async def process_document(document_id: str, background_tasks: BackgroundTasks):
    """
    Start AI processing for a document (mock implementation)
    """
    db = get_db()
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.status != "NOT_STARTED":
        raise HTTPException(status_code=400, detail="Document already processed or in progress")
    
    # Generate job ID
    job_id = str(uuid.uuid4())
    
    # Create job record
    job = Job(
        id=job_id,
        document_id=document_id,
        status="PROCESSING",
        progress=0
    )
    
    # Store job in mock storage
    jobs_storage[job_id] = {
        "status": "PROCESSING",
        "progress": 0,
        "document_id": document_id
    }
    
    # Update document status
    document.status = "PROCESSING"
    db.commit()
    
    # Start background processing
    background_tasks.add_task(mock_ai_processing, job_id, document_id)
    
    return {"job_id": job_id, "status": "PROCESSING"}

async def mock_ai_processing(job_id: str, document_id: str):
    """
    Mock AI processing with realistic delays and progress updates
    """
    try:
        # Simulate AI processing with progress updates
        progress_steps = [10, 25, 50, 75, 90, 100]
        
        for progress in progress_steps:
            await asyncio.sleep(0.5)  # Simulate processing time
            
            # Update job progress
            if job_id in jobs_storage:
                jobs_storage[job_id]["progress"] = progress
                
                if progress == 100:
                    jobs_storage[job_id]["status"] = "DONE"
                    
                    # Update document status in database
                    db = get_db()
                    document = db.query(Document).filter(Document.id == document_id).first()
                    if document:
                        document.status = "DONE"
                        db.commit()
    
    except Exception as e:
        # Handle processing errors
        if job_id in jobs_storage:
            jobs_storage[job_id]["status"] = "ERROR"
            jobs_storage[job_id]["error"] = str(e)

@app.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_status(job_id: str):
    """
    Get job processing status and progress
    """
    if job_id not in jobs_storage:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_data = jobs_storage[job_id]
    return JobResponse(
        status=job_data["status"],
        progress=job_data["progress"]
    )

@app.get("/documents/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """
    Get document metadata and pages
    """
    db = get_db()
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Get document pages
    pages = db.query(Page).filter(Page.document_id == document_id).all()
    
    pages_data = [
        {
            "page_index": page.page_index,
            "image_url": page.image_url
        }
        for page in pages
    ]
    
    return DocumentResponse(
        document_id=document.id,
        status=document.status,
        pages=pages_data
    )

@app.get("/documents/{document_id}/overlay")
async def get_document_overlay(document_id: str):
    """
    Get document overlay regions (mock data)
    """
    db = get_db()
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.status != "DONE":
        raise HTTPException(status_code=400, detail="Document not yet processed")
    
    # Return mock overlay data
    try:
        with open("mock/sample_overlay.json", "r") as f:
            overlay_data = json.load(f)
        return overlay_data
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mock overlay data not found")

@app.get("/documents/{document_id}/markdown")
async def get_document_markdown(document_id: str):
    """
    Get document content as markdown (mock data)
    """
    db = get_db()
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.status != "DONE":
        raise HTTPException(status_code=400, detail="Document not yet processed")
    
    # Return mock markdown data
    try:
        with open("mock/sample_markdown.md", "r", encoding="utf-8") as f:
            markdown_content = f.read()
        return PlainTextResponse(content=markdown_content, media_type="text/markdown")
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mock markdown data not found")

@app.get("/documents/{document_id}/json")
async def get_document_json(document_id: str):
    """
    Get document structured data as JSON (mock data)
    """
    db = get_db()
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.status != "DONE":
        raise HTTPException(status_code=400, detail="Document not yet processed")
    
    # Return mock JSON data
    try:
        with open("mock/sample_fields.json", "r") as f:
            json_data = json.load(f)
        return json_data
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Mock JSON data not found")

@app.put("/documents/{document_id}/json")
async def update_document_json(document_id: str, json_data: dict):
    """
    Update document JSON data
    """
    db = get_db()
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # In a real implementation, you would save this to database
    # For now, just return success
    return {"success": True, "message": "JSON data updated successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)