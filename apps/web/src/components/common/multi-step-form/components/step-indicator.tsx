'use client'

import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StepConfig } from '../types'

interface StepIndicatorProps {
  steps: readonly StepConfig[]
  currentStep: number
  className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn('mb-8 flex justify-between', className)}>
      {steps.map((stepConfig, index) => (
        <div className="flex flex-col items-center" key={stepConfig.id}>
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs',
              {
                'bg-primary text-primary-foreground': index < currentStep,
                'bg-primary text-primary-foreground ring-2 ring-primary/30': index === currentStep,
                'bg-secondary text-secondary-foreground': index > currentStep,
              }
            )}
          >
            {index < currentStep ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
          </div>
          <span className="mt-1 hidden text-xs sm:block">{stepConfig.title}</span>
        </div>
      ))}
    </div>
  )
}