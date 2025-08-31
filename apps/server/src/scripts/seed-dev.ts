#!/usr/bin/env bun

/**
 * Development Database Seeding Script
 *
 * This script specifically seeds development data regardless of NODE_ENV.
 * Used by: npm run db:seed:dev command and development setup
 * Purpose: Forces development seeding for local development and testing
 */

import {
  cleanupDevelopmentData,
  seedDevelopmentData,
} from '../lib/seeds/development-seed'

async function main() {
  try {
    console.log('🧹 Cleaning existing development data...')
    await cleanupDevelopmentData()

    console.log('🌱 Seeding fresh development data...')
    await seedDevelopmentData()

    console.log('🎉 Development database seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('💥 Development seeding failed:', error)
    process.exit(1)
  }
}

// Run the script
main()
