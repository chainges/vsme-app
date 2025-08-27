/**
 * Formity Test Form Page - SPIKE-1 Implementation
 * 
 * This page implements the proof-of-concept multi-step form using Formity
 * to evaluate its integration with our existing TanStack Forms setup.
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import FormityTestForm from './FormityTestForm'
import FormityTanStackIntegration from './FormityTanStackIntegration'
import type { FormityConfig, SpikeFormData, FormityState, FormityEvaluationResult } from './types'

/**
 * Main page component for Formity SPIKE evaluation
 */
export default function TestFormPage() {
  const [activeTest, setActiveTest] = useState<'basic' | 'tanstack' | 'none'>('none')
  const [formData, setFormData] = useState<Partial<SpikeFormData>>({})
  const [evaluationResults, setEvaluationResults] = useState<Partial<FormityEvaluationResult>>({})

  // Basic Formity test configuration
  const basicConfig: FormityConfig<SpikeFormData> = {
    id: 'formity-spike-basic',
    backend: 'react-hook-form',
    autoSave: true,
    validateOnBlur: true,
    schema: {
      steps: [
        {
          id: 'personal',
          title: 'Personal Information',
          description: 'Tell us about yourself',
          fields: [
            {
              name: 'personalInfo.firstName',
              type: 'text',
              label: 'First Name',
              placeholder: 'Enter your first name',
              required: true
            },
            {
              name: 'personalInfo.lastName',
              type: 'text',
              label: 'Last Name',
              placeholder: 'Enter your last name',
              required: true
            },
            {
              name: 'personalInfo.email',
              type: 'email',
              label: 'Email Address',
              placeholder: 'you@example.com',
              required: true
            },
            {
              name: 'personalInfo.phone',
              type: 'tel',
              label: 'Phone Number',
              placeholder: '+1 (555) 123-4567'
            }
          ]
        },
        {
          id: 'preferences',
          title: 'Preferences',
          description: 'Configure your preferences',
          fields: [
            {
              name: 'preferences.newsletter',
              type: 'checkbox',
              label: 'Subscribe to newsletter'
            },
            {
              name: 'preferences.notifications',
              type: 'select',
              label: 'Notification Preference',
              required: true,
              options: [
                { value: 'none', label: 'No notifications' },
                { value: 'email', label: 'Email only' },
                { value: 'sms', label: 'SMS only' },
                { value: 'both', label: 'Email and SMS' }
              ]
            },
            {
              name: 'preferences.theme',
              type: 'select',
              label: 'Theme Preference',
              options: [
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'auto', label: 'System' }
              ]
            }
          ]
        },
        {
          id: 'feedback',
          title: 'Feedback',
          description: 'Help us improve',
          fields: [
            {
              name: 'feedback.rating',
              type: 'number',
              label: 'Rating (1-10)',
              min: 1,
              max: 10,
              required: true
            },
            {
              name: 'feedback.comments',
              type: 'textarea',
              label: 'Additional Comments',
              placeholder: 'Tell us what you think...',
              rows: 4
            },
            {
              name: 'feedback.wouldRecommend',
              type: 'checkbox',
              label: 'Would you recommend this to others?'
            }
          ]
        }
      ]
    },
    onSubmit: async (data) => {
      console.log('Form submitted:', data)
      alert('Form submitted successfully!')
    },
    onStepChange: (step, data) => {
      console.log('Step changed:', step, data)
    }
  }

  // TanStack Forms integration test configuration
  const tanstackConfig: FormityConfig<SpikeFormData> = {
    ...basicConfig,
    id: 'formity-spike-tanstack',
    backend: 'tanstack' // This will test the integration
  }

  const handleDataChange = (newData: Partial<SpikeFormData>) => {
    setFormData(newData)
  }

  const handleStateChange = (newState: FormityState<SpikeFormData>) => {
    console.log('Form state changed:', newState)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Formity Integration SPIKE</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This page evaluates Formity's JSON schema-based form orchestration 
          and its claimed compatibility with TanStack Forms as a backend.
        </p>
        
        <div className="flex justify-center gap-2">
          <Badge variant="secondary">@formity/react v1.0.0</Badge>
          <Badge variant="secondary">@formity/system v1.0.0</Badge>
          <Badge variant="outline">TanStack Forms Integration Test</Badge>
        </div>
      </div>

      {/* Test Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Test Scenarios</CardTitle>
          <CardDescription>
            Select a test scenario to evaluate different aspects of Formity integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={activeTest === 'basic' ? 'default' : 'outline'}
              onClick={() => setActiveTest('basic')}
              className="h-auto p-4 flex flex-col items-start"
            >
              <div className="font-medium">Basic Formity Test</div>
              <div className="text-sm text-muted-foreground text-left mt-1">
                Multi-step form with React Hook Form backend (Formity default)
              </div>
            </Button>
            
            <Button
              variant={activeTest === 'tanstack' ? 'default' : 'outline'}
              onClick={() => setActiveTest('tanstack')}
              className="h-auto p-4 flex flex-col items-start"
            >
              <div className="font-medium">TanStack Integration</div>
              <div className="text-sm text-muted-foreground text-left mt-1">
                Test Formity's claimed compatibility with TanStack Forms
              </div>
            </Button>
            
            <Button
              variant="outline"
              disabled
              className="h-auto p-4 flex flex-col items-start"
            >
              <div className="font-medium">Performance Test</div>
              <div className="text-sm text-muted-foreground text-left mt-1">
                Compare performance vs current implementation (Coming soon)
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Test Display */}
      {activeTest !== 'none' && (
        <div className="space-y-6">
          {/* Test Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTest === 'basic' ? 'Basic Formity Test' : 'TanStack Forms Integration Test'}
              </CardTitle>
              <CardDescription>
                {activeTest === 'basic' 
                  ? 'Testing Formity with its default React Hook Form backend'
                  : 'Testing if Formity can actually work with TanStack Forms as claimed'
                }
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Form Implementation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Form Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTest === 'basic' && (
                    <FormityTestForm
                      config={basicConfig}
                      onDataChange={handleDataChange}
                      onStateChange={handleStateChange}
                    />
                  )}
                  
                  {activeTest === 'tanstack' && (
                    <FormityTanStackIntegration
                      config={tanstackConfig}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Debug Panel */}
            <div className="space-y-4">
              {/* Current Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Form Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(formData, null, 2) || 'No data yet'}
                  </pre>
                </CardContent>
              </Card>

              {/* Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs space-y-1">
                    <div><strong>Backend:</strong> {activeTest === 'basic' ? 'React Hook Form' : 'TanStack Forms (test)'}</div>
                    <div><strong>Steps:</strong> {activeTest === 'basic' ? basicConfig.schema.steps.length : tanstackConfig.schema.steps.length}</div>
                    <div><strong>Auto Save:</strong> {activeTest === 'basic' ? 'Yes' : 'Yes'}</div>
                    <div><strong>Validation:</strong> On Blur</div>
                  </div>
                </CardContent>
              </Card>

              {/* Evaluation Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Evaluation Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>TanStack compatibility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>Multi-step navigation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>State persistence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>Validation integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>shadcn/ui components</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {activeTest === 'none' && (
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Select a test scenario above to begin the Formity evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">What we're testing:</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Can Formity actually work with TanStack Forms as a backend?</li>
                  <li>• Does JSON schema abstraction simplify multi-step form creation?</li>
                  <li>• How does it integrate with our existing shadcn/ui components?</li>
                  <li>• What's the performance impact compared to our current approach?</li>
                  <li>• Is the migration effort worth the potential benefits?</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium">Expected Outcomes:</h4>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Clear assessment of TanStack Forms compatibility</li>
                  <li>• Documentation of integration challenges and workarounds</li>
                  <li>• Performance comparison with current implementation</li>
                  <li>• Recommendation for adoption or alternative approaches</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}