import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearFormData,
  FORM_DATA_STORAGE_KEY,
  loadFormData,
  saveStepData,
  updateFieldData,
} from '../form-storage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem(key: string) {
      return store[key] || null
    },

    setItem(key: string, value: string) {
      store[key] = value.toString()
    },

    removeItem(key: string) {
      delete store[key]
    },

    clear() {
      store = {}
    },
  }
})()

// Mock the global localStorage object
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('form-storage', () => {
  beforeEach(() => {
    // Reset mock localStorage before each test
    localStorageMock.clear()
  })

  describe('saveStepData', () => {
    it('should save step data to localStorage', () => {
      const stepId = 'company-info'
      const stepData = { companyName: 'Test Company' }

      saveStepData(stepId, stepData)

      const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY)
      expect(storedData).not.toBeNull()

      const parsedData = JSON.parse(storedData!)
      expect(parsedData[stepId]).toEqual(stepData)
    })

    it('should merge step data with existing data', () => {
      // Save initial data
      saveStepData('company-info', { companyName: 'Test Company' })

      // Save additional data for the same step
      saveStepData('company-info', { organizationNumber: '123456789' })

      const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY)
      expect(storedData).not.toBeNull()

      const parsedData = JSON.parse(storedData!)
      expect(parsedData['company-info']).toEqual({
        companyName: 'Test Company',
        organizationNumber: '123456789',
      })
    })

    it('should handle data from multiple steps', () => {
      // Save data for first step
      saveStepData('company-info', { companyName: 'Test Company' })

      // Save data for second step
      saveStepData('business-model', { reportBasis: 'individual' })

      const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY)
      expect(storedData).not.toBeNull()

      const parsedData = JSON.parse(storedData!)
      expect(parsedData['company-info']).toEqual({ companyName: 'Test Company' })
      expect(parsedData['business-model']).toEqual({ reportBasis: 'individual' })
    })

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const localStorageErrorMock = {
        setItem: () => {
          throw new Error('LocalStorage error')
        },
      }

      Object.defineProperty(global, 'localStorage', {
        value: localStorageErrorMock,
        writable: true,
      })

      // This should not throw an error
      expect(() => {
        saveStepData('company-info', { companyName: 'Test Company' })
      }).not.toThrow()

      // Restore the original mock
      Object.defineProperty(global, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
    })
  })

  describe('loadFormData', () => {
    it('should load form data from localStorage', () => {
      const testData = {
        'company-info': { companyName: 'Test Company' },
        'business-model': { reportBasis: 'individual' },
      }

      localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(testData))

      const loadedData = loadFormData()
      expect(loadedData).toEqual(testData)
    })

    it('should return null when no data is found', () => {
      const loadedData = loadFormData()
      expect(loadedData).toBeNull()
    })

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem(FORM_DATA_STORAGE_KEY, 'invalid json')

      const loadedData = loadFormData()
      expect(loadedData).toBeNull()
    })

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const localStorageErrorMock = {
        getItem: () => {
          throw new Error('LocalStorage error')
        },
      }

      Object.defineProperty(global, 'localStorage', {
        value: localStorageErrorMock,
        writable: true,
      })

      // This should not throw an error
      expect(() => {
        const loadedData = loadFormData()
        expect(loadedData).toBeNull()
      }).not.toThrow()

      // Restore the original mock
      Object.defineProperty(global, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
    })
  })

  describe('clearFormData', () => {
    it('should clear form data from localStorage', () => {
      const testData = { 'company-info': { companyName: 'Test Company' } }
      localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(testData))

      clearFormData()

      const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY)
      expect(storedData).toBeNull()
    })

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const localStorageErrorMock = {
        removeItem: () => {
          throw new Error('LocalStorage error')
        },
      }

      Object.defineProperty(global, 'localStorage', {
        value: localStorageErrorMock,
        writable: true,
      })

      // This should not throw an error
      expect(() => {
        clearFormData()
      }).not.toThrow()

      // Restore the original mock
      Object.defineProperty(global, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
    })
  })

  describe('updateFieldData', () => {
    it('should update a specific field in the form data', () => {
      // First save some initial data
      saveStepData('company-info', { companyName: 'Test Company' })

      // Update a specific field
      updateFieldData('company-info', 'companyName', 'Updated Company')

      const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY)
      expect(storedData).not.toBeNull()

      const parsedData = JSON.parse(storedData!)
      expect(parsedData['company-info'].companyName).toEqual('Updated Company')
    })

    it('should handle updating a field in a non-existent step', () => {
      updateFieldData('new-step', 'fieldName', 'fieldValue')

      const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY)
      expect(storedData).not.toBeNull()

      const parsedData = JSON.parse(storedData!)
      expect(parsedData['new-step'].fieldName).toEqual('fieldValue')
    })

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const localStorageErrorMock = {
        setItem: () => {
          throw new Error('LocalStorage error')
        },
        getItem: () => null,
      }

      Object.defineProperty(global, 'localStorage', {
        value: localStorageErrorMock,
        writable: true,
      })

      // This should not throw an error
      expect(() => {
        updateFieldData('company-info', 'companyName', 'Test Company')
      }).not.toThrow()

      // Restore the original mock
      Object.defineProperty(global, 'localStorage', {
        value: localStorageMock,
        writable: true,
      })
    })
  })
})
