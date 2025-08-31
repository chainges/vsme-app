/**
 * Multi-step form components
 *
 * This module provides components for building multi-step forms with
 * TanStack Forms integration, including step management, progress tracking,
 * and form state persistence.
 */

// Main controller component
export type { MultiStepFormProps } from './MultiStepForm'
export { default as MultiStepForm, MultiStepForm as MultiStepFormComponent } from './MultiStepForm'

// Navigation components
export type { NavigationControlsProps } from './NavigationControls'
export {
  CompactNavigationControls,
  default as NavigationControls,
} from './NavigationControls'

// Progress components
export type { ProgressIndicatorProps } from './ProgressIndicator'
export { default as ProgressIndicator } from './ProgressIndicator'

// Demo components
export { default as ProgressNavigationDemo } from './ProgressNavigationDemo'
export { default as MultiStepFormDemo } from './MultiStepFormDemo'

// Export types
export * from './types'
