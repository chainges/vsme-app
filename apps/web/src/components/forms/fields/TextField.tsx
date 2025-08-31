'use client'

import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { TextFieldProps } from './types'

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
 * TextField component with TanStack Forms integration and Zod validation
 *
 * Features:
 * - Full TanStack Forms field integration
 * - Real-time validation with Zod schemas
 * - Accessibility support with proper ARIA attributes
 * - Error display with clear messaging
 * - TypeScript type safety
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      field,
      definition,
      disabled = false,
      className,
      type = 'text',
      autoComplete,
      maxLength,
      ...props
    },
    ref
  ) => {
    const { name, label, placeholder, required = false } = definition

    const hasError = field.state.meta.errors.length > 0
    const errorMessage = hasError
      ? getErrorMessage(field.state.meta.errors[0])
      : ''

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
          autoComplete={autoComplete}
          className={cn(
            hasError && 'border-destructive focus-visible:ring-destructive/20'
          )}
          disabled={disabled}
          id={name}
          maxLength={maxLength}
          name={name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          ref={ref}
          type={type}
          value={field.state.value || ''}
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

TextField.displayName = 'TextField'

export default TextField
