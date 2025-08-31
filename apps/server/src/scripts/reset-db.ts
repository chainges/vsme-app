#!/usr/bin/env bun

/**
 * Database Reset Script
 *
 * This script completely resets the database and reseeds it.
 * Used by: Development workflow when you need a fresh start
 * Purpose: Provides a clean slate for development and testing
 */

import {
  cleanupDevelopmentData,
  seedDevelopmentData,
} from '../lib/seeds/development-seed'

async function main() {
  try {
    // Safety check - prevent accidental production reset
    if (process.env.NODE_ENV === 'production') {
      console.error('🚫 Cannot reset production database!')
      console.error('This script is only for development environments.')
      process.exit(1)
    }

    console.log('⚠️  WARNING: This will completely reset your database!')
    console.log('🧹 Cleaning all data...')

    // Clean up all development data
    await cleanupDevelopmentData()

    // Also clean up any other test data
    await cleanupAllTestData()

    console.log('🌱 Reseeding with fresh development data...')
    await seedDevelopmentData()

    console.log('🎉 Database reset completed!')
    console.log('Your database now contains fresh development data.')

    process.exit(0)
  } catch (error) {
    console.error('💥 Database reset failed:', error)
    process.exit(1)
  }
}

/**
 * Clean up any additional test data
 * Used by: main() to ensure complete database cleanup
 * Purpose: Removes any test data that might not be caught by development cleanup
 */
async function cleanupAllTestData() {
  const { prisma } = await import('../lib/prisma')

  try {
    // Clean up any test data with specific patterns
    await prisma.report.deleteMany({
      where: {
        OR: [
          { organizationId: { contains: 'test' } },
          { organizationId: { contains: 'demo' } },
        ],
      },
    })

    await prisma.company.deleteMany({
      where: {
        OR: [
          { organizationId: { contains: 'test' } },
          { organizationId: { contains: 'demo' } },
        ],
      },
    })

    await prisma.user.deleteMany({
      where: {
        OR: [
          { clerkId: { contains: 'test' } },
          { clerkId: { contains: 'demo' } },
          { email: { contains: 'test' } },
          { email: { contains: 'example.com' } },
        ],
      },
    })

    console.log('✅ Additional test data cleaned up')
  } catch (error) {
    console.warn('⚠️  Warning: Could not clean all test data:', error)
    // Don't fail the script for this
  }
}

// Run the script
main()
