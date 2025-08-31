'use client'

import { Plus, Trash2 } from 'lucide-react'
import { forwardRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { FieldArrayProps } from './types'

/**
 * FieldArray component using TanStack Forms array field capabilities
 *
 * Features:
 * - Dynamic add/remove functionality with proper state management
 * - Validation for array items and proper error handling
 * - Accessibility support for dynamic content announcements
 * - Configurable min/max items
 * - Custom item components for flexible rendering
 */
export const FieldArray = forwardRef<HTMLDivElement, FieldArrayProps>(
  (
    {
      field,
      definition,
      disabled = false,
      className,
      itemComponent: ItemComponent,
      addButtonLabel = 'Add Item',
      removeButtonLabel = 'Remove',
      minItems = 0,
      maxItems = 10,
      emptyMessage = 'No items added yet.',
      ...props
    },
    ref
  ) => {
    const { name, label, required = false } = definition

    const items = field.state.value || []
    const hasError = field.state.meta.errors.length > 0
    const canAdd = items.length < maxItems && !disabled
    const canRemove = items.length > minItems && !disabled

    const handleAdd = () => {
      if (canAdd) {
        const newItem = {} // Empty object for new item
        field.pushValue(newItem)

        // Announce to screen readers
        const announcement = `Added new ${label?.toLowerCase() || 'item'}. Total: ${items.length + 1}`
        announceToScreenReader(announcement)
      }
    }

    const handleRemove = (index: number) => {
      if (canRemove) {
        field.removeValue(index)

        // Announce to screen readers
        const announcement = `Removed ${label?.toLowerCase() || 'item'}. Total: ${items.length - 1}`
        announceToScreenReader(announcement)
      }
    }

    const handleUpdate = (index: number, data: unknown) => {
      const currentItems = [...items]
      if (
        typeof data === 'object' &&
        data !== null &&
        typeof currentItems[index] === 'object' &&
        currentItems[index] !== null
      ) {
        currentItems[index] = { ...currentItems[index], ...data }
      } else {
        currentItems[index] = data
      }
      field.handleChange(currentItems)
    }

    return (
      <div className={cn('space-y-4', className)} ref={ref} {...props}>
        <div className="flex items-center justify-between">
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

          <Button
            aria-describedby={`${name}-add-description`}
            disabled={!canAdd}
            onClick={handleAdd}
            size="sm"
            type="button"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            {addButtonLabel}
          </Button>
        </div>

        {/* Screen reader description for add button */}
        <div className="sr-only" id={`${name}-add-description`}>
          {canAdd
            ? `Add a new ${label?.toLowerCase() || 'item'}. Currently ${items.length} of ${maxItems} maximum.`
            : `Cannot add more items. Maximum of ${maxItems} reached.`}
        </div>

        {/* Items list */}
        <div
          aria-label={`${label} list`}
          aria-live="polite"
          className="space-y-3"
          role="group"
        >
          {items.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">{emptyMessage}</p>
              </CardContent>
            </Card>
          ) : (
            items.map((item: unknown, index: number) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {label} {index + 1}
                    </CardTitle>
                    <Button
                      aria-label={`${removeButtonLabel} ${label?.toLowerCase() || 'item'} ${index + 1}`}
                      disabled={!canRemove}
                      onClick={() => handleRemove(index)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{removeButtonLabel}</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ItemComponent
                    disabled={disabled}
                    index={index}
                    item={item}
                    onRemove={handleRemove}
                    onUpdate={handleUpdate}
                    schema={definition.arrayItemSchema}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Error display */}
        {hasError && (
          <div
            aria-live="polite"
            className="text-destructive text-sm"
            role="alert"
          >
            {field.state.meta.errors.map((error: unknown, index: number) => (
              <p key={index}>
                {typeof error === 'string' ? error : 'Validation error'}
              </p>
            ))}
          </div>
        )}

        {/* Live region for screen reader announcements */}
        <div
          aria-atomic="true"
          aria-live="polite"
          className="sr-only"
          id={`${name}-announcements`}
        />
      </div>
    )
  }
)

FieldArray.displayName = 'FieldArray'

/**
 * Utility function to announce changes to screen readers
 */
function announceToScreenReader(message: string) {
  // Create a temporary element for screen reader announcements
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export default FieldArray
