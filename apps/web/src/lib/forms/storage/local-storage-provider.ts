import {
  StorageError,
  type StorageProvider,
  StorageSerializationError,
  type StoredData,
} from './types'

/**
 * Local storage implementation of StorageProvider
 * Handles data serialization, versioning, and error recovery
 */
export class LocalStorageProvider implements StorageProvider {
  private readonly version = '1.0'
  private readonly keyPrefix: string
  private readonly storage: Storage

  constructor(
    keyPrefix = 'multistep-form',
    skipAvailabilityCheck = false,
    storageInstance?: Storage
  ) {
    this.keyPrefix = keyPrefix

    // Use provided storage instance or default to window.localStorage
    if (storageInstance) {
      this.storage = storageInstance
    } else {
      // Check if localStorage is available (skip in test environments)
      if (!(skipAvailabilityCheck || this.isLocalStorageAvailable())) {
        throw new StorageError(
          'localStorage is not available in this environment'
        )
      }
      this.storage = window.localStorage
    }
  }

  /**
   * Save data to localStorage with versioning and timestamp
   */
  async save(key: string, data: any): Promise<void> {
    try {
      const storageKey = this.getStorageKey(key)
      const storedData: StoredData = {
        data,
        timestamp: Date.now(),
        version: this.version,
        metadata: {
          userAgent:
            typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        },
      }

      const serialized = JSON.stringify(storedData)
      this.storage.setItem(storageKey, serialized)
    } catch (error) {
      if (error instanceof Error) {
        // Handle quota exceeded error
        if (
          error.name === 'QuotaExceededError' ||
          error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
        ) {
          throw new StorageError(
            'localStorage quota exceeded. Please clear some data and try again.',
            error
          )
        }

        // Handle serialization errors
        if (
          error.message.includes('circular structure') ||
          error.message.includes('Converting circular') ||
          error.message.includes('serialize cyclic structures')
        ) {
          throw new StorageSerializationError(
            'Cannot serialize data with circular references',
            error
          )
        }
      }

      throw new StorageError(
        `Failed to save data for key "${key}"`,
        error as Error
      )
    }
  }

  /**
   * Load data from localStorage with version compatibility checking
   */
  async load(key: string): Promise<any | null> {
    try {
      const storageKey = this.getStorageKey(key)
      const stored = this.storage.getItem(storageKey)

      if (!stored) {
        return null
      }

      const parsedData: StoredData = JSON.parse(stored)

      // Version compatibility check
      if (!this.isVersionCompatible(parsedData.version)) {
        console.warn(
          `Storage version mismatch for key "${key}". Expected: ${this.version}, Found: ${parsedData.version}`
        )
        // For now, we'll still return the data but log a warning
        // In the future, this could trigger data migration
      }

      return parsedData.data
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Handle corrupted data by clearing it
        console.warn(`Corrupted data found for key "${key}". Clearing...`)
        await this.clear(key)
        return null
      }

      throw new StorageError(
        `Failed to load data for key "${key}"`,
        error as Error
      )
    }
  }

  /**
   * Clear data from localStorage
   */
  async clear(key: string): Promise<void> {
    try {
      const storageKey = this.getStorageKey(key)
      this.storage.removeItem(storageKey)
    } catch (error) {
      throw new StorageError(
        `Failed to clear data for key "${key}"`,
        error as Error
      )
    }
  }

  /**
   * Check if data exists in localStorage
   */
  async exists(key: string): Promise<boolean> {
    try {
      const storageKey = this.getStorageKey(key)
      return this.storage.getItem(storageKey) !== null
    } catch (error) {
      throw new StorageError(
        `Failed to check existence for key "${key}"`,
        error as Error
      )
    }
  }

  /**
   * Get all keys managed by this provider (useful for debugging)
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys: string[] = []
      const prefix = `${this.keyPrefix}:`

      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i)
        if (key && key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length))
        }
      }

      return keys
    } catch (error) {
      throw new StorageError('Failed to retrieve all keys', error as Error)
    }
  }

  /**
   * Clear all data managed by this provider
   */
  async clearAll(): Promise<void> {
    try {
      const keys = await this.getAllKeys()
      for (const key of keys) {
        await this.clear(key)
      }
    } catch (error) {
      throw new StorageError('Failed to clear all data', error as Error)
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): { used: number; available: number; total: number } {
    if (!this.isLocalStorageAvailable()) {
      return { used: 0, available: 0, total: 0 }
    }

    let used = 0
    try {
      // Calculate used space by our keys
      const keys = Object.keys(this.storage)
      for (const key of keys) {
        if (key.startsWith(`${this.keyPrefix}:`)) {
          const value = this.storage.getItem(key)
          if (value) {
            used += key.length + value.length
          }
        }
      }
    } catch (error) {
      console.warn('Failed to calculate storage usage:', error)
    }

    // Estimate total localStorage capacity (typically 5-10MB)
    const total = 5 * 1024 * 1024 // 5MB estimate
    const available = Math.max(0, total - used)

    return { used, available, total }
  }

  /**
   * Generate storage key with prefix
   */
  private getStorageKey(key: string): string {
    return `${this.keyPrefix}:${key}`
  }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false
      }

      // Test localStorage functionality
      const testKey = '__localStorage_test__'
      window.localStorage.setItem(testKey, 'test')
      window.localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  /**
   * Check if stored data version is compatible
   */
  private isVersionCompatible(storedVersion: string): boolean {
    // For now, we only support version 1.0
    // In the future, this could implement more sophisticated version checking
    return storedVersion === this.version
  }
}
