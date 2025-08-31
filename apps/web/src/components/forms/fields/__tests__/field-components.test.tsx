import { useForm } from '@tanstack/react-form'
import { fireEvent, render, screen } from '@testing-library/react'
import type React from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { z } from 'zod'
import CheckboxField from '../CheckboxField'
import SelectField from '../SelectField'
import TextareaField from '../TextareaField'
import TextField from '../TextField'

// Mock form wrapper component for testing
function TestFormWrapper({
  children,
  defaultValue = '',
  validation,
}: {
  children: (field: any) => React.ReactNode
  defaultValue?: any
  validation?: z.ZodSchema<any>
}) {
  const form = useForm({
    defaultValues: {
      testField: defaultValue,
    },
    validators: validation
      ? {
          onChange: validation,
        }
      : undefined,
  })

  return (
    <form>
      <form.Field name="testField">{children}</form.Field>
    </form>
  )
}

describe('TextField', () => {
  it('renders with label and input', () => {
    const definition = {
      name: 'testField',
      type: 'text' as const,
      label: 'Test Field',
      placeholder: 'Enter text...',
    }

    render(
      <TestFormWrapper>
        {(field) => <TextField definition={definition} field={field} />}
      </TestFormWrapper>
    )

    expect(screen.getByLabelText('Test Field')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument()
  })

  it('shows required indicator when required', () => {
    const definition = {
      name: 'testField',
      type: 'text' as const,
      label: 'Required Field',
      required: true,
    }

    render(
      <TestFormWrapper>
        {(field) => <TextField definition={definition} field={field} />}
      </TestFormWrapper>
    )

    const label = screen.getByText('Required Field')
    expect(label).toHaveClass("after:content-['*']")
  })

  it('handles input changes', () => {
    const definition = {
      name: 'testField',
      type: 'text' as const,
      label: 'Test Field',
    }

    render(
      <TestFormWrapper>
        {(field) => <TextField definition={definition} field={field} />}
      </TestFormWrapper>
    )

    const input = screen.getByLabelText('Test Field')
    fireEvent.change(input, { target: { value: 'test value' } })

    expect(input).toHaveValue('test value')
  })
})

describe('TextareaField', () => {
  it('renders with label and textarea', () => {
    const definition = {
      name: 'testField',
      type: 'textarea' as const,
      label: 'Description',
      placeholder: 'Enter description...',
    }

    render(
      <TestFormWrapper>
        {(field) => <TextareaField definition={definition} field={field} />}
      </TestFormWrapper>
    )

    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Enter description...')
    ).toBeInTheDocument()
  })

  it('shows character count when maxLength is provided', () => {
    const definition = {
      name: 'testField',
      type: 'textarea' as const,
      label: 'Description',
    }

    render(
      <TestFormWrapper defaultValue="test">
        {(field) => (
          <TextareaField
            definition={definition}
            field={field}
            maxLength={100}
          />
        )}
      </TestFormWrapper>
    )

    expect(screen.getByText('4/100')).toBeInTheDocument()
  })
})

describe('SelectField', () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Disabled Option', value: 'disabled', disabled: true },
  ]

  it('renders with label and select trigger', () => {
    const definition = {
      name: 'testField',
      type: 'select' as const,
      label: 'Select Field',
    }

    render(
      <TestFormWrapper>
        {(field) => (
          <SelectField
            definition={definition}
            field={field}
            options={options}
          />
        )}
      </TestFormWrapper>
    )

    expect(screen.getByLabelText('Select Field')).toBeInTheDocument()
    expect(screen.getByText('Select select field...')).toBeInTheDocument()
  })
})

describe('CheckboxField', () => {
  it('renders with label and checkbox', () => {
    const definition = {
      name: 'testField',
      type: 'checkbox' as const,
      label: 'Checkbox Field',
    }

    render(
      <TestFormWrapper defaultValue={false}>
        {(field) => <CheckboxField definition={definition} field={field} />}
      </TestFormWrapper>
    )

    expect(screen.getByLabelText('Checkbox Field')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('shows description when provided', () => {
    const definition = {
      name: 'testField',
      type: 'checkbox' as const,
      label: 'Checkbox Field',
    }

    render(
      <TestFormWrapper defaultValue={false}>
        {(field) => (
          <CheckboxField
            definition={definition}
            description="This is a helpful description"
            field={field}
          />
        )}
      </TestFormWrapper>
    )

    expect(
      screen.getByText('This is a helpful description')
    ).toBeInTheDocument()
  })

  it('handles checkbox changes', () => {
    const definition = {
      name: 'testField',
      type: 'checkbox' as const,
      label: 'Checkbox Field',
    }

    render(
      <TestFormWrapper defaultValue={false}>
        {(field) => <CheckboxField definition={definition} field={field} />}
      </TestFormWrapper>
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })
})
