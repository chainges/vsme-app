'use client'

import { useState } from 'react'
import { z } from 'zod'

import MultiStepForm from './MultiStepForm'
import type { MultiStepFormConfig } from '@/lib/forms/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Demo form data structure
interface DemoFormData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
  }
  preferences: {
    notifications: boolean
    theme: 'light' | 'dark'
    language: string
  }
  review: {
    agreedToTerms: boolean
  }
}

// Validation schemas for each step
const personalInfoSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
  }),
})

const preferencesSchema = z.object({
  preferences: z.object({
    notifications: z.boolean(),
    theme: z.enum(['light', 'dark']),
    language: z.string().min(1, 'Please select a language'),
  }),
})

const reviewSchema = z.object({
  review: z.object({
    agreedToTerms: z.boolean().refine(val => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  }),
})

/**
 * MultiStepForm Demo Component
 * 
 * Demonstrates the integration of the MultiStepForm component with:
 * - TanStack Forms validation
 * - Storage persistence
 * - Step-based navigation
 * - Existing UI components
 * - Progress tracking
 */
export default function MultiStepFormDemo() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState<Partial<DemoFormData>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [completedData, setCompletedData] = useState<DemoFormData | null>(null)

  // Form configuration
  const formConfig: MultiStepFormConfig<DemoFormData> = {
    id: 'demo-multistep-form',
    title: 'Multi-Step Form Demo',
    description: 'A demonstration of the MultiStepForm controller component',
    steps: [
      {
        id: 'personal-info',
        title: 'Personal Information',
        description: 'Tell us about yourself to get started',
        schema: personalInfoSchema,
        fields: [
          {
            name: 'personalInfo.firstName',
            type: 'text',
            label: 'First Name',
            placeholder: 'Enter your first name',
            required: true,
          },
          {
            name: 'personalInfo.lastName',
            type: 'text',
            label: 'Last Name',
            placeholder: 'Enter your last name',
            required: true,
          },
          {
            name: 'personalInfo.email',
            type: 'email',
            label: 'Email Address',
            placeholder: 'Enter your email address',
            required: true,
          },
        ],
      },
      {
        id: 'preferences',
        title: 'Preferences',
        description: 'Customize your experience',
        schema: preferencesSchema,
        fields: [
          {
            name: 'preferences.notifications',
            type: 'checkbox',
            label: 'Enable Email Notifications',
            required: false,
          },
          {
            name: 'preferences.theme',
            type: 'select',
            label: 'Theme Preference',
            options: [
              { value: 'light', label: 'Light Mode' },
              { value: 'dark', label: 'Dark Mode' },
            ],
            required: true,
          },
          {
            name: 'preferences.language',
            type: 'select',
            label: 'Preferred Language',
            options: [
              { value: 'en', label: 'English' },
              { value: 'no', label: 'Norwegian' },
              { value: 'sv', label: 'Swedish' },
              { value: 'da', label: 'Danish' },
            ],
            required: true,
          },
        ],
      },
      {
        id: 'review',
        title: 'Review & Submit',
        description: 'Review your information and submit',
        schema: reviewSchema,
        fields: [
          {
            name: 'review.agreedToTerms',
            type: 'checkbox',
            label: 'I agree to the terms and conditions',
            required: true,
          },
        ],
      },
    ],
    onSubmit: async (data) => {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
      setCompletedData(data)
      setIsVisible(false)
    },
    onSave: async (data) => {
      console.log('Form data auto-saved:', data)
    },
  }

  const handleReset = () => {
    setFormData({})
    setCurrentStep(0)
    setCompletedData(null)
  }

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <Card>
        <CardHeader>
          <CardTitle>MultiStepForm Controller Demo</CardTitle>
          <CardDescription>
            This demo showcases the MultiStepForm component with step management,
            validation, storage persistence, and integration with existing UI components.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={() => setIsVisible(!isVisible)}
              variant={isVisible ? "outline" : "default"}
            >
              {isVisible ? 'Hide Form' : 'Show Multi-Step Form'}
            </Button>
            <Button onClick={handleReset} variant="outline" disabled={!completedData}>
              Reset Demo
            </Button>
          </div>
          
          {/* Current State Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Current State:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Current Step: {currentStep + 1} of 3</li>
                <li>Form Visible: {isVisible ? 'Yes' : 'No'}</li>
                <li>Form Data Keys: {Object.keys(formData).length}</li>
                <li>Completed: {completedData ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Features Demonstrated:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ TanStack Forms integration</li>
                <li>✓ Zod validation schemas</li>
                <li>✓ Step-based navigation</li>
                <li>✓ Auto-save to localStorage</li>
                <li>✓ Progress tracking</li>
                <li>✓ Existing UI component integration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {completedData && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">Form Submitted Successfully!</CardTitle>
            <CardDescription className="text-green-600">
              Your multi-step form has been completed and submitted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">Submitted Data:</h4>
              <pre className="bg-white p-3 rounded-md text-xs overflow-x-auto">
                {JSON.stringify(completedData, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MultiStepForm Component */}
      {isVisible && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Multi-Step Form Implementation</h3>
          <MultiStepForm
            config={formConfig}
            onStepChange={(step) => {
              console.log('Step changed to:', step)
              setCurrentStep(step)
            }}
            onDataChange={(data) => {
              console.log('Form data changed:', data)
              setFormData(data)
            }}
          />
        </div>
      )}

      {/* Integration Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Points</CardTitle>
          <CardDescription>
            The MultiStepForm component integrates seamlessly with existing components:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Existing Components Used:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• NavigationControls - Step navigation</li>
                <li>• ProgressIndicator - Progress tracking</li>
                <li>• Button - UI consistency</li>
                <li>• Form elements - Field rendering</li>
                <li>• LocalStorageProvider - Data persistence</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Maintained Patterns:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Component composition</li>
                <li>• TailwindCSS styling</li>
                <li>• TypeScript strict typing</li>
                <li>• shadcn/ui design system</li>
                <li>• Accessibility standards</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Technical Implementation:</h4>
            <p className="text-sm text-muted-foreground">
              The MultiStepForm controller orchestrates the entire form flow while maintaining
              compatibility with existing field components, storage providers, and UI patterns.
              It uses TanStack Forms for state management and Zod for validation, with automatic
              persistence to localStorage and step-based navigation controls.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
