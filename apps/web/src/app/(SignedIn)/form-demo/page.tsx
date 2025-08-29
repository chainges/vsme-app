'use client'

import MultiStepForm from '@/components/common/multi-step-form'

export default function FormDemoPage() {
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data)
    // Here you would typically send the data to your API
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Sustainability Reporting Setup</h1>
          <p className="text-muted-foreground">
            Complete your company setup to begin creating your VSME sustainability report.
          </p>
        </div>

        <MultiStepForm onSubmit={handleFormSubmit} className="w-full max-w-2xl" />
      </div>
    </div>
  )
}
