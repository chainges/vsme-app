import { LocalStorageProvider } from './local-storage-provider'
import { type StorageConfig, StorageError, type StorageProvider } from './types'

/**
 * Factory function to create storage providers based on configuration
 */
export function createStorageProvider(config: StorageConfig): StorageProvider {
  switch (config.type) {
    case 'localStorage':
      return new LocalStorageProvider(
        config.options?.keyPrefix,
        config.options?.skipAvailabilityCheck
      )

    case 'memory':
      return new MemoryStorageProvider()

    case 'mongodb':
      // Future implementation for MongoDB Atlas
      throw new StorageError('MongoDB storage provider is not yet implemented')

    default:
      throw new StorageError(
        `Unknown storage provider type: ${(config as any).type}`
      )
  }
}

/**
 * Get default storage configuration based on environment
 */
export function getDefaultStorageConfig(): StorageConfig {
  // Use localStorage in browser environments
  if (typeof window !== 'undefined' && window.localStorage) {
    return { type: 'localStorage' }
  }

  // Fall back to memory storage in other environments (SSR, tests)
  return { type: 'memory' }
}

/**
 * Memory storage provider for testing and SSR environments
 * Data is lost when the process restarts
 */
class MemoryStorageProvider implements StorageProvider {
  private storage = new Map<string, any>()
  private readonly version = '1.0'

  async save(key: string, data: any): Promise<void> {
    try {
      const storedData = {
        data,
        timestamp: Date.now(),
        version: this.version,
      }

      // Simulate serialization to catch circular reference errors
      JSON.stringify(storedData)

      this.storage.set(key, storedData)
    } catch (error) {
      if (error instanceof Error && error.message.includes('circular')) {
        throw new StorageError(
          'Cannot serialize data with circular references',
          error
        )
      }
      throw new StorageError(
        `Failed to save data for key "${key}"`,
        error as Error
      )
    }
  }

  async load(key: string): Promise<any | null> {
    const stored = this.storage.get(key)
    return stored ? stored.data : null
  }

  async clear(key: string): Promise<void> {
    this.storage.delete(key)
  }

  async exists(key: string): Promise<boolean> {
    return this.storage.has(key)
  }

  /**
   * Clear all data (useful for testing)
   */
  async clearAll(): Promise<void> {
    this.storage.clear()
  }

  /**
   * Get all stored keys (useful for testing)
   */
  getAllKeys(): string[] {
    return Array.from(this.storage.keys())
  }
}
