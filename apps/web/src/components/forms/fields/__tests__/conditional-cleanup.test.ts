import { describe, expect, it } from 'vitest'
import { cleanupConditionalData } from '../ConditionalGroup'

describe('Conditional Data Cleanup', () => {
  const mockFormData = {
    businessModel: {
      hasSubsidiaries: true,
      subsidiaries: [
        { name: 'Sub 1', organizationNumber: '123', address: 'Address 1' },
        { name: 'Sub 2', organizationNumber: '456', address: 'Address 2' },
      ],
    },
    sustainability: {
      initiatives: [
        {
          type: 'ClimateAction',
          selected: true,
          description: 'Climate initiative',
        },
        { type: 'WasteReduction', selected: false, description: '' },
      ],
    },
    organization: {
      employeeCount: 100,
      revenue: 1_000_000,
    },
  }

  it('should clean up array fields by setting them to empty arrays', () => {
    const fieldsToClean = ['businessModel.subsidiaries']
    const result = cleanupConditionalData(mockFormData, fieldsToClean)

    expect(result.businessModel.subsidiaries).toEqual([])
    // Other fields should remain unchanged
    expect(result.businessModel.hasSubsidiaries).toBe(true)
    expect(result.sustainability.initiatives).toEqual(
      mockFormData.sustainability.initiatives
    )
  })

  it('should clean up boolean fields by setting them to false', () => {
    const fieldsToClean = ['businessModel.hasSubsidiaries']
    const result = cleanupConditionalData(mockFormData, fieldsToClean)

    expect(result.businessModel.hasSubsidiaries).toBe(false)
    // Other fields should remain unchanged
    expect(result.businessModel.subsidiaries).toEqual(
      mockFormData.businessModel.subsidiaries
    )
  })

  it('should clean up number fields by setting them to 0', () => {
    const fieldsToClean = ['organization.employeeCount', 'organization.revenue']
    const result = cleanupConditionalData(mockFormData, fieldsToClean)

    expect(result.organization.employeeCount).toBe(0)
    expect(result.organization.revenue).toBe(0)
  })

  it('should clean up string fields by setting them to empty strings', () => {
    const fieldsToClean = ['sustainability.initiatives.0.description']
    const result = cleanupConditionalData(mockFormData, fieldsToClean)

    expect(result.sustainability.initiatives[0].description).toBe('')
    // Other fields should remain unchanged
    expect(result.sustainability.initiatives[0].type).toBe('ClimateAction')
    expect(result.sustainability.initiatives[0].selected).toBe(true)
  })

  it('should handle multiple fields to clean', () => {
    const fieldsToClean = [
      'businessModel.subsidiaries',
      'businessModel.hasSubsidiaries',
      'organization.employeeCount',
    ]
    const result = cleanupConditionalData(mockFormData, fieldsToClean)

    expect(result.businessModel.subsidiaries).toEqual([])
    expect(result.businessModel.hasSubsidiaries).toBe(false)
    expect(result.organization.employeeCount).toBe(0)
    // Other fields should remain unchanged
    expect(result.organization.revenue).toBe(1_000_000)
    expect(result.sustainability.initiatives).toEqual(
      mockFormData.sustainability.initiatives
    )
  })

  it('should handle non-existent field paths gracefully', () => {
    const fieldsToClean = [
      'nonexistent.field',
      'businessModel.nonexistent',
      'businessModel.subsidiaries.nonexistent',
    ]
    const result = cleanupConditionalData(mockFormData, fieldsToClean)

    // Should return the original data unchanged
    expect(result).toEqual(mockFormData)
  })

  it('should not mutate the original form data', () => {
    const originalData = JSON.parse(JSON.stringify(mockFormData))
    const fieldsToClean = [
      'businessModel.subsidiaries',
      'businessModel.hasSubsidiaries',
    ]

    cleanupConditionalData(mockFormData, fieldsToClean)

    // Original data should remain unchanged
    expect(mockFormData).toEqual(originalData)
  })

  it('should handle deeply nested field paths', () => {
    const deepData = {
      level1: {
        level2: {
          level3: {
            value: 'deep value',
            number: 42,
            array: [1, 2, 3],
            boolean: true,
          },
        },
      },
    }

    const fieldsToClean = [
      'level1.level2.level3.value',
      'level1.level2.level3.number',
      'level1.level2.level3.array',
      'level1.level2.level3.boolean',
    ]

    const result = cleanupConditionalData(deepData, fieldsToClean)

    expect(result.level1.level2.level3.value).toBe('')
    expect(result.level1.level2.level3.number).toBe(0)
    expect(result.level1.level2.level3.array).toEqual([])
    expect(result.level1.level2.level3.boolean).toBe(false)
  })

  it('should handle empty fields to clean array', () => {
    const result = cleanupConditionalData(mockFormData, [])

    // Should return the original data unchanged
    expect(result).toEqual(mockFormData)
  })

  it('should handle array index access in field paths', () => {
    const fieldsToClean = [
      'sustainability.initiatives.0.description',
      'sustainability.initiatives.1.description',
    ]
    const result = cleanupConditionalData(mockFormData, fieldsToClean)

    expect(result.sustainability.initiatives[0].description).toBe('')
    expect(result.sustainability.initiatives[1].description).toBe('')
    // Other properties should remain unchanged
    expect(result.sustainability.initiatives[0].type).toBe('ClimateAction')
    expect(result.sustainability.initiatives[0].selected).toBe(true)
    expect(result.sustainability.initiatives[1].type).toBe('WasteReduction')
    expect(result.sustainability.initiatives[1].selected).toBe(false)
  })
})
