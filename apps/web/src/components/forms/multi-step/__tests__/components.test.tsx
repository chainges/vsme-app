import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CompletionScreen, FormNavigation, ProgressBar, StepIndicator } from '../components'
import { stepConfigurations } from '../schemas'

// Define regex patterns at module level for performance
const LUCIDE_CHECK_CIRCLE_REGEX = /lucide-check-circle-2/
const LUCIDE_ARROW_LEFT_REGEX = /lucide-arrow-left/
const LUCIDE_ARROW_RIGHT_REGEX = /lucide-arrow-right/
const SUSTAINABILITY_TEXT_REGEX = /Your sustainability reporting setup is complete/
const BACK_BUTTON_REGEX = /Back/
const NEXT_BUTTON_REGEX = /Next/
const SUBMIT_BUTTON_REGEX = /Submit/
const SUBMITTING_BUTTON_REGEX = /Submitting.../
const GO_BACK_BUTTON_REGEX = /Go Back/
const CONTINUE_BUTTON_REGEX = /Continue/
const FINISH_BUTTON_REGEX = /Finish/
const PROCESSING_BUTTON_REGEX = /Processing.../

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('ProgressBar', () => {
  it('should render progress correctly', () => {
    render(<ProgressBar currentStep={1} totalSteps={3} />)

    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
    expect(screen.getByText('67%')).toBeInTheDocument()
  })

  it('should calculate progress for first step', () => {
    render(<ProgressBar currentStep={0} totalSteps={3} />)

    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
    expect(screen.getByText('33%')).toBeInTheDocument()
  })

  it('should calculate progress for last step', () => {
    render(<ProgressBar currentStep={2} totalSteps={3} />)

    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <ProgressBar className="custom-class" currentStep={0} totalSteps={3} />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('StepIndicator', () => {
  it('should render all steps', () => {
    render(<StepIndicator currentStep={1} steps={stepConfigurations as any} />)

    expect(screen.getByText('Company Information')).toBeInTheDocument()
    expect(screen.getByText('Reporting Setup')).toBeInTheDocument()
    expect(screen.getByText('Sustainability Practices')).toBeInTheDocument()
  })

  it('should show completed steps with check icon', () => {
    render(<StepIndicator currentStep={2} steps={stepConfigurations as any} />)

    // First step should be completed (check icon)
    const checkIcons = screen.getAllByTestId(LUCIDE_CHECK_CIRCLE_REGEX)
    expect(checkIcons).toHaveLength(2) // Steps 0 and 1 are completed
  })

  it('should highlight current step', () => {
    render(<StepIndicator currentStep={1} steps={stepConfigurations as any} />)

    const stepCircles = screen
      .getAllByRole('generic')
      .filter((el) => el.className.includes('rounded-full'))

    // Current step should have ring styling
    const currentStepCircle = stepCircles.find((el) => el.className.includes('ring-2'))
    expect(currentStepCircle).toBeInTheDocument()
  })

  it('should show step numbers for future steps', () => {
    render(<StepIndicator currentStep={0} steps={stepConfigurations as any} />)

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <StepIndicator className="custom-class" currentStep={0} steps={stepConfigurations as any} />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('CompletionScreen', () => {
  it('should render with default props', () => {
    render(<CompletionScreen />)

    expect(screen.getByText('Setup Complete!')).toBeInTheDocument()
    expect(screen.getByText(SUSTAINABILITY_TEXT_REGEX)).toBeInTheDocument()
  })

  it('should render with custom title and description', () => {
    render(<CompletionScreen description="Custom description text" title="Custom Title" />)

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom description text')).toBeInTheDocument()
  })

  it('should render restart button when onRestart is provided', () => {
    const onRestart = vi.fn()
    render(<CompletionScreen onRestart={onRestart} />)

    const restartButton = screen.getByRole('button', { name: 'Start Over' })
    expect(restartButton).toBeInTheDocument()
  })

  it('should call onRestart when restart button is clicked', async () => {
    const onRestart = vi.fn()
    const user = userEvent.setup()

    render(<CompletionScreen onRestart={onRestart} />)

    const restartButton = screen.getByRole('button', { name: 'Start Over' })
    await user.click(restartButton)

    expect(onRestart).toHaveBeenCalledTimes(1)
  })

  it('should not render restart button when onRestart is not provided', () => {
    render(<CompletionScreen />)

    expect(screen.queryByRole('button', { name: 'Start Over' })).not.toBeInTheDocument()
  })

  it('should render check circle icon', () => {
    render(<CompletionScreen />)

    expect(screen.getByTestId(LUCIDE_CHECK_CIRCLE_REGEX)).toBeInTheDocument()
  })
})

describe('FormNavigation', () => {
  const defaultProps = {
    isFirstStep: false,
    isLastStep: false,
    isSubmitting: false,
    onPrevious: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render both buttons when not first or last step', () => {
    render(<FormNavigation {...defaultProps} />)

    expect(screen.getByRole('button', { name: BACK_BUTTON_REGEX })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: NEXT_BUTTON_REGEX })).toBeInTheDocument()
  })

  it('should hide back button on first step', () => {
    render(<FormNavigation {...defaultProps} isFirstStep={true} />)

    const backButton = screen.getByRole('button', { name: BACK_BUTTON_REGEX })
    expect(backButton).toHaveClass('invisible')
    expect(backButton).toBeDisabled()
  })

  it('should show submit button on last step', () => {
    render(<FormNavigation {...defaultProps} isLastStep={true} />)

    expect(screen.getByRole('button', { name: SUBMIT_BUTTON_REGEX })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: NEXT_BUTTON_REGEX })).not.toBeInTheDocument()
  })

  it('should show submitting state', () => {
    render(<FormNavigation {...defaultProps} isLastStep={true} isSubmitting={true} />)

    const submitButton = screen.getByRole('button', { name: SUBMITTING_BUTTON_REGEX })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('should call onPrevious when back button is clicked', async () => {
    const onPrevious = vi.fn()
    const user = userEvent.setup()

    render(<FormNavigation {...defaultProps} onPrevious={onPrevious} />)

    const backButton = screen.getByRole('button', { name: BACK_BUTTON_REGEX })
    await user.click(backButton)

    expect(onPrevious).toHaveBeenCalledTimes(1)
  })

  it('should render custom labels', () => {
    render(
      <FormNavigation
        {...defaultProps}
        nextLabel="Continue"
        previousLabel="Go Back"
        submitLabel="Finish"
        submittingLabel="Processing..."
      />
    )

    expect(screen.getByRole('button', { name: GO_BACK_BUTTON_REGEX })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: CONTINUE_BUTTON_REGEX })).toBeInTheDocument()
  })

  it('should render custom submit and submitting labels', () => {
    render(<FormNavigation {...defaultProps} isLastStep={true} submitLabel="Finish" />)

    expect(screen.getByRole('button', { name: FINISH_BUTTON_REGEX })).toBeInTheDocument()

    render(
      <FormNavigation
        {...defaultProps}
        isLastStep={true}
        isSubmitting={true}
        submittingLabel="Processing..."
      />
    )

    expect(screen.getByRole('button', { name: PROCESSING_BUTTON_REGEX })).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(<FormNavigation {...defaultProps} className="custom-class" />)

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should render arrow icons', () => {
    render(<FormNavigation {...defaultProps} />)

    expect(screen.getByTestId(LUCIDE_ARROW_LEFT_REGEX)).toBeInTheDocument()
    expect(screen.getByTestId(LUCIDE_ARROW_RIGHT_REGEX)).toBeInTheDocument()
  })
})
