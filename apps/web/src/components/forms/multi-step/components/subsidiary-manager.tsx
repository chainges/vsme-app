'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { type Control, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Subsidiary schema - matches the one in multi-step-form.tsx
const subsidiarySchema = z.object({
  name: z.string().min(2, 'Subsidiary name must be at least 2 characters'),
  organizationNumber: z.string().min(9, 'Organization number must be valid'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
})

type Subsidiary = z.infer<typeof subsidiarySchema>

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

  // Use a separate form for the add/edit form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<Subsidiary>({
    resolver: zodResolver(subsidiarySchema as any),
    defaultValues: {
      name: '',
      organizationNumber: '',
      address: '',
    },
  })

  const handleAddSubsidiary = async (data: Subsidiary) => {
    append(data)
    reset()
    setIsAddingNew(false)

    // Trigger validation on the main form
    if (trigger) {
      await trigger('subsidiaries')
    }
  }

  const handleSaveEdit = async (data: Subsidiary) => {
    if (editingIndex !== null) {
      update(editingIndex, data)
      reset()
      setEditingIndex(null)
      setIsAddingNew(false)

      // Trigger validation on the main form
      if (trigger) {
        await trigger('subsidiaries')
      }
    }
  }

  const handleCancelAdd = () => {
    reset()
    setIsAddingNew(false)
  }

  const handleCancelEdit = () => {
    reset()
    setEditingIndex(null)
    setIsAddingNew(false)
  }

  const handleEditSubsidiary = (index: number) => {
    const subsidiary = fields[index] as unknown as Subsidiary
    reset(subsidiary)
    setEditingIndex(index)
    setIsAddingNew(true)
  }

  const handleDeleteSubsidiary = async (index: number) => {
    remove(index)

    // Trigger validation on the main form
    if (trigger) {
      await trigger('subsidiaries')
    }
  }

  const startAddingNew = () => {
    if (!isAddingNew) {
      reset({ name: '', organizationNumber: '', address: '' })
      setIsAddingNew(true)
      setEditingIndex(null)
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
        <Card className="border-primary/20 bg-muted">
          <CardHeader className="pb-1">
            <CardTitle className="font-medium text-sm">
              {editingIndex !== null ? 'Edit Subsidiary' : 'Add New Subsidiary'}
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm" htmlFor="subsidiary-name">
                    Company Name *
                  </Label>
                  <Input
                    {...register('name')}
                    className={cn(formErrors.name && 'border-destructive')}
                    id="subsidiary-name"
                    placeholder="Enter subsidiary company name"
                  />
                  {formErrors.name && (
                    <p className="text-destructive text-sm">{formErrors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm" htmlFor="subsidiary-org-number">
                    Organization Number *
                  </Label>
                  <Input
                    {...register('organizationNumber')}
                    className={cn(formErrors.organizationNumber && 'border-destructive')}
                    id="subsidiary-org-number"
                    placeholder="123456789"
                  />
                  {formErrors.organizationNumber && (
                    <p className="text-destructive text-sm">
                      {formErrors.organizationNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm" htmlFor="subsidiary-address">
                  Registered Address *
                </Label>
                <Input
                  {...register('address')}
                  className={cn(formErrors.address && 'border-destructive')}
                  id="subsidiary-address"
                  placeholder="Street address, City, Country"
                />
                {formErrors.address && (
                  <p className="text-destructive text-sm">{formErrors.address.message}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={handleSubmit(
                    editingIndex !== null ? handleSaveEdit : handleAddSubsidiary
                  )}
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
