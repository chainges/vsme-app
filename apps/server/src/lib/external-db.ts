/**
 * External Database Client
 *
 * This module manages connections to external MongoDB Atlas databases.
 * Used by:
 * - External data API endpoints for read-only operations
 * - Data synchronization services for fetching shared data
 * - Reference data lookups from other applications in the same Clerk domain
 *
 * Purpose: Provides secure, read-only access to external databases
 * with proper connection pooling, error handling, and timeout management
 */

import { type Collection, type Db, MongoClient } from 'mongodb'

/**
 * External database client class with connection management
 * Used by: External data services and API endpoints
 * Purpose: Manages connections to external MongoDB databases with proper lifecycle
 */
export class ExternalDbClient {
  private client: MongoClient | null = null
  private connectionPromise: Promise<MongoClient> | null = null
  private readonly connectionUrl: string
  private readonly options: any

  constructor(connectionUrl?: string) {
    if (!(connectionUrl || process.env.SCOPE321_DATABASE_URL)) {
      throw new Error(
        'External database URL not configured. Set SCOPE321_DATABASE_URL environment variable.'
      )
    }

    // Import configuration
    const { getExternalDbConfig } = require('./external-db-config')
    const config = getExternalDbConfig()

    this.connectionUrl = connectionUrl || config.connectionUrl
    this.options = config.options
  }

  /**
   * Get or create database connection
   * Used by: All external database operations
   * Purpose: Ensures single connection instance with proper error handling
   */
  private async getConnection(): Promise<MongoClient> {
    if (this.client && this.client.topology?.isConnected()) {
      return this.client
    }

    // If connection is in progress, wait for it
    if (this.connectionPromise) {
      return this.connectionPromise
    }

    // Create new connection
    this.connectionPromise = this.createConnection()

    try {
      this.client = await this.connectionPromise
      return this.client
    } catch (error) {
      this.connectionPromise = null
      throw error
    }
  }

  /**
   * Create new MongoDB connection
   * Used by: getConnection() when establishing new connections
   * Purpose: Creates properly configured MongoDB client with error handling
   */
  private async createConnection(): Promise<MongoClient> {
    try {
      const client = new MongoClient(this.connectionUrl, this.options)
      await client.connect()

      // Verify connection by pinging
      await client.db('admin').admin().ping()

      // Set up connection event handlers
      client.on('error', (error) => {
        console.error('External database connection error:', error)
      })

      client.on('close', () => {
        console.log('External database connection closed')
        this.client = null
        this.connectionPromise = null
      })

      return client
    } catch (error) {
      console.error('Failed to connect to external database:', error)
      throw new Error(`External database connection failed: ${error}`)
    }
  }

  /**
   * Get database instance
   * Used by: External data services to access specific databases
   * Purpose: Provides access to named databases with connection management
   */
  async getDatabase(databaseName: string): Promise<Db> {
    const client = await this.getConnection()
    return client.db(databaseName)
  }

  /**
   * Get collection instance
   * Used by: External data queries for specific collections
   * Purpose: Direct access to collections with type safety
   */
  async getCollection<T = any>(
    databaseName: string,
    collectionName: string
  ): Promise<Collection<T>> {
    const database = await this.getDatabase(databaseName)
    return database.collection<T>(collectionName)
  }

  /**
   * Test connection health
   * Used by: Health check endpoints and monitoring
   * Purpose: Validates external database connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      const client = await this.getConnection()
      await client.db('admin').admin().ping()
      return true
    } catch (error) {
      console.error('External database health check failed:', error)
      return false
    }
  }

  /**
   * List available databases
   * Used by: Discovery and debugging tools
   * Purpose: Shows what databases are accessible for external queries
   */
  async listDatabases(): Promise<string[]> {
    try {
      const client = await this.getConnection()
      const adminDb = client.db('admin').admin()
      const result = await adminDb.listDatabases()
      return result.databases.map((db) => db.name)
    } catch (error) {
      console.error('Failed to list external databases:', error)
      throw new Error(`Failed to list databases: ${error}`)
    }
  }

  /**
   * Execute aggregation pipeline
   * Used by: Complex external data queries and analytics
   * Purpose: Provides aggregation capabilities for external data processing
   */
  async aggregate<T = any>(
    databaseName: string,
    collectionName: string,
    pipeline: any[]
  ): Promise<T[]> {
    try {
      const collection = await this.getCollection(databaseName, collectionName)
      const cursor = collection.aggregate<T>(pipeline)
      return await cursor.toArray()
    } catch (error) {
      console.error('External database aggregation failed:', error)
      throw new Error(`Aggregation failed: ${error}`)
    }
  }

  /**
   * Find documents with query
   * Used by: External data fetching services
   * Purpose: Standard document queries with proper error handling
   */
  async find<T = any>(
    databaseName: string,
    collectionName: string,
    query: any = {},
    options: any = {}
  ): Promise<T[]> {
    try {
      const collection = await this.getCollection<T>(
        databaseName,
        collectionName
      )
      const cursor = collection.find(query, options)
      return await cursor.toArray()
    } catch (error) {
      console.error('External database find failed:', error)
      throw new Error(`Find operation failed: ${error}`)
    }
  }

  /**
   * Find single document
   * Used by: External data lookups for specific records
   * Purpose: Single document retrieval with null handling
   */
  async findOne<T = any>(
    databaseName: string,
    collectionName: string,
    query: any = {},
    options: any = {}
  ): Promise<T | null> {
    try {
      const collection = await this.getCollection<T>(
        databaseName,
        collectionName
      )
      return await collection.findOne(query, options)
    } catch (error) {
      console.error('External database findOne failed:', error)
      throw new Error(`FindOne operation failed: ${error}`)
    }
  }

  /**
   * Count documents
   * Used by: External data statistics and pagination
   * Purpose: Document counting for analytics and pagination
   */
  async count(
    databaseName: string,
    collectionName: string,
    query: any = {}
  ): Promise<number> {
    try {
      const collection = await this.getCollection(databaseName, collectionName)
      return await collection.countDocuments(query)
    } catch (error) {
      console.error('External database count failed:', error)
      throw new Error(`Count operation failed: ${error}`)
    }
  }

  /**
   * Close database connection
   * Used by: Application shutdown and cleanup
   * Purpose: Properly closes connections to prevent resource leaks
   */
  async close(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close()
        this.client = null
        this.connectionPromise = null
      }
    } catch (error) {
      console.error('Error closing external database connection:', error)
    }
  }
}

// Singleton instance for application use
let externalDbInstance: ExternalDbClient | null = null

/**
 * Get singleton external database client
 * Used by: External data services throughout the application
 * Purpose: Provides single connection instance to prevent connection proliferation
 */
export function getExternalDb(): ExternalDbClient {
  if (!externalDbInstance) {
    externalDbInstance = new ExternalDbClient()
  }
  return externalDbInstance
}

/**
 * Initialize external database connection
 * Used by: Application startup to pre-warm connections
 * Purpose: Establishes connection early to catch configuration issues
 */
export async function initializeExternalDb(): Promise<void> {
  try {
    const client = getExternalDb()
    const isHealthy = await client.testConnection()

    if (!isHealthy) {
      throw new Error('External database health check failed')
    }

    console.log('✅ External database initialized successfully')
  } catch (error) {
    console.error('❌ External database initialization failed:', error)
    throw error
  }
}

/**
 * Cleanup external database connections
 * Used by: Application shutdown handlers
 * Purpose: Ensures clean shutdown of external database connections
 */
export async function cleanupExternalDb(): Promise<void> {
  if (externalDbInstance) {
    await externalDbInstance.close()
    externalDbInstance = null
  }
}

// Export the singleton instance as default
export const externalDb = getExternalDb()
