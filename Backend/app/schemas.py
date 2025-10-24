"""
Pydantic schemas for API request/response validation
"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class UploadResponse(BaseModel):
    """Response for document upload"""
    document_id: str

class ProcessingRequest(BaseModel):
    """Request for document processing"""
    document_id: str

class JobResponse(BaseModel):
    """Response for job status"""
    status: str  # PROCESSING, DONE, ERROR
    progress: int  # 0-100

class PageResponse(BaseModel):
    """Response for document page"""
    page_index: int
    image_url: str

class DocumentResponse(BaseModel):
    """Response for document metadata"""
    document_id: str
    status: str
    pages: List[PageResponse]

class RegionData(BaseModel):
    """Individual region in overlay data"""
    id: str
    type: str
    page: int
    text: str
    bbox: List[int]  # [x, y, width, height]

class RegionResponse(BaseModel):
    """Response for document overlay regions"""
    regions: List[RegionData]

class DocumentFieldsResponse(BaseModel):
    """Response for structured document fields"""
    policy: Dict[str, Any]
    animals: List[Dict[str, Any]]
    attestation: Dict[str, Any]

# Error response models
class ErrorDetail(BaseModel):
    """Error detail structure"""
    message: str
    code: Optional[str] = None

class ErrorResponse(BaseModel):
    """Standard error response"""
    detail: str
    errors: Optional[List[ErrorDetail]] = None