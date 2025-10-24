import React from 'react'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { useDocumentStore } from '../store/document'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileText, Loader2 } from 'lucide-react'

export const MarkdownView: React.FC = () => {
  const { markdown } = useDocumentStore()
  
  if (!markdown) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">Loading markdown content...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText size={20} />
            <span>Structured Document Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-none">
            <MarkdownRenderer content={markdown} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}