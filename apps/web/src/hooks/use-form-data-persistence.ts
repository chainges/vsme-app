import { useCallback, useEffect, useRef } from 'react'
import type { FormData } from '../components/forms/multi-step/types'
import {
  clearFormData,
  loadFormData,
  saveStepData,
  updateFieldData,
} from '../lib/forms/storage/form-storage'

/**
 * Custom hook for managing form data persistence with single object approach
 *
 * This hook provides functionality to:
 * - Save step data to a single localStorage object
 * - Load complete form data from localStorage
 * - Clear all form data from localStorage
 * - Update individual fields in the form data
 */
export const useFormDataPersistence = () => {
  // Ref to track if we've already loaded data to avoid infinite loops
  const hasLoadedRef = useRef(false)

  /**
   * Saves step data to the single localStorage object
   * @param stepId - The ID of the current step
   * @param stepData - The data from the current step
   */
  const saveStepDataToStorage = useCallback((stepId: string, stepData: Record<string, any>) => {
    saveStepData(stepId, stepData)
  }, [])

  /**
   * Loads the complete form data object from localStorage
   * @returns The complete form data object or null if not found
   */
  const loadFormDataFromStorage = useCallback((): FormData | null => {
    return loadFormData()
  }, [])

  /**
   * Clears all form data from localStorage
   */
  const clearFormDataFromStorage = useCallback(() => {
    clearFormData()
  }, [])

  /**
   * Updates a specific field in the form data
   * @param stepId - The ID of the step
   * @param fieldName - The name of the field to update
   * @param value - The new value for the field
   */
  const updateFieldDataInStorage = useCallback((stepId: string, fieldName: string, value: any) => {
    updateFieldData(stepId, fieldName, value)
  }, [])

  /**
   * Loads form data on component mount only once
   */
  const loadInitialFormData = useCallback((): FormData | null => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      return loadFormDataFromStorage()
    }
    return null
  }, [loadFormDataFromStorage])

  return {
    saveStepData: saveStepDataToStorage,
    loadFormData: loadFormDataFromStorage,
    clearFormData: clearFormDataFromStorage,
    updateFieldData: updateFieldDataInStorage,
    loadInitialFormData,
  }
}
