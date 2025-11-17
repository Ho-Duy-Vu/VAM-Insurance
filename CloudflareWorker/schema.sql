-- VAM Insurance D1 Database Schema
-- Run this after creating D1 database: wrangler d1 execute vam_insurance_db --file=schema.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT
);

CREATE INDEX idx_users_email ON users(email);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Document pages table
CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    page_number INTEGER NOT NULL,
    image_path TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    created_at TEXT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE INDEX idx_pages_document_id ON pages(document_id);

-- Disaster locations table
CREATE TABLE IF NOT EXISTS disaster_locations (
    id TEXT PRIMARY KEY,
    province TEXT NOT NULL,
    district TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    disaster_type TEXT DEFAULT 'unknown',
    status TEXT DEFAULT 'ổn_định',
    severity TEXT DEFAULT 'Thấp',
    marker_color TEXT DEFAULT 'green',
    weather_info TEXT,
    description TEXT,
    last_updated TEXT NOT NULL
);

CREATE INDEX idx_disaster_locations_province ON disaster_locations(province);
CREATE INDEX idx_disaster_locations_status ON disaster_locations(status);

-- Insurance applications table
CREATE TABLE IF NOT EXISTS insurance_applications (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    package_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    property_type TEXT,
    property_value REAL,
    latitude REAL,
    longitude REAL,
    status TEXT DEFAULT 'pending',
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_insurance_applications_user_id ON insurance_applications(user_id);
CREATE INDEX idx_insurance_applications_status ON insurance_applications(status);

-- Jobs table (for async processing)
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    job_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    result TEXT,
    error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE INDEX idx_jobs_document_id ON jobs(document_id);
CREATE INDEX idx_jobs_status ON jobs(status);
