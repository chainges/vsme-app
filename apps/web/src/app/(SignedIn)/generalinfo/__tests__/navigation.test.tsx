/**
 * Story 4.1.12: Multi-Step Navigation Tests
 * TDD RED Phase - Testing navigation between steps
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import GeneralInfoPage from '../page'

// Setup and teardown
beforeEach(() => {
  vi.clearAllMocks()
  global.alert = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Story 4.1.12: Multi-Step Navigation', () => {
  describe('🔴 RED Phase: Navigation Controls Tests', () => {
    test('displays correct navigation buttons on Step 1', () => {
      render(<GeneralInfoPage />)
      
      // Step 1 should have Next button but no Previous
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument()
      
      // Should not show Step 1 specific buttons anymore
      expect(screen.queryByRole('button', { name: /save draft/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /complete step 1/i })).not.toBeInTheDocument()
    })

    test('displays correct navigation buttons on Step 2', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Navigate to Step 2
      await fillStep1AndNavigate(user)
      
      // Step 2 should have both Previous and Submit buttons
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
    })

    test('validates step data before allowing navigation', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Try to navigate without completing Step 1
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Should remain on Step 1 and show validation errors
      expect(screen.getByText('Step 1: Company Information')).toBeInTheDocument()
      expect(screen.queryByText('Step 2: Strategy & Governance')).not.toBeInTheDocument()
    })

    test('enables navigation after validation passes', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Fill all required Step 1 fields
      await fillAllStep1Fields(user)
      
      const nextButton = screen.getByRole('button', { name: /next/i })
      await user.click(nextButton)
      
      // Should navigate to Step 2
      await waitFor(() => {
        expect(screen.getByText('Step 2: Strategy & Governance')).toBeInTheDocument()
      })
    })
  })

  describe('🔴 RED Phase: Progress Indicator Tests', () => {
    test('shows progress indicator with current step', () => {
      render(<GeneralInfoPage />)
      
      // Should show step 1 of 2
      expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument()
      
      // Or check for progress percentage
      expect(screen.getByText(/50%/i)).toBeInTheDocument()
    })

    test('updates progress indicator on Step 2', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      await fillStep1AndNavigate(user)
      
      // Should show step 2 of 2
      expect(screen.getByText(/step 2 of 2/i)).toBeInTheDocument()
      
      // Or check for progress percentage
      expect(screen.getByText(/100%/i)).toBeInTheDocument()
    })

    test('shows step completion status correctly', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Step 1 should show as current
      expect(screen.getByLabelText(/step 1.*current/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/step 2.*upcoming/i)).toBeInTheDocument()
      
      await fillStep1AndNavigate(user)
      
      // After navigation, Step 1 should be complete, Step 2 current
      expect(screen.getByLabelText(/step 1.*complete/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/step 2.*current/i)).toBeInTheDocument()
    })
  })

  describe('🔴 RED Phase: Data Preservation Tests', () => {
    test('preserves Step 1 data when navigating to Step 2', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Fill Step 1 with specific data
      const testData = {
        companyName: 'Test Company Name',
        organizationNumber: '12-34567890',
        revenue: '1500000'
      }
      
      await user.type(screen.getByLabelText(/company name/i), testData.companyName)
      await user.type(screen.getByLabelText(/organization number/i), testData.organizationNumber)
      await user.type(screen.getByLabelText(/revenue/i), testData.revenue)
      // Fill other required fields...
      await fillRemainingStep1Fields(user)
      
      // Navigate to Step 2
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Navigate back to Step 1
      await user.click(screen.getByRole('button', { name: /previous/i }))
      
      // Data should be preserved
      expect(screen.getByDisplayValue(testData.companyName)).toBeInTheDocument()
      expect(screen.getByDisplayValue(testData.organizationNumber)).toBeInTheDocument()
      expect(screen.getByDisplayValue(testData.revenue)).toBeInTheDocument()
    })

    test('preserves Step 2 data when navigating back to Step 1', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      await fillStep1AndNavigate(user)
      
      // Fill Step 2 data
      const step2Data = {
        sustainabilityStrategy: 'Our comprehensive sustainability strategy focuses on reducing environmental impact',
        businessModel: 'We operate a circular business model that prioritizes resource efficiency and waste reduction'
      }
      
      await user.type(screen.getByLabelText(/sustainability strategy/i), step2Data.sustainabilityStrategy)
      await user.type(screen.getByLabelText(/business model/i), step2Data.businessModel)
      
      // Navigate back to Step 1
      await user.click(screen.getByRole('button', { name: /previous/i }))
      
      // Navigate forward again to Step 2
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Step 2 data should be preserved
      expect(screen.getByDisplayValue(step2Data.sustainabilityStrategy)).toBeInTheDocument()
      expect(screen.getByDisplayValue(step2Data.businessModel)).toBeInTheDocument()
    })

    test('saves form state to localStorage on navigation', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      await fillStep1AndNavigate(user)
      
      // localStorage should have been called with multi-step key
      const setItemCalls = vi.mocked(localStorage.setItem).mock.calls
      expect(setItemCalls.some(call => call[0] === 'form-general-info')).toBe(true)
      
      // Check the data structure includes current step
      const savedData = JSON.parse(setItemCalls[setItemCalls.length - 1][1])
      expect(savedData.currentStep).toBe(1) // Step 2 (0-indexed)
    })
  })

  describe('🔴 RED Phase: Form State Management Tests', () => {
    test('maintains form validation state across navigation', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Fill Step 1 with some invalid data
      await user.type(screen.getByLabelText(/company name/i), 'A') // Too short
      
      // Navigate to Step 2 (should fail)
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Should show validation error
      expect(screen.getByText(/must be at least 2 characters/i)).toBeInTheDocument()
      
      // Fix the error
      await user.clear(screen.getByLabelText(/company name/i))
      await user.type(screen.getByLabelText(/company name/i), 'Valid Company Name')
      await fillRemainingStep1Fields(user)
      
      // Now navigation should work
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Step 2: Strategy & Governance')).toBeInTheDocument()
      })
    })

    test('handles partial form completion correctly', async () => {
      const user = userEvent.setup()
      render(<GeneralInfoPage />)
      
      // Fill only some Step 1 fields
      await user.type(screen.getByLabelText(/company name/i), 'Partial Company')
      await user.type(screen.getByLabelText(/organization number/i), '12-34567890')
      
      // Navigate to Step 2 (should fail due to missing required fields)
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Should remain on Step 1
      expect(screen.getByText('Step 1: Company Information')).toBeInTheDocument()
    })

    test('resets form state on new form creation', () => {
      // This test would be for scenarios where user starts a new form
      render(<GeneralInfoPage />)
      
      // Form should start at Step 1
      expect(screen.getByText('Step 1: Company Information')).toBeInTheDocument()
      expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument()
      
      // All fields should be empty
      expect(screen.getByLabelText(/company name/i)).toHaveValue('')
    })
  })
})

// Helper functions
async function fillAllStep1Fields(user: any) {
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

async function fillRemainingStep1Fields(user: any) {
  // Helper to fill remaining required fields that weren't filled in specific tests
  await user.selectOptions(screen.getByLabelText(/country/i), 'norway')
  await user.type(screen.getByLabelText(/nace code/i), '12.34')
  await user.selectOptions(screen.getByLabelText(/industry/i), 'technology')
  await user.type(screen.getByLabelText(/revenue/i), '1000000')
  await user.type(screen.getByLabelText(/balance sheet/i), '500000')
  await user.type(screen.getByLabelText(/employees/i), '50')
  await user.type(screen.getByLabelText(/contact person name/i), 'John Doe')
  await user.type(screen.getByLabelText(/contact person email/i), 'john@test.com')
}

async function fillStep1AndNavigate(user: any) {
  await fillAllStep1Fields(user)
  await user.click(screen.getByRole('button', { name: /next/i }))
  
  await waitFor(() => {
    expect(screen.getByText('Step 2: Strategy & Governance')).toBeInTheDocument()
  })
}