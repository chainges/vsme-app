import type { FormData } from '../../../components/forms/multi-step/types'

// Define the localStorage key as a constant
export const FORM_DATA_STORAGE_KEY = 'form-data-complete'

/**
 * Saves step data to the single localStorage object
 * @param stepId - The ID of the current step
 * @param stepData - The data from the current step
 */
export function saveStepData(stepId: string, stepData: Record<string, any>): void {
  try {
    // Get existing data from localStorage
    const existingData = loadFormData() || {}

    // Merge the new step data with existing data
    const updatedData = {
      ...existingData,
      [stepId]: {
        ...(existingData as Record<string, any>)[stepId],
        ...stepData,
      },
    }

    // Save the updated data back to localStorage
    localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(updatedData))
    console.log(`Step data for "${stepId}" saved to localStorage`, updatedData)
  } catch (error) {
    console.error('Error saving step data to localStorage:', error)
    // Handle localStorage errors gracefully
  }
}

/**
 * Loads the complete form data object from localStorage
 * @returns The complete form data object or null if not found
 */
export function loadFormData(): FormData | null {
  try {
    const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY)
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      console.log('Raw data loaded from localStorage:', parsedData)

      // Flatten the step-based structure into a single object
      const flattenedData: any = {}

      // Iterate through each step and merge its data
      Object.keys(parsedData).forEach(stepId => {
        if (typeof parsedData[stepId] === 'object' && parsedData[stepId] !== null) {
          Object.assign(flattenedData, parsedData[stepId])
        }
      })

      console.log('Flattened form data:', flattenedData)
      return flattenedData
    }
    return null
  } catch (error) {
    console.error('Error loading form data from localStorage:', error)
    // Handle localStorage errors gracefully
    return null
  }
}

/**
 * Clears all form data from localStorage
 */
export function clearFormData(): void {
  try {
    localStorage.removeItem(FORM_DATA_STORAGE_KEY)
    console.log('Form data cleared from localStorage')
  } catch (error) {
    console.error('Error clearing form data from localStorage:', error)
  }
}

/**
 * Updates a specific field in the form data
 * @param stepId - The ID of the step
 * @param fieldName - The name of the field to update
 * @param value - The new value for the field
 */
export function updateFieldData(stepId: string, fieldName: string, value: any): void {
  try {
    // Get existing data from localStorage
    const existingData = loadFormData() || {}

    // Update the specific field
    const updatedData = {
      ...existingData,
      [stepId]: {
        ...(existingData as Record<string, any>)[stepId],
        [fieldName]: value,
      },
    }

    // Save the updated data back to localStorage
    localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(updatedData))
    console.log(`Field "${fieldName}" in step "${stepId}" updated in localStorage`, updatedData)
  } catch (error) {
    console.error('Error updating field data in localStorage:', error)
  }
}
