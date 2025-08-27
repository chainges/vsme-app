'use client'

import { MultiStepForm } from '@/components/forms/multi-step/MultiStepForm'
import { 
  generalInfoConfig, 
  generalInfoDefaultValues 
} from '@/lib/forms/configs/general-info-config'

// Register field renderers
import '@/components/forms/fields/register-fields'

/**
 * Story 4.1.12: GeneralInfo Page with Multi-Step Implementation
 * Two-step form for Company Information and Strategy & Governance
 */
export default function GeneralInfoPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-1">
        <div className="rounded-xl bg-muted/50 p-6">
          <h1 className="mb-2 font-semibold text-2xl">General Information</h1>
          <p className="text-muted-foreground">
            Complete your organization information in two steps: Company Information and Strategy & Governance.
          </p>
        </div>
      </div>
      
      <div className="flex-1">
        <MultiStepForm
          config={generalInfoConfig}
          className="mx-auto w-full max-w-4xl"
        />
      </div>
    </div>
  )
}
