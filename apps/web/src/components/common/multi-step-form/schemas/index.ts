// Export individual schemas and configurations
export * from './company-info'
export * from './reporting-setup'
export * from './sustainability'

// Export combined types
export * from '../types'

// Step configurations array
import { companyInfoStepConfig } from './company-info'
import { reportingSetupStepConfig } from './reporting-setup'
import { sustainabilityStepConfig } from './sustainability'

export const stepConfigurations = [
  companyInfoStepConfig,
  reportingSetupStepConfig,
  sustainabilityStepConfig,
] as const

export type StepConfigurationType = typeof stepConfigurations[number]