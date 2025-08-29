import { z } from 'zod'
import { sustainabilityInitiativesSchema } from '@/lib/forms/validation/sustainability-schemas'
import { businessModelSchema } from './schemas/business-model'
import { companyInfoSchema } from './schemas/company-info'
import { sustainabilitySchema } from './schemas/sustainability'

// Combined form schema for the complete form data
export const formSchema = z.object({
  ...companyInfoSchema.shape,
  ...businessModelSchema.shape,
  ...sustainabilitySchema.shape,
  initiatives: sustainabilityInitiativesSchema.optional().default([]),
})

export type FormData = z.infer<typeof formSchema>

// Extend FormData to include initiatives
export interface ExtendedFormData extends FormData {
  initiatives: Array<{
    type: string
    responsiblePerson: string
    goal: string
    description: string
    isSelected: boolean
  }>
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