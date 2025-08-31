/**
 * External Data Type Definitions
 *
 * This module defines TypeScript types for external database structures.
 * Used by:
 * - External data services for type safety
 * - API endpoints for request/response typing
 * - Frontend components for data structure validation
 *
 * Purpose: Provides type safety for external data operations
 * and ensures consistency across the application
 */

/**
 * Base external resource structure
 * Used by: External data fetching and validation
 * Purpose: Defines the common structure of external resources
 */
export interface ExternalResource {
  id: string
  name: string
  data: Record<string, any>
  createdAt: string
  updatedAt?: string
  source?: string
}

/**
 * External API response wrapper with metadata
 * Used by: API endpoints to provide consistent response format
 * Purpose: Standardizes external data responses with pagination info
 */
export interface ExternalApiResponse<T> {
  data: T[]
  metadata: {
    total: number
    page: number
    limit: number
    source: string
    fetchedAt: string
    hasMore?: boolean
  }
}

/**
 * External query options for filtering and pagination
 * Used by: External data service methods for query construction
 * Purpose: Provides consistent query interface across external operations
 */
export interface ExternalQueryOptions {
  limit?: number
  offset?: number
  sort?: Record<string, 1 | -1>
  filters?: ExternalQueryFilters
}

/**
 * External query filters
 * Used by: Search and filtering functionality
 * Purpose: Defines available filter options for external data queries
 */
export interface ExternalQueryFilters {
  name?: string
  category?: string
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  [key: string]: any
}

/**
 * External database connection configuration
 * Used by: External database client initialization
 * Purpose: Defines connection parameters for external databases
 */
export interface ExternalDbConfig {
  connectionUrl: string
  databaseName: string
  options?: {
    maxPoolSize?: number
    minPoolSize?: number
    maxIdleTimeMS?: number
    serverSelectionTimeoutMS?: number
    socketTimeoutMS?: number
    connectTimeoutMS?: number
  }
}

/**
 * External data statistics
 * Used by: Dashboard analytics and monitoring
 * Purpose: Provides insights into external data availability and health
 */
export interface ExternalDataStats {
  totalResources: number
  availableDatabases: string[]
  lastUpdated: string
  connectionHealth: boolean
  responseTime?: number
}

/**
 * External data search result
 * Used by: Search functionality and resource discovery
 * Purpose: Represents search results with relevance scoring
 */
export interface ExternalSearchResult extends ExternalResource {
  relevanceScore?: number
  matchedFields?: string[]
  highlights?: Record<string, string[]>
}

/**
 * External data aggregation result
 * Used by: Analytics and reporting features
 * Purpose: Represents aggregated data from external sources
 */
export interface ExternalAggregationResult {
  _id: any
  count: number
  data: Record<string, any>
}

/**
 * External data sync status
 * Used by: Data synchronization processes
 * Purpose: Tracks synchronization state between external and internal data
 */
export interface ExternalSyncStatus {
  lastSyncAt: string
  status: 'pending' | 'syncing' | 'completed' | 'failed'
  recordsProcessed: number
  recordsTotal: number
  errors?: string[]
}

/**
 * External data validation result
 * Used by: Data validation processes
 * Purpose: Reports on data quality and validation issues
 */
export interface ExternalDataValidation {
  isValid: boolean
  errors: Array<{
    field: string
    message: string
    value: any
  }>
  warnings: Array<{
    field: string
    message: string
    value: any
  }>
}

/**
 * External database health check result
 * Used by: Health monitoring and alerting
 * Purpose: Reports on external database connectivity and performance
 */
export interface ExternalDbHealthCheck {
  isHealthy: boolean
  responseTime: number
  lastChecked: string
  errors?: string[]
  databases: Array<{
    name: string
    accessible: boolean
    collections: number
  }>
}

/**
 * External data cache entry
 * Used by: Caching layer for external data
 * Purpose: Represents cached external data with expiration
 */
export interface ExternalDataCacheEntry<T> {
  data: T
  cachedAt: string
  expiresAt: string
  source: string
  key: string
}

/**
 * External data error types
 * Used by: Error handling and reporting
 * Purpose: Categorizes different types of external data errors
 */
export type ExternalDataErrorType =
  | 'connection_failed'
  | 'timeout'
  | 'validation_failed'
  | 'not_found'
  | 'access_denied'
  | 'rate_limited'
  | 'server_error'

/**
 * External data error details
 * Used by: Error handling and debugging
 * Purpose: Provides detailed error information for external data operations
 */
export interface ExternalDataError {
  type: ExternalDataErrorType
  message: string
  details?: Record<string, any>
  timestamp: string
  operation: string
  retryable: boolean
}

/**
 * Utility types for external data operations
 */

// Partial external resource for updates
export type PartialExternalResource = Partial<ExternalResource>

// External resource without system fields
export type ExternalResourceInput = Omit<
  ExternalResource,
  'id' | 'createdAt' | 'updatedAt'
>

// External query result with pagination
export type PaginatedExternalResult<T> = ExternalApiResponse<T>

// External data operation result
export type ExternalOperationResult<T> = {
  success: boolean
  data?: T
  error?: ExternalDataError
}

/**
 * Type guards for external data validation
 * Used by: Runtime type checking and validation
 * Purpose: Provides type safety for external data at runtime
 */

export function isExternalResource(obj: any): obj is ExternalResource {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.data === 'object' &&
    typeof obj.createdAt === 'string'
  )
}

export function isExternalApiResponse<T>(
  obj: any
): obj is ExternalApiResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray(obj.data) &&
    typeof obj.metadata === 'object' &&
    typeof obj.metadata.total === 'number' &&
    typeof obj.metadata.page === 'number' &&
    typeof obj.metadata.limit === 'number'
  )
}

export function isExternalDataError(obj: any): obj is ExternalDataError {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.type === 'string' &&
    typeof obj.message === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.operation === 'string' &&
    typeof obj.retryable === 'boolean'
  )
}
