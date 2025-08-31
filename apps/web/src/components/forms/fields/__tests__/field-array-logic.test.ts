import { describe, expect, it } from 'vitest'
import { z } from 'zod'

// Test the subsidiary schema validation
const subsidiarySchema = z.object({
  name: z.string().min(1, 'Subsidiary name is required'),
  organizationNumber: z.string().min(1, 'Organization number is required'),
  address: z.string().min(1, 'Address is required'),
})

describe('FieldArray Logic Tests', () => {
  describe('Subsidiary Schema Validation', () => {
    it('should validate valid subsidiary data', () => {
      const validData = {
        name: 'Test Subsidiary',
        organizationNumber: '123456789',
        address: '123 Test Street, Test City',
      }

      const result = subsidiarySchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('should reject subsidiary data with missing name', () => {
      const invalidData = {
        name: '',
        organizationNumber: '123456789',
        address: '123 Test Street, Test City',
      }

      const result = subsidiarySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Subsidiary name is required'
        )
      }
    })

    it('should reject subsidiary data with missing organization number', () => {
      const invalidData = {
        name: 'Test Subsidiary',
        organizationNumber: '',
        address: '123 Test Street, Test City',
      }

      const result = subsidiarySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Organization number is required'
        )
      }
    })

    it('should reject subsidiary data with missing address', () => {
      const invalidData = {
        name: 'Test Subsidiary',
        organizationNumber: '123456789',
        address: '',
      }

      const result = subsidiarySchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Address is required')
      }
    })
  })

  describe('Array Operations Logic', () => {
    it('should handle adding items to array', () => {
      const items: Array<{
        name: string
        organizationNumber: string
        address: string
      }> = []
      const newItem = { name: '', organizationNumber: '', address: '' }

      const updatedItems = [...items, newItem]

      expect(updatedItems).toHaveLength(1)
      expect(updatedItems[0]).toEqual(newItem)
    })

    it('should handle removing items from array', () => {
      const items = [
        { name: 'Sub 1', organizationNumber: '123', address: 'Address 1' },
        { name: 'Sub 2', organizationNumber: '456', address: 'Address 2' },
        { name: 'Sub 3', organizationNumber: '789', address: 'Address 3' },
      ]

      const indexToRemove = 1
      const updatedItems = items.filter((_, index) => index !== indexToRemove)

      expect(updatedItems).toHaveLength(2)
      expect(updatedItems[0].name).toBe('Sub 1')
      expect(updatedItems[1].name).toBe('Sub 3')
    })

    it('should handle updating items in array', () => {
      const items = [
        { name: 'Sub 1', organizationNumber: '123', address: 'Address 1' },
        { name: 'Sub 2', organizationNumber: '456', address: 'Address 2' },
      ]

      const indexToUpdate = 0
      const updateData = { name: 'Updated Sub 1' }

      const updatedItems = [...items]
      updatedItems[indexToUpdate] = {
        ...updatedItems[indexToUpdate],
        ...updateData,
      }

      expect(updatedItems[0].name).toBe('Updated Sub 1')
      expect(updatedItems[0].organizationNumber).toBe('123') // Should preserve other fields
      expect(updatedItems[1]).toEqual(items[1]) // Should not affect other items
    })

    it('should respect maxItems limit', () => {
      const maxItems = 3
      const items = [
        { name: 'Sub 1', organizationNumber: '123', address: 'Address 1' },
        { name: 'Sub 2', organizationNumber: '456', address: 'Address 2' },
        { name: 'Sub 3', organizationNumber: '789', address: 'Address 3' },
      ]

      const canAdd = items.length < maxItems
      expect(canAdd).toBe(false)
    })

    it('should respect minItems limit', () => {
      const minItems = 1
      const items = [
        { name: 'Sub 1', organizationNumber: '123', address: 'Address 1' },
      ]

      const canRemove = items.length > minItems
      expect(canRemove).toBe(false)
    })
  })

  describe('Error Message Extraction', () => {
    it('should extract string error messages', () => {
      const error = 'This is an error message'
      const message = typeof error === 'string' ? error : 'Validation error'
      expect(message).toBe('This is an error message')
    })

    it('should handle object error messages', () => {
      const error = { message: 'Object error message' }
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Validation error'
      expect(message).toBe('Object error message')
    })

    it('should provide fallback for unknown error types', () => {
      const error = null
      const message = typeof error === 'string' ? error : 'Validation error'
      expect(message).toBe('Validation error')
    })
  })
})
