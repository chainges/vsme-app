/**
 * Story 4.1.11: GeneralInfo Step 1 Form Configuration
 * Configuration for the Company Information multi-step form
 */

import type { FormStep, MultiStepFormConfig } from '../types/form-types'
import type { GeneralInfoStep1Data } from '../types/general-info-step1-types'
import { 
  COUNTRY_OPTIONS, 
  INDUSTRY_OPTIONS 
} from '../types/general-info-step1-types'
import { generalInfoStep1Schema } from '../validation/general-info-step1-schemas'

/**
 * Step 1: Company Information Configuration
 */
export const companyInfoStep: FormStep<GeneralInfoStep1Data> = {
  id: 'company-info',
  title: 'Company Information',
  description: 'Enter your company details and contact information',
  schema: generalInfoStep1Schema,
  fields: [
    {
      name: 'companyName',
      type: 'text',
      label: 'Company Name',
      placeholder: 'Enter your company name',
      required: true,
      fieldProps: {
        autoComplete: 'organization',
      },
    },
    {
      name: 'organizationNumber',
      type: 'text',
      label: 'Organization Number',
      placeholder: 'XX-XXXXXXXX',
      required: true,
      fieldProps: {
        autoComplete: 'off',
      },
    },
    {
      name: 'country',
      type: 'select',
      label: 'Country',
      required: true,
      fieldProps: {
        options: COUNTRY_OPTIONS,
        placeholder: 'Select your country',
      },
    },
    {
      name: 'naceCode',
      type: 'text',
      label: 'NACE Code',
      placeholder: 'XX.XX',
      required: true,
      fieldProps: {
        autoComplete: 'off',
      },
    },
    {
      name: 'industry',
      type: 'select',
      label: 'Industry',
      required: true,
      fieldProps: {
        options: INDUSTRY_OPTIONS,
        placeholder: 'Select your industry',
      },
    },
    {
      name: 'revenue',
      type: 'number',
      label: 'Revenue',
      placeholder: 'Enter annual revenue',
      required: true,
      fieldProps: {
        min: 0,
        max: 999999999999,
        step: 0.01,
      },
    },
    {
      name: 'balanceSheetValue',
      type: 'number',
      label: 'Balance Sheet Value',
      placeholder: 'Enter balance sheet value',
      required: true,
      fieldProps: {
        min: 0,
        max: 999999999999,
        step: 0.01,
      },
    },
    {
      name: 'numberOfEmployees',
      type: 'number',
      label: 'Number of Employees',
      placeholder: 'Enter number of employees',
      required: true,
      fieldProps: {
        min: 1,
        max: 999999,
        step: 1,
      },
    },
    {
      name: 'contactPersonName',
      type: 'text',
      label: 'Contact Person Name',
      placeholder: 'Enter contact person name',
      required: true,
      fieldProps: {
        autoComplete: 'name',
      },
    },
    {
      name: 'contactPersonEmail',
      type: 'email',
      label: 'Contact Person Email',
      placeholder: 'Enter contact email address',
      required: true,
      fieldProps: {
        autoComplete: 'email',
      },
    },
  ],
}

/**
 * GeneralInfo Step 1 Form Configuration
 * Single-step form configuration for Company Information
 */
export const generalInfoStep1Config: MultiStepFormConfig<GeneralInfoStep1Data> = {
  id: 'general-info-step1',
  title: 'General Information - Company Details',
  description: 'Provide essential company information for your ESG report',
  steps: [companyInfoStep],
  onSubmit: async (data: GeneralInfoStep1Data) => {
    // TODO: Implement submission logic
    console.log('Form submitted with data:', data)
    // In production, this would save to backend
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
  },
  onSave: async (data: Partial<GeneralInfoStep1Data>) => {
    // Optional: Handle draft saves
    console.log('Draft saved:', data)
  },
}

/**
 * Default values for the form
 * Can be used to initialize the form with empty/default data
 */
export const generalInfoStep1DefaultValues: Partial<GeneralInfoStep1Data> = {
  companyName: '',
  organizationNumber: '',
  country: '',
  naceCode: '',
  industry: '',
  revenue: 0,
  balanceSheetValue: 0,
  numberOfEmployees: 1,
  contactPersonName: '',
  contactPersonEmail: '',
}
