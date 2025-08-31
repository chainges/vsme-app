'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import NavigationControls, {
  CompactNavigationControls,
} from './NavigationControls'
import ProgressIndicator from './ProgressIndicator'

// Demo form steps
const DEMO_STEPS = [
  {
    id: 'organization',
    title: 'Organization',
    description: 'Basic company information',
  },
  {
    id: 'business-model',
    title: 'Business Model',
    description: 'Operations and subsidiaries',
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
    description: 'Environmental initiatives',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm and submit',
  },
]

/**
 * Demo component to showcase ProgressIndicator and NavigationControls
 */
export default function ProgressNavigationDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [allowStepNavigation, setAllowStepNavigation] = useState(true)
  const [useCompactControls, setUseCompactControls] = useState(false)

  // Simulate validation delay
  const simulateValidation = async () => {
    setIsValidating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsValidating(false)
  }

  // Simulate loading delay
  const simulateLoading = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  // Handle next step
  const handleNext = async () => {
    await simulateValidation()

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep])
    }

    // Move to next step
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  // Handle step click (direct navigation)
  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to completed steps or the next step
    if (
      completedSteps.includes(stepIndex) ||
      stepIndex <= Math.max(...completedSteps, -1) + 1
    ) {
      setCurrentStep(stepIndex)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    await simulateLoading()

    // Mark final step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep])
    }

    alert('Form submitted successfully!')
  }

  // Reset demo
  const resetDemo = () => {
    setCurrentStep(0)
    setCompletedSteps([])
    setIsLoading(false)
    setIsValidating(false)
  }

  // Check if we can go to next step
  const canGoNext = !(isLoading || isValidating)
  const canGoPrevious = currentStep > 0 && !isLoading && !isValidating

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Progress & Navigation Demo</CardTitle>
        <CardDescription>
          Demonstration of ProgressIndicator and NavigationControls components
          with step validation and loading states
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Demo Controls */}
        <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">Demo Controls</Badge>
          </div>

          <Button
            onClick={() => setAllowStepNavigation(!allowStepNavigation)}
            size="sm"
            variant="outline"
          >
            Step Navigation: {allowStepNavigation ? 'Enabled' : 'Disabled'}
          </Button>

          <Button
            onClick={() => setUseCompactControls(!useCompactControls)}
            size="sm"
            variant="outline"
          >
            Layout: {useCompactControls ? 'Compact' : 'Full'}
          </Button>

          <Button onClick={resetDemo} size="sm" variant="outline">
            Reset Demo
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Progress Indicator</h3>
          <ProgressIndicator
            allowStepNavigation={allowStepNavigation}
            completedSteps={completedSteps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            steps={DEMO_STEPS}
          />
        </div>

        <Separator />

        {/* Current Step Content */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Current Step Content</h3>
          <div className="rounded-lg border p-6 text-center">
            <h4 className="font-medium text-xl">
              {DEMO_STEPS[currentStep].title}
            </h4>
            <p className="mt-2 text-muted-foreground">
              {DEMO_STEPS[currentStep].description}
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                This is where the actual form fields would be rendered for step{' '}
                {currentStep + 1}.
              </p>
              {isValidating && (
                <p className="text-blue-600 text-sm">Validating step data...</p>
              )}
              {completedSteps.includes(currentStep) && (
                <Badge className="mt-2" variant="default">
                  Step Completed ✓
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Navigation Controls */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">
            Navigation Controls {useCompactControls ? '(Compact)' : '(Full)'}
          </h3>

          {useCompactControls ? (
            <CompactNavigationControls
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
              currentStep={currentStep}
              disabled={false}
              isLoading={isLoading}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              totalSteps={DEMO_STEPS.length}
            />
          ) : (
            <NavigationControls
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
              currentStep={currentStep}
              disabled={false}
              isLoading={isLoading}
              isValidating={isValidating}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
              totalSteps={DEMO_STEPS.length}
            />
          )}
        </div>

        {/* Demo Information */}
        <div className="rounded-lg bg-muted p-4 text-sm">
          <h4 className="mb-2 font-medium">Demo Features:</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              • Click on completed steps to navigate directly (when enabled)
            </li>
            <li>• Next button validates current step (1 second delay)</li>
            <li>• Submit button on final step (2 second loading)</li>
            <li>• Keyboard navigation: Enter (next), Escape (previous)</li>
            <li>• Responsive design adapts to screen size</li>
            <li>• Progress bar shows completion percentage</li>
            <li>• Accessibility support with ARIA attributes</li>
          </ul>
        </div>

        {/* Debug Information */}
        <details className="rounded-lg border p-4">
          <summary className="cursor-pointer font-medium">
            Debug Information
          </summary>
          <div className="mt-4 space-y-2 text-sm">
            <div>
              Current Step: {currentStep} ({DEMO_STEPS[currentStep].id})
            </div>
            <div>Completed Steps: [{completedSteps.join(', ')}]</div>
            <div>Can Go Next: {canGoNext ? 'Yes' : 'No'}</div>
            <div>Can Go Previous: {canGoPrevious ? 'Yes' : 'No'}</div>
            <div>Is Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div>Is Validating: {isValidating ? 'Yes' : 'No'}</div>
            <div>
              Step Navigation: {allowStepNavigation ? 'Enabled' : 'Disabled'}
            </div>
            <div>
              Completion:{' '}
              {Math.round((completedSteps.length / DEMO_STEPS.length) * 100)}%
            </div>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}
