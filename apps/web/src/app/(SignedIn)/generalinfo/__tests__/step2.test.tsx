/**
 * Story 4.1.12: GeneralInfo Step 2 Tests
 * TDD RED Phase - All tests written before implementation
 * These tests SHOULD fail initially as Step 2 implementation doesn't exist yet
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

describe('Story 4.1.12: GeneralInfo Step 2 Implementation', () => {
  describe('🔴 RED Phase: Step 2 Field Rendering Tests', () => {
    test('renders Step 2 after completing Step 1', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Fill Step 1 required fields first
      await user.type(screen.getByLabelText(/company name/i), 'Test Company')
      await user.type(screen.getByLabelText(/organization number/i), '12-34567890')
      // ... fill other required Step 1 fields
      
      // Click Next to go to Step 2
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Should display Step 2 title
      expect(screen.getByText('Step 2: Strategy & Governance')).toBeInTheDocument()
    })

    test('renders all required Step 2 fields', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Navigate to Step 2 (after completing Step 1)
      // TODO: Helper function for Step 1 completion
      
      // Step 2 fields should be present
      expect(screen.getByLabelText(/sustainability strategy/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/business model/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/report type/i)).toBeInTheDocument()
    })

    test('renders subsidiaries section when consolidated report is selected', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Navigate to Step 2
      // TODO: Helper function for navigation
      
      // Select consolidated report
      const consolidatedRadio = screen.getByLabelText(/consolidated/i)
      await user.click(consolidatedRadio)
      
      // Subsidiaries section should appear
      expect(screen.getByText(/subsidiaries/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /add subsidiary/i })).toBeInTheDocument()
    })

    test('hides subsidiaries section when individual report is selected', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Navigate to Step 2 with consolidated pre-selected
      // TODO: Helper function
      
      // Switch to individual report
      const individualRadio = screen.getByLabelText(/individual/i)
      await user.click(individualRadio)
      
      // Subsidiaries section should be hidden
      expect(screen.queryByText(/subsidiaries/i)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /add subsidiary/i })).not.toBeInTheDocument()
    })
  })

  describe('🔴 RED Phase: Step 2 Validation Tests', () => {
    test('validates sustainability strategy field (min 10 chars)', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Navigate to Step 2
      // TODO: Helper function
      
      const strategyField = screen.getByLabelText(/sustainability strategy/i)
      const nextButton = screen.getByRole('button', { name: /next/i })
      
      // Too short
      await user.type(strategyField, 'Short')
      await user.click(nextButton)
      
      await waitFor(() => {
        expect(screen.getByText(/must be at least 10 characters/i)).toBeInTheDocument()
      })
    })

    test('validates business model field (min 50 chars)', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Navigate to Step 2
      const businessModelField = screen.getByLabelText(/business model/i)
      const nextButton = screen.getByRole('button', { name: /next/i })
      
      // Too short
      await user.type(businessModelField, 'Short model')
      await user.click(nextButton)
      
      await waitFor(() => {
        expect(screen.getByText(/must be at least 50 characters/i)).toBeInTheDocument()
      })
    })

    test('validates subsidiary fields when consolidated is selected', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Navigate to Step 2 and select consolidated
      const consolidatedRadio = screen.getByLabelText(/consolidated/i)
      await user.click(consolidatedRadio)
      
      // Add a subsidiary
      const addButton = screen.getByRole('button', { name: /add subsidiary/i })
      await user.click(addButton)
      
      // Try to proceed without filling subsidiary fields
      const nextButton = screen.getRole('button', { name: /next/i })
      await user.click(nextButton)
      
      await waitFor(() => {
        expect(screen.getByText(/subsidiary name is required/i)).toBeInTheDocument()
        expect(screen.getByText(/organization number is required/i)).toBeInTheDocument()
        expect(screen.getByText(/address is required/i)).toBeInTheDocument()
      })
    })
  })

  describe('🔴 RED Phase: Multi-Step Navigation Tests', () => {
    test('shows progress indicator for 2 steps', () => {
      render(<GeneralInfoPage />)
      
      // Should show step progress
      expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument()
    })

    test('enables Next button only after Step 1 validation passes', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      
      // Next should be disabled initially
      expect(nextButton).toBeDisabled()
      
      // Fill all required Step 1 fields
      // TODO: Helper function for complete Step 1 data
      
      // Next should be enabled
      expect(nextButton).toBeEnabled()
    })

    test('navigates back from Step 2 to Step 1 preserving data', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Complete Step 1 and go to Step 2
      // TODO: Helper function
      
      // Fill Step 2 data
      await user.type(screen.getByLabelText(/sustainability strategy/i), 'Test strategy content here')
      
      // Go back to Step 1
      const backButton = screen.getByRole('button', { name: /previous/i })
      await user.click(backButton)
      
      // Should be on Step 1
      expect(screen.getByText('Step 1: Company Information')).toBeInTheDocument()
      
      // Step 1 data should be preserved
      expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument()
      
      // Go forward again to Step 2
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Step 2 data should be preserved
      expect(screen.getByDisplayValue('Test strategy content here')).toBeInTheDocument()
    })

    test('prevents navigation to Step 2 with invalid Step 1 data', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Fill some but not all required Step 1 fields
      await user.type(screen.getByLabelText(/company name/i), 'T') // Too short
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Should remain on Step 1
      expect(screen.getByText('Step 1: Company Information')).toBeInTheDocument()
      expect(screen.queryByText('Step 2: Strategy & Governance')).not.toBeInTheDocument()
      
      // Should show validation errors
      expect(screen.getByText(/must be at least 2 characters/i)).toBeInTheDocument()
    })
  })

  describe('🔴 RED Phase: Data Persistence Tests', () => {
    test('saves multi-step data to localStorage with correct key', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Fill Step 1 and navigate to Step 2
      // TODO: Helper function
      
      // Fill Step 2 data
      await user.type(screen.getByLabelText(/sustainability strategy/i), 'Test strategy')
      
      // Check localStorage was called with correct key
      // Note: localStorage is mocked in test setup
      const setItemCalls = vi.mocked(localStorage.setItem).mock.calls
      expect(setItemCalls.some(call => call[0] === 'form-general-info')).toBe(true)
    })

    test('restores multi-step data on page reload', async () => {
      // Mock localStorage with existing data
      const mockData = {
        data: {
          companyName: 'Saved Company',
          sustainabilityStrategy: 'Saved strategy'
        },
        currentStep: 1, // Step 2 (0-indexed)
        timestamp: Date.now()
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockData))
      
      render(<GeneralInfoPage />)
      
      // Should restore to Step 2 with saved data
      expect(screen.getByText('Step 2: Strategy & Governance')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Saved strategy')).toBeInTheDocument()
      
      // Should be able to navigate back and see Step 1 data
      const backButton = screen.getByRole('button', { name: /previous/i })
      await userEvent.setup().click(backButton)
      
      expect(screen.getByDisplayValue('Saved Company')).toBeInTheDocument()
    })

    test('saves data automatically when navigating between steps', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Fill Step 1
      await user.type(screen.getByLabelText(/company name/i), 'Test Company')
      
      // Navigate to Step 2
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // localStorage should have been updated
      expect(localStorage.setItem).toHaveBeenCalled()
    })
  })

  describe('🔴 RED Phase: Form Submission Tests', () => {
    test('submits complete multi-step form data', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Complete Step 1 and Step 2
      // TODO: Helper function for complete form
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)
      
      // Should show success message
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('submitted successfully'))
      })
    })

    test('prevents submission with incomplete Step 2 data', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Complete Step 1, navigate to Step 2, but leave Step 2 incomplete
      // TODO: Helper function
      
      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)
      
      // Should show validation errors
      expect(screen.getByText(/please complete all required fields/i)).toBeInTheDocument()
    })
  })

  describe('🔴 RED Phase: Field Array Tests (Subsidiaries)', () => {
    test('adds subsidiary items correctly', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Navigate to Step 2 and select consolidated
      // TODO: Helper function
      
      const consolidatedRadio = screen.getByLabelText(/consolidated/i)
      await user.click(consolidatedRadio)
      
      // Add first subsidiary
      const addButton = screen.getByRole('button', { name: /add subsidiary/i })
      await user.click(addButton)
      
      // Should show subsidiary form fields
      expect(screen.getByLabelText(/subsidiary name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/subsidiary organization number/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/subsidiary address/i)).toBeInTheDocument()
      
      // Add second subsidiary
      await user.click(addButton)
      
      // Should show two sets of subsidiary fields
      expect(screen.getAllByLabelText(/subsidiary name/i)).toHaveLength(2)
    })

    test('removes subsidiary items correctly', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Navigate to Step 2, select consolidated, add subsidiaries
      // TODO: Helper function
      
      // Add two subsidiaries
      const addButton = screen.getByRole('button', { name: /add subsidiary/i })
      await user.click(addButton)
      await user.click(addButton)
      
      expect(screen.getAllByLabelText(/subsidiary name/i)).toHaveLength(2)
      
      // Remove first subsidiary
      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      await user.click(removeButtons[0])
      
      // Should have only one subsidiary left
      expect(screen.getAllByLabelText(/subsidiary name/i)).toHaveLength(1)
    })

    test('respects maximum subsidiary limit', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Navigate to Step 2, select consolidated
      // TODO: Helper function
      
      // Add maximum number of subsidiaries (5)
      const addButton = screen.getByRole('button', { name: /add subsidiary/i })
      for (let i = 0; i < 5; i++) {
        await user.click(addButton)
      }
      
      // Add button should be disabled
      expect(addButton).toBeDisabled()
      
      // Should show max items message
      expect(screen.getByText(/maximum.*subsidiaries/i)).toBeInTheDocument()
    })
  })
})

// Helper functions to be implemented
async function fillStep1RequiredFields(user: any) {
  await user.type(screen.getByLabelText(/company name/i), 'Test Company')
  await user.type(screen.getByLabelText(/organization number/i), '12-34567890')
  await user.selectOptions(screen.getByLabelText(/country/i), 'norway')
  await user.type(screen.getByLabelText(/nace code/i), '12.34')
  await user.selectOptions(screen.getByLabelText(/industry/i), 'technology')
  await user.type(screen.getByLabelText(/revenue/i), '1000000')
  await user.type(screen.getByLabelText(/balance sheet/i), '500000')
  await user.type(screen.getByLabelText(/employees/i), '50')
  await user.type(screen.getByLabelText(/contact person name/i), 'John Doe')
  await user.type(screen.getByLabelText(/contact person email/i), 'john@test.com')
}

async function navigateToStep2(user: any) {
  await fillStep1RequiredFields(user)
  const nextButton = screen.getByRole('button', { name: /next/i })
  await user.click(nextButton)
}