import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { vi } from 'vitest'
import { z } from 'zod'
import { fieldRegistry } from '@/lib/forms/field-registry'
import { validateStepConfiguration } from '@/lib/forms/validation/config-validation'
import type { FormStep, FieldDefinition } from '@/lib/forms/types'

// Mock field components
const MockTextField = () => ({ type: 'TextField' })
const MockSelectField = () => ({ type: 'SelectField' })
const MockCheckboxField = () => ({ type: 'CheckboxField' })

// Mock fieldApi for tests
const createMockFieldApi = (value: any = '') => ({
  state: {
    value,
    meta: {
      errors: [],
    },
  },
  handleChange: vi.fn(),
  handleBlur: vi.fn(),
})

// Mock formInstance for tests
const createMockFormInstance = (values: Record<string, any> = {}) => ({
  useField: vi.fn((name: string) => createMockFieldApi(values[name] || '')),
  state: {
    values,
    isValid: true,
    isSubmitting: false,
    errors: [],
    isTouched: false,
  },
})

// Simulate StepRenderer logic for testing
function simulateStepRenderer(
  step: FormStep,
  formInstance: any,
  disabled = false,
  className?: string
) {
  // First validate the step configuration
  try {
    validateStepConfiguration(step)
  } catch (error) {
    return {
      type: 'ErrorBoundary',
      props: {
        error: error,
        step,
      },
    }
  }

  // Render each field using the field registry
  const renderedFields = step.fields.map((fieldDefinition, index) => {
    const fieldApi = formInstance.useField(fieldDefinition.name)
    const fieldRenderer = fieldRegistry.get(fieldDefinition.type)

    if (!fieldRenderer) {
      return {
        type: 'UnknownFieldFallback',
        props: {
          definition: fieldDefinition,
          key: `${step.id}-${fieldDefinition.name}-${index}`,
        },
      }
    }

    const fieldProps = {
      field: fieldApi,
      definition: fieldDefinition,
      disabled,
      key: `${step.id}-${fieldDefinition.name}-${index}`,
      ...fieldDefinition.fieldProps,
    }

    return {
      type: fieldRenderer.component,
      props: fieldProps,
    }
  })

  return {
    type: 'StepRenderer',
    props: {
      step,
      formInstance,
      disabled,
      className,
      fields: renderedFields,
    },
  }
}

describe('StepRenderer Logic', () => {
  beforeEach(() => {
    fieldRegistry.clear()
    fieldRegistry.register({
      type: 'text',
      component: MockTextField,
    })
    fieldRegistry.register({
      type: 'select',
      component: MockSelectField,
    })
    fieldRegistry.register({
      type: 'checkbox',
      component: MockCheckboxField,
    })
  })

  afterEach(() => {
    fieldRegistry.clear()
  })

  it('should render all fields in a step correctly', () => {
    const step: FormStep = {
      id: 'step1',
      title: 'Personal Information',
      description: 'Enter your personal details',
      schema: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
      }),
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'First Name',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'Last Name',
          required: true,
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          required: true,
        },
      ],
    }

    const formInstance = createMockFormInstance({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    })

    const result = simulateStepRenderer(step, formInstance)

    expect(result.type).toBe('StepRenderer')
    expect(result.props.step).toBe(step)
    expect(result.props.formInstance).toBe(formInstance)
    expect(result.props.fields).toHaveLength(3)
    
    // Check each field is rendered with correct component
    expect(result.props.fields[0].type).toBe(MockTextField)
    expect(result.props.fields[1].type).toBe(MockTextField)
    expect(result.props.fields[2].type).toBe(MockTextField)
    
    // Check field names are correctly mapped
    expect(result.props.fields[0].props.definition.name).toBe('firstName')
    expect(result.props.fields[1].props.definition.name).toBe('lastName')
    expect(result.props.fields[2].props.definition.name).toBe('email')
  })

  it('should handle mixed field types correctly', () => {
    const step: FormStep = {
      id: 'step2',
      title: 'Preferences',
      schema: z.object({
        name: z.string(),
        country: z.string(),
        newsletter: z.boolean(),
      }),
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Name',
        },
        {
          name: 'country',
          type: 'select',
          label: 'Country',
          options: [
            { label: 'USA', value: 'us' },
            { label: 'Canada', value: 'ca' },
          ],
        },
        {
          name: 'newsletter',
          type: 'checkbox',
          label: 'Subscribe to newsletter',
        },
      ],
    }

    const formInstance = createMockFormInstance()
    const result = simulateStepRenderer(step, formInstance)

    expect(result.type).toBe('StepRenderer')
    expect(result.props.fields).toHaveLength(3)
    
    // Check each field type is correct
    expect(result.props.fields[0].type).toBe(MockTextField)
    expect(result.props.fields[1].type).toBe(MockSelectField)
    expect(result.props.fields[2].type).toBe(MockCheckboxField)
  })

  it('should pass disabled state to all fields', () => {
    const step: FormStep = {
      id: 'step1',
      title: 'Test Step',
      schema: z.object({ test: z.string() }),
      fields: [
        {
          name: 'test',
          type: 'text',
          label: 'Test Field',
        },
      ],
    }

    const formInstance = createMockFormInstance()
    const result = simulateStepRenderer(step, formInstance, true)

    expect(result.props.disabled).toBe(true)
    expect(result.props.fields[0].props.disabled).toBe(true)
  })

  it('should handle field-specific props correctly', () => {
    const step: FormStep = {
      id: 'step1',
      title: 'Test Step',
      schema: z.object({ email: z.string().email() }),
      fields: [
        {
          name: 'email',
          type: 'text',
          label: 'Email',
          fieldProps: {
            maxLength: 100,
            autoComplete: 'email',
            type: 'email',
          },
        },
      ],
    }

    const formInstance = createMockFormInstance()
    const result = simulateStepRenderer(step, formInstance)

    const emailField = result.props.fields[0]
    expect(emailField.props.maxLength).toBe(100)
    expect(emailField.props.autoComplete).toBe('email')
    expect(emailField.props.type).toBe('email')
  })

  it('should handle unknown field types with fallback', () => {
    const step: FormStep = {
      id: 'step1',
      title: 'Test Step',
      schema: z.object({ text: z.string() }),
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text Field',
        },
      ],
    }

    // Clear the registry to trigger fallback for text field
    fieldRegistry.clear()

    const formInstance = createMockFormInstance()
    const result = simulateStepRenderer(step, formInstance)

    expect(result.type).toBe('StepRenderer')
    expect(result.props.fields).toHaveLength(1)
    expect(result.props.fields[0].type).toBe('UnknownFieldFallback')
    expect(result.props.fields[0].props.definition.name).toBe('text')
  })

  it('should generate unique keys for each field', () => {
    const step: FormStep = {
      id: 'step1',
      title: 'Test Step',
      schema: z.object({ 
        field1: z.string(),
        field2: z.string(),
      }),
      fields: [
        {
          name: 'field1',
          type: 'text',
          label: 'Field 1',
        },
        {
          name: 'field2',
          type: 'text',
          label: 'Field 2',
        },
      ],
    }

    const formInstance = createMockFormInstance()
    const result = simulateStepRenderer(step, formInstance)

    const keys = result.props.fields.map((field: any) => field.props.key)
    expect(keys[0]).toBe('step1-field1-0')
    expect(keys[1]).toBe('step1-field2-1')
    
    // Check keys are unique
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('should validate step configuration before rendering', () => {
    const invalidStep: FormStep = {
      id: '', // Invalid - empty ID
      title: 'Invalid Step',
      schema: z.object({}),
      fields: [],
    }

    const formInstance = createMockFormInstance()
    const result = simulateStepRenderer(invalidStep, formInstance)

    expect(result.type).toBe('ErrorBoundary')
    expect(result.props.error).toBeDefined()
    expect(result.props.step).toBe(invalidStep)
  })

  it('should integrate with TanStack Forms field APIs correctly', () => {
    const step: FormStep = {
      id: 'step1',
      title: 'Test Step',
      schema: z.object({ test: z.string() }),
      fields: [
        {
          name: 'testField',
          type: 'text',
          label: 'Test Field',
        },
      ],
    }

    const mockFieldApi = createMockFieldApi('test value')
    const formInstance = {
      useField: vi.fn(() => mockFieldApi),
      state: { values: {}, isValid: true, isSubmitting: false, errors: [], isTouched: false },
    }

    const result = simulateStepRenderer(step, formInstance)

    // Check that useField was called with correct field name
    expect(formInstance.useField).toHaveBeenCalledWith('testField')
    
    // Check that field API is passed to field component
    expect(result.props.fields[0].props.field).toBe(mockFieldApi)
  })

  it('should handle empty fields array', () => {
    const step: FormStep = {
      id: 'empty-step',
      title: 'Empty Step',
      schema: z.object({}),
      fields: [],
    }

    const formInstance = createMockFormInstance()
    const result = simulateStepRenderer(step, formInstance)

    expect(result.type).toBe('StepRenderer')
    expect(result.props.fields).toHaveLength(0)
  })

  it('should pass custom className when provided', () => {
    const step: FormStep = {
      id: 'step1',
      title: 'Test Step',
      schema: z.object({}),
      fields: [],
    }

    const formInstance = createMockFormInstance()
    const result = simulateStepRenderer(step, formInstance, false, 'custom-class')

    expect(result.props.className).toBe('custom-class')
  })
})
