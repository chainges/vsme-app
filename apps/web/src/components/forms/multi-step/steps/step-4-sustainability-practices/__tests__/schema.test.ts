import { describe, expect, it } from 'vitest'
import { type SustainabilityData, sustainabilitySchema } from '../schema'

describe('Sustainability Schema', () => {
  const validSustainabilityData: SustainabilityData = {
    hasPracticesPolicies: true,
    sustainabilityCertifications: 'ISO 14001, B Corp Certification',
    practicesDescription:
      'We have implemented comprehensive sustainability practices including energy efficiency measures.',
  }

  it('should validate valid sustainability data', () => {
    const result = sustainabilitySchema.safeParse(validSustainabilityData)
    expect(result.success).toBe(true)
  })

  it('should validate minimal sustainability data', () => {
    const minimalData = {
      hasPracticesPolicies: false,
    }
    const result = sustainabilitySchema.safeParse(minimalData)
    expect(result.success).toBe(true)
  })

  it('should allow undefined optional fields', () => {
    const dataWithUndefined = {
      hasPracticesPolicies: true,
      sustainabilityCertifications: undefined,
      practicesDescription: undefined,
    }
    const result = sustainabilitySchema.safeParse(dataWithUndefined)
    expect(result.success).toBe(true)
  })

  it('should reject practices description that is too short', () => {
    const invalidData = {
      ...validSustainabilityData,
      practicesDescription: 'Too short',
    }
    const result = sustainabilitySchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Please provide a description of at least 10 characters'
      )
    }
  })

  it('should validate boolean hasPracticesPolicies', () => {
    const trueBooleanData = { ...validSustainabilityData, hasPracticesPolicies: true }
    const falseBooleanData = { ...validSustainabilityData, hasPracticesPolicies: false }

    expect(sustainabilitySchema.safeParse(trueBooleanData).success).toBe(true)
    expect(sustainabilitySchema.safeParse(falseBooleanData).success).toBe(true)
  })
})
