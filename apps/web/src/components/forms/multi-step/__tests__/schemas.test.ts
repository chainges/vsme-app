import { describe, expect, it } from 'vitest'
// Import company info from new location
import { type CompanyInfoData, companyInfoSchema } from '../steps/step-1-company-info/schema'
// Import sustainability from new location
import {
  type SustainabilityData,
  sustainabilitySchema,
} from '../steps/step-4-sustainability-practices/schema'
import { type FormData, formSchema } from '../types'

describe('Company Info Schema', () => {
  const validCompanyData: CompanyInfoData = {
    organizationName: 'ACME Corporation AS',
    organizationNumber: '123456789',
    website: 'https://www.acme.com',
    contactPersonName: 'John Smith',
    contactPersonEmail: 'john.smith@acme.com',
    legalForm: 'as',
    naceCode: '62.010',
    balanceSheetSize: 1_000_000,
    turnover: 5_000_000,
    numberOfEmployees: 50,
    country: 'norway',
  }

  it('should validate valid company info data', () => {
    const result = companyInfoSchema.safeParse(validCompanyData)
    expect(result.success).toBe(true)
  })

  it('should allow empty website', () => {
    const dataWithEmptyWebsite = { ...validCompanyData, website: '' }
    const result = companyInfoSchema.safeParse(dataWithEmptyWebsite)
    expect(result.success).toBe(true)
  })

  it('should allow undefined website', () => {
    const dataWithoutWebsite = {
      ...validCompanyData,
      organizationName: validCompanyData.organizationName,
      organizationNumber: validCompanyData.organizationNumber,
      contactPersonName: validCompanyData.contactPersonName,
      contactPersonEmail: validCompanyData.contactPersonEmail,
      legalForm: validCompanyData.legalForm,
      naceCode: validCompanyData.naceCode,
      balanceSheetSize: validCompanyData.balanceSheetSize,
      turnover: validCompanyData.turnover,
      numberOfEmployees: validCompanyData.numberOfEmployees,
      country: validCompanyData.country,
    }
    const result = companyInfoSchema.safeParse(dataWithoutWebsite)
    expect(result.success).toBe(true)
  })

  it('should reject invalid organization name', () => {
    const invalidData = { ...validCompanyData, organizationName: 'A' }
    const result = companyInfoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Organization name must be at least 2 characters')
    }
  })

  it('should reject invalid organization number', () => {
    const invalidData = { ...validCompanyData, organizationNumber: '12345' }
    const result = companyInfoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Organization number must be valid')
    }
  })

  it('should reject invalid website URL', () => {
    const invalidData = { ...validCompanyData, website: 'not-a-url' }
    const result = companyInfoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid website URL')
    }
  })

  it('should reject invalid email', () => {
    const invalidData = { ...validCompanyData, contactPersonEmail: 'not-an-email' }
    const result = companyInfoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address')
    }
  })

  it('should reject invalid NACE code', () => {
    const invalidData = { ...validCompanyData, naceCode: '62' }
    const result = companyInfoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('NACE code is required - xx.xxx')
    }
  })

  it('should coerce string numbers to numbers', () => {
    const dataWithStringNumbers = {
      ...validCompanyData,
      balanceSheetSize: '1000000' as any,
      turnover: '5000000' as any,
      numberOfEmployees: '50' as any,
    }
    const result = companyInfoSchema.safeParse(dataWithStringNumbers)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(typeof result.data.balanceSheetSize).toBe('number')
      expect(typeof result.data.turnover).toBe('number')
      expect(typeof result.data.numberOfEmployees).toBe('number')
    }
  })

  it('should reject zero or negative numbers', () => {
    const invalidData = { ...validCompanyData, numberOfEmployees: 0 }
    const result = companyInfoSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Number of employees must be at least 1')
    }
  })
})

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

describe('Combined Form Schema', () => {
  const validFormData: FormData = {
    // Company Info
    organizationName: 'ACME Corporation AS',
    organizationNumber: '123456789',
    website: 'https://www.acme.com',
    contactPersonName: 'John Smith',
    contactPersonEmail: 'john.smith@acme.com',
    legalForm: 'as',
    naceCode: '62.010',
    balanceSheetSize: 100,
    turnover: 5_000_000,
    numberOfEmployees: 50,
    country: 'norway',
    // Business Model
    businessModelDescription:
      'We provide comprehensive software solutions for sustainability reporting and compliance management.',
    reportBasis: 'individual',
    // Sustainability
    hasPracticesPolicies: true,
    sustainabilityCertifications: 'ISO 14001',
    practicesDescription: 'We have comprehensive sustainability practices in place.',
    initiatives: [],
  }

  it('should validate complete form data', () => {
    const result = formSchema.safeParse(validFormData)
    expect(result.success).toBe(true)
  })

  it('should validate form data with consolidated reporting', () => {
    const consolidatedFormData = {
      ...validFormData,
      reportBasis: 'consolidated' as const,
      subsidiaries: [
        {
          name: 'ACME Subsidiary AS',
          organizationNumber: '987654321',
          address: '123 Main Street, Oslo, Norway',
        },
      ],
    }
    const result = formSchema.safeParse(consolidatedFormData)
    expect(result.success).toBe(true)
  })

  it('should maintain all individual schema validations', () => {
    const invalidFormData = {
      ...validFormData,
      organizationName: 'A', // Too short
      contactPersonEmail: 'invalid-email', // Invalid email
      numberOfEmployees: 0, // Too low
    }
    const result = formSchema.safeParse(invalidFormData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toHaveLength(3)
    }
  })
})
