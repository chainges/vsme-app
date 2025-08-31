# TDD Process Guide

**🎯 Goal: Master Test-Driven Development methodology for consistent, high-quality code**

This guide establishes comprehensive Test-Driven Development practices that go beyond testing—TDD as a design methodology that drives better code architecture and reliability.

## Table of Contents

1. [TDD Fundamentals](#tdd-fundamentals)
2. [Complete TDD Workflow](#complete-tdd-workflow)
3. [TDD Decision Framework](#tdd-decision-framework)
4. [Practical TDD Examples](#practical-tdd-examples)
5. [Quality Gates & Performance Metrics](#quality-gates--performance-metrics)
6. [Integration with Project Infrastructure](#integration-with-project-infrastructure)
7. [TDD Templates & Scaffolding](#tdd-templates--scaffolding)

---

## TDD Fundamentals

### What TDD Really Means

**TDD is NOT just testing first**—it's a design methodology where tests drive the implementation.

**🔴 RED**: Write a failing test that defines the desired behavior  
**🟢 GREEN**: Write the minimal code to make the test pass  
**🔵 REFACTOR**: Improve the code while keeping tests green  

### Why TDD Matters

**Without TDD:**
```tsx
// ❌ Code-first approach (current project pattern)
function calculateTax(amount: number, rate: number) {
  return amount * rate * 0.01
}

// Then later: "Oh, we should test this"
test('calculates tax', () => {
  expect(calculateTax(100, 10)).toBe(10)
})
```

**With TDD:**
```tsx
// ✅ Test-first approach (proper TDD)
test('calculates tax correctly', () => {
  expect(calculateTax(100, 10)).toBe(10)
})

// Forces you to think about the API before implementation
function calculateTax(amount: number, rate: number): number {
  return amount * (rate / 100)
}
```

### TDD vs Testing-After

| Aspect | Testing-After (Current) | TDD (Target) |
|--------|-------------------------|-------------|
| **Design** | Implementation drives tests | Tests drive implementation |
| **Coverage** | Often incomplete | Comprehensive by design |
| **API Design** | May be awkward to test | Naturally testable |
| **Confidence** | "Does this work?" | "This definitely works" |
| **Refactoring** | Risky without tests | Safe with test safety net |

---

## Complete TDD Workflow

### The RED-GREEN-REFACTOR Cycle

#### 🔴 RED Phase: Write a Failing Test

**Rules:**
1. Write the smallest possible failing test
2. Run the test to confirm it fails (and fails for the right reason)
3. Don't write any implementation code yet

```tsx
// Example: Building a user validation utility
describe('UserValidator', () => {
  test('rejects empty email', () => {
    const validator = new UserValidator()
    
    expect(validator.isValidEmail('')).toBe(false)
  })
})
```

**🔴 At this point:**
- Test fails because `UserValidator` doesn't exist
- This is good! The failure tells us what to build next

#### 🟢 GREEN Phase: Make It Pass

**Rules:**
1. Write the minimal code to make the test pass
2. Don't add extra functionality 
3. Don't worry about code quality yet
4. Focus only on making the test green

```tsx
// Minimal implementation - just make it pass
export class UserValidator {
  isValidEmail(email: string): boolean {
    return email !== ''
  }
}
```

**🟢 Test passes!** Even though the implementation is naive, we have a working system.

#### 🔵 REFACTOR Phase: Improve Code Quality

**Rules:**
1. Improve code quality while keeping tests green
2. Extract methods, improve naming, add proper validation
3. Run tests frequently during refactoring
4. Don't add new functionality—just improve existing

```tsx
// Refactored implementation - better quality, same behavior
export class UserValidator {
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  isValidEmail(email: string): boolean {
    return email.length > 0 && this.emailPattern.test(email)
  }
}
```

**🔵 Test still passes,** but code is more robust and maintainable.

### TDD with BMAD Test Levels

#### Primary TDD Level: Unit Tests

```tsx
// TDD cycle primarily at unit level for fast feedback
describe('10.2-UNIT-001: calculateDiscount', () => {
  test('🔴 RED: applies basic percentage discount', () => {
    expect(calculateDiscount(100, 10)).toBe(90)
  })
  
  test('🔴 RED: handles zero discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100)
  })
  
  test('🔴 RED: throws on invalid discount', () => {
    expect(() => calculateDiscount(100, -5)).toThrow()
  })
})

// 🟢 GREEN: Implement minimal functionality
// 🔵 REFACTOR: Improve implementation
```

#### Secondary TDD Level: Integration Tests

```tsx
// TDD for component interactions
describe('10.2-INTEGRATION-001: ContactForm submission', () => {
  test('🔴 RED: submits valid form data', async () => {
    const mockSubmit = vi.fn()
    const user = userEvent.setup()
    
    render(<ContactForm onSubmit={mockSubmit} />)
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    })
  })
})
```

#### Rare TDD Level: E2E Tests

```tsx
// TDD for critical user journeys (sparingly)
test('🔴 RED: complete user signup journey', async () => {
  // Only for most critical paths
  // Usually developed after unit/integration TDD is complete
})
```

---

## TDD Decision Framework

### When to Apply TDD

```
📊 TDD Decision Tree:

What are you building?

New feature/utility? 
├─ Complex business logic? → ✅ TDD REQUIRED
├─ API endpoint? → ✅ TDD REQUIRED  
├─ Data transformation? → ✅ TDD REQUIRED
├─ Simple CRUD operation? → ✅ TDD RECOMMENDED
└─ UI component with logic? → ✅ TDD RECOMMENDED

Bug fixing?
├─ Can reproduce with test? → ✅ TDD REQUIRED (reproduce first)
├─ Unknown root cause? → ✅ TDD REQUIRED (discover via tests)
└─ Simple UI fix? → ❌ TDD OPTIONAL

Refactoring existing code?
├─ No tests exist? → ✅ TDD REQUIRED (safety net first)
├─ Tests already exist? → ✅ TDD RECOMMENDED (improve design)
└─ Pure styling changes? → ❌ TDD NOT NEEDED

Configuration/Infrastructure?
├─ Build system changes? → ❌ TDD NOT APPLICABLE
├─ Environment setup? → ❌ TDD NOT APPLICABLE  
└─ Third-party integration? → ⚠️ TDD OPTIONAL (mock boundaries)
```

### TDD Priority by BMAD Framework

- **P0 (Must Test)**: TDD **REQUIRED** - Core functionality
- **P1 (Should Test)**: TDD **RECOMMENDED** - Important features  
- **P2 (Nice to Test)**: TDD **OPTIONAL** - Enhancement features
- **P3 (Test if Time)**: TDD **SKIP** - Edge cases handled manually

### When NOT to Use TDD

**Skip TDD for:**
1. **Prototype/Spike work**: Exploring unknown solutions
2. **Pure styling**: CSS/styling-only changes  
3. **Configuration files**: Environment, build settings
4. **Simple data mapping**: Direct transformations without logic
5. **Legacy integration**: When tests are more complex than implementation

**Example decision:**
```tsx
// ❌ Don't TDD this (configuration)
const config = {
  apiUrl: process.env.API_URL,
  timeout: 5000
}

// ✅ DO TDD this (business logic)
function calculateShippingCost(weight: number, distance: number): number {
  // This needs TDD - multiple inputs, business rules, edge cases
}
```

---

## Practical TDD Examples

### Example 1: Utility Function TDD

Let's build a `PriceCalculator` using proper TDD methodology:

#### 🔴 RED Phase

```tsx
// src/utils/PriceCalculator.test.ts
import { describe, test, expect } from 'vitest'
import { PriceCalculator } from './PriceCalculator'

describe('PriceCalculator', () => {
  test('calculates basic price with tax', () => {
    const calculator = new PriceCalculator()
    
    const result = calculator.calculateTotal(100, 0.08) // $100 + 8% tax
    
    expect(result).toBe(108)
  })
})
```

**🔴 Run test**: Fails because `PriceCalculator` doesn't exist

#### 🟢 GREEN Phase

```tsx
// src/utils/PriceCalculator.ts
export class PriceCalculator {
  calculateTotal(price: number, taxRate: number): number {
    return 108 // Hard-coded to make test pass
  }
}
```

**🟢 Run test**: Passes! Now add more tests to drive better implementation.

#### Expand with More Tests (RED)

```tsx
test('calculates different tax rates', () => {
  const calculator = new PriceCalculator()
  
  expect(calculator.calculateTotal(200, 0.05)).toBe(210) // 5% tax
})

test('handles zero tax', () => {
  const calculator = new PriceCalculator()
  
  expect(calculator.calculateTotal(50, 0)).toBe(50)
})
```

**🔴 Run tests**: New tests fail, forces proper implementation

#### 🟢 GREEN Phase - Proper Implementation

```tsx
export class PriceCalculator {
  calculateTotal(price: number, taxRate: number): number {
    return price + (price * taxRate)
  }
}
```

**🟢 All tests pass!**

#### 🔵 REFACTOR Phase

```tsx
export class PriceCalculator {
  calculateTotal(basePrice: number, taxRate: number): number {
    this.validateInputs(basePrice, taxRate)
    
    const taxAmount = basePrice * taxRate
    return basePrice + taxAmount
  }
  
  private validateInputs(basePrice: number, taxRate: number): void {
    if (basePrice < 0) throw new Error('Price cannot be negative')
    if (taxRate < 0) throw new Error('Tax rate cannot be negative')
  }
}
```

**Add tests for validation** (RED → GREEN cycle continues)

### Example 2: API Route TDD

Building an API endpoint with TDD:

#### 🔴 RED Phase

```tsx
// src/api/users.test.ts
import { describe, test, expect } from 'vitest'
import { POST } from './users/route'

describe('POST /api/users', () => {
  test('creates user with valid data', async () => {
    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com'
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data.user.name).toBe('John Doe')
    expect(data.user.id).toBeDefined()
  })
})
```

#### 🟢 GREEN Phase

```tsx
// src/app/api/users/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  // Minimal implementation to pass test
  return Response.json({
    user: {
      id: '1',
      name: body.name,
      email: body.email
    }
  }, { status: 201 })
}
```

#### Continue TDD cycle for validation, error handling, etc.

### Example 3: React Hook TDD

Building a custom hook with TDD:

#### 🔴 RED Phase

```tsx
// src/hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react'
import { expect, test, describe } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  test('starts with initial value', () => {
    const { result } = renderHook(() => useCounter(5))
    
    expect(result.current.count).toBe(5)
  })
  
  test('increments count', () => {
    const { result } = renderHook(() => useCounter(0))
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })
})
```

#### 🟢 GREEN Phase

```tsx
// src/hooks/useCounter.ts
import { useState } from 'react'

export function useCounter(initialValue: number) {
  const [count, setCount] = useState(initialValue)
  
  const increment = () => setCount(c => c + 1)
  
  return { count, increment }
}
```

### Example 4: Form Validation Schema TDD

Using TDD with Zod schemas:

#### 🔴 RED Phase

```tsx
// src/schemas/userSchema.test.ts
import { describe, test, expect } from 'vitest'
import { userSchema } from './userSchema'

describe('userSchema', () => {
  test('validates correct user data', () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25
    }
    
    expect(() => userSchema.parse(validUser)).not.toThrow()
  })
  
  test('rejects invalid email', () => {
    const invalidUser = {
      name: 'John Doe',
      email: 'not-an-email',
      age: 25
    }
    
    expect(() => userSchema.parse(invalidUser)).toThrow()
  })
})
```

#### 🟢 GREEN Phase

```tsx
// src/schemas/userSchema.ts
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(0)
})
```

---

## Quality Gates & Performance Metrics

### Coverage Thresholds

```json
{
  "coverage": {
    "unit": ">=80%",
    "integration": ">=60%", 
    "e2e": "critical_paths_only"
  },
  "quality_gates": {
    "unit_coverage_drop": "fail_build",
    "integration_coverage_drop": "warning",
    "untested_p0_functionality": "fail_build"
  }
}
```

### Performance Targets

**Test Suite Performance:**
- **Unit tests**: <10 seconds total (TDD requires fast feedback)
- **Integration tests**: <30 seconds total  
- **E2E tests**: <5 minutes (run less frequently)

**TDD Cycle Performance:**
- **RED→GREEN cycle**: <30 seconds (rapid iteration)
- **Full test run**: <10 seconds (continuous feedback)
- **Test file execution**: <2 seconds (single file focus)

### Quality Metrics

**Code Quality Gates:**
```tsx
// Add to vitest.config.mjs
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        global: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80
        }
      }
    }
  }
})
```

**TDD Quality Indicators:**
- **Test-to-Code Ratio**: Aim for 1:1 or higher (test code ≥ implementation code)
- **Commit Frequency**: Small, frequent commits at GREEN phase
- **Refactor Safety**: Any refactor should maintain green tests
- **Test Reliability**: <1% flaky test rate

---

## Integration with Project Infrastructure

### Vitest Configuration for TDD

**Optimal TDD setup in `vitest.config.mjs`:**

```javascript
export default defineConfig({
  test: {
    // TDD-optimized settings
    watch: true,          // Always watch during development
    reporter: ['verbose'], // Detailed feedback during TDD
    coverage: {
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80
      }
    },
    // Fast execution for TDD cycles
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true // Predictable test execution
      }
    }
  }
})
```

### TDD Commands

```bash
# TDD Development Workflow
bun test                    # Watch mode - perfect for TDD
bun test --reporter=verbose # Detailed feedback during TDD cycles
bun test --coverage         # Check coverage after TDD cycles

# TDD Focused Development
bun test MyComponent.test.tsx    # Focus on single component TDD
bun test --run                   # Single run for CI/git hooks

# TDD Debugging
bun test:ui                      # Visual debugging when RED→GREEN fails
bun test --reporter=dot          # Minimal output for long TDD sessions
```

### @testing-library/react in TDD

**TDD Component Development Pattern:**

```tsx
// 🔴 RED: Start with component API design
test('renders user profile with name', () => {
  render(<UserProfile user={{ name: 'John Doe', email: 'john@example.com' }} />)
  
  expect(screen.getByText('John Doe')).toBeInTheDocument()
})

// 🟢 GREEN: Create minimal component
function UserProfile({ user }: { user: { name: string; email: string } }) {
  return <div>{user.name}</div>
}

// 🔴 RED: Add behavior test
test('shows email on click', async () => {
  const user = userEvent.setup()
  render(<UserProfile user={{ name: 'John', email: 'john@example.com' }} />)
  
  await user.click(screen.getByText('John'))
  
  expect(screen.getByText('john@example.com')).toBeInTheDocument()
})

// 🟢 GREEN: Implement behavior
// 🔵 REFACTOR: Improve component structure
```

### Mocking in TDD

**TDD with existing mock infrastructure:**

```tsx
// TDD pattern with localStorage mock (already configured)
test('saves user preference', () => {
  const preferences = new UserPreferences()
  
  preferences.saveTheme('dark')
  
  expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
})

// TDD pattern with ResizeObserver mock
test('responds to container resize', () => {
  render(<ResponsiveComponent />)
  
  // ResizeObserver is already mocked in test-setup.ts
  const mockResizeObserver = vi.mocked(ResizeObserver)
  expect(mockResizeObserver).toHaveBeenCalled()
})
```

---

## TDD Templates & Scaffolding

### TDD Test Templates

#### Utility Function TDD Template

```tsx
// Copy-paste template for TDD utility functions
import { describe, test, expect } from 'vitest'
import { YourUtility } from './YourUtility'

describe('YourUtility', () => {
  // 🔴 RED: Basic functionality
  test('handles normal case', () => {
    expect(YourUtility.method('input')).toBe('expected')
  })
  
  // 🔴 RED: Edge cases
  test('handles empty input', () => {
    expect(YourUtility.method('')).toBe('')
  })
  
  test('handles invalid input', () => {
    expect(() => YourUtility.method(null)).toThrow()
  })
  
  // Continue TDD cycle: RED → GREEN → REFACTOR
})
```

#### Component TDD Template

```tsx
// Copy-paste template for TDD component development
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, describe, vi } from 'vitest'
import YourComponent from './YourComponent'

describe('YourComponent', () => {
  const defaultProps = {
    // Define expected API first (TDD approach)
  }
  
  // 🔴 RED: Component structure
  test('renders with required elements', () => {
    render(<YourComponent {...defaultProps} />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  
  // 🔴 RED: User interactions
  test('handles user interaction', async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()
    
    render(<YourComponent {...defaultProps} onAction={mockHandler} />)
    
    await user.click(screen.getByRole('button'))
    
    expect(mockHandler).toHaveBeenCalled()
  })
  
  // Continue TDD: RED → GREEN → REFACTOR
})
```

#### API Route TDD Template

```tsx
// Copy-paste template for TDD API development
import { describe, test, expect, vi } from 'vitest'
import { POST } from './route'

describe('POST /api/your-endpoint', () => {
  // 🔴 RED: Success case
  test('handles valid request', async () => {
    const request = new Request('http://localhost/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify({ /* valid data */ }),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data).toMatchObject({ /* expected structure */ })
  })
  
  // 🔴 RED: Error cases
  test('handles invalid request', async () => {
    const request = new Request('http://localhost/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify({ /* invalid data */ })
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(400)
  })
  
  // Continue TDD: RED → GREEN → REFACTOR
})
```

### IDE Setup for TDD

#### VS Code Snippets for TDD

Create `.vscode/snippets.json`:

```json
{
  "TDD Test Block": {
    "prefix": "tddtest",
    "body": [
      "test('$1', () => {",
      "  // 🔴 RED: Write failing assertion first",
      "  expect($2).toBe($3)",
      "})"
    ],
    "description": "TDD test block template"
  },
  
  "TDD Describe Block": {
    "prefix": "tdddescribe", 
    "body": [
      "describe('$1', () => {",
      "  // 🔴 RED Phase: Define expected behavior",
      "  test('$2', () => {",
      "    expect($3).toBe($4)",
      "  })",
      "  ",
      "  // Continue TDD cycle: RED → GREEN → REFACTOR",
      "})"
    ],
    "description": "TDD describe block with cycle reminder"
  }
}
```

#### TDD Workflow Shortcuts

**Recommended VS Code extensions for TDD:**
- **Jest** (or Vitest extension) for inline test running
- **Test Explorer** for visual test management
- **GitLens** for tracking TDD commits at GREEN phase

**TDD Keyboard Shortcuts:**
- `Ctrl+Shift+T`: Run tests in watch mode
- `Ctrl+Shift+R`: Run single test file  
- `F5`: Debug current test (when RED fails unexpectedly)

### TDD Naming Conventions

#### Test Organization

```
src/
├── components/
│   ├── UserProfile/
│   │   ├── UserProfile.tsx          # 🟢 Implementation
│   │   ├── UserProfile.test.tsx     # 🔴 TDD tests
│   │   └── UserProfile.stories.tsx  # Visual documentation
│   └── ...
├── utils/
│   ├── validation.ts                # 🟢 Implementation  
│   ├── validation.test.ts           # 🔴 TDD tests
│   └── ...
└── hooks/
    ├── useAuth.ts                   # 🟢 Implementation
    ├── useAuth.test.ts              # 🔴 TDD tests  
    └── ...
```

#### TDD Commit Messages

```bash
# TDD commit pattern
git add . && git commit -m "🔴 RED: Add user validation test"
git add . && git commit -m "🟢 GREEN: Implement basic user validation"  
git add . && git commit -m "🔵 REFACTOR: Extract validation rules to separate methods"

# Or use conventional commits
git commit -m "test: 🔴 add email validation test"
git commit -m "feat: 🟢 implement email validation" 
git commit -m "refactor: 🔵 improve validation error messages"
```

---

## TDD Best Practices Summary

### ✅ DO

1. **Write the smallest possible failing test first**
2. **Write minimal code to make test pass**  
3. **Refactor only when tests are green**
4. **Commit at GREEN phase for safe refactoring**
5. **Use TDD for business logic and complex components**
6. **Keep TDD cycles short (minutes, not hours)**
7. **Let tests drive your API design**

### ❌ DON'T  

1. **Don't write multiple failing tests at once**
2. **Don't add extra functionality during GREEN phase**
3. **Don't refactor with failing tests**
4. **Don't skip tests for "simple" code**
5. **Don't use TDD for configuration or pure UI styling**
6. **Don't write tests after implementation (that's not TDD)**
7. **Don't ignore failing tests to "fix later"**

### 🎯 TDD Success Indicators

- **Fast feedback loop**: RED → GREEN cycles under 30 seconds
- **High confidence**: Any code change protected by tests
- **Better design**: APIs naturally testable and focused
- **Reduced debugging**: Issues caught immediately during development
- **Safe refactoring**: Green tests provide safety net for improvements

---

**🎉 You're ready to practice true TDD!** Start small, follow the cycle religiously, and watch your code quality and confidence improve dramatically.
