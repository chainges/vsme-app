/**
 * Formity Integration Tests (TDD Red Phase)
 * 
 * This test file implements TDD methodology for evaluating Formity's
 * integration with our existing TanStack Forms implementation.
 * 
 * Test Coverage:
 * 1. Basic Formity initialization with JSON schema
 * 2. TanStack Forms backend compatibility 
 * 3. Multi-step form navigation
 * 4. Field rendering with shadcn/ui components
 * 5. State persistence between steps
 * 6. Validation integration
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { FormityTanStackIntegration } from '../FormityTanStackIntegration'
import { FormityTestForm } from '../FormityTestForm'
import type { FormityConfig } from '../types'

// Mock localStorage for state persistence tests
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
})

describe('Formity Integration (TDD)', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockLocalStorage.clear()
    vi.clearAllMocks()
  })

  describe('Basic Formity Initialization', () => {
    test('should initialize Formity with JSON schema configuration', async () => {
      const config: FormityConfig = {
        id: 'test-form',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Personal Info',
              fields: [
                { name: 'firstName', type: 'text', label: 'First Name', required: true },
                { name: 'email', type: 'email', label: 'Email', required: true }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      // Should render the form with first step
      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByText('Personal Info')).toBeInTheDocument()
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    test('should handle invalid JSON schema configuration gracefully', () => {
      const invalidConfig = {
        id: 'test-form',
        backend: 'tanstack',
        schema: {
          // Missing steps array
        }
      } as FormityConfig

      render(<FormityTestForm config={invalidConfig} />)
      
      // Should show configuration error
      expect(screen.getByText(/configuration error/i)).toBeInTheDocument()
    })
  })

  describe('TanStack Forms Backend Integration', () => {
    test('should successfully integrate with existing TanStack Forms backend', () => {
      const config: FormityConfig = {
        id: 'tanstack-test',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Test Step',
              fields: [
                { name: 'testField', type: 'text', label: 'Test Field', required: true }
              ]
            }
          ]
        }
      }

      render(<FormityTanStackIntegration config={config} />)
      
      // Should create TanStack Forms instance
      expect(screen.getByTestId('tanstack-form-instance')).toBeInTheDocument()
      
      // Should render field using TanStack Forms field API
      expect(screen.getByTestId('tanstack-field-api')).toBeInTheDocument()
    })

    test('should fall back to React Hook Form if TanStack integration fails', () => {
      const config: FormityConfig = {
        id: 'fallback-test',
        backend: 'tanstack', // This should fail and fallback
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Fallback Test',
              fields: [
                { name: 'testField', type: 'text', label: 'Test Field' }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      // Should show fallback message or use React Hook Form
      expect(screen.getByTestId('form-backend-indicator')).toHaveTextContent('react-hook-form')
    })
  })

  describe('Multi-Step Navigation', () => {
    const multiStepConfig: FormityConfig = {
      id: 'multi-step-test',
      backend: 'tanstack',
      schema: {
        steps: [
          {
            id: 'step1',
            title: 'Step 1: Personal',
            fields: [
              { name: 'firstName', type: 'text', label: 'First Name', required: true }
            ]
          },
          {
            id: 'step2', 
            title: 'Step 2: Contact',
            fields: [
              { name: 'email', type: 'email', label: 'Email', required: true }
            ]
          },
          {
            id: 'step3',
            title: 'Step 3: Preferences',
            fields: [
              { name: 'newsletter', type: 'checkbox', label: 'Subscribe to newsletter' }
            ]
          }
        ]
      }
    }

    test('should render multi-step form with navigation controls', () => {
      render(<FormityTestForm config={multiStepConfig} />)
      
      // Should show step indicator
      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
      expect(screen.getByText('Step 1: Personal')).toBeInTheDocument()
      
      // Should show navigation buttons
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument()
    })

    test('should navigate between steps correctly', async () => {
      render(<FormityTestForm config={multiStepConfig} />)
      
      // Fill required field
      await user.type(screen.getByLabelText(/first name/i), 'John')
      
      // Go to next step
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      await waitFor(() => {
        expect(screen.getByText('Step 2: Contact')).toBeInTheDocument()
        expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
      })
      
      // Should show both navigation buttons
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
    })

    test('should prevent navigation without valid field data', async () => {
      render(<FormityTestForm config={multiStepConfig} />)
      
      // Try to go next without filling required field
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Should stay on first step and show validation error
      expect(screen.getByText('Step 1: Personal')).toBeInTheDocument()
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
    })
  })

  describe('Field Rendering with shadcn/ui Integration', () => {
    test('should render text field using shadcn/ui TextField component', () => {
      const config: FormityConfig = {
        id: 'field-test',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Field Test',
              fields: [
                { 
                  name: 'textField', 
                  type: 'text', 
                  label: 'Text Field',
                  placeholder: 'Enter text here',
                  required: true 
                }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      const textField = screen.getByLabelText(/text field/i)
      expect(textField).toBeInTheDocument()
      expect(textField).toHaveAttribute('placeholder', 'Enter text here')
      expect(textField).toHaveAttribute('required')
      
      // Should use shadcn/ui styling classes
      expect(textField).toHaveClass('flex', 'h-9', 'w-full') // shadcn/ui Input classes
    })

    test('should render email field with proper validation', async () => {
      const config: FormityConfig = {
        id: 'email-test',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Email Test',
              fields: [
                { name: 'email', type: 'email', label: 'Email Address', required: true }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      const emailField = screen.getByLabelText(/email address/i)
      
      // Type invalid email
      await user.type(emailField, 'invalid-email')
      await user.tab() // Trigger blur for validation
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
      })
    })

    test('should render select field with options', async () => {
      const config: FormityConfig = {
        id: 'select-test',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Select Test',
              fields: [
                { 
                  name: 'country', 
                  type: 'select', 
                  label: 'Country',
                  options: [
                    { value: 'us', label: 'United States' },
                    { value: 'ca', label: 'Canada' },
                    { value: 'uk', label: 'United Kingdom' }
                  ]
                }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      // Should render select trigger
      const selectTrigger = screen.getByRole('combobox', { name: /country/i })
      expect(selectTrigger).toBeInTheDocument()
      
      // Click to open options
      await user.click(selectTrigger)
      
      await waitFor(() => {
        expect(screen.getByText('United States')).toBeInTheDocument()
        expect(screen.getByText('Canada')).toBeInTheDocument()
        expect(screen.getByText('United Kingdom')).toBeInTheDocument()
      })
    })

    test('should render textarea field', () => {
      const config: FormityConfig = {
        id: 'textarea-test',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Textarea Test',
              fields: [
                { 
                  name: 'description', 
                  type: 'textarea', 
                  label: 'Description',
                  placeholder: 'Enter description...',
                  rows: 4
                }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      const textarea = screen.getByLabelText(/description/i)
      expect(textarea).toBeInTheDocument()
      expect(textarea.tagName).toBe('TEXTAREA')
      expect(textarea).toHaveAttribute('placeholder', 'Enter description...')
      expect(textarea).toHaveAttribute('rows', '4')
    })
  })

  describe('State Persistence', () => {
    test('should persist form data to localStorage between steps', async () => {
      const config: FormityConfig = {
        id: 'persistence-test',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Step 1',
              fields: [
                { name: 'firstName', type: 'text', label: 'First Name', required: true }
              ]
            },
            {
              id: 'step2',
              title: 'Step 2', 
              fields: [
                { name: 'lastName', type: 'text', label: 'Last Name', required: true }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      // Fill first step
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.click(screen.getByRole('button', { name: /next/i }))
      
      // Check localStorage was called
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'formity-persistence-test',
        expect.stringContaining('"firstName":"John"')
      )
    })

    test('should restore form data from localStorage on component mount', () => {
      // Pre-populate localStorage
      mockLocalStorage.setItem.mockImplementation((key, value) => {
        if (key === 'formity-restore-test') {
          mockLocalStorage.getItem.mockReturnValue('{"firstName":"Jane","email":"jane@example.com"}')
        }
      })
      
      const config: FormityConfig = {
        id: 'restore-test',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Step 1',
              fields: [
                { name: 'firstName', type: 'text', label: 'First Name' },
                { name: 'email', type: 'email', label: 'Email' }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      // Should restore values
      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
      expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
    })

    test('should clear localStorage on successful form submission', async () => {
      const mockOnSubmit = vi.fn()
      const config: FormityConfig = {
        id: 'submit-test',
        backend: 'tanstack',
        onSubmit: mockOnSubmit,
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Step 1',
              fields: [
                { name: 'name', type: 'text', label: 'Name', required: true }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      await user.type(screen.getByLabelText(/name/i), 'Test User')
      await user.click(screen.getByRole('button', { name: /submit/i }))
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('formity-submit-test')
      })
    })
  })

  describe('Validation Integration', () => {
    test('should validate required fields using JSON schema', async () => {
      const config: FormityConfig = {
        id: 'validation-test',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Validation Test',
              fields: [
                { name: 'requiredField', type: 'text', label: 'Required Field', required: true }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      const field = screen.getByLabelText(/required field/i)
      
      // Focus and blur without entering value
      await user.click(field)
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/required field is required/i)).toBeInTheDocument()
      })
    })

    test('should validate field types (email, number, etc.)', async () => {
      const config: FormityConfig = {
        id: 'type-validation-test',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Type Validation',
              fields: [
                { name: 'email', type: 'email', label: 'Email', required: true },
                { name: 'age', type: 'number', label: 'Age', min: 18, max: 100 }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      // Test email validation
      await user.type(screen.getByLabelText(/email/i), 'not-an-email')
      await user.tab()
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
      })
      
      // Test number validation
      if (screen.getByLabelText(/age/i)) {
        await user.type(screen.getByLabelText(/age/i), '15')
        await user.tab()
        
        await waitFor(() => {
          expect(screen.getByText(/age must be at least 18/i)).toBeInTheDocument()
        })
      }
    })
  })

  describe('Performance and Bundle Size', () => {
    test('should have reasonable initialization time', async () => {
      const startTime = performance.now()
      
      const config: FormityConfig = {
        id: 'performance-test',
        backend: 'tanstack',
        schema: {
          steps: Array.from({ length: 5 }, (_, i) => ({
            id: `step${i + 1}`,
            title: `Step ${i + 1}`,
            fields: Array.from({ length: 10 }, (_, j) => ({
              name: `field${i}_${j}`,
              type: 'text' as const,
              label: `Field ${j + 1}`
            }))
          }))
        }
      }

      render(<FormityTestForm config={config} />)
      
      const endTime = performance.now()
      const initializationTime = endTime - startTime
      
      // Should initialize within 200ms
      expect(initializationTime).toBeLessThan(200)
    })
  })

  describe('Accessibility Compliance', () => {
    test('should maintain WCAG 2.1 AA compliance', () => {
      const config: FormityConfig = {
        id: 'a11y-test',
        backend: 'tanstack',
        schema: {
          steps: [
            {
              id: 'step1',
              title: 'Accessibility Test',
              fields: [
                { name: 'name', type: 'text', label: 'Full Name', required: true },
                { name: 'email', type: 'email', label: 'Email Address', required: true }
              ]
            }
          ]
        }
      }

      render(<FormityTestForm config={config} />)
      
      // All form controls should have proper labels
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      
      // Form should have proper semantics
      expect(screen.getByRole('form')).toBeInTheDocument()
      
      // Navigation buttons should have proper ARIA labels
      const nextButton = screen.getByRole('button', { name: /next/i })
      expect(nextButton).toHaveAccessibleName()
    })
  })
})