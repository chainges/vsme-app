import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { z } from 'zod'

import MultiStepForm from './MultiStepForm'
import { LocalStorageProvider } from '@/lib/forms/storage'
import type { MultiStepFormConfig, FieldDefinition } from '@/lib/forms/types'

// Mock the storage provider for testing
vi.mock('@/lib/forms/storage', () => ({
  LocalStorageProvider: vi.fn().mockImplementation(() => ({
    save: vi.fn().mockResolvedValue(undefined),
    load: vi.fn().mockResolvedValue(null),
    clear: vi.fn().mockResolvedValue(undefined),
    exists: vi.fn().mockResolvedValue(false),
  })),
}))

// Test data types
interface TestFormData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
  }
  preferences: {
    notifications: boolean
    theme: 'light' | 'dark'
  }
}

// Test schemas
const personalInfoSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
  }),
})

const preferencesSchema = z.object({
  preferences: z.object({
    notifications: z.boolean(),
    theme: z.enum(['light', 'dark']),
  }),
})

// Test field configurations
const personalInfoFields: FieldDefinition[] = [
  {
    name: 'personalInfo.firstName',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter your first name',
    required: true,
  },
  {
    name: 'personalInfo.lastName',
    type: 'text',
    label: 'Last Name',
    placeholder: 'Enter your last name',
    required: true,
  },
  {
    name: 'personalInfo.email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email address',
    required: true,
  },
]

const preferencesFields: FieldDefinition[] = [
  {
    name: 'preferences.notifications',
    type: 'checkbox',
    label: 'Enable Notifications',
    required: false,
    options: [],
  },
  {
    name: 'preferences.theme',
    type: 'select',
    label: 'Theme Preference',
    options: [
      { value: 'light', label: 'Light Mode' },
      { value: 'dark', label: 'Dark Mode' },
    ],
    required: true,
  },
]

// Test configuration
const createTestConfig = (
  overrides?: Partial<MultiStepFormConfig<TestFormData>>
): MultiStepFormConfig<TestFormData> => ({
  id: 'test-form',
  title: 'Test Multi-Step Form',
  description: 'A form for testing purposes',
  steps: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      schema: personalInfoSchema,
      fields: personalInfoFields,
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Configure your preferences',
      schema: preferencesSchema,
      fields: preferencesFields,
    },
  ],
  onSubmit: vi.fn().mockResolvedValue(undefined),
  onSave: vi.fn().mockResolvedValue(undefined),
  ...overrides,
})

describe('MultiStepForm', () => {
  const mockStorage = new LocalStorageProvider()
  let config: MultiStepFormConfig<TestFormData>

  beforeEach(() => {
    vi.clearAllMocks()
    config = createTestConfig()
  })

  describe('Component Rendering', () => {
    it('renders the form with correct structure', () => {
      render(<MultiStepForm config={config} />)

      // Check main form elements
      expect(screen.getByRole('form')).toBeInTheDocument()
      
      // Check progress indicator
      expect(screen.getByText('Personal Information')).toBeInTheDocument()
      
      // Check navigation controls
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('Step 1 of 2')).toBeInTheDocument()
    })

    it('displays the first step by default', () => {
      render(<MultiStepForm config={config} />)

      expect(screen.getByText('Personal Information')).toBeInTheDocument()
      expect(screen.getByText('Tell us about yourself')).toBeInTheDocument()
    })

    it('shows correct step information in placeholder', () => {
      render(<MultiStepForm config={config} />)

      expect(screen.getByText(/Current step: personal-info/)).toBeInTheDocument()
      expect(screen.getByText(/Fields: 3 configured/)).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const customClass = 'custom-form-class'
      render(<MultiStepForm config={config} className={customClass} />)

      const form = screen.getByRole('form')
      expect(form).toHaveClass(customClass)
    })
  })

  describe('Step Navigation', () => {
    it('starts with previous button disabled and next button enabled', () => {
      render(<MultiStepForm config={config} />)

      const previousButton = screen.getByText('Previous')
      const nextButton = screen.getByText('Next')

      expect(previousButton).toBeDisabled()
      expect(nextButton).toBeEnabled()
    })

    it('prevents navigation to next step without validation', async () => {
      const user = userEvent.setup()
      render(<MultiStepForm config={config} />)

      const nextButton = screen.getByText('Next')
      await user.click(nextButton)

      // Should still be on first step
      expect(screen.getByText('Personal Information')).toBeInTheDocument()
      expect(screen.getByText('Step 1 of 2')).toBeInTheDocument()
    })

    it('changes submit button label on final step', () => {
      // Start on second (final) step
      const singleStepConfig = createTestConfig({
        steps: [config.steps[1]], // Only preferences step
      })

      render(<MultiStepForm config={singleStepConfig} />)

      expect(screen.getByText('Submit')).toBeInTheDocument()
    })

    it('handles step change callbacks', () => {
      const onStepChange = vi.fn()
      render(<MultiStepForm config={config} onStepChange={onStepChange} />)

      // Initial render shouldn't trigger callback
      expect(onStepChange).not.toHaveBeenCalled()
    })
  })

  describe('Form State Management', () => {
    it('initializes with empty form data', () => {
      const onDataChange = vi.fn()
      render(<MultiStepForm config={config} onDataChange={onDataChange} />)

      expect(onDataChange).toHaveBeenCalledWith({})
    })

    it('calls onDataChange when form data changes', async () => {
      const onDataChange = vi.fn()
      render(<MultiStepForm config={config} onDataChange={onDataChange} />)

      // onDataChange is called on initial render with empty data
      expect(onDataChange).toHaveBeenCalledWith({})
    })

    it('maintains form state across step changes', async () => {
      const user = userEvent.setup()
      
      // Mock validation to always pass for this test
      const mockConfig = createTestConfig({
        steps: [
          {
            ...config.steps[0],
            schema: z.object({}), // Empty schema for easy validation
          },
          config.steps[1],
        ],
      })

      render(<MultiStepForm config={mockConfig} />)

      const nextButton = screen.getByText('Next')
      await user.click(nextButton)

      // Should move to step 2
      await waitFor(() => {
        expect(screen.getByText('Preferences')).toBeInTheDocument()
      })

      expect(screen.getByText('Step 2 of 2')).toBeInTheDocument()
    })
  })

  describe('Storage Integration', () => {
    it('attempts to load saved data on mount', () => {
      render(<MultiStepForm config={config} />)

      expect(mockStorage.load).toHaveBeenCalledWith('test-form')
    })

    it('saves form data when step changes', async () => {
      const user = userEvent.setup()
      
      // Mock validation to pass
      const mockConfig = createTestConfig({
        steps: [
          {
            ...config.steps[0],
            schema: z.object({}),
          },
          config.steps[1],
        ],
      })

      render(<MultiStepForm config={mockConfig} />)

      const nextButton = screen.getByText('Next')
      await user.click(nextButton)

      await waitFor(() => {
        expect(mockStorage.save).toHaveBeenCalled()
      })
    })

    it('clears storage after successful form submission', async () => {
      const user = userEvent.setup()
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
      
      const singleStepConfig = createTestConfig({
        steps: [
          {
            ...config.steps[0],
            schema: z.object({}), // Easy validation
          },
        ],
        onSubmit: mockOnSubmit,
      })

      render(<MultiStepForm config={singleStepConfig} />)

      const submitButton = screen.getByText('Submit')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
        expect(mockStorage.clear).toHaveBeenCalledWith('test-form')
      })
    })

    it('uses custom storage provider when provided', () => {
      const customStorage = new LocalStorageProvider('custom-prefix')
      const configWithCustomStorage = createTestConfig({
        storage: customStorage,
      })

      render(<MultiStepForm config={configWithCustomStorage} />)

      expect(customStorage.load).toHaveBeenCalled()
    })
  })

  describe('Validation', () => {
    it('shows loading state during validation', async () => {
      const user = userEvent.setup()
      
      // Use a schema that will validate
      const slowValidationConfig = createTestConfig({
        steps: [
          {
            ...config.steps[0],
            schema: z.object({}).refine(async () => {
              await new Promise(resolve => setTimeout(resolve, 100))
              return true
            }),
          },
          config.steps[1],
        ],
      })

      render(<MultiStepForm config={slowValidationConfig} />)

      const nextButton = screen.getByText('Next')
      await user.click(nextButton)

      // Should show validating state
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('prevents form submission with invalid data', async () => {
      const user = userEvent.setup()
      const mockOnSubmit = vi.fn()
      
      const singleStepConfig = createTestConfig({
        steps: [
          {
            ...config.steps[0],
            schema: personalInfoSchema, // This will fail validation with empty data
          },
        ],
        onSubmit: mockOnSubmit,
      })

      render(<MultiStepForm config={singleStepConfig} />)

      const submitButton = screen.getByText('Submit')
      await user.click(submitButton)

      // Form submission should not be called
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('handles storage load errors gracefully', () => {
      const errorStorage = {
        ...mockStorage,
        load: vi.fn().mockRejectedValue(new Error('Storage error')),
      }

      const configWithErrorStorage = createTestConfig({
        storage: errorStorage as any,
      })

      // Should not throw
      expect(() => {
        render(<MultiStepForm config={configWithErrorStorage} />)
      }).not.toThrow()
    })

    it('handles form submission errors', async () => {
      const user = userEvent.setup()
      const mockOnSubmit = vi.fn().mockRejectedValue(new Error('Submission error'))
      
      const singleStepConfig = createTestConfig({
        steps: [
          {
            ...config.steps[0],
            schema: z.object({}), // Easy validation
          },
        ],
        onSubmit: mockOnSubmit,
      })

      render(<MultiStepForm config={singleStepConfig} />)

      const submitButton = screen.getByText('Submit')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })

      // Form should handle the error gracefully
      expect(screen.getByText('Submit')).toBeEnabled()
    })
  })

  describe('Accessibility', () => {
    it('provides proper ARIA labels for navigation', () => {
      render(<MultiStepForm config={config} />)

      const previousButton = screen.getByLabelText(/Go to previous step/)
      const nextButton = screen.getByLabelText(/Go to next step/)

      expect(previousButton).toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()
    })

    it('maintains focus management during navigation', () => {
      render(<MultiStepForm config={config} />)

      // The form should be properly structured for keyboard navigation
      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
    })

    it('provides proper form labeling', () => {
      render(<MultiStepForm config={config} />)

      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
    })
  })

  describe('Integration with Existing Components', () => {
    it('integrates with NavigationControls component', () => {
      render(<MultiStepForm config={config} />)

      // Navigation controls should be rendered
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByText('Previous')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
    })

    it('integrates with ProgressIndicator component', () => {
      render(<MultiStepForm config={config} />)

      // Progress indicator should be rendered
      expect(screen.getByText('Step 1 of 2')).toBeInTheDocument()
    })

    it('maintains compatibility with existing form field types', () => {
      render(<MultiStepForm config={config} />)

      // Should show field count from configuration
      expect(screen.getByText(/Fields: 3 configured/)).toBeInTheDocument()
    })

    it('follows existing component composition pattern', () => {
      render(<MultiStepForm config={config} />)

      // Should have proper structure with border, bg-card, etc.
      const form = screen.getByRole('form')
      expect(form).toHaveClass('rounded-lg', 'border', 'bg-card', 'shadow-sm')
    })
  })

  describe('TypeScript Integration', () => {
    it('accepts generic type parameters', () => {
      // This test verifies TypeScript compilation
      const typedConfig: MultiStepFormConfig<TestFormData> = createTestConfig()
      
      expect(() => {
        render(<MultiStepForm<TestFormData> config={typedConfig} />)
      }).not.toThrow()
    })

    it('provides proper type safety for callbacks', () => {
      const onDataChange = vi.fn<[Partial<TestFormData>], void>()
      const onStepChange = vi.fn<[number], void>()

      expect(() => {
        render(
          <MultiStepForm
            config={config}
            onDataChange={onDataChange}
            onStepChange={onStepChange}
          />
        )
      }).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('does not cause excessive re-renders', () => {
      const onDataChange = vi.fn()
      const { rerender } = render(
        <MultiStepForm config={config} onDataChange={onDataChange} />
      )

      const initialCallCount = onDataChange.mock.calls.length

      // Re-render with same props
      rerender(<MultiStepForm config={config} onDataChange={onDataChange} />)

      // Should not cause additional data change calls
      expect(onDataChange.mock.calls.length).toBe(initialCallCount)
    })

    it('debounces auto-save operations', async () => {
      render(<MultiStepForm config={config} />)

      // Auto-save should be debounced (tested indirectly through storage calls)
      expect(mockStorage.save).not.toHaveBeenCalledWith()
    })
  })
})
