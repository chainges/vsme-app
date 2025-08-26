import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { vi } from 'vitest'
import { fieldRegistry } from '@/lib/forms/field-registry'
import type { FieldDefinition, FieldTypeRenderer } from '@/lib/forms/types/field-types'

// Mock field components
const MockTextField = () => ({ type: 'TextField' })
const MockSelectField = () => ({ type: 'SelectField' })
const MockCheckboxField = () => ({ type: 'CheckboxField' })
const MockTextareaField = () => ({ type: 'TextareaField' })

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

describe('Field Registry Integration', () => {
  beforeEach(() => {
    fieldRegistry.clear()
  })

  afterEach(() => {
    fieldRegistry.clear()
  })

  it('should register field components correctly', () => {
    const renderer: FieldTypeRenderer = {
      type: 'text',
      component: MockTextField,
    }

    fieldRegistry.register(renderer)

    expect(fieldRegistry.get('text')).toBe(renderer)
    expect(fieldRegistry.has('text')).toBe(true)
  })

  it('should return undefined for unregistered field types', () => {
    expect(fieldRegistry.get('unknown' as any)).toBeUndefined()
    expect(fieldRegistry.has('unknown' as any)).toBe(false)
  })

  it('should clear all registered components', () => {
    fieldRegistry.register({ type: 'text', component: MockTextField })
    fieldRegistry.register({ type: 'select', component: MockSelectField })

    expect(fieldRegistry.has('text')).toBe(true)
    expect(fieldRegistry.has('select')).toBe(true)

    fieldRegistry.clear()

    expect(fieldRegistry.has('text')).toBe(false)
    expect(fieldRegistry.has('select')).toBe(false)
  })
})

// Simulate the FieldRenderer logic for testing
function simulateFieldRenderer(definition: FieldDefinition, fieldApi: any, disabled = false, className?: string) {
  const fieldRenderer = fieldRegistry.get(definition.type)
  
  if (!fieldRenderer) {
    return {
      type: 'UnknownFieldFallback',
      props: {
        definition,
        className,
      },
    }
  }

  const fieldProps = {
    field: fieldApi,
    definition,
    disabled,
    className,
    ...definition.fieldProps,
  }

  return {
    type: fieldRenderer.component,
    props: fieldProps,
  }
}


describe('FieldRenderer Logic', () => {
  beforeEach(() => {
    // Clear and set up field registry for tests
    fieldRegistry.clear()
    fieldRegistry.register({
      type: 'text',
      component: MockTextField,
    })
    fieldRegistry.register({
      type: 'email',
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

  it('should map text field definitions to correct component', () => {
    const fieldApi = createMockFieldApi('')
    const definition: FieldDefinition = {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true,
    }

    const result = simulateFieldRenderer(definition, fieldApi)

    expect(result.type).toBe(MockTextField)
    expect(result.props).toEqual({
      field: fieldApi,
      definition,
      disabled: false,
      className: undefined,
    })
  })

  it('should map select field definitions to correct component', () => {
    const fieldApi = createMockFieldApi('')
    const definition: FieldDefinition = {
      name: 'country',
      type: 'select',
      label: 'Country',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
      ],
    }

    const result = simulateFieldRenderer(definition, fieldApi)

    expect(result.type).toBe(MockSelectField)
    expect(result.props.definition).toBe(definition)
    expect(result.props.field).toBe(fieldApi)
  })

  it('should map checkbox field definitions to correct component', () => {
    const fieldApi = createMockFieldApi(false)
    const definition: FieldDefinition = {
      name: 'agreeToTerms',
      type: 'checkbox',
      label: 'I agree to the terms and conditions',
    }

    const result = simulateFieldRenderer(definition, fieldApi)

    expect(result.type).toBe(MockCheckboxField)
    expect(result.props.definition).toBe(definition)
    expect(result.props.field).toBe(fieldApi)
  })

  it('should pass disabled prop to field components', () => {
    const fieldApi = createMockFieldApi('')
    const definition: FieldDefinition = {
      name: 'testField',
      type: 'text',
      label: 'Test Field',
    }

    const result = simulateFieldRenderer(definition, fieldApi, true)

    expect(result.props.disabled).toBe(true)
  })

  it('should return fallback for unknown field types', () => {
    const fieldApi = createMockFieldApi('')
    const definition: FieldDefinition = {
      name: 'unknownField',
      type: 'unknown-type' as any,
      label: 'Unknown Field',
    }

    const result = simulateFieldRenderer(definition, fieldApi)

    expect(result.type).toBe('UnknownFieldFallback')
    expect(result.props.definition).toBe(definition)
  })

  it('should pass field-specific props from definition.fieldProps', () => {
    const fieldApi = createMockFieldApi('')
    const definition: FieldDefinition = {
      name: 'testField',
      type: 'text',
      label: 'Test Field',
      fieldProps: {
        maxLength: 50,
        autoComplete: 'name',
      },
    }

    const result = simulateFieldRenderer(definition, fieldApi)

    expect(result.props.maxLength).toBe(50)
    expect(result.props.autoComplete).toBe('name')
  })

  it('should pass fieldApi with validation state', () => {
    const fieldApi = createMockFieldApi('')
    fieldApi.state.meta.errors = ['Invalid email format']

    const definition: FieldDefinition = {
      name: 'email',
      type: 'text',
      label: 'Email',
      required: true,
    }

    const result = simulateFieldRenderer(definition, fieldApi)

    expect(result.props.field.state.meta.errors).toContain('Invalid email format')
  })

  it('should pass custom className when provided', () => {
    const fieldApi = createMockFieldApi('')
    const definition: FieldDefinition = {
      name: 'testField',
      type: 'text',
      label: 'Test Field',
    }

    const result = simulateFieldRenderer(definition, fieldApi, false, 'custom-class')

    expect(result.props.className).toBe('custom-class')
  })

  it('should retrieve correct component from field registry', () => {
    const fieldApi = createMockFieldApi('')
    const definition: FieldDefinition = {
      name: 'testField',
      type: 'text',
      label: 'Test Field',
    }

    // Test that field registry lookup works correctly
    expect(fieldRegistry.get('text')).toEqual({
      type: 'text',
      component: MockTextField,
    })

    const result = simulateFieldRenderer(definition, fieldApi)
    expect(result.type).toBe(MockTextField)
  })

  it('should handle field registry lookup for different field types', () => {
    const fieldApi = createMockFieldApi('')
    
    // Test text field
    let definition: FieldDefinition = { name: 'test', type: 'text', label: 'Test' }
    let result = simulateFieldRenderer(definition, fieldApi)
    expect(result.type).toBe(MockTextField)

    // Test select field
    definition = { name: 'test', type: 'select', label: 'Test', options: [] }
    result = simulateFieldRenderer(definition, fieldApi)
    expect(result.type).toBe(MockSelectField)

    // Test checkbox field
    definition = { name: 'test', type: 'checkbox', label: 'Test' }
    result = simulateFieldRenderer(definition, fieldApi)
    expect(result.type).toBe(MockCheckboxField)
  })
})
