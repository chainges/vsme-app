/**
 * External Database Configuration
 *
 * This module provides configuration management for external database connections.
 * Used by:
 * - External database client for connection setup
 * - Environment-specific configuration loading
 * - Connection pool and timeout management
 *
 * Purpose: Centralizes external database configuration with environment-specific
 * settings and proper validation
 */

import type { ExternalDbConfig } from '../types/external-data'
import {
  getCurrentEnvironment,
  getExternalDatabaseName,
} from './environment-config'

/**
 * Default connection options for external databases
 * Used by: External database client initialization
 * Purpose: Provides sensible defaults for external database connections
 */
const DEFAULT_CONNECTION_OPTIONS = {
  // Connection pool settings
  maxPoolSize: 5, // Smaller pool for external connections
  minPoolSize: 1,

  // Timeout settings (shorter for external connections)
  maxIdleTimeMS: 30_000, // 30 seconds
  serverSelectionTimeoutMS: 5000, // 5 seconds
  socketTimeoutMS: 10_000, // 10 seconds
  connectTimeoutMS: 10_000, // 10 seconds

  // Read preferences for external data
  retryWrites: false, // Read-only operations
  readPreference: 'secondary' as const, // Prefer secondary for reads

  // Application identification
  appName: 'ESG-App-External-Client',

  // Compression and performance
  compressors: ['zlib'],
  zlibCompressionLevel: 6,
}

/**
 * Environment-specific connection options
 * Used by: getExternalDbConfig() to apply environment-specific settings
 * Purpose: Adjusts connection parameters based on deployment environment
 */
const ENVIRONMENT_OPTIONS = {
  development: {
    ...DEFAULT_CONNECTION_OPTIONS,
    maxPoolSize: 3, // Smaller pool for development
    serverSelectionTimeoutMS: 10_000, // Longer timeout for development
  },

  production: {
    ...DEFAULT_CONNECTION_OPTIONS,
    maxPoolSize: 10, // Larger pool for production
    minPoolSize: 2,
    serverSelectionTimeoutMS: 3000, // Shorter timeout for production
    socketTimeoutMS: 5000,
  },

  test: {
    ...DEFAULT_CONNECTION_OPTIONS,
    maxPoolSize: 2, // Minimal pool for testing
    minPoolSize: 0,
    serverSelectionTimeoutMS: 2000, // Very short timeout for tests
    socketTimeoutMS: 3000,
  },
}

/**
 * Get external database configuration for current environment
 * Used by: External database client initialization
 * Purpose: Provides environment-appropriate configuration with validation
 */
export function getExternalDbConfig(): ExternalDbConfig {
  const environment =
    getCurrentEnvironment() as keyof typeof ENVIRONMENT_OPTIONS
  const connectionUrl = process.env.SCOPE321_DATABASE_URL

  if (!connectionUrl) {
    throw new Error(
      'External database URL not configured. Set SCOPE321_DATABASE_URL environment variable.'
    )
  }

  // Validate connection URL format
  if (
    !(
      connectionUrl.startsWith('mongodb://') ||
      connectionUrl.startsWith('mongodb+srv://')
    )
  ) {
    throw new Error(
      'Invalid external database URL format. Must start with mongodb:// or mongodb+srv://'
    )
  }

  const options =
    ENVIRONMENT_OPTIONS[environment] || ENVIRONMENT_OPTIONS.development

  // Get database name using environment configuration
  const databaseName = getExternalDatabaseName()

  return {
    connectionUrl,
    databaseName,
    options,
  }
}

/**
 * Get connection options for specific use case
 * Used by: External database operations that need custom connection settings
 * Purpose: Provides specialized connection options for different operation types
 */
export function getConnectionOptionsForUseCase(
  useCase: 'analytics' | 'realtime' | 'bulk' | 'default'
) {
  const baseOptions =
    getExternalDbConfig().options || DEFAULT_CONNECTION_OPTIONS

  switch (useCase) {
    case 'analytics':
      // Optimized for long-running analytical queries
      return {
        ...baseOptions,
        maxPoolSize: 2, // Fewer connections for long queries
        socketTimeoutMS: 60_000, // 1 minute timeout
        serverSelectionTimeoutMS: 10_000,
        readPreference: 'secondary' as const,
        readConcern: { level: 'available' as const }, // Faster reads
      }

    case 'realtime':
      // Optimized for quick, frequent queries
      return {
        ...baseOptions,
        maxPoolSize: 8, // More connections for frequent queries
        socketTimeoutMS: 3000, // Quick timeout
        serverSelectionTimeoutMS: 2000,
        readPreference: 'primaryPreferred' as const, // Prefer fresh data
      }

    case 'bulk':
      // Optimized for bulk data operations
      return {
        ...baseOptions,
        maxPoolSize: 3, // Moderate pool size
        socketTimeoutMS: 30_000, // Longer timeout for bulk ops
        serverSelectionTimeoutMS: 5000,
        readPreference: 'secondary' as const,
        batchSize: 1000, // Larger batch size
      }

    default:
      return baseOptions
  }
}

/**
 * Validate external database configuration
 * Used by: Application startup to verify configuration
 * Purpose: Ensures external database configuration is valid before use
 */
export function validateExternalDbConfig(config: ExternalDbConfig): boolean {
  try {
    // Check required fields
    if (!config.connectionUrl) {
      throw new Error('Connection URL is required')
    }

    if (!config.databaseName) {
      throw new Error('Database name is required')
    }

    // Validate URL format
    const url = new URL(config.connectionUrl)
    if (!['mongodb:', 'mongodb+srv:'].includes(url.protocol)) {
      throw new Error('Invalid MongoDB connection URL protocol')
    }

    // Validate options if provided
    if (config.options) {
      const { maxPoolSize, minPoolSize, socketTimeoutMS } = config.options

      if (maxPoolSize && maxPoolSize < 1) {
        throw new Error('maxPoolSize must be at least 1')
      }

      if (minPoolSize && minPoolSize < 0) {
        throw new Error('minPoolSize cannot be negative')
      }

      if (maxPoolSize && minPoolSize && minPoolSize > maxPoolSize) {
        throw new Error('minPoolSize cannot be greater than maxPoolSize')
      }

      if (socketTimeoutMS && socketTimeoutMS < 1000) {
        throw new Error('socketTimeoutMS should be at least 1000ms')
      }
    }

    return true
  } catch (error) {
    console.error('External database configuration validation failed:', error)
    return false
  }
}

/**
 * Get retry configuration for external database operations
 * Used by: External database client for retry logic
 * Purpose: Provides retry settings for different types of failures
 */
export function getRetryConfig() {
  return {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10_000,
    backoffMultiplier: 2,
    retryableErrors: [
      'MongoNetworkError',
      'MongoTimeoutError',
      'MongoServerSelectionError',
    ],
  }
}

/**
 * Get health check configuration
 * Used by: Health monitoring and connection validation
 * Purpose: Defines health check parameters for external databases
 */
export function getHealthCheckConfig() {
  return {
    intervalMs: 30_000, // Check every 30 seconds
    timeoutMs: 5000, // 5 second timeout for health checks
    failureThreshold: 3, // Mark unhealthy after 3 failures
    recoveryThreshold: 2, // Mark healthy after 2 successes
  }
}

/**
 * Get monitoring configuration
 * Used by: Performance monitoring and alerting
 * Purpose: Defines monitoring thresholds and settings
 */
export function getMonitoringConfig() {
  return {
    slowQueryThresholdMs: 5000, // Log queries slower than 5 seconds
    connectionPoolWarningThreshold: 0.8, // Warn when pool is 80% full
    errorRateThreshold: 0.1, // Alert when error rate exceeds 10%
    responseTimeThreshold: 2000, // Alert when response time exceeds 2 seconds
  }
}
