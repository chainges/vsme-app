'use client'

import { Button } from '@/components/ui/button'
import { Save, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step1NavigationControlsProps {
  isLoading?: boolean
  isValidating?: boolean
  onSaveDraft: () => void
  onComplete: () => void
  className?: string
}

/**
 * Custom navigation controls for GeneralInfo Step 1
 * Provides "Save Draft" and "Complete Step 1" buttons
 */
export function Step1NavigationControls({
  isLoading = false,
  isValidating = false,
  onSaveDraft,
  onComplete,
  className,
}: Step1NavigationControlsProps) {
  const isDisabled = isLoading || isValidating

  return (
    <div className={cn(
      'flex items-center justify-between border-t px-6 py-4',
      className
    )}>
      {/* Save Draft Button - Left side */}
      <Button
        type="button"
        variant="outline"
        onClick={onSaveDraft}
        disabled={isDisabled}
        className="gap-2"
      >
        <Save className="h-4 w-4" />
        Save Draft
      </Button>

      {/* Complete Step 1 Button - Right side */}
      <Button
        type="button"
        onClick={onComplete}
        disabled={isDisabled}
        className="gap-2"
      >
        <CheckCircle className="h-4 w-4" />
        Complete Step 1
      </Button>
    </div>
  )
}

export default Step1NavigationControls
