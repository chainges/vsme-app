'use client'

import { Check, Pencil, X } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface InlineEditableTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  inputClassName?: string
}

export function InlineEditableTextarea({
  value,
  onChange,
  placeholder = 'Enter text...',
  className,
  inputClassName,
}: InlineEditableTextareaProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Reset input value when value prop changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    onChange(inputValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setInputValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleEdit()
    }
  }

  if (isEditing) {
    return (
      <div className={cn('group flex items-center gap-2', className)}>
        <Textarea
          className={cn('transition-all', inputClassName)}
          onBlur={handleSave}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={inputRef}
          value={inputValue}
        />
        <div className="flex items-center gap-1">
          <button
            aria-label="Save"
            className="rounded-md p-1 text-green-600 transition-colors hover:bg-green-100"
            onClick={handleSave}
            type="button"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            aria-label="Cancel"
            className="rounded-md p-1 text-red-600 transition-colors hover:bg-red-100"
            onClick={handleCancel}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      className={cn(
        'group flex w-full cursor-pointer items-center gap-2 rounded-md border border-transparent px-3 py-2 text-left transition-all',
        'hover:border-muted-foreground/20 hover:bg-muted/50',
        className
      )}
      onClick={handleEdit}
      onKeyUp={handleKeyUp}
      type="button"
    >
      <span className={cn('flex-1', !value && 'text-muted-foreground text-sm')}>
        {value || placeholder}
      </span>
      <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  )
}
