'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Check, Pencil, X } from 'lucide-react'

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

  if (isEditing) {
    return (
      <div className={cn('flex items-center gap-2 group', className)}>
        <Textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn('transition-all', inputClassName)}
        />
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:bg-green-100 rounded-md transition-colors"
            aria-label="Save"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:bg-red-100 rounded-md transition-colors"
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={handleEdit}
      className={cn(
        'group flex items-center gap-2 px-3 py-2 rounded-md border border-transparent cursor-pointer transition-all',
        'hover:bg-muted/50 hover:border-muted-foreground/20',
        className
      )}
    >
      <span className={cn('flex-1', !value && 'text-muted-foreground text-sm')}>
        {value || placeholder}
      </span>
      <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
