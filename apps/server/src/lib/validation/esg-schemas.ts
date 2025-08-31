import { z } from 'zod'

// Energy and Emissions validation schema
export const energyAndEmissionsSchema = z.object({
  scope1: z.number().min(0).optional(),
  scope2: z.number().min(0).optional(),
  scope3Market: z.number().min(0).optional(),
  scope3Location: z.number().min(0).optional(),
  renewableEnergy: z.number().min(0).optional(),
  nonRenewableEnergy: z.number().min(0).optional(),
  climateDataCollectionMethod: z.string().max(255).optional(),
  climateDataUncertainty: z.string().max(255).optional(),
  reported: z.boolean().default(false),
})

// Environmental data validation schema
export const environmentalSchema = z.object({
  energyAndEmissions: energyAndEmissionsSchema.optional(),
})

// Employees validation schema
export const employeesSchema = z.object({
  fullTimeEmployees: z.number().int().min(0).optional(),
  partTimeEmployees: z.number().int().min(0).optional(),
  tempEmployees: z.number().int().min(0).optional(),
  reported: z.boolean().default(false),
})

// Social data validation schema
export const socialSchema = z.object({
  employees: employeesSchema.optional(),
})

// Ethics validation schema
export const ethicsSchema = z.object({
  corruptionCases: z.number().int().min(0).optional(),
  whistleBlowerReports: z.number().int().min(0).optional(),
  reported: z.boolean().default(false),
})

// Fines and Penalties validation schema
export const finesAndPenaltiesSchema = z.object({
  fnp: z.boolean().default(false),
  description: z.string().max(1000).optional(),
  reported: z.boolean().default(false),
})

// Governance data validation schema
export const governanceSchema = z.object({
  ethics: ethicsSchema.optional(),
  finesAndPenalties: finesAndPenaltiesSchema.optional(),
})

// Company validation schema
export const companySchema = z.object({
  year: z.number().int().min(2000).max(2100),
  name: z.string().min(1).max(255),
  organizationId: z.string().min(1),
  registrationNumber: z.string().min(1).max(50),
  revenue: z.number().min(0).optional(),
  naceCode: z.string().max(10).optional(),
  industry: z.string().max(100).optional(),
  industryCo2Intensity: z.number().min(0).optional(),
})

// Report validation schema
export const reportSchema = z.object({
  organizationId: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  companyId: z.string().min(1),
  environmental: environmentalSchema.optional(),
  social: socialSchema.optional(),
  governance: governanceSchema.optional(),
})

// Partial schemas for updates
export const partialCompanySchema = companySchema.partial()
export const partialReportSchema = reportSchema.partial()

// Schema for creating a company (without generated fields)
export const createCompanySchema = companySchema

// Schema for creating a report (without generated fields)
export const createReportSchema = reportSchema

// Schema for updating a company
export const updateCompanySchema = companySchema
  .partial()
  .omit({ organizationId: true })

// Schema for updating a report
export const updateReportSchema = reportSchema.partial().omit({
  organizationId: true,
  companyId: true,
})
