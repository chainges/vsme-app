'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ConditionalGroupComponentProps } from './types'

/**
 * Utility function to clean up conditional field data when fields are hidden
 * This helps prevent stale data from being submitted when fields are conditionally hidden
 */
export function cleanupConditionalData(
  formData: Record<string, unknown>,
  fieldsToClean: string[]
): Record<string, unknown> {
  // Deep clone to avoid mutating the original data
  const cleanedData = JSON.parse(JSON.stringify(formData))

  for (const fieldPath of fieldsToClean) {
    const keys = fieldPath.split('.')
    let current = cleanedData
    let pathExists = true

    // Navigate to the parent object
    for (let i = 0; i < keys.length - 1; i++) {
      if (current && typeof current === 'object' && keys[i] in current) {
        current = (current as Record<string, unknown>)[keys[i]] as Record<
          string,
          unknown
        >
      } else {
        pathExists = false
        break // Path doesn't exist, skip to next field
      }
    }

    // Clear the final field only if path exists
    if (pathExists) {
      const finalKey = keys.at(-1)
      if (
        finalKey &&
        current &&
        typeof current === 'object' &&
        finalKey in current
      ) {
        if (Array.isArray(current[finalKey])) {
          ;(current as Record<string, unknown>)[finalKey] = []
        } else if (typeof current[finalKey] === 'boolean') {
          ;(current as Record<string, unknown>)[finalKey] = false
        } else if (typeof current[finalKey] === 'number') {
          ;(current as Record<string, unknown>)[finalKey] = 0
        } else {
          ;(current as Record<string, unknown>)[finalKey] = ''
        }
      }
    }
  }

  return cleanedData
}

/**
 * Evaluates a conditional rule against form data
 */
function evaluateCondition(
  condition: ConditionalGroupComponentProps['condition'],
  formData: unknown
): boolean {
  if (!formData || typeof formData !== 'object') {
    return false
  }

  const data = formData as Record<string, unknown>

  // Navigate to nested field using dot notation (e.g., "businessModel.hasSubsidiaries")
  const fieldValue = condition.field
    .split('.')
    .reduce((obj: unknown, key: string): unknown => {
      return obj && typeof obj === 'object'
        ? (obj as Record<string, unknown>)[key]
        : undefined
    }, data as unknown)

  switch (condition.operator) {
    case 'equals':
      return fieldValue === condition.value
    case 'notEquals':
      return fieldValue !== condition.value
    case 'contains':
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(condition.value)
      }
      if (
        typeof fieldValue === 'string' &&
        typeof condition.value === 'string'
      ) {
        return fieldValue.includes(condition.value)
      }
      return false
    case 'notContains':
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(condition.value)
      }
      if (
        typeof fieldValue === 'string' &&
        typeof condition.value === 'string'
      ) {
        return !fieldValue.includes(condition.value)
      }
      return true
    case 'greaterThan':
      return typeof fieldValue === 'number' &&
        typeof condition.value === 'number'
        ? fieldValue > condition.value
        : false
    case 'lessThan':
      return typeof fieldValue === 'number' &&
        typeof condition.value === 'number'
        ? fieldValue < condition.value
        : false
    default:
      return false
  }
}

/**
 * ConditionalGroup component for conditional field rendering
 *
 * Features:
 * - Subscribes to form state changes via formData prop
 * - Evaluates conditional logic for showing/hiding fields
 * - Smooth animations for showing/hiding content using Framer Motion
 * - Proper cleanup of conditional field data when hidden
 * - Accessibility support with proper ARIA attributes
 * - TypeScript type safety
 *
 * Usage:
 * ```tsx
 * <ConditionalGroup
 *   condition={{
 *     field: 'businessModel.hasSubsidiaries',
 *     operator: 'equals',
 *     value: true
 *   }}
 *   formData={formData}
 * >
 *   <SubsidiaryFields />
 * </ConditionalGroup>
 * ```
 */
export function ConditionalGroup({
  condition,
  formData,
  children,
  animationDuration = 300,
  className,
  fieldsToCleanup = [],
  onDataCleanup,
}: ConditionalGroupComponentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const previousVisibleRef = useRef(false)

  // Evaluate condition whenever formData changes
  useEffect(() => {
    const newIsVisible = evaluateCondition(condition, formData)
    const wasVisible = previousVisibleRef.current

    // Update visibility state
    setIsVisible(newIsVisible)

    // If becoming visible, render immediately
    if (newIsVisible) {
      setShouldRender(true)
    }

    // If becoming hidden and we have fields to cleanup, trigger cleanup
    if (
      wasVisible &&
      !newIsVisible &&
      fieldsToCleanup.length > 0 &&
      onDataCleanup &&
      formData
    ) {
      const cleanedData = cleanupConditionalData(
        formData as Record<string, unknown>,
        fieldsToCleanup
      )
      onDataCleanup(cleanedData)
    }

    // Update the ref for next render
    previousVisibleRef.current = newIsVisible
  }, [condition, formData, fieldsToCleanup, onDataCleanup])

  // Handle animation completion
  const handleAnimationComplete = () => {
    if (!isVisible) {
      setShouldRender(false)
    }
  }

  // Animation variants for smooth transitions
  const variants = {
    hidden: {
      opacity: 0,
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      overflow: 'hidden',
    },
    visible: {
      opacity: 1,
      height: 'auto',
      marginTop: undefined,
      marginBottom: undefined,
      overflow: 'visible',
    },
  }

  const transition = {
    duration: animationDuration / 1000,
    ease: 'easeInOut' as const, // Custom easing for smooth animation
  }

  return (
    <AnimatePresence mode="wait" onExitComplete={handleAnimationComplete}>
      {shouldRender && (
        <motion.div
          animate={isVisible ? 'visible' : 'hidden'}
          className={cn('overflow-hidden', className)}
          exit="hidden"
          initial="hidden"
          transition={transition}
          variants={variants}
        >
          <fieldset aria-hidden={!isVisible} disabled={!isVisible}>
            {children}
          </fieldset>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConditionalGroup
