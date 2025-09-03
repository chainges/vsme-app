import { z } from 'zod'

// Define the initiative types as a literal union
export const initiativeTypeSchema = z.enum([
  'Workforce Development',
  'Biodiversity',
  'Climate Change',
  'Business Ethics',
  'Circular Economy',
  'Community Impact',
  'Marine Resources',
  'Stakeholder Engagement',
])

// Schema for individual sustainability initiative
export const sustainabilityInitiativeSchema = z.object({
  type: initiativeTypeSchema,
  responsiblePerson: z.string().min(2, 'Responsible person name must be at least 2 characters'),
  goal: z.string().min(10, 'Goal must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  isSelected: z.boolean(),
})

// Schema for array of sustainability initiatives
export const sustainabilityInitiativesSchema = z.array(sustainabilityInitiativeSchema)

// Schema for the sustainability initiatives step
export const sustainabilityInitiativesStepSchema = z.object({
  initiatives: sustainabilityInitiativesSchema,
})

export const sustainabilityInitiativesStepConfig = {
  id: 'sustainability-initiatives',
  title: 'Sustainability Initiatives',
  description: 'Report on the sustainability initiatives your organization is involved in',
  schema: sustainabilityInitiativesStepSchema,
  // This step will be handled as a custom component rather than field-based rendering
  fields: [],
} as const

// Types for the schemas
export type InitiativeType = z.infer<typeof initiativeTypeSchema>
export type SustainabilityInitiative = z.infer<typeof sustainabilityInitiativeSchema>
export type SustainabilityInitiatives = z.infer<typeof sustainabilityInitiativesSchema>
export type SustainabilityInitiativesStepData = z.infer<typeof sustainabilityInitiativesStepSchema>
