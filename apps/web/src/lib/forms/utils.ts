import type { ConditionalRule } from './types/field-types'
import type { FormState, ProgressData } from './types/form-types'

/**
 * Evaluates a conditional rule against form data
 */
export function evaluateConditionalRule(
  rule: ConditionalRule,
  formData: any
): boolean {
  const fieldValue = getNestedValue(formData, rule.field)

  switch (rule.operator) {
    case 'equals':
      return fieldValue === rule.value
    case 'notEquals':
      return fieldValue !== rule.value
    case 'contains':
      return (
        typeof fieldValue === 'string' &&
        fieldValue.includes(String(rule.value))
      )
    case 'notContains':
      return (
        typeof fieldValue === 'string' &&
        !fieldValue.includes(String(rule.value))
      )
    case 'greaterThan':
      return typeof fieldValue === 'number' && fieldValue > Number(rule.value)
    case 'lessThan':
      return typeof fieldValue === 'number' && fieldValue < Number(rule.value)
    default:
      return false
  }
}

/**
 * Gets a nested value from an object using dot notation
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Sets a nested value in an object using dot notation
 */
export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((current, key) => {
    if (!(key in current)) {
      current[key] = {}
    }
    return current[key]
  }, obj)

  target[lastKey] = value
  return obj
}

/**
 * Calculates progress data for a multi-step form
 */
export function calculateProgress(
  currentStep: number,
  totalSteps: number,
  completedSteps: number[]
): ProgressData {
  return {
    currentStep,
    totalSteps,
    completedSteps,
    percentage: Math.round((completedSteps.length / totalSteps) * 100),
  }
}

/**
 * Validates if a step can be navigated to based on form state
 */
export function canNavigateToStep(
  targetStep: number,
  currentStep: number,
  completedSteps: number[]
): boolean {
  // Can always go to previous steps
  if (targetStep < currentStep) {
    return true
  }

  // Can go to next step if current step is completed
  if (targetStep === currentStep + 1) {
    return completedSteps.includes(currentStep)
  }

  // Can't skip steps
  return false
}

/**
 * Generates a unique key for form data storage
 */
export function generateStorageKey(formId: string, userId?: string): string {
  const base = `form_${formId}`
  return userId ? `${base}_${userId}` : base
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}
