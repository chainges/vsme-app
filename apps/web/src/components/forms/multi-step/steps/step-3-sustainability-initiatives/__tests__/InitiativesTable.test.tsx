import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InitiativesTable } from '../InitiativesTable'

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

const mockOnAddInitiative = vi.fn()
const mockOnEditInitiative = vi.fn()
const mockOnDeleteInitiative = vi.fn()

describe('InitiativesTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all initiative types', () => {
    render(
      <InitiativesTable
        initiatives={[]}
        onAddInitiative={mockOnAddInitiative}
        onDeleteInitiative={mockOnDeleteInitiative}
        onEditInitiative={mockOnEditInitiative}
      />
    )

    const initiativeTypes = [
      'Workforce Development',
      'Biodiversity',
      'Climate Change',
      'Business Ethics',
      'Circular Economy',
      'Community Impact',
      'Marine Resources',
      'Stakeholder Engagement',
    ]

    initiativeTypes.forEach((type) => {
      expect(screen.getByText(type)).toBeInTheDocument()
    })
  })

  it('shows "-" for unselected initiatives', () => {
    render(
      <InitiativesTable
        initiatives={[]}
        onAddInitiative={mockOnAddInitiative}
        onDeleteInitiative={mockOnDeleteInitiative}
        onEditInitiative={mockOnEditInitiative}
      />
    )

    // Check that unselected initiatives show "-"
    const responsibleCells = screen.getAllByText('-')
    expect(responsibleCells.length).toBe(8)
  })

  it('shows responsible person for selected initiatives', () => {
    render(
      <InitiativesTable
        initiatives={mockInitiatives}
        onAddInitiative={mockOnAddInitiative}
        onDeleteInitiative={mockOnDeleteInitiative}
        onEditInitiative={mockOnEditInitiative}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows add buttons for unselected initiatives', () => {
    render(
      <InitiativesTable
        initiatives={mockInitiatives.slice(0, 1)} // Only first initiative selected
        onAddInitiative={mockOnAddInitiative}
        onDeleteInitiative={mockOnDeleteInitiative}
        onEditInitiative={mockOnEditInitiative}
      />
    )

    // Should have 7 add buttons (8 total - 1 selected)
    const addButtons = screen.getAllByRole('button', { name: /Add/ })
    expect(addButtons.length).toBe(7)
  })

  it('shows edit and delete buttons for selected initiatives', () => {
    render(
      <InitiativesTable
        initiatives={mockInitiatives.slice(0, 1)} // Only first initiative selected
        onAddInitiative={mockOnAddInitiative}
        onDeleteInitiative={mockOnDeleteInitiative}
        onEditInitiative={mockOnEditInitiative}
      />
    )

    // Should have 1 edit button and 1 delete button
    const editButtons = screen.getAllByRole('button', { name: /Edit Workforce Development/ })
    const deleteButtons = screen.getAllByRole('button', { name: /Delete Workforce Development/ })
    expect(editButtons.length).toBe(1)
    expect(deleteButtons.length).toBe(1)
  })

  it('calls onAddInitiative when add button is clicked', () => {
    render(
      <InitiativesTable
        initiatives={[]}
        onAddInitiative={mockOnAddInitiative}
        onDeleteInitiative={mockOnDeleteInitiative}
        onEditInitiative={mockOnEditInitiative}
      />
    )

    const addButton = screen.getByRole('button', { name: /Add Climate Change/ })
    fireEvent.click(addButton)

    expect(mockOnAddInitiative).toHaveBeenCalledWith('Climate Change')
  })

  it('calls onEditInitiative when edit button is clicked', () => {
    render(
      <InitiativesTable
        initiatives={mockInitiatives.slice(0, 1)}
        onAddInitiative={mockOnAddInitiative}
        onDeleteInitiative={mockOnDeleteInitiative}
        onEditInitiative={mockOnEditInitiative}
      />
    )

    const editButton = screen.getAllByRole('button', { name: /Edit Workforce Development/ })[0]
    fireEvent.click(editButton)

    expect(mockOnEditInitiative).toHaveBeenCalledWith(0)
  })

  it('calls onDeleteInitiative when delete button is clicked', () => {
    render(
      <InitiativesTable
        initiatives={mockInitiatives.slice(0, 1)}
        onAddInitiative={mockOnAddInitiative}
        onDeleteInitiative={mockOnDeleteInitiative}
        onEditInitiative={mockOnEditInitiative}
      />
    )

    const deleteButton = screen.getAllByRole('button', { name: /Delete Workforce Development/ })[0]
    fireEvent.click(deleteButton)

    expect(mockOnDeleteInitiative).toHaveBeenCalledWith(0)
  })
})