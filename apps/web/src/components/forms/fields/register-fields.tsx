/**
 * Field Registration
 * Registers all field components with the field registry
 * This must be called on app initialization
 */

import { fieldRegistry } from '@/lib/forms/field-registry'
import type { FieldTypeRenderer } from '@/lib/forms/types/field-types'

import TextField from './TextField'
import SelectField from './SelectField'
import TextareaField from './TextareaField'
import CheckboxField from './CheckboxField'
import NumberField from './NumberField'
import RadioField from './RadioField'
import { FieldArray } from './FieldArray'

/**
 * Text field renderer configuration
 */
const textFieldRenderer: FieldTypeRenderer = {
  type: 'text',
  component: TextField as any,
}

/**
 * Email field renderer configuration (uses TextField with type="email")
 */
const emailFieldRenderer: FieldTypeRenderer = {
  type: 'email',
  component: (props: any) => <TextField {...props} type="email" />,
}

/**
 * Number field renderer configuration
 */
const numberFieldRenderer: FieldTypeRenderer = {
  type: 'number',
  component: NumberField as any,
}

/**
 * Select field renderer configuration
 */
const selectFieldRenderer: FieldTypeRenderer = {
  type: 'select',
  component: SelectField as any,
}

/**
 * Textarea field renderer configuration
 */
const textareaFieldRenderer: FieldTypeRenderer = {
  type: 'textarea',
  component: TextareaField as any,
}

/**
 * Checkbox field renderer configuration
 */
const checkboxFieldRenderer: FieldTypeRenderer = {
  type: 'checkbox',
  component: CheckboxField as any,
}

/**
 * Radio field renderer configuration
 */
const radioFieldRenderer: FieldTypeRenderer = {
  type: 'radio',
  component: RadioField as any,
}

/**
 * FieldArray renderer configuration
 */
const fieldArrayRenderer: FieldTypeRenderer = {
  type: 'fieldArray',
  component: FieldArray as any,
}

/**
 * Register all field renderers with the registry
 * Call this once during app initialization
 */
export function registerAllFieldRenderers() {
  // Clear any existing registrations
  fieldRegistry.clear()
  
  // Register all field types
  fieldRegistry.register(textFieldRenderer)
  fieldRegistry.register(emailFieldRenderer)
  fieldRegistry.register(numberFieldRenderer)
  fieldRegistry.register(selectFieldRenderer)
  fieldRegistry.register(textareaFieldRenderer)
  fieldRegistry.register(checkboxFieldRenderer)
  fieldRegistry.register(radioFieldRenderer)
  fieldRegistry.register(fieldArrayRenderer)
  
  console.log('Field renderers registered:', {
    text: true,
    email: true,
    number: true,
    select: true,
    textarea: true,
    checkbox: true,
    radio: true,
    fieldArray: true,
  })
}

// Auto-register on module load for Next.js
if (typeof window !== 'undefined') {
  registerAllFieldRenderers()
}
