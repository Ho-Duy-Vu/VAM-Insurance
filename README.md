# VAM Insurance Platform

## Overview

VAM Insurance is a comprehensive digital insurance platform that combines intelligent document processing, disaster risk analysis, and personalized insurance recommendations. The platform leverages AI technology to provide automated document analysis, real-time disaster monitoring, and tailored insurance solutions for individuals and businesses.

## Core Features

### Intelligent Document Processing
The platform offers advanced document analysis capabilities powered by Google's Gemini AI, enabling automatic extraction and validation of insurance policy information. Users can upload documents in multiple formats (PDF, PNG, JPG, JPEG) and receive structured data extraction with visual region highlighting. The system automatically identifies key information including policy details, customer data, and coverage terms, making policy management efficient and error-free.

### Disaster Risk Analysis
Real-time disaster monitoring and risk assessment help users make informed decisions about insurance coverage. The platform integrates geographical data to identify natural disaster patterns, provides interactive disaster mapping with historical event tracking, and generates detailed risk assessments based on location-specific factors. Users can visualize disaster-prone areas and understand potential risks to their properties and assets.

### AI-Powered Insurance Consultation
An intelligent chatbot provides personalized insurance guidance, answering questions about coverage options, policy terms, and claims procedures. The consultation system offers product recommendations based on individual needs, explains complex insurance terminology in simple language, and assists with policy selection and comparison.

### Geographical Intelligence
Advanced geo-analysis capabilities help users understand location-based risks and coverage requirements. The platform analyzes regional disaster patterns, provides weather forecasting integration, and offers location-specific insurance recommendations based on environmental factors and historical data.

## Technology Stack

### Backend Infrastructure
Built on **FastAPI** (v0.104.1) with **Python 3.11**, the backend delivers high-performance API services with asynchronous request handling. The architecture leverages:

- **SQLAlchemy 2.0.23** - Advanced ORM for database operations with async support
- **Pydantic 2.5.0** - Data validation and settings management using Python type annotations
- **JWT (PyJWT 2.8.0)** - JSON Web Token authentication with python-jose for cryptographic signing
- **bcrypt 4.2.1** - Secure password hashing and verification
- **Uvicorn 0.24.0** - Lightning-fast ASGI server with standard extras for production deployment
- **SQLite/PostgreSQL** - SQLite for development with seamless PostgreSQL migration for production

### Frontend Architecture
The modern **React 19** application utilizes **TypeScript 5.9.3** for type safety and maintainability. Core technologies include:

- **Vite 7.1.14** - Next-generation build tool with Rolldown bundler for optimal performance
- **TailwindCSS 3.4.0** - Utility-first CSS framework for responsive design
- **Zustand 5.0.8** - Lightweight state management library
- **React Router DOM 7.9.4** - Declarative routing for single-page applications
- **TanStack Query 5.90.5** - Powerful data synchronization and server state management
- **Radix UI** - Accessible, unstyled component primitives (Dialog, Progress, Tabs)
- **Leaflet 1.9.4** - Interactive mapping library with React Leaflet integration
- **Konva 10.0.7** - Canvas library for visual document annotation via React Konva
- **React Markdown** - Markdown rendering with GitHub-flavored markdown support
- **Lucide React** - Modern icon library with 1000+ customizable icons

### AI & External APIs
The platform integrates multiple external services for intelligent functionality:

- **Google Gemini AI API** (google-generativeai 0.8.3) - Advanced language model for:
  - Vietnamese document OCR and text extraction
  - Structured data extraction from insurance policies and ID cards
  - Natural language conversation for insurance consultation
  - Context-aware policy recommendations
  
- **OpenWeatherMap API** (via httpx 0.27.0) - Real-time weather intelligence:
  - Current weather conditions with 10-minute update intervals
  - Temperature, humidity, pressure, and precipitation data
  - Wind speed monitoring for disaster detection
  - 5-day weather forecasting integration
  - Multilingual support (Vietnamese localization)

### Document Processing Libraries
Comprehensive document handling capabilities powered by:

- **PyMuPDF (fitz) 1.23.18** - High-performance PDF rendering and manipulation
- **Pillow 10.2.0** - Advanced image processing (resize, format conversion, optimization)
- **python-docx 0.8.11** - Microsoft Word document generation and parsing
- **pdf2image 1.16.3** - PDF to image conversion for visual processing
- **ReportLab 4.0.7** - Dynamic PDF generation with custom layouts

### Deployment Infrastructure
The platform is deployed using modern cloud infrastructure with the frontend hosted on Vercel for global CDN distribution and automatic deployments. The backend runs on Render with container-based deployment, environment-based configuration management, and automated health monitoring. The system includes Docker support for local development and alternative deployment options.

## Architecture

The application follows a modern microservices architecture with clear separation between frontend and backend services. The frontend communicates with the backend through RESTful APIs, handling user interactions, document uploads, and data visualization. The backend manages business logic, database operations, AI service integration, and external API communications. This separation enables independent scaling, simplified maintenance, and flexible deployment strategies.

## Security & Authentication

User authentication is implemented using JWT tokens with secure password hashing via bcrypt. The platform enforces CORS policies to prevent unauthorized access, validates all input data to prevent injection attacks, and maintains secure session management. Environment variables protect sensitive configuration data, and API endpoints are protected with role-based access control.

## Use Cases

### Individual Insurance Seekers
Users can upload existing insurance documents for automated analysis, receive personalized insurance recommendations based on location and risk factors, explore disaster risk in their area, and compare different insurance packages with AI assistance.

### Insurance Agents
Agents benefit from automated document processing to reduce manual data entry, quick policy information extraction and verification, visual tools to present coverage options to clients, and integrated risk assessment reports for better customer consultation.

### Property Owners
Property owners can assess natural disaster risks for specific locations, understand appropriate coverage requirements for their properties, track historical disaster events in their area, and make informed decisions about property insurance needs.

## Key Capabilities

### Document Intelligence
Multi-page PDF processing with automatic page splitting ensures comprehensive document analysis. The system performs OCR and text extraction with high accuracy, detects and categorizes document regions (text, tables, signatures), and provides structured JSON output with validation. Users can edit extracted data through an intuitive interface and export information in multiple formats.

### Risk Assessment
The platform analyzes geographical vulnerability to natural disasters, integrates weather data for current and forecasted conditions, and generates comprehensive risk reports with visualization. Historical disaster data informs long-term risk patterns, helping users understand trends and make proactive insurance decisions.

### Insurance Recommendation
AI-driven product matching considers user profiles, location data, and risk factors to suggest optimal coverage options. The recommendation engine explains policy features and benefits in clear language, compares multiple insurance packages side-by-side, and adapts suggestions based on budget constraints and coverage preferences.

### User Experience
The responsive design ensures seamless access across desktop, tablet, and mobile devices. Theme customization allows users to switch between light and dark modes for comfortable viewing. Real-time progress indicators keep users informed during document processing, and interactive visualizations make complex data accessible and understandable.

## Deployment

The platform is production-ready with automated deployment pipelines. The frontend deploys to Vercel with automatic builds triggered by GitHub commits, global CDN distribution for fast load times, and environment-based configuration for development, staging, and production. The backend deploys to Render with containerized Python application, automatic dependency management, and health check monitoring for reliability.

## Development

The codebase maintains high standards with TypeScript for type safety across the frontend, Pydantic for data validation in the backend, and comprehensive error handling throughout the application. The development environment supports hot module replacement for rapid development, environment-based configuration for different deployment stages, and modular component architecture for maintainability.

## Innovation

VAM Insurance represents the convergence of traditional insurance services with modern AI technology. By automating document processing, providing intelligent risk analysis, and offering personalized recommendations, the platform transforms how users interact with insurance products. The system reduces administrative overhead, improves decision-making through data-driven insights, and makes insurance accessible and understandable for everyone.

---

**VAM Insurance Platform** - Intelligent Insurance Solutions for a Safer Future

*Powered by AI Technology | Built for Users | Designed for Scale*