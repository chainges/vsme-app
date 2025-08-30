'use client'

import { MultiStepForm } from '@/components/forms'

export default function GeneralInfoPage() {
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data)
    // Here you would typically send the data to your API
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 font-bold text-3xl">Sustainability Reporting Setup</h1>
      <p className="text-muted-foreground">
        Complete your company setup to begin creating your VSME sustainability report.
      </p>
      <MultiStepForm className="w-full max-w-2xl" onSubmit={handleFormSubmit} />
    </div>
  )
}
