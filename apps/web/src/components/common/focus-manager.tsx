'use client'

import { useFocusManagement, useKeyboardNavigation } from '@/hooks/use-focus-management'

/**
 * Component that manages focus and keyboard navigation for the entire app
 */
export function FocusManager() {
  useFocusManagement()
  useKeyboardNavigation()

  return null // This component doesn't render anything
}
