import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InitiativeManager } from '../InitiativeManager'

describe('InitiativeManager Validation', () => {
  const mockOnChange = vi.fn()

  const defaultProps = {
    initiatives: [],
    onChange: mockOnChange,
  }

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('should validate form fields and show error messages', async () => {
    const user = userEvent.setup()
    
    render(<InitiativeManager {...defaultProps} />)
    
    // Click add button for first initiative type
    const addButton = screen.getByRole('button', { name: /add Workforce Development/i })
    await user.click(addButton)
    
    // Try to submit with empty fields
    const submitButton = screen.getByRole('button', { name: /Add Initiative/i })
    await user.click(submitButton)
    
    // Check for validation error messages
    expect(screen.getByText(/Responsible person name must be at least 2 characters/i)).toBeInTheDocument()
    expect(screen.getByText(/Goal must be at least 10 characters/i)).toBeInTheDocument()
    expect(screen.getByText(/Description must be at least 20 characters/i)).toBeInTheDocument()
    
    // Fill in valid data
    const responsibleInput = screen.getByLabelText(/Responsible Person/i)
    await user.type(responsibleInput, 'John Doe')
    
    const goalTextarea = screen.getByLabelText(/Goal/i)
    await user.type(goalTextarea, 'Reduce carbon emissions by 2030')
    
    const descriptionTextarea = screen.getByLabelText(/Description/i)
    await user.type(descriptionTextarea, 'This initiative aims to reduce our carbon footprint through various sustainability measures.')
    
    // Submit again
    await user.click(submitButton)
    
    // Check that validation errors are cleared and data is submitted
    await waitFor(() => {
      expect(screen.queryByText(/Responsible person name must be at least 2 characters/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Goal must be at least 10 characters/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Description must be at least 20 characters/i)).not.toBeInTheDocument()
    })
    
    // Check that onChange was called with correct data
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'Workforce Development',
          responsiblePerson: 'John Doe',
          goal: 'Reduce carbon emissions by 2030',
          description: 'This initiative aims to reduce our carbon footprint through various sustainability measures.',
          isSelected: true
        })
      ])
    })
  })

  it('should update existing initiative correctly', async () => {
    const user = userEvent.setup()
    
    const initialInitiatives = [{
      type: 'Climate Change' as const,
      responsiblePerson: 'Jane Smith',
      goal: 'Achieve net zero emissions',
      description: 'Implement measures to reduce greenhouse gas emissions to net zero by 2040.',
      isSelected: true
    }]
    
    render(<InitiativeManager {...defaultProps} initiatives={initialInitiatives} />)
    
    // Click edit button
    const editButton = screen.getByRole('button', { name: /Edit Climate Change/i })
    await user.click(editButton)
    
    // Update the responsible person
    const responsibleInput = screen.getByLabelText(/Responsible Person/i)
    await user.clear(responsibleInput)
    await user.type(responsibleInput, 'John Updated')
    
    // Submit the update
    const updateButton = screen.getByRole('button', { name: /Update Initiative/i })
    await user.click(updateButton)
    
    // Check that onChange was called with updated data
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'Climate Change',
          responsiblePerson: 'John Updated',
          goal: 'Achieve net zero emissions',
          description: 'Implement measures to reduce greenhouse gas emissions to net zero by 2040.',
          isSelected: true
        })
      ])
    })
  })
})