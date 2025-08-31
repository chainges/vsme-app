import { useForm } from '@tanstack/react-form'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import type { FieldDefinition } from '../../../../lib/forms/types/field-types'
import { FieldArray } from '../FieldArray'
import { type SubsidiaryData, SubsidiaryFormItem } from '../SubsidiaryFormItem'

// Mock subsidiary schema
const subsidiarySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  organizationNumber: z.string().min(1, 'Organization number is required'),
  address: z.string().min(1, 'Address is required'),
})

// Test wrapper component
function TestFieldArray() {
  const form = useForm({
    defaultValues: {
      subsidiaries: [] as SubsidiaryData[],
    },
  })

  const fieldDefinition: FieldDefinition = {
    name: 'subsidiaries',
    type: 'fieldArray',
    label: 'Subsidiaries',
    required: true,
    arrayItemSchema: subsidiarySchema,
  }

  return (
    <form.Field mode="array" name="subsidiaries">
      {(field) => (
        <FieldArray
          addButtonLabel="Add Subsidiary"
          definition={fieldDefinition}
          emptyMessage="No subsidiaries added yet."
          field={field}
          itemComponent={SubsidiaryFormItem}
          maxItems={5}
          removeButtonLabel="Remove"
        />
      )}
    </form.Field>
  )
}

describe('FieldArray', () => {
  it('renders empty state correctly', () => {
    render(<TestFieldArray />)

    expect(screen.getByText('Subsidiaries')).toBeInTheDocument()
    expect(screen.getByText('No subsidiaries added yet.')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /add subsidiary/i })
    ).toBeInTheDocument()
  })

  it('adds new items when add button is clicked', async () => {
    render(<TestFieldArray />)

    const addButton = screen.getByRole('button', { name: /add subsidiary/i })
    fireEvent.click(addButton)

    // Wait for the new item to be added - using findBy which has built-in waitFor
    expect(await screen.findByText('Subsidiaries 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Subsidiary Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Organization Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Address')).toBeInTheDocument()
  })

  it('removes items when remove button is clicked', async () => {
    render(<TestFieldArray />)

    // Add an item first
    const addButton = screen.getByRole('button', { name: /add subsidiary/i })
    fireEvent.click(addButton)

    // Wait for item to be added
    expect(await screen.findByText('Subsidiaries 1')).toBeInTheDocument()

    // Remove the item
    const removeButton = screen.getByRole('button', {
      name: /remove subsidiary 1/i,
    })
    fireEvent.click(removeButton)

    // Check that item is removed and empty message appears
    expect(screen.queryByText('Subsidiaries 1')).not.toBeInTheDocument()
    expect(await screen.findByText('No subsidiaries added yet.')).toBeInTheDocument()
  })

  it('respects maxItems limit', async () => {
    render(<TestFieldArray />)

    const addButton = screen.getByRole('button', { name: /add subsidiary/i })

    // Add 5 items (maxItems)
    for (let i = 0; i < 5; i++) {
      fireEvent.click(addButton)
    }

    // Wait for the last item to be added
    expect(await screen.findByText('Subsidiaries 5')).toBeInTheDocument()

    // Add button should be disabled
    expect(addButton).toBeDisabled()
  })

  it('shows proper accessibility attributes', () => {
    render(<TestFieldArray />)

    const addButton = screen.getByRole('button', { name: /add subsidiary/i })
    expect(addButton).toHaveAttribute('aria-describedby')

    const groupElement = screen.getByRole('group', {
      name: /subsidiaries list/i,
    })
    expect(groupElement).toHaveAttribute('aria-live', 'polite')
  })

  it('handles form validation correctly', async () => {
    render(<TestFieldArray />)

    // Add an item
    const addButton = screen.getByRole('button', { name: /add subsidiary/i })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByLabelText('Subsidiary Name')).toBeInTheDocument()
    })

    // Fill in some fields but leave others empty to trigger validation
    const nameInput = screen.getByLabelText('Subsidiary Name')
    fireEvent.change(nameInput, { target: { value: 'Test Subsidiary' } })
    fireEvent.blur(nameInput)

    // The organization number and address should show validation errors when blurred
    const orgNumberInput = screen.getByLabelText('Organization Number')
    fireEvent.blur(orgNumberInput)

    await waitFor(() => {
      expect(
        screen.getByText('Organization number is required')
      ).toBeInTheDocument()
    })
  })
})

describe('SubsidiaryFormItem', () => {
  const mockProps = {
    index: 0,
    item: { name: '', organizationNumber: '', address: '' },
    onUpdate: vi.fn(),
    onRemove: vi.fn(),
    schema: subsidiarySchema,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all required fields', () => {
    render(<SubsidiaryFormItem {...mockProps} />)

    expect(screen.getByLabelText('Subsidiary Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Organization Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Address')).toBeInTheDocument()
  })

  it('calls onUpdate when field values change', async () => {
    render(<SubsidiaryFormItem {...mockProps} />)

    const nameInput = screen.getByLabelText('Subsidiary Name')
    fireEvent.change(nameInput, { target: { value: 'Test Company' } })

    await waitFor(() => {
      expect(mockProps.onUpdate).toHaveBeenCalledWith(0, {
        name: 'Test Company',
        organizationNumber: '',
        address: '',
      })
    })
  })

  it('shows validation errors for required fields', async () => {
    render(<SubsidiaryFormItem {...mockProps} />)

    const nameInput = screen.getByLabelText('Subsidiary Name')
    fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(
        screen.getByText('Subsidiary name is required')
      ).toBeInTheDocument()
    })
  })

  it('handles disabled state correctly', () => {
    render(<SubsidiaryFormItem {...mockProps} disabled={true} />)

    const nameInput = screen.getByLabelText('Subsidiary Name')
    const orgNumberInput = screen.getByLabelText('Organization Number')
    const addressInput = screen.getByLabelText('Address')

    expect(nameInput).toBeDisabled()
    expect(orgNumberInput).toBeDisabled()
    expect(addressInput).toBeDisabled()
  })
})
