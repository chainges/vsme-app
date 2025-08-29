'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { type Control, useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Subsidiary {
  name: string
  organizationNumber: string
  address: string
}

interface SubsidiaryManagerProps {
  control: Control<any>
  errors?: any
  trigger?: (fieldName?: string | string[]) => Promise<boolean>
}

export default function SubsidiaryManager({ control, errors, trigger }: SubsidiaryManagerProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'subsidiaries',
  })

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newSubsidiary, setNewSubsidiary] = useState<Subsidiary>({
    name: '',
    organizationNumber: '',
    address: '',
  })
  const [validationErrors, setValidationErrors] = useState<{
    name?: string
    organizationNumber?: string
    address?: string
  }>({})

  const validateSubsidiary = (subsidiary: Subsidiary): boolean => {
    const validationErrs: typeof validationErrors = {}

    if (!subsidiary.name || subsidiary.name.trim().length < 2) {
      validationErrs.name = 'Name must be at least 2 characters'
    }

    if (!subsidiary.organizationNumber || subsidiary.organizationNumber.trim().length < 9) {
      validationErrs.organizationNumber = 'Organization number must be at least 9 characters'
    }

    if (!subsidiary.address || subsidiary.address.trim().length < 5) {
      validationErrs.address = 'Address must be at least 5 characters'
    }

    setValidationErrors(validationErrs)
    return Object.keys(validationErrs).length === 0
  }

  const handleAddSubsidiary = async () => {
    if (validateSubsidiary(newSubsidiary)) {
      append(newSubsidiary)
      setNewSubsidiary({ name: '', organizationNumber: '', address: '' })
      setIsAddingNew(false)
      setValidationErrors({})

      // Trigger validation on the form to update any conditional validation
      if (trigger) {
        await trigger('subsidiaries')
      }
    }
  }

  const handleCancelAdd = () => {
    setNewSubsidiary({ name: '', organizationNumber: '', address: '' })
    setIsAddingNew(false)
    setValidationErrors({})
  }

  const handleEditSubsidiary = (index: number) => {
    const subsidiary = fields[index] as unknown as Subsidiary
    setNewSubsidiary(subsidiary)
    setEditingIndex(index)
    setIsAddingNew(true)
    setValidationErrors({})
  }

  const handleSaveEdit = async () => {
    if (editingIndex !== null && validateSubsidiary(newSubsidiary)) {
      update(editingIndex, newSubsidiary)
      setNewSubsidiary({ name: '', organizationNumber: '', address: '' })
      setEditingIndex(null)
      setIsAddingNew(false)
      setValidationErrors({})

      // Trigger validation on the form
      if (trigger) {
        await trigger('subsidiaries')
      }
    }
  }

  const handleCancelEdit = () => {
    setNewSubsidiary({ name: '', organizationNumber: '', address: '' })
    setEditingIndex(null)
    setIsAddingNew(false)
    setValidationErrors({})
  }

  const handleDeleteSubsidiary = async (index: number) => {
    remove(index)

    // Trigger validation on the form
    if (trigger) {
      await trigger('subsidiaries')
    }
  }

  const startAddingNew = () => {
    if (!isAddingNew) {
      setIsAddingNew(true)
      setEditingIndex(null)
      setValidationErrors({})
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="font-medium text-base">Subsidiaries</Label>
        {!isAddingNew && (
          <Button
            className="flex items-center gap-2"
            onClick={startAddingNew}
            size="sm"
            type="button"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Add Subsidiary
          </Button>
        )}
      </div>

      {/* Display added subsidiaries */}
      {fields.length > 0 && (
        <div className="space-y-3">
          {fields.map((field, index) => {
            const subsidiary = field as unknown as Subsidiary
            return (
              <Card className="bg-muted/50 py-0" key={field.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-sm">{subsidiary.name}</h3>
                        <span className="text-muted-foreground text-xs">
                          Org: {subsidiary.organizationNumber}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">{subsidiary.address}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEditSubsidiary(index)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteSubsidiary(index)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {fields.length === 0 && !isAddingNew && (
        <div className="rounded-lg border-2 border-muted-foreground/20 border-dashed py-8 text-center text-muted-foreground text-sm">
          No subsidiaries added yet. Click "Add Subsidiary" to get started.
        </div>
      )}

      {/* Add/Edit form */}
      {isAddingNew && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="font-medium text-sm">
              {editingIndex !== null ? 'Edit Subsidiary' : 'Add New Subsidiary'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm" htmlFor="new-subsidiary-name">
                  Company Name *
                </Label>
                <Input
                  className={cn(validationErrors.name && 'border-destructive')}
                  id="new-subsidiary-name"
                  onChange={(e) => setNewSubsidiary((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter subsidiary company name"
                  value={newSubsidiary.name}
                />
                {validationErrors.name && (
                  <p className="text-destructive text-sm">{validationErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm" htmlFor="new-subsidiary-org-number">
                  Organization Number *
                </Label>
                <Input
                  className={cn(validationErrors.organizationNumber && 'border-destructive')}
                  id="new-subsidiary-org-number"
                  onChange={(e) =>
                    setNewSubsidiary((prev) => ({ ...prev, organizationNumber: e.target.value }))
                  }
                  placeholder="123456789"
                  value={newSubsidiary.organizationNumber}
                />
                {validationErrors.organizationNumber && (
                  <p className="text-destructive text-sm">{validationErrors.organizationNumber}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm" htmlFor="new-subsidiary-address">
                Registered Address *
              </Label>
              <Input
                className={cn(validationErrors.address && 'border-destructive')}
                id="new-subsidiary-address"
                onChange={(e) => setNewSubsidiary((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Street address, City, Country"
                value={newSubsidiary.address}
              />
              {validationErrors.address && (
                <p className="text-destructive text-sm">{validationErrors.address}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={editingIndex !== null ? handleSaveEdit : handleAddSubsidiary}
                size="sm"
                type="button"
              >
                {editingIndex !== null ? 'Update' : 'Add'} Subsidiary
              </Button>
              <Button
                onClick={editingIndex !== null ? handleCancelEdit : handleCancelAdd}
                size="sm"
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form-level validation errors */}
      {errors?.subsidiaries &&
        typeof errors.subsidiaries === 'object' &&
        !Array.isArray(errors.subsidiaries) && (
          <p className="text-destructive text-sm">{errors.subsidiaries.message}</p>
        )}
    </div>
  )
}
