import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import NavigationControls, {
  CompactNavigationControls,
} from '../NavigationControls'
import ProgressIndicator from '../ProgressIndicator'

// Mock steps for testing
const mockSteps = [
  { id: 'step1', title: 'Step 1', description: 'First step' },
  { id: 'step2', title: 'Step 2', description: 'Second step' },
  { id: 'step3', title: 'Step 3', description: 'Third step' },
]

describe('ProgressIndicator', () => {
  it('renders all steps with correct status', () => {
    render(
      <ProgressIndicator
        completedSteps={[0]}
        currentStep={1}
        steps={mockSteps}
      />
    )

    // Check that all steps are rendered - use getAllByText to handle multiple elements
    expect(screen.getAllByText('Step 1')).toHaveLength(2) // Once in step list, once in current step info
    expect(screen.getAllByText('Step 2')).toHaveLength(2) // Once in step list, once in current step info
    expect(screen.getByText('Step 3')).toBeInTheDocument()

    // Check step descriptions
    expect(screen.getByText('First step')).toBeInTheDocument()
    expect(screen.getAllByText('Second step')).toHaveLength(2) // Once in step list, once in current step info
    expect(screen.getByText('Third step')).toBeInTheDocument()
  })

  it('displays correct completion percentage', () => {
    render(
      <ProgressIndicator
        completedSteps={[0, 1]}
        currentStep={2}
        steps={mockSteps}
      />
    )

    // 2 completed out of 3 steps = 67%
    expect(screen.getByText('67%')).toBeInTheDocument()
  })

  it('shows current step information', () => {
    render(
      <ProgressIndicator
        completedSteps={[0]}
        currentStep={1}
        steps={mockSteps}
      />
    )

    // Should show current step title prominently (appears in both step list and current step info)
    expect(screen.getAllByText('Step 2')).toHaveLength(2)
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
  })

  it('handles step click when navigation is allowed', () => {
    const onStepClick = vi.fn()

    render(
      <ProgressIndicator
        allowStepNavigation={true}
        completedSteps={[0]}
        currentStep={1}
        onStepClick={onStepClick}
        steps={mockSteps}
      />
    )

    // Click on first step (completed)
    const step1Button = screen.getByLabelText(/Step 1.*completed/)
    fireEvent.click(step1Button)

    expect(onStepClick).toHaveBeenCalledWith(0)
  })

  it('does not handle step click when navigation is disabled', () => {
    const onStepClick = vi.fn()

    render(
      <ProgressIndicator
        allowStepNavigation={false}
        completedSteps={[0]}
        currentStep={1}
        onStepClick={onStepClick}
        steps={mockSteps}
      />
    )

    // Try to click on first step
    const step1Button = screen.getByLabelText(/Step 1.*completed/)
    fireEvent.click(step1Button)

    expect(onStepClick).not.toHaveBeenCalled()
  })

  it('shows check icon for completed steps', () => {
    render(
      <ProgressIndicator
        completedSteps={[0]}
        currentStep={1}
        steps={mockSteps}
      />
    )

    // First step should have a check icon (completed)
    const step1Button = screen.getByLabelText(/Step 1.*completed/)
    expect(step1Button.querySelector('svg')).toBeInTheDocument()
  })

  it('applies correct ARIA attributes', () => {
    render(
      <ProgressIndicator
        completedSteps={[0]}
        currentStep={1}
        steps={mockSteps}
      />
    )

    // Current step should have aria-current="step"
    const currentStepButton = screen.getByLabelText(/Step 2.*current/)
    expect(currentStepButton).toHaveAttribute('aria-current', 'step')
  })
})

describe('NavigationControls', () => {
  const defaultProps = {
    currentStep: 1,
    totalSteps: 3,
    canGoNext: true,
    canGoPrevious: true,
    onNext: vi.fn(),
    onPrevious: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders next and previous buttons', () => {
    render(<NavigationControls {...defaultProps} />)

    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('shows step counter', () => {
    render(<NavigationControls {...defaultProps} />)

    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
  })

  it('handles next button click', () => {
    render(<NavigationControls {...defaultProps} />)

    fireEvent.click(screen.getByText('Next'))
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1)
  })

  it('handles previous button click', () => {
    render(<NavigationControls {...defaultProps} />)

    fireEvent.click(screen.getByText('Previous'))
    expect(defaultProps.onPrevious).toHaveBeenCalledTimes(1)
  })

  it('disables next button when canGoNext is false', () => {
    render(<NavigationControls {...defaultProps} canGoNext={false} />)

    const nextButton = screen.getByText('Next')
    expect(nextButton).toBeDisabled()
  })

  it('disables previous button when canGoPrevious is false', () => {
    render(<NavigationControls {...defaultProps} canGoPrevious={false} />)

    const previousButton = screen.getByText('Previous')
    expect(previousButton).toBeDisabled()
  })

  it('shows submit button on last step', () => {
    const onSubmit = vi.fn()

    render(
      <NavigationControls
        {...defaultProps}
        currentStep={2}
        onSubmit={onSubmit}
      />
    )

    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('handles submit button click', () => {
    const onSubmit = vi.fn()

    render(
      <NavigationControls
        {...defaultProps}
        currentStep={2}
        onSubmit={onSubmit}
      />
    )

    fireEvent.click(screen.getByText('Submit'))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<NavigationControls {...defaultProps} isLoading={true} />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByText('Previous')).toBeDisabled()
  })

  it('shows validating state', () => {
    render(<NavigationControls {...defaultProps} isValidating={true} />)

    // Should show loading spinner for validation
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    render(<NavigationControls {...defaultProps} />)

    const navigation = screen.getByRole('navigation')

    // Test Enter key for next
    fireEvent.keyDown(navigation, { key: 'Enter' })
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1)

    // Test Escape key for previous
    fireEvent.keyDown(navigation, { key: 'Escape' })
    expect(defaultProps.onPrevious).toHaveBeenCalledTimes(1)
  })

  it('uses custom labels when provided', () => {
    render(
      <NavigationControls
        {...defaultProps}
        nextLabel="Continue"
        previousLabel="Back"
        submitLabel="Finish"
      />
    )

    expect(screen.getByText('Continue')).toBeInTheDocument()
    expect(screen.getByText('Back')).toBeInTheDocument()
  })
})

describe('CompactNavigationControls', () => {
  const defaultProps = {
    currentStep: 1,
    totalSteps: 3,
    canGoNext: true,
    canGoPrevious: true,
    onNext: vi.fn(),
    onPrevious: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders compact navigation with progress dots', () => {
    render(<CompactNavigationControls {...defaultProps} />)

    // Should have 3 progress dots
    const navigation = screen.getByRole('navigation')
    const dots = navigation.querySelectorAll('div[class*="rounded-full"]')
    expect(dots).toHaveLength(3)
  })

  it('handles next and previous actions', () => {
    render(<CompactNavigationControls {...defaultProps} />)

    const buttons = screen.getAllByRole('button')

    // Previous button (first button)
    fireEvent.click(buttons[0])
    expect(defaultProps.onPrevious).toHaveBeenCalledTimes(1)

    // Next button (last button)
    fireEvent.click(buttons[1])
    expect(defaultProps.onNext).toHaveBeenCalledTimes(1)
  })

  it('shows submit icon on last step', () => {
    const onSubmit = vi.fn()

    render(
      <CompactNavigationControls
        {...defaultProps}
        currentStep={2}
        onSubmit={onSubmit}
      />
    )

    const buttons = screen.getAllByRole('button')
    const submitButton = buttons[1]

    fireEvent.click(submitButton)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('shows loading state in compact mode', () => {
    render(<CompactNavigationControls {...defaultProps} isLoading={true} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toBeDisabled() // Previous button
    expect(buttons[1]).toBeDisabled() // Next button
  })
})

describe('Accessibility', () => {
  it('ProgressIndicator has proper ARIA labels', () => {
    render(
      <ProgressIndicator
        completedSteps={[0]}
        currentStep={1}
        steps={mockSteps}
      />
    )

    // Check ARIA labels for step buttons
    expect(screen.getByLabelText(/Step 1.*completed/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Step 2.*current/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Step 3/)).toBeInTheDocument()
  })

  it('NavigationControls has proper ARIA labels', () => {
    render(
      <NavigationControls
        canGoNext={true}
        canGoPrevious={true}
        currentStep={1}
        onNext={vi.fn()}
        onPrevious={vi.fn()}
        totalSteps={3}
      />
    )

    expect(screen.getByLabelText(/Go to previous step/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Go to next step/)).toBeInTheDocument()
  })

  it('CompactNavigationControls has proper ARIA labels', () => {
    render(
      <CompactNavigationControls
        canGoNext={true}
        canGoPrevious={true}
        currentStep={1}
        onNext={vi.fn()}
        onPrevious={vi.fn()}
        totalSteps={3}
      />
    )

    expect(screen.getByLabelText('Previous step')).toBeInTheDocument()
    expect(screen.getByLabelText('Next step')).toBeInTheDocument()
  })
})
