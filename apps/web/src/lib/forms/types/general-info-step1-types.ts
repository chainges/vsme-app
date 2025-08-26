/**
 * Story 4.1.11: GeneralInfo Step 1 Data Types
 * Type definitions for the Company Information form step
 */

/**
 * GeneralInfoStep1Data interface
 * Represents all the fields required in Step 1: Company Information
 */
export interface GeneralInfoStep1Data {
  /** Company name (required, min 2 chars, max 100) */
  companyName: string
  
  /** Organization number in format XX-XXXXXXXX (required) */
  organizationNumber: string
  
  /** Country selection (required) */
  country: string
  
  /** NACE code in format XX.XX (required) */
  naceCode: string
  
  /** Industry selection (required) */
  industry: string
  
  /** Revenue in currency units (required, positive number) */
  revenue: number
  
  /** Balance sheet value in currency units (required, positive number) */
  balanceSheetValue: number
  
  /** Number of employees (required, integer, min 1) */
  numberOfEmployees: number
  
  /** Contact person's full name (required, min 2 chars, max 100) */
  contactPersonName: string
  
  /** Contact person's email address (required, valid email format) */
  contactPersonEmail: string
}

/**
 * Country options for select field
 */
export const COUNTRY_OPTIONS = [
  { label: 'Norway', value: 'norway' },
  { label: 'Sweden', value: 'sweden' },
  { label: 'Denmark', value: 'denmark' },
  { label: 'Finland', value: 'finland' },
  { label: 'Iceland', value: 'iceland' },
  { label: 'Germany', value: 'germany' },
  { label: 'United Kingdom', value: 'united-kingdom' },
  { label: 'Netherlands', value: 'netherlands' },
  { label: 'France', value: 'france' },
  { label: 'Other', value: 'other' },
] as const

/**
 * Industry options for select field
 */
export const INDUSTRY_OPTIONS = [
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Services', value: 'services' },
  { label: 'Retail', value: 'retail' },
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Construction', value: 'construction' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Energy', value: 'energy' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Other', value: 'other' },
] as const

/** Type for country values */
export type CountryValue = typeof COUNTRY_OPTIONS[number]['value']

/** Type for industry values */
export type IndustryValue = typeof INDUSTRY_OPTIONS[number]['value']
