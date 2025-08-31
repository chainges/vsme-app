'use client'

import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import CheckboxField from './CheckboxField'
import SelectField from './SelectField'
import TextareaField from './TextareaField'
import TextField from './TextField'

// Demo validation schema
const demoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  hasSubsidiaries: z.boolean(),
})

// Demo options for select field
const industryOptions = [
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Retail', value: 'retail' },
]

/**
 * Demo component to showcase the field components with TanStack Forms integration
 */
export default function FieldDemo() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      description: '',
      industry: '',
      hasSubsidiaries: false,
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
      alert('Form submitted! Check console for values.')
    },
  })

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Field Components Demo</CardTitle>
        <CardDescription>
          Demonstration of core field components with TanStack Forms integration
          and Zod validation
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {/* TextField Demo */}
          <form.Field
            name="name"
            validators={{
              onChange: demoSchema.shape.name,
            }}
          >
            {(field) => (
              <TextField
                definition={{
                  name: 'name',
                  type: 'text',
                  label: 'Full Name',
                  placeholder: 'Enter your full name',
                  required: true,
                }}
                field={field}
              />
            )}
          </form.Field>

          {/* TextField with email type */}
          <form.Field
            name="email"
            validators={{
              onChange: demoSchema.shape.email,
            }}
          >
            {(field) => (
              <TextField
                autoComplete="email"
                definition={{
                  name: 'email',
                  type: 'email',
                  label: 'Email Address',
                  placeholder: 'Enter your email address',
                  required: true,
                }}
                field={field}
                type="email"
              />
            )}
          </form.Field>

          {/* TextareaField Demo */}
          <form.Field
            name="description"
            validators={{
              onChange: demoSchema.shape.description,
            }}
          >
            {(field) => (
              <TextareaField
                definition={{
                  name: 'description',
                  type: 'textarea',
                  label: 'Business Description',
                  placeholder: 'Describe your business...',
                  required: true,
                }}
                field={field}
                maxLength={500}
                rows={4}
              />
            )}
          </form.Field>

          {/* SelectField Demo */}
          <form.Field
            name="industry"
            validators={{
              onChange: demoSchema.shape.industry,
            }}
          >
            {(field) => (
              <SelectField
                definition={{
                  name: 'industry',
                  type: 'select',
                  label: 'Industry',
                  required: true,
                }}
                field={field}
                options={industryOptions}
                placeholder="Select your industry"
              />
            )}
          </form.Field>

          {/* CheckboxField Demo */}
          <form.Field
            name="hasSubsidiaries"
            validators={{
              onChange: demoSchema.shape.hasSubsidiaries,
            }}
          >
            {(field) => (
              <CheckboxField
                definition={{
                  name: 'hasSubsidiaries',
                  type: 'checkbox',
                  label: 'Has Subsidiaries',
                }}
                description="Check this if your organization has subsidiary companies"
                field={field}
              />
            )}
          </form.Field>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button className="w-full sm:w-auto" type="submit">
              Submit Demo Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
