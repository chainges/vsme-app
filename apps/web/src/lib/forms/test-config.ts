import { z } from 'zod'
import type { MultiStepFormConfig, OrganizationFormData } from './types'

// Test configuration to verify our types work correctly
const testFormConfig: MultiStepFormConfig<OrganizationFormData> = {
  id: 'test-form',
  title: 'Test Multi-Step Form',
  description: 'A test form to verify our type system',
  steps: [
    {
      id: 'step1',
      title: 'Organization Info',
      schema: z.object({
        organization: z.object({
          name: z.string().min(1, 'Organization name is required'),
          number: z.string().min(1, 'Organization number is required'),
          naceCode: z.string().min(1, 'NACE code is required'),
          industry: z.string().min(1, 'Industry is required'),
          revenue: z.number().positive('Revenue must be positive'),
          employeeCount: z
            .number()
            .int()
            .positive('Employee count must be positive'),
          contact: z.object({
            name: z.string().min(1, 'Contact name is required'),
            email: z.email('Valid email is required'),
          }),
        }),
      }),
      fields: [
        {
          name: 'organization.name',
          type: 'text',
          label: 'Organization Name',
          required: true,
        },
        {
          name: 'organization.number',
          type: 'text',
          label: 'Organization Number',
          required: true,
        },
        {
          name: 'organization.industry',
          type: 'select',
          label: 'Industry',
          required: true,
          options: [
            { label: 'Technology', value: 'technology' },
            { label: 'Manufacturing', value: 'manufacturing' },
          ],
        },
      ],
    },
  ],
  onSubmit: async (data: OrganizationFormData) => {
    console.log('Form submitted:', data)
  },
}

// Export for testing purposes
export { testFormConfig }
