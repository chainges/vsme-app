'use client'

import { useState } from 'react'
import type { SustainabilityInitiative } from '@/components/forms/multi-step/steps/step-3-sustainability-initiatives/sustainability-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface InitiativeFormProps {
  initiative?: SustainabilityInitiative
  onSubmit: (data: Omit<SustainabilityInitiative, 'isSelected' | 'type'>) => void
  onCancel: () => void
}

export function InitiativeForm({ initiative, onSubmit, onCancel }: InitiativeFormProps) {
  const [formData, setFormData] = useState({
    responsiblePerson: initiative?.responsiblePerson || '',
    goal: initiative?.goal || '',
    description: initiative?.description || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.responsiblePerson.length < 2) {
      newErrors.responsiblePerson = 'Responsible person name must be at least 2 characters'
    }

    if (formData.goal.length < 10) {
      newErrors.goal = 'Goal must be at least 10 characters'
    }

    if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="rounded-lg border bg-muted p-4">
      <h3 className="font-medium text-lg" id="initiative-form-title">
        {initiative ? `Edit ${initiative.type}` : 'Add New Initiative'}
      </h3>

      <div aria-describedby="initiative-form-title" className="space-y-4 pt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="responsiblePerson">Responsible Person *</Label>
            <Input
              id="responsiblePerson"
              onChange={(e) => handleChange('responsiblePerson', e.target.value)}
              placeholder="Enter responsible person name"
              value={formData.responsiblePerson}
            />
            {errors.responsiblePerson && (
              <p className="text-destructive text-sm">{errors.responsiblePerson}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Initiative Type</Label>
            <Input disabled id="type" value={initiative?.type || ''} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Goal *</Label>
          <Textarea
            className="min-h-20"
            id="goal"
            onChange={(e) => handleChange('goal', e.target.value)}
            placeholder="Enter the goal for this initiative"
            value={formData.goal}
          />
          {errors.goal && <p className="text-destructive text-sm">{errors.goal}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            className="min-h-32"
            id="description"
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter a detailed description of this initiative"
            value={formData.description}
          />
          {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="button">
            {initiative ? 'Update' : 'Add'} Initiative
          </Button>
        </div>
      </div>
    </div>
  )
}
