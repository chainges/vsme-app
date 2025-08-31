'use client'

import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FieldDefinition } from '../../../lib/forms/types/field-types'
import { FieldArray } from './FieldArray'
import { type SubsidiaryData, SubsidiaryFormItem } from './SubsidiaryFormItem'

// Subsidiary schema for validation
const subsidiarySchema = z.object({
  name: z.string().min(1, 'Subsidiary name is required'),
  organizationNumber: z.string().min(1, 'Organization number is required'),
  address: z.string().min(1, 'Address is required'),
})

// Form data schema
const formSchema = z.object({
  subsidiaries: z.array(subsidiarySchema).min(0).max(5),
})

type FormData = z.infer<typeof formSchema>

// Wrapper component to handle type compatibility
function SubsidiaryItemWrapper(props: any) {
  return <SubsidiaryFormItem {...props} />
}

/**
 * Demo component to test FieldArray functionality
 */
export function FieldArrayDemo() {
  const form = useForm({
    defaultValues: {
      subsidiaries: [] as SubsidiaryData[],
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
      alert(`Form submitted with ${value.subsidiaries.length} subsidiaries`)
    },
  })

  const fieldDefinition: FieldDefinition = {
    name: 'subsidiaries',
    type: 'fieldArray',
    label: 'Subsidiaries',
    required: false,
    arrayItemSchema: subsidiarySchema,
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>FieldArray Demo - Subsidiaries Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <div className="space-y-6">
            <form.Field mode="array" name="subsidiaries">
              {(field) => (
                <FieldArray
                  addButtonLabel="Add Subsidiary"
                  definition={fieldDefinition}
                  emptyMessage="No subsidiaries added yet. Click 'Add Subsidiary' to get started."
                  field={field}
                  itemComponent={SubsidiaryItemWrapper}
                  maxItems={5}
                  minItems={0}
                  removeButtonLabel="Remove"
                />
              )}
            </form.Field>

            <div className="flex gap-4 border-t pt-4">
              <Button type="submit">Submit Form</Button>
              <Button
                onClick={() => {
                  form.reset()
                }}
                type="button"
                variant="outline"
              >
                Reset Form
              </Button>
              <Button
                onClick={() => {
                  console.log('Current form state:', form.state.values)
                }}
                type="button"
                variant="outline"
              >
                Log Form State
              </Button>
            </div>

            {/* Form state display for debugging */}
            <div className="mt-6 rounded-lg bg-muted p-4">
              <h3 className="mb-2 font-semibold">Form State (Debug)</h3>
              <pre className="overflow-auto text-sm">
                {JSON.stringify(form.state.values, null, 2)}
              </pre>
            </div>

            {/* Form errors display */}
            {form.state.errors.length > 0 && (
              <div className="mt-4 rounded-lg border border-destructive bg-destructive/10 p-4">
                <h3 className="mb-2 font-semibold text-destructive">
                  Form Errors
                </h3>
                <ul className="space-y-1 text-destructive text-sm">
                  {form.state.errors.map((error, index) => (
                    <li key={index}>
                      {typeof error === 'string'
                        ? error
                        : JSON.stringify(error)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default FieldArrayDemo
