import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useStepNavigation } from '../hooks/use-step-navigation'

// Mock the use-form-data hook
vi.mock('@/hooks/use-form-data', () => ({
  useFormData: () => ({
    getEnrichedDefaults: vi.fn(() => ({})),
  }),
}))

describe('useStepNavigation', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 3 })
    )

    expect(result.current.step).toBe(0)
    expect(result.current.isFirstStep).toBe(true)
    expect(result.current.isLastStep).toBe(false)
    expect(result.current.progress).toBeCloseTo(33.33, 2)
  })

  it('should initialize with custom initial step', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 3, initialStep: 1 })
    )

    expect(result.current.step).toBe(1)
    expect(result.current.isFirstStep).toBe(false)
    expect(result.current.isLastStep).toBe(false)
    expect(result.current.progress).toBeCloseTo(66.67, 2)
  })

  it('should navigate to next step', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 3 })
    )

    act(() => {
      result.current.nextStep()
    })

    expect(result.current.step).toBe(1)
    expect(result.current.isFirstStep).toBe(false)
    expect(result.current.isLastStep).toBe(false)
  })

  it('should not go past last step', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 3, initialStep: 2 })
    )

    expect(result.current.isLastStep).toBe(true)

    act(() => {
      result.current.nextStep()
    })

    expect(result.current.step).toBe(2) // Should remain on last step
  })

  it('should navigate to previous step', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 3, initialStep: 1 })
    )

    act(() => {
      result.current.prevStep()
    })

    expect(result.current.step).toBe(0)
    expect(result.current.isFirstStep).toBe(true)
  })

  it('should not go before first step', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 3 })
    )

    expect(result.current.isFirstStep).toBe(true)

    act(() => {
      result.current.prevStep()
    })

    expect(result.current.step).toBe(0) // Should remain on first step
  })

  it('should go to specific step', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 5 })
    )

    act(() => {
      result.current.goToStep(3)
    })

    expect(result.current.step).toBe(3)
    expect(result.current.progress).toBe(80)
  })

  it('should not go to invalid step index', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 3 })
    )

    // Try to go to negative step
    act(() => {
      result.current.goToStep(-1)
    })
    expect(result.current.step).toBe(0)

    // Try to go to step beyond total
    act(() => {
      result.current.goToStep(5)
    })
    expect(result.current.step).toBe(0)
  })

  it('should calculate progress correctly', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 4 })
    )

    expect(result.current.progress).toBe(25) // Step 1 of 4

    act(() => {
      result.current.nextStep()
    })
    expect(result.current.progress).toBe(50) // Step 2 of 4

    act(() => {
      result.current.nextStep()
    })
    expect(result.current.progress).toBe(75) // Step 3 of 4

    act(() => {
      result.current.nextStep()
    })
    expect(result.current.progress).toBe(100) // Step 4 of 4
  })

  it('should update step using setStep', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 3 })
    )

    act(() => {
      result.current.setStep(2)
    })

    expect(result.current.step).toBe(2)
    expect(result.current.isLastStep).toBe(true)
  })

  it('should handle single step scenario', () => {
    const { result } = renderHook(() => 
      useStepNavigation({ totalSteps: 1 })
    )

    expect(result.current.step).toBe(0)
    expect(result.current.isFirstStep).toBe(true)
    expect(result.current.isLastStep).toBe(true)
    expect(result.current.progress).toBe(100)

    // Navigation should not change step
    act(() => {
      result.current.nextStep()
    })
    expect(result.current.step).toBe(0)

    act(() => {
      result.current.prevStep()
    })
    expect(result.current.step).toBe(0)
  })
})

// Note: Testing useMultiStepForm would require more complex setup with react-hook-form
// and the actual form data hook. Since it's tightly coupled with the form logic,
// it's better tested as part of integration tests with the actual component.
// We'll add those tests in Phase 4 when we refactor the main component.