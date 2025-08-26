import type { FieldDefinition, FormStep, FieldType } from '../types/field-types'

/**
 * Custom error class for configuration validation errors
 */
export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldPath?: string
  ) {
    super(message)
    this.name = 'ConfigValidationError'
  }
}

/**
 * Valid field types supported by the system
 */
const VALID_FIELD_TYPES: FieldType[] = [
  'text',
  'email',
  'number',
  'textarea',
  'select',
  'checkbox',
  'radio',
  'fieldArray',
  'conditionalGroup',
]

/**
 * Valid conditional operators
 */
const VALID_CONDITIONAL_OPERATORS = [
  'equals',
  'notEquals',
  'contains',
  'notContains',
  'greaterThan',
  'lessThan',
]

/**
 * Validates a field definition for correctness and completeness
 */
export function validateFieldDefinition(definition: FieldDefinition): void {
  // Check required properties
  if (!definition.name) {
    throw new ConfigValidationError('Field name is required')
  }

  if (!definition.type) {
    throw new ConfigValidationError('Field type is required')
  }

  if (!definition.label) {
    throw new ConfigValidationError('Field label is required')
  }

  // Validate field type
  if (!VALID_FIELD_TYPES.includes(definition.type)) {
    throw new ConfigValidationError(`Invalid field type: ${definition.type}`)
  }

  // Validate field-specific requirements
  validateFieldTypeSpecificRequirements(definition)

  // Validate conditional display rules if present
  if (definition.conditionalDisplay) {
    validateConditionalRule(definition.conditionalDisplay)
  }
}

/**
 * Validates field type-specific requirements
 */
function validateFieldTypeSpecificRequirements(definition: FieldDefinition): void {
  const { type } = definition

  // Select and radio fields must have options
  if ((type === 'select' || type === 'radio') && (!definition.options || definition.options.length === 0)) {
    throw new ConfigValidationError('Select and radio fields must have options')
  }

  // Field arrays must have schema
  if (type === 'fieldArray' && !definition.arrayItemSchema) {
    throw new ConfigValidationError('Field array must have arrayItemSchema')
  }

  // Validate options format if present
  if (definition.options) {
    definition.options.forEach((option, index) => {
      if (!option.label || option.value === undefined) {
        throw new ConfigValidationError(`Option at index ${index} must have both label and value`)
      }
    })
  }
}

/**
 * Validates a conditional rule
 */
function validateConditionalRule(rule: any): void {
  if (!rule.field) {
    throw new ConfigValidationError('Conditional rule must have a field property')
  }

  if (!rule.operator || !VALID_CONDITIONAL_OPERATORS.includes(rule.operator)) {
    throw new ConfigValidationError(`Invalid conditional operator: ${rule.operator}`)
  }

  if (rule.value === undefined) {
    throw new ConfigValidationError('Conditional rule must have a value property')
  }

  // Validate logic if present
  if (rule.logic && !['and', 'or'].includes(rule.logic)) {
    throw new ConfigValidationError(`Invalid conditional logic: ${rule.logic}`)
  }
}

/**
 * Validates a complete step configuration
 */
export function validateStepConfiguration(step: FormStep): void {
  // Check required properties
  if (!step.id) {
    throw new ConfigValidationError('Step ID is required')
  }

  if (!step.title || step.title.trim() === '') {
    throw new ConfigValidationError('Step title cannot be empty')
  }

  if (!step.schema) {
    throw new ConfigValidationError('Step schema is required')
  }

  if (!step.fields || !Array.isArray(step.fields)) {
    throw new ConfigValidationError('Step must have a fields array')
  }

  // Check for duplicate field names
  const fieldNames = new Set<string>()
  for (const field of step.fields) {
    if (fieldNames.has(field.name)) {
      throw new ConfigValidationError(`Duplicate field name: ${field.name}`)
    }
    fieldNames.add(field.name)
  }

  // Validate each field definition
  step.fields.forEach((field, index) => {
    try {
      validateFieldDefinition(field)
    } catch (error) {
      if (error instanceof ConfigValidationError) {
        throw new ConfigValidationError(
          error.message,
          `${step.id}.fields[${index}].${field.name}`
        )
      }
      throw error
    }
  })

  // Validate conditional logic if present
  if (step.conditionalLogic) {
    step.conditionalLogic.forEach((rule, index) => {
      try {
        validateConditionalRule(rule)
      } catch (error) {
        if (error instanceof ConfigValidationError) {
          throw new ConfigValidationError(
            error.message,
            `${step.id}.conditionalLogic[${index}]`
          )
        }
        throw error
      }
    })
  }
}

/**
 * Validates multiple step configurations
 */
export function validateMultiStepConfiguration(steps: FormStep[]): void {
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    throw new ConfigValidationError('At least one step is required')
  }

  // Check for duplicate step IDs
  const stepIds = new Set<string>()
  steps.forEach((step, index) => {
    if (stepIds.has(step.id)) {
      throw new ConfigValidationError(`Duplicate step ID: ${step.id}`)
    }
    stepIds.add(step.id)

    // Validate each step
    try {
      validateStepConfiguration(step)
    } catch (error) {
      if (error instanceof ConfigValidationError) {
        throw new ConfigValidationError(
          error.message,
          `steps[${index}].${error.fieldPath || step.id}`
        )
      }
      throw error
    }
  })
}
