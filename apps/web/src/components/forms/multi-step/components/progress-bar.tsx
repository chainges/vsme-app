'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function ProgressBar({ currentStep, totalSteps, className }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className={cn('mb-8', className)}>
      <div className="mb-2 flex justify-between">
        <span className="font-medium text-sm">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="font-medium text-sm">{Math.round(progress)}%</span>
      </div>
      <Progress className="h-2" value={progress} />
    </div>
  )
}
