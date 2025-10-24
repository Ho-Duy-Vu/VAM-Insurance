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
import time
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

try:
    from docx import Document as DocxDocument
    from docx.shared import Inches
    DOCX_PROCESSING_AVAILABLE = True
except ImportError:
    DOCX_PROCESSING_AVAILABLE = False
    print("Warning: python-docx not installed. DOCX processing will be limited.")

try:
    from pdf2image import convert_from_path
    PDF2IMAGE_AVAILABLE = True
except ImportError:
    PDF2IMAGE_AVAILABLE = False
    print("Warning: pdf2image not installed. Alternative PDF processing will be used.")

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
    Returns list of image URLs (relative to /data/)
    """
    if not PDF_PROCESSING_AVAILABLE:
        # Fallback: return original PDF path
        return [f"/data/docs/{document_id}.pdf"]
    
    image_urls = []
    
    try:
        # Open PDF
        pdf_doc = fitz.open(pdf_path)
        
        for page_num in range(len(pdf_doc)):
            # Get page
            page = pdf_doc.load_page(page_num)
            
            # Convert to image (150 DPI for good quality and reasonable file size)
            mat = fitz.Matrix(1.5, 1.5)  # 1.5x zoom = ~150 DPI
            pix = page.get_pixmap(matrix=mat)
            
            # Save as PNG in images folder
            image_filename = f"{document_id}_page_{page_num + 1}.png"
            image_path = f"data/images/{image_filename}"
            pix.save(image_path)
            
            # Return URL path
            image_urls.append(f"/data/images/{image_filename}")
            
        pdf_doc.close()
        
        # If no pages were processed, return fallback
        if not image_urls:
            return [f"/data/docs/{document_id}.pdf"]
        
    except Exception as e:
        print(f"Error processing PDF: {e}")
        # Fallback: return original PDF path
        return [f"/data/docs/{document_id}.pdf"]
    
    return image_urls

async def process_image_file(image_path: str, document_id: str, page_index: int = 0) -> str:
    """
    Process single image file (basic validation)
    Returns image URL path
    """
    # For now, just return the URL path without processing
    # In the future, could add resize/optimization here
    file_ext = os.path.splitext(image_path)[1]
    return f"/data/images/{document_id}{file_ext}"

async def process_docx_to_images(docx_path: str, document_id: str) -> List[str]:
    """
    Convert DOCX pages to individual images
    Returns list of image URLs (relative to /data/)
    """
    if not DOCX_PROCESSING_AVAILABLE:
        # Fallback: return original DOCX path
        return [f"/data/docs/{document_id}.docx"]
    
    image_urls = []
    
    try:
        # For DOCX, we'll create a preview image of the first page
        # This is a simplified approach - in production you might want to use more sophisticated methods
        
        # Load DOCX document
        doc = DocxDocument(docx_path)
        
        # Create a simple preview by extracting text and creating an image
        # For now, we'll just create one preview image
        preview_filename = f"{document_id}_preview.png"
        preview_path = f"data/images/{preview_filename}"
        
        # Create a simple text-based preview image
        if IMAGE_PROCESSING_AVAILABLE:
            from PIL import Image, ImageDraw, ImageFont
            
            # Get document text (first few paragraphs)
            text_content = ""
            paragraph_count = 0
            for paragraph in doc.paragraphs:
                if paragraph.text.strip() and paragraph_count < 10:  # First 10 paragraphs
                    text_content += paragraph.text.strip() + "\n\n"
                    paragraph_count += 1
            
            if not text_content:
                text_content = "DOCX Document Preview\n\nDocument contains formatted content."
            
            # Create image with text
            img_width, img_height = 800, 1000
            img = Image.new('RGB', (img_width, img_height), color='white')
            draw = ImageDraw.Draw(img)
            
            try:
                # Try to use a system font
                font = ImageFont.load_default()
            except:
                font = None
            
            # Draw text with word wrapping
            y_position = 50
            lines = text_content.split('\n')
            for line in lines[:30]:  # Limit to 30 lines
                if y_position > img_height - 50:
                    break
                draw.text((50, y_position), line[:80], fill='black', font=font)  # Limit line length
                y_position += 25
            
            # Save preview image
            img.save(preview_path, "PNG")
            image_urls.append(f"/data/images/{preview_filename}")
        else:
            # If PIL not available, return DOCX file path
            return [f"/data/docs/{document_id}.docx"]
        
    except Exception as e:
        print(f"Error processing DOCX: {e}")
        # Fallback: return original DOCX path
        return [f"/data/docs/{document_id}.docx"]
    
    return image_urls if image_urls else [f"/data/docs/{document_id}.docx"]

async def process_pdf_alternative(pdf_path: str, document_id: str) -> List[str]:
    """
    Alternative PDF processing using pdf2image
    Returns list of image URLs (relative to /data/)
    """
    if not PDF2IMAGE_AVAILABLE:
        return await process_pdf_to_images(pdf_path, document_id)
    
    image_urls = []
    
    try:
        # Convert PDF pages to images using pdf2image
        images = convert_from_path(pdf_path, dpi=150, first_page=1, last_page=10)  # Limit to first 10 pages
        
        for i, image in enumerate(images):
            image_filename = f"{document_id}_page_{i + 1}.png"
            image_path = f"data/images/{image_filename}"
            
            # Save image
            image.save(image_path, "PNG")
            image_urls.append(f"/data/images/{image_filename}")
            
        # If no pages were processed, fallback
        if not image_urls:
            return [f"/data/docs/{document_id}.pdf"]
        
    except Exception as e:
        print(f"Error in alternative PDF processing: {e}")
        # Fallback to original PDF processing
        return await process_pdf_to_images(pdf_path, document_id)
    
    return image_urls

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
    """Fast health check endpoint"""
    return {
        "status": "healthy",
        "message": "ADE Insurance Document Intelligence API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Fast health check for monitoring"""
    return {"status": "healthy", "timestamp": time.time()}

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
        if file_ext not in ['.pdf', '.docx', '.png', '.jpg', '.jpeg']:
            raise HTTPException(status_code=400, detail="Unsupported file format. Only PDF, DOCX, PNG, JPG are allowed.")
        
        # Save file to appropriate storage location
        if file_ext in ['.pdf', '.docx']:
            file_path = f"data/docs/{document_id}{file_ext}"
        else:
            file_path = f"data/images/{document_id}{file_ext}"
        
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
        
        # Create page records based on file type
        if file_ext == '.pdf':
            # For PDF: try to extract pages, fallback to single page if failed
            try:
                # Try alternative PDF processing first if available
                if PDF2IMAGE_AVAILABLE:
                    image_urls = await process_pdf_alternative(file_path, document_id)
                else:
                    image_urls = await process_pdf_to_images(file_path, document_id)
                
                # Create page for each extracted image/page
                for i, image_url in enumerate(image_urls):
                    page = Page(
                        document_id=document_id,
                        page_index=i,
                        image_url=image_url
                    )
                    db.add(page)
            except Exception as e:
                print(f"PDF processing failed: {e}")
                # Fallback: single page pointing to PDF
                page = Page(
                    document_id=document_id,
                    page_index=0,
                    image_url=f"/data/docs/{document_id}{file_ext}"
                )
                db.add(page)
        elif file_ext == '.docx':
            # For DOCX: try to create preview images
            try:
                image_urls = await process_docx_to_images(file_path, document_id)
                # Create page for each preview image
                for i, image_url in enumerate(image_urls):
                    page = Page(
                        document_id=document_id,
                        page_index=i,
                        image_url=image_url
                    )
                    db.add(page)
            except Exception as e:
                print(f"DOCX processing failed: {e}")
                # Fallback: single page pointing to DOCX
                page = Page(
                    document_id=document_id,
                    page_index=0,
                    image_url=f"/data/docs/{document_id}{file_ext}"
                )
                db.add(page)
        else:
            # For images: single page pointing to the image
            page = Page(
                document_id=document_id,
                page_index=0,
                image_url=f"/data/images/{document_id}{file_ext}"
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
    Get document overlay regions (mock data with unique IDs per document)
    """
    db = get_db()
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if document.status != "DONE":
        raise HTTPException(status_code=400, detail="Document not yet processed")
    
    # Return mock overlay data with unique IDs per document
    try:
        with open("mock/sample_overlay.json", "r") as f:
            overlay_data = json.load(f)
        
        # Generate unique region IDs for this document
        import uuid
        for region in overlay_data["regions"]:
            # Create unique ID combining document_id and original region id
            unique_id = f"{document_id}_{region['id']}_{str(uuid.uuid4())[:8]}"
            region["id"] = unique_id
            
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