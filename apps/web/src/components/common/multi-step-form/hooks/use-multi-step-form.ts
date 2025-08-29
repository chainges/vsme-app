import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFormData } from '@/hooks/use-form-data'
import { stepConfigurations } from '../schemas'
import type { FormData, FormSubmissionState } from '../types'

export interface UseMultiStepFormProps {
  onSubmit?: (data: FormData) => void
}

export interface UseMultiStepFormReturn {
  // Form state
  formData: Partial<FormData>
  setFormData: (data: Partial<FormData>) => void

  // Submission state
  submissionState: FormSubmissionState

  // Current step form instance
  form: ReturnType<typeof useForm>

  // Step navigation
  step: number
  setStep: (step: number) => void
  isFirstStep: boolean
  isLastStep: boolean
  progress: number

  // Step handlers
  handleNextStep: (data: any) => void
  handlePrevStep: () => void
  handleRestart: () => void

  // Current step configuration
  currentStepConfig: (typeof stepConfigurations)[number]
}

export function useMultiStepForm({ onSubmit }: UseMultiStepFormProps = {}): UseMultiStepFormReturn {
  // State management
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [submissionState, setSubmissionState] = useState<FormSubmissionState>({
    isSubmitting: false,
    isComplete: false,
  })

  // Use the form data hook for enriched defaults
  const { getEnrichedDefaults } = useFormData()

  // Get current step configuration
  const currentStepConfig = stepConfigurations[step]

  // Helper function to extract default values
  const getSchemaDefaults = (existingData: any = {}) => {
    const defaults = getEnrichedDefaults(step, existingData)
    console.log(`Applied defaults for step ${step}:`, defaults)
    return defaults
  }

  // Merge schema defaults with form data
  const defaultValues = getSchemaDefaults(formData)

  // Setup form with the current step schema
  const form = useForm<any>({
    resolver: zodResolver(currentStepConfig.schema as any),
    defaultValues,
  })

  // Reset form with default values when step changes
  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  // Calculated properties
  const isFirstStep = step === 0
  const isLastStep = step === stepConfigurations.length - 1
  const progress = ((step + 1) / stepConfigurations.length) * 100

  // Handle next step
  const handleNextStep = (data: any) => {
    console.log('Form submission data:', data)
    console.log('Current step:', step)
    console.log('Form errors:', form.formState.errors)

    const updatedData = { ...formData, ...data }
    console.log('Updated form data:', updatedData)
    setFormData(updatedData)

    if (isLastStep) {
      // Final step submission
      setSubmissionState({ isSubmitting: true, isComplete: false })

      setTimeout(() => {
        if (onSubmit) {
          onSubmit(updatedData as FormData)
        }
        setSubmissionState({ isSubmitting: false, isComplete: true })
      }, 1500)
    } else {
      setStep(step + 1)
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (!isFirstStep) {
      setStep(step - 1)
    }
  }

  // Handle restart
  const handleRestart = () => {
    setStep(0)
    setFormData({})
    setSubmissionState({ isSubmitting: false, isComplete: false })
    form.reset({})
  }

  return {
    // Form state
    formData,
    setFormData,

    // Submission state
    submissionState,

    // Current step form instance
    form,

    // Step navigation
    step,
    setStep,
    isFirstStep,
    isLastStep,
    progress,

    // Step handlers
    handleNextStep,
    handlePrevStep,
    handleRestart,

    // Current step configuration
    currentStepConfig,
  }
}
