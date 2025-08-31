import type {
  ConditionalGroupProps,
  FieldArrayItemProps,
  FieldProps,
} from '../../../lib/forms/types/field-types'

/**
 * Props for text-based field components (TextField, TextareaField)
 */
export interface TextFieldProps extends FieldProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  autoComplete?: string
  maxLength?: number
}

/**
 * Props for the TextareaField component
 */
export interface TextareaFieldProps extends FieldProps {
  rows?: number
  maxLength?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

/**
 * Props for the SelectField component
 */
export interface SelectFieldProps extends FieldProps {
  options: Array<{ label: string; value: unknown; disabled?: boolean }>
  placeholder?: string
  searchable?: boolean
  multiple?: boolean
}

/**
 * Props for the CheckboxField component
 */
export interface CheckboxFieldProps extends FieldProps {
  description?: string
}

/**
 * Props for the FieldArray component
 */
export interface FieldArrayProps<T = unknown> extends FieldProps {
  itemComponent: React.ComponentType<FieldArrayItemProps<T>>
  addButtonLabel?: string
  removeButtonLabel?: string
  minItems?: number
  maxItems?: number
  emptyMessage?: string
}

/**
 * Props for the ConditionalGroup component
 */
export interface ConditionalGroupComponentProps extends ConditionalGroupProps {
  className?: string
  fieldsToCleanup?: string[]
  onDataCleanup?: (cleanedData: Record<string, unknown>) => void
}
