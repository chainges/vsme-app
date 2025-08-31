# Basic Component Pattern

## 🎯 Purpose

Test React components using TDD methodology with focus on user behavior, accessibility, and proper component contracts.

**Use this pattern when:**
- Creating new React components
- Testing component rendering and basic interactions
- Ensuring accessibility compliance
- Following TDD approach for component development

## 🔴 TDD Approach

### RED Phase: Define Component Contract
```tsx
// 🔴 RED: Write failing test first
test('renders welcome message', () => {
  render(<WelcomeCard name="John Doe" />)
  
  expect(screen.getByText('Welcome, John Doe!')).toBeInTheDocument()
})
```

### GREEN Phase: Minimal Implementation
```tsx
// 🟢 GREEN: Create minimal component
function WelcomeCard({ name }: { name: string }) {
  return <div>Welcome, {name}!</div>
}
```

### REFACTOR Phase: Improve Structure
```tsx
// 🔵 REFACTOR: Add proper semantics and styling
function WelcomeCard({ name }: { name: string }) {
  return (
    <div className="welcome-card" role="banner">
      <h1>Welcome, {name}!</h1>
    </div>
  )
}
```

## 📋 Template

```tsx
// src/components/YourComponent/YourComponent.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, describe, vi, beforeEach } from 'vitest'
import YourComponent from './YourComponent'

describe('10.3-INTEGRATION-001: YourComponent', () => {
  const defaultProps = {
    // Define expected props (TDD: API design first)
    title: 'Test Title',
    onAction: vi.fn(),
    isEnabled: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 🔴 RED: Basic rendering
  test('renders with required props', () => {
    render(<YourComponent {...defaultProps} />)
    
    // Test accessibility first (screen reader accessible)
    expect(screen.getByRole('button', { name: /test title/i })).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  // 🔴 RED: User interactions
  test('handles click interaction', async () => {
    const user = userEvent.setup()
    const mockAction = vi.fn()
    
    render(<YourComponent {...defaultProps} onAction={mockAction} />)
    
    await user.click(screen.getByRole('button', { name: /test title/i }))
    
    expect(mockAction).toHaveBeenCalledWith(expect.any(Object))
  })

  // 🔴 RED: Conditional rendering
  test('disables when isEnabled is false', () => {
    render(<YourComponent {...defaultProps} isEnabled={false} />)
    
    expect(screen.getByRole('button')).toBeDisabled()
  })

  // 🔴 RED: Accessibility validation
  test('maintains accessibility standards', () => {
    render(<YourComponent {...defaultProps} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAccessibleName()
    expect(button).toHaveAttribute('aria-disabled', 'false')
  })

  // 🔴 RED: Error states
  test('handles missing required props gracefully', () => {
    // Test component resilience
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<YourComponent />)
    
    // Should not crash, might show fallback
    expect(screen.getByText(/error/i)).toBeInTheDocument()
    
    consoleError.mockRestore()
  })
})
```

## 💡 Real Example

```tsx
// src/components/ActionButton/ActionButton.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, describe, vi } from 'vitest'
import { ActionButton } from './ActionButton'

describe('10.3-INTEGRATION-002: ActionButton', () => {
  // 🔴 RED: Define component API through tests
  test('renders action button with label', () => {
    render(<ActionButton label="Save Changes" onClick={vi.fn()} />)
    
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
  })

  test('executes onClick handler', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(<ActionButton label="Delete Item" onClick={handleClick} />)
    
    await user.click(screen.getByRole('button', { name: 'Delete Item' }))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('shows loading state', () => {
    render(<ActionButton label="Submit" onClick={vi.fn()} isLoading={true} />)
    
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('applies variant styles', () => {
    render(<ActionButton label="Warning" onClick={vi.fn()} variant="warning" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('btn-warning')
  })
})

// 🟢 GREEN: Minimal implementation
export function ActionButton({ 
  label, 
  onClick, 
  isLoading = false, 
  variant = 'primary' 
}: {
  label: string
  onClick: () => void
  isLoading?: boolean
  variant?: 'primary' | 'warning' | 'danger'
}) {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className={`btn btn-${variant}`}
      aria-label={label}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  )
}
```

## 🧰 Integration

### With Project Infrastructure

```tsx
// Works with existing test setup
import { render, screen } from '@testing-library/react'  // Already configured
import userEvent from '@testing-library/user-event'     // Available
import { vi } from 'vitest'                             // Mock utilities

// Uses path aliases
import { YourComponent } from '@/components/YourComponent'
import { validateInput } from '@/utils/validation'

// Integrates with existing mocks (automatically available)
// - ResizeObserver
// - IntersectionObserver  
// - localStorage
// - DOM methods
```

### With Providers

```tsx
// For components that need context providers
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'

function renderWithProviders(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

test('works with providers', () => {
  renderWithProviders(<YourComponent />)
  // Test implementation
})
```

## 🚨 Common Issues

### Issue: "not wrapped in act(...)" Warning

**Problem:**
```tsx
// ❌ This causes act() warnings
fireEvent.click(button)
```

**Solution:**
```tsx
// ✅ Use userEvent for user interactions
const user = userEvent.setup()
await user.click(button)
```

### Issue: Element Not Found

**Problem:**
```tsx
// ❌ Query might not find element
expect(screen.getByText('Submit')).toBeInTheDocument()
```

**Solution:**
```tsx
// ✅ Debug what's actually rendered
screen.debug()

// ✅ Use more flexible queries
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
```

### Issue: Async Operations Not Working

**Problem:**
```tsx
// ❌ Not waiting for async updates
fireEvent.click(button)
expect(screen.getByText('Success')).toBeInTheDocument()
```

**Solution:**
```tsx
// ✅ Wait for async updates
const user = userEvent.setup()
await user.click(button)

await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

### Issue: Testing Implementation Details

**Problem:**
```tsx
// ❌ Testing implementation details
expect(component.state.isVisible).toBe(true)
```

**Solution:**
```tsx
// ✅ Test user-observable behavior
expect(screen.getByText('Content is visible')).toBeInTheDocument()
```

## Best Practices

### ✅ DO
- Test user behavior, not implementation details
- Use accessibility-focused queries (`getByRole`, `getByLabelText`)
- Test error states and edge cases
- Mock external dependencies consistently
- Follow TDD cycle: RED → GREEN → REFACTOR

### ❌ DON'T
- Test internal component state directly
- Use `getByTestId` as first choice (accessibility queries first)
- Write tests after implementation (breaks TDD)
- Ignore accessibility in tests
- Test styling details extensively

---

**Next Steps:**
- Try this pattern with a real component
- See [Form Component Pattern](./form-component.md) for form-specific testing
- Check [Provider Component Pattern](./provider-component.md) for context testing
