import { OverlayCanvas } from '../components/OverlayCanvas'
import { useDocumentStore } from '../store/document'
import type { DocumentRegion } from '../api/types'

export default function VisualView() {
  const { regions, currentDocument, currentPage, selectedRegion, setSelectedRegion } = useDocumentStore()
  
  const handleRegionClick = (region: DocumentRegion) => {
    setSelectedRegion(region.id === selectedRegion ? null : region.id)
  }
  
  // Get current page image URL from document data
  const currentPageImage = currentDocument?.pages?.[currentPage]?.image_url || ''
  const imageUrl = currentPageImage.startsWith('http') ? currentPageImage : `http://localhost:8000${currentPageImage}`
  
  // Check if current page has a valid image
  const hasValidImage = currentPageImage && currentPageImage.length > 0
  
  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Document Preview */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Document Preview</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Interactive overlay showing detected regions
          </p>
        </div>
        
        <div className="p-4 h-full">
          {/* Debug info in development */}
          {import.meta.env.DEV && (
            <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border text-xs">
              <strong>Debug:</strong> Regions: {regions.length}, Page: {currentPage}, 
              Page regions: {regions.filter(r => r.page === currentPage).length}
            </div>
          )}
          
          <div className="h-96">
            {hasValidImage ? (
              <OverlayCanvas
                documentImageUrl={imageUrl}
                regions={regions}
                page={currentPage}
                onRegionClick={handleRegionClick}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">Document image loading...</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Ensure backend is running on http://localhost:8000
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Region Statistics */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Analysis Summary</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Regions:</span>
            <span className="font-medium">{regions.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Text Regions:</span>
            <span className="font-medium">{regions.filter(r => r.type === 'text').length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tables:</span>
            <span className="font-medium">{regions.filter(r => r.type === 'table').length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Signatures:</span>
            <span className="font-medium">{regions.filter(r => r.type === 'signature').length}</span>
          </div>
        </div>
      </div>
        
      {/* Selected region details */}
      {selectedRegion && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          {(() => {
            const region = regions.find(r => r.id === selectedRegion)
            if (!region) return null
            
            return (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Selected: {region.type.toUpperCase()}
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Text:</span>
                    <p className="text-gray-900 dark:text-gray-100 font-mono text-xs mt-1">
                      {region.text || 'N/A'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Confidence:</span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {region.confidence ? Math.round(region.confidence * 100) : 95}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Page:</span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {region.page + 1}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}