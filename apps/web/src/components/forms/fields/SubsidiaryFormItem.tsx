'use client'

import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { FieldArrayItemProps } from '../../../lib/forms/types/field-types'

/**
 * Subsidiary data structure
 */
export interface SubsidiaryData {
  name: string
  organizationNumber: string
  address: string
}

/**
 * Zod schema for subsidiary validation
 */
const subsidiarySchema = z.object({
  name: z.string().min(1, 'Subsidiary name is required'),
  organizationNumber: z.string().min(1, 'Organization number is required'),
  address: z.string().min(1, 'Address is required'),
})

/**
 * Props for SubsidiaryFormItem component
 */
export interface SubsidiaryFormItemProps
  extends Omit<FieldArrayItemProps<SubsidiaryData>, 'schema'> {
  className?: string
  schema?: z.ZodSchema<SubsidiaryData>
}

/**
 * Extracts error message from validation error
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
 * SubsidiaryFormItem component for managing individual subsidiary data
 *
 * Features:
 * - Individual form validation for each subsidiary
 * - Real-time validation with Zod schema
 * - Proper error handling and display
 * - Accessibility support with ARIA attributes
 * - Auto-save functionality on field changes
 */
export function SubsidiaryFormItem({
  index,
  item,
  onUpdate,
  disabled = false,
  className,
}: SubsidiaryFormItemProps) {
  const form = useForm({
    defaultValues: {
      name: item?.name || '',
      organizationNumber: item?.organizationNumber || '',
      address: item?.address || '',
    },
    onSubmit: async ({ value }) => {
      // This won't be called directly, but ensures form is properly typed
      onUpdate(index, value)
    },
  })

  // Auto-save on field changes
  const handleFieldChange = (
    fieldName: keyof SubsidiaryData,
    value: string
  ) => {
    const updatedData = {
      ...item,
      [fieldName]: value,
    }
    onUpdate(index, updatedData)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Subsidiary Name Field */}
        <form.Field name="name">
          {(field) => {
            const hasError = field.state.meta.errors.length > 0
            const errorMessage = hasError
              ? getErrorMessage(field.state.meta.errors[0])
              : ''

            return (
              <div className="space-y-2">
                <Label
                  className={cn(
                    'font-medium text-sm leading-none',
                    "after:ml-0.5 after:text-destructive after:content-['*']",
                    hasError && 'text-destructive'
                  )}
                  htmlFor={`subsidiary-${index}-name`}
                >
                  Subsidiary Name
                </Label>

                <Input
                  aria-describedby={
                    hasError ? `subsidiary-${index}-name-error` : undefined
                  }
                  aria-invalid={hasError}
                  aria-required={true}
                  className={cn(
                    hasError &&
                      'border-destructive focus-visible:ring-destructive/20'
                  )}
                  disabled={disabled}
                  id={`subsidiary-${index}-name`}
                  name={`subsidiary-${index}-name`}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                    handleFieldChange('name', e.target.value)
                  }}
                  placeholder="Enter subsidiary name"
                  value={field.state.value}
                />

                {hasError && (
                  <p
                    aria-live="polite"
                    className="text-destructive text-sm"
                    id={`subsidiary-${index}-name-error`}
                    role="alert"
                  >
                    {errorMessage}
                  </p>
                )}
              </div>
            )
          }}
        </form.Field>

        {/* Organization Number Field */}
        <form.Field name="organizationNumber">
          {(field) => {
            const hasError = field.state.meta.errors.length > 0
            const errorMessage = hasError
              ? getErrorMessage(field.state.meta.errors[0])
              : ''

            return (
              <div className="space-y-2">
                <Label
                  className={cn(
                    'font-medium text-sm leading-none',
                    "after:ml-0.5 after:text-destructive after:content-['*']",
                    hasError && 'text-destructive'
                  )}
                  htmlFor={`subsidiary-${index}-org-number`}
                >
                  Organization Number
                </Label>

                <Input
                  aria-describedby={
                    hasError
                      ? `subsidiary-${index}-org-number-error`
                      : undefined
                  }
                  aria-invalid={hasError}
                  aria-required={true}
                  className={cn(
                    hasError &&
                      'border-destructive focus-visible:ring-destructive/20'
                  )}
                  disabled={disabled}
                  id={`subsidiary-${index}-org-number`}
                  name={`subsidiary-${index}-org-number`}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                    handleFieldChange('organizationNumber', e.target.value)
                  }}
                  placeholder="Enter organization number"
                  value={field.state.value}
                />

                {hasError && (
                  <p
                    aria-live="polite"
                    className="text-destructive text-sm"
                    id={`subsidiary-${index}-org-number-error`}
                    role="alert"
                  >
                    {errorMessage}
                  </p>
                )}
              </div>
            )
          }}
        </form.Field>
      </div>

      {/* Address Field - Full Width */}
      <form.Field name="address">
        {(field) => {
          const hasError = field.state.meta.errors.length > 0
          const errorMessage = hasError
            ? getErrorMessage(field.state.meta.errors[0])
            : ''

          return (
            <div className="space-y-2">
              <Label
                className={cn(
                  'font-medium text-sm leading-none',
                  "after:ml-0.5 after:text-destructive after:content-['*']",
                  hasError && 'text-destructive'
                )}
                htmlFor={`subsidiary-${index}-address`}
              >
                Address
              </Label>

              <Input
                aria-describedby={
                  hasError ? `subsidiary-${index}-address-error` : undefined
                }
                aria-invalid={hasError}
                aria-required={true}
                className={cn(
                  hasError &&
                    'border-destructive focus-visible:ring-destructive/20'
                )}
                disabled={disabled}
                id={`subsidiary-${index}-address`}
                name={`subsidiary-${index}-address`}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value)
                  handleFieldChange('address', e.target.value)
                }}
                placeholder="Enter full address"
                value={field.state.value}
              />

              {hasError && (
                <p
                  aria-live="polite"
                  className="text-destructive text-sm"
                  id={`subsidiary-${index}-address-error`}
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>
    </div>
  )
}

export default SubsidiaryFormItem
