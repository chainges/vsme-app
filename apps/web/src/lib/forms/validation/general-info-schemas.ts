/**
 * Story 4.1.12: GeneralInfo Multi-Step Validation Schemas
 * Combined Zod schemas for both Step 1 and Step 2 validation
 */

import { z } from 'zod'
import { generalInfoStep1Schema } from './general-info-step1-schemas'

/**
 * Sustainability strategy validation schema
 * Required field with minimum 10 characters
 */
export const sustainabilityStrategySchema = z
  .string()
  .min(10, 'Sustainability strategy must be at least 10 characters')
  .max(2000, 'Sustainability strategy must not exceed 2000 characters')
  .trim()

/**
 * Business model validation schema
 * Required field with minimum 50 characters
 */
export const businessModelSchema = z
  .string()
  .min(50, 'Business model description must be at least 50 characters')
  .max(5000, 'Business model description must not exceed 5000 characters')
  .trim()

/**
 * Report type validation schema
 * Radio selection between 'individual' and 'consolidated'
 */
export const reportTypeSchema = z
  .enum(['individual', 'consolidated'], {
    errorMap: () => ({ message: 'Please select a report type' }),
  })

/**
 * Subsidiary data validation schema
 * Used for field array when consolidated report is selected
 */
export const subsidiarySchema = z.object({
  name: z
    .string()
    .min(1, 'Subsidiary name is required')
    .max(100, 'Subsidiary name must not exceed 100 characters')
    .trim(),
  organizationNumber: z
    .string()
    .min(9, 'Organization number is required')
    .max(9, '9 digits are required')
    .trim(),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(200, 'Address must not exceed 200 characters')
    .trim(),
})

/**
 * Subsidiaries array validation schema
 * Required when report type is 'consolidated', optional otherwise
 */
export const subsidiariesSchema = z
  .array(subsidiarySchema)
  .min(0, 'Subsidiaries array cannot be negative')
  .max(5, 'Maximum 5 subsidiaries allowed')

/**
 * Step 2 data validation schema
 * Strategy & Governance fields - flat structure
 */
export const generalInfoStep2Schema = z.object({
  sustainabilityStrategy: sustainabilityStrategySchema,
  businessModel: businessModelSchema,
  reportType: reportTypeSchema,
  subsidiaries: subsidiariesSchema,
})

/**
 * Complete multi-step form validation schema
 * Combines Step 1 and Step 2 schemas
 */
export const generalInfoSchema = z.object({
  step1: generalInfoStep1Schema,
  step2: generalInfoStep2Schema,
})

/**
 * Conditional validation for subsidiaries based on report type
 * When report type is 'consolidated', at least one subsidiary is required
 */
export const generalInfoStep2ConditionalSchema = generalInfoStep2Schema.refine(
  (data) => {
    if (data.reportType === 'consolidated') {
      return data.subsidiaries.length >= 1
    }
    return true
  },
  {
    message: 'At least one subsidiary is required for consolidated reports',
    path: ['subsidiaries'],
  }
)

/**
 * Complete multi-step form validation with conditional logic
 */
export const generalInfoConditionalSchema = z.object({
  step1: generalInfoStep1Schema,
  step2: generalInfoStep2ConditionalSchema,
})

/**
 * Type inference from schemas
 */
export type GeneralInfoStep2FormData = z.infer<typeof generalInfoStep2Schema>
export type GeneralInfoFormData = z.infer<typeof generalInfoSchema>
export type SubsidiaryFormData = z.infer<typeof subsidiarySchema>

/**
 * Export individual schemas for reuse
 */
export {
  generalInfoStep1Schema,
}