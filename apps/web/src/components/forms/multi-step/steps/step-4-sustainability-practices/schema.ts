import { z } from 'zod'

export const sustainabilitySchema = z.object({
  hasPracticesPolicies: z.boolean(),
  sustainabilityCertifications: z.string().optional(),
  practicesDescription: z
    .string()
    .min(10, 'Please provide a description of at least 10 characters')
    .optional(),
})

export type SustainabilityData = z.infer<typeof sustainabilitySchema>

export const sustainabilityFields = [
  {
    name: 'hasPracticesPolicies',
    label: 'Sustainability Practices',
    type: 'checkbox',
    description:
      'We have practices, policies, or future initiatives for transitioning towards a more sustainable economy',
  },
  {
    name: 'sustainabilityCertifications',
    label: 'Sustainability Certifications',
    type: 'textarea',
    placeholder: 'Describe any sustainability-related certifications or labels...',
  },
  {
    name: 'practicesDescription',
    label: 'Practices Description',
    type: 'textarea',
    placeholder: 'Describe your sustainability practices, policies, or initiatives...',
  },
] as const

export const sustainabilityStepConfig = {
  id: 'sustainability',
  title: 'Sustainability Practices',
  description: 'Your current sustainability initiatives',
  schema: sustainabilitySchema,
  fields: sustainabilityFields,
} as const
