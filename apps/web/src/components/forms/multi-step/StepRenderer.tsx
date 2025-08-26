'use client'

import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { validateStepConfiguration } from '@/lib/forms/validation/config-validation'
import FieldRenderer from './FieldRenderer'
import type { FormStep } from '@/lib/forms/types/form-types'
import type { FieldApi, FormApi } from '@tanstack/react-form'

/**
 * Props for the StepRenderer component
 */
interface StepRendererProps<T = any> {
  step: FormStep<T>
  formInstance: FormApi<T, any>
  disabled?: boolean
  className?: string
}

/**
 * Error boundary component for configuration validation errors
 */
const ConfigurationErrorBoundary: React.FC<{
  error: Error
  step: FormStep
  className?: string
}> = ({ error, step, className }) => (
  <div className={cn(
    'rounded-md border border-destructive bg-destructive/10 p-4',
    className
  )}>
    <div className="flex items-center gap-2 mb-2">
      <div className="h-4 w-4 rounded-full bg-destructive flex items-center justify-center">
        <span className="text-xs text-destructive-foreground font-bold">!</span>
      </div>
      <h3 className="text-sm font-medium text-destructive">
        Configuration Error in Step: {step.id}
      </h3>
    </div>
    <p className="text-sm text-destructive/80 mb-2">
      {error.message}
    </p>
    <p className="text-xs text-muted-foreground">
      Please check the step configuration and field definitions.
    </p>
  </div>
)

/**
 * StepRenderer component that dynamically renders all fields in a form step
 * 
 * This component:
 * - Validates step configuration before rendering
 * - Creates TanStack Forms field APIs for each field
 * - Uses FieldRenderer to render individual fields
 * - Handles configuration errors gracefully
 * - Optimizes performance with proper memoization
 */
export const StepRenderer = React.memo<StepRendererProps>(({
  step,
  formInstance,
  disabled = false,
  className,
}) => {
  // Validate step configuration and memoize the result
  const configValidation = useMemo(() => {
    try {
      validateStepConfiguration(step)
      return { isValid: true, error: null }
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error : new Error('Unknown validation error') 
      }
    }
  }, [step])

  // If configuration is invalid, show error boundary
  if (!configValidation.isValid) {
    return (
      <ConfigurationErrorBoundary
        error={configValidation.error!}
        step={step}
        className={className}
      />
    )
  }

  // Memoize the rendered fields to prevent unnecessary re-renders
  const renderedFields = useMemo(() => {
    return step.fields.map((fieldDefinition, index) => {
      // Create field API using TanStack Forms
      const fieldApi = formInstance.useField(fieldDefinition.name)
      
      // Generate unique key for React reconciliation
      const fieldKey = `${step.id}-${fieldDefinition.name}-${index}`
      
      return (
        <FieldRenderer
          key={fieldKey}
          definition={fieldDefinition}
          fieldApi={fieldApi}
          disabled={disabled}
        />
      )
    })
  }, [step, formInstance, disabled])

  return (
    <div className={cn('space-y-6', className)}>
      {renderedFields}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo optimization
  return (
    prevProps.step === nextProps.step &&
    prevProps.formInstance === nextProps.formInstance &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.className === nextProps.className
  )
})

StepRenderer.displayName = 'StepRenderer'

export default StepRenderer
