'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FormNavigationProps {
  isFirstStep: boolean
  isLastStep: boolean
  isSubmitting: boolean
  onPrevious: () => void
  className?: string
  previousLabel?: string
  nextLabel?: string
  submitLabel?: string
  submittingLabel?: string
}

export function FormNavigation({
  isFirstStep,
  isLastStep,
  isSubmitting,
  onPrevious,
  className,
  previousLabel = "Back",
  nextLabel = "Next",
  submitLabel = "Submit",
  submittingLabel = "Submitting...",
}: FormNavigationProps) {
  return (
    <div className={cn('flex justify-between pt-4', className)}>
      <Button
        className={cn(isFirstStep && 'invisible')}
        disabled={isFirstStep}
        onClick={onPrevious}
        type="button"
        variant="outline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> {previousLabel}
      </Button>
      
      <Button disabled={isSubmitting} type="submit">
        {isLastStep ? (
          isSubmitting ? (
            submittingLabel
          ) : (
            submitLabel
          )
        ) : (
          <>
            {nextLabel} <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}