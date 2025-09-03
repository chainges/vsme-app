'use client'

import { MultiStepForm } from '@/components/forms'

export default function TestFormPage() {
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data)
    // Save to localStorage
    localStorage.setItem('sustainabilityFormTest', JSON.stringify(data))
    console.log('Form data saved to localStorage')
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 font-bold text-2xl">Sustainability Initiatives Form Test</h1>
      <MultiStepForm onSubmit={handleFormSubmit} />
    </div>
  )
}
