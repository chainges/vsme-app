import type {
  FormNavigation,
  FormState,
  MultiStepFormConfig,
  ProgressData,
} from '../../../lib/forms/types'

/**
 * Props for the main MultiStepForm component
 */
export interface MultiStepFormProps<T = any> {
  config: MultiStepFormConfig<T>
  className?: string
  onStepChange?: (step: number) => void
  onDataChange?: (data: Partial<T>) => void
}

/**
 * Props for the StepRenderer component
 */
export interface StepRendererProps<T = any> {
  step: MultiStepFormConfig<T>['steps'][0]
  formData: Partial<T>
  onDataChange: (data: Partial<T>) => void
  disabled?: boolean
  className?: string
}

/**
 * Props for the ProgressIndicator component
 */
export interface ProgressIndicatorProps {
  progress: ProgressData
  showPercentage?: boolean
  showStepNumbers?: boolean
  className?: string
}

/**
 * Props for the NavigationControls component
 */
export interface NavigationControlsProps {
  navigation: FormNavigation
  isSubmitting?: boolean
  submitLabel?: string
  nextLabel?: string
  previousLabel?: string
  className?: string
}
