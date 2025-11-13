"""
Pydantic schemas for API request/response validation
"""

from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime

# Authentication Schemas
class UserRegister(BaseModel):
    """User registration request"""
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    password: str
    
    # Optional profile fields during registration
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    id_number: Optional[str] = None
    place_of_origin: Optional[str] = None
    occupation: Optional[str] = None
    
    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v):
        if len(v) < 3:
            raise ValueError('Full name must be at least 3 characters')
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v
    
    @field_validator('gender')
    @classmethod
    def validate_gender(cls, v):
        if v and v not in ['Nam', 'Nữ', 'Khác']:
            raise ValueError('Gender must be Nam, Nữ, or Khác')
        return v

class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """User response with full profile information"""
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    
    # Extended profile information
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    id_number: Optional[str] = None
    place_of_origin: Optional[str] = None
    occupation: Optional[str] = None
    monthly_income: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    
    # Insurance preferences
    preferred_payment_method: Optional[str] = None
    risk_profile: Optional[str] = None
    notification_preferences: Optional[str] = None
    
    # Metadata
    avatar_url: Optional[str] = None
    last_login: Optional[datetime] = None
    profile_completed: Optional[bool] = False
    is_active: Optional[bool] = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    """User profile update request"""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    id_number: Optional[str] = None
    place_of_origin: Optional[str] = None
    occupation: Optional[str] = None
    monthly_income: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    preferred_payment_method: Optional[str] = None
    risk_profile: Optional[str] = None
    notification_preferences: Optional[str] = None
    avatar_url: Optional[str] = None
    
    @field_validator('gender')
    @classmethod
    def validate_gender(cls, v):
        if v and v not in ['Nam', 'Nữ', 'Khác']:
            raise ValueError('Gender must be Nam, Nữ, or Khác')
        return v
    
    @field_validator('risk_profile')
    @classmethod
    def validate_risk_profile(cls, v):
        if v and v not in ['Thấp', 'Trung bình', 'Cao']:
            raise ValueError('Risk profile must be Thấp, Trung bình, or Cao')
        return v

class ChangePasswordRequest(BaseModel):
    """Change password request"""
    current_password: str
    new_password: str
    
    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class TokenResponse(BaseModel):
    """Authentication token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

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

# Disaster Location Schemas
class WeatherInfo(BaseModel):
    """Weather information from API"""
    temperature: Optional[float] = None
    condition: Optional[str] = None
    description: Optional[str] = None
    humidity: Optional[int] = None
    wind_speed: Optional[float] = None
    alert: Optional[str] = None

class DisasterLocationBase(BaseModel):
    """Base disaster location schema"""
    province: str
    region: str
    latitude: str
    longitude: str
    status: str = "ổn_định"
    marker_color: str = "green"
    severity: str = "Thấp"
    advice: Optional[str] = None
    detail: Optional[str] = None
    recommended_packages: Optional[List[str]] = None

class DisasterLocationCreate(DisasterLocationBase):
    """Schema for creating disaster location"""
    id: str

class DisasterLocationUpdate(BaseModel):
    """Schema for updating disaster location"""
    province: Optional[str] = None
    region: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    status: Optional[str] = None
    marker_color: Optional[str] = None
    severity: Optional[str] = None
    advice: Optional[str] = None
    detail: Optional[str] = None
    recommended_packages: Optional[List[str]] = None
    weather_info: Optional[Dict[str, Any]] = None

class DisasterLocationResponse(DisasterLocationBase):
    """Schema for disaster location response"""
    id: str
    weather_info: Optional[Dict[str, Any]] = None
    last_updated: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

# Error response models
class ErrorDetail(BaseModel):
    """Error detail structure"""
    message: str
    code: Optional[str] = None

class ErrorResponse(BaseModel):
    """Standard error response"""
    detail: str
    errors: Optional[List[ErrorDetail]] = None