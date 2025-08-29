'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  CompletionScreen,
  FormField,
  FormNavigation,
  type MultiStepFormProps,
  ProgressBar,
  StepIndicator,
  stepConfigurations,
  useMultiStepForm,
} from './multi-step-form/'
import SubsidiaryManager from './multi-step-form/components/subsidiary-manager'

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

              <form className="space-y-4" onSubmit={handleSubmit(handleNextStep)}>
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

                <FormNavigation
                  isFirstStep={isFirstStep}
                  isLastStep={isLastStep}
                  isSubmitting={submissionState.isSubmitting}
                  onPrevious={handlePrevStep}
                />
              </form>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
