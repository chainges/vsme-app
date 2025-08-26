'use client'

import React, { useMemo } from 'react'
import { fieldRegistry } from '@/lib/forms/field-registry'
import { cn } from '@/lib/utils'
import type { FieldDefinition } from '@/lib/forms/types/field-types'
import type { FieldApi } from '@tanstack/react-form'

/**
 * Props for the FieldRenderer component
 */
interface FieldRendererProps {
  definition: FieldDefinition
  fieldApi: FieldApi<any, any, any, any>
  disabled?: boolean
  className?: string
}

/**
 * Fallback component for unknown field types
 */
const UnknownFieldFallback: React.FC<{ definition: FieldDefinition; className?: string }> = ({ 
  definition, 
  className 
}) => (
  <div className={cn('rounded-md border border-dashed border-destructive p-4 text-center', className)}>
    <p className="text-sm text-destructive">
      Unknown field type: <code className="font-mono">{definition.type}</code>
    </p>
    <p className="text-xs text-muted-foreground mt-1">
      Field: {definition.name}
    </p>
  </div>
)

/**
 * FieldRenderer component that dynamically renders form fields based on their type
 * 
 * This component:
 * - Maps field definitions to appropriate components via the field registry
 * - Provides consistent error handling for unknown field types
 * - Passes through field-specific props and styling
 * - Optimizes performance with proper memoization
 */
export const FieldRenderer: React.FC<FieldRendererProps> = React.memo(({
  definition,
  fieldApi,
  disabled = false,
  className,
}) => {
  // Get the field component from the registry
  const fieldRenderer = useMemo(() => {
    return fieldRegistry.get(definition.type)
  }, [definition.type])

  // Memoize field props to prevent unnecessary re-renders
  const fieldProps = useMemo(() => ({
    field: fieldApi,
    definition,
    disabled,
    className,
    ...definition.fieldProps, // Spread any field-specific props
  }), [fieldApi, definition, disabled, className])

  // Render the appropriate field component
  if (!fieldRenderer) {
    // Fallback for unknown field types
    return <UnknownFieldFallback definition={definition} className={className} />
  }

  const FieldComponent = fieldRenderer.component

  return <FieldComponent {...fieldProps} />
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo optimization
  return (
    prevProps.definition === nextProps.definition &&
    prevProps.fieldApi === nextProps.fieldApi &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.className === nextProps.className
  )
})

FieldRenderer.displayName = 'FieldRenderer'

export default FieldRenderer
