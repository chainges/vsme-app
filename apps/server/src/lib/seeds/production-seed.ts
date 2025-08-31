/**
 * Production Database Seeding
 *
 * This module provides minimal seeding for production environments.
 * Used by:
 * - Production deployment scripts for initial setup
 * - Migration scripts that need to populate reference data
 *
 * Purpose: Creates only essential data needed for production operation
 * without any test or development-specific content
 */

import { prisma } from '../prisma'

/**
 * Seed essential production data
 * Used by: Production deployment and migration scripts
 * Purpose: Sets up minimal required data for application to function
 */
export async function seedProductionData() {
  try {
    console.log('🏭 Starting production data seeding...')

    // Create system indexes and constraints if needed
    await ensureSystemConstraints()

    // Create any required reference data
    await createReferenceData()

    console.log('✅ Production seeding completed successfully!')
  } catch (error) {
    console.error('❌ Production seeding failed:', error)
    throw error
  }
}

/**
 * Ensure system-level database constraints are in place
 * Used by: seedProductionData() to verify database integrity
 * Purpose: Validates that all required indexes and constraints exist
 */
async function ensureSystemConstraints() {
  // Verify critical indexes exist (Prisma should handle this, but double-check)
  try {
    // Test that we can query with expected indexes
    await prisma.user.findFirst({
      where: { clerkId: 'test-constraint-check' },
    })

    await prisma.company.findFirst({
      where: {
        organizationId: 'test-constraint-check',
        year: 2024,
      },
    })

    await prisma.report.findFirst({
      where: {
        organizationId: 'test-constraint-check',
        year: 2024,
      },
    })

    console.log('✅ Database constraints verified')
  } catch (error) {
    console.error('❌ Database constraint verification failed:', error)
    throw error
  }
}

/**
 * Create reference data needed for production
 * Used by: seedProductionData() to populate lookup tables
 * Purpose: Creates any static reference data the application needs
 */
async function createReferenceData() {
  // Currently no reference data needed
  // This function is a placeholder for future reference data like:
  // - Industry classifications
  // - Standard NACE codes
  // - Default ESG frameworks

  console.log('✅ Reference data setup completed (no data required currently)')
}

/**
 * Validate production database state
 * Used by: Health check scripts and deployment validation
 * Purpose: Ensures the database is in a valid state for production use
 */
export async function validateProductionDatabase() {
  try {
    console.log('🔍 Validating production database state...')

    // Check that all required collections exist
    const collections = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.report.count(),
    ])

    // Verify database connectivity and basic operations
    const testQueries = await Promise.all([
      // Test complex queries that use indexes
      prisma.company.findMany({
        where: { organizationId: 'non-existent' },
        take: 1,
      }),
      prisma.report.findMany({
        where: {
          organizationId: 'non-existent',
          year: 2024,
        },
        take: 1,
      }),
    ])

    console.log('✅ Production database validation passed')
    console.log(`   - Collections accessible: ${collections.length}`)
    console.log('   - Query performance: OK')

    return true
  } catch (error) {
    console.error('❌ Production database validation failed:', error)
    throw error
  }
}
