import { z } from 'zod'
import { companyInfoSchema } from './schemas/company-info'
import { reportingSetupSchema } from './schemas/reporting-setup'
import { sustainabilitySchema } from './schemas/sustainability'

// Combined form schema for the complete form data
export const formSchema = z.object({
  ...companyInfoSchema.shape,
  ...reportingSetupSchema.shape,
  ...sustainabilitySchema.shape,
})

export type FormData = z.infer<typeof formSchema>

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

// Step navigation hook return type
export interface UseStepNavigationReturn {
  step: number
  setStep: (step: number) => void
  handleNextStep: () => void
  handlePrevStep: () => void
  isFirstStep: boolean
  isLastStep: boolean
  progress: number
}

// Form submission state
export interface FormSubmissionState {
  isSubmitting: boolean
  isComplete: boolean
  error?: string
}