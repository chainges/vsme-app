// Export individual schemas and configurations

// Export combined types
export * from '../types'
export * from './company-info'
export * from './business-model'
export * from './sustainability'

// Step configurations array
import { companyInfoStepConfig } from './company-info'
import { businessModelStepConfig } from './business-model'
import { sustainabilityStepConfig } from './sustainability'
import { sustainabilityInitiativesStepConfig } from '@/lib/forms/configs/sustainability-initiatives-config'

export const stepConfigurations = [
  companyInfoStepConfig,
  businessModelStepConfig,
  sustainabilityInitiativesStepConfig,
  sustainabilityStepConfig,
] as const

export type StepConfigurationType = (typeof stepConfigurations)[number]
