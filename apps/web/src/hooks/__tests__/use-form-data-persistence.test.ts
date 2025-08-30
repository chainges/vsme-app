import { beforeEach, describe, expect, it } from 'vitest'

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

describe('useFormDataPersistence', () => {
  beforeEach(() => {
    // Reset mock localStorage before each test
    localStorageMock.clear()
  })

  it('should save step data to localStorage', async () => {
    // Import the functions directly from the storage utility
    const { saveStepData } = await import('../../lib/forms/storage/form-storage')

    saveStepData('company-info', { companyName: 'Test Company' })

    const storedData = localStorage.getItem('form-data-complete')
    expect(storedData).not.toBeNull()

    const parsedData = JSON.parse(storedData!)
    expect(parsedData['company-info']).toEqual({ companyName: 'Test Company' })
  })

  it('should load form data from localStorage', async () => {
    const testData = {
      'company-info': { companyName: 'Test Company' },
      'business-model': { reportBasis: 'individual' },
    }

    localStorage.setItem('form-data-complete', JSON.stringify(testData))

    // Import the functions directly from the storage utility
    const { loadFormData } = await import('../../lib/forms/storage/form-storage')

    const loadedData = loadFormData()
    expect(loadedData).toEqual(testData)
  })

  it('should clear form data from localStorage', async () => {
    const testData = { 'company-info': { companyName: 'Test Company' } }
    localStorage.setItem('form-data-complete', JSON.stringify(testData))

    // Import the functions directly from the storage utility
    const { clearFormData } = await import('../../lib/forms/storage/form-storage')

    clearFormData()

    const storedData = localStorage.getItem('form-data-complete')
    expect(storedData).toBeNull()
  })

  it('should update a specific field in the form data', async () => {
    // Import the functions directly from the storage utility
    const { updateFieldData } = await import('../../lib/forms/storage/form-storage')

    updateFieldData('company-info', 'companyName', 'Test Company')

    const storedData = localStorage.getItem('form-data-complete')
    expect(storedData).not.toBeNull()

    const parsedData = JSON.parse(storedData!)
    expect(parsedData['company-info'].companyName).toEqual('Test Company')
  })
})
