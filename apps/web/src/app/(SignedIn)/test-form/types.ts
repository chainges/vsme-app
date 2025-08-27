/**
 * TypeScript definitions for Formity integration with TanStack Forms
 * 
 * This file defines the interfaces needed to integrate Formity's JSON schema
 * approach with our existing TanStack Forms implementation.
 */

import type { z } from 'zod'
import type { FormApi } from '@tanstack/react-form'

/**
 * Supported form backends for Formity integration
 */
export type FormBackend = 'tanstack' | 'react-hook-form'

/**
 * Field types supported by our Formity integration
 */
export type FieldType = 
  | 'text' 
  | 'email' 
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea' 
  | 'select' 
  | 'checkbox' 
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime-local'

/**
 * Option for select and radio fields
 */
export interface FieldOption {
  value: string | number
  label: string
  disabled?: boolean
}

/**
 * Field definition in JSON schema format
 */
export interface FieldDefinition {
  name: string
  type: FieldType
  label: string
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  
  // Validation rules
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string | RegExp
  
  // Field-specific props
  options?: FieldOption[] // For select/radio fields
  rows?: number // For textarea
  step?: number | 'any' // For number inputs
  multiple?: boolean // For select fields
  
  // Conditional rendering
  condition?: {
    field: string
    operator: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater-than' | 'less-than'
    value: any
  }
  
  // Custom props for shadcn/ui components
  className?: string
  variant?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Step configuration in multi-step form
 */
export interface StepDefinition {
  id: string
  title: string
  description?: string
  fields: FieldDefinition[]
  
  // Step validation
  required?: boolean
  
  // Custom step props
  className?: string
  
  // Conditional step rendering
  condition?: {
    field: string
    operator: 'equals' | 'not-equals' | 'contains' | 'not-contains'
    value: any
  }
}

/**
 * JSON Schema configuration for Formity
 */
export interface FormitySchema {
  steps: StepDefinition[]
  validation?: z.ZodSchema<any>
}

/**
 * Main Formity configuration
 */
export interface FormityConfig<T = Record<string, any>> {
  id: string
  backend: FormBackend
  schema: FormitySchema
  
  // Form behavior
  autoSave?: boolean
  storageKey?: string
  validateOnChange?: boolean
  validateOnBlur?: boolean
  
  // Event handlers
  onSubmit?: (data: T) => void | Promise<void>
  onStepChange?: (step: number, data: Partial<T>) => void
  onFieldChange?: (field: string, value: any, data: Partial<T>) => void
  onValidationError?: (errors: Record<string, string[]>) => void
  
  // Default values
  defaultValues?: Partial<T>
  
  // Custom components
  components?: {
    text?: React.ComponentType<any>
    email?: React.ComponentType<any>
    password?: React.ComponentType<any>
    number?: React.ComponentType<any>
    textarea?: React.ComponentType<any>
    select?: React.ComponentType<any>
    checkbox?: React.ComponentType<any>
    radio?: React.ComponentType<any>
    date?: React.ComponentType<any>
  }
  
  // Theme and styling
  theme?: {
    primaryColor?: string
    spacing?: 'compact' | 'normal' | 'relaxed'
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  }
}

/**
 * Form state for Formity integration
 */
export interface FormityState<T = Record<string, any>> {
  currentStep: number
  totalSteps: number
  data: Partial<T>
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
}

/**
 * Navigation controls for multi-step forms
 */
export interface FormityNavigation {
  canGoNext: boolean
  canGoPrevious: boolean
  canGoToStep: (step: number) => boolean
  goNext: () => void | Promise<void>
  goPrevious: () => void | Promise<void>
  goToStep: (step: number) => void | Promise<void>
  submit: () => void | Promise<void>
}

/**
 * Props for FormityTestForm component
 */
export interface FormityTestFormProps<T = Record<string, any>> {
  config: FormityConfig<T>
  className?: string
  onDataChange?: (data: Partial<T>) => void
  onStateChange?: (state: FormityState<T>) => void
}

/**
 * Props for FormityTanStackIntegration component
 */
export interface FormityTanStackIntegrationProps<T = Record<string, any>> {
  config: FormityConfig<T>
  formInstance?: FormApi<T, any>
  className?: string
}

/**
 * Field renderer props for individual form fields
 */
export interface FieldRendererProps {
  definition: FieldDefinition
  value: any
  onChange: (value: any) => void
  onBlur: () => void
  error?: string
  touched?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Step renderer props for form steps
 */
export interface StepRendererProps<T = Record<string, any>> {
  step: StepDefinition
  data: Partial<T>
  errors: Record<string, string[]>
  touched: Record<string, boolean>
  onChange: (field: string, value: any) => void
  onBlur: (field: string) => void
  disabled?: boolean
  className?: string
}

/**
 * Performance metrics for Formity evaluation
 */
export interface FormityPerformanceMetrics {
  initializationTime: number
  renderTime: number
  navigationTime: number
  validationTime: number
  bundleSize?: number
  memoryUsage?: number
}

/**
 * Evaluation results for the Formity SPIKE
 */
export interface FormityEvaluationResult {
  compatibility: {
    tanstackForms: boolean
    shadcnUI: boolean
    existingPatterns: boolean
  }
  
  performance: FormityPerformanceMetrics
  
  features: {
    multiStepNavigation: boolean
    stateParametersistence: boolean
    validation: boolean
    accessibility: boolean
    customComponents: boolean
  }
  
  migration: {
    effort: 'low' | 'medium' | 'high'
    breakingChanges: string[]
    requiredRefactoring: string[]
  }
  
  recommendation: {
    adopt: boolean
    reasons: string[]
    alternatives?: string[]
  }
}

/**
 * Test data type for the SPIKE form
 */
export interface SpikeFormData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  
  preferences: {
    newsletter: boolean
    notifications: 'none' | 'email' | 'sms' | 'both'
    theme: 'light' | 'dark' | 'auto'
  }
  
  feedback: {
    rating: number
    comments?: string
    wouldRecommend: boolean
  }
}