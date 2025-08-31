import { describe, expect, it } from 'vitest'
import {
  StorageError,
  StorageNotFoundError,
  StorageSerializationError,
} from '../types'

describe('Storage Error Types', () => {
  describe('StorageError', () => {
    it('should create error with message', () => {
      const error = new StorageError('Test error message')

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(StorageError)
      expect(error.name).toBe('StorageError')
      expect(error.message).toBe('Test error message')
      expect(error.cause).toBeUndefined()
    })

    it('should create error with message and cause', () => {
      const cause = new Error('Original error')
      const error = new StorageError('Test error message', cause)

      expect(error.message).toBe('Test error message')
      expect(error.cause).toBe(cause)
    })
  })

  describe('StorageSerializationError', () => {
    it('should create serialization error', () => {
      const error = new StorageSerializationError('Serialization failed')

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(StorageError)
      expect(error).toBeInstanceOf(StorageSerializationError)
      expect(error.name).toBe('StorageSerializationError')
      expect(error.message).toBe('Serialization failed')
    })

    it('should create serialization error with cause', () => {
      const cause = new Error('JSON error')
      const error = new StorageSerializationError('Serialization failed', cause)

      expect(error.message).toBe('Serialization failed')
      expect(error.cause).toBe(cause)
    })
  })

  describe('StorageNotFoundError', () => {
    it('should create not found error with key', () => {
      const error = new StorageNotFoundError('user-data')

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(StorageError)
      expect(error).toBeInstanceOf(StorageNotFoundError)
      expect(error.name).toBe('StorageNotFoundError')
      expect(error.message).toBe('Data not found for key: user-data')
    })
  })
})
