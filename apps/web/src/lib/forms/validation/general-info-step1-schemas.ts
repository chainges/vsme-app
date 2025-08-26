/**
 * Story 4.1.11: GeneralInfo Step 1 Validation Schemas
 * Zod schemas for Company Information form validation
 */

import { z } from 'zod'
import {
  COUNTRY_OPTIONS,
  INDUSTRY_OPTIONS,
  type CountryValue,
  type IndustryValue,
} from '../types/general-info-step1-types'

/**
 * Regular expression for Organization Number format (XX-XXXXXXXX)
 */
const ORG_NUMBER_REGEX = /^\d{2}-\d{8}$/

/**
 * Regular expression for NACE code format (XX.XX)
 */
const NACE_CODE_REGEX = /^\d{2}\.\d{2}$/

/**
 * Extract valid values from option arrays
 */
const validCountries = COUNTRY_OPTIONS.map(opt => opt.value) as readonly [CountryValue, ...CountryValue[]]
const validIndustries = INDUSTRY_OPTIONS.map(opt => opt.value) as readonly [IndustryValue, ...IndustryValue[]]

/**
 * Company name validation schema
 */
export const companyNameSchema = z
  .string()
  .min(2, 'Company name must be at least 2 characters')
  .max(100, 'Company name must not exceed 100 characters')
  .trim()

/**
 * Organization number validation schema
 */
export const organizationNumberSchema = z
  .string()
  .regex(ORG_NUMBER_REGEX, 'Invalid format. Use XX-XXXXXXXX format')
  .trim()

/**
 * Country validation schema
 */
export const countrySchema = z
  .enum(validCountries, {
    errorMap: () => ({ message: 'Please select a country' }),
  })

/**
 * NACE code validation schema
 */
export const naceCodeSchema = z
  .string()
  .regex(NACE_CODE_REGEX, 'Invalid NACE code format. Use XX.XX format')
  .trim()

/**
 * Industry validation schema
 */
export const industrySchema = z
  .enum(validIndustries, {
    errorMap: () => ({ message: 'Please select an industry' }),
  })

/**
 * Revenue validation schema
 */
export const revenueSchema = z
  .number({
    required_error: 'Revenue is required',
    invalid_type_error: 'Revenue must be a number',
  })
  .min(0, 'Revenue must be positive')
  .max(999999999999, 'Revenue value is too large')
  .multipleOf(0.01, 'Revenue can have up to 2 decimal places')

/**
 * Balance sheet value validation schema
 */
export const balanceSheetValueSchema = z
  .number({
    required_error: 'Balance sheet value is required',
    invalid_type_error: 'Balance sheet value must be a number',
  })
  .min(0, 'Balance sheet value must be positive')
  .max(999999999999, 'Balance sheet value is too large')
  .multipleOf(0.01, 'Balance sheet value can have up to 2 decimal places')

/**
 * Number of employees validation schema
 */
export const numberOfEmployeesSchema = z
  .number({
    required_error: 'Number of employees is required',
    invalid_type_error: 'Number of employees must be a number',
  })
  .int('Number of employees must be a whole number')
  .min(1, 'Number of employees must be at least 1')
  .max(999999, 'Number of employees value is too large')

/**
 * Contact person name validation schema
 */
export const contactPersonNameSchema = z
  .string()
  .min(2, 'Contact person name must be at least 2 characters')
  .max(100, 'Contact person name must not exceed 100 characters')
  .trim()

/**
 * Contact person email validation schema
 */
export const contactPersonEmailSchema = z
  .string()
  .email('Please enter a valid email address')
  .trim()
  .toLowerCase()

/**
 * Complete GeneralInfoStep1 validation schema
 * Combines all individual field schemas
 */
export const generalInfoStep1Schema = z.object({
  companyName: companyNameSchema,
  organizationNumber: organizationNumberSchema,
  country: countrySchema,
  naceCode: naceCodeSchema,
  industry: industrySchema,
  revenue: revenueSchema,
  balanceSheetValue: balanceSheetValueSchema,
  numberOfEmployees: numberOfEmployeesSchema,
  contactPersonName: contactPersonNameSchema,
  contactPersonEmail: contactPersonEmailSchema,
})

/**
 * Type inference from the schema
 */
export type GeneralInfoStep1FormData = z.infer<typeof generalInfoStep1Schema>
