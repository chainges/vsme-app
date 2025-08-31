/**
 * Storage abstraction layer types for multi-step form system
 */

/**
 * Interface for storage providers that handle form data persistence
 */
export interface StorageProvider {
  /**
   * Save data to storage with the given key
   * @param key - Unique identifier for the stored data
   * @param data - Data to store (will be serialized)
   * @returns Promise that resolves when data is saved
   */
  save(key: string, data: any): Promise<void>

  /**
   * Load data from storage by key
   * @param key - Unique identifier for the stored data
   * @returns Promise that resolves to the stored data or null if not found
   */
  load(key: string): Promise<any | null>

  /**
   * Clear data from storage by key
   * @param key - Unique identifier for the stored data
   * @returns Promise that resolves when data is cleared
   */
  clear(key: string): Promise<void>

  /**
   * Check if data exists in storage for the given key
   * @param key - Unique identifier for the stored data
   * @returns Promise that resolves to true if data exists, false otherwise
   */
  exists(key: string): Promise<boolean>
}

/**
 * Configuration for storage providers
 */
export interface StorageConfig {
  /** Storage provider type */
  type: 'localStorage' | 'mongodb' | 'memory'
  /** Optional configuration options */
  options?: Record<string, any>
}

/**
 * Structure of data stored by storage providers
 * Includes versioning and timestamp for future compatibility
 */
export interface StoredData<T = any> {
  /** The actual form data */
  data: T
  /** Timestamp when data was stored */
  timestamp: number
  /** Version of the storage format for migration support */
  version: string
  /** Optional metadata */
  metadata?: Record<string, any>
}

/**
 * Error types for storage operations
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

export class StorageSerializationError extends StorageError {
  constructor(message: string, cause?: Error) {
    super(message, cause)
    this.name = 'StorageSerializationError'
  }
}

export class StorageNotFoundError extends StorageError {
  constructor(key: string) {
    super(`Data not found for key: ${key}`)
    this.name = 'StorageNotFoundError'
  }
}
