'use client'

import { forwardRef } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { CheckboxFieldProps } from './types'

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
 * CheckboxField component for boolean values and initiative selection
 *
 * Features:
 * - Full TanStack Forms field integration
 * - Real-time validation with Zod schemas
 * - Accessibility support with proper ARIA attributes
 * - Error display with clear messaging
 * - Optional description text
 * - TypeScript type safety
 */
export const CheckboxField = forwardRef<HTMLButtonElement, CheckboxFieldProps>(
  (
    { field, definition, disabled = false, className, description, ...props },
    ref
  ) => {
    const { name, label, required = false } = definition

    const hasError = field.state.meta.errors.length > 0
    const errorMessage = hasError
      ? getErrorMessage(field.state.meta.errors[0])
      : ''
    const isChecked = Boolean(field.state.value)

    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-start space-x-3">
          <Checkbox
            aria-describedby={
              hasError
                ? `${name}-error`
                : description
                  ? `${name}-description`
                  : undefined
            }
            aria-invalid={hasError}
            aria-required={required}
            checked={isChecked}
            className={cn(
              'mt-0.5',
              hasError &&
                'border-destructive data-[state=checked]:border-destructive'
            )}
            disabled={disabled}
            id={name}
            name={name}
            onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
            ref={ref}
            {...props}
          />

          <div className="flex-1 space-y-1">
            <Label
              className={cn(
                'cursor-pointer font-medium text-sm leading-none',
                required &&
                  "after:ml-0.5 after:text-destructive after:content-['*']",
                hasError && 'text-destructive',
                disabled && 'cursor-not-allowed opacity-50'
              )}
              htmlFor={name}
            >
              {label}
            </Label>

            {description && (
              <p
                className="text-muted-foreground text-sm"
                id={`${name}-description`}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {hasError && (
          <p
            aria-live="polite"
            className="ml-7 text-destructive text-sm"
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

CheckboxField.displayName = 'CheckboxField'

export default CheckboxField
