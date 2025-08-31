# Testing Quick Start Guide

**🎯 Goal: Write your first test in 15 minutes**

This guide bridges BMAD testing frameworks with practical implementation, giving you everything needed to start writing effective tests immediately.

## Table of Contents

1. [Quick Start (5 minutes)](#quick-start-5-minutes)
2. [TDD Process with Examples](#tdd-process-with-examples)
3. [BMAD Testing Framework Integration](#bmad-testing-framework-integration)
4. [Testing Infrastructure](#testing-infrastructure)
5. [Copy-Paste Testing Patterns](#copy-paste-testing-patterns)
6. [Decision Trees](#decision-trees)

---

## Quick Start (5 minutes)

### 1. Run Your First Test (30 seconds)

```bash
# Watch mode (recommended for development)
bun test

# Single run
bun test:run

# UI mode (visual test runner)
bun test:ui
```

### 2. Basic Component Test Template (2 minutes)

Copy this template and replace `YourComponent` with your component:

```tsx
// src/components/YourComponent.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, describe, vi } from 'vitest'
import YourComponent from './YourComponent'

describe('YourComponent', () => {
  test('renders correctly', () => {
    render(<YourComponent />)
    
    // Find by role (preferred - tests accessibility)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    
    // Find by text (when role isn't clear)
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
  })

  test('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<YourComponent />)
    
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Wait for async operations
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument()
    })
  })
})
```

### 3. Run and See It Pass (30 seconds)

Save the file and your tests will run automatically in watch mode!

### 4. Ready to Go! ✅

You now have a working test. Continue reading for advanced patterns and TDD workflow.

---

## TDD Process with Examples

### RED-GREEN-REFACTOR Workflow

**🔴 RED**: Write a failing test first
**🟢 GREEN**: Write minimal code to make it pass  
**🔵 REFACTOR**: Improve code while keeping tests green

### Practical TDD Example

Let's create a `UserValidator` utility using TDD:

#### 🔴 RED Phase: Write the failing test

```tsx
// src/utils/UserValidator.test.ts
import { describe, test, expect } from 'vitest'
import { UserValidator } from './UserValidator'

describe('UserValidator', () => {
  test('validates email format', () => {
    const validator = new UserValidator()
    
    expect(validator.isValidEmail('user@example.com')).toBe(true)
    expect(validator.isValidEmail('invalid-email')).toBe(false)
  })
})
```

**❌ This test will fail because `UserValidator` doesn't exist yet.**

#### 🟢 GREEN Phase: Write minimal implementation

```tsx
// src/utils/UserValidator.ts
export class UserValidator {
  isValidEmail(email: string): boolean {
    return email.includes('@') && email.includes('.')
  }
}
```

**✅ Test passes! The implementation is minimal but works.**

#### 🔵 REFACTOR Phase: Improve the implementation

```tsx
// src/utils/UserValidator.ts
export class UserValidator {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  isValidEmail(email: string): boolean {
    return this.emailRegex.test(email)
  }
}
```

**✅ Tests still pass, but implementation is more robust.**

### When to Use TDD vs Other Approaches

```
📊 TDD Decision Tree:

New feature/utility? → Use TDD
  ├─ Complex business logic? → Definitely TDD
  ├─ Simple CRUD? → TDD recommended
  └─ UI components? → Consider TDD for logic, not styling

Bug fix? → Write test that reproduces bug first
Legacy code? → Add tests before changes
Prototype/spike? → Skip TDD initially, add tests when stabilizing
```

---

## BMAD Testing Framework Integration

### Test Levels Framework

BMAD defines three test levels. Choose based on what you're testing:

#### 🟢 Unit Tests (Fastest, Most Isolated)
- **When**: Testing individual functions/components in isolation
- **Coverage**: >90% for P0 functionality
- **Pattern**: `test_{component}_{scenario}`

```tsx
// Example: Testing a utility function
test('formatCurrency handles zero values', () => {
  expect(formatCurrency(0)).toBe('$0.00')
})
```

#### 🟡 Integration Tests (Component Boundaries)
- **When**: Testing how components work together
- **Coverage**: >80% for P1 workflows
- **Pattern**: `test_{flow}_{interaction}`

```tsx
// Example: Form with validation
test('form_submission_with_validation_errors', async () => {
  const user = userEvent.setup()
  render(<ContactForm />)
  
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  expect(screen.getByText(/email is required/i)).toBeInTheDocument()
})
```

#### 🔴 E2E Tests (Complete User Journeys)
- **When**: Testing complete user workflows
- **Coverage**: >60% for P2 scenarios
- **Pattern**: `test_{journey}_{outcome}`

```tsx
// Example: Complete user signup flow
test('user_signup_journey_success', async () => {
  // This would typically use Playwright/Cypress
  // For component testing, simulate the full flow
})
```

### Priority Matrix Integration

Map your tests to BMAD priorities:

- **P0 (Must Test)**: Core functionality that breaks the app if it fails
- **P1 (Should Test)**: Important features that significantly impact UX
- **P2 (Nice to Test)**: Enhancement features
- **P3 (Test if Time)**: Edge cases and optimizations

### Test ID Format

Use BMAD test ID format in describe blocks:

```tsx
describe('10.1-UNIT-001: UserValidator email validation', () => {
  // Test ID: {EPIC}.{STORY}-{LEVEL}-{SEQUENCE}
})
```

---

## Testing Infrastructure

### Current Setup Overview

**✅ What's Already Configured:**

- **Vitest 3.2.4**: Modern, fast test runner
- **@testing-library/react**: User-centric testing utilities
- **jsdom**: Browser environment simulation
- **User Events**: Realistic user interaction testing
- **Comprehensive mocks**: ResizeObserver, IntersectionObserver, localStorage

### Key Commands

```bash
# Development (recommended)
bun test                 # Watch mode - reruns tests on file changes

# CI/Production
bun test:run            # Single run - exits after completion

# Debugging
bun test:ui             # Visual test runner with browser interface
```

### Path Aliases

Your project uses `@/` as an alias for `./src`:

```tsx
import { formatCurrency } from '@/utils/currency'
import { UserForm } from '@/components/forms/UserForm'
```

### Mock Setup

Common mocks are already configured in `test-setup.ts`:

```tsx
// Already available - no setup needed
localStorage.getItem()
localStorage.setItem()
ResizeObserver
IntersectionObserver
Element.prototype.getBoundingClientRect()
Element.prototype.scrollIntoView()
```

### Configuration Files

- **`vitest.config.mjs`**: Main test configuration
- **`src/test-setup.ts`**: Global test setup and mocks
- **`package.json`**: Test commands and dependencies

---

## Copy-Paste Testing Patterns

### 1. Component Testing Pattern

Based on successful MultiStepForm.test.tsx patterns:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, describe, vi, beforeEach } from 'vitest'
import YourComponent from './YourComponent'

describe('YourComponent', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    initialValue: 'test',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders with initial props', () => {
    render(<YourComponent {...defaultProps} />)
    expect(screen.getByDisplayValue('test')).toBeInTheDocument()
  })

  test('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<YourComponent {...defaultProps} />)
    
    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, 'new value')
    
    expect(input).toHaveValue('new value')
  })

  test('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup()
    const mockSubmit = vi.fn()
    
    render(<YourComponent {...defaultProps} onSubmit={mockSubmit} />)
    
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(mockSubmit).toHaveBeenCalledWith({ value: 'test' })
  })
})
```

### 2. Utility Function Testing

```tsx
import { describe, test, expect } from 'vitest'
import { yourUtilityFunction } from './yourUtility'

describe('yourUtilityFunction', () => {
  test('handles normal input', () => {
    expect(yourUtilityFunction('input')).toBe('expected')
  })

  test('handles edge cases', () => {
    expect(yourUtilityFunction('')).toBe('')
    expect(yourUtilityFunction(null)).toBe(null)
  })

  test('throws on invalid input', () => {
    expect(() => yourUtilityFunction(undefined)).toThrow()
  })
})
```

### 3. Hook Testing Template

```tsx
import { renderHook, act } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { useYourHook } from './useYourHook'

describe('useYourHook', () => {
  test('returns initial state', () => {
    const { result } = renderHook(() => useYourHook())
    
    expect(result.current.value).toBe(initialValue)
  })

  test('updates state on action', () => {
    const { result } = renderHook(() => useYourHook())
    
    act(() => {
      result.current.updateValue('new value')
    })
    
    expect(result.current.value).toBe('new value')
  })
})
```

### 4. Validation Testing with Zod

```tsx
import { describe, test, expect, vi } from 'vitest'
import { z } from 'zod'

describe('validation', () => {
  test('validates correct data', () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(18)
    })
    
    const validData = { email: 'test@example.com', age: 25 }
    expect(() => schema.parse(validData)).not.toThrow()
  })

  test('rejects invalid data', () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(18)
    })
    
    const invalidData = { email: 'not-email', age: 15 }
    expect(() => schema.parse(invalidData)).toThrow()
  })
})
```

### 5. Async/API Testing

```tsx
import { waitFor, screen } from '@testing-library/react'
import { vi } from 'vitest'

test('handles API loading states', async () => {
  // Mock the API call
  const mockApi = vi.fn(() => 
    new Promise(resolve => setTimeout(() => resolve({ data: 'result' }), 100))
  )
  
  render(<YourAsyncComponent apiCall={mockApi} />)
  
  // Check loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  // Wait for completion
  await waitFor(() => {
    expect(screen.getByText('result')).toBeInTheDocument()
  })
  
  expect(mockApi).toHaveBeenCalledTimes(1)
})
```

---

## Decision Trees

### What Type of Test Should I Write?

```
🤔 What am I testing?

Single function/utility?
├─ Pure function? → Unit test
├─ Has side effects? → Unit test with mocks
└─ Complex logic? → Multiple unit tests

React component?
├─ Just rendering? → Unit test (render + expect)
├─ User interactions? → Integration test (userEvent)
├─ API calls? → Integration test with mocked APIs
└─ Multiple components? → Integration test

Complete user flow?
├─ Within single page? → Integration test
├─ Multiple pages/routes? → E2E test (future)
└─ Critical business logic? → Both integration + E2E
```

### Which Testing Library Query Should I Use?

**Priority order (use the highest available):**

1. **`getByRole`** - Tests accessibility and semantics
2. **`getByLabelText`** - Tests form associations
3. **`getByText`** - Tests visible content
4. **`getByDisplayValue`** - Tests form values
5. **`getByTestId`** - Last resort for unique identification

```tsx
// ✅ Preferred (tests accessibility)
screen.getByRole('button', { name: /submit/i })

// ✅ Good for forms
screen.getByLabelText(/email address/i)

// ✅ Good for content
screen.getByText(/welcome back/i)

// ❌ Avoid (implementation detail)
screen.getByClassName('submit-button')
```

### Should I Mock This?

```
🤔 Should I mock this dependency?

External API call? → ✅ Always mock
File system operation? → ✅ Always mock
Database call? → ✅ Always mock
Timer/Date? → ✅ Mock for predictability

Another component in my app?
├─ Testing integration? → ❌ Don't mock
├─ Component is complex? → ✅ Mock it
└─ Just checking props? → ✅ Mock it

Utility function?
├─ Pure function? → ❌ Don't mock (test real thing)
├─ Has side effects? → ✅ Mock the side effects
└─ Slow operation? → ✅ Mock it
```

---

## Getting Help

### Common Issues & Solutions

**❌ Test fails with "not wrapped in act(...)"**
```tsx
// Fix: Use userEvent instead of fireEvent for user interactions
const user = userEvent.setup()
await user.click(button)  // ✅ Instead of fireEvent.click(button)
```

**❌ Can't find element**
```tsx
// Debug: See what's rendered
screen.debug()  // Prints the DOM to console
```

**❌ Async test timing out**
```tsx
// Fix: Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument()
}, { timeout: 5000 })
```

### Resources

- **BMAD Frameworks**: `docs/.bmad-core/data/test-*.md`
- **Code Examples**: `apps/web/src/components/forms/multi-step/MultiStepForm.test.tsx`
- **Configuration**: `apps/web/vitest.config.mjs` and `apps/web/src/test-setup.ts`

---

**🎉 You're ready to write tests!** Start with the copy-paste templates above and adapt them to your needs. Remember: good tests focus on user behavior, not implementation details.
