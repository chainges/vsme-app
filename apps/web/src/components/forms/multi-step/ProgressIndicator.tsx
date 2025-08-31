'use client'

import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Props for individual step indicator
 */
interface StepIndicatorProps {
  step: number
  title: string
  description?: string
  status: 'completed' | 'current' | 'upcoming'
  isLast: boolean
  onClick?: () => void
  disabled?: boolean
}

/**
 * Individual step indicator component
 */
function StepIndicator({
  step,
  title,
  description,
  status,
  isLast,
  onClick,
  disabled = false,
}: StepIndicatorProps) {
  const isClickable = onClick && !disabled && status !== 'upcoming'

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        {/* Step Circle */}
        <button
          aria-current={status === 'current' ? 'step' : undefined}
          aria-label={`Step ${step}: ${title}${status === 'completed' ? ' (completed)' : status === 'current' ? ' (current)' : ''}`}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold text-sm transition-colors',
            {
              'border-primary bg-primary text-primary-foreground':
                status === 'completed',
              'border-primary bg-background text-primary': status === 'current',
              'border-muted-foreground bg-background text-muted-foreground':
                status === 'upcoming',
              'cursor-pointer hover:border-primary hover:text-primary':
                isClickable,
              'cursor-not-allowed opacity-50': disabled,
            }
          )}
          disabled={disabled || status === 'upcoming'}
          onClick={onClick}
          type="button"
        >
          {status === 'completed' ? (
            <Check className="h-5 w-5" />
          ) : (
            <span>{step}</span>
          )}
        </button>

        {/* Step Title and Description */}
        <div className="mt-2 text-center">
          <div
            className={cn('font-medium text-sm', {
              'text-primary': status === 'current' || status === 'completed',
              'text-muted-foreground': status === 'upcoming',
            })}
          >
            {title}
          </div>
          {description && (
            <div className="mt-1 text-muted-foreground text-xs">
              {description}
            </div>
          )}
        </div>
      </div>

      {/* Connector Line */}
      {!isLast && (
        <div
          className={cn('mx-4 h-0.5 w-12 transition-colors sm:w-16 md:w-20', {
            'bg-primary': status === 'completed',
            'bg-muted': status === 'current' || status === 'upcoming',
          })}
        />
      )}
    </div>
  )
}

/**
 * Props for the ProgressIndicator component
 */
export interface ProgressIndicatorProps {
  steps: Array<{
    id: string
    title: string
    description?: string
  }>
  currentStep: number
  completedSteps: number[]
  onStepClick?: (stepIndex: number) => void
  allowStepNavigation?: boolean
  className?: string
}

/**
 * ProgressIndicator component for multi-step forms
 *
 * Features:
 * - Visual step progression with completion indicators
 * - Percentage completion display
 * - Optional step navigation (click to go to step)
 * - Responsive design for mobile/tablet/desktop
 * - Accessibility support with ARIA attributes
 * - Keyboard navigation support
 *
 * Usage:
 * ```tsx
 * <ProgressIndicator
 *   steps={[
 *     { id: 'org', title: 'Organization', description: 'Basic info' },
 *     { id: 'business', title: 'Business Model', description: 'Operations' },
 *     { id: 'sustainability', title: 'Sustainability', description: 'Initiatives' }
 *   ]}
 *   currentStep={1}
 *   completedSteps={[0]}
 *   onStepClick={(step) => navigateToStep(step)}
 *   allowStepNavigation={true}
 * />
 * ```
 */
export function ProgressIndicator({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  allowStepNavigation = false,
  className,
}: ProgressIndicatorProps) {
  // Calculate completion percentage
  const completionPercentage = Math.round(
    (completedSteps.length / steps.length) * 100
  )

  // Determine step status
  const getStepStatus = (
    stepIndex: number
  ): 'completed' | 'current' | 'upcoming' => {
    if (completedSteps.includes(stepIndex)) return 'completed'
    if (stepIndex === currentStep) return 'current'
    return 'upcoming'
  }

  // Handle step click
  const handleStepClick = (stepIndex: number) => {
    if (allowStepNavigation && onStepClick) {
      onStepClick(stepIndex)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium text-muted-foreground text-sm">
            Progress
          </span>
          <span className="font-medium text-primary text-sm">
            {completionPercentage}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-start justify-center overflow-x-auto pb-4">
        <div className="flex items-center space-x-0">
          {steps.map((step, index) => (
            <StepIndicator
              description={step.description}
              disabled={!allowStepNavigation}
              isLast={index === steps.length - 1}
              key={step.id}
              onClick={() => handleStepClick(index)}
              status={getStepStatus(index)}
              step={index + 1}
              title={step.title}
            />
          ))}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="mt-4 text-center">
        <div className="font-semibold text-foreground text-lg">
          {steps[currentStep]?.title}
        </div>
        {steps[currentStep]?.description && (
          <div className="mt-1 text-muted-foreground text-sm">
            {steps[currentStep].description}
          </div>
        )}
        <div className="mt-2 text-muted-foreground text-xs">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
    </div>
  )
}

export default ProgressIndicator
