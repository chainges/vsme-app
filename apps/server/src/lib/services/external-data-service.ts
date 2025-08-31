/**
 * External Data Service
 *
 * This service handles all operations with external MongoDB databases.
 * Used by:
 * - External data API endpoints for fetching shared data
 * - Data synchronization processes
 * - Reference data lookups from other applications
 *
 * Purpose: Provides a clean interface for external data operations
 * with proper validation, caching, and error handling
 */

import { z } from 'zod'
import { externalDb } from '../external-db'

/**
 * External resource data structure validation
 * Used by: External data fetching to ensure data integrity
 * Purpose: Validates external data matches expected structure
 */
const externalResourceSchema = z.object({
  _id: z.any().optional(),
  id: z.string().optional(),
  name: z.string(),
  data: z.record(z.any()).optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
})

/**
 * External API response wrapper
 * Used by: API endpoints to provide consistent response format
 * Purpose: Standardizes external data responses with metadata
 */
export interface ExternalApiResponse<T> {
  data: T[]
  metadata: {
    total: number
    page: number
    limit: number
    source: string
    fetchedAt: string
  }
}

/**
 * External data query options
 * Used by: External data fetching methods for filtering and pagination
 * Purpose: Provides consistent query interface for external data
 */
export interface ExternalQueryOptions {
  limit?: number
  offset?: number
  sort?: Record<string, 1 | -1>
  filters?: Record<string, any>
}

export class ExternalDataService {
  private readonly defaultDatabase: string

  constructor() {
    // Get database name from configuration
    const { getExternalDbConfig } = require('../external-db-config')
    const config = getExternalDbConfig()
    this.defaultDatabase = config.databaseName
  }

  /**
   * Fetch shared resources from external database
   * Used by: External data API endpoints and reference lookups
   * Purpose: Retrieves shared resources with validation and error handling
   */
  async getSharedResources(
    options: ExternalQueryOptions = {}
  ): Promise<ExternalApiResponse<any>> {
    try {
      const {
        limit = 20,
        offset = 0,
        sort = { createdAt: -1 },
        filters = {},
      } = options

      // Build query with filters
      const query = this.buildQuery(filters)

      // Execute query with pagination
      const [resources, total] = await Promise.all([
        externalDb.find(this.defaultDatabase, 'resources', query, {
          limit,
          skip: offset,
          sort,
        }),
        externalDb.count(this.defaultDatabase, 'resources', query),
      ])

      // Validate and transform data
      const validatedResources = resources.map((resource) => {
        try {
          return externalResourceSchema.parse(resource)
        } catch (validationError) {
          console.warn('External resource validation failed:', validationError)
          // Return sanitized version for invalid data
          return {
            id: resource._id?.toString() || resource.id || 'unknown',
            name: resource.name || 'Unknown Resource',
            data: resource.data || {},
            createdAt: resource.createdAt || new Date().toISOString(),
          }
        }
      })

      return {
        data: validatedResources,
        metadata: {
          total,
          page: Math.floor(offset / limit) + 1,
          limit,
          source: 'external-database',
          fetchedAt: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error('Failed to fetch shared resources:', error)
      throw new Error(`External data fetch failed: ${error}`)
    }
  }

  /**
   * Get specific shared resource by ID
   * Used by: External data detail views and reference lookups
   * Purpose: Retrieves single external resource with validation
   */
  async getSharedResourceById(id: string): Promise<any | null> {
    try {
      // Try both _id and id fields for flexibility
      const query = {
        $or: [{ _id: id }, { id }],
      }

      const resource = await externalDb.findOne(
        this.defaultDatabase,
        'resources',
        query
      )

      if (!resource) {
        return null
      }

      // Validate and return
      return externalResourceSchema.parse(resource)
    } catch (error) {
      console.error('Failed to fetch shared resource by ID:', error)
      throw new Error(`External resource fetch failed: ${error}`)
    }
  }

  /**
   * Search shared resources with text query
   * Used by: Search functionality and resource discovery
   * Purpose: Provides text-based search across external resources
   */
  async searchSharedResources(
    searchTerm: string,
    options: ExternalQueryOptions = {}
  ): Promise<ExternalApiResponse<any>> {
    try {
      const { limit = 20, offset = 0, sort = { createdAt: -1 } } = options

      // Build text search query
      const query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { 'data.description': { $regex: searchTerm, $options: 'i' } },
          { 'data.tags': { $in: [new RegExp(searchTerm, 'i')] } },
        ],
      }

      const [resources, total] = await Promise.all([
        externalDb.find(this.defaultDatabase, 'resources', query, {
          limit,
          skip: offset,
          sort,
        }),
        externalDb.count(this.defaultDatabase, 'resources', query),
      ])

      const validatedResources = resources.map((resource) =>
        externalResourceSchema.parse(resource)
      )

      return {
        data: validatedResources,
        metadata: {
          total,
          page: Math.floor(offset / limit) + 1,
          limit,
          source: 'external-database-search',
          fetchedAt: new Date().toISOString(),
        },
      }
    } catch (error) {
      console.error('Failed to search shared resources:', error)
      throw new Error(`External search failed: ${error}`)
    }
  }

  /**
   * Get external data statistics
   * Used by: Dashboard analytics and monitoring
   * Purpose: Provides insights into external data availability
   */
  async getExternalDataStats(): Promise<{
    totalResources: number
    availableDatabases: string[]
    lastUpdated: string
    connectionHealth: boolean
  }> {
    try {
      const [totalResources, databases, connectionHealth] = await Promise.all([
        externalDb.count(this.defaultDatabase, 'resources'),
        externalDb.listDatabases(),
        externalDb.testConnection(),
      ])

      return {
        totalResources,
        availableDatabases: databases,
        lastUpdated: new Date().toISOString(),
        connectionHealth,
      }
    } catch (error) {
      console.error('Failed to get external data stats:', error)
      return {
        totalResources: 0,
        availableDatabases: [],
        lastUpdated: new Date().toISOString(),
        connectionHealth: false,
      }
    }
  }

  /**
   * Get aggregated external data
   * Used by: Analytics and reporting features
   * Purpose: Provides aggregated views of external data
   */
  async getAggregatedData(pipeline: any[]): Promise<any[]> {
    try {
      return await externalDb.aggregate(
        this.defaultDatabase,
        'resources',
        pipeline
      )
    } catch (error) {
      console.error('Failed to get aggregated external data:', error)
      throw new Error(`External aggregation failed: ${error}`)
    }
  }

  /**
   * Build MongoDB query from filters
   * Used by: Query methods to construct proper MongoDB queries
   * Purpose: Converts filter options to MongoDB query format
   */
  private buildQuery(filters: Record<string, any>): Record<string, any> {
    const query: Record<string, any> = {}

    // Handle common filter patterns
    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === undefined) {
        continue
      }

      switch (key) {
        case 'name':
          // Case-insensitive name search
          query.name = { $regex: value, $options: 'i' }
          break

        case 'dateFrom':
          query.createdAt = { ...query.createdAt, $gte: new Date(value) }
          break

        case 'dateTo':
          query.createdAt = { ...query.createdAt, $lte: new Date(value) }
          break

        case 'tags':
          // Array contains any of the specified tags
          query['data.tags'] = { $in: Array.isArray(value) ? value : [value] }
          break

        case 'category':
          query['data.category'] = value
          break

        default:
          // Direct field match for other filters
          query[key] = value
      }
    }

    return query
  }

  /**
   * Validate external database connection
   * Used by: Health checks and monitoring
   * Purpose: Ensures external database is accessible
   */
  async validateConnection(): Promise<boolean> {
    try {
      return await externalDb.testConnection()
    } catch (error) {
      console.error('External database validation failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const externalDataService = new ExternalDataService()
