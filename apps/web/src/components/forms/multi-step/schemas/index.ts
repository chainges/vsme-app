// Export individual schemas and configurations

// Export combined types
export * from '../types'

// Import company info from new location
import { companyInfoStepConfig } from '../steps/step-1-company-info/schema'
// Import business model from new location
import { businessModelStepConfig } from '../steps/step-2-business-model/schema'
// Import sustainability practices from new location
import { sustainabilityStepConfig } from '../steps/step-4-sustainability-practices/schema'

// Import sustainability initiatives from config
import { sustainabilityInitiativesStepConfig } from '@/lib/forms/configs/sustainability-initiatives-config'
// Step configurations array

export const stepConfigurations = [
  companyInfoStepConfig,
  businessModelStepConfig,
  sustainabilityInitiativesStepConfig,
  sustainabilityStepConfig,
] as const

export type StepConfigurationType = (typeof stepConfigurations)[number]