import { create } from 'zustand'
import type { DocumentInfo, DocumentRegion, DocumentJsonData } from '../api/types'

interface DocumentState {
  // Current document data
  currentDocument: DocumentInfo | null
  currentDocumentId: string | null
  regions: DocumentRegion[]
  jsonData: DocumentJsonData | null
  markdown: string | null
  
  // UI state
  isProcessing: boolean
  processingProgress: number
  selectedRegion: string | null
  currentPage: number
  currentTab: 'visual' | 'markdown' | 'json'
  theme: 'light' | 'dark'
  
  // Actions
  setCurrentDocument: (doc: DocumentInfo) => void
  setCurrentDocumentId: (id: string) => void
  setRegions: (regions: DocumentRegion[]) => void
  setJsonData: (data: DocumentJsonData) => void
  setMarkdown: (markdown: string) => void
  setProcessing: (processing: boolean, progress?: number) => void
  setSelectedRegion: (regionId: string | null) => void
  setCurrentPage: (page: number) => void
  setCurrentTab: (tab: 'visual' | 'markdown' | 'json') => void
  toggleTheme: () => void
  
  // Reset state
  resetDocument: () => void
}

export const useDocumentStore = create<DocumentState>((set) => ({
  // Initial state
  currentDocument: null,
  currentDocumentId: null,
  regions: [],
  jsonData: null,
  markdown: null,
  isProcessing: false,
  processingProgress: 0,
  selectedRegion: null,
  currentPage: 0,
  currentTab: 'markdown',
  theme: 'light',
  
  // Actions
  setCurrentDocument: (doc) => set({ currentDocument: doc }),
  setCurrentDocumentId: (id) => set({ currentDocumentId: id }),
  setRegions: (regions) => set({ regions }),
  setJsonData: (data) => set({ jsonData: data }),
  setMarkdown: (markdown) => set({ markdown }),
  setProcessing: (processing, progress = 0) => 
    set({ isProcessing: processing, processingProgress: progress }),
  setSelectedRegion: (regionId) => set({ selectedRegion: regionId }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  resetDocument: () => set({
    currentDocument: null,
    currentDocumentId: null,
    regions: [],
    jsonData: null,
    markdown: null,
    isProcessing: false,
    processingProgress: 0,
    selectedRegion: null,
    currentPage: 0,
    currentTab: 'markdown',
  }),
}))