import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFormData } from '../../../../hooks/use-form-data'
import { useFormDataPersistence } from '../../../../hooks/use-form-data-persistence'
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
  const [isInitialized, setIsInitialized] = useState(false)

  // Track previous step to avoid unnecessary resets
  const prevStepRef = useRef(step)

  // Use the form data hook for enriched defaults
  const { getEnrichedDefaults } = useFormData()

  // Use the form data persistence hook
  const { saveStepData, loadFormData } = useFormDataPersistence()

  // Get current step configuration
  const currentStepConfig = stepConfigurations[step]

  // Load initial form data on mount
  useEffect(() => {
    console.log('Loading initial form data...')
    const initialData = loadFormData()
    console.log('Initial data loaded:', initialData)
    if (initialData) {
      setFormData(initialData)
      console.log('Form data set to:', initialData)
    } else {
      console.log('No initial data found')
    }
    setIsInitialized(true)
  }, [loadFormData])

  // Memoize helper function to extract default values
  const getSchemaDefaults = useCallback(
    (existingData: any = {}) => {
      const defaults = getEnrichedDefaults(step, existingData)
      console.log(`Applied defaults for step ${step}:`, defaults)
      return defaults
    },
    [step, getEnrichedDefaults]
  )

  // Memoize default values to prevent infinite re-renders
  const defaultValues = useMemo(() => {
    // Only calculate defaults after initialization to ensure localStorage data is loaded
    if (!isInitialized) {
      return {}
    }
    return getSchemaDefaults(formData)
  }, [getSchemaDefaults, formData, isInitialized])

  // Setup form with the current step schema
  // Special handling for sustainability initiatives step (step 2) which doesn't have traditional fields
  const form = useForm<any>({
    resolver: zodResolver(currentStepConfig.schema as any),
    defaultValues: {
      ...defaultValues,
      initiatives: defaultValues.initiatives || [],
    },
  })

  // Reset form when initialization is complete and data is available
  useEffect(() => {
    if (isInitialized) {
      const newDefaults = getSchemaDefaults(formData)
      console.log(`Initializing form for step ${step} with defaults:`, newDefaults)
      form.reset(newDefaults)
    }
  }, [isInitialized, step, form, getSchemaDefaults, formData])

  // Reset form only when step actually changes
  useEffect(() => {
    if (prevStepRef.current !== step && isInitialized) {
      const newDefaults = getSchemaDefaults(formData)
      console.log(`Resetting form for step ${step} with defaults:`, newDefaults)
      form.reset(newDefaults)
      prevStepRef.current = step
    }
  }, [step, form, getSchemaDefaults, formData, isInitialized])

  // Calculated properties
  const isFirstStep = step === 0
  const isLastStep = step === stepConfigurations.length - 1
  const progress = ((step + 1) / stepConfigurations.length) * 100

  // Handle next step
  const handleNextStep = async (data: any) => {
    console.log('Form submission data:', data)
    console.log('Current step:', step)
    console.log('Form errors:', form.formState.errors)

    const updatedData = { ...formData, ...data }
    //console.log('Updated form data:', updatedData)
    setFormData(updatedData)

    // Special validation for sustainability initiatives step
    if (step === 2) {
      // For the sustainability initiatives step, we need to validate the initiatives array
      // Get the current initiatives from the form
      const initiatives = form.getValues('initiatives') || []

      // Validate each initiative using the schema
      try {
        const validationSchema = currentStepConfig.schema
        await validationSchema.parseAsync({ initiatives })
        // If validation passes, continue to next step
        // Clear any previous errors
        form.clearErrors('initiatives')
      } catch (error) {
        // If validation fails, set the errors and return
        console.log('Validation errors:', error)
        form.setError('initiatives', {
          type: 'manual',
          message: 'Please fix the validation errors in the initiatives',
        })
        return
      }
    }

    // Save step data to the single localStorage object
    const stepIds = [
      'company-info',
      'business-model',
      'sustainability-initiatives',
      'sustainability',
    ]
    saveStepData(stepIds[step], data)

    if (isLastStep) {
      // Final step submission - data should persist for future returns
      setSubmissionState({ isSubmitting: true, isComplete: false })

      setTimeout(() => {
        if (onSubmit) {
          onSubmit(updatedData as FormData)
        }
        setSubmissionState({ isSubmitting: false, isComplete: true })
        // Note: We don't clear form data here to maintain persistence as required
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

  // Handle restart - keep data persistent as required by acceptance criteria
  const handleRestart = () => {
    setStep(0)
    // Note: We don't clear formData to maintain persistence as required
    setSubmissionState({ isSubmitting: false, isComplete: false })
    // Reset form to initial values but keep existing data
    const newDefaults = getSchemaDefaults(formData)
    form.reset(newDefaults)
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
