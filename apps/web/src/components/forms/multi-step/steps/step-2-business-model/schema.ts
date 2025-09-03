import { z } from 'zod'

// Define subsidiary schema
export const subsidiarySchema = z.object({
  name: z.string().min(2, 'Subsidiary name must be at least 2 characters'),
  organizationNumber: z.string().min(9, 'Organization number must be valid'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
})

export type SubsidiaryData = z.infer<typeof subsidiarySchema>

// Base business model schema without refinement
const businessModelBaseSchema = z.object({
  businessModelDescription: z
    .string()
    .min(10, 'Please provide a business model description of at least 10 characters'),
  reportBasis: z
    .enum(['individual', 'consolidated'], {
      message: 'Please specify if the report is individual or consolidated',
    })
    .default('individual'),
  subsidiaries: z.array(subsidiarySchema).optional(),
})

// Apply refinement separately for form compatibility
export const businessModelSchema = businessModelBaseSchema.refine(
  (data) => {
    // If reportBasis is "consolidated", at least one subsidiary should be provided
    if (
      data.reportBasis === 'consolidated' &&
      (!data.subsidiaries || data.subsidiaries.length === 0)
    ) {
      return false
    }
    return true
  },
  {
    message: 'At least one subsidiary is required when reporting on consolidated basis',
    path: ['subsidiaries'],
  }
)

export type BusinessModelData = z.infer<typeof businessModelSchema>

export const businessModelFields = [
  {
    name: 'businessModelDescription',
    label: 'Business Model Description',
    type: 'textarea',
    placeholder:
      'Describe your business model, including key activities, value propositions, and target customers...',
  },
  {
    name: 'reportBasis',
    label: 'Report Basis',
    type: 'select',
    options: [
      { label: 'Individual basis', value: 'individual' },
      { label: 'Consolidated basis', value: 'consolidated' },
    ],
  },
] as const

export const businessModelStepConfig = {
  id: 'business-model',
  title: 'Business Model',
  description: 'Describe your business model and reporting structure.',
  schema: businessModelSchema,
  fields: businessModelFields,
} as const
