'use client'

import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { SelectFieldProps } from './types'

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
 * SelectField component for industry and other dropdown selections
 *
 * Features:
 * - Full TanStack Forms field integration
 * - Real-time validation with Zod schemas
 * - Accessibility support with proper ARIA attributes
 * - Error display with clear messaging
 * - Support for disabled options
 * - TypeScript type safety
 */
export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      field,
      definition,
      disabled = false,
      className,
      options = [],
      placeholder: customPlaceholder,
      ...props
    },
    ref
  ) => {
    const {
      name,
      label,
      placeholder: definitionPlaceholder,
      required = false,
    } = definition

    const hasError = field.state.meta.errors.length > 0
    const errorMessage = hasError
      ? getErrorMessage(field.state.meta.errors[0])
      : ''
    const placeholder =
      customPlaceholder ||
      definitionPlaceholder ||
      `Select ${label.toLowerCase()}...`

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

        <Select
          disabled={disabled}
          onValueChange={(value) => field.handleChange(value)}
          value={field.state.value || ''}
          {...props}
        >
          <SelectTrigger
            aria-describedby={hasError ? `${name}-error` : undefined}
            aria-invalid={hasError}
            aria-required={required}
            className={cn(
              'w-full',
              hasError && 'border-destructive focus-visible:ring-destructive/20'
            )}
            id={name}
            ref={ref}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {options.map((option) => (
              <SelectItem
                disabled={option.disabled}
                key={String(option.value)}
                value={String(option.value)}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

SelectField.displayName = 'SelectField'

export default SelectField
