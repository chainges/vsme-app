import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LocalStorageProvider } from '../local-storage-provider'
import { StorageError, StorageSerializationError } from '../types'

describe('LocalStorageProvider', () => {
  let provider: LocalStorageProvider
  let mockStorage: Storage

  beforeEach(() => {
    // Create a mock storage that implements the Storage interface
    mockStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    } as Storage

    provider = new LocalStorageProvider('test-form', true, mockStorage)
  })

  describe('constructor', () => {
    it('should create provider with default key prefix', () => {
      const defaultProvider = new LocalStorageProvider(
        undefined,
        true,
        mockStorage
      )
      expect(defaultProvider).toBeInstanceOf(LocalStorageProvider)
    })

    it('should create provider with custom key prefix', () => {
      const customProvider = new LocalStorageProvider(
        'custom-prefix',
        true,
        mockStorage
      )
      expect(customProvider).toBeInstanceOf(LocalStorageProvider)
    })
  })

  describe('save', () => {
    it('should save data with versioning and timestamp', async () => {
      const testData = { name: 'John', email: 'john@example.com' }

      await provider.save('user-data', testData)

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'test-form:user-data',
        expect.stringContaining(
          '"data":{"name":"John","email":"john@example.com"}'
        )
      )

      const savedCall = (mockStorage.setItem as any).mock.calls[0]
      const savedData = JSON.parse(savedCall[1])

      expect(savedData).toMatchObject({
        data: testData,
        version: '1.0',
        timestamp: expect.any(Number),
        metadata: expect.any(Object),
      })
    })

    it('should handle quota exceeded error', async () => {
      const quotaError = new Error('QuotaExceededError')
      quotaError.name = 'QuotaExceededError'
      ;(mockStorage.setItem as any).mockImplementation(() => {
        throw quotaError
      })

      await expect(provider.save('test', {})).rejects.toThrow(StorageError)
      await expect(provider.save('test', {})).rejects.toThrow(
        'localStorage quota exceeded'
      )
    })

    it('should handle circular reference error', async () => {
      const circularData: any = { name: 'test' }
      circularData.self = circularData

      await expect(provider.save('test', circularData)).rejects.toThrow(
        StorageSerializationError
      )
    })
  })

  describe('load', () => {
    it('should load and return data', async () => {
      const testData = { name: 'John', email: 'john@example.com' }
      const storedData = {
        data: testData,
        timestamp: Date.now(),
        version: '1.0',
      }

      ;(mockStorage.getItem as any).mockReturnValue(JSON.stringify(storedData))

      const result = await provider.load('user-data')

      expect(mockStorage.getItem).toHaveBeenCalledWith('test-form:user-data')
      expect(result).toEqual(testData)
    })

    it('should return null when data does not exist', async () => {
      ;(mockStorage.getItem as any).mockReturnValue(null)

      const result = await provider.load('non-existent')

      expect(result).toBeNull()
    })

    it('should handle corrupted data by clearing it', async () => {
      ;(mockStorage.getItem as any).mockReturnValue('invalid-json')
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await provider.load('corrupted-data')

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Corrupted data found')
      )
      expect(mockStorage.removeItem).toHaveBeenCalledWith(
        'test-form:corrupted-data'
      )
      expect(result).toBeNull()

      consoleSpy.mockRestore()
    })
  })

  describe('clear', () => {
    it('should clear data from localStorage', async () => {
      await provider.clear('user-data')

      expect(mockStorage.removeItem).toHaveBeenCalledWith('test-form:user-data')
    })
  })

  describe('exists', () => {
    it('should return true when data exists', async () => {
      ;(mockStorage.getItem as any).mockReturnValue('some-data')

      const result = await provider.exists('user-data')

      expect(mockStorage.getItem).toHaveBeenCalledWith('test-form:user-data')
      expect(result).toBe(true)
    })

    it('should return false when data does not exist', async () => {
      ;(mockStorage.getItem as any).mockReturnValue(null)

      const result = await provider.exists('non-existent')

      expect(result).toBe(false)
    })
  })
})
