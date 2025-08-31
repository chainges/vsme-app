'use client'

import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Props for the NavigationControls component
 */
export interface NavigationControlsProps {
  currentStep: number
  totalSteps: number
  canGoNext: boolean
  canGoPrevious: boolean
  isLoading?: boolean
  isValidating?: boolean
  onNext: () => void
  onPrevious: () => void
  onSubmit?: () => void
  nextLabel?: string
  previousLabel?: string
  submitLabel?: string
  className?: string
  disabled?: boolean
}

/**
 * NavigationControls component for multi-step forms
 *
 * Features:
 * - Next/Previous navigation with validation checks
 * - Loading states for async operations
 * - Keyboard navigation support (Enter for next, Escape for previous)
 * - Responsive design with proper button sizing
 * - Accessibility support with ARIA attributes
 * - Submit button on final step
 *
 * Usage:
 * ```tsx
 * <NavigationControls
 *   currentStep={1}
 *   totalSteps={3}
 *   canGoNext={isStepValid}
 *   canGoPrevious={currentStep > 0}
 *   isLoading={isSubmitting}
 *   onNext={handleNext}
 *   onPrevious={handlePrevious}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export function NavigationControls({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrevious,
  isLoading = false,
  isValidating = false,
  onNext,
  onPrevious,
  onSubmit,
  nextLabel,
  previousLabel = 'Previous',
  submitLabel = 'Submit',
  className,
  disabled = false,
}: NavigationControlsProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  // Determine next button label
  const getNextLabel = () => {
    if (nextLabel) return nextLabel
    if (isLastStep) return submitLabel
    return 'Next'
  }

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled || isLoading) return

    switch (event.key) {
      case 'Enter':
        if (canGoNext) {
          event.preventDefault()
          if (isLastStep && onSubmit) {
            onSubmit()
          } else {
            onNext()
          }
        }
        break
      case 'Escape':
        if (canGoPrevious) {
          event.preventDefault()
          onPrevious()
        }
        break
    }
  }

  // Handle next/submit action
  const handleNextAction = () => {
    if (isLastStep && onSubmit) {
      onSubmit()
    } else {
      onNext()
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-t bg-background p-4',
        className
      )}
      onKeyDown={handleKeyDown}
      role="navigation"
      tabIndex={-1}
    >
      {/* Previous Button */}
      <Button
        aria-label={`Go to previous step (${currentStep} of ${totalSteps})`}
        className="min-w-24"
        disabled={!canGoPrevious || disabled || isLoading}
        onClick={onPrevious}
        size="lg"
        variant="outline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {previousLabel}
      </Button>

      {/* Step Counter */}
      <div className="flex items-center space-x-2 text-muted-foreground text-sm">
        <span>
          Step {currentStep + 1} of {totalSteps}
        </span>
        {isValidating && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>

      {/* Next/Submit Button */}
      <Button
        aria-label={
          isLastStep
            ? 'Submit form'
            : `Go to next step (${currentStep + 2} of ${totalSteps})`
        }
        className="min-w-24"
        disabled={!canGoNext || disabled || isLoading}
        onClick={handleNextAction}
        size="lg"
        variant={isLastStep ? 'default' : 'default'}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isLastStep ? 'Submitting...' : 'Loading...'}
          </>
        ) : (
          <>
            {isLastStep ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {getNextLabel()}
              </>
            ) : (
              <>
                {getNextLabel()}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </>
        )}
      </Button>
    </div>
  )
}

/**
 * Compact version of NavigationControls for mobile or constrained spaces
 */
export function CompactNavigationControls({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrevious,
  isLoading = false,
  onNext,
  onPrevious,
  onSubmit,
  className,
  disabled = false,
}: Omit<
  NavigationControlsProps,
  'nextLabel' | 'previousLabel' | 'submitLabel' | 'isValidating'
>) {
  const isLastStep = currentStep === totalSteps - 1

  const handleNextAction = () => {
    if (isLastStep && onSubmit) {
      onSubmit()
    } else {
      onNext()
    }
  }

  return (
    <div
      className={cn('flex items-center justify-between gap-2 p-2', className)}
      role="navigation"
    >
      {/* Previous Button */}
      <Button
        aria-label="Previous step"
        disabled={!canGoPrevious || disabled || isLoading}
        onClick={onPrevious}
        size="sm"
        variant="ghost"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      {/* Progress Dots */}
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            className={cn('h-2 w-2 rounded-full transition-colors', {
              'bg-primary': index <= currentStep,
              'bg-muted': index > currentStep,
            })}
            key={index}
          />
        ))}
      </div>

      {/* Next/Submit Button */}
      <Button
        aria-label={isLastStep ? 'Submit' : 'Next step'}
        disabled={!canGoNext || disabled || isLoading}
        onClick={handleNextAction}
        size="sm"
        variant="ghost"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isLastStep ? (
          <Check className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

export default NavigationControls
