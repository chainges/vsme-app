/**
 * Form validation schemas and utilities
 */

export {
  type BusinessModelStepData,
  businessModelSchema,
  businessModelSchemaWithConditionals,
  type CompleteFormData,
  createDefaultFormData,
  getFieldErrorMessage,
  getFieldErrors,
  // Type inference helpers
  type OrganizationStepData,
  organizationFormSchema,
  organizationFormSchemaWithConditionals,
  // Main schemas
  organizationSchema,
  type SustainabilityStepData,
  // Step schemas
  stepSchemas,
  sustainabilitySchema,
  sustainabilitySchemaWithConditionals,
  validateSelectedInitiatives,
  // Validation helpers
  validateStep,
  validateSubsidiariesConditional,
} from './sustainability-schemas'
