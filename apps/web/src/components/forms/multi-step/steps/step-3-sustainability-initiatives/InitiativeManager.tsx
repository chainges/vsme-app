'use client'

import { useEffect, useRef, useState } from 'react'
import type {
  InitiativeType,
  SustainabilityInitiative,
} from '@/components/forms/multi-step/steps/step-3-sustainability-initiatives/schema'
import { InitiativeForm } from './InitiativeForm'
import { InitiativesTable } from './InitiativesTable'

interface InitiativeManagerProps {
  initiatives: SustainabilityInitiative[]
  onChange: (initiatives: SustainabilityInitiative[]) => void
}

export function InitiativeManager({ initiatives, onChange }: InitiativeManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [addingType, setAddingType] = useState<InitiativeType | null>(null)

  // Focus management for accessibility
  const tableRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const handleAddInitiative = (type: string) => {
    setAddingType(type as InitiativeType)
    setEditingIndex(null)
  }

  const handleEditInitiative = (index: number) => {
    setEditingIndex(index)
    setAddingType(null)
  }

  const handleDeleteInitiative = (index: number) => {
    const newInitiatives = [...initiatives]
    newInitiatives.splice(index, 1)
    onChange(newInitiatives)
  }

  const handleFormSubmit = (data: Omit<SustainabilityInitiative, 'isSelected' | 'type'>) => {
    let newInitiatives: SustainabilityInitiative[]

    if (editingIndex !== null) {
      // Update existing initiative
      newInitiatives = [...initiatives]
      newInitiatives[editingIndex] = {
        ...newInitiatives[editingIndex],
        ...data,
      }
    } else if (addingType) {
      // Add new initiative
      const newInitiative: SustainabilityInitiative = {
        type: addingType,
        ...data,
        isSelected: true,
      }
      newInitiatives = [...initiatives, newInitiative]
    } else {
      // Fallback - shouldn't happen but just in case
      newInitiatives = [...initiatives]
    }

    onChange(newInitiatives)

    // Reset form state
    setEditingIndex(null)
    setAddingType(null)

    // Focus back to table after form submission
    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.focus()
      }
    }, 0)
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setAddingType(null)

    // Focus back to table after cancel
    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.focus()
      }
    }, 0)
  }

  // Determine which initiative we're editing or adding
  let currentInitiative: SustainabilityInitiative | null = null
  if (editingIndex !== null) {
    currentInitiative = initiatives[editingIndex]
  } else if (addingType) {
    currentInitiative = {
      type: addingType,
      responsiblePerson: '',
      goal: '',
      description: '',
      isSelected: true,
    } as SustainabilityInitiative
  }

  // Focus form when it appears
  useEffect(() => {
    if ((editingIndex !== null || addingType !== null) && formRef.current) {
      setTimeout(() => {
        if (formRef.current) {
          const firstInput = formRef.current.querySelector('input, textarea')
          if (firstInput) {
            ;(firstInput as HTMLElement).focus()
          }
        }
      }, 0)
    }
  }, [editingIndex, addingType])

  return (
    <div className="space-y-6">
      <div ref={tableRef} tabIndex={-1}>
        <InitiativesTable
          initiatives={initiatives}
          onAddInitiative={handleAddInitiative}
          onDeleteInitiative={handleDeleteInitiative}
          onEditInitiative={handleEditInitiative}
        />
      </div>

      {(editingIndex !== null || addingType !== null) && currentInitiative && (
        <div ref={formRef} tabIndex={-1}>
          <InitiativeForm
            initiative={editingIndex !== null ? currentInitiative : undefined}
            onCancel={handleCancel}
            onSubmit={handleFormSubmit}
          />
        </div>
      )}
    </div>
  )
}
