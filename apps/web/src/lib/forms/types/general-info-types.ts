/**
 * Story 4.1.12: GeneralInfo Multi-Step Data Types
 * Type definitions for the complete General Information multi-step form
 * Extends Step 1 to include Step 2: Strategy & Governance
 */

import type { GeneralInfoStep1Data } from './general-info-step1-types'

/**
 * Step 2: Strategy & Governance data interface
 */
export interface GeneralInfoStep2Data {
  /** Sustainability strategy description (required, min 10 chars) */
  sustainabilityStrategy: string
  
  /** Business model description (required, min 50 chars) */
  businessModel: string
  
  /** Report type: individual or consolidated (required) */
  reportType: 'individual' | 'consolidated'
  
  /** Subsidiaries data (only required if reportType is 'consolidated') */
  subsidiaries: SubsidiaryData[]
}

/**
 * Subsidiary data structure for consolidated reports
 */
export interface SubsidiaryData {
  /** Subsidiary company name (required) */
  name: string
  
  /** Subsidiary organization number (required) */
  organizationNumber: string
  
  /** Subsidiary address (required) */
  address: string
}

/**
 * Complete multi-step General Information data
 * Combines Step 1 (Company Information) and Step 2 (Strategy & Governance)
 */
export interface GeneralInfoData {
  /** Step 1: Company Information */
  step1: GeneralInfoStep1Data
  
  /** Step 2: Strategy & Governance */
  step2: GeneralInfoStep2Data
}

/**
 * Report type options for radio group selection
 */
export const REPORT_TYPE_OPTIONS = [
  { 
    label: 'Individual', 
    value: 'individual' as const,
    description: 'Report for this company only'
  },
  { 
    label: 'Consolidated', 
    value: 'consolidated' as const,
    description: 'Report including subsidiaries'
  },
] as const

/** Type for report type values */
export type ReportTypeValue = typeof REPORT_TYPE_OPTIONS[number]['value']

/**
 * Default values for Step 2
 */
export const generalInfoStep2DefaultValues: GeneralInfoStep2Data = {
  sustainabilityStrategy: '',
  businessModel: '',
  reportType: 'individual', // Default to individual
  subsidiaries: [],
}

/**
 * Default values for complete multi-step form
 */
export const generalInfoDefaultValues: GeneralInfoData = {
  step1: {
    companyName: '',
    organizationNumber: '',
    country: '',
    naceCode: '',
    industry: '',
    revenue: 0,
    balanceSheetValue: 0,
    numberOfEmployees: 1,
    contactPersonName: '',
    contactPersonEmail: '',
  },
  step2: generalInfoStep2DefaultValues,
}

/**
 * Form state structure for multi-step persistence
 */
export interface GeneralInfoFormState {
  /** Current form data */
  data: Partial<GeneralInfoData>
  
  /** Current step index (0-based) */
  currentStep: number
  
  /** Timestamp of last save */
  timestamp: number
  
  /** Form version for migration purposes */
  version?: string
}

/**
 * Multi-step form configuration type helper
 */
export interface MultiStepConfig {
  /** Total number of steps */
  totalSteps: number
  
  /** Current step (1-based for UI) */
  currentStep: number
  
  /** Step completion status */
  stepStatus: ('current' | 'complete' | 'incomplete')[]
  
  /** Whether navigation is allowed */
  canNavigateNext: boolean
  canNavigatePrevious: boolean
}
