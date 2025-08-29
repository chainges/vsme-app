import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InitiativeManager } from '../InitiativeManager'

// Mock data
const mockInitiatives = [
  {
    type: 'Workforce Development',
    responsiblePerson: 'John Doe',
    goal: 'Improve employee skills',
    description: 'Training programs for all employees',
    isSelected: true,
  },
  {
    type: 'Biodiversity',
    responsiblePerson: 'Jane Smith',
    goal: 'Protect local ecosystems',
    description: 'Conservation efforts in our area',
    isSelected: true,
  },
]

const mockOnChange = vi.fn()

describe('InitiativeManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders initiatives table', () => {
    render(<InitiativeManager initiatives={mockInitiatives} onChange={mockOnChange} />)

    expect(screen.getByText('Workforce Development')).toBeInTheDocument()
    expect(screen.getByText('Biodiversity')).toBeInTheDocument()
  })

  it('shows add form when add button is clicked', () => {
    render(<InitiativeManager initiatives={mockInitiatives} onChange={mockOnChange} />)

    // Click add button for an unselected initiative
    const addButton = screen.getByRole('button', { name: /Add Climate Change/ })
    fireEvent.click(addButton)

    expect(screen.getByText('Add New Initiative')).toBeInTheDocument()
    expect(screen.getByLabelText('Initiative Type')).toHaveValue('Climate Change')
  })

  it('shows edit form when edit button is clicked', () => {
    render(<InitiativeManager initiatives={mockInitiatives} onChange={mockOnChange} />)

    // Click edit button for a selected initiative
    const editButton = screen.getByRole('button', { name: /Edit Workforce Development/ })
    fireEvent.click(editButton)

    expect(screen.getByText('Edit Workforce Development')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
  })

  it('calls onChange when initiative is added', async () => {
    render(<InitiativeManager initiatives={[]} onChange={mockOnChange} />)

    // Click add button
    const addButton = screen.getByRole('button', { name: /Add Workforce Development/ })
    fireEvent.click(addButton)

    // Fill in form
    const responsibleInput = screen.getByLabelText('Responsible Person *')
    fireEvent.change(responsibleInput, { target: { value: 'John Doe' } })

    const goalInput = screen.getByLabelText('Goal *')
    fireEvent.change(goalInput, { target: { value: 'Improve employee skills' } })

    const descriptionInput = screen.getByLabelText('Description *')
    fireEvent.change(descriptionInput, { target: { value: 'Training programs for all employees' } })

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Add Initiative' })
    fireEvent.click(submitButton)

    // Wait for onChange to be called
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        {
          type: 'Workforce Development',
          responsiblePerson: 'John Doe',
          goal: 'Improve employee skills',
          description: 'Training programs for all employees',
          isSelected: true,
        },
      ])
    })
  })

  it('calls onChange when initiative is edited', async () => {
    render(<InitiativeManager initiatives={mockInitiatives} onChange={mockOnChange} />)

    // Click edit button
    const editButton = screen.getByRole('button', { name: /Edit Workforce Development/ })
    fireEvent.click(editButton)

    // Modify form data
    const responsibleInput = screen.getByLabelText('Responsible Person *')
    fireEvent.change(responsibleInput, { target: { value: 'John Smith' } })

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Update Initiative' })
    fireEvent.click(submitButton)

    // Wait for onChange to be called
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        {
          ...mockInitiatives[0],
          responsiblePerson: 'John Smith',
        },
        mockInitiatives[1],
      ])
    })
  })

  it('calls onChange when initiative is deleted', () => {
    render(<InitiativeManager initiatives={mockInitiatives} onChange={mockOnChange} />)

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /Delete Workforce Development/ })
    fireEvent.click(deleteButton)

    expect(mockOnChange).toHaveBeenCalledWith([mockInitiatives[1]])
  })

  it('hides form when cancel is clicked', () => {
    render(<InitiativeManager initiatives={[]} onChange={mockOnChange} />)

    // Click add button
    const addButton = screen.getByRole('button', { name: /Add Workforce Development/ })
    fireEvent.click(addButton)

    // Verify form is shown
    expect(screen.getByText('Add New Initiative')).toBeInTheDocument()

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)

    // Verify form is hidden
    expect(screen.queryByText('Add New Initiative')).not.toBeInTheDocument()
  })
})
