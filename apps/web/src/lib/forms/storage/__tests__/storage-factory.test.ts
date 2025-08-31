import { beforeEach, describe, expect, it } from 'vitest'
import { LocalStorageProvider } from '../local-storage-provider'
import {
  createStorageProvider,
  getDefaultStorageConfig,
} from '../storage-factory'
import { StorageError } from '../types'

describe('Storage Factory', () => {
  describe('createStorageProvider', () => {
    it('should create LocalStorageProvider for localStorage config', () => {
      const provider = createStorageProvider({
        type: 'localStorage',
        options: { skipAvailabilityCheck: true },
      })

      expect(provider).toBeInstanceOf(LocalStorageProvider)
    })

    it('should create LocalStorageProvider with custom key prefix', () => {
      const provider = createStorageProvider({
        type: 'localStorage',
        options: { keyPrefix: 'custom-prefix', skipAvailabilityCheck: true },
      })

      expect(provider).toBeInstanceOf(LocalStorageProvider)
    })

    it('should create MemoryStorageProvider for memory config', () => {
      const provider = createStorageProvider({ type: 'memory' })

      // Test that it behaves like a storage provider
      expect(provider.save).toBeDefined()
      expect(provider.load).toBeDefined()
      expect(provider.clear).toBeDefined()
      expect(provider.exists).toBeDefined()
    })

    it('should throw error for mongodb config (not implemented)', () => {
      expect(() => createStorageProvider({ type: 'mongodb' })).toThrow(
        StorageError
      )
      expect(() => createStorageProvider({ type: 'mongodb' })).toThrow(
        'MongoDB storage provider is not yet implemented'
      )
    })

    it('should throw error for unknown storage type', () => {
      expect(() => createStorageProvider({ type: 'unknown' as any })).toThrow(
        StorageError
      )
      expect(() => createStorageProvider({ type: 'unknown' as any })).toThrow(
        'Unknown storage provider type: unknown'
      )
    })
  })

  describe('getDefaultStorageConfig', () => {
    it('should return localStorage config when localStorage is available', () => {
      const config = getDefaultStorageConfig()

      expect(config).toEqual({ type: 'localStorage' })
    })
  })

  describe('MemoryStorageProvider', () => {
    let provider: any

    beforeEach(() => {
      provider = createStorageProvider({ type: 'memory' })
    })

    it('should save and load data', async () => {
      const testData = { name: 'John', email: 'john@example.com' }

      await provider.save('test-key', testData)
      const result = await provider.load('test-key')

      expect(result).toEqual(testData)
    })

    it('should return null for non-existent data', async () => {
      const result = await provider.load('non-existent')

      expect(result).toBeNull()
    })

    it('should check existence correctly', async () => {
      await provider.save('test-key', { data: 'test' })

      const exists = await provider.exists('test-key')
      const notExists = await provider.exists('non-existent')

      expect(exists).toBe(true)
      expect(notExists).toBe(false)
    })

    it('should clear data', async () => {
      await provider.save('test-key', { data: 'test' })
      await provider.clear('test-key')

      const result = await provider.load('test-key')
      const exists = await provider.exists('test-key')

      expect(result).toBeNull()
      expect(exists).toBe(false)
    })

    it('should handle circular reference error', async () => {
      const circularData: any = { name: 'test' }
      circularData.self = circularData

      await expect(provider.save('test', circularData)).rejects.toThrow(
        StorageError
      )
      await expect(provider.save('test', circularData)).rejects.toThrow(
        'Cannot serialize data with circular references'
      )
    })
  })
})
