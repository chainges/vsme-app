'use client'

import { Controller } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { FormFieldType } from '../types'

interface FormFieldProps {
  field: FormFieldType
  control: any
  register: any
  errors: any
}

export function FormField({ field, control, register, errors }: FormFieldProps) {
  const hasError = Boolean(errors[field.name])

  return (
    <div className="space-y-2" key={field.name}>
      <Label htmlFor={field.name}>{field.label}</Label>

      {field.type === 'select' && (
        <Controller
          control={control}
          name={field.name}
          render={({ field: controllerField }) => (
            <Select onValueChange={controllerField.onChange} value={controllerField.value || ''}>
              <SelectTrigger className={cn('w-full', hasError && 'border-destructive')}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      )}

      {field.type === 'checkbox' && (
        <div className="flex items-start space-x-2">
          <Controller
            control={control}
            name={field.name}
            render={({ field: controllerField }) => (
              <Checkbox
                checked={Boolean(controllerField.value)}
                className={cn(hasError && 'border-destructive')}
                id={field.name}
                onCheckedChange={controllerField.onChange}
              />
            )}
          />
          {field.description && (
            <div className="grid gap-1.5 leading-none">
              <label
                className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor={field.name}
              >
                {field.description}
              </label>
            </div>
          )}
        </div>
      )}

      {field.type === 'textarea' && (
        <Textarea
          id={field.name}
          placeholder={field.placeholder}
          {...register(field.name)}
          className={cn(hasError && 'border-destructive')}
          rows={3}
        />
      )}

      {['text', 'number', 'email', 'url', 'password'].includes(field.type) && (
        <Input
          id={field.name}
          placeholder={field.placeholder}
          type={field.type}
          {...register(field.name)}
          className={cn(hasError && 'border-destructive')}
        />
      )}

      {hasError && (
        <p className="text-destructive text-sm">{errors[field.name]?.message as string}</p>
      )}
    </div>
  )
}
