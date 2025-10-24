import type { DocumentInfo, DocumentRegion, ProcessingStatus, DocumentJsonData } from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const documentApi = {
  // Upload document
  uploadDocument: async (file: File): Promise<{ document_id: string; status: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Upload failed')
    }
    
    const data = await response.json()
    return { document_id: data.document_id, status: 'uploaded' }
  },

  // Start document processing
  startProcessing: async (documentId: string): Promise<{ job_id: string; status: string }> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Processing failed')
    }
    
    return response.json()
  },

  // Get job processing status
  getJobStatus: async (jobId: string): Promise<ProcessingStatus> => {
    const response = await fetch(`${API_BASE}/jobs/${jobId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get job status')
    }
    
    return response.json()
  },

  // Get processing status (legacy method for compatibility)
  getProcessingStatus: async (documentId: string): Promise<ProcessingStatus> => {
    // For compatibility, return a mock status
    const response = await fetch(`${API_BASE}/documents/${documentId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get processing status')
    }
    
    const data = await response.json()
    return {
      status: data.status === 'DONE' ? 'DONE' : data.status === 'PROCESSING' ? 'PROCESSING' : 'PROCESSING',
      progress: data.status === 'DONE' ? 100 : data.status === 'PROCESSING' ? 50 : 0
    }
  },

  // Get document info
  getDocumentInfo: async (documentId: string): Promise<DocumentInfo> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get document info')
    }
    
    const data = await response.json()
    return {
      document_id: data.document_id,
      status: data.status,
      pages: data.pages
    }
  },

  // Get document regions
  getDocumentRegions: async (documentId: string): Promise<DocumentRegion[]> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/overlay`)
    
    if (!response.ok) {
      throw new Error('Failed to get document regions')
    }
    
    const data = await response.json()
    return data.regions || []
  },

  // Get document markdown
  getDocumentMarkdown: async (documentId: string): Promise<string> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/markdown`)
    
    if (!response.ok) {
      throw new Error('Failed to get document markdown')
    }
    
    return response.text()
  },

  // Get document JSON data
  getDocumentJson: async (documentId: string): Promise<DocumentJsonData> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/json`)
    
    if (!response.ok) {
      throw new Error('Failed to get document JSON')
    }
    
    return response.json()
  },

  // Update document JSON data
  updateDocumentJson: async (documentId: string, data: DocumentJsonData): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update document JSON')
    }
    
    return response.json()
  },
}