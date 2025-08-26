'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm } from '@tanstack/react-form'

import Step1NavigationControls from '@/components/forms/general-info/Step1NavigationControls'
import TextField from '@/components/forms/fields/TextField'
import NumberField from '@/components/forms/fields/NumberField'
import SelectField from '@/components/forms/fields/SelectField'
import { LocalStorageProvider } from '@/lib/forms/storage'
import { 
  generalInfoStep1Config, 
  generalInfoStep1DefaultValues 
} from '@/lib/forms/configs/general-info-step1-config'
import { generalInfoStep1Schema } from '@/lib/forms/validation/general-info-step1-schemas'
import type { GeneralInfoStep1Data } from '@/lib/forms/types/general-info-step1-types'

// Register field renderers
import '@/components/forms/fields/register-fields'

/**
 * Story 4.1.11: GeneralInfo Page with Step 1 Implementation
 * Single-step form for Company Information
 */
export default function GeneralInfoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  // Custom storage provider with specific key
  const storageProvider = new LocalStorageProvider('form-general-info-step1')

  // Form instance with TanStack Forms
  const form = useForm({
    defaultValues: generalInfoStep1DefaultValues,
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        // Call the config's onSubmit
        await generalInfoStep1Config.onSubmit(value as GeneralInfoStep1Data)
        // Clear storage after successful submission
        await storageProvider.clear('form-general-info-step1')
        // Show success message (in production, redirect or show toast)
        alert('Step 1 completed successfully!')
      } catch (error) {
        console.error('Submission error:', error)
        alert('Error submitting form. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
  })

  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await storageProvider.load('form-general-info-step1')
        if (savedData?.data) {
          // Update form with saved data
          Object.entries(savedData.data).forEach(([key, value]) => {
            form.setFieldValue(key as keyof GeneralInfoStep1Data, value)
          })
        }
      } catch (error) {
        console.error('Failed to load saved data:', error)
      }
    }
    loadSavedData()
  }, [])

  // Save draft handler
  const handleSaveDraft = useCallback(async () => {
    try {
      const currentData = form.state.values
      await storageProvider.save('form-general-info-step1', {
        data: currentData,
        currentStep: 0,
        timestamp: Date.now(),
      })
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Failed to save draft:', error)
      alert('Error saving draft. Please try again.')
    }
  }, [form.state.values, storageProvider])

  // Complete step handler (validates first)
  const handleCompleteStep = useCallback(async () => {
    setIsValidating(true)
    try {
      // Validate the form data
      const result = await generalInfoStep1Schema.safeParseAsync(form.state.values)
      
      if (!result.success) {
        // Show validation errors
        if (result.error?.errors) {
          result.error.errors.forEach((error) => {
            const fieldName = error.path[0] as keyof GeneralInfoStep1Data
            form.setFieldMeta(fieldName, (prev) => ({
              ...prev,
              errors: [error.message],
            }))
          })
        }
        alert('Please fix all validation errors before completing.')
        return
      }

      // If valid, submit the form
      await form.handleSubmit()
    } finally {
      setIsValidating(false)
    }
  }, [form])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-1">
        <div className="rounded-xl bg-muted/50 p-6">
          <h1 className="mb-2 font-semibold text-2xl">General Information</h1>
          <p className="text-muted-foreground">
            Complete the company information section to begin your ESG reporting journey.
          </p>
        </div>
      </div>
      
      <div className="flex-1">
        <form
          className="mx-auto w-full max-w-4xl space-y-0 rounded-lg border bg-card shadow-sm"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleCompleteStep()
          }}
        >
            {/* Progress Indicator */}
            <div className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Step 1: Company Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your company details and contact information
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  10 fields required
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 p-6">
              {generalInfoStep1Config.steps[0].fields.map((fieldDef) => {
                const fieldType = fieldDef.type === 'email' ? 'text' : fieldDef.type
                
                return (
                  <form.Field
                    key={fieldDef.name}
                    name={fieldDef.name}
                    validators={{
                      onChange: generalInfoStep1Schema.shape[fieldDef.name as keyof typeof generalInfoStep1Schema.shape],
                    }}
                  >
                    {(field) => {
                      // Render appropriate field component
                      if (fieldType === 'text' || fieldDef.type === 'email') {
                        return (
                          <TextField
                            field={field}
                            definition={fieldDef}
                            type={fieldDef.type === 'email' ? 'email' : 'text'}
                            disabled={isLoading || isValidating}
                            {...(fieldDef.fieldProps || {})}
                          />
                        )
                      } else if (fieldType === 'number') {
                        return (
                          <NumberField
                            field={field}
                            definition={fieldDef}
                            disabled={isLoading || isValidating}
                            {...(fieldDef.fieldProps || {})}
                          />
                        )
                      } else if (fieldType === 'select') {
                        return (
                          <SelectField
                            field={field}
                            definition={fieldDef}
                            disabled={isLoading || isValidating}
                            {...(fieldDef.fieldProps || {})}
                          />
                        )
                      }
                      return null
                    }}
                  </form.Field>
                )
              })}
            </div>

            {/* Navigation Controls */}
            <Step1NavigationControls
              isLoading={isLoading}
              isValidating={isValidating}
              onSaveDraft={handleSaveDraft}
              onComplete={handleCompleteStep}
            />
        </form>
      </div>
    </div>
  )
}
