# ADE Insurance Document Analysis

A professional document analysis web application built with React, TypeScript, and Vite for ADE Insurance. This demo application showcases AI-powered document processing capabilities with a modern, responsive UI.

## ✨ Features

- **🔄 No Authentication Required** - Direct access to upload and analysis
- **📄 Multi-format Support** - PDF, PNG, JPG document uploads
- **🔍 Visual Analysis** - Interactive overlay showing detected regions
- **📝 Structured Output** - Markdown and JSON data extraction
- **🎨 Professional UI** - Modern SaaS-style interface with dark/light themes
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **⚡ Real-time Processing** - Mock AI processing with progress indicators
- **🖱️ Interactive Elements** - Hover effects and region highlighting

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5.x with Rolldown
- **Styling**: TailwindCSS + shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: Zustand
- **API Layer**: TanStack Query (React Query)
- **Canvas Graphics**: Konva.js for document overlays
- **API Integration**: Backend API client with real endpoints
- **File Handling**: React Dropzone
- **Markdown Rendering**: React Markdown

## 🎯 User Flow

1. **Upload**: Drop or select PDF/image files on the home page
2. **Process**: Click "Analyze Document" to start mock AI processing
3. **Review**: Automatic navigation to visual analysis view
4. **Explore**: Switch between Visual, Markdown, and JSON tabs
5. **Interact**: Click regions for detailed information
6. **Export**: Download structured data in preferred format

## 📁 Project Structure

```
src/
├── api/                    # API client and types
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── OverlayCanvas.tsx # Document region visualization
│   ├── MarkdownRenderer.tsx # Structured content display
│   └── JsonEditor.tsx    # Interactive data editor
├── pages/                # Application pages
├── mock/                 # Mock API handlers and data
├── store/                # Zustand state management
├── routes/               # React Router configuration
└── lib/                  # Utility functions and helpers
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
# Upload dist folder to Vercel or connect GitHub repo
```

### Netlify

```bash
npm run build
# Upload dist folder to Netlify or connect GitHub repo
```

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 Demo Features

- Complete mock document processing pipeline
- Interactive document region detection
- Professional insurance document templates
- Real-time progress indicators
- Responsive design with dark/light themes
- Fully functional without backend dependencies
