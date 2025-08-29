import { useState } from 'react'

export interface UseStepNavigationProps {
  totalSteps: number
  initialStep?: number
}

export interface UseStepNavigationReturn {
  step: number
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (stepIndex: number) => void
  isFirstStep: boolean
  isLastStep: boolean
  progress: number
}

export function useStepNavigation({
  totalSteps,
  initialStep = 0,
}: UseStepNavigationProps): UseStepNavigationReturn {
  const [step, setStep] = useState(initialStep)

  // Calculated properties
  const isFirstStep = step === 0
  const isLastStep = step === totalSteps - 1
  const progress = ((step + 1) / totalSteps) * 100

  // Navigation functions
  const nextStep = () => {
    if (!isLastStep) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (!isFirstStep) {
      setStep(step - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setStep(stepIndex)
    }
  }

  return {
    step,
    setStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    progress,
  }
}
