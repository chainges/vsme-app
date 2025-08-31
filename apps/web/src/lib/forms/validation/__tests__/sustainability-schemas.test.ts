import { describe, expect, it } from 'vitest'
import {
  businessModelSchemaWithConditionals,
  createDefaultFormData,
  getFieldErrorMessage,
  organizationFormSchemaWithConditionals,
  organizationSchema,
  sustainabilitySchemaWithConditionals,
  validateSelectedInitiatives,
  validateStep,
  validateSubsidiariesConditional,
} from '../sustainability-schemas'

describe('Sustainability Form Validation Schemas', () => {
  describe('organizationSchema', () => {
    it('should validate valid organization data', () => {
      const validData = {
        organization: {
          name: 'Test Company',
          number: 'TC-123456',
          naceCode: '62.01',
          industry: 'technology',
          revenue: 1_000_000,
          employeeCount: 50,
          contact: {
            name: 'John Doe',
            email: 'john@testcompany.com',
          },
        },
      }

      const result = organizationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid organization data', () => {
      const invalidData = {
        organization: {
          name: 'A', // Too short
          number: '', // Required
          naceCode: '123', // Invalid format
          industry: '',
          revenue: -1000, // Must be positive
          employeeCount: 0, // Must be positive
          contact: {
            name: '',
            email: 'invalid-email',
          },
        },
      }

      const result = organizationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })

    it('should validate NACE code format', () => {
      const testCases = [
        { naceCode: '62.01', valid: true },
        { naceCode: '01.23', valid: true },
        { naceCode: '123', valid: false },
        { naceCode: '62.1', valid: false },
        { naceCode: 'AB.CD', valid: false },
      ]

      testCases.forEach(({ naceCode, valid }) => {
        const data = {
          organization: {
            name: 'Test Company',
            number: 'TC-123456',
            naceCode,
            industry: 'technology',
            revenue: 1_000_000,
            employeeCount: 50,
            contact: {
              name: 'John Doe',
              email: 'john@testcompany.com',
            },
          },
        }

        const result = organizationSchema.safeParse(data)
        expect(result.success).toBe(valid)
      })
    })

    it('should validate email format', () => {
      const testCases = [
        { email: 'test@example.com', valid: true },
        { email: 'user.name+tag@domain.co.uk', valid: true },
        { email: 'invalid-email', valid: false },
        { email: '@domain.com', valid: false },
        { email: 'test@', valid: false },
      ]

      testCases.forEach(({ email, valid }) => {
        const data = {
          organization: {
            name: 'Test Company',
            number: 'TC-123456',
            naceCode: '62.01',
            industry: 'technology',
            revenue: 1_000_000,
            employeeCount: 50,
            contact: {
              name: 'John Doe',
              email,
            },
          },
        }

        const result = organizationSchema.safeParse(data)
        expect(result.success).toBe(valid)
      })
    })
  })

  describe('businessModelSchemaWithConditionals', () => {
    it('should validate business model without subsidiaries', () => {
      const validData = {
        businessModel: {
          description: 'We provide software solutions for businesses.',
          hasSubsidiaries: false,
          subsidiaries: [],
        },
      }

      const result = businessModelSchemaWithConditionals.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate business model with subsidiaries', () => {
      const validData = {
        businessModel: {
          description: 'We provide software solutions for businesses.',
          hasSubsidiaries: true,
          subsidiaries: [
            {
              name: 'Subsidiary One',
              organizationNumber: 'SUB-001',
              address: '123 Business Street, City, Country',
            },
          ],
        },
      }

      const result = businessModelSchemaWithConditionals.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject when hasSubsidiaries is true but no subsidiaries provided', () => {
      const invalidData = {
        businessModel: {
          description: 'We provide software solutions for businesses.',
          hasSubsidiaries: true,
          subsidiaries: [],
        },
      }

      const result = businessModelSchemaWithConditionals.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject when hasSubsidiaries is false but subsidiaries are provided', () => {
      const invalidData = {
        businessModel: {
          description: 'We provide software solutions for businesses.',
          hasSubsidiaries: false,
          subsidiaries: [
            {
              name: 'Subsidiary One',
              organizationNumber: 'SUB-001',
              address: '123 Business Street, City, Country',
            },
          ],
        },
      }

      const result = businessModelSchemaWithConditionals.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should validate subsidiary data format', () => {
      const testCases = [
        {
          subsidiary: {
            name: 'Valid Subsidiary',
            organizationNumber: 'SUB-001',
            address: '123 Valid Address Street',
          },
          valid: true,
        },
        {
          subsidiary: {
            name: 'A', // Too short
            organizationNumber: 'SUB-001',
            address: '123 Valid Address Street',
          },
          valid: false,
        },
        {
          subsidiary: {
            name: 'Valid Subsidiary',
            organizationNumber: '', // Required
            address: '123 Valid Address Street',
          },
          valid: false,
        },
        {
          subsidiary: {
            name: 'Valid Subsidiary',
            organizationNumber: 'SUB-001',
            address: '123', // Too short
          },
          valid: false,
        },
      ]

      testCases.forEach(({ subsidiary, valid }) => {
        const data = {
          businessModel: {
            description: 'We provide software solutions for businesses.',
            hasSubsidiaries: true,
            subsidiaries: [subsidiary],
          },
        }

        const result = businessModelSchemaWithConditionals.safeParse(data)
        expect(result.success).toBe(valid)
      })
    })
  })

  describe('sustainabilitySchemaWithConditionals', () => {
    it('should validate sustainability data with selected initiatives', () => {
      const validData = {
        sustainability: {
          initiatives: [
            {
              type: 'ClimateAction' as const,
              selected: true,
              description:
                'We are implementing renewable energy solutions across all facilities.',
              goal: 'Achieve carbon neutrality by 2030',
              responsiblePerson: 'Jane Smith',
            },
            {
              type: 'WasteReduction' as const,
              selected: false,
              description: '',
              goal: '',
              responsiblePerson: '',
            },
          ],
        },
      }

      const result = sustainabilitySchemaWithConditionals.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject when no initiatives are selected', () => {
      const invalidData = {
        sustainability: {
          initiatives: [
            {
              type: 'ClimateAction' as const,
              selected: false,
              description: '',
              goal: '',
              responsiblePerson: '',
            },
            {
              type: 'WasteReduction' as const,
              selected: false,
              description: '',
              goal: '',
              responsiblePerson: '',
            },
          ],
        },
      }

      const result = sustainabilitySchemaWithConditionals.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject when selected initiatives have incomplete data', () => {
      const invalidData = {
        sustainability: {
          initiatives: [
            {
              type: 'ClimateAction' as const,
              selected: true,
              description: 'Short', // Too short
              goal: '', // Required
              responsiblePerson: 'Jane Smith',
            },
          ],
        },
      }

      const result = sustainabilitySchemaWithConditionals.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should validate initiative field lengths', () => {
      const testCases = [
        {
          description: 'This is a valid description with enough characters.',
          goal: 'Valid goal',
          responsiblePerson: 'John Doe',
          valid: true,
        },
        {
          description: 'Short', // Too short (< 10 chars)
          goal: 'Valid goal',
          responsiblePerson: 'John Doe',
          valid: false,
        },
        {
          description: 'This is a valid description with enough characters.',
          goal: 'Bad', // Too short (< 5 chars)
          responsiblePerson: 'John Doe',
          valid: false,
        },
        {
          description: 'This is a valid description with enough characters.',
          goal: 'Valid goal',
          responsiblePerson: 'A', // Too short (< 2 chars)
          valid: false,
        },
      ]

      testCases.forEach(({ description, goal, responsiblePerson, valid }) => {
        const data = {
          sustainability: {
            initiatives: [
              {
                type: 'ClimateAction' as const,
                selected: true,
                description,
                goal,
                responsiblePerson,
              },
            ],
          },
        }

        const result = sustainabilitySchemaWithConditionals.safeParse(data)
        expect(result.success).toBe(valid)
      })
    })
  })

  describe('organizationFormSchemaWithConditionals', () => {
    it('should validate complete form data', () => {
      const validData = createDefaultFormData()

      // Fill with valid data
      validData.organization.name = 'Test Company'
      validData.organization.number = 'TC-123456'
      validData.organization.naceCode = '62.01'
      validData.organization.industry = 'technology'
      validData.organization.revenue = 1_000_000
      validData.organization.employeeCount = 50
      validData.organization.contact.name = 'John Doe'
      validData.organization.contact.email = 'john@testcompany.com'

      validData.businessModel.description =
        'We provide software solutions for businesses.'
      validData.businessModel.hasSubsidiaries = false

      validData.sustainability.initiatives[0].selected = true
      validData.sustainability.initiatives[0].description =
        'We are implementing renewable energy solutions across all facilities.'
      validData.sustainability.initiatives[0].goal =
        'Achieve carbon neutrality by 2030'
      validData.sustainability.initiatives[0].responsiblePerson = 'Jane Smith'

      const result = organizationFormSchemaWithConditionals.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('validateStep', () => {
    it('should validate individual steps', () => {
      const organizationData = {
        organization: {
          name: 'Test Company',
          number: 'TC-123456',
          naceCode: '62.01',
          industry: 'technology',
          revenue: 1_000_000,
          employeeCount: 50,
          contact: {
            name: 'John Doe',
            email: 'john@testcompany.com',
          },
        },
      }

      const result = validateStep.organization(organizationData)
      expect(result.success).toBe(true)
    })
  })

  describe('createDefaultFormData', () => {
    it('should create valid default form data structure', () => {
      const defaultData = createDefaultFormData()

      expect(defaultData.organization).toBeDefined()
      expect(defaultData.businessModel).toBeDefined()
      expect(defaultData.sustainability).toBeDefined()
      expect(defaultData.sustainability.initiatives).toHaveLength(8) // All initiative types
      expect(defaultData.businessModel.hasSubsidiaries).toBe(false)
      expect(defaultData.businessModel.subsidiaries).toHaveLength(0)
    })
  })

  describe('getFieldErrorMessage', () => {
    it('should extract specific field error messages', () => {
      const invalidData = {
        organization: {
          name: '', // Required
          number: 'TC-123456',
          naceCode: '62.01',
          industry: 'technology',
          revenue: 1_000_000,
          employeeCount: 50,
          contact: {
            name: 'John Doe',
            email: 'john@testcompany.com',
          },
        },
      }

      const result = organizationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)

      if (!result.success) {
        const errorMessage = getFieldErrorMessage(
          result.error,
          'organization.name'
        )
        expect(errorMessage).toBeDefined()
        expect(errorMessage).toContain('at least 2 characters')
      }
    })
  })

  describe('validateSubsidiariesConditional', () => {
    it('should validate subsidiaries conditional logic', () => {
      expect(validateSubsidiariesConditional(true, [{}])).toBe(true)
      expect(validateSubsidiariesConditional(true, [])).toBe(false)
      expect(validateSubsidiariesConditional(false, [])).toBe(true)
      expect(validateSubsidiariesConditional(false, [{}])).toBe(false)
    })
  })

  describe('validateSelectedInitiatives', () => {
    it('should validate selected initiatives', () => {
      const validInitiatives = [
        {
          selected: true,
          description: 'Valid description with enough characters',
          goal: 'Valid goal',
          responsiblePerson: 'John Doe',
        },
      ]

      const result = validateSelectedInitiatives(validInitiatives)
      expect(result.isValid).toBe(true)
    })

    it('should reject when no initiatives selected', () => {
      const noSelectedInitiatives = [
        {
          selected: false,
          description: '',
          goal: '',
          responsiblePerson: '',
        },
      ]

      const result = validateSelectedInitiatives(noSelectedInitiatives)
      expect(result.isValid).toBe(false)
      expect(result.message).toContain('At least one sustainability initiative')
    })

    it('should reject when selected initiatives are incomplete', () => {
      const incompleteInitiatives = [
        {
          selected: true,
          description: 'Short', // Too short
          goal: 'Valid goal',
          responsiblePerson: 'John Doe',
        },
      ]

      const result = validateSelectedInitiatives(incompleteInitiatives)
      expect(result.isValid).toBe(false)
      expect(result.message).toContain('complete information')
    })
  })
})
