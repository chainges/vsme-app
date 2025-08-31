#!/usr/bin/env bun

/**
 * Database Status Script
 *
 * This script reports on the current state of the database.
 * Used by: Development workflow and deployment validation
 * Purpose: Provides visibility into database state and health
 */

import { testAllDatabases } from '../lib/database-test'
import { checkMigrationStatus } from '../lib/migrations/migration-runner'
import { validateProductionDatabase } from '../lib/seeds/production-seed'

async function main() {
  try {
    console.log('📊 Database Status Report')
    console.log('========================')

    // Test database connections
    console.log('\n🔗 Connection Status:')
    const connectionStatus = await testAllDatabases()

    if (!connectionStatus) {
      console.error('❌ Database connection failed - aborting status check')
      process.exit(1)
    }

    // Check migration status
    console.log('\n🔄 Migration Status:')
    const migrationStatus = await checkMigrationStatus()
    console.log(`   Applied: ${migrationStatus.applied}`)
    console.log(`   Available: ${migrationStatus.available}`)
    console.log(`   Pending: ${migrationStatus.pending}`)
    console.log(
      `   Status: ${migrationStatus.upToDate ? '✅ Up to date' : '⚠️  Migrations pending'}`
    )

    // Get data counts
    console.log('\n📈 Data Summary:')
    await getDataSummary()

    // Validate database health
    console.log('\n🏥 Health Check:')
    try {
      await validateProductionDatabase()
      console.log('   Status: ✅ Healthy')
    } catch (error) {
      console.log('   Status: ⚠️  Issues detected')
      console.log(`   Error: ${error}`)
    }

    // Environment info with detailed configuration
    console.log('\n🌍 Environment Configuration:')

    const { getEnvironmentSummary } = await import('../lib/environment-config')
    const envSummary = getEnvironmentSummary()

    console.log(`   Environment: ${envSummary.environment}`)
    console.log(
      `   External Database: ${envSummary.databaseConfig.external.configured}`
    )
    console.log(
      `   Primary DB: ${envSummary.environmentVariables.PRIMARY_DATABASE_URL}`
    )
    console.log(
      `   External DB: ${envSummary.environmentVariables.SCOPE321_DATABASE_URL}`
    )

    if (envSummary.validation.warnings.length > 0) {
      console.log('\n⚠️  Configuration Warnings:')
      for (const warning of envSummary.validation.warnings) {
        console.log(`   - ${warning}`)
      }
    }

    if (envSummary.validation.errors.length > 0) {
      console.log('\n❌ Configuration Errors:')
      for (const error of envSummary.validation.errors) {
        console.log(`   - ${error}`)
      }
    }

    console.log('\n✅ Status report completed')
    process.exit(0)
  } catch (error) {
    console.error('💥 Status check failed:', error)
    process.exit(1)
  }
}

/**
 * Get summary of data in the database
 * Used by: main() to report on database contents
 * Purpose: Provides visibility into current data state
 */
async function getDataSummary() {
  const { prisma } = await import('../lib/prisma')

  try {
    const [userCount, companyCount, reportCount] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.report.count(),
    ])

    console.log(`   Users: ${userCount}`)
    console.log(`   Companies: ${companyCount}`)
    console.log(`   Reports: ${reportCount}`)

    // Get some additional insights
    if (companyCount > 0) {
      const companiesByOrg = await prisma.company.groupBy({
        by: ['organizationId'],
        _count: { id: true },
      })

      console.log(`   Organizations with companies: ${companiesByOrg.length}`)
    }

    if (reportCount > 0) {
      const reportsByYear = await prisma.report.groupBy({
        by: ['year'],
        _count: { id: true },
        orderBy: { year: 'desc' },
      })

      console.log('   Reports by year:')
      for (const yearData of reportsByYear) {
        console.log(`     ${yearData.year}: ${yearData._count.id} reports`)
      }
    }
  } catch (error) {
    console.error('   ❌ Could not retrieve data summary:', error)
  }
}

// Run the script
main()
