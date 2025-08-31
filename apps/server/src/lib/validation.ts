/**
 * Legacy Validation Schemas
 *
 * This file previously contained authentication validation schemas.
 * Since migrating to Clerk authentication, these schemas are no longer needed.
 *
 * For current validation schemas, see:
 * - ESG data validation: src/lib/validation/esg-schemas.ts
 * - Type definitions: src/types/esg-models.ts
 *
 * This file is kept for backward compatibility and will be removed
 * once all references are updated to use the new validation system.
 */

// Re-export the new validation schemas for backward compatibility
export * from './validation/esg-schemas'
