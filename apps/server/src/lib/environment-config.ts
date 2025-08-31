/**
 * Environment Configuration Management
 *
 * This module provides centralized environment configuration for different deployment environments.
 * Used by:
 * - Database connections to determine correct database names
 * - Service configurations to apply environment-specific settings
 * - Deployment scripts to validate environment setup
 *
 * Purpose: Ensures consistent environment-based configuration across the application
 * with proper validation and fallbacks
 */

/**
 * Environment types supported by the application
 * Used by: Configuration functions to apply environment-specific settings
 * Purpose: Provides type safety for environment-based configuration
 */
export type Environment = 'development' | 'test' | 'staging' | 'production'

/**
 * Environment-specific database configuration
 * Used by: Database clients to connect to correct databases per environment
 * Purpose: Maps environments to their corresponding database names
 */
interface EnvironmentDatabaseConfig {
  external: {
    defaultDatabase: string
    fallbackDatabase: string
  }
}

/**
 * Database name mappings for different environments
 * Used by: getEnvironmentDatabaseConfig() to determine database names
 * Purpose: Centralizes database naming conventions per environment
 */
const ENVIRONMENT_DATABASE_CONFIG: Record<
  Environment,
  EnvironmentDatabaseConfig
> = {
  development: {
    external: {
      defaultDatabase: 'co2-intensities-dev',
      fallbackDatabase: 'development',
    },
  },
  test: {
    external: {
      defaultDatabase: 'co2-intensities-test',
      fallbackDatabase: 'test',
    },
  },
  staging: {
    external: {
      defaultDatabase: 'co2-intensities-staging',
      fallbackDatabase: 'staging',
    },
  },
  production: {
    external: {
      defaultDatabase: 'co2-intensities',
      fallbackDatabase: 'production',
    },
  },
}

/**
 * Get current environment with validation
 * Used by: All configuration functions to determine current environment
 * Purpose: Provides validated environment with fallback to development
 */
export function getCurrentEnvironment(): Environment {
  const nodeEnv = process.env.NODE_ENV?.toLowerCase()

  // Map NODE_ENV values to our environment types
  switch (nodeEnv) {
    case 'production':
      return 'production'
    case 'staging':
      return 'staging'
    case 'test':
      return 'test'
    case 'development':
    default:
      return 'development'
  }
}

/**
 * Get database configuration for current environment
 * Used by: Database clients and services to determine database names
 * Purpose: Provides environment-appropriate database configuration with fallbacks
 */
export function getEnvironmentDatabaseConfig(): EnvironmentDatabaseConfig {
  const environment = getCurrentEnvironment()
  return ENVIRONMENT_DATABASE_CONFIG[environment]
}

/**
 * Get external database name for current environment
 * Used by: External database client and services
 * Purpose: Determines correct external database name with environment variable override
 */
export function getExternalDatabaseName(): string {
  // Allow environment variable override
  const envOverride = process.env.EXTERNAL_DATABASE_NAME
  if (envOverride) {
    return envOverride
  }

  // Use environment-based configuration
  const config = getEnvironmentDatabaseConfig()
  return config.external.defaultDatabase
}

/**
 * Validate environment configuration
 * Used by: Application startup to ensure proper configuration
 * Purpose: Validates that all required environment variables are set
 */
export function validateEnvironmentConfig(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required environment variables
  if (!process.env.PRIMARY_DATABASE_URL) {
    errors.push('PRIMARY_DATABASE_URL is required')
  }

  if (!process.env.SCOPE321_DATABASE_URL) {
    errors.push('SCOPE321_DATABASE_URL is required')
  }

  if (!process.env.CLERK_SECRET_KEY) {
    errors.push('CLERK_SECRET_KEY is required')
  }

  // Check optional but recommended variables
  if (!process.env.EXTERNAL_DATABASE_NAME) {
    warnings.push('EXTERNAL_DATABASE_NAME not set, using environment default')
  }

  if (!process.env.CORS_ORIGIN) {
    warnings.push('CORS_ORIGIN not set, using default')
  }

  // Validate database URLs format
  if (
    process.env.PRIMARY_DATABASE_URL &&
    !isValidMongoUrl(process.env.PRIMARY_DATABASE_URL)
  ) {
    errors.push('PRIMARY_DATABASE_URL is not a valid MongoDB connection string')
  }

  if (
    process.env.SCOPE321_DATABASE_URL &&
    !isValidMongoUrl(process.env.SCOPE321_DATABASE_URL)
  ) {
    errors.push(
      'SCOPE321_DATABASE_URL is not a valid MongoDB connection string'
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate MongoDB connection URL format
 * Used by: validateEnvironmentConfig() to check URL validity
 * Purpose: Ensures MongoDB URLs are properly formatted
 */
function isValidMongoUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'mongodb:' || parsed.protocol === 'mongodb+srv:'
  } catch {
    return false
  }
}

/**
 * Get environment-specific configuration summary
 * Used by: Status and debugging scripts to show current configuration
 * Purpose: Provides visibility into current environment configuration
 */
export function getEnvironmentSummary() {
  const environment = getCurrentEnvironment()
  const databaseConfig = getEnvironmentDatabaseConfig()
  const externalDbName = getExternalDatabaseName()
  const validation = validateEnvironmentConfig()

  return {
    environment,
    databaseConfig: {
      external: {
        configured: externalDbName,
        default: databaseConfig.external.defaultDatabase,
        fallback: databaseConfig.external.fallbackDatabase,
      },
    },
    validation,
    environmentVariables: {
      NODE_ENV: process.env.NODE_ENV,
      EXTERNAL_DATABASE_NAME: process.env.EXTERNAL_DATABASE_NAME,
      PRIMARY_DATABASE_URL: process.env.PRIMARY_DATABASE_URL
        ? 'Set'
        : 'Not set',
      SCOPE321_DATABASE_URL: process.env.SCOPE321_DATABASE_URL
        ? 'Set'
        : 'Not set',
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set',
    },
  }
}

/**
 * Environment-specific feature flags
 * Used by: Application features to enable/disable functionality per environment
 * Purpose: Controls feature availability based on environment
 */
export function getEnvironmentFeatures() {
  const environment = getCurrentEnvironment()

  return {
    enableDebugLogging: environment === 'development',
    enableQueryLogging: environment === 'development' || environment === 'test',
    enableDevTools: environment === 'development',
    enableDetailedErrors: environment !== 'production',
    enablePerformanceMonitoring:
      environment === 'production' || environment === 'staging',
    enableExternalDataCaching:
      environment === 'production' || environment === 'staging',
  }
}
