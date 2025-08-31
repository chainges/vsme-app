import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ConditionalGroup from '../ConditionalGroup'

describe('ConditionalGroup', () => {
  const mockCondition = {
    field: 'businessModel.hasSubsidiaries',
    operator: 'equals' as const,
    value: true,
  }

  const mockFormData = {
    businessModel: {
      hasSubsidiaries: true,
      subsidiaries: [],
    },
  }

  it('renders children when condition is met', () => {
    render(
      <ConditionalGroup condition={mockCondition} formData={mockFormData}>
        <div data-testid="conditional-content">Conditional Content</div>
      </ConditionalGroup>
    )

    expect(screen.getByTestId('conditional-content')).toBeInTheDocument()
  })

  it('does not render children when condition is not met', () => {
    const formDataWithFalse = {
      businessModel: {
        hasSubsidiaries: false,
        subsidiaries: [],
      },
    }

    render(
      <ConditionalGroup condition={mockCondition} formData={formDataWithFalse}>
        <div data-testid="conditional-content">Conditional Content</div>
      </ConditionalGroup>
    )

    expect(screen.queryByTestId('conditional-content')).not.toBeInTheDocument()
  })

  it('handles nested field paths correctly', () => {
    const nestedCondition = {
      field: 'organization.contact.email',
      operator: 'equals' as const,
      value: 'test@example.com',
    }

    const nestedFormData = {
      organization: {
        contact: {
          email: 'test@example.com',
        },
      },
    }

    render(
      <ConditionalGroup condition={nestedCondition} formData={nestedFormData}>
        <div data-testid="nested-content">Nested Content</div>
      </ConditionalGroup>
    )

    expect(screen.getByTestId('nested-content')).toBeInTheDocument()
  })

  it('evaluates "notEquals" operator correctly', () => {
    const notEqualsCondition = {
      field: 'businessModel.hasSubsidiaries',
      operator: 'notEquals' as const,
      value: true,
    }

    const formDataWithFalse = {
      businessModel: {
        hasSubsidiaries: false,
      },
    }

    render(
      <ConditionalGroup
        condition={notEqualsCondition}
        formData={formDataWithFalse}
      >
        <div data-testid="not-equals-content">Not Equals Content</div>
      </ConditionalGroup>
    )

    expect(screen.getByTestId('not-equals-content')).toBeInTheDocument()
  })

  it('evaluates "contains" operator for arrays correctly', () => {
    const containsCondition = {
      field: 'selectedItems',
      operator: 'contains' as const,
      value: 'item1',
    }

    const formDataWithArray = {
      selectedItems: ['item1', 'item2', 'item3'],
    }

    render(
      <ConditionalGroup
        condition={containsCondition}
        formData={formDataWithArray}
      >
        <div data-testid="contains-content">Contains Content</div>
      </ConditionalGroup>
    )

    expect(screen.getByTestId('contains-content')).toBeInTheDocument()
  })

  it('evaluates "contains" operator for strings correctly', () => {
    const containsCondition = {
      field: 'description',
      operator: 'contains' as const,
      value: 'sustainability',
    }

    const formDataWithString = {
      description: 'This is about sustainability initiatives',
    }

    render(
      <ConditionalGroup
        condition={containsCondition}
        formData={formDataWithString}
      >
        <div data-testid="string-contains-content">String Contains Content</div>
      </ConditionalGroup>
    )

    expect(screen.getByTestId('string-contains-content')).toBeInTheDocument()
  })

  it('evaluates "greaterThan" operator correctly', () => {
    const greaterThanCondition = {
      field: 'employeeCount',
      operator: 'greaterThan' as const,
      value: 50,
    }

    const formDataWithNumber = {
      employeeCount: 100,
    }

    render(
      <ConditionalGroup
        condition={greaterThanCondition}
        formData={formDataWithNumber}
      >
        <div data-testid="greater-than-content">Greater Than Content</div>
      </ConditionalGroup>
    )

    expect(screen.getByTestId('greater-than-content')).toBeInTheDocument()
  })

  it('evaluates "lessThan" operator correctly', () => {
    const lessThanCondition = {
      field: 'employeeCount',
      operator: 'lessThan' as const,
      value: 50,
    }

    const formDataWithNumber = {
      employeeCount: 25,
    }

    render(
      <ConditionalGroup
        condition={lessThanCondition}
        formData={formDataWithNumber}
      >
        <div data-testid="less-than-content">Less Than Content</div>
      </ConditionalGroup>
    )

    expect(screen.getByTestId('less-than-content')).toBeInTheDocument()
  })

  it('handles invalid form data gracefully', () => {
    render(
      <ConditionalGroup condition={mockCondition} formData={null}>
        <div data-testid="invalid-data-content">Invalid Data Content</div>
      </ConditionalGroup>
    )

    expect(screen.queryByTestId('invalid-data-content')).not.toBeInTheDocument()
  })

  it('handles missing nested fields gracefully', () => {
    const missingFieldCondition = {
      field: 'nonexistent.nested.field',
      operator: 'equals' as const,
      value: true,
    }

    render(
      <ConditionalGroup
        condition={missingFieldCondition}
        formData={mockFormData}
      >
        <div data-testid="missing-field-content">Missing Field Content</div>
      </ConditionalGroup>
    )

    expect(
      screen.queryByTestId('missing-field-content')
    ).not.toBeInTheDocument()
  })

  it('applies custom className correctly', () => {
    const { container } = render(
      <ConditionalGroup
        className="custom-class"
        condition={mockCondition}
        formData={mockFormData}
      >
        <div data-testid="custom-class-content">Custom Class Content</div>
      </ConditionalGroup>
    )

    const conditionalElement = container.querySelector('.custom-class')
    expect(conditionalElement).toBeInTheDocument()
  })

  it('sets proper ARIA attributes', () => {
    render(
      <ConditionalGroup condition={mockCondition} formData={mockFormData}>
        <div data-testid="aria-content">ARIA Content</div>
      </ConditionalGroup>
    )

    const groupElement = screen.getByRole('group')
    expect(groupElement).toBeInTheDocument()
    expect(groupElement).toHaveAttribute('aria-hidden', 'false')
  })

  it('updates visibility when form data changes', async () => {
    const { rerender } = render(
      <ConditionalGroup condition={mockCondition} formData={mockFormData}>
        <div data-testid="dynamic-content">Dynamic Content</div>
      </ConditionalGroup>
    )

    // Initially visible
    expect(screen.getByTestId('dynamic-content')).toBeInTheDocument()

    // Change form data to make condition false
    const updatedFormData = {
      businessModel: {
        hasSubsidiaries: false,
        subsidiaries: [],
      },
    }

    rerender(
      <ConditionalGroup condition={mockCondition} formData={updatedFormData}>
        <div data-testid="dynamic-content">Dynamic Content</div>
      </ConditionalGroup>
    )

    // Should no longer be visible - use direct check since element should be immediately removed
    expect(screen.queryByTestId('dynamic-content')).not.toBeInTheDocument()
  })

  it('handles array index conditions correctly', () => {
    const arrayIndexCondition = {
      field: 'sustainability.initiatives.0.selected',
      operator: 'equals' as const,
      value: true,
    }

    const formDataWithArrayIndex = {
      sustainability: {
        initiatives: [
          { selected: true, type: 'ClimateAction' },
          { selected: false, type: 'WasteReduction' },
        ],
      },
    }

    render(
      <ConditionalGroup
        condition={arrayIndexCondition}
        formData={formDataWithArrayIndex}
      >
        <div data-testid="array-index-content">Array Index Content</div>
      </ConditionalGroup>
    )

    expect(screen.getByTestId('array-index-content')).toBeInTheDocument()
  })
})
