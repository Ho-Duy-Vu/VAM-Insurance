export interface DocumentRegion {
  id: string
  type: 'text' | 'table' | 'signature' | 'handwriting' | 'logo' | 'highlight'
  page: number
  bbox: [number, number, number, number] // [x, y, width, height]
  text: string
  confidence?: number
}

export interface DocumentPage {
  page_index: number
  image_url: string
}

export interface DocumentInfo {
  document_id: string
  status: string
  pages: DocumentPage[]
}

export interface ProcessingStatus {
  status: 'PROCESSING' | 'DONE' | 'ERROR'
  progress: number
}

export interface DocumentJsonData {
  document_type?: string
  policy?: {
    carrier?: string
    issue_date?: string
    certificate_number?: string
    validity_period?: string
    purpose?: string
  }
  animals?: Array<{
    species?: string
    name?: string
    microchip_id?: string | null
    rabies_vaccination?: string
    vaccination_year?: string
    health_status?: string
    special_markings?: string
  }>
  veterinary_certification?: {
    veterinarian_name?: string
    clinic_name?: string
    address?: string
    certification_date?: string
    license_number?: string
    signature_verified?: boolean
    official_seal?: boolean
  }
  attestation?: {
    health_examination_completed?: boolean
    disease_testing_current?: boolean
    vaccination_records_verified?: boolean
    transport_authorization?: boolean
    veterinarian_signature?: boolean
    regulatory_compliance?: string
    special_notes?: string
  }
  risk_assessment?: {
    disease_risk?: string
    quarantine_required?: boolean
    movement_restrictions?: string
    follow_up_required?: boolean
    contact_tracing?: string
  }
  compliance?: {
    state_regulations?: string
    federal_requirements?: string
    destination_approval?: string
    transport_protocol?: string
  }
  metadata?: {
    document_id?: string
    pages_total?: number
    confidence_score?: number
    processing_time?: string
    ai_model_version?: string
    extraction_timestamp?: string
  }
}