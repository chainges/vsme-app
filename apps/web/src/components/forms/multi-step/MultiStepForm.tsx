'use client'

import { useForm } from '@tanstack/react-form'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { zodValidator } from '@tanstack/zod-form-adapter'
import type { z } from 'zod'

import {
  LocalStorageProvider,
  type StorageProvider,
} from '@/lib/forms/storage'
import type {
  FormState,
  FormNavigation,
  MultiStepFormConfig,
  ProgressData,
} from '@/lib/forms/types'
import { cn } from '@/lib/utils'
import NavigationControls from './NavigationControls'
import ProgressIndicator from './ProgressIndicator'
import StepRenderer from './StepRenderer'
import type { MultiStepFormProps } from './types'

/**
 * MultiStepForm Controller Component
 *
 * A comprehensive multi-step form controller that orchestrates the entire form flow
 * with TanStack Forms integration, step-based navigation, and automatic storage persistence.
 *
 * Features:
 * - Step management with validation-based navigation
 * - Automatic form state persistence to localStorage
 * - Form state restoration on component mount
 * - Integration with existing form field components
 * - Progress tracking and step completion indicators
 * - Configurable validation modes and storage providers
 * - Full TypeScript support with generic types
 *
 * @example
 * ```tsx
 * const config: MultiStepFormConfig<MyFormData> = {
 *   id: 'my-form',
 *   title: 'Multi-Step Registration',
 *   steps: [
 *     {
 *       id: 'personal',
 *       title: 'Personal Information',
 *       schema: personalSchema,
 *       fields: personalFields
 *     },
 *     // ... more steps
 *   ],
 *   onSubmit: async (data) => await submitForm(data)
 * }
 *
 * <MultiStepForm
 *   config={config}
 *   onStepChange={(step) => console.log('Current step:', step)}
 *   onFormComplete={(data) => console.log('Form completed:', data)}
 * />
 * ```
 */
export function MultiStepForm<T = any>({
  config,
  className,
  onStepChange,
  onDataChange,
}: MultiStepFormProps<T>) {
  // State management
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  // Storage provider setup
  const storageProvider = useMemo<StorageProvider>(() => {
    return config.storage || new LocalStorageProvider(`form-${config.id}`)
  }, [config.storage, config.id])

  // Get current step configuration
  const currentStepConfig = config.steps[currentStep]

  // TanStack Form setup with Zod validation
  const form = useForm({
    defaultValues: (config.defaultValues || {}) as Partial<T>,
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        await config.onSubmit(value as T)
        // Clear storage after successful submission
        await storageProvider.clear(config.id)
      } catch (error) {
        console.error('Form submission error:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
  })

  // Enhanced form state debugging 
  useEffect(() => {
    console.log('=== FORM STATE DEBUG ===', {
      currentStep,
      formValues: form.state.values,
      formValuesStringified: JSON.stringify(form.state.values, null, 2),
      isDirty: form.state.isDirty,
      isTouched: form.state.isTouched,
      formMethods: Object.keys(form).filter(key => typeof form[key] === 'function')
    })
  }, [form.state.values, form.state.isDirty, form.state.isTouched, currentStep])

  // Load saved data on mount - only once
  const [hasLoadedData, setHasLoadedData] = useState(false)
  
  useEffect(() => {
    if (hasLoadedData) return // Prevent multiple loads
    
    const loadSavedData = async () => {
      try {
        console.log('MultiStepForm - Loading saved data (initial load)...')
        const savedData = await storageProvider.load(config.id)
        console.log('MultiStepForm - Saved data loaded:', savedData)
        
        if (savedData) {
          // Restore form data using proper API
          console.log('MultiStepForm - Restoring form data:', savedData.data)
          // Reset the form with the saved data instead of using setFieldValue incorrectly
          form.reset(savedData.data || {})
          
          // Restore current step if available
          if (savedData.currentStep !== undefined) {
            console.log('MultiStepForm - Restoring current step:', savedData.currentStep)
            setCurrentStep(Math.min(savedData.currentStep, config.steps.length - 1))
          }
        } else {
          console.log('MultiStepForm - No saved data found, using defaults')
        }
        
        setHasLoadedData(true)
      } catch (error) {
        console.error('Failed to load saved form data:', error)
        setHasLoadedData(true) // Mark as loaded even if failed to prevent infinite retries
      }
    }

    loadSavedData()
  }, [config.id, hasLoadedData, storageProvider])

  // Save form data automatically when step changes or data changes
  const saveFormData = useCallback(async () => {
    try {
      const currentData = form.state.values
      console.log('MultiStepForm - Saving form data:', {
        currentData,
        currentStep,
        timestamp: Date.now()
      })
      
      await storageProvider.save(config.id, {
        data: currentData,
        currentStep,
        timestamp: Date.now(),
      })
      
      // Call optional save callback
      if (config.onSave) {
        await config.onSave(currentData as Partial<T>)
      }
      
      console.log('MultiStepForm - Form data saved successfully')
    } catch (error) {
      console.error('Failed to save form data:', error)
    }
  }, [form.state.values, currentStep, config.id, config.onSave, storageProvider])

  // Auto-save when data changes - but only after initial load
  useEffect(() => {
    if (!hasLoadedData) return // Don't save until initial data is loaded
    
    const timeoutId = setTimeout(saveFormData, 500) // Debounce saves
    return () => clearTimeout(timeoutId)
  }, [saveFormData, hasLoadedData])

  // Validate current step
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (!currentStepConfig) return false

    setIsValidating(true)
    try {
      const currentData = form.state.values
      const result = await currentStepConfig.schema.safeParseAsync(currentData)
      
      if (!result.success) {
        // Set field errors from validation
        result.error.issues.forEach((issue) => {
          const fieldPath = issue.path.join('.')
          form.setFieldMeta(fieldPath, (prev) => ({
            ...prev,
            errors: [issue.message],
          }))
        })
        return false
      }

      return true
    } catch (error) {
      console.error('Step validation error:', error)
      return false
    } finally {
      setIsValidating(false)
    }
  }, [currentStepConfig, form])

  // Navigation handlers
  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    const nextStep = currentStep + 1
    if (nextStep < config.steps.length) {
      setCurrentStep(nextStep)
      await saveFormData()
      onStepChange?.(nextStep)
    }
  }, [currentStep, config.steps.length, validateCurrentStep, saveFormData, onStepChange])

  const handlePrevious = useCallback(() => {
    const prevStep = currentStep - 1
    if (prevStep >= 0) {
      setCurrentStep(prevStep)
      onStepChange?.(prevStep)
    }
  }, [currentStep, onStepChange])

  const handleGoToStep = useCallback(async (targetStep: number) => {
    if (targetStep < 0 || targetStep >= config.steps.length) return

    // If going forward, validate all steps in between
    if (targetStep > currentStep) {
      for (let step = currentStep; step < targetStep; step++) {
        setCurrentStep(step)
        const isValid = await validateCurrentStep()
        if (!isValid) {
          return // Stop at invalid step
        }
      }
    }

    setCurrentStep(targetStep)
    await saveFormData()
    onStepChange?.(targetStep)
  }, [currentStep, config.steps.length, validateCurrentStep, saveFormData, onStepChange])

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    await form.handleSubmit()
  }, [form, validateCurrentStep])

  // Navigation state
  const navigation: FormNavigation = useMemo(() => ({
    canGoNext: currentStep < config.steps.length - 1,
    canGoPrevious: currentStep > 0,
    goNext: handleNext,
    goPrevious: handlePrevious,
    goToStep: handleGoToStep,
  }), [currentStep, config.steps.length, handleNext, handlePrevious, handleGoToStep])

  // Progress data
  const progressData: ProgressData = useMemo(() => {
    const completedSteps = Array.from({ length: currentStep }, (_, i) => i)
    return {
      currentStep,
      totalSteps: config.steps.length,
      completedSteps,
      percentage: Math.round((currentStep / config.steps.length) * 100),
    }
  }, [currentStep, config.steps.length])

  // Form state
  const formState: FormState<T> = useMemo(() => ({
    currentStep,
    data: form.state.values as Partial<T>,
    isValid: form.state.isValid,
    isSubmitting: form.state.isSubmitting || isLoading,
    errors: {}, // TODO: Properly map TanStack Forms errors to Record<string, string[]>
    touched: form.state.isTouched ? { [currentStepConfig?.id || 'root']: true } : {},
  }), [
    currentStep,
    form.state.values,
    form.state.isValid,
    form.state.isSubmitting,
    form.state.isTouched,
    isLoading,
    currentStepConfig?.id,
  ])

  // Notify parent of data changes
  useEffect(() => {
    onDataChange?.(form.state.values as Partial<T>)
  }, [form.state.values, onDataChange])

  // Render current step fields
  const renderCurrentStep = () => {
    if (!currentStepConfig) return null

    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {currentStepConfig.title}
          </h2>
          {currentStepConfig.description && (
            <p className="text-muted-foreground">
              {currentStepConfig.description}
            </p>
          )}
        </div>

        <StepRenderer 
          step={currentStepConfig}
          formInstance={form}
          disabled={isLoading || isValidating || !hasLoadedData}
        />
      </div>
    )
  }

  return (
    <form
      className={cn(
        'mx-auto w-full max-w-4xl space-y-0 rounded-lg border bg-card shadow-sm',
        className
      )}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {/* Progress Indicator */}
      <div className="border-b px-6 py-4">
        <ProgressIndicator
          steps={config.steps.map(step => ({
            id: step.id,
            title: step.title,
            description: step.description
          }))}
          currentStep={currentStep}
          completedSteps={progressData.completedSteps}
          onStepClick={handleGoToStep}
          allowStepNavigation={false}
        />
      </div>

      {/* Current Step Content */}
      <div className="min-h-[400px]">
        {renderCurrentStep()}
      </div>

      {/* Navigation Controls */}
      <NavigationControls
        currentStep={currentStep}
        totalSteps={config.steps.length}
        canGoNext={navigation.canGoNext}
        canGoPrevious={navigation.canGoPrevious}
        isLoading={isLoading}
        isValidating={isValidating}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={currentStep === config.steps.length - 1 ? handleSubmit : undefined}
      />
    </form>
  )
}

export default MultiStepForm
