/**
 * Story 4.1.11: GeneralInfo Step 1 Tests
 * TDD RED Phase - All tests written before implementation
 * These tests SHOULD fail initially as implementation doesn't exist yet
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import GeneralInfoPage from '../page'

// Setup and teardown
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
  // Mock window.alert
  global.alert = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Story 4.1.11: GeneralInfo Step 1 Implementation', () => {
  describe('🔴 RED Phase: Field Rendering Tests', () => {
    test('renders MultiStepForm with Step 1 title', () => {
      render(<GeneralInfoPage />)
      
      // Should display the step title
      expect(screen.getByText('Step 1: Company Information')).toBeInTheDocument()
    })

    test('renders all 10 required fields', () => {
      render(<GeneralInfoPage />)
      
      // All 10 fields should be present with their labels
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/organization number/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nace code/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/industry/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/revenue/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/balance sheet value/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/number of employees/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/contact person name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/contact person email/i)).toBeInTheDocument()
    })

    test('displays required field indicators', () => {
      render(<GeneralInfoPage />)
      
      // Check for required indicators (CSS class that adds asterisk)
      const companyNameLabel = screen.getByText(/company name/i).closest('label')
      expect(companyNameLabel).toHaveClass('after:content-[\'*\']')
    })

    test('renders correct field types', () => {
      render(<GeneralInfoPage />)
      
      // Text fields
      const companyNameField = screen.getByLabelText(/company name/i)
      expect(companyNameField).toHaveAttribute('type', 'text')
      
      // Number fields
      const revenueField = screen.getByLabelText(/revenue/i)
      expect(revenueField).toHaveAttribute('type', 'number')
      
      // Email field
      const emailField = screen.getByLabelText(/contact person email/i)
      expect(emailField).toHaveAttribute('type', 'email')
      
      // Select fields should have role="combobox"
      const countryField = screen.getByLabelText(/country/i)
      expect(countryField).toHaveAttribute('role', 'combobox')
      
      const industryField = screen.getByLabelText(/industry/i)
      expect(industryField).toHaveAttribute('role', 'combobox')
    })

    test('displays correct placeholder text', () => {
      render(<GeneralInfoPage />)
      
      // Organization number should have format placeholder
      const orgNumberField = screen.getByLabelText(/organization number/i)
      expect(orgNumberField).toHaveAttribute('placeholder', 'XX-XXXXXXXX')
      
      // NACE code should have format placeholder
      const naceField = screen.getByLabelText(/nace code/i)
      expect(naceField).toHaveAttribute('placeholder', 'XX.XX')
    })
  })

  describe('🔴 RED Phase: Navigation Tests', () => {
    test('does not show "Next" button for single step', () => {
      render(<GeneralInfoPage />)
      
      // Next button should not be present
      expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
    })

    test('shows "Save Draft" button', () => {
      render(<GeneralInfoPage />)
      
      expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument()
    })

    test('shows "Complete Step 1" button', () => {
      render(<GeneralInfoPage />)
      
      expect(screen.getByRole('button', { name: /complete step 1/i })).toBeInTheDocument()
    })

    test('does not show "Previous" button on first step', () => {
      render(<GeneralInfoPage />)
      
      expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument()
    })
  })

  describe('🔴 RED Phase: Field Validation Tests', () => {
    test('validates company name (min 2 chars, max 100)', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const companyNameField = screen.getByLabelText(/company name/i)
      const completeButton = screen.getByRole('button', { name: /complete step 1/i })
      
      // Too short
      await user.type(companyNameField, 'A')
      await user.click(completeButton)
      
      await waitFor(() => {
        expect(screen.getByText(/must be at least 2 characters/i)).toBeInTheDocument()
      })
      
      // Valid length
      await user.clear(companyNameField)
      await user.type(companyNameField, 'Valid Company Name')
      
      await waitFor(() => {
        expect(screen.queryByText(/must be at least 2 characters/i)).not.toBeInTheDocument()
      })
    })

    test('validates organization number format (XX-XXXXXXXX)', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const orgNumberField = screen.getByLabelText(/organization number/i)
      
      // Invalid format
      await user.type(orgNumberField, '123456789')
      await user.tab() // Trigger validation
      
      await waitFor(() => {
        expect(screen.getByText(/invalid format/i)).toBeInTheDocument()
      })
      
      // Valid format
      await user.clear(orgNumberField)
      await user.type(orgNumberField, '12-34567890')
      
      await waitFor(() => {
        expect(screen.queryByText(/invalid format/i)).not.toBeInTheDocument()
      })
    })

    test('validates NACE code format (XX.XX)', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const naceField = screen.getByLabelText(/nace code/i)
      
      // Invalid format
      await user.type(naceField, '1234')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/invalid nace code format/i)).toBeInTheDocument()
      })
      
      // Valid format
      await user.clear(naceField)
      await user.type(naceField, '12.34')
      
      await waitFor(() => {
        expect(screen.queryByText(/invalid nace code format/i)).not.toBeInTheDocument()
      })
    })

    test('validates email format', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const emailField = screen.getByLabelText(/contact person email/i)
      
      // Invalid email
      await user.type(emailField, 'notanemail')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
      })
      
      // Valid email
      await user.clear(emailField)
      await user.type(emailField, 'john.doe@example.com')
      
      await waitFor(() => {
        expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument()
      })
    })

    test('validates number fields (revenue, balance sheet, employees)', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const revenueField = screen.getByLabelText(/revenue/i)
      const employeesField = screen.getByLabelText(/number of employees/i)
      
      // Negative number should be invalid
      await user.type(revenueField, '-100')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/must be positive/i)).toBeInTheDocument()
      })
      
      // Zero employees should be invalid (min 1)
      await user.type(employeesField, '0')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/at least 1/i)).toBeInTheDocument()
      })
    })

    test('validates required fields on submission', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const completeButton = screen.getByRole('button', { name: /complete step 1/i })
      
      // Try to submit without filling required fields
      await user.click(completeButton)
      
      await waitFor(() => {
        // Should show multiple required field errors
        const errors = screen.getAllByText(/required/i)
        expect(errors).toHaveLength(10) // All 10 fields are required
      })
    })

    test('validates select field selections', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const countryField = screen.getByLabelText(/country/i)
      const industryField = screen.getByLabelText(/industry/i)
      
      // Open country dropdown and select an option
      await user.click(countryField)
      await user.click(screen.getByRole('option', { name: /norway/i }))
      
      // Open industry dropdown and select an option
      await user.click(industryField)
      await user.click(screen.getByRole('option', { name: /technology/i }))
      
      // Verify selections
      expect(countryField).toHaveTextContent('Norway')
      expect(industryField).toHaveTextContent('Technology')
    })
  })

  describe('🔴 RED Phase: localStorage Persistence Tests', () => {
    test('saves form data to localStorage with correct key', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const companyNameField = screen.getByLabelText(/company name/i)
      
      // Type in a field
      await user.type(companyNameField, 'Test Company')
      
      // Wait for debounced save (500ms as per MultiStepForm implementation)
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'form-general-info-step1',
          expect.stringContaining('Test Company')
        )
      }, { timeout: 1000 })
    })

    test('restores saved data on page reload', () => {
      // Mock saved data
      const savedData = {
        data: {
          companyName: 'Saved Company',
          organizationNumber: '12-34567890',
          country: 'Norway',
          naceCode: '62.01',
          industry: 'Technology',
          revenue: 1000000,
          balanceSheetValue: 500000,
          numberOfEmployees: 50,
          contactPersonName: 'John Doe',
          contactPersonEmail: 'john@example.com',
        },
        currentStep: 0,
        timestamp: Date.now(),
      }
      
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(savedData))
      
      render(<GeneralInfoPage />)
      
      // All fields should be populated with saved values
      expect(screen.getByLabelText(/company name/i)).toHaveValue('Saved Company')
      expect(screen.getByLabelText(/organization number/i)).toHaveValue('12-34567890')
      expect(screen.getByLabelText(/country/i)).toHaveTextContent('Norway')
      expect(screen.getByLabelText(/nace code/i)).toHaveValue('62.01')
      expect(screen.getByLabelText(/industry/i)).toHaveTextContent('Technology')
      expect(screen.getByLabelText(/revenue/i)).toHaveValue(1000000)
      expect(screen.getByLabelText(/balance sheet value/i)).toHaveValue(500000)
      expect(screen.getByLabelText(/number of employees/i)).toHaveValue(50)
      expect(screen.getByLabelText(/contact person name/i)).toHaveValue('John Doe')
      expect(screen.getByLabelText(/contact person email/i)).toHaveValue('john@example.com')
    })

    test('saves draft when "Save Draft" button is clicked', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const companyNameField = screen.getByLabelText(/company name/i)
      const saveDraftButton = screen.getByRole('button', { name: /save draft/i })
      
      // Fill in some data
      await user.type(companyNameField, 'Draft Company')
      
      // Click save draft
      await user.click(saveDraftButton)
      
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'form-general-info-step1',
          expect.stringContaining('Draft Company')
        )
      })
    })

    test('clears localStorage after successful submission', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Fill all required fields with valid data
      await user.type(screen.getByLabelText(/company name/i), 'Valid Company')
      await user.type(screen.getByLabelText(/organization number/i), '12-34567890')
      
      // Select country
      const countryField = screen.getByLabelText(/country/i)
      await user.click(countryField)
      await user.click(screen.getByRole('option', { name: /norway/i }))
      
      await user.type(screen.getByLabelText(/nace code/i), '62.01')
      
      // Select industry
      const industryField = screen.getByLabelText(/industry/i)
      await user.click(industryField)
      await user.click(screen.getByRole('option', { name: /technology/i }))
      
      await user.type(screen.getByLabelText(/revenue/i), '1000000')
      await user.type(screen.getByLabelText(/balance sheet value/i), '500000')
      await user.type(screen.getByLabelText(/number of employees/i), '50')
      await user.type(screen.getByLabelText(/contact person name/i), 'John Doe')
      await user.type(screen.getByLabelText(/contact person email/i), 'john@example.com')
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /complete step 1/i }))
      
      await waitFor(() => {
        expect(localStorage.removeItem).toHaveBeenCalledWith('form-general-info-step1')
      })
    })
  })

  describe('🔴 RED Phase: Form Submission Tests', () => {
    test('prevents submission with incomplete data', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Fill only partial data
      await user.type(screen.getByLabelText(/company name/i), 'Partial Company')
      // Leave other required fields empty
      
      const completeButton = screen.getByRole('button', { name: /complete step 1/i })
      await user.click(completeButton)
      
      // Form should not submit and should show validation errors
      await waitFor(() => {
        const errors = screen.getAllByText(/required/i)
        expect(errors.length).toBeGreaterThan(0)
      })
    })

    test('allows submission with all valid data', async () => {
      const user = userEvent.setup()
      
      render(<GeneralInfoPage />)
      
      // Fill all required fields with valid data
      await user.type(screen.getByLabelText(/company name/i), 'Complete Company')
      await user.type(screen.getByLabelText(/organization number/i), '12-34567890')
      
      const countryField = screen.getByLabelText(/country/i)
      await user.click(countryField)
      await user.click(screen.getByRole('option', { name: /norway/i }))
      
      await user.type(screen.getByLabelText(/nace code/i), '62.01')
      
      const industryField = screen.getByLabelText(/industry/i)
      await user.click(industryField)
      await user.click(screen.getByRole('option', { name: /technology/i }))
      
      await user.type(screen.getByLabelText(/revenue/i), '1000000')
      await user.type(screen.getByLabelText(/balance sheet value/i), '500000')
      await user.type(screen.getByLabelText(/number of employees/i), '50')
      await user.type(screen.getByLabelText(/contact person name/i), 'John Doe')
      await user.type(screen.getByLabelText(/contact person email/i), 'john@example.com')
      
      // Submit the form
      const completeButton = screen.getByRole('button', { name: /complete step 1/i })
      await user.click(completeButton)
      
      // Form should submit without errors
      await waitFor(() => {
        expect(screen.queryByText(/required/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('🔴 RED Phase: Edge Cases and Special Characters', () => {
    test('handles special characters in text fields', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const companyNameField = screen.getByLabelText(/company name/i)
      const specialName = 'Company & Co. "Special" <Test>'
      
      await user.type(companyNameField, specialName)
      
      expect(companyNameField).toHaveValue(specialName)
    })

    test('handles large numbers correctly', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const revenueField = screen.getByLabelText(/revenue/i)
      const largeNumber = '999999999999'
      
      await user.type(revenueField, largeNumber)
      
      expect(revenueField).toHaveValue(999999999999)
    })

    test('handles decimal values in number fields appropriately', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const revenueField = screen.getByLabelText(/revenue/i)
      await user.type(revenueField, '1000.50')
      
      // Revenue should accept decimals
      expect(revenueField).toHaveValue(1000.50)
      
      const employeesField = screen.getByLabelText(/number of employees/i)
      await user.type(employeesField, '50.5')
      
      // Employees should be integer only
      await user.tab()
      await waitFor(() => {
        expect(screen.getByText(/must be a whole number/i)).toBeInTheDocument()
      })
    })
  })

  describe('🔴 RED Phase: Accessibility Tests', () => {
    test('has proper ARIA labels for all fields', () => {
      render(<GeneralInfoPage />)
      
      // All fields should have accessible labels
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/organization number/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/nace code/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/industry/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/revenue/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/balance sheet value/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/number of employees/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/contact person name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/contact person email/i)).toBeInTheDocument()
    })

    test('shows error messages associated with fields', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const companyNameField = screen.getByLabelText(/company name/i)
      
      // Trigger validation error
      await user.type(companyNameField, 'A')
      await user.tab()
      
      await waitFor(() => {
        const error = screen.getByText(/must be at least 2 characters/i)
        expect(error).toBeInTheDocument()
        
        // Error should be associated with the field (aria-describedby)
        const fieldId = companyNameField.getAttribute('aria-describedby')
        expect(fieldId).toBeTruthy()
      })
    })

    test('form can be navigated with keyboard only', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Tab through all fields
      await user.tab() // Focus first field
      expect(screen.getByLabelText(/company name/i)).toHaveFocus()
      
      await user.tab() // Move to next field
      expect(screen.getByLabelText(/organization number/i)).toHaveFocus()
      
      // Continue tabbing through remaining fields...
      // This ensures keyboard navigation works
    })
  })

  describe('🔴 RED Phase: Select Field Options Tests', () => {
    test('country select has all required options', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const countryField = screen.getByLabelText(/country/i)
      await user.click(countryField)
      
      // Check for all country options
      const expectedCountries = [
        'Norway', 'Sweden', 'Denmark', 'Finland', 'Iceland',
        'Germany', 'United Kingdom', 'Netherlands', 'France', 'Other'
      ]
      
      for (const country of expectedCountries) {
        expect(screen.getByRole('option', { name: country })).toBeInTheDocument()
      }
    })

    test('industry select has all required options', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const industryField = screen.getByLabelText(/industry/i)
      await user.click(industryField)
      
      // Check for all industry options
      const expectedIndustries = [
        'Manufacturing', 'Services', 'Retail', 'Technology', 'Healthcare',
        'Finance', 'Construction', 'Transportation', 'Energy', 'Agriculture', 'Other'
      ]
      
      for (const industry of expectedIndustries) {
        expect(screen.getByRole('option', { name: industry })).toBeInTheDocument()
      }
    })
  })
})
