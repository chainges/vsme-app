# Regex Linting Best Practice

## Issue
Biome lint rule `performance/useTopLevelRegex` flags regex literals that are not defined in the top-level scope. This can lead to performance issues if the function containing the regex is called frequently, as the regex object would be recreated on each call.

## Solution
Move all regex literals to the top-level scope of the module as constants.

## Example

### Before (causes lint error)
```typescript
it('should validate form fields', async () => {
  const addButton = screen.getByRole('button', { name: /add Workforce Development/i })
  // ... rest of test
})
```

### After (fixes lint error)
```typescript
// Define regex constants at the top of the file
const ADD_WORKFORCE_DEV_REGEX = /add Workforce Development/i

describe('Component Tests', () => {
  it('should validate form fields', async () => {
    const addButton = screen.getByRole('button', { name: ADD_WORKFORCE_DEV_REGEX })
    // ... rest of test
  })
})
```

## Reasoning
- Regex literals in JavaScript/TypeScript create new RegExp objects each time they are evaluated
- When placed inside functions that are called frequently, this results in unnecessary object creation
- Moving regex literals to the top level ensures they are created once when the module is loaded
- This follows the general principle of avoiding object creation in hot paths

## When to Apply
- All test files using regex in queries for Testing Library
- Any frequently called functions containing regex literals
- Component files with regex used in event handlers or render functions