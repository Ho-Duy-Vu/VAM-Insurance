"""
Database configuration and connection
SQLite database for document storage
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# SQLite database URL
DATABASE_URL = "sqlite:///./ade.db"

# 🚀 OPTIMIZED: Connection pooling for better performance
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False},  # Needed for SQLite
    pool_size=20,  # Increase pool size for concurrent requests
    max_overflow=30,  # Allow up to 30 extra connections
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,  # Recycle connections after 1 hour
    echo=False  # Disable SQL logging for better performance
)

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create declarative base
Base = declarative_base()

def get_db():
    """
    Get database session - use as context manager or manually close
    """
    db = SessionLocal()
    return db

async def init_db():
    """
    Initialize database tables
    """
    # Import models to register them
    from app.models import Document, Page, Job, User, InsurancePurchase, DisasterLocation
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully")