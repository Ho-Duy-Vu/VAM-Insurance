"""
SQLAlchemy database models
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Document(Base):
    """
    Document model for storing uploaded documents
    """
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    status = Column(String, nullable=False, default="NOT_STARTED")  # NOT_STARTED, PROCESSING, DONE, ERROR
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with pages
    pages = relationship("Page", back_populates="document")

class Page(Base):
    """
    Page model for storing document pages
    """
    __tablename__ = "pages"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    page_index = Column(Integer, nullable=False)
    image_url = Column(String, nullable=False)
    
    # Relationship with document
    document = relationship("Document", back_populates="pages")

class Job(Base):
    """
    Job model for tracking processing jobs
    """
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    status = Column(String, nullable=False, default="PROCESSING")  # PROCESSING, DONE, ERROR
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    error_message = Column(Text, nullable=True)