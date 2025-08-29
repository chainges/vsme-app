import { sustainabilityInitiativesStepSchema } from '../validation/sustainability-schemas'

// This configuration is different from the others because it's a custom component
// We'll need to handle this specially in the multi-step form

export const sustainabilityInitiativesStepConfig = {
  id: 'sustainability-initiatives',
  title: 'Sustainability Initiatives',
  description: 'Report on the sustainability initiatives your organization is involved in',
  schema: sustainabilityInitiativesStepSchema,
  // This step will be handled as a custom component rather than field-based rendering
  fields: [],
} as const