"use client"

import MultiStepForm from "@/components/common/multi-step-form"

export default function GeneralInfoPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">General Information</h1>
      
      <section>
      <MultiStepForm
  className="max-w-md mx-auto"
  onSubmit={(data) => {
    // Handle form submission
    console.log("Form data:", data);
  }}
/>
      </section>
    </div>
  )
}