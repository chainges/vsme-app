'use client'

import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { TextareaFieldProps } from './types'

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
 * TextareaField component for business model description and other multi-line text
 *
 * Features:
 * - Full TanStack Forms field integration
 * - Real-time validation with Zod schemas
 * - Character count display
 * - Accessibility support with proper ARIA attributes
 * - Error display with clear messaging
 * - Configurable rows and resize behavior
 */
export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      field,
      definition,
      disabled = false,
      className,
      rows = 4,
      maxLength,
      resize = 'vertical',
      ...props
    },
    ref
  ) => {
    const { name, label, placeholder, required = false } = definition

    const hasError = field.state.meta.errors.length > 0
    const errorMessage = hasError
      ? getErrorMessage(field.state.meta.errors[0])
      : ''
    const currentLength = field.state.value?.length || 0

    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between">
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

          {maxLength && (
            <span
              className={cn(
                'text-muted-foreground text-xs',
                currentLength > maxLength * 0.9 && 'text-warning',
                currentLength >= maxLength && 'text-destructive'
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        <Textarea
          aria-describedby={hasError ? `${name}-error` : undefined}
          aria-invalid={hasError}
          aria-required={required}
          className={cn(
            hasError && 'border-destructive focus-visible:ring-destructive/20',
            resize === 'none' && 'resize-none',
            resize === 'horizontal' && 'resize-x',
            resize === 'vertical' && 'resize-y',
            resize === 'both' && 'resize'
          )}
          disabled={disabled}
          id={name}
          maxLength={maxLength}
          name={name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          ref={ref}
          rows={rows}
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

TextareaField.displayName = 'TextareaField'

export default TextareaField
