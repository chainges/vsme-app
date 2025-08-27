/**
 * FormityTestForm Component - Main test component for Formity SPIKE
 * 
 * This component implements the actual Formity integration using the proper API
 * discovered from the documentation. Updated in GREEN phase of TDD.
 */

'use client'

import React, { useCallback, useState } from 'react'
import { Formity, type OnReturn, type ReturnOutput, type Schema, type Form } from '@formity/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Import our existing shadcn/ui components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { FormityTestFormProps, SpikeFormData } from './types'

/**
 * Form Step Component - Wrapper for individual form steps
 * Using similar pattern to the Formity tutorial but with our shadcn/ui components
 */
interface FormStepProps {
  defaultValues: any
  resolver: any
  onSubmit: (data: any) => void
  children: React.ReactNode
}

function FormStep({ defaultValues, resolver, onSubmit, children }: FormStepProps) {
  const [formData, setFormData] = useState(defaultValues)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate using the resolver (Zod)
      const result = resolver.parse ? resolver.parse(formData) : formData
      setErrors({})
      onSubmit(result)
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path.join('.')] = err.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  const updateField = (name: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormContext.Provider value={{ formData, updateField, errors }}>
        {children}
      </FormContext.Provider>
    </form>
  )
}

/**
 * Form Context for sharing form state
 */
const FormContext = React.createContext<{
  formData: any
  updateField: (name: string, value: any) => void
  errors: Record<string, string>
} | null>(null)

function useFormContext() {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error('Form components must be used within FormStep')
  }
  return context
}

/**
 * Form Input Components using shadcn/ui
 */
function TextInput({ name, label, placeholder, type = 'text' }: {
  name: string
  label: string
  placeholder?: string
  type?: string
}) {
  const { formData, updateField, errors } = useFormContext()
  
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={formData[name] || ''}
        onChange={(e) => updateField(name, e.target.value)}
        className={errors[name] ? 'border-destructive' : ''}
      />
      {errors[name] && (
        <p className="text-sm text-destructive">{errors[name]}</p>
      )}
    </div>
  )
}

function TextareaInput({ name, label, placeholder, rows = 3 }: {
  name: string
  label: string
  placeholder?: string
  rows?: number
}) {
  const { formData, updateField, errors } = useFormContext()
  
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={formData[name] || ''}
        onChange={(e) => updateField(name, e.target.value)}
        className={errors[name] ? 'border-destructive' : ''}
      />
      {errors[name] && (
        <p className="text-sm text-destructive">{errors[name]}</p>
      )}
    </div>
  )
}

function SelectInput({ name, label, options }: {
  name: string
  label: string
  options: { value: string; label: string }[]
}) {
  const { formData, updateField, errors } = useFormContext()
  
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select value={formData[name] || ''} onValueChange={(value) => updateField(name, value)}>
        <SelectTrigger className={errors[name] ? 'border-destructive' : ''}>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[name] && (
        <p className="text-sm text-destructive">{errors[name]}</p>
      )}
    </div>
  )
}

function CheckboxInput({ name, label }: {
  name: string
  label: string
}) {
  const { formData, updateField } = useFormContext()
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        checked={formData[name] || false}
        onCheckedChange={(checked) => updateField(name, checked)}
      />
      <Label htmlFor={name}>{label}</Label>
    </div>
  )
}

function NumberInput({ name, label, placeholder, min, max }: {
  name: string
  label: string
  placeholder?: string
  min?: number
  max?: number
}) {
  const { formData, updateField, errors } = useFormContext()
  
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type="number"
        min={min}
        max={max}
        placeholder={placeholder}
        value={formData[name] || ''}
        onChange={(e) => updateField(name, parseInt(e.target.value) || 0)}
        className={errors[name] ? 'border-destructive' : ''}
      />
      {errors[name] && (
        <p className="text-sm text-destructive">{errors[name]}</p>
      )}
    </div>
  )
}

/**
 * Define the Formity schema types based on our form data
 */
type FormityValues = [
  Form<{ firstName: string; lastName: string; email: string; phone?: string }>,
  Form<{ newsletter: boolean; notifications: string; theme: string }>,
  Form<{ rating: number; comments?: string; wouldRecommend: boolean }>
]

/**
 * Main test form component implementing actual Formity with shadcn/ui
 */
export function FormityTestForm<T = Record<string, any>>({
  config,
  className,
  onDataChange,
  onStateChange
}: FormityTestFormProps<T>) {
  const [output, setOutput] = useState<ReturnOutput<FormityValues> | null>(null)
  const [backendIndicator, setBackendIndicator] = useState<string>('formity')
  
  // Handle form completion
  const onReturn = useCallback<OnReturn<FormityValues>>((output) => {
    setOutput(output)
    onDataChange?.((output as any).values as any)
    config.onSubmit?.((output as any).values as any)
  }, [config, onDataChange])

  // Create the Formity schema using the actual API
  const schema: Schema<FormityValues> = [
    // Step 1: Personal Information
    {
      form: {
        values: () => ({
          firstName: ['', []],
          lastName: ['', []],
          email: ['', []],
          phone: ['', []]
        }),
        render: ({ values, onNext }) => (
          <FormStep
            key="personal"
            defaultValues={values}
            resolver={zodResolver(
              z.object({
                firstName: z.string().min(1, { message: 'First name is required' }),
                lastName: z.string().min(1, { message: 'Last name is required' }),
                email: z.string().email({ message: 'Please enter a valid email' }),
                phone: z.string().optional()
              })
            )}
            onSubmit={onNext}
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Tell us about yourself to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <TextInput name="firstName" label="First Name" placeholder="Enter your first name" />
                  <TextInput name="lastName" label="Last Name" placeholder="Enter your last name" />
                </div>
                <TextInput name="email" label="Email Address" type="email" placeholder="you@example.com" />
                <TextInput name="phone" label="Phone Number" type="tel" placeholder="+1 (555) 123-4567" />
                
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-muted-foreground">Step 1 of 3</div>
                  <Button type="submit">Next</Button>
                </div>
              </CardContent>
            </Card>
          </FormStep>
        )
      }
    },
    
    // Step 2: Preferences
    {
      form: {
        values: () => ({
          newsletter: [false, []],
          notifications: ['email', []],
          theme: ['auto', []]
        }),
        render: ({ values, onNext, onBack }) => (
          <FormStep
            key="preferences"
            defaultValues={values}
            resolver={zodResolver(
              z.object({
                newsletter: z.boolean(),
                notifications: z.enum(['none', 'email', 'sms', 'both']),
                theme: z.enum(['light', 'dark', 'auto'])
              })
            )}
            onSubmit={onNext}
          >
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Configure your preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CheckboxInput name="newsletter" label="Subscribe to newsletter" />
                
                <SelectInput
                  name="notifications"
                  label="Notification Preference"
                  options={[
                    { value: 'none', label: 'No notifications' },
                    { value: 'email', label: 'Email only' },
                    { value: 'sms', label: 'SMS only' },
                    { value: 'both', label: 'Email and SMS' }
                  ]}
                />
                
                <SelectInput
                  name="theme"
                  label="Theme Preference"
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'auto', label: 'System' }
                  ]}
                />
                
                <div className="flex justify-between items-center pt-4">
                  <Button type="button" variant="outline" onClick={onBack}>Previous</Button>
                  <div className="text-sm text-muted-foreground">Step 2 of 3</div>
                  <Button type="submit">Next</Button>
                </div>
              </CardContent>
            </Card>
          </FormStep>
        )
      }
    },
    
    // Step 3: Feedback
    {
      form: {
        values: () => ({
          rating: [5, []],
          comments: ['', []],
          wouldRecommend: [false, []]
        }),
        render: ({ values, onNext, onBack }) => (
          <FormStep
            key="feedback"
            defaultValues={values}
            resolver={zodResolver(
              z.object({
                rating: z.number().min(1).max(10),
                comments: z.string().optional(),
                wouldRecommend: z.boolean()
              })
            )}
            onSubmit={onNext}
          >
            <Card>
              <CardHeader>
                <CardTitle>Feedback</CardTitle>
                <CardDescription>Help us improve our service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NumberInput name="rating" label="Rating (1-10)" min={1} max={10} />
                
                <TextareaInput
                  name="comments"
                  label="Additional Comments"
                  placeholder="Tell us what you think..."
                  rows={4}
                />
                
                <CheckboxInput name="wouldRecommend" label="Would you recommend this to others?" />
                
                <div className="flex justify-between items-center pt-4">
                  <Button type="button" variant="outline" onClick={onBack}>Previous</Button>
                  <div className="text-sm text-muted-foreground">Step 3 of 3</div>
                  <Button type="submit">Submit</Button>
                </div>
              </CardContent>
            </Card>
          </FormStep>
        )
      }
    }
  ]

  // Show success message if form is completed
  if (output) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>Form Completed Successfully!</CardTitle>
            <CardDescription>Thank you for your submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                <strong>Submitted Data:</strong>
                <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
                  {JSON.stringify((output as any).values, null, 2)}
                </pre>
              </div>
              <Button onClick={() => setOutput(null)} variant="outline">
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Form backend indicator for testing */}
      <div data-testid="form-backend-indicator" className="sr-only">
        {backendIndicator}
      </div>
      
      {/* Actual Formity component */}
      <Formity<FormityValues> schema={schema} onReturn={onReturn} />
    </div>
  )
}

export default FormityTestForm