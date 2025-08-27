/**
 * Story 4.1.12: GeneralInfo Multi-Step Form Configuration
 * Configuration for the complete 2-step General Information form
 */

import type { FormStep, MultiStepFormConfig } from '../types/form-types'
import type { GeneralInfoData } from '../types/general-info-types'
import { 
  COUNTRY_OPTIONS, 
  INDUSTRY_OPTIONS 
} from '../types/general-info-step1-types'
import { 
  generalInfoStep1Schema,
  generalInfoStep2ConditionalSchema 
} from '../validation/general-info-schemas'

/**
 * Step 1: Company Information Configuration
 * Reuses existing Step 1 configuration
 */
export const step1Config: FormStep<GeneralInfoData> = {
  id: 'company-info',
  title: 'Step 1: Company Information',
  description: 'Enter your company details and contact information',
  schema: generalInfoStep1Schema,
  fields: [
    {
      name: 'step1.companyName',
      type: 'text',
      label: 'Company Name',
      placeholder: 'Enter your company name',
      required: true,
      fieldProps: {
        autoComplete: 'organization',
      },
    },
    {
      name: 'step1.organizationNumber',
      type: 'text',
      label: 'Organization Number',
      placeholder: '9-digits',
      required: true,
      fieldProps: {
        autoComplete: 'off',
      },
    },
    {
      name: 'step1.country',
      type: 'select',
      label: 'Country',
      required: true,
      options: COUNTRY_OPTIONS,
      fieldProps: {
        placeholder: 'Select your country',
      },
    },
    {
      name: 'step1.naceCode',
      type: 'text',
      label: 'NACE Code',
      placeholder: 'XX.XXX',
      required: true,
      fieldProps: {
        autoComplete: 'off',
      },
    },
    {
      name: 'step1.industry',
      type: 'select',
      label: 'Industry',
      required: true,
      options: INDUSTRY_OPTIONS,
      fieldProps: {
        placeholder: 'Select your industry',
      },
    },
    {
      name: 'step1.revenue',
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
      name: 'step1.balanceSheetValue',
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
      name: 'step1.numberOfEmployees',
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
      name: 'step1.contactPersonName',
      type: 'text',
      label: 'Contact Person Name',
      placeholder: 'Enter contact person name',
      required: true,
      fieldProps: {
        autoComplete: 'name',
      },
    },
    {
      name: 'step1.contactPersonEmail',
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
 * Step 2: Strategy & Governance Configuration
 * New step for sustainability and governance information
 */
export const step2Config: FormStep<GeneralInfoData> = {
  id: 'strategy-governance',
  title: 'Step 2: Strategy & Governance',
  description: 'Provide sustainability strategy and governance information',
  schema: generalInfoStep2ConditionalSchema,
  fields: [
    {
      name: 'step2.sustainabilityStrategy',
      type: 'textarea',
      label: 'Sustainability Strategy',
      placeholder: 'Describe your organization\'s sustainability strategy (minimum 10 characters)',
      required: true,
      fieldProps: {
        rows: 4,
        maxLength: 2000,
      },
    },
    {
      name: 'step2.businessModel',
      type: 'textarea',
      label: 'Business Model',
      placeholder: 'Describe your business model and how it creates value (minimum 50 characters)',
      required: true,
      fieldProps: {
        rows: 6,
        maxLength: 5000,
      },
    },
    {
      name: 'step2.reportType',
      type: 'radio',
      label: 'Report Type',
      required: true,
      options: [
        { label: 'Individual Report', value: 'individual' },
        { label: 'Consolidated Report', value: 'consolidated' },
      ],
      fieldProps: {
        defaultValue: 'individual',
      },
    },
    {
      name: 'step2.subsidiaries',
      type: 'fieldArray',
      label: 'Subsidiaries',
      required: false,
      fieldProps: {
        addButtonLabel: 'Add Subsidiary',
        removeButtonLabel: 'Remove',
        maxItems: 5,
        fields: [
          {
            name: 'name',
            type: 'text',
            label: 'Subsidiary Name',
            placeholder: 'Enter subsidiary name',
            required: true,
          },
          {
            name: 'organizationNumber',
            type: 'text',
            label: 'Organization Number',
            placeholder: 'XX-XXXXXXXX',
            required: true,
          },
          {
            name: 'address',
            type: 'text',
            label: 'Address',
            placeholder: 'Enter subsidiary address',
            required: true,
          },
        ],
      },
      conditionalDisplay: {
        field: 'step2.reportType',
        operator: 'equals',
        value: 'consolidated',
      },
    },
  ],
}

/**
 * Default values for the multi-step form
 */
export const generalInfoDefaultValues: GeneralInfoData = {
  step1: {
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
  },
  step2: {
    sustainabilityStrategy: '',
    businessModel: '',
    reportType: 'individual',
    subsidiaries: [],
  },
}

/**
 * Complete GeneralInfo Multi-Step Form Configuration
 * Combines both steps with navigation support
 */
export const generalInfoConfig: MultiStepFormConfig<GeneralInfoData> = {
  id: 'general-info',
  title: 'General Information',
  description: 'Complete your organization information for ESG reporting',
  steps: [step1Config, step2Config],
  defaultValues: generalInfoDefaultValues,
  onSubmit: async (data: GeneralInfoData) => {
    // TODO: Implement submission logic for complete form
    console.log('Multi-step form submitted with data:', data)
    // In production, this would save to backend
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
  },
  onSave: async (data: Partial<GeneralInfoData>) => {
    // Handle draft saves across steps
    console.log('Multi-step draft saved:', data)
  },
  validation: {
    mode: 'onChange',
    reValidateMode: 'onChange',
  },
}

/**
 * Step navigation logic
 * Defines when users can proceed to next step
 */
export const canProceedToStep2 = (step1Data: Partial<GeneralInfoData['step1']>): boolean => {
  const requiredFields = [
    'companyName',
    'organizationNumber', 
    'country',
    'naceCode',
    'industry',
    'contactPersonName',
    'contactPersonEmail'
  ] as const

  return requiredFields.every(field => {
    const value = step1Data[field]
    return value !== undefined && value !== null && String(value).trim() !== ''
  }) && (step1Data.revenue ?? 0) > 0 && 
     (step1Data.balanceSheetValue ?? 0) > 0 && 
     (step1Data.numberOfEmployees ?? 0) >= 1
}