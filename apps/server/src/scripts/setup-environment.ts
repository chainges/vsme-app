#!/usr/bin/env bun

/** biome-ignore-all lint/suspicious/noConsole: <explanation> */
/**
 * Environment Setup Script
 *
 * This script helps set up environment-specific configuration.
 * Used by: Deployment scripts and environment setup
 * Purpose: Validates and configures environment-specific settings
 */

import {
  getCurrentEnvironment,
  getEnvironmentSummary,
  validateEnvironmentConfig,
} from '../lib/environment-config'

function main() {
  const targetEnv = process.argv[2] as
    | 'development'
    | 'test'
    | 'staging'
    | 'production'

  try {
    console.log('🔧 Environment Setup and Validation')
    console.log('===================================')

    if (
      targetEnv &&
      !['development', 'test', 'staging', 'production'].includes(targetEnv)
    ) {
      console.error(
        '❌ Invalid environment. Use: development, test, staging, or production'
      )
      process.exit(1)
    }

    // Get current environment summary
    const envSummary = getEnvironmentSummary()
    const currentEnv = getCurrentEnvironment()

    console.log(`\n📋 Current Environment: ${currentEnv}`)

    if (targetEnv && targetEnv !== currentEnv) {
      console.log(`🎯 Target Environment: ${targetEnv}`)
      console.log(`⚠️  Note: Set NODE_ENV=${targetEnv} to switch environments`)
    }

    // Show database configuration
    console.log('\n🗄️  Database Configuration:')
    console.log(
      `   External Database: ${envSummary.databaseConfig.external.configured}`
    )
    console.log(
      `   Default for ${currentEnv}: ${envSummary.databaseConfig.external.default}`
    )
    console.log(`   Fallback: ${envSummary.databaseConfig.external.fallback}`)

    // Validate configuration
    const validation = validateEnvironmentConfig()

    if (validation.errors.length > 0) {
      console.log('\n❌ Configuration Errors:')
      for (const error of validation.errors) {
        console.log(`   - ${error}`)
      }
    }

    if (validation.warnings.length > 0) {
      console.log('\n⚠️  Configuration Warnings:')
      for (const warning of validation.warnings) {
        console.log(`   - ${warning}`)
      }
    }

    if (validation.isValid) {
      console.log('\n✅ Environment configuration is valid')
    }

    // Show environment variables status
    console.log('\n🔐 Environment Variables:')
    for (const [key, value] of Object.entries(
      envSummary.environmentVariables
    )) {
      console.log(`   ${key}: ${value}`)
    }

    // Show recommended .env setup for target environment
    if (targetEnv) {
      console.log(`\n📝 Recommended .env setup for ${targetEnv}:`)
      showEnvironmentTemplate(targetEnv)
    }

    console.log('\n🎉 Environment setup completed!')
    process.exit(validation.isValid ? 0 : 1)
  } catch (error) {
    console.error('💥 Environment setup failed:', error)
    process.exit(1)
  }
}

/**
 * Show environment template for specific environment
 * Used by: main() to provide setup guidance
 * Purpose: Shows recommended environment variable values
 */
function showEnvironmentTemplate(environment: string) {
  const templates = {
    development: {
      NODE_ENV: 'development',
      EXTERNAL_DATABASE_NAME: 'co2-intensities-dev',
      PRIMARY_DATABASE_URL:
        'mongodb+srv://user:pass@cluster.mongodb.net/app_dev',
      SCOPE321_DATABASE_URL:
        'mongodb+srv://user:pass@cluster.mongodb.net/co2-intensities-dev',
    },
    test: {
      NODE_ENV: 'test',
      EXTERNAL_DATABASE_NAME: 'co2-intensities-test',
      PRIMARY_DATABASE_URL:
        'mongodb+srv://user:pass@cluster.mongodb.net/app_test',
      SCOPE321_DATABASE_URL:
        'mongodb+srv://user:pass@cluster.mongodb.net/co2-intensities-test',
    },
    staging: {
      NODE_ENV: 'staging',
      EXTERNAL_DATABASE_NAME: 'co2-intensities-staging',
      PRIMARY_DATABASE_URL:
        'mongodb+srv://user:pass@cluster.mongodb.net/app_staging',
      SCOPE321_DATABASE_URL:
        'mongodb+srv://user:pass@cluster.mongodb.net/co2-intensities-staging',
    },
    production: {
      NODE_ENV: 'production',
      EXTERNAL_DATABASE_NAME: 'co2-intensities',
      PRIMARY_DATABASE_URL:
        'mongodb+srv://user:pass@cluster.mongodb.net/app_production',
      SCOPE321_DATABASE_URL:
        'mongodb+srv://user:pass@cluster.mongodb.net/co2-intensities',
    },
  }

  const template = templates[environment as keyof typeof templates]
  if (template) {
    for (const [key, value] of Object.entries(template)) {
      console.log(`   ${key}=${value}`)
    }
  }
}

// Run the script
main()
