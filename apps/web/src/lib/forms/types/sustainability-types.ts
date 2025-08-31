/**
 * Sustainability initiative types
 */
export type InitiativeType =
  | 'WorkforceDevelopment'
  | 'Biodiversity'
  | 'ClimateAction'
  | 'WasteReduction'
  | 'EnergyEfficiency'
  | 'WaterConservation'
  | 'CommunityEngagement'
  | 'SupplyChainSustainability'

/**
 * Initiative categories for UI grouping
 */
export const INITIATIVE_CATEGORIES = {
  environmental: [
    'Biodiversity',
    'ClimateAction',
    'WasteReduction',
    'EnergyEfficiency',
    'WaterConservation',
  ] as InitiativeType[],
  social: [
    'WorkforceDevelopment',
    'CommunityEngagement',
    'SupplyChainSustainability',
  ] as InitiativeType[],
} as const

/**
 * Initiative display names
 */
export const INITIATIVE_LABELS: Record<InitiativeType, string> = {
  WorkforceDevelopment: 'Workforce Development',
  Biodiversity: 'Biodiversity Conservation',
  ClimateAction: 'Climate Action',
  WasteReduction: 'Waste Reduction',
  EnergyEfficiency: 'Energy Efficiency',
  WaterConservation: 'Water Conservation',
  CommunityEngagement: 'Community Engagement',
  SupplyChainSustainability: 'Supply Chain Sustainability',
}

/**
 * Organization form data structure following TanStack Forms patterns
 */
export interface OrganizationFormData {
  // Step 1: Basic organization info
  organization: {
    name: string
    number: string
    naceCode: string
    industry: string
    revenue: number
    employeeCount: number
    contact: {
      name: string
      email: string
    }
  }

  // Step 2: Business model and subsidiaries
  businessModel: {
    description: string
    hasSubsidiaries: boolean
    subsidiaries: Array<{
      name: string
      organizationNumber: string
      address: string
    }>
  }

  // Step 3: Sustainability initiatives
  sustainability: {
    initiatives: Array<{
      type: InitiativeType
      selected: boolean
      description?: string
      goal?: string
      responsiblePerson?: string
    }>
  }
}

/**
 * Industry options for the organization form
 */
export const INDUSTRY_OPTIONS = [
  { label: 'Technology', value: 'technology' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Education', value: 'education' },
  { label: 'Retail', value: 'retail' },
  { label: 'Construction', value: 'construction' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Energy', value: 'energy' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Other', value: 'other' },
] as const
