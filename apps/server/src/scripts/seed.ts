#!/usr/bin/env bun

/**
 * Main Database Seeding Script
 *
 * This script determines the environment and runs appropriate seeding.
 * Used by: npm run db:seed command
 * Purpose: Provides a single entry point for seeding that adapts to environment
 */

import { seedDevelopmentData } from '../lib/seeds/development-seed'
import { seedProductionData } from '../lib/seeds/production-seed'

async function main() {
  const environment = process.env.NODE_ENV || 'development'

  try {
    console.log(
      `🌱 Starting database seeding for ${environment} environment...`
    )

    if (environment === 'production') {
      await seedProductionData()
    } else {
      await seedDevelopmentData()
    }

    console.log('🎉 Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('💥 Database seeding failed:', error)
    process.exit(1)
  }
}

// Run the script
main()
