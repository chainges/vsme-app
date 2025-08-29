'use client'

import MultiStepForm from '@/components/common/multi-step-form'

export default function TestFormPage() {
  const handleFormSubmit = (data: any) => {
    console.log('Form submitted with data:', data)
    // Save to localStorage
    localStorage.setItem('sustainabilityFormTest', JSON.stringify(data))
    console.log('Form data saved to localStorage')
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="font-bold text-2xl mb-6">Sustainability Initiatives Form Test</h1>
      <MultiStepForm onSubmit={handleFormSubmit} />
    </div>
  )
}