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

export type InitiativeType = z.infer<typeof initiativeTypeSchema>

// Define the sustainability initiative interface
export interface SustainabilityInitiative {
  type: InitiativeType
  responsiblePerson: string
  goal: string
  description: string
  isSelected: boolean
}

// Zod schema for sustainability initiative validation
export const sustainabilityInitiativeSchema = z.object({
  type: initiativeTypeSchema,
  responsiblePerson: z.string().min(2, 'Responsible person name must be at least 2 characters'),
  goal: z.string().min(10, 'Goal must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  isSelected: z.boolean(),
})

// Zod schema for the array of sustainability initiatives
export const sustainabilityInitiativesSchema = z.array(sustainabilityInitiativeSchema)

// Type for the array of sustainability initiatives
export type SustainabilityInitiatives = z.infer<typeof sustainabilityInitiativesSchema>

// Extend the main form data to include sustainability initiatives
export interface SustainabilityData {
  initiatives: SustainabilityInitiative[]
}
