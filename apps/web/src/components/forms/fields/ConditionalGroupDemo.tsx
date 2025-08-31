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
import { Separator } from '@/components/ui/separator'
import type { InitiativeType } from '@/lib/forms/types/sustainability-types'
import {
  INITIATIVE_CATEGORIES,
  INITIATIVE_LABELS,
} from '@/lib/forms/types/sustainability-types'
import CheckboxField from './CheckboxField'
import ConditionalGroup from './ConditionalGroup'
import FieldArray from './FieldArray'
import SelectField from './SelectField'
import type { SubsidiaryData } from './SubsidiaryFormItem'
import SubsidiaryFormItem from './SubsidiaryFormItem'
import TextareaField from './TextareaField'
import TextField from './TextField'

// Demo validation schemas
const subsidiarySchema = z.object({
  name: z.string().min(1, 'Subsidiary name is required'),
  organizationNumber: z.string().min(1, 'Organization number is required'),
  address: z.string().min(1, 'Address is required'),
})

const initiativeSchema = z.object({
  type: z.string(),
  selected: z.boolean(),
  description: z.string().optional(),
  goal: z.string().optional(),
  responsiblePerson: z.string().optional(),
})

const demoSchema = z.object({
  businessModel: z.object({
    description: z
      .string()
      .min(10, 'Business model description must be at least 10 characters'),
    hasSubsidiaries: z.boolean(),
    subsidiaries: z.array(subsidiarySchema),
  }),
  sustainability: z.object({
    initiatives: z.array(initiativeSchema),
  }),
})

// Industry options for demo
const industryOptions = [
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Retail', value: 'retail' },
]

/**
 * Demo component to showcase ConditionalGroup with subsidiary and initiative fields
 */
export default function ConditionalGroupDemo() {
  const form = useForm({
    defaultValues: {
      businessModel: {
        description: '',
        hasSubsidiaries: false,
        subsidiaries: [] as SubsidiaryData[],
      },
      sustainability: {
        initiatives: Object.keys(INITIATIVE_LABELS).map((type) => ({
          type: type as InitiativeType,
          selected: false,
          description: '',
          goal: '',
          responsiblePerson: '',
        })),
      },
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
      alert('Form submitted! Check console for values.')
    },
  })

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Conditional Group Demo</CardTitle>
        <CardDescription>
          Demonstration of ConditionalGroup component with subsidiary fields and
          sustainability initiatives
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          {/* Business Model Section */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Business Model</h3>

            {/* Business Model Description */}
            <form.Field
              name="businessModel.description"
              validators={{
                onChange: demoSchema.shape.businessModel.shape.description,
              }}
            >
              {(field) => (
                <TextareaField
                  definition={{
                    name: 'businessModel.description',
                    type: 'textarea',
                    label: 'Business Model Description',
                    placeholder: 'Describe your business model...',
                    required: true,
                  }}
                  field={field}
                  rows={4}
                />
              )}
            </form.Field>

            {/* Has Subsidiaries Checkbox */}
            <form.Field
              name="businessModel.hasSubsidiaries"
              validators={{
                onChange: demoSchema.shape.businessModel.shape.hasSubsidiaries,
              }}
            >
              {(field) => (
                <CheckboxField
                  definition={{
                    name: 'businessModel.hasSubsidiaries',
                    type: 'checkbox',
                    label: 'Does your organization have subsidiaries?',
                  }}
                  description="Check this if your organization has subsidiary companies"
                  field={field}
                />
              )}
            </form.Field>

            {/* Conditional Subsidiaries Section */}
            <form.Subscribe selector={(state) => state.values}>
              {(formData) => (
                <ConditionalGroup
                  condition={{
                    field: 'businessModel.hasSubsidiaries',
                    operator: 'equals',
                    value: true,
                  }}
                  fieldsToCleanup={['businessModel.subsidiaries']}
                  formData={formData}
                  onDataCleanup={(cleanedData) => {
                    console.log('Cleaning up subsidiary data:', cleanedData)
                    // Actually update the form state to clear the subsidiaries
                    form.setFieldValue('businessModel.subsidiaries', [])
                  }}
                >
                  <div className="space-y-4 rounded-lg border p-4">
                    <h4 className="font-medium">Subsidiary Information</h4>
                    <p className="text-muted-foreground text-sm">
                      This section will be hidden and data cleaned up when "Has
                      Subsidiaries" is unchecked.
                    </p>
                    <form.Field mode="array" name="businessModel.subsidiaries">
                      {(field) => (
                        <FieldArray
                          addButtonLabel="Add Subsidiary"
                          definition={{
                            name: 'businessModel.subsidiaries',
                            type: 'fieldArray',
                            label: 'Subsidiaries',
                          }}
                          emptyMessage="No subsidiaries added yet"
                          field={field}
                          itemComponent={SubsidiaryFormItem}
                          removeButtonLabel="Remove"
                        />
                      )}
                    </form.Field>
                  </div>
                </ConditionalGroup>
              )}
            </form.Subscribe>
          </div>

          <Separator />

          {/* Sustainability Initiatives Section */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">
              Sustainability Initiatives
            </h3>

            {/* Environmental Initiatives */}
            <div className="space-y-4">
              <h4 className="font-medium text-green-700 dark:text-green-400">
                Environmental Initiatives
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {INITIATIVE_CATEGORIES.environmental.map(
                  (initiativeType, index) => (
                    <div className="space-y-4" key={initiativeType}>
                      <form.Field
                        name={`sustainability.initiatives.${Object.keys(INITIATIVE_LABELS).indexOf(initiativeType)}.selected`}
                      >
                        {(field) => (
                          <CheckboxField
                            definition={{
                              name: `sustainability.initiatives.${index}.selected`,
                              type: 'checkbox',
                              label: INITIATIVE_LABELS[initiativeType],
                            }}
                            field={field}
                          />
                        )}
                      </form.Field>

                      {/* Conditional Initiative Details */}
                      <form.Subscribe selector={(state) => state.values}>
                        {(formData) => (
                          <ConditionalGroup
                            animationDuration={200}
                            condition={{
                              field: `sustainability.initiatives.${Object.keys(INITIATIVE_LABELS).indexOf(initiativeType)}.selected`,
                              operator: 'equals',
                              value: true,
                            }}
                            fieldsToCleanup={[
                              `sustainability.initiatives.${Object.keys(INITIATIVE_LABELS).indexOf(initiativeType)}.description`,
                              `sustainability.initiatives.${Object.keys(INITIATIVE_LABELS).indexOf(initiativeType)}.goal`,
                              `sustainability.initiatives.${Object.keys(INITIATIVE_LABELS).indexOf(initiativeType)}.responsiblePerson`,
                            ]}
                            formData={formData}
                            onDataCleanup={(cleanedData) => {
                              console.log(
                                `Cleaning up ${INITIATIVE_LABELS[initiativeType]} data:`,
                                cleanedData
                              )
                              // Actually update the form state to clear the initiative fields
                              const initiativeIndex =
                                Object.keys(INITIATIVE_LABELS).indexOf(
                                  initiativeType
                                )
                              form.setFieldValue(
                                `sustainability.initiatives.${initiativeIndex}.description`,
                                ''
                              )
                              form.setFieldValue(
                                `sustainability.initiatives.${initiativeIndex}.goal`,
                                ''
                              )
                              form.setFieldValue(
                                `sustainability.initiatives.${initiativeIndex}.responsiblePerson`,
                                ''
                              )
                            }}
                          >
                            <div className="ml-6 space-y-3 rounded border-green-200 border-l-2 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
                              <form.Field
                                name={`sustainability.initiatives.${Object.keys(INITIATIVE_LABELS).indexOf(initiativeType)}.description`}
                              >
                                {(field) => (
                                  <TextField
                                    definition={{
                                      name: `sustainability.initiatives.${index}.description`,
                                      type: 'text',
                                      label: 'Description',
                                      placeholder:
                                        'Describe this initiative...',
                                    }}
                                    field={field}
                                  />
                                )}
                              </form.Field>

                              <form.Field
                                name={`sustainability.initiatives.${Object.keys(INITIATIVE_LABELS).indexOf(initiativeType)}.goal`}
                              >
                                {(field) => (
                                  <TextField
                                    definition={{
                                      name: `sustainability.initiatives.${index}.goal`,
                                      type: 'text',
                                      label: 'Goal',
                                      placeholder:
                                        'What is the goal of this initiative?',
                                    }}
                                    field={field}
                                  />
                                )}
                              </form.Field>

                              <form.Field
                                name={`sustainability.initiatives.${Object.keys(INITIATIVE_LABELS).indexOf(initiativeType)}.responsiblePerson`}
                              >
                                {(field) => (
                                  <TextField
                                    definition={{
                                      name: `sustainability.initiatives.${index}.responsiblePerson`,
                                      type: 'text',
                                      label: 'Responsible Person',
                                      placeholder:
                                        'Who is responsible for this initiative?',
                                    }}
                                    field={field}
                                  />
                                )}
                              </form.Field>
                            </div>
                          </ConditionalGroup>
                        )}
                      </form.Subscribe>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Social Initiatives */}
            <div className="space-y-4">
              <h4 className="font-medium text-blue-700 dark:text-blue-400">
                Social Initiatives
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {INITIATIVE_CATEGORIES.social.map((initiativeType, index) => {
                  const globalIndex =
                    INITIATIVE_CATEGORIES.environmental.length + index
                  return (
                    <div className="space-y-4" key={initiativeType}>
                      <form.Field
                        name={`sustainability.initiatives.${globalIndex}.selected`}
                      >
                        {(field) => (
                          <CheckboxField
                            definition={{
                              name: `sustainability.initiatives.${globalIndex}.selected`,
                              type: 'checkbox',
                              label: INITIATIVE_LABELS[initiativeType],
                            }}
                            field={field}
                          />
                        )}
                      </form.Field>

                      {/* Conditional Initiative Details */}
                      <form.Subscribe selector={(state) => state.values}>
                        {(formData) => (
                          <ConditionalGroup
                            animationDuration={200}
                            condition={{
                              field: `sustainability.initiatives.${globalIndex}.selected`,
                              operator: 'equals',
                              value: true,
                            }}
                            fieldsToCleanup={[
                              `sustainability.initiatives.${globalIndex}.description`,
                              `sustainability.initiatives.${globalIndex}.goal`,
                              `sustainability.initiatives.${globalIndex}.responsiblePerson`,
                            ]}
                            formData={formData}
                            onDataCleanup={(cleanedData) => {
                              console.log(
                                `Cleaning up ${INITIATIVE_LABELS[initiativeType]} data:`,
                                cleanedData
                              )
                              // Actually update the form state to clear the initiative fields
                              form.setFieldValue(
                                `sustainability.initiatives.${globalIndex}.description`,
                                ''
                              )
                              form.setFieldValue(
                                `sustainability.initiatives.${globalIndex}.goal`,
                                ''
                              )
                              form.setFieldValue(
                                `sustainability.initiatives.${globalIndex}.responsiblePerson`,
                                ''
                              )
                            }}
                          >
                            <div className="ml-6 space-y-3 rounded border-blue-200 border-l-2 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                              <form.Field
                                name={`sustainability.initiatives.${globalIndex}.description`}
                              >
                                {(field) => (
                                  <TextField
                                    definition={{
                                      name: `sustainability.initiatives.${globalIndex}.description`,
                                      type: 'text',
                                      label: 'Description',
                                      placeholder:
                                        'Describe this initiative...',
                                    }}
                                    field={field}
                                  />
                                )}
                              </form.Field>

                              <form.Field
                                name={`sustainability.initiatives.${globalIndex}.goal`}
                              >
                                {(field) => (
                                  <TextField
                                    definition={{
                                      name: `sustainability.initiatives.${globalIndex}.goal`,
                                      type: 'text',
                                      label: 'Goal',
                                      placeholder:
                                        'What is the goal of this initiative?',
                                    }}
                                    field={field}
                                  />
                                )}
                              </form.Field>

                              <form.Field
                                name={`sustainability.initiatives.${globalIndex}.responsiblePerson`}
                              >
                                {(field) => (
                                  <TextField
                                    definition={{
                                      name: `sustainability.initiatives.${globalIndex}.responsiblePerson`,
                                      type: 'text',
                                      label: 'Responsible Person',
                                      placeholder:
                                        'Who is responsible for this initiative?',
                                    }}
                                    field={field}
                                  />
                                )}
                              </form.Field>
                            </div>
                          </ConditionalGroup>
                        )}
                      </form.Subscribe>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button className="w-full sm:w-auto" type="submit">
              Submit Demo Form
            </Button>
          </div>

          {/* Debug Information */}
          <form.Subscribe selector={(state) => state.values}>
            {(formData) => (
              <details className="mt-8">
                <summary className="cursor-pointer font-medium">
                  Debug: Current Form Data
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-muted p-4 text-sm">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </details>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  )
}
