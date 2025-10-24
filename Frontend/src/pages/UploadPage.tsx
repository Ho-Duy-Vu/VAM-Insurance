import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import { Upload, FileText, Image, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { documentApi } from '../api/client'
import { useDocumentStore } from '../store/document'

export const UploadPage: React.FC = () => {
  const navigate = useNavigate()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  const { setProcessing, setCurrentDocumentId } = useDocumentStore()
  
  const uploadMutation = useMutation({
    mutationFn: documentApi.uploadDocument,
    onSuccess: (data) => {
      setCurrentDocumentId(data.document_id)
      // Start processing simulation
      setProcessing(true, 0)
      simulateProcessing(data.document_id)
    },
    onError: (error) => {
      console.error('Upload failed:', error)
      setProcessing(false)
    }
  })
  
  const simulateProcessing = async (documentId: string) => {
    try {
      // Start processing on backend
      const processResponse = await documentApi.startProcessing(documentId)
      const jobId = processResponse.job_id
      
      // Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const status = await documentApi.getJobStatus(jobId)
          setProcessing(true, status.progress)
          
          if (status.status === 'DONE') {
            clearInterval(pollInterval)
            setTimeout(() => {
              setProcessing(false)
              navigate(`/document/${documentId}`)
            }, 1000)
          } else if (status.status === 'ERROR') {
            clearInterval(pollInterval)
            setProcessing(false)
            console.error('Processing failed')
          }
        } catch (error) {
          console.error('Failed to check job status:', error)
        }
      }, 500) // Poll every 500ms
      
      // Cleanup after 30 seconds max
      setTimeout(() => {
        clearInterval(pollInterval)
        setProcessing(false)
        navigate(`/document/${documentId}`)
      }, 30000)
      
    } catch (error) {
      console.error('Processing failed:', error)
      setProcessing(false)
    }
  }
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (file) {
        setUploadedFile(file)
        
        // Create preview URL
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        
        return () => URL.revokeObjectURL(url)
      }
    }
  })
  
  const handleAnalyze = () => {
    if (uploadedFile) {
      uploadMutation.mutate(uploadedFile)
    }
  }

  const isProcessing = useDocumentStore(state => state.isProcessing)
  const processingProgress = useDocumentStore(state => state.processingProgress)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              ADE Insurance
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Document Analysis System
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your insurance documents for AI-powered analysis. Our system can extract text, 
            identify tables, signatures, and provide structured data insights.
          </p>
        </div>
        
        {!isProcessing ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload size={20} />
                  <span>Upload Document</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                        <FileText size={24} />
                        <span className="font-medium">File Selected</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Upload className="w-12 h-12 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {isDragActive ? 'Drop file here' : 'Choose file or drag here'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          PDF, PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {uploadedFile && (
                  <div className="mt-4">
                    <Button 
                      onClick={handleAnalyze}
                      className="w-full"
                      size="lg"
                      disabled={uploadMutation.isPending}
                    >
                      {uploadMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Starting Analysis...
                        </>
                      ) : (
                        'Analyze Document'
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Preview Area */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Image size={20} />
                  <span>Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previewUrl ? (
                  <div className="border rounded-lg overflow-hidden">
                    {uploadedFile?.type.includes('image') ? (
                      <img
                        src={previewUrl}
                        alt="Document preview"
                        className="w-full h-64 object-contain bg-gray-50 dark:bg-gray-800"
                      />
                    ) : (
                      <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <div className="text-center">
                          <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600 dark:text-gray-400">PDF Preview</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {uploadedFile?.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Image size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Document preview will appear here
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Processing State */
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span>Processing Document</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our AI is analyzing your document. This may take a few moments...
                </p>
                <Progress value={processingProgress} className="w-full h-3" />
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {processingProgress}% Complete
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Text Recognition
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Extracting text content
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Structure Analysis
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Identifying layout elements
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Features */}
        {!isProcessing && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Text Extraction
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Accurate OCR technology extracts all text content from your documents
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Image className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Visual Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Identifies tables, signatures, logos and document structure
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Data Export
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Export structured data in JSON, Markdown, or other formats
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}