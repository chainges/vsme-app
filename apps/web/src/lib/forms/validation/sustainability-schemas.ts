import { z } from 'zod'

// Re-export types and schemas from sustainability-types.ts
export type {
  InitiativeType,
  SustainabilityInitiative,
  SustainabilityInitiatives,
} from '../types/sustainability-types'
export {
  initiativeTypeSchema,
  sustainabilityInitiativeSchema,
  sustainabilityInitiativesSchema,
} from '../types/sustainability-types'

// Schema for the sustainability initiatives step
export const sustainabilityInitiativesStepSchema = z.object({
  initiatives: z.array(
    z.object({
      type: z.enum([
        'Workforce Development',
        'Biodiversity',
        'Climate Change',
        'Business Ethics',
        'Circular Economy',
        'Community Impact',
        'Marine Resources',
        'Stakeholder Engagement',
      ]),
      responsiblePerson: z.string().min(2, 'Responsible person name must be at least 2 characters'),
      goal: z.string().min(10, 'Goal must be at least 10 characters'),
      description: z.string().min(20, 'Description must be at least 20 characters'),
      isSelected: z.boolean(),
    })
  ),
})

// Type for the sustainability initiatives step data
export type SustainabilityInitiativesStepData = z.infer<typeof sustainabilityInitiativesStepSchema>
