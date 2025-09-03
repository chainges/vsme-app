'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { SustainabilityInitiative } from '@/components/forms/multi-step/steps/step-3-sustainability-initiatives/schema'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface InitiativesTableProps {
  initiatives: SustainabilityInitiative[]
  onAddInitiative: (type: string) => void
  onEditInitiative: (index: number) => void
  onDeleteInitiative: (index: number) => void
}

const INITIATIVE_TYPES = [
  'Workforce Development',
  'Biodiversity',
  'Climate Change',
  'Business Ethics',
  'Circular Economy',
  'Community Impact',
  'Marine Resources',
  'Stakeholder Engagement',
] as const

export function InitiativesTable({
  initiatives,
  onAddInitiative,
  onEditInitiative,
  onDeleteInitiative,
}: InitiativesTableProps) {
  // Create a map of existing initiatives for quick lookup
  const existingInitiatives = new Map(
    initiatives.map((initiative, index) => [initiative.type, { initiative, index }])
  )

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <span className="sr-only">Select</span>
            </TableHead>
            <TableHead>Initiative</TableHead>
            <TableHead>Responsible</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INITIATIVE_TYPES.map((type) => {
            const existing = existingInitiatives.get(type)
            const initiative = existing?.initiative
            const isSelected = initiative?.isSelected ?? false

            return (
              <TableRow key={type}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${type} initiative`}
                    checked={isSelected}
                    disabled
                  />
                </TableCell>
                <TableCell className="font-medium">{type}</TableCell>
                <TableCell>
                  {isSelected && initiative ? initiative.responsiblePerson : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {isSelected ? (
                    <div className="flex justify-end gap-1">
                      <Button
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          if (existing) {
                            onEditInitiative(existing.index)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            if (existing) {
                              onEditInitiative(existing.index)
                            }
                          }
                        }}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit {type}</span>
                      </Button>
                      <Button
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          if (existing) {
                            onDeleteInitiative(existing.index)
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            if (existing) {
                              onDeleteInitiative(existing.index)
                            }
                          }
                        }}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete {type}</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="h-8 w-8 p-0"
                      onClick={() => onAddInitiative(type)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onAddInitiative(type)
                        }
                      }}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Add {type}</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
