import { z } from 'zod'

export const companyInfoSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  organizationNumber: z.string().min(9, 'Organization number must be valid'),
  website: z.url('Please enter a valid website URL').optional().or(z.literal('')),
  contactPersonName: z.string().min(2, 'Contact person name must be at least 2 characters'),
  contactPersonEmail: z.email('Please enter a valid email address'),
  legalForm: z.string().min(2, 'Legal form is required'),
  naceCode: z.string().min(5, 'NACE code is required - xx.xxx'),
  balanceSheetSize: z.coerce.number().min(1, 'Balance sheet size is required'),
  turnover: z.coerce.number().min(1, 'Turnover is required'),
  numberOfEmployees: z.coerce.number().min(1, 'Number of employees must be at least 1'),
  country: z.string().min(2, 'Country is required'),
})

export type CompanyInfoData = z.infer<typeof companyInfoSchema>

export const companyInfoFields = [
  {
    name: 'organizationName',
    label: 'Organization Name',
    type: 'text',
    placeholder: 'ACME Corporation AS',
  },
  {
    name: 'organizationNumber',
    label: 'Organization Number',
    type: 'text',
    placeholder: '123456789',
  },
  {
    name: 'legalForm',
    label: 'Legal Form',
    type: 'select',
    placeholder: 'Select legal form',
    options: [
      { label: 'Aksjeselskap (AS)', value: 'as' },
      { label: 'Allmennaksjeselskap (ASA)', value: 'asa' },
      { label: 'Ansvarlig selskap (ANS)', value: 'ans' },
      { label: 'Enkeltpersonforetak (ENK)', value: 'enk' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    name: 'website',
    label: 'Website (Optional)',
    type: 'url',
    placeholder: 'https://www.acme.com',
  },
  {
    name: 'contactPersonName',
    label: 'Contact Person Name',
    type: 'text',
    placeholder: 'John Smith',
  },
  {
    name: 'contactPersonEmail',
    label: 'Contact Person Email',
    type: 'email',
    placeholder: 'john.smith@acme.com',
  },
  {
    name: 'naceCode',
    label: 'NACE Code',
    type: 'text',
    placeholder: '62.010',
  },
  {
    name: 'balanceSheetSize',
    label: 'Balance Sheet Size (€)',
    type: 'number',
    placeholder: '#',
  },
  {
    name: 'turnover',
    label: 'Annual Turnover (€)',
    type: 'number',
    placeholder: '#',
  },
  {
    name: 'numberOfEmployees',
    label: 'Number of Employees',
    type: 'number',
    placeholder: '#',
  },
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    placeholder: 'Select country',
    options: [
      { label: 'Norway', value: 'norway' },
      { label: 'Sweden', value: 'sweden' },
      { label: 'Denmark', value: 'denmark' },
      { label: 'Finland', value: 'finland' },
      { label: 'Other EU Country', value: 'other-eu' },
    ],
  },
] as const

export const companyInfoStepConfig = {
  id: 'company-info',
  title: 'Company Information',
  description: 'Basic organization details',
  schema: companyInfoSchema,
  fields: companyInfoFields,
} as const