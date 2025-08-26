import { z } from 'zod'
import { validateFieldDefinition, validateStepConfiguration, ConfigValidationError } from '../config-validation'
import type { FieldDefinition, FormStep } from '../../types'

describe('Configuration Validation', () => {
  describe('validateFieldDefinition', () => {
    it('should validate a basic text field definition', () => {
      const definition: FieldDefinition = {
        name: 'firstName',
        type: 'text',
        label: 'First Name',
        required: true,
      }

      expect(() => validateFieldDefinition(definition)).not.toThrow()
    })

    it('should validate a select field with options', () => {
      const definition: FieldDefinition = {
        name: 'country',
        type: 'select',
        label: 'Country',
        options: [
          { label: 'USA', value: 'us' },
          { label: 'Canada', value: 'ca' },
        ],
      }

      expect(() => validateFieldDefinition(definition)).not.toThrow()
    })

    it('should throw error for missing required properties', () => {
      const definition = {
        type: 'text',
        label: 'Test',
      } as FieldDefinition

      expect(() => validateFieldDefinition(definition)).toThrow(ConfigValidationError)
      expect(() => validateFieldDefinition(definition)).toThrow('Field name is required')
    })

    it('should throw error for invalid field type', () => {
      const definition: FieldDefinition = {
        name: 'test',
        type: 'invalid-type' as any,
        label: 'Test',
      }

      expect(() => validateFieldDefinition(definition)).toThrow(ConfigValidationError)
      expect(() => validateFieldDefinition(definition)).toThrow('Invalid field type')
    })

    it('should throw error for select field without options', () => {
      const definition: FieldDefinition = {
        name: 'test',
        type: 'select',
        label: 'Test',
      }

      expect(() => validateFieldDefinition(definition)).toThrow(ConfigValidationError)
      expect(() => validateFieldDefinition(definition)).toThrow('Select and radio fields must have options')
    })

    it('should throw error for fieldArray without arrayItemSchema', () => {
      const definition: FieldDefinition = {
        name: 'items',
        type: 'fieldArray',
        label: 'Items',
      }

      expect(() => validateFieldDefinition(definition)).toThrow(ConfigValidationError)
      expect(() => validateFieldDefinition(definition)).toThrow('Field array must have arrayItemSchema')
    })

    it('should validate conditional display rules', () => {
      const definition: FieldDefinition = {
        name: 'conditionalField',
        type: 'text',
        label: 'Conditional Field',
        conditionalDisplay: {
          field: 'showField',
          operator: 'equals',
          value: true,
        },
      }

      expect(() => validateFieldDefinition(definition)).not.toThrow()
    })

    it('should throw error for invalid conditional operator', () => {
      const definition: FieldDefinition = {
        name: 'conditionalField',
        type: 'text',
        label: 'Conditional Field',
        conditionalDisplay: {
          field: 'showField',
          operator: 'invalid' as any,
          value: true,
        },
      }

      expect(() => validateFieldDefinition(definition)).toThrow(ConfigValidationError)
      expect(() => validateFieldDefinition(definition)).toThrow('Invalid conditional operator')
    })
  })

  describe('validateStepConfiguration', () => {
    it('should validate a complete step configuration', () => {
      const step: FormStep = {
        id: 'step1',
        title: 'Step 1',
        description: 'First step',
        schema: z.object({ name: z.string() }),
        fields: [
          {
            name: 'name',
            type: 'text',
            label: 'Name',
            required: true,
          },
        ],
      }

      expect(() => validateStepConfiguration(step)).not.toThrow()
    })

    it('should throw error for missing step ID', () => {
      const step = {
        title: 'Step 1',
        schema: z.object({}),
        fields: [],
      } as FormStep

      expect(() => validateStepConfiguration(step)).toThrow(ConfigValidationError)
      expect(() => validateStepConfiguration(step)).toThrow('Step ID is required')
    })

    it('should throw error for empty step title', () => {
      const step: FormStep = {
        id: 'step1',
        title: '',
        schema: z.object({}),
        fields: [],
      }

      expect(() => validateStepConfiguration(step)).toThrow(ConfigValidationError)
      expect(() => validateStepConfiguration(step)).toThrow('Step title cannot be empty')
    })

    it('should throw error for missing schema', () => {
      const step = {
        id: 'step1',
        title: 'Step 1',
        fields: [],
      } as FormStep

      expect(() => validateStepConfiguration(step)).toThrow(ConfigValidationError)
      expect(() => validateStepConfiguration(step)).toThrow('Step schema is required')
    })

    it('should validate all field definitions in the step', () => {
      const step: FormStep = {
        id: 'step1',
        title: 'Step 1',
        schema: z.object({}),
        fields: [
          {
            name: 'validField',
            type: 'text',
            label: 'Valid Field',
          },
          {
            name: 'invalidField',
            type: 'select',
            label: 'Invalid Select Field',
            // Missing options for select field
          },
        ],
      }

      expect(() => validateStepConfiguration(step)).toThrow(ConfigValidationError)
      expect(() => validateStepConfiguration(step)).toThrow('Select and radio fields must have options')
    })

    it('should throw error for duplicate field names in step', () => {
      const step: FormStep = {
        id: 'step1',
        title: 'Step 1',
        schema: z.object({}),
        fields: [
          {
            name: 'duplicateName',
            type: 'text',
            label: 'Field 1',
          },
          {
            name: 'duplicateName',
            type: 'text',
            label: 'Field 2',
          },
        ],
      }

      expect(() => validateStepConfiguration(step)).toThrow(ConfigValidationError)
      expect(() => validateStepConfiguration(step)).toThrow('Duplicate field name: duplicateName')
    })
  })

  describe('ConfigValidationError', () => {
    it('should create error with field path', () => {
      const error = new ConfigValidationError('Test error', 'step1.field1')
      
      expect(error.message).toBe('Test error')
      expect(error.fieldPath).toBe('step1.field1')
      expect(error.name).toBe('ConfigValidationError')
    })

    it('should create error without field path', () => {
      const error = new ConfigValidationError('Test error')
      
      expect(error.message).toBe('Test error')
      expect(error.fieldPath).toBeUndefined()
    })
  })
})
