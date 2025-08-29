import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { SubsidiaryManager } from '@/components/forms/multi-step/components/subsidiary-manager'

// Test wrapper component
function TestWrapper({ withTrigger = false }: { withTrigger?: boolean } = {}) {
  const {
    control,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subsidiaries: [],
    },
  })

  const triggerFn = withTrigger
    ? async (fieldName?: string | string[]) => {
        return await trigger(fieldName as any)
      }
    : undefined

  return <SubsidiaryManager control={control} errors={errors} trigger={triggerFn} />
}

describe('SubsidiaryManager', () => {
  it('renders empty state when no subsidiaries are added', () => {
    render(<TestWrapper />)

    expect(screen.getByText('Subsidiaries')).toBeInTheDocument()
    expect(screen.getByText('Add Subsidiary')).toBeInTheDocument()
    expect(
      screen.getByText('No subsidiaries added yet. Click "Add Subsidiary" to get started.')
    ).toBeInTheDocument()
  })

  it('shows add form when "Add Subsidiary" button is clicked', async () => {
    render(<TestWrapper />)

    const addButton = screen.getByText('Add Subsidiary')
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Add New Subsidiary')).toBeInTheDocument()
      expect(screen.getByLabelText('Company Name *')).toBeInTheDocument()
      expect(screen.getByLabelText('Organization Number *')).toBeInTheDocument()
      expect(screen.getByLabelText('Registered Address *')).toBeInTheDocument()
      expect(screen.getByText('Add Subsidiary', { selector: 'button' })).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })
  })

  it('validates and adds a subsidiary with proper data', async () => {
    render(<TestWrapper withTrigger={true} />)

    // Click add subsidiary button
    const addButton = screen.getByText('Add Subsidiary')
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Add New Subsidiary')).toBeInTheDocument()
    })

    // Fill in the form
    const nameInput = screen.getByLabelText('Company Name *')
    const orgNumberInput = screen.getByLabelText('Organization Number *')
    const addressInput = screen.getByLabelText('Registered Address *')

    fireEvent.change(nameInput, { target: { value: 'Test Company' } })
    fireEvent.change(orgNumberInput, { target: { value: '123456789' } })
    fireEvent.change(addressInput, { target: { value: 'Test Address, City, Country' } })

    // Submit the form
    const submitButton = screen.getByText('Add Subsidiary', { selector: 'button' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      // The form should close and show the added subsidiary
      expect(screen.queryByText('Add New Subsidiary')).not.toBeInTheDocument()
      expect(screen.getByText('Test Company')).toBeInTheDocument()
      expect(screen.getByText('Org: 123456789')).toBeInTheDocument()
      expect(screen.getByText('Test Address, City, Country')).toBeInTheDocument()
    })
  })

  it('shows validation errors for invalid data', async () => {
    render(<TestWrapper />)

    // Click add subsidiary button
    const addButton = screen.getByText('Add Subsidiary')
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Add New Subsidiary')).toBeInTheDocument()
    })

    // Try to submit with invalid data
    const nameInput = screen.getByLabelText('Company Name *')
    const orgNumberInput = screen.getByLabelText('Organization Number *')
    const addressInput = screen.getByLabelText('Registered Address *')

    fireEvent.change(nameInput, { target: { value: 'A' } }) // Too short
    fireEvent.change(orgNumberInput, { target: { value: '123' } }) // Too short
    fireEvent.change(addressInput, { target: { value: 'ABC' } }) // Too short

    const submitButton = screen.getByText('Add Subsidiary', { selector: 'button' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Subsidiary name must be at least 2 characters')).toBeInTheDocument()
      expect(screen.getByText('Organization number must be valid')).toBeInTheDocument()
      expect(screen.getByText('Address must be at least 5 characters')).toBeInTheDocument()
    })
  })

  it('cancels adding a subsidiary when cancel button is clicked', async () => {
    render(<TestWrapper />)

    const addButton = screen.getByText('Add Subsidiary')
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('Add New Subsidiary')).toBeInTheDocument()
    })

    // Fill in some data
    const nameInput = screen.getByLabelText('Company Name *')
    fireEvent.change(nameInput, { target: { value: 'Test Company' } })

    // Click cancel
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    await waitFor(() => {
      // Form should close and no subsidiary should be added
      expect(screen.queryByText('Add New Subsidiary')).not.toBeInTheDocument()
      expect(screen.queryByText('Test Company')).not.toBeInTheDocument()
      expect(
        screen.getByText('No subsidiaries added yet. Click "Add Subsidiary" to get started.')
      ).toBeInTheDocument()
    })
  })

  it('displays edit and delete buttons for added subsidiaries', async () => {
    render(<TestWrapper withTrigger={true} />)

    // Add a subsidiary first
    const addButton = screen.getByText('Add Subsidiary')
    fireEvent.click(addButton)

    const nameInput = screen.getByLabelText('Company Name *')
    const orgNumberInput = screen.getByLabelText('Organization Number *')
    const addressInput = screen.getByLabelText('Registered Address *')

    fireEvent.change(nameInput, { target: { value: 'Test Company' } })
    fireEvent.change(orgNumberInput, { target: { value: '123456789' } })
    fireEvent.change(addressInput, { target: { value: 'Test Address, City, Country' } })

    const submitButton = screen.getByText('Add Subsidiary', { selector: 'button' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument()
    })

    // Check for edit and delete buttons
    const editButtons = screen.getAllByRole('button')
    const editButton = editButtons.find(
      (button) =>
        button.querySelector('svg') &&
        button.getAttribute('aria-label') === null &&
        button.textContent === ''
    )
    expect(editButton).toBeInTheDocument()
  })

  it('allows editing a subsidiary', async () => {
    render(<TestWrapper withTrigger={true} />)

    // Add a subsidiary first
    const addButton = screen.getByText('Add Subsidiary')
    fireEvent.click(addButton)

    const nameInput = screen.getByLabelText('Company Name *')
    const orgNumberInput = screen.getByLabelText('Organization Number *')
    const addressInput = screen.getByLabelText('Registered Address *')

    fireEvent.change(nameInput, { target: { value: 'Original Company' } })
    fireEvent.change(orgNumberInput, { target: { value: '123456789' } })
    fireEvent.change(addressInput, { target: { value: 'Original Address' } })

    const submitButton = screen.getByText('Add Subsidiary', { selector: 'button' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Original Company')).toBeInTheDocument()
    })

    // Find and click edit button (first button with no text content)
    const buttons = screen.getAllByRole('button')
    const editButton = buttons.find((btn) => btn.textContent === '' && btn.querySelector('svg'))

    if (editButton) {
      fireEvent.click(editButton)
    }

    await waitFor(() => {
      expect(screen.getByText('Edit Subsidiary')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Original Company')).toBeInTheDocument()
    })

    // Edit the name
    const editNameInput = screen.getByDisplayValue('Original Company')
    fireEvent.change(editNameInput, { target: { value: 'Updated Company' } })

    // Save changes
    const updateButton = screen.getByText('Update Subsidiary')
    fireEvent.click(updateButton)

    await waitFor(() => {
      expect(screen.getByText('Updated Company')).toBeInTheDocument()
      expect(screen.queryByText('Original Company')).not.toBeInTheDocument()
    })
  })
})
