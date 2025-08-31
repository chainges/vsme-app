# Pure Function Pattern

## 🎯 Purpose

Test pure functions and business logic using TDD methodology with comprehensive edge case coverage and error handling validation.

**Use this pattern when:**
- Creating utility functions with business logic
- Testing data transformations and calculations
- Following TDD approach for algorithmic code
- Ensuring comprehensive input/output validation

## 🔴 TDD Approach

### RED Phase: Define Function Contract
```tsx
// 🔴 RED: Write failing test first - define what function should do
test('calculates total price with tax', () => {
  const result = calculateTotalPrice(100, 0.08)
  
  expect(result).toBe(108)
})
```

### GREEN Phase: Minimal Implementation
```tsx
// 🟢 GREEN: Write minimal code to pass
function calculateTotalPrice(price: number, taxRate: number): number {
  return 108 // Hard-coded to make test pass
}
```

### REFACTOR Phase: Proper Implementation
```tsx
// 🔵 REFACTOR: Implement proper logic after more tests drive requirements
function calculateTotalPrice(price: number, taxRate: number): number {
  if (price < 0) throw new Error('Price cannot be negative')
  if (taxRate < 0) throw new Error('Tax rate cannot be negative')
  
  return price + (price * taxRate)
}
```

## 📋 Template

```tsx
// src/utils/yourUtility.test.ts
import { describe, test, expect } from 'vitest'
import { yourUtility } from './yourUtility'

describe('10.3-UNIT-001: yourUtility', () => {
  // 🔴 RED: Happy path - main functionality
  test('handles normal input correctly', () => {
    const result = yourUtility('input', 'params')
    
    expect(result).toBe('expected_output')
  })

  // 🔴 RED: Edge cases
  test('handles empty input', () => {
    const result = yourUtility('', 'params')
    
    expect(result).toBe('') // or appropriate empty result
  })

  test('handles null input', () => {
    const result = yourUtility(null, 'params')
    
    expect(result).toBeNull() // or appropriate null handling
  })

  test('handles undefined input', () => {
    const result = yourUtility(undefined, 'params')
    
    expect(result).toBeUndefined() // or throw error
  })

  // 🔴 RED: Error conditions
  test('throws on invalid input', () => {
    expect(() => yourUtility('invalid', 'params')).toThrow('Invalid input')
  })

  test('throws with specific error message', () => {
    expect(() => yourUtility('bad', 'params')).toThrow(/must be valid/)
  })

  // 🔴 RED: Boundary conditions
  test('handles minimum boundary values', () => {
    const result = yourUtility(Number.MIN_VALUE, 'params')
    
    expect(result).toBeDefined()
  })

  test('handles maximum boundary values', () => {
    const result = yourUtility(Number.MAX_VALUE, 'params')
    
    expect(result).toBeDefined()
  })

  // 🔴 RED: Complex scenarios
  test('handles complex input combinations', () => {
    const result = yourUtility(['a', 'b', 'c'], { option: true })
    
    expect(result).toEqual(['A', 'B', 'C'])
  })

  // 🔴 RED: Performance (if applicable)
  test('performs efficiently with large input', () => {
    const largeInput = Array.from({ length: 10000 }, (_, i) => i)
    const startTime = performance.now()
    
    const result = yourUtility(largeInput, 'params')
    
    const duration = performance.now() - startTime
    expect(duration).toBeLessThan(100) // 100ms threshold
    expect(result).toBeDefined()
  })
})
```

## 💡 Real Example

```tsx
// src/utils/priceCalculator.test.ts
import { describe, test, expect } from 'vitest'
import { PriceCalculator } from './priceCalculator'

describe('10.3-UNIT-002: PriceCalculator', () => {
  const calculator = new PriceCalculator()

  // 🔴 RED: Basic price calculation
  test('calculates price with tax', () => {
    const result = calculator.calculateTotal(100, 0.08)
    
    expect(result).toBe(108)
  })

  test('calculates price with zero tax', () => {
    const result = calculator.calculateTotal(50, 0)
    
    expect(result).toBe(50)
  })

  // 🔴 RED: Discount scenarios
  test('applies percentage discount', () => {
    const result = calculator.calculateWithDiscount(100, 10) // 10% discount
    
    expect(result).toBe(90)
  })

  test('applies fixed amount discount', () => {
    const result = calculator.calculateWithFixedDiscount(100, 15) // $15 off
    
    expect(result).toBe(85)
  })

  // 🔴 RED: Error conditions
  test('throws on negative price', () => {
    expect(() => calculator.calculateTotal(-10, 0.08)).toThrow('Price cannot be negative')
  })

  test('throws on negative tax rate', () => {
    expect(() => calculator.calculateTotal(100, -0.05)).toThrow('Tax rate cannot be negative')
  })

  test('throws on excessive discount', () => {
    expect(() => calculator.calculateWithDiscount(100, 150)).toThrow('Discount cannot exceed 100%')
  })

  // 🔴 RED: Precision handling
  test('handles decimal precision correctly', () => {
    const result = calculator.calculateTotal(10.99, 0.0875)
    
    expect(result).toBeCloseTo(11.95, 2) // Round to 2 decimal places
  })

  // 🔴 RED: Complex scenarios
  test('calculates total with both tax and discount', () => {
    const price = 100
    const taxRate = 0.08
    const discountPercent = 10
    
    const result = calculator.calculateTotalWithDiscount(price, taxRate, discountPercent)
    // (100 - 10) * 1.08 = 97.20
    
    expect(result).toBeCloseTo(97.20, 2)
  })
})

// 🟢 GREEN: Implementation driven by tests
export class PriceCalculator {
  calculateTotal(price: number, taxRate: number): number {
    this.validatePrice(price)
    this.validateTaxRate(taxRate)
    
    return price + (price * taxRate)
  }

  calculateWithDiscount(price: number, discountPercent: number): number {
    this.validatePrice(price)
    this.validateDiscount(discountPercent)
    
    const discount = price * (discountPercent / 100)
    return price - discount
  }

  calculateWithFixedDiscount(price: number, discountAmount: number): number {
    this.validatePrice(price)
    
    if (discountAmount > price) {
      throw new Error('Discount amount cannot exceed price')
    }
    
    return price - discountAmount
  }

  calculateTotalWithDiscount(
    price: number, 
    taxRate: number, 
    discountPercent: number
  ): number {
    const discountedPrice = this.calculateWithDiscount(price, discountPercent)
    return this.calculateTotal(discountedPrice, taxRate)
  }

  private validatePrice(price: number): void {
    if (price < 0) throw new Error('Price cannot be negative')
  }

  private validateTaxRate(taxRate: number): void {
    if (taxRate < 0) throw new Error('Tax rate cannot be negative')
  }

  private validateDiscount(discountPercent: number): void {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Discount cannot exceed 100%')
    }
  }
}
```

## 🧰 Integration

### With Project Infrastructure

```tsx
// Works with existing test setup
import { describe, test, expect } from 'vitest'   // Already configured

// Uses path aliases
import { calculatePrice } from '@/utils/pricing'
import { validateInput } from '@/utils/validation'
import { formatCurrency } from '@/utils/formatters'

// Can integrate with other utilities
test('works with other utilities', () => {
  const price = calculatePrice(100, 0.08)
  const formatted = formatCurrency(price)
  
  expect(formatted).toBe('$108.00')
})
```

### With Type Safety

```tsx
// Leverages TypeScript for better testing
type CalculationParams = {
  basePrice: number
  taxRate: number
  discountPercent?: number
}

function calculatePrice(params: CalculationParams): number {
  // Implementation
}

test('enforces type safety', () => {
  const result = calculatePrice({
    basePrice: 100,
    taxRate: 0.08,
    discountPercent: 10
  })
  
  expect(result).toBeTypeOf('number')
})
```

## 🚨 Common Issues

### Issue: Floating Point Precision

**Problem:**
```tsx
// ❌ Floating point precision issues
test('calculates correctly', () => {
  expect(0.1 + 0.2).toBe(0.3) // Fails due to precision
})
```

**Solution:**
```tsx
// ✅ Use toBeCloseTo for floating point comparisons
test('calculates correctly', () => {
  expect(0.1 + 0.2).toBeCloseTo(0.3, 10)
})

// ✅ Or use specific precision handling
test('handles currency precision', () => {
  const result = calculatePrice(10.99, 0.0875)
  expect(Number(result.toFixed(2))).toBe(11.95)
})
```

### Issue: Not Testing Edge Cases

**Problem:**
```tsx
// ❌ Only testing happy path
test('calculates tax', () => {
  expect(calculateTax(100, 0.08)).toBe(108)
})
```

**Solution:**
```tsx
// ✅ Test comprehensive edge cases
test('handles zero values', () => {
  expect(calculateTax(0, 0.08)).toBe(0)
})

test('handles negative values', () => {
  expect(() => calculateTax(-100, 0.08)).toThrow()
})

test('handles extreme values', () => {
  expect(calculateTax(Number.MAX_VALUE, 0)).toBe(Number.MAX_VALUE)
})
```

### Issue: Missing Error Testing

**Problem:**
```tsx
// ❌ Not testing error conditions
function divide(a: number, b: number): number {
  return a / b
}
```

**Solution:**
```tsx
// ✅ Test error conditions thoroughly
test('throws on division by zero', () => {
  expect(() => divide(10, 0)).toThrow('Division by zero')
})

test('handles invalid inputs', () => {
  expect(() => divide(NaN, 5)).toThrow('Invalid input')
  expect(() => divide(5, NaN)).toThrow('Invalid input')
})
```

### Issue: Testing Implementation vs Behavior

**Problem:**
```tsx
// ❌ Testing internal implementation
test('uses correct algorithm', () => {
  const spy = vi.spyOn(Math, 'round')
  calculatePrice(10.99, 0.08)
  expect(spy).toHaveBeenCalled()
})
```

**Solution:**
```tsx
// ✅ Test behavior and output
test('returns correctly rounded result', () => {
  const result = calculatePrice(10.99, 0.0875)
  expect(result).toBeCloseTo(11.95, 2)
})
```

## Best Practices

### ✅ DO
- Test the full range of inputs (happy path, edge cases, error conditions)
- Use descriptive test names that explain the scenario
- Test one behavior per test case
- Use `toBeCloseTo` for floating-point comparisons
- Follow TDD: write tests before implementation
- Validate error messages, not just that errors are thrown

### ❌ DON'T
- Test only the happy path
- Use `toBe` for floating-point comparisons
- Write overly complex test setup
- Test private methods directly (test through public interface)
- Skip edge cases because they "rarely happen"
- Write tests after implementation (breaks TDD)

### Test Organization

```tsx
describe('UtilityFunction', () => {
  describe('happy path scenarios', () => {
    // Normal usage tests
  })

  describe('edge cases', () => {
    // Boundary conditions, empty inputs, etc.
  })

  describe('error conditions', () => {
    // Invalid inputs, error scenarios
  })

  describe('performance', () => {
    // Performance-critical scenarios (if applicable)
  })
})
```

---

**Next Steps:**
- Apply this pattern to your business logic functions  
- See [Error Handling Pattern](./error-handling.md) for complex error scenarios
- Check [Validation Schema Pattern](./validation-schema.md) for Zod integration
