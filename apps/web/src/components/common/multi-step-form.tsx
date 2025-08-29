'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useFormData } from '@/hooks/use-form-data'
import { cn } from '@/lib/utils'
import SubsidiaryManager from './subsidiary-manager'

// Define the form schema for each step
const companyInfoSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  organizationNumber: z.string().min(9, 'Organization number must be valid'),
  website: z.url('Please enter a valid website URL').optional().or(z.literal('')),
  contactPersonName: z.string().min(2, 'Contact person name must be at least 2 characters'),
  // contactPersonTitle: z.string().min(2, "Contact person title must be at least 2 characters"),
  contactPersonEmail: z.email('Please enter a valid email address'),
  legalForm: z.string().min(2, 'Legal form is required'),
  naceCode: z.string().min(5, 'NACE code is required - xx.xxx'),
  balanceSheetSize: z.coerce.number().min(1, 'Balance sheet size is required'),
  turnover: z.coerce.number().min(1, 'Turnover is required'),
  numberOfEmployees: z.coerce.number().min(1, 'Number of employees must be at least 1'),
  country: z.string().min(2, 'Country is required'),
})

// Define subsidiary schema
const subsidiarySchema = z.object({
  name: z.string().min(2, 'Subsidiary name must be at least 2 characters'),
  organizationNumber: z.string().min(9, 'Organization number must be valid'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
})

const reportingSetupSchema = z
  .object({
    reportingYear: z.string().min(4, 'Please select a reporting year'),
    reportingOption: z.enum(['basic', 'basic-comprehensive'], {
      message: 'Please select a reporting option',
    }),
    reportBasis: z
      .enum(['individual', 'consolidated'], {
        message: 'Please specify if the report is individual or consolidated',
      })
      .default('individual'),
    subsidiaries: z.array(subsidiarySchema).optional(),
  })
  .refine(
    (data) => {
      // If reportBasis is "consolidated", at least one subsidiary should be provided
      if (
        data.reportBasis === 'consolidated' &&
        (!data.subsidiaries || data.subsidiaries.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: 'At least one subsidiary is required when reporting on consolidated basis',
      path: ['subsidiaries'],
    }
  )

const sustainabilityBaseSchema = z.object({
  hasPracticesPolicies: z.boolean(),
  sustainabilityCertifications: z.string().optional(),
  practicesDescription: z
    .string()
    .min(10, 'Please provide a description of at least 10 characters')
    .optional(),
})

const sustainabilitySchema = sustainabilityBaseSchema

// Combine all schemas for the final form data
const formSchema = z.object({
  ...companyInfoSchema.shape,
  ...reportingSetupSchema.shape,
  ...sustainabilityBaseSchema.shape,
})

type FormData = z.infer<typeof formSchema>

interface MultiStepFormProps {
  className?: string
  onSubmit?: (data: FormData) => void
}

export default function MultiStepForm({ className, onSubmit }: MultiStepFormProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Use the form data hook
  const { getEnrichedDefaults } = useFormData()

  // Define the steps
  const steps = [
    {
      id: 'company-info',
      title: 'Company Information',
      description: 'Basic organization details',
      schema: companyInfoSchema,
      fields: [
        {
          name: 'organizationName',
          label: 'Organization Name',
          type: 'text',
          placeholder: 'ACME Corporation AS',
        },
        {
          name: 'organizationNumber',
          label: 'Organization Number',
          type: 'text',
          placeholder: '123456789',
        },
        {
          name: 'legalForm',
          label: 'Legal Form',
          type: 'select',
          placeholder: 'Select legal form',
          options: [
            { label: 'Aksjeselskap (AS)', value: 'as' },
            { label: 'Allmennaksjeselskap (ASA)', value: 'asa' },
            { label: 'Ansvarlig selskap (ANS)', value: 'ans' },
            { label: 'Enkeltpersonforetak (ENK)', value: 'enk' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'website',
          label: 'Website (Optional)',
          type: 'url',
          placeholder: 'https://www.acme.com',
        },
        {
          name: 'contactPersonName',
          label: 'Contact Person Name',
          type: 'text',
          placeholder: 'John Smith',
        },
        // { name: "contactPersonTitle", label: "Contact Person Title", type: "text", placeholder: "Sustainability Manager" },
        {
          name: 'contactPersonEmail',
          label: 'Contact Person Email',
          type: 'email',
          placeholder: 'john.smith@acme.com',
        },

        {
          name: 'naceCode',
          label: 'NACE Code',
          type: 'text',
          placeholder: '62.010',
        },
        {
          name: 'balanceSheetSize',
          label: 'Balance Sheet Size (€)',
          type: 'number',
          placeholder: '#',
        },
        {
          name: 'turnover',
          label: 'Annual Turnover (€)',
          type: 'number',
          placeholder: '#',
        },
        {
          name: 'numberOfEmployees',
          label: 'Number of Employees',
          type: 'number',
          placeholder: '#',
        },
        {
          name: 'country',
          label: 'Country',
          type: 'select',
          placeholder: 'Select country',
          options: [
            { label: 'Norway', value: 'norway' },
            { label: 'Sweden', value: 'sweden' },
            { label: 'Denmark', value: 'denmark' },
            { label: 'Finland', value: 'finland' },
            { label: 'Other EU Country', value: 'other-eu' },
          ],
        },
      ],
    },
    {
      id: 'reporting-setup',
      title: 'Reporting Setup',
      description: 'Configure your sustainability report',
      schema: reportingSetupSchema,
      fields: [
        {
          name: 'reportingYear',
          label: 'Reporting Year',
          type: 'select',
          placeholder: 'Select year',
          options: [
            { label: '2024', value: '2024' },
            { label: '2023', value: '2023' },
            { label: '2022', value: '2022' },
          ],
        },
        {
          name: 'reportingOption',
          label: 'Reporting Option',
          type: 'select',
          placeholder: 'Select reporting option',
          options: [
            { label: 'Basic Module only', value: 'basic' },
            {
              label: 'Basic and Comprehensive Module',
              value: 'basic-comprehensive',
            },
          ],
        },
        {
          name: 'reportBasis',
          label: 'Report Basis',
          type: 'select',
          options: [
            { label: 'Individual basis', value: 'individual' },
            { label: 'Consolidated basis', value: 'consolidated' },
          ],
        },
      ],
    },
    {
      id: 'sustainability',
      title: 'Sustainability Practices',
      description: 'Your current sustainability initiatives',
      schema: sustainabilitySchema,
      fields: [
        {
          name: 'hasPracticesPolicies',
          label: 'Sustainability Practices',
          type: 'checkbox',
          description:
            'We have practices, policies, or future initiatives for transitioning towards a more sustainable economy',
        },
        {
          name: 'sustainabilityCertifications',
          label: 'Sustainability Certifications',
          type: 'textarea',
          placeholder: 'Describe any sustainability-related certifications or labels...',
        },
        {
          name: 'practicesDescription',
          label: 'Practices Description',
          type: 'textarea',
          placeholder: 'Describe your sustainability practices, policies, or initiatives...',
        },
      ],
    },
  ]

  // Get the current step schema
  const currentStepSchema = steps[step].schema

  // Helper function to extract default values - now delegates to hook
  const getSchemaDefaults = (existingData: any = {}) => {
    const defaults = getEnrichedDefaults(step, existingData)
    console.log(`Applied defaults for step ${step}:`, defaults)
    return defaults
  }

  // Merge schema defaults with form data
  const defaultValues = getSchemaDefaults(formData)

  // Debug: Log default values
  console.log('Step:', step, 'Default values:', defaultValues)

  // Setup form with the current step schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    trigger,
  } = useForm<any>({
    resolver: zodResolver(currentStepSchema as any),
    defaultValues,
  })

  // Reset form with default values when step changes
  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  // Watch reportBasis for conditional rendering
  const reportBasis = watch('reportBasis')

  // Calculate progress percentage
  const progress = ((step + 1) / steps.length) * 100

  // Handle next step
  const handleNextStep = (data: any) => {
    console.log('Form submission data:', data)
    console.log('Current step:', step)
    console.log('Form errors:', errors)

    const updatedData = { ...formData, ...data }
    console.log('Updated form data:', updatedData)
    setFormData(updatedData)

    if (step < steps.length - 1) {
      setStep(step + 1)
      // Don't need to reset here as the useForm will reinitialize with new defaultValues
    } else {
      // Final step submission
      setIsSubmitting(true)
      setTimeout(() => {
        if (onSubmit) {
          onSubmit(updatedData as FormData)
        }
        setIsComplete(true)
        setIsSubmitting(false)
      }, 1500)
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  // Animation variants
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <div className={cn('mx-auto w-full max-w-xl rounded-lg bg-card/40 p-6 shadow-lg', className)}>
      {isComplete ? (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="py-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 font-bold text-2xl">Setup Complete!</h2>
          <p className="mb-6 text-muted-foreground">
            Your sustainability reporting setup is complete. You can now proceed to enter your
            sustainability data.
          </p>
          <Button
            onClick={() => {
              setStep(0)
              setFormData({})
              setIsComplete(false)
              reset({})
            }}
          >
            Start Over
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              <span className="font-medium text-sm">
                Step {step + 1} of {steps.length}
              </span>
              <span className="font-medium text-sm">{Math.round(progress)}%</span>
            </div>
            <Progress className="h-2" value={progress} />
          </div>

          {/* Step indicators */}
          <div className="mb-8 flex justify-between">
            {steps.map((s, i) => (
              <div className="flex flex-col items-center" key={s.id}>
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs',
                    {
                      'bg-primary text-primary-foreground': i < step,
                      'bg-primary text-primary-foreground ring-2 ring-primary/30': i === step,
                      'bg-secondary text-secondary-foreground': i > step,
                    }
                  )}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="mt-1 hidden text-xs sm:block">{s.title}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              animate="visible"
              exit="exit"
              initial="hidden"
              key={step}
              transition={{ duration: 0.3 }}
              variants={variants}
            >
              <div className="mb-6">
                <h2 className="font-bold text-xl">{steps[step].title}</h2>
                <p className="text-muted-foreground text-sm">{steps[step].description}</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(handleNextStep)}>
                {steps[step].fields.map((field: any) => {
                  return (
                    <div className="space-y-2" key={field.name}>
                      <Label htmlFor={field.name}>{field.label}</Label>

                      {field.type === 'select' && (
                        <Controller
                          control={control}
                          name={field.name}
                          render={({ field: controllerField }) => (
                            <Select
                              defaultValue={controllerField.value || ''}
                              onValueChange={controllerField.onChange}
                              value={controllerField.value || ''}
                            >
                              <SelectTrigger
                                className={cn(
                                  'w-full',
                                  errors[field.name as string] && 'border-destructive'
                                )}
                              >
                                <SelectValue placeholder={field.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((option: any) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      )}

                      {field.type === 'checkbox' && (
                        <div className="flex items-start space-x-2">
                          <Controller
                            control={control}
                            name={field.name}
                            render={({ field: controllerField }) => {
                              console.log(`Checkbox ${field.name} value:`, controllerField.value)
                              return (
                                <Checkbox
                                  checked={Boolean(controllerField.value)}
                                  className={cn(
                                    errors[field.name as string] && 'border-destructive'
                                  )}
                                  id={field.name}
                                  onCheckedChange={controllerField.onChange}
                                />
                              )
                            }}
                          />
                          {field.description && (
                            <div className="grid gap-1.5 leading-none">
                              <label
                                className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor={field.name}
                              >
                                {field.description}
                              </label>
                            </div>
                          )}
                        </div>
                      )}

                      {field.type === 'textarea' && (
                        <Textarea
                          id={field.name}
                          placeholder={field.placeholder}
                          {...register(field.name as any)}
                          className={cn(errors[field.name as string] && 'border-destructive')}
                          rows={3}
                        />
                      )}

                      {['text', 'number', 'email', 'url', 'password'].includes(field.type) && (
                        <Input
                          id={field.name}
                          placeholder={field.placeholder}
                          type={field.type}
                          {...register(field.name as any)}
                          className={cn(errors[field.name as string] && 'border-destructive')}
                        />
                      )}

                      {errors[field.name as string] && (
                        <p className="text-destructive text-sm">
                          {errors[field.name as string]?.message as string}
                        </p>
                      )}
                    </div>
                  )
                })}

                {/* Conditionally render SubsidiaryManager for consolidated reports */}
                {step === 1 && reportBasis === 'consolidated' && (
                  <div className="space-y-2">
                    <SubsidiaryManager control={control} errors={errors} trigger={trigger} />
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    className={cn(step === 0 && 'invisible')}
                    disabled={step === 0}
                    onClick={handlePrevStep}
                    type="button"
                    variant="outline"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button disabled={isSubmitting} type="submit">
                    {step === steps.length - 1 ? (
                      isSubmitting ? (
                        'Submitting...'
                      ) : (
                        'Submit'
                      )
                    ) : (
                      <>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
