import React, { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Text } from 'react-konva'
import type { DocumentRegion } from '../api/types'
import { useDocumentStore } from '../store/document'

interface OverlayCanvasProps {
  documentImageUrl: string
  regions: DocumentRegion[]
  page?: number
  onRegionClick?: (region: DocumentRegion) => void
}

const regionColors = {
  text: '#3B82F6', // Blue
  table: '#10B981', // Green  
  signature: '#F59E0B', // Amber
  handwriting: '#EF4444', // Red
  logo: '#8B5CF6', // Purple
  highlight: '#EC4899', // Pink
}

export const OverlayCanvas: React.FC<OverlayCanvasProps> = ({
  documentImageUrl,
  regions,
  page = 0,
  onRegionClick,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 1000 })
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const { selectedRegion, setSelectedRegion } = useDocumentStore()
  
  // Filter regions by current page
  const pageRegions = regions.filter(region => region.page === page)
  
  useEffect(() => {
    // Load document image and get dimensions
    const img = new Image()
    img.onload = () => {
      setDimensions({
        width: Math.min(img.width, 800),
        height: Math.min(img.height * (800 / img.width), 1000)
      })
      setImageLoaded(true)
    }
    img.src = documentImageUrl
  }, [documentImageUrl])
  
  useEffect(() => {
    // Resize canvas when container size changes
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setDimensions(prev => ({
          width: Math.min(rect.width, 800),
          height: prev.height * (rect.width / prev.width)
        }))
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const handleRegionClick = (region: DocumentRegion) => {
    setSelectedRegion(region.id)
    onRegionClick?.(region)
  }
  
  return (
    <div 
      ref={canvasRef}
      className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
      style={{ minHeight: '600px' }}
    >
      {/* Document background image */}
      <img
        src={documentImageUrl}
        alt="Document"
        className="block w-full h-auto object-contain"
        style={{ 
          display: imageLoaded ? 'block' : 'none',
          maxWidth: '100%',
          height: 'auto'
        }}
        onLoad={() => {
          setImageLoaded(true)
          console.log('Image loaded successfully')
        }}
        onError={() => {
          console.error('Failed to load document image')
        }}
      />
      
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="flex items-center justify-center w-full h-96">
          <div className="text-gray-500 dark:text-gray-400">Loading document...</div>
        </div>
      )}
      
      {/* Debug info */}
      {import.meta.env.DEV && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-10">
          <div>Image loaded: {imageLoaded ? 'Yes' : 'No'}</div>
          <div>Regions: {pageRegions.length}</div>
          <div>Page: {page}</div>
          <div>Dimensions: {dimensions.width}x{dimensions.height}</div>
        </div>
      )}
      
      {/* Konva overlay for regions */}
      {imageLoaded && pageRegions.length > 0 && (
        <div className="absolute inset-0 pointer-events-auto">
          <Stage 
            width={dimensions.width} 
            height={dimensions.height} 
            scaleX={1}
            scaleY={1}
          >
            <Layer>
              {pageRegions.map((region) => {
                const [x, y, width, height] = region.bbox
                const color = regionColors[region.type] || '#3B82F6'
                const isSelected = selectedRegion === region.id
                
                return (
                  <React.Fragment key={region.id}>
                    {/* Region rectangle */}
                    <Rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                      fill="transparent"
                      opacity={1}
                      cornerRadius={2}
                      onClick={() => handleRegionClick(region)}
                      onTap={() => handleRegionClick(region)}
                      onMouseEnter={(e) => {
                        const stage = e.target.getStage()
                        if (stage) {
                          stage.container().style.cursor = 'pointer'
                        }
                      }}
                      onMouseLeave={(e) => {
                        const stage = e.target.getStage()
                        if (stage) {
                          stage.container().style.cursor = 'default'
                        }
                      }}
                    />
                    
                    {/* Region background with opacity */}
                    <Rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={color}
                      opacity={isSelected ? 0.3 : 0.15}
                      cornerRadius={2}
                      onClick={() => handleRegionClick(region)}
                      onTap={() => handleRegionClick(region)}
                    />
                    
                    {/* Region label */}
                    <Text
                      x={x + 4}
                      y={Math.max(y - 18, 2)}
                      text={`${region.type.toUpperCase()}`}
                      fontSize={10}
                      fill={color}
                      fontStyle="bold"
                      onClick={() => handleRegionClick(region)}
                      onTap={() => handleRegionClick(region)}
                    />
                  </React.Fragment>
                )
              })}
            </Layer>
          </Stage>
        </div>
      )}
      
      {/* No regions message */}
      {imageLoaded && pageRegions.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded">
            No regions detected on this page
          </div>
        </div>
      )}
      
      {/* Region legend */}
      <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg border">
        <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Region Types
        </h3>
        <div className="space-y-1">
          {Object.entries(regionColors).map(([type, color]) => (
            <div key={type} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded border"
                style={{ backgroundColor: color, opacity: 0.7 }}
              />
              <span className="capitalize text-gray-700 dark:text-gray-300">
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}