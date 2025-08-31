import { z } from 'zod'
import type {
  InitiativeType,
  OrganizationFormData,
} from '../types/sustainability-types'
import {
  INITIATIVE_CATEGORIES,
  INITIATIVE_LABELS,
} from '../types/sustainability-types'

/**
 * Organization contact information schema
 */
const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Contact name contains invalid characters'),
  email: z
    .email('Please enter a valid email address')
    .max(255, 'Email address must not exceed 255 characters')
    .toLowerCase(),
})

/**
 * Step 1: Organization information schema
 */
export const organizationSchema = z.object({
  organization: z.object({
    name: z
      .string()
      .min(2, 'Organization name must be at least 2 characters')
      .max(200, 'Organization name must not exceed 200 characters')
      .trim(),
    number: z
      .string()
      .min(1, 'Organization number is required')
      .max(50, 'Organization number must not exceed 50 characters')
      .regex(
        /^[A-Z0-9-]+$/,
        'Organization number must contain only uppercase letters, numbers, and hyphens'
      )
      .trim(),
    naceCode: z
      .string()
      .min(1, 'NACE code is required')
      .regex(
        /^\d{2}\.\d{2}$/,
        'NACE code must be in format XX.XX (e.g., 62.01)'
      )
      .trim(),
    industry: z
      .string()
      .min(1, 'Industry selection is required')
      .max(100, 'Industry must not exceed 100 characters'),
    revenue: z
      .number()
      .positive('Revenue must be a positive number')
      .max(1e12, 'Revenue value is too large'),
    employeeCount: z
      .number()
      .int('Employee count must be a whole number')
      .positive('Employee count must be positive')
      .max(10_000_000, 'Employee count value is too large'),
    contact: contactSchema,
  }),
})

/**
 * Subsidiary information schema
 */
const subsidiarySchema = z.object({
  name: z
    .string()
    .min(2, 'Subsidiary name must be at least 2 characters')
    .max(200, 'Subsidiary name must not exceed 200 characters')
    .trim(),
  organizationNumber: z
    .string()
    .min(1, 'Organization number is required')
    .max(50, 'Organization number must not exceed 50 characters')
    .regex(
      /^[A-Z0-9-]+$/,
      'Organization number must contain only uppercase letters, numbers, and hyphens'
    )
    .trim(),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must not exceed 500 characters')
    .trim(),
})

/**
 * Step 2: Business model and subsidiaries schema
 */
export const businessModelSchema = z.object({
  businessModel: z.object({
    description: z
      .string()
      .min(10, 'Business model description must be at least 10 characters')
      .max(2000, 'Business model description must not exceed 2000 characters')
      .trim(),
    hasSubsidiaries: z.boolean(),
    subsidiaries: z.array(subsidiarySchema),
  }),
})

/**
 * Refined business model schema with conditional validation
 * If hasSubsidiaries is true, subsidiaries array must not be empty
 */
export const businessModelSchemaWithConditionals = businessModelSchema
  .refine(
    (data) => {
      if (data.businessModel.hasSubsidiaries) {
        return data.businessModel.subsidiaries.length > 0
      }
      return true
    },
    {
      message:
        'At least one subsidiary must be added when "Has subsidiaries" is selected',
      path: ['businessModel', 'subsidiaries'],
    }
  )
  .refine(
    (data) => {
      if (!data.businessModel.hasSubsidiaries) {
        return data.businessModel.subsidiaries.length === 0
      }
      return true
    },
    {
      message:
        'Subsidiaries should be empty when "Has subsidiaries" is not selected',
      path: ['businessModel', 'subsidiaries'],
    }
  )

/**
 * Individual sustainability initiative schema
 */
const initiativeSchema = z.object({
  type: z.enum([
    'WorkforceDevelopment',
    'Biodiversity',
    'ClimateAction',
    'WasteReduction',
    'EnergyEfficiency',
    'WaterConservation',
    'CommunityEngagement',
    'SupplyChainSustainability',
  ] as const),
  selected: z.boolean(),
  description: z
    .string()
    .max(1000, 'Initiative description must not exceed 1000 characters')
    .trim()
    .optional(),
  goal: z
    .string()
    .max(500, 'Initiative goal must not exceed 500 characters')
    .trim()
    .optional(),
  responsiblePerson: z
    .string()
    .max(100, 'Responsible person name must not exceed 100 characters')
    .regex(
      /^[a-zA-Z\s\-'.]*$/,
      'Responsible person name contains invalid characters'
    )
    .trim()
    .optional(),
})

/**
 * Step 3: Sustainability initiatives schema
 */
export const sustainabilitySchema = z.object({
  sustainability: z.object({
    initiatives: z.array(initiativeSchema),
  }),
})

/**
 * Refined sustainability schema with conditional validation
 * If an initiative is selected, description, goal, and responsiblePerson must be provided
 */
export const sustainabilitySchemaWithConditionals = sustainabilitySchema.refine(
  (data) => {
    const selectedInitiatives = data.sustainability.initiatives.filter(
      (initiative) => initiative.selected
    )

    // At least one initiative must be selected
    if (selectedInitiatives.length === 0) {
      return false
    }

    // All selected initiatives must have required fields
    return selectedInitiatives.every(
      (initiative) =>
        initiative.description &&
        initiative.description.trim().length >= 10 &&
        initiative.goal &&
        initiative.goal.trim().length >= 5 &&
        initiative.responsiblePerson &&
        initiative.responsiblePerson.trim().length >= 2
    )
  },
  {
    message:
      'At least one initiative must be selected, and all selected initiatives must have description (min 10 chars), goal (min 5 chars), and responsible person (min 2 chars)',
    path: ['sustainability', 'initiatives'],
  }
)

/**
 * Complete organization form data schema
 * Combines all steps with cross-field validation
 */
export const organizationFormSchema = z.object({
  organization: organizationSchema.shape.organization,
  businessModel: businessModelSchema.shape.businessModel,
  sustainability: sustainabilitySchema.shape.sustainability,
})

/**
 * Complete organization form schema with all conditional validations
 */
export const organizationFormSchemaWithConditionals = organizationFormSchema
  .refine(
    (data) => {
      // Business model conditional validation
      if (data.businessModel.hasSubsidiaries) {
        return data.businessModel.subsidiaries.length > 0
      }
      return true
    },
    {
      message:
        'At least one subsidiary must be added when "Has subsidiaries" is selected',
      path: ['businessModel', 'subsidiaries'],
    }
  )
  .refine(
    (data) => {
      if (!data.businessModel.hasSubsidiaries) {
        return data.businessModel.subsidiaries.length === 0
      }
      return true
    },
    {
      message:
        'Subsidiaries should be empty when "Has subsidiaries" is not selected',
      path: ['businessModel', 'subsidiaries'],
    }
  )
  .refine(
    (data) => {
      const selectedInitiatives = data.sustainability.initiatives.filter(
        (initiative) => initiative.selected
      )

      // At least one initiative must be selected
      if (selectedInitiatives.length === 0) {
        return false
      }

      // All selected initiatives must have required fields
      return selectedInitiatives.every(
        (initiative) =>
          initiative.description &&
          initiative.description.trim().length >= 10 &&
          initiative.goal &&
          initiative.goal.trim().length >= 5 &&
          initiative.responsiblePerson &&
          initiative.responsiblePerson.trim().length >= 2
      )
    },
    {
      message:
        'At least one initiative must be selected, and all selected initiatives must have description (min 10 chars), goal (min 5 chars), and responsible person (min 2 chars)',
      path: ['sustainability', 'initiatives'],
    }
  )

/**
 * Individual step schemas for step-by-step validation
 */
export const stepSchemas = {
  organization: organizationSchema,
  businessModel: businessModelSchemaWithConditionals,
  sustainability: sustainabilitySchemaWithConditionals,
} as const

/**
 * Type inference helpers
 */
export type OrganizationStepData = z.infer<typeof organizationSchema>
export type BusinessModelStepData = z.infer<typeof businessModelSchema>
export type SustainabilityStepData = z.infer<typeof sustainabilitySchema>
export type CompleteFormData = z.infer<typeof organizationFormSchema>

/**
 * Validation helper functions
 */
export const validateStep = {
  organization: (data: unknown) => organizationSchema.safeParse(data),
  businessModel: (data: unknown) =>
    businessModelSchemaWithConditionals.safeParse(data),
  sustainability: (data: unknown) =>
    sustainabilitySchemaWithConditionals.safeParse(data),
  complete: (data: unknown) =>
    organizationFormSchemaWithConditionals.safeParse(data),
}

/**
 * Default form data generator
 * Creates initial form data with all initiative types pre-populated
 */
export const createDefaultFormData = (): OrganizationFormData => {
  // Get all initiative types from categories
  const allInitiativeTypes = [
    ...INITIATIVE_CATEGORIES.environmental,
    ...INITIATIVE_CATEGORIES.social,
  ] as InitiativeType[]

  return {
    organization: {
      name: '',
      number: '',
      naceCode: '',
      industry: '',
      revenue: 0,
      employeeCount: 0,
      contact: {
        name: '',
        email: '',
      },
    },
    businessModel: {
      description: '',
      hasSubsidiaries: false,
      subsidiaries: [],
    },
    sustainability: {
      initiatives: allInitiativeTypes.map((type) => ({
        type,
        selected: false,
        description: '',
        goal: '',
        responsiblePerson: '',
      })),
    },
  }
}

/**
 * Validation error message helpers
 */
export const getFieldErrorMessage = (
  errors: z.ZodError,
  fieldPath: string
): string | undefined => {
  const fieldError = errors.issues.find(
    (error) => error.path.join('.') === fieldPath
  )
  return fieldError?.message
}

export const getFieldErrors = (
  errors: z.ZodError,
  fieldPath: string
): string[] => {
  return errors.issues
    .filter((error) => error.path.join('.') === fieldPath)
    .map((error) => error.message)
}

/**
 * Cross-field validation helpers
 */
export const validateSubsidiariesConditional = (
  hasSubsidiaries: boolean,
  subsidiaries: unknown[]
): boolean => {
  if (hasSubsidiaries) {
    return subsidiaries.length > 0
  }
  return subsidiaries.length === 0
}

export const validateSelectedInitiatives = (
  initiatives: Array<{
    selected: boolean
    description?: string
    goal?: string
    responsiblePerson?: string
  }>
): { isValid: boolean; message?: string } => {
  const selectedInitiatives = initiatives.filter((init) => init.selected)

  if (selectedInitiatives.length === 0) {
    return {
      isValid: false,
      message: 'At least one sustainability initiative must be selected',
    }
  }

  const incompleteInitiatives = selectedInitiatives.filter(
    (init) =>
      !init.description ||
      init.description.trim().length < 10 ||
      !init.goal ||
      init.goal.trim().length < 5 ||
      !init.responsiblePerson ||
      init.responsiblePerson.trim().length < 2
  )

  if (incompleteInitiatives.length > 0) {
    return {
      isValid: false,
      message:
        'All selected initiatives must have complete information (description, goal, and responsible person)',
    }
  }

  return { isValid: true }
}
