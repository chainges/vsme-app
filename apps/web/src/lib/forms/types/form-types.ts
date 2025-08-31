import type { z } from 'zod'
import type { ConditionalRule, FieldDefinition } from './field-types'

/**
 * Storage provider interface for form data persistence
 */
export interface StorageProvider {
  save(key: string, data: any): Promise<void>
  load(key: string): Promise<any | null>
  clear(key: string): Promise<void>
  exists(key: string): Promise<boolean>
}

/**
 * Form validation configuration
 */
export interface FormValidationConfig {
  mode: 'onChange' | 'onBlur' | 'onSubmit'
  reValidateMode: 'onChange' | 'onBlur'
}

/**
 * Individual form step configuration
 */
export interface FormStep<T = any> {
  id: string
  title: string
  description?: string
  schema: z.ZodSchema<any>
  fields: FieldDefinition[]
  conditionalLogic?: ConditionalRule[]
}

/**
 * Main multi-step form configuration
 */
export interface MultiStepFormConfig<T = any> {
  id: string
  title: string
  description?: string
  steps: FormStep<T>[]
  onSubmit: (data: T) => Promise<void> | void
  onSave?: (data: Partial<T>) => Promise<void> | void
  storage?: StorageProvider
  validation?: FormValidationConfig
}

/**
 * Form state management types
 */
export interface FormState<T = any> {
  currentStep: number
  data: Partial<T>
  isValid: boolean
  isSubmitting: boolean
  errors: Record<string, string[]>
  touched: Record<string, boolean>
}

/**
 * Form navigation actions
 */
export interface FormNavigation {
  canGoNext: boolean
  canGoPrevious: boolean
  goNext: () => void
  goPrevious: () => void
  goToStep: (step: number) => void
}

/**
 * Form context type for providing form state and actions
 */
export interface FormContextType<T = any> {
  config: MultiStepFormConfig<T>
  state: FormState<T>
  navigation: FormNavigation
  updateData: (data: Partial<T>) => void
  validateStep: (stepIndex: number) => Promise<boolean>
  submitForm: () => Promise<void>
  resetForm: () => void
}

/**
 * Progress indicator data
 */
export interface ProgressData {
  currentStep: number
  totalSteps: number
  completedSteps: number[]
  percentage: number
}
