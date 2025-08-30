import { describe, expect, it } from 'vitest'
import { 
  type BusinessModelData, 
  businessModelSchema, 
  type SubsidiaryData, 
  subsidiarySchema 
} from '../schema'

describe('Subsidiary Schema', () => {
  const validSubsidiary: SubsidiaryData = {
    name: 'ACME Subsidiary AS',
    organizationNumber: '987654321',
    address: '123 Main Street, Oslo, Norway',
  }

  it('should validate valid subsidiary data', () => {
    const result = subsidiarySchema.safeParse(validSubsidiary)
    expect(result.success).toBe(true)
  })

  it('should reject short subsidiary name', () => {
    const invalidData = { ...validSubsidiary, name: 'A' }
    const result = subsidiarySchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Subsidiary name must be at least 2 characters')
    }
  })

  it('should reject invalid organization number', () => {
    const invalidData = { ...validSubsidiary, organizationNumber: '123' }
    const result = subsidiarySchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Organization number must be valid')
    }
  })

  it('should reject short address', () => {
    const invalidData = { ...validSubsidiary, address: '123' }
    const result = subsidiarySchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Address must be at least 5 characters')
    }
  })
})

describe('Business Model Schema', () => {
  const validBusinessModelData: BusinessModelData = {
    businessModelDescription:
      'We provide software solutions for sustainability reporting and compliance management.',
    reportBasis: 'individual',
  }

  const validConsolidatedData: BusinessModelData = {
    businessModelDescription:
      'Global technology company with multiple subsidiaries providing integrated solutions.',
    reportBasis: 'consolidated',
    subsidiaries: [
      {
        name: 'ACME Subsidiary AS',
        organizationNumber: '987654321',
        address: '123 Main Street, Oslo, Norway',
      },
    ],
  }

  it('should validate individual business model', () => {
    const result = businessModelSchema.safeParse(validBusinessModelData)
    expect(result.success).toBe(true)
  })

  it('should validate consolidated business model with subsidiaries', () => {
    const result = businessModelSchema.safeParse(validConsolidatedData)
    expect(result.success).toBe(true)
  })

  it('should apply default value for reportBasis', () => {
    const dataWithoutBasis = {
      businessModelDescription: 'Software company providing sustainability solutions.',
    }
    const result = businessModelSchema.safeParse(dataWithoutBasis)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.reportBasis).toBe('individual')
    }
  })

  it('should reject consolidated reporting without subsidiaries', () => {
    const invalidData = {
      ...validBusinessModelData,
      reportBasis: 'consolidated' as const,
    }
    const result = businessModelSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'At least one subsidiary is required when reporting on consolidated basis'
      )
    }
  })

  it('should reject consolidated reporting with empty subsidiaries array', () => {
    const invalidData = {
      ...validBusinessModelData,
      reportBasis: 'consolidated' as const,
      subsidiaries: [],
    }
    const result = businessModelSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'At least one subsidiary is required when reporting on consolidated basis'
      )
    }
  })

  it('should reject short business model description', () => {
    const invalidData = { ...validBusinessModelData, businessModelDescription: 'Too short' }
    const result = businessModelSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Please provide a business model description of at least 10 characters'
      )
    }
  })

  it('should reject invalid report basis', () => {
    const invalidData = { ...validBusinessModelData, reportBasis: 'invalid' as any }
    const result = businessModelSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Please specify if the report is individual or consolidated'
      )
    }
  })
})