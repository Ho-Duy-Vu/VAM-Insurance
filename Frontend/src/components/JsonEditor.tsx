import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Save, Edit3, EyeOff, ChevronDown, ChevronRight } from 'lucide-react'
import type { DocumentJsonData } from '../api/types'

interface JsonEditorProps {
  data: DocumentJsonData
  onSave: (data: DocumentJsonData) => void
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ 
  data, 
  onSave
}) => {
  const [editableData, setEditableData] = useState<DocumentJsonData>(data)
  const [isEditing, setIsEditing] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['policy', 'animals']))
  
  useEffect(() => {
    setEditableData(data)
  }, [data])
  
  const handleSave = () => {
    onSave(editableData)
    setIsEditing(false)
  }
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }
  
  const renderValue = (value: unknown): React.ReactNode => {
    if (typeof value === 'boolean') {
      return (
        <span className={`px-2 py-1 rounded text-xs ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <span className="text-gray-900 dark:text-gray-100">
          {value || 'N/A'}
        </span>
      )
    }
    
    return <span className="text-gray-500">Object</span>
  }
  
  const PolicySection = () => (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => toggleSection('policy')}
      >
        <CardTitle className="flex items-center space-x-2">
          {expandedSections.has('policy') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Policy Information</span>
        </CardTitle>
      </CardHeader>
      {expandedSections.has('policy') && (
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Carrier:</label>
              {renderValue(editableData.policy?.carrier)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Issue Date:</label>
              {renderValue(editableData.policy?.issue_date)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Certificate Number:</label>
              {renderValue(editableData.policy?.certificate_number)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Purpose:</label>
              {renderValue(editableData.policy?.purpose)}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )

  const AnimalsSection = () => (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => toggleSection('animals')}
      >
        <CardTitle className="flex items-center space-x-2">
          {expandedSections.has('animals') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Animals ({editableData.animals?.length || 0})</span>
        </CardTitle>
      </CardHeader>
      {expandedSections.has('animals') && (
        <CardContent>
          {editableData.animals?.map((animal, index) => (
            <div key={index} className="mb-4 p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Animal #{index + 1}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Species:</span>
                  <p>{animal.species || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p>{animal.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Microchip:</span>
                  <p>{animal.microchip_id || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Rabies Status:</span>
                  <p>{animal.rabies_vaccination || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Health Status:</span>
                  <p>{animal.health_status || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Special Markings:</span>
                  <p>{animal.special_markings || 'N/A'}</p>
                </div>
              </div>
            </div>
          )) || <p className="text-gray-500">No animals listed</p>}
        </CardContent>
      )}
    </Card>
  )

  const VeterinarySection = () => (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => toggleSection('veterinary')}
      >
        <CardTitle className="flex items-center space-x-2">
          {expandedSections.has('veterinary') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Veterinary Certification</span>
        </CardTitle>
      </CardHeader>
      {expandedSections.has('veterinary') && (
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Veterinarian:</label>
              {renderValue(editableData.veterinary_certification?.veterinarian_name)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Clinic:</label>
              {renderValue(editableData.veterinary_certification?.clinic_name)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Address:</label>
              {renderValue(editableData.veterinary_certification?.address)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date:</label>
              {renderValue(editableData.veterinary_certification?.certification_date)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">License:</label>
              {renderValue(editableData.veterinary_certification?.license_number)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Signature Verified:</label>
              {renderValue(editableData.veterinary_certification?.signature_verified)}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )

  const AttestationSection = () => (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => toggleSection('attestation')}
      >
        <CardTitle className="flex items-center space-x-2">
          {expandedSections.has('attestation') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Attestation</span>
        </CardTitle>
      </CardHeader>
      {expandedSections.has('attestation') && (
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Health Examination:</label>
              {renderValue(editableData.attestation?.health_examination_completed)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Vaccination Records:</label>
              {renderValue(editableData.attestation?.vaccination_records_verified)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Transport Authorization:</label>
              {renderValue(editableData.attestation?.transport_authorization)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Veterinarian Signature:</label>
              {renderValue(editableData.attestation?.veterinarian_signature)}
            </div>
          </div>
          {editableData.attestation?.special_notes && (
            <div>
              <label className="text-sm font-medium text-gray-500">Special Notes:</label>
              <p className="text-gray-900 dark:text-gray-100 text-sm mt-1">
                {editableData.attestation.special_notes}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Extracted Data</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <EyeOff className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? 'View' : 'Edit'}
          </Button>
          {isEditing && (
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <PolicySection />
        <AnimalsSection />
        <VeterinarySection />
        <AttestationSection />
      </div>

      {/* Raw JSON Toggle */}
      <Card>
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('raw')}
        >
          <CardTitle className="flex items-center space-x-2">
            {expandedSections.has('raw') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>Raw JSON Data</span>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('raw') && (
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(editableData, null, 2)}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  )
}