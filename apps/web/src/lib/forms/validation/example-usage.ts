/**
 * Example usage of the sustainability form validation schemas
 * This file demonstrates how to use the validation schemas in practice
 */

import {
  businessModelSchemaWithConditionals,
  createDefaultFormData,
  getFieldErrorMessage,
  organizationFormSchemaWithConditionals,
  organizationSchema,
  sustainabilitySchemaWithConditionals,
  validateStep,
} from './sustainability-schemas'

// Example 1: Validating organization data
export function validateOrganizationExample() {
  const organizationData = {
    organization: {
      name: 'Green Tech Solutions',
      number: 'GTS-123456',
      naceCode: '62.01',
      industry: 'technology',
      revenue: 2_500_000,
      employeeCount: 75,
      contact: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@greentech.com',
      },
    },
  }

  const result = organizationSchema.safeParse(organizationData)

  if (result.success) {
    console.log('✅ Organization data is valid:', result.data)
    return { success: true, data: result.data }
  }
  console.log('❌ Organization validation failed:', result.error.issues)
  return { success: false, errors: result.error.issues }
}

// Example 2: Validating business model with subsidiaries
export function validateBusinessModelExample() {
  const businessModelData = {
    businessModel: {
      description:
        'We develop and implement sustainable technology solutions for businesses, focusing on renewable energy systems, waste reduction technologies, and carbon footprint optimization.',
      hasSubsidiaries: true,
      subsidiaries: [
        {
          name: 'Green Energy Systems Ltd',
          organizationNumber: 'GES-789012',
          address: '456 Innovation Drive, Tech City, TC 12345',
        },
        {
          name: 'Waste Solutions Inc',
          organizationNumber: 'WSI-345678',
          address: '789 Sustainability Street, Eco Town, ET 67890',
        },
      ],
    },
  }

  const result =
    businessModelSchemaWithConditionals.safeParse(businessModelData)

  if (result.success) {
    console.log('✅ Business model data is valid:', result.data)
    return { success: true, data: result.data }
  }
  console.log('❌ Business model validation failed:', result.error.issues)
  return { success: false, errors: result.error.issues }
}

// Example 3: Validating sustainability initiatives
export function validateSustainabilityExample() {
  const sustainabilityData = {
    sustainability: {
      initiatives: [
        {
          type: 'ClimateAction' as const,
          selected: true,
          description:
            'We are implementing comprehensive renewable energy solutions across all our facilities, including solar panels, wind turbines, and energy storage systems.',
          goal: 'Achieve 100% renewable energy usage and carbon neutrality by 2030',
          responsiblePerson: 'Dr. Michael Green',
        },
        {
          type: 'WasteReduction' as const,
          selected: true,
          description:
            'Our waste reduction program focuses on circular economy principles, implementing zero-waste manufacturing processes and comprehensive recycling systems.',
          goal: 'Reduce waste generation by 90% and achieve zero landfill waste by 2028',
          responsiblePerson: 'Lisa Chen',
        },
        {
          type: 'EnergyEfficiency' as const,
          selected: false,
          description: '',
          goal: '',
          responsiblePerson: '',
        },
      ],
    },
  }

  const result =
    sustainabilitySchemaWithConditionals.safeParse(sustainabilityData)

  if (result.success) {
    console.log('✅ Sustainability data is valid:', result.data)
    return { success: true, data: result.data }
  }
  console.log('❌ Sustainability validation failed:', result.error.issues)
  return { success: false, errors: result.error.issues }
}

// Example 4: Complete form validation
export function validateCompleteFormExample() {
  const formData = createDefaultFormData()

  // Fill with valid data
  formData.organization.name = 'Green Tech Solutions'
  formData.organization.number = 'GTS-123456'
  formData.organization.naceCode = '62.01'
  formData.organization.industry = 'technology'
  formData.organization.revenue = 2_500_000
  formData.organization.employeeCount = 75
  formData.organization.contact.name = 'Sarah Johnson'
  formData.organization.contact.email = 'sarah.johnson@greentech.com'

  formData.businessModel.description =
    'We develop and implement sustainable technology solutions for businesses.'
  formData.businessModel.hasSubsidiaries = false

  // Select and fill first initiative
  formData.sustainability.initiatives[0].selected = true
  formData.sustainability.initiatives[0].description =
    'We are implementing comprehensive renewable energy solutions across all our facilities.'
  formData.sustainability.initiatives[0].goal =
    'Achieve 100% renewable energy usage and carbon neutrality by 2030'
  formData.sustainability.initiatives[0].responsiblePerson = 'Dr. Michael Green'

  const result = organizationFormSchemaWithConditionals.safeParse(formData)

  if (result.success) {
    console.log('✅ Complete form data is valid')
    return { success: true, data: result.data }
  }
  console.log('❌ Complete form validation failed:', result.error.issues)
  return { success: false, errors: result.error.issues }
}

// Example 5: Step-by-step validation
export function validateStepByStepExample() {
  const organizationData = {
    organization: {
      name: 'Green Tech Solutions',
      number: 'GTS-123456',
      naceCode: '62.01',
      industry: 'technology',
      revenue: 2_500_000,
      employeeCount: 75,
      contact: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@greentech.com',
      },
    },
  }

  // Validate step 1
  const step1Result = validateStep.organization(organizationData)
  console.log(
    'Step 1 validation:',
    step1Result.success ? '✅ Valid' : '❌ Invalid'
  )

  if (!step1Result.success) {
    // Extract specific field errors
    const nameError = getFieldErrorMessage(
      step1Result.error,
      'organization.name'
    )
    const emailError = getFieldErrorMessage(
      step1Result.error,
      'organization.contact.email'
    )

    console.log('Name error:', nameError)
    console.log('Email error:', emailError)
  }

  return step1Result
}

// Example 6: Error handling and user feedback
export function handleValidationErrors() {
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

  if (!result.success) {
    console.log('Validation errors found:')

    // Group errors by field for better user experience
    const errorsByField: Record<string, string[]> = {}

    result.error.issues.forEach((issue) => {
      const fieldPath = issue.path.join('.')
      if (!errorsByField[fieldPath]) {
        errorsByField[fieldPath] = []
      }
      errorsByField[fieldPath].push(issue.message)
    })

    // Display errors in a user-friendly format
    Object.entries(errorsByField).forEach(([field, errors]) => {
      console.log(`  ${field}:`, errors.join(', '))
    })

    return { success: false, errorsByField }
  }

  return { success: true }
}

// Export all examples for testing
export const examples = {
  validateOrganizationExample,
  validateBusinessModelExample,
  validateSustainabilityExample,
  validateCompleteFormExample,
  validateStepByStepExample,
  handleValidationErrors,
}
