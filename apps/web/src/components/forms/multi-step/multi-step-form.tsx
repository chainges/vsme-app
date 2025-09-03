'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  CompletionScreen,
  FormField,
  FormNavigation,
  type FormNavigationProps,
  type MultiStepFormProps,
  ProgressBar,
  StepIndicator,
  stepConfigurations,
  useMultiStepForm,
} from './'
import SubsidiaryManager from './components/subsidiary-manager'
import { InitiativeManager } from './steps/step-3-sustainability-initiatives'

// Animation variants
const variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
}

export default function MultiStepForm({ className, onSubmit }: MultiStepFormProps) {
  const {
    // Submission state
    submissionState,

    // Current step form instance
    form,

    // Step navigation
    step,
    isFirstStep,
    isLastStep,

    // Step handlers
    handleNextStep,
    handlePrevStep,
    handleRestart,

    // Current step configuration
    currentStepConfig,
  } = useMultiStepForm({ onSubmit })

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    watch,
    trigger,
  } = form

  // Watch reportBasis for conditional rendering
  const reportBasis = watch('reportBasis')

  // Watch initiatives for sustainability initiatives step
  const initiatives = watch('initiatives') || []

  // Custom handler for the sustainability initiatives step
  const handleSustainabilityNext = async () => {
    // Get current form data
    const formData = { initiatives }
    // Call the main next step handler
    await handleNextStep(formData)
  }

  // FormNavigation props for regular steps (0, 1, 3)
  const regularFormNavProps: FormNavigationProps = {
    isFirstStep,
    isLastStep,
    isSubmitting: submissionState.isSubmitting,
    onPrevious: handlePrevStep,
    onNext: handleSubmit(handleNextStep),
  }

  // Custom FormNavigation props for sustainability step (2)
  const sustainabilityFormNavProps: FormNavigationProps = {
    isFirstStep,
    isLastStep,
    isSubmitting: submissionState.isSubmitting,
    onPrevious: handlePrevStep,
    onNext: handleSustainabilityNext,
  }

  return (
    <div className={cn('mx-auto w-full max-w-xl rounded-lg bg-card/40 p-6 shadow-lg', className)}>
      {submissionState.isComplete ? (
        <CompletionScreen onRestart={handleRestart} />
      ) : (
        <>
          {/* Progress bar */}
          <ProgressBar currentStep={step} totalSteps={stepConfigurations.length} />

          {/* Step indicators */}
          <StepIndicator currentStep={step} steps={stepConfigurations as any} />

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
                <h2 className="font-bold text-xl">{currentStepConfig.title}</h2>
                <p className="text-muted-foreground text-sm">{currentStepConfig.description}</p>
              </div>

              {/* Use different form handling for sustainability initiatives step */}
              {step === 2 ? (
                <form className="space-y-4">
                  <InitiativeManager
                    initiatives={initiatives}
                    onChange={(newInitiatives) => {
                      form.setValue('initiatives', newInitiatives)
                    }}
                  />
                  <FormNavigation {...sustainabilityFormNavProps} />
                </form>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit(handleNextStep)}>
                  {/* Render regular fields for other steps */}
                  {currentStepConfig.fields.map((field: any) => (
                    <FormField
                      control={control}
                      errors={errors}
                      field={field}
                      key={field.name}
                      register={register}
                    />
                  ))}

                  {/* Conditionally render SubsidiaryManager for consolidated reports */}
                  {step === 1 && reportBasis === 'consolidated' && (
                    <div className="space-y-2">
                      <SubsidiaryManager control={control} errors={errors} trigger={trigger} />
                    </div>
                  )}

                  <FormNavigation {...regularFormNavProps} />
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
