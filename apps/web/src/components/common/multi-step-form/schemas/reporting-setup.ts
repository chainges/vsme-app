import { z } from 'zod'

// Define subsidiary schema
export const subsidiarySchema = z.object({
  name: z.string().min(2, 'Subsidiary name must be at least 2 characters'),
  organizationNumber: z.string().min(9, 'Organization number must be valid'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
})

export type SubsidiaryData = z.infer<typeof subsidiarySchema>

// Base reporting setup schema without refinement
const reportingSetupBaseSchema = z.object({
  reportingYear: z.string().min(4, 'Please select a reporting year'),
  reportingOption: z.enum(['basic', 'basic-comprehensive'], {
    message: 'Please select a reporting option',
  }),
  reportBasis: z
    .enum(['individual', 'consolidated'], {
      message: 'Please specify if the report is individual or consolidated',
    })
    .default('individual'),
  subsidiaries: z.array(subsidiarySchema).optional(),
})

// Apply refinement separately for form compatibility
export const reportingSetupSchema = reportingSetupBaseSchema.refine(
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

export type ReportingSetupData = z.infer<typeof reportingSetupSchema>

export const reportingSetupFields = [
  {
    name: 'reportingYear',
    label: 'Reporting Year',
    type: 'select',
    placeholder: 'Select year',
    options: [
      { label: '2024', value: '2024' },
      { label: '2023', value: '2023' },
      { label: '2022', value: '2022' },
    ],
  },
  {
    name: 'reportingOption',
    label: 'Reporting Option',
    type: 'select',
    placeholder: 'Select reporting option',
    options: [
      { label: 'Basic Module only', value: 'basic' },
      {
        label: 'Basic and Comprehensive Module',
        value: 'basic-comprehensive',
      },
    ],
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

export const reportingSetupStepConfig = {
  id: 'reporting-setup',
  title: 'Reporting Setup',
  description: 'Configure your sustainability report',
  schema: reportingSetupSchema,
  fields: reportingSetupFields,
} as const