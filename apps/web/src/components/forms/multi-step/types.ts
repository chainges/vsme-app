import { z } from 'zod'
// Import SustainabilityInitiative type
import type { SustainabilityInitiative } from '@/components/forms/multi-step/steps/step-3-sustainability-initiatives/sustainability-types'
// Import company info schema from new location
import { companyInfoSchema } from './steps/step-1-company-info/schema'
// Import business model schema from new location
import { businessModelSchema } from './steps/step-2-business-model/schema'
// Import sustainability schema from new location
import { sustainabilitySchema } from './steps/step-4-sustainability-practices/schema'

// Combined form data type
export const formSchema = z.object({
  // Company info step
  ...companyInfoSchema.shape,

  // Business model step
  ...businessModelSchema.shape,

  // Sustainability initiatives step
  initiatives: z.array(z.any()).default([]),

  // Sustainability practices step
  ...sustainabilitySchema.shape,
})

export type FormData = z.infer<typeof formSchema>

// Re-export company info types from new location
export type { CompanyInfoData } from './steps/step-1-company-info/schema'
// Re-export business model types from new location
export type { BusinessModelData, SubsidiaryData } from './steps/step-2-business-model/schema'
// Re-export individual types
export type { SustainabilityData } from './steps/step-4-sustainability-practices/schema'

// Extend FormData to include initiatives
export interface ExtendedFormData extends FormData {
  initiatives: SustainabilityInitiative[]
}

// Field type definitions
export interface BaseField {
  name: string
  label: string
  type: string
  placeholder?: string
  description?: string
}

export interface SelectField extends BaseField {
  type: 'select'
  options: ReadonlyArray<{ readonly label: string; readonly value: string }>
}

export interface TextAreaField extends BaseField {
  type: 'textarea'
}

export interface CheckboxField extends BaseField {
  type: 'checkbox'
  description: string
}

export interface InputField extends BaseField {
  type: 'text' | 'email' | 'url' | 'number' | 'password'
}

export type FormFieldType = SelectField | TextAreaField | CheckboxField | InputField

// Step configuration type
export interface StepConfig {
  id: string
  title: string
  description: string
  schema: z.ZodSchema<any>
  fields: readonly FormFieldType[]
}

// Animation variants type
export interface AnimationVariants {
  hidden: { opacity: number; x: number }
  visible: { opacity: number; x: number }
  exit: { opacity: number; x: number }
}

// Multi-step form props
export interface MultiStepFormProps {
  className?: string
  onSubmit?: (data: FormData) => void
}

// Form submission state
export interface FormSubmissionState {
  isSubmitting: boolean
  isComplete: boolean
  error?: string
}

// Form navigation props
export interface FormNavigationProps {
  isFirstStep: boolean
  isLastStep: boolean
  isSubmitting: boolean
  onPrevious: () => void
  onNext?: () => void
  className?: string
  previousLabel?: string
  nextLabel?: string
  submitLabel?: string
  submittingLabel?: string
}
