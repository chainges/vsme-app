'use client'

import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { FieldProps } from '@/lib/forms/types/field-types'

interface NumberFieldProps extends FieldProps {
  min?: number
  max?: number
  step?: number
}

/**
 * Extracts error message from TanStack Forms field error
 */
function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'Validation error'
}

/**
 * NumberField component with TanStack Forms integration and numeric validation
 *
 * Features:
 * - Full TanStack Forms field integration
 * - Numeric input validation
 * - Min/Max/Step support
 * - Proper number handling
 * - Accessibility support with ARIA attributes
 * - Error display with clear messaging
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
  (
    {
      field,
      definition,
      disabled = false,
      className,
      min,
      max,
      step,
      ...props
    },
    ref
  ) => {
    const { name, label, placeholder, required = false } = definition

    const hasError = field.state.meta.errors.length > 0
    const errorMessage = hasError
      ? getErrorMessage(field.state.meta.errors[0])
      : ''

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      // Convert to number, handling empty string
      if (value === '') {
        field.handleChange(0)
      } else {
        const numValue = step && step === 1 
          ? parseInt(value, 10) 
          : parseFloat(value)
        
        if (!isNaN(numValue)) {
          field.handleChange(numValue)
        }
      }
    }

    return (
      <div className={cn('space-y-2', className)}>
        <Label
          className={cn(
            'font-medium text-sm leading-none',
            required &&
              "after:ml-0.5 after:text-destructive after:content-['*']",
            hasError && 'text-destructive'
          )}
          htmlFor={name}
        >
          {label}
        </Label>

        <Input
          aria-describedby={hasError ? `${name}-error` : undefined}
          aria-invalid={hasError}
          aria-required={required}
          className={cn(
            hasError && 'border-destructive focus-visible:ring-destructive/20'
          )}
          disabled={disabled}
          id={name}
          min={min}
          max={max}
          name={name}
          onBlur={field.handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
          ref={ref}
          step={step}
          type="number"
          value={field.state.value ?? ''}
          {...props}
        />

        {hasError && (
          <p
            aria-live="polite"
            className="text-destructive text-sm"
            id={`${name}-error`}
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)

NumberField.displayName = 'NumberField'

export default NumberField
