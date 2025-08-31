import { describe, expect, it } from 'vitest'

/**
 * Evaluates a conditional rule against form data
 * This is extracted from ConditionalGroup for unit testing
 */
function evaluateCondition(
  condition: {
    field: string
    operator:
      | 'equals'
      | 'notEquals'
      | 'contains'
      | 'notContains'
      | 'greaterThan'
      | 'lessThan'
    value: unknown
  },
  formData: unknown
): boolean {
  if (!formData || typeof formData !== 'object') {
    return false
  }

  const data = formData as Record<string, unknown>

  // Navigate to nested field using dot notation (e.g., "businessModel.hasSubsidiaries")
  const fieldValue = condition.field.split('.').reduce((obj, key) => {
    return obj && typeof obj === 'object'
      ? (obj as Record<string, unknown>)[key]
      : undefined
  }, data)

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value
    case 'notEquals':
      return fieldValue !== condition.value
    case 'contains':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value)
      }
      if (
        typeof fieldValue === 'string' &&
        typeof condition.value === 'string'
      ) {
        return fieldValue.includes(condition.value)
      }
      return false
    case 'notContains':
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(condition.value)
      }
      if (
        typeof fieldValue === 'string' &&
        typeof condition.value === 'string'
      ) {
        return !fieldValue.includes(condition.value)
      }
      return true
    case 'greaterThan':
      return typeof fieldValue === 'number' &&
        typeof condition.value === 'number'
        ? fieldValue > condition.value
        : false
    case 'lessThan':
      return typeof fieldValue === 'number' &&
        typeof condition.value === 'number'
        ? fieldValue < condition.value
        : false
    default:
      return false
  }
}

describe('Conditional Logic', () => {
  const mockFormData = {
    businessModel: {
      hasSubsidiaries: true,
      subsidiaries: [{ name: 'Sub 1' }, { name: 'Sub 2' }],
    },
    organization: {
      employeeCount: 100,
      contact: {
        email: 'test@example.com',
      },
    },
    selectedItems: ['item1', 'item2', 'item3'],
    description: 'This is about sustainability initiatives',
  }

  describe('equals operator', () => {
    it('should return true when values are equal', () => {
      const condition = {
        field: 'businessModel.hasSubsidiaries',
        operator: 'equals' as const,
        value: true,
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(true)
    })

    it('should return false when values are not equal', () => {
      const condition = {
        field: 'businessModel.hasSubsidiaries',
        operator: 'equals' as const,
        value: false,
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(false)
    })
  })

  describe('notEquals operator', () => {
    it('should return true when values are not equal', () => {
      const condition = {
        field: 'businessModel.hasSubsidiaries',
        operator: 'notEquals' as const,
        value: false,
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(true)
    })

    it('should return false when values are equal', () => {
      const condition = {
        field: 'businessModel.hasSubsidiaries',
        operator: 'notEquals' as const,
        value: true,
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(false)
    })
  })

  describe('contains operator', () => {
    it('should return true when array contains value', () => {
      const condition = {
        field: 'selectedItems',
        operator: 'contains' as const,
        value: 'item2',
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(true)
    })

    it('should return false when array does not contain value', () => {
      const condition = {
        field: 'selectedItems',
        operator: 'contains' as const,
        value: 'item4',
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(false)
    })

    it('should return true when string contains substring', () => {
      const condition = {
        field: 'description',
        operator: 'contains' as const,
        value: 'sustainability',
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(true)
    })

    it('should return false when string does not contain substring', () => {
      const condition = {
        field: 'description',
        operator: 'contains' as const,
        value: 'nonexistent',
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(false)
    })
  })

  describe('notContains operator', () => {
    it('should return false when array contains value', () => {
      const condition = {
        field: 'selectedItems',
        operator: 'notContains' as const,
        value: 'item2',
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(false)
    })

    it('should return true when array does not contain value', () => {
      const condition = {
        field: 'selectedItems',
        operator: 'notContains' as const,
        value: 'item4',
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(true)
    })
  })

  describe('greaterThan operator', () => {
    it('should return true when field value is greater than condition value', () => {
      const condition = {
        field: 'organization.employeeCount',
        operator: 'greaterThan' as const,
        value: 50,
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(true)
    })

    it('should return false when field value is less than condition value', () => {
      const condition = {
        field: 'organization.employeeCount',
        operator: 'greaterThan' as const,
        value: 150,
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(false)
    })

    it('should return false when field value is not a number', () => {
      const condition = {
        field: 'description',
        operator: 'greaterThan' as const,
        value: 50,
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(false)
    })
  })

  describe('lessThan operator', () => {
    it('should return true when field value is less than condition value', () => {
      const condition = {
        field: 'organization.employeeCount',
        operator: 'lessThan' as const,
        value: 150,
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(true)
    })

    it('should return false when field value is greater than condition value', () => {
      const condition = {
        field: 'organization.employeeCount',
        operator: 'lessThan' as const,
        value: 50,
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(false)
    })
  })

  describe('nested field paths', () => {
    it('should handle deeply nested field paths', () => {
      const condition = {
        field: 'organization.contact.email',
        operator: 'equals' as const,
        value: 'test@example.com',
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(true)
    })

    it('should return false for non-existent nested paths', () => {
      const condition = {
        field: 'nonexistent.nested.field',
        operator: 'equals' as const,
        value: true,
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should return false for null form data', () => {
      const condition = {
        field: 'businessModel.hasSubsidiaries',
        operator: 'equals' as const,
        value: true,
      }

      expect(evaluateCondition(condition, null)).toBe(false)
    })

    it('should return false for undefined form data', () => {
      const condition = {
        field: 'businessModel.hasSubsidiaries',
        operator: 'equals' as const,
        value: true,
      }

      expect(evaluateCondition(condition, undefined)).toBe(false)
    })

    it('should return false for non-object form data', () => {
      const condition = {
        field: 'businessModel.hasSubsidiaries',
        operator: 'equals' as const,
        value: true,
      }

      expect(evaluateCondition(condition, 'not an object')).toBe(false)
    })

    it('should handle array index access', () => {
      const condition = {
        field: 'businessModel.subsidiaries.0.name',
        operator: 'equals' as const,
        value: 'Sub 1',
      }

      expect(evaluateCondition(condition, mockFormData)).toBe(true)
    })
  })
})
