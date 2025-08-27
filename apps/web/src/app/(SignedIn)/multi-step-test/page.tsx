'use client'

import { MultiStepForm } from '@/components/forms/multi-step/MultiStepForm'
import { z } from 'zod'
import type { MultiStepFormConfig } from '@/lib/forms/types'

// Define form data type
interface TestFormData {
  step1: {
    companyName: string
    email: string
  }
  step2: {
    description: string
  }
}

// Define schemas for validation
const step1Schema = z.object({
  step1: z.object({
    companyName: z.string().min(1, 'Company name is required'),
    email: z.string().email('Valid email is required'),
  })
})

const step2Schema = z.object({
  step1: z.object({
    companyName: z.string().min(1, 'Company name is required'),
    email: z.string().email('Valid email is required'),
  }),
  step2: z.object({
    description: z.string().min(10, 'Description must be at least 10 characters'),
  })
})

export default function MultiStepFormTestPage() {
  const config: MultiStepFormConfig<TestFormData> = {
    id: 'test-multi-step-form',
    title: 'Multi-Step Form Test',
    defaultValues: {
      step1: {
        companyName: '',
        email: '',
      },
      step2: {
        description: '',
      },
    },
    steps: [
      {
        id: 'step1',
        title: 'Company Information',
        description: 'Basic company details',
        schema: step1Schema,
        fields: [
          {
            name: 'step1.companyName',
            type: 'text',
            label: 'Company Name',
            required: true,
            placeholder: 'Enter your company name',
          },
          {
            name: 'step1.email',
            type: 'email',
            label: 'Email Address',
            required: true,
            placeholder: 'Enter your email',
          },
        ],
      },
      {
        id: 'step2',
        title: 'Company Description',
        description: 'Tell us about your company',
        schema: step2Schema,
        fields: [
          {
            name: 'step2.description',
            type: 'textarea',
            label: 'Company Description',
            required: true,
            placeholder: 'Describe your company...',
          },
        ],
      },
    ],
    onSubmit: async (data) => {
      console.log('Multi-step form submitted:', data)
      alert(`Form submitted successfully! Check console for data.`)
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Multi-Step Form Test</h1>
        <MultiStepForm 
          config={config}
          onStepChange={(step) => console.log('Step changed to:', step)}
          onDataChange={(data) => console.log('Form data changed:', data)}
        />
      </div>
    </div>
  )
}