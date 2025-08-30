import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InitiativeForm } from '../InitiativeForm'

const mockOnSubmit = vi.fn()
const mockOnCancel = vi.fn()

describe('InitiativeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders add form correctly', () => {
    render(<InitiativeForm onCancel={mockOnCancel} onSubmit={mockOnSubmit} />)

    expect(screen.getByText('Add New Initiative')).toBeInTheDocument()
    expect(screen.getByLabelText('Responsible Person *')).toBeInTheDocument()
    expect(screen.getByLabelText('Initiative Type')).toBeInTheDocument()
    expect(screen.getByLabelText('Goal *')).toBeInTheDocument()
    expect(screen.getByLabelText('Description *')).toBeInTheDocument()

    // Check that type field is disabled
    const typeInput = screen.getByLabelText('Initiative Type')
    expect(typeInput).toBeDisabled()
  })

  it('renders edit form correctly', () => {
    const mockInitiative = {
      type: 'Climate Change',
      responsiblePerson: 'John Doe',
      goal: 'Reduce carbon emissions',
      description: 'Implement carbon reduction strategies',
      isSelected: true,
    }

    render(
      <InitiativeForm initiative={mockInitiative} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />
    )

    expect(screen.getByText('Edit Climate Change')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Climate Change')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Reduce carbon emissions')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Implement carbon reduction strategies')).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(<InitiativeForm onCancel={mockOnCancel} onSubmit={mockOnSubmit} />)

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('validates required fields', async () => {
    render(<InitiativeForm onCancel={mockOnCancel} onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: 'Add Initiative' })
    fireEvent.click(submitButton)

    // Wait for validation errors
    await waitFor(() => {
      expect(
        screen.getByText('Responsible person name must be at least 2 characters')
      ).toBeInTheDocument()
    })

    // Check that all required fields show validation errors
    expect(screen.getByText('Responsible person name must be at least 2 characters')).toBeInTheDocument()
    expect(screen.getByText('Goal must be at least 10 characters')).toBeInTheDocument()
    expect(screen.getByText('Description must be at least 20 characters')).toBeInTheDocument()
  })

  it('validates field length requirements', async () => {
    render(<InitiativeForm onCancel={mockOnCancel} onSubmit={mockOnSubmit} />)

    // Fill in fields with invalid lengths
    const responsibleInput = screen.getByLabelText('Responsible Person *')
    fireEvent.change(responsibleInput, { target: { value: 'A' } }) // Too short

    const goalInput = screen.getByLabelText('Goal *')
    fireEvent.change(goalInput, { target: { value: 'Short' } }) // Too short

    const descriptionInput = screen.getByLabelText('Description *')
    fireEvent.change(descriptionInput, { target: { value: 'Too short' } }) // Too short

    const submitButton = screen.getByRole('button', { name: 'Add Initiative' })
    fireEvent.click(submitButton)

    // Wait for validation errors
    await waitFor(() => {
      expect(
        screen.getByText('Responsible person name must be at least 2 characters')
      ).toBeInTheDocument()
    })

    expect(screen.getByText('Goal must be at least 10 characters')).toBeInTheDocument()
    expect(screen.getByText('Description must be at least 20 characters')).toBeInTheDocument()
  })

  it('submits valid form data', async () => {
    render(<InitiativeForm onCancel={mockOnCancel} onSubmit={mockOnSubmit} />)

    // Fill in valid data
    const responsibleInput = screen.getByLabelText('Responsible Person *')
    fireEvent.change(responsibleInput, { target: { value: 'John Doe' } })

    const goalInput = screen.getByLabelText('Goal *')
    fireEvent.change(goalInput, { target: { value: 'Reduce carbon emissions by 2030' } })

    const descriptionInput = screen.getByLabelText('Description *')
    fireEvent.change(descriptionInput, {
      target: {
        value: 'Implement comprehensive carbon reduction strategies across all operations',
      },
    })

    const submitButton = screen.getByRole('button', { name: 'Add Initiative' })
    fireEvent.click(submitButton)

    // Wait for submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        responsiblePerson: 'John Doe',
        goal: 'Reduce carbon emissions by 2030',
        description: 'Implement comprehensive carbon reduction strategies across all operations',
      })
    })
  })
})
