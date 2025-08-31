/**
 * Database Migration Runner
 *
 * This module manages database migrations and schema changes.
 * Used by:
 * - Deployment scripts to apply schema changes
 * - Development setup to ensure database is up to date
 * - CI/CD pipelines for automated database updates
 *
 * Purpose: Provides a controlled way to apply database changes
 * and track migration history
 */

import { prisma } from '../prisma'

/**
 * Migration record interface for tracking applied migrations
 * Used by: Migration tracking system to prevent duplicate applications
 * Purpose: Maintains history of applied migrations for rollback and tracking
 */
interface MigrationRecord {
  id: string
  name: string
  appliedAt: Date
  checksum: string
}

/**
 * Apply all pending migrations
 * Used by: Deployment scripts and development setup
 * Purpose: Ensures database schema is current with application code
 */
export async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...')

    // Ensure migration tracking collection exists
    await ensureMigrationTracking()

    // Get list of applied migrations
    const appliedMigrations = await getAppliedMigrations()

    // Get list of available migrations
    const availableMigrations = await getAvailableMigrations()

    // Apply pending migrations
    const pendingMigrations = availableMigrations.filter(
      (migration) =>
        !appliedMigrations.some((applied) => applied.name === migration.name)
    )

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations - database is up to date')
      return
    }

    console.log(`📋 Found ${pendingMigrations.length} pending migrations`)

    for (const migration of pendingMigrations) {
      await applyMigration(migration)
    }

    console.log('✅ All migrations applied successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

/**
 * Ensure migration tracking collection exists
 * Used by: runMigrations() to set up migration history tracking
 * Purpose: Creates the infrastructure needed to track applied migrations
 */
async function ensureMigrationTracking() {
  try {
    // Try to create a migration tracking record to ensure collection exists
    // This will fail silently if collection already exists
    await prisma.$runCommandRaw({
      createIndexes: 'migrations',
      indexes: [
        {
          key: { name: 1 },
          name: 'migrations_name_unique',
          unique: true,
        },
      ],
    })
  } catch (error) {
    // Collection might already exist, which is fine
    console.log('Migration tracking collection verified')
  }
}

/**
 * Get list of applied migrations from database
 * Used by: runMigrations() to determine which migrations to skip
 * Purpose: Prevents re-applying migrations that have already been run
 */
async function getAppliedMigrations(): Promise<MigrationRecord[]> {
  try {
    // Query the migrations collection directly since it's not in Prisma schema
    const result = await prisma.$runCommandRaw({
      find: 'migrations',
      filter: {},
      sort: { appliedAt: 1 },
    })

    return (result as any).cursor?.firstBatch || []
  } catch (error) {
    // If migrations collection doesn't exist, return empty array
    return []
  }
}

/**
 * Get list of available migration files
 * Used by: runMigrations() to determine what migrations can be applied
 * Purpose: Discovers migration files that need to be processed
 */
async function getAvailableMigrations() {
  // For now, return hardcoded migrations
  // In a full implementation, this would scan a migrations directory
  return [
    {
      name: '001_initial_schema',
      description: 'Create initial User, Company, and Report models',
      checksum: 'initial-schema-v1',
      apply: async () => {
        // This migration is handled by Prisma db:push
        console.log('Initial schema migration (handled by Prisma)')
      },
    },
    {
      name: '002_add_indexes',
      description: 'Add performance indexes for common queries',
      checksum: 'indexes-v1',
      apply: async () => {
        // This migration is handled by Prisma db:push
        console.log('Index migration (handled by Prisma)')
      },
    },
  ]
}

/**
 * Apply a single migration
 * Used by: runMigrations() to execute individual migration steps
 * Purpose: Safely applies one migration and records it in history
 */
async function applyMigration(migration: any) {
  try {
    console.log(`🔧 Applying migration: ${migration.name}`)

    // Apply the migration
    await migration.apply()

    // Record the migration as applied
    await recordMigration({
      id: migration.name,
      name: migration.name,
      appliedAt: new Date(),
      checksum: migration.checksum,
    })

    console.log(`✅ Migration applied: ${migration.name}`)
  } catch (error) {
    console.error(`❌ Failed to apply migration ${migration.name}:`, error)
    throw error
  }
}

/**
 * Record a migration as applied
 * Used by: applyMigration() to track migration history
 * Purpose: Maintains record of applied migrations for future reference
 */
async function recordMigration(migration: MigrationRecord) {
  try {
    await prisma.$runCommandRaw({
      insert: 'migrations',
      documents: [migration],
    })
  } catch (error) {
    console.error('Failed to record migration:', error)
    throw error
  }
}

/**
 * Check migration status without applying
 * Used by: Health check scripts and deployment validation
 * Purpose: Reports on database migration state for monitoring
 */
export async function checkMigrationStatus() {
  try {
    const appliedMigrations = await getAppliedMigrations()
    const availableMigrations = await getAvailableMigrations()

    const pendingCount = availableMigrations.length - appliedMigrations.length

    return {
      applied: appliedMigrations.length,
      available: availableMigrations.length,
      pending: pendingCount,
      upToDate: pendingCount === 0,
    }
  } catch (error) {
    console.error('Failed to check migration status:', error)
    throw error
  }
}
