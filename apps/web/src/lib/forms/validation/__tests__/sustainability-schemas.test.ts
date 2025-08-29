import { describe, expect, it } from 'vitest'
import {
  initiativeTypeSchema,
  sustainabilityInitiativeSchema,
  sustainabilityInitiativesSchema,
  sustainabilityInitiativesStepSchema,
} from '../sustainability-schemas'

describe('Sustainability Schemas', () => {
  describe('initiativeTypeSchema', () => {
    it('validates valid initiative types', () => {
      const validTypes = [
        'Workforce Development',
        'Biodiversity',
        'Climate Change',
        'Business Ethics',
        'Circular Economy',
        'Community Impact',
        'Marine Resources',
        'Stakeholder Engagement',
      ]

      validTypes.forEach((type) => {
        expect(initiativeTypeSchema.parse(type)).toBe(type)
      })
    })

    it('rejects invalid initiative types', () => {
      expect(() => initiativeTypeSchema.parse('Invalid Type')).toThrow()
    })
  })

  describe('sustainabilityInitiativeSchema', () => {
    const validInitiative = {
      type: 'Climate Change',
      responsiblePerson: 'John Doe',
      goal: 'Reduce carbon emissions by 2030',
      description: 'Implement comprehensive carbon reduction strategies across all operations',
      isSelected: true,
    }

    it('validates valid initiative data', () => {
      expect(() => sustainabilityInitiativeSchema.parse(validInitiative)).not.toThrow()
    })

    it('rejects initiative with missing type', () => {
      const invalidInitiative = { ...validInitiative, type: undefined }
      expect(() => sustainabilityInitiativeSchema.parse(invalidInitiative)).toThrow()
    })

    it('rejects initiative with empty responsible person', () => {
      const invalidInitiative = { ...validInitiative, responsiblePerson: '' }
      expect(() => sustainabilityInitiativeSchema.parse(invalidInitiative)).toThrow()
    })

    it('rejects initiative with short responsible person name', () => {
      const invalidInitiative = { ...validInitiative, responsiblePerson: 'A' }
      expect(() => sustainabilityInitiativeSchema.parse(invalidInitiative)).toThrow()
    })

    it('rejects initiative with short goal', () => {
      const invalidInitiative = { ...validInitiative, goal: 'Too short' }
      expect(() => sustainabilityInitiativeSchema.parse(invalidInitiative)).toThrow()
    })

    it('rejects initiative with short description', () => {
      const invalidInitiative = { ...validInitiative, description: 'Too short' }
      expect(() => sustainabilityInitiativeSchema.parse(invalidInitiative)).toThrow()
    })

    it('rejects initiative with missing isSelected', () => {
      const { isSelected, ...invalidInitiative } = validInitiative
      expect(() => sustainabilityInitiativeSchema.parse(invalidInitiative)).toThrow()
    })
  })

  describe('sustainabilityInitiativesSchema', () => {
    const validInitiatives = [
      {
        type: 'Climate Change',
        responsiblePerson: 'John Doe',
        goal: 'Reduce carbon emissions by 2030',
        description: 'Implement comprehensive carbon reduction strategies across all operations',
        isSelected: true,
      },
      {
        type: 'Biodiversity',
        responsiblePerson: 'Jane Smith',
        goal: 'Protect local ecosystems',
        description: 'Conservation efforts in our area',
        isSelected: true,
      },
    ]

    it('validates valid initiatives array', () => {
      expect(() => sustainabilityInitiativesSchema.parse(validInitiatives)).not.toThrow()
    })

    it('allows empty initiatives array', () => {
      expect(() => sustainabilityInitiativesSchema.parse([])).not.toThrow()
    })

    it('rejects invalid initiatives in array', () => {
      const invalidInitiatives = [
        ...validInitiatives,
        {
          type: 'Invalid Type',
          responsiblePerson: 'Invalid',
          goal: 'Too short',
          description: 'Too short',
          isSelected: true,
        },
      ]

      expect(() => sustainabilityInitiativesSchema.parse(invalidInitiatives)).toThrow()
    })
  })

  describe('sustainabilityInitiativesStepSchema', () => {
    const validStepData = {
      initiatives: [
        {
          type: 'Climate Change',
          responsiblePerson: 'John Doe',
          goal: 'Reduce carbon emissions by 2030',
          description: 'Implement comprehensive carbon reduction strategies across all operations',
          isSelected: true,
        },
      ],
    }

    it('validates valid step data', () => {
      expect(() => sustainabilityInitiativesStepSchema.parse(validStepData)).not.toThrow()
    })

    it('allows empty initiatives array', () => {
      const emptyStepData = { initiatives: [] }
      expect(() => sustainabilityInitiativesStepSchema.parse(emptyStepData)).not.toThrow()
    })

    it('rejects missing initiatives field', () => {
      const invalidStepData = {}
      expect(() => sustainabilityInitiativesStepSchema.parse(invalidStepData)).toThrow()
    })
  })
})
