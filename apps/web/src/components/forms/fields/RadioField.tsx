import React, { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import type { FieldDefinition } from '@/lib/forms/types/field-types'

/**
 * Option type for radio field
 */
export interface RadioOption {
  label: string
  value: string
  disabled?: boolean
}

/**
 * RadioField component props
 */
export interface RadioFieldProps {
  field: {
    name: string
    state: {
      value?: string
      meta: {
        errors: unknown[]
      }
    }
    handleChange: (value: string) => void
    handleBlur: () => void
  }
  definition: FieldDefinition & {
    fieldProps?: {
      options?: RadioOption[]
      defaultValue?: string
      orientation?: 'horizontal' | 'vertical'
    }
  }
  disabled?: boolean
  className?: string
}

/**
 * Helper function to get error message
 */
function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'Invalid value'
}

/**
 * RadioField component for radio group selections
 * Supports horizontal and vertical orientations
 */
export const RadioField = forwardRef<HTMLDivElement, RadioFieldProps>(
  (
    {
      field,
      definition,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const { name, label, required = false } = definition
    const { options = [], defaultValue, orientation = 'vertical' } = definition.fieldProps || {}

    const hasError = field.state.meta.errors.length > 0
    const errorMessage = hasError
      ? getErrorMessage(field.state.meta.errors[0])
      : ''

    const currentValue = field.state.value || defaultValue || ''

    return (
      <div className={cn('space-y-3', className)} ref={ref} {...props}>
        <Label
          className={cn(
            'font-medium text-sm leading-none',
            required &&
              "after:ml-0.5 after:text-destructive after:content-['*']",
            hasError && 'text-destructive'
          )}
        >
          {label}
        </Label>

        <RadioGroup
          value={currentValue}
          onValueChange={field.handleChange}
          disabled={disabled}
          className={cn(
            orientation === 'horizontal' 
              ? 'flex flex-row space-x-6 space-y-0' 
              : 'flex flex-col space-y-3'
          )}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem
                value={option.value}
                id={`${name}-${option.value}`}
                disabled={disabled || option.disabled}
                className={cn(
                  hasError && 'border-destructive',
                )}
              />
              <Label
                htmlFor={`${name}-${option.value}`}
                className={cn(
                  'font-normal text-sm cursor-pointer',
                  (disabled || option.disabled) && 'opacity-50 cursor-not-allowed',
                  hasError && 'text-destructive'
                )}
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

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

RadioField.displayName = 'RadioField'

export default RadioField