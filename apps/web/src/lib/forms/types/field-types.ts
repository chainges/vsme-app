import type { FieldApi } from '@tanstack/react-form'
import type { z } from 'zod'

/**
 * Supported field types for the form system
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'fieldArray'
  | 'conditionalGroup'

/**
 * Conditional rendering rule for fields
 */
export interface ConditionalRule {
  field: string
  operator:
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'greaterThan'
    | 'lessThan'
  value: unknown
  logic?: 'and' | 'or'
}

/**
 * Field definition for form configuration
 */
export interface FieldDefinition {
  name: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  validation?: z.ZodSchema<unknown>
  conditionalDisplay?: ConditionalRule
  fieldProps?: Record<string, unknown>
  options?: Array<{ label: string; value: unknown; disabled?: boolean }> // For select, radio fields
  arrayItemSchema?: z.ZodSchema<unknown> // For fieldArray type
}

/**
 * Props passed to field components
 */
export interface FieldProps {
  field: any // FieldApi type from TanStack Forms - using any for simplicity
  definition: FieldDefinition
  disabled?: boolean
  className?: string
}

/**
 * Field type renderer interface
 */
export interface FieldTypeRenderer {
  type: FieldType
  component: React.ComponentType<FieldProps>
  validator?: (value: unknown) => boolean
}

/**
 * Field registry for managing field types
 */
export interface FieldRegistry {
  register: (renderer: FieldTypeRenderer) => void
  get: (type: FieldType) => FieldTypeRenderer | undefined
  getAll: () => FieldTypeRenderer[]
}

/**
 * Field array item props for dynamic arrays
 */
export interface FieldArrayItemProps<T = unknown> {
  index: number
  item: T
  onRemove: (index: number) => void
  onUpdate: (index: number, data: Partial<T>) => void
  schema?: z.ZodSchema<T>
  disabled?: boolean
}

/**
 * Conditional group props for conditional field rendering
 */
export interface ConditionalGroupProps {
  condition: ConditionalRule
  formData: unknown
  children: React.ReactNode
  animationDuration?: number
}
