# Basic Hook Pattern

## 🎯 Purpose

Test custom React hooks using TDD methodology with proper state management, side effects, and lifecycle testing.

**Use this pattern when:**
- Creating custom React hooks
- Testing state management logic
- Following TDD approach for hook development
- Ensuring hooks work correctly in isolation

## 🔴 TDD Approach

### RED Phase: Define Hook Contract
```tsx
// 🔴 RED: Write failing test first - define what hook should return
test('returns initial count value', () => {
  const { result } = renderHook(() => useCounter(5))
  
  expect(result.current.count).toBe(5)
  expect(result.current.increment).toBeTypeOf('function')
})
```

### GREEN Phase: Minimal Implementation
```tsx
// 🟢 GREEN: Create minimal hook to pass test
function useCounter(initialValue: number) {
  return {
    count: initialValue,
    increment: () => {} // Minimal implementation
  }
}
```

### REFACTOR Phase: Add Real Functionality
```tsx
// 🔵 REFACTOR: Implement proper state management
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue)
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1)
  }, [])
  
  const decrement = useCallback(() => {
    setCount(prev => prev - 1)
  }, [])
  
  return { count, increment, decrement }
}
```

## 📋 Template

```tsx
// src/hooks/useYourHook.test.ts
import { renderHook, act } from '@testing-library/react'
import { expect, test, describe, vi } from 'vitest'
import { useYourHook } from './useYourHook'

describe('10.3-UNIT-003: useYourHook', () => {
  // 🔴 RED: Initial state
  test('returns initial state correctly', () => {
    const { result } = renderHook(() => useYourHook('initialValue'))
    
    expect(result.current.value).toBe('initialValue')
    expect(result.current.setValue).toBeTypeOf('function')
    expect(result.current.reset).toBeTypeOf('function')
  })

  // 🔴 RED: State updates
  test('updates state when setValue is called', () => {
    const { result } = renderHook(() => useYourHook('initial'))
    
    act(() => {
      result.current.setValue('updated')
    })
    
    expect(result.current.value).toBe('updated')
  })

  // 🔴 RED: Multiple state updates
  test('handles multiple state updates', () => {
    const { result } = renderHook(() => useYourHook(0))
    
    act(() => {
      result.current.setValue(1)
      result.current.setValue(2)
      result.current.setValue(3)
    })
    
    expect(result.current.value).toBe(3)
  })

  // 🔴 RED: Reset functionality
  test('resets to initial value', () => {
    const initialValue = 'initial'
    const { result } = renderHook(() => useYourHook(initialValue))
    
    act(() => {
      result.current.setValue('changed')
    })
    
    expect(result.current.value).toBe('changed')
    
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.value).toBe(initialValue)
  })

  // 🔴 RED: Hook dependencies (if any)
  test('updates when dependencies change', () => {
    let dependency = 'dep1'
    const { result, rerender } = renderHook(() => useYourHook(dependency))
    
    expect(result.current.value).toBe('dep1')
    
    dependency = 'dep2'
    rerender()
    
    expect(result.current.value).toBe('dep2')
  })

  // 🔴 RED: Cleanup behavior
  test('cleans up correctly on unmount', () => {
    const cleanup = vi.fn()
    const { unmount } = renderHook(() => useYourHookWithCleanup(cleanup))
    
    unmount()
    
    expect(cleanup).toHaveBeenCalledTimes(1)
  })
})
```

## 💡 Real Example

```tsx
// src/hooks/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react'
import { expect, test, describe, vi, beforeEach } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('10.3-UNIT-004: useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  // 🔴 RED: Initial value from localStorage
  test('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current[0]).toBe('default')
  })

  test('returns stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current[0]).toBe('stored-value')
  })

  // 🔴 RED: Setting values
  test('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(result.current[0]).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'))
  })

  test('handles function updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))
    
    act(() => {
      result.current[1](prev => prev + 1)
    })
    
    expect(result.current[0]).toBe(1)
  })

  // 🔴 RED: Error handling
  test('handles localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('Storage full')
      })
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    // Should not crash, but should log error
    expect(consoleSpy).toHaveBeenCalledWith('Error saving to localStorage:', expect.any(Error))
    
    setItemSpy.mockRestore()
    consoleSpy.mockRestore()
  })

  // 🔴 RED: JSON parsing errors
  test('handles invalid JSON gracefully', () => {
    localStorage.setItem('test-key', 'invalid-json-{')
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    
    expect(result.current[0]).toBe('default') // Should fall back to default
    expect(consoleSpy).toHaveBeenCalledWith('Error parsing localStorage value:', expect.any(Error))
    
    consoleSpy.mockRestore()
  })

  // 🔴 RED: Complex object storage
  test('handles complex objects correctly', () => {
    const complexObject = {
      user: { id: 1, name: 'John' },
      settings: { theme: 'dark', notifications: true }
    }
    
    const { result } = renderHook(() => useLocalStorage('user-data', null))
    
    act(() => {
      result.current[1](complexObject)
    })
    
    expect(result.current[0]).toEqual(complexObject)
    expect(JSON.parse(localStorage.getItem('user-data')!)).toEqual(complexObject)
  })
})

// 🟢 GREEN: Implementation driven by tests
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error parsing localStorage value:', error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to localStorage
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}
```

## 🧰 Integration

### With Project Infrastructure

```tsx
// Works with existing test setup
import { renderHook, act } from '@testing-library/react'  // Already configured
import { expect, test, describe, vi } from 'vitest'        // Available

// Uses path aliases
import { useCounter } from '@/hooks/useCounter'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Integrates with existing mocks (localStorage already mocked)
test('works with mocked localStorage', () => {
  const { result } = renderHook(() => useLocalStorage('key', 'default'))
  
  act(() => {
    result.current[1]('value')
  })
  
  expect(localStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify('value'))
})
```

### With Context Providers

```tsx
// For hooks that need context
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/ThemeContext'

function renderHookWithProviders<T>(hook: () => T) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )

  return renderHook(hook, { wrapper })
}

test('works with providers', () => {
  const { result } = renderHookWithProviders(() => useThemeHook())
  
  expect(result.current.theme).toBeDefined()
})
```

## 🚨 Common Issues

### Issue: Not Using act() for State Updates

**Problem:**
```tsx
// ❌ State updates not wrapped in act()
test('updates state', () => {
  const { result } = renderHook(() => useCounter())
  
  result.current.increment() // Warning: not wrapped in act()
  
  expect(result.current.count).toBe(1)
})
```

**Solution:**
```tsx
// ✅ Wrap state updates in act()
test('updates state', () => {
  const { result } = renderHook(() => useCounter())
  
  act(() => {
    result.current.increment()
  })
  
  expect(result.current.count).toBe(1)
})
```

### Issue: Testing Implementation Details

**Problem:**
```tsx
// ❌ Testing internal state structure
test('has correct internal state', () => {
  const { result } = renderHook(() => useCounter())
  
  expect(result.current._internalState).toBeDefined()
})
```

**Solution:**
```tsx
// ✅ Test public interface and behavior
test('provides expected API', () => {
  const { result } = renderHook(() => useCounter())
  
  expect(result.current).toHaveProperty('count')
  expect(result.current).toHaveProperty('increment')
  expect(result.current.increment).toBeTypeOf('function')
})
```

### Issue: Not Testing Cleanup

**Problem:**
```tsx
// ❌ Not testing useEffect cleanup
function useTimer() {
  useEffect(() => {
    const interval = setInterval(() => {}, 1000)
    return () => clearInterval(interval)
  }, [])
}
```

**Solution:**
```tsx
// ✅ Test cleanup behavior
test('cleans up timer on unmount', () => {
  const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
  
  const { unmount } = renderHook(() => useTimer())
  
  unmount()
  
  expect(clearIntervalSpy).toHaveBeenCalled()
  
  clearIntervalSpy.mockRestore()
})
```

### Issue: Async Hook Testing

**Problem:**
```tsx
// ❌ Not handling async operations properly
test('fetches data', () => {
  const { result } = renderHook(() => useAsyncData())
  
  expect(result.current.data).toBeDefined() // Might not be ready yet
})
```

**Solution:**
```tsx
// ✅ Wait for async operations
test('fetches data', async () => {
  const { result } = renderHook(() => useAsyncData())
  
  await waitFor(() => {
    expect(result.current.data).toBeDefined()
  })
})
```

## Best Practices

### ✅ DO
- Use `renderHook` from `@testing-library/react-hooks` for hook testing
- Wrap state updates in `act()`
- Test the hook's public interface, not internal implementation
- Test cleanup behavior for hooks with side effects
- Use `waitFor` for async operations
- Test error conditions and edge cases

### ❌ DON'T
- Test hooks by rendering them in components (unless integration testing)
- Forget to wrap state updates in `act()`
- Test private internal state directly
- Skip cleanup testing for hooks with side effects
- Use `setTimeout` to wait for async operations
- Test only the happy path

### Hook Testing Patterns

```tsx
describe('useYourHook', () => {
  describe('initialization', () => {
    // Test initial state and return values
  })

  describe('state updates', () => {
    // Test state changes and function calls
  })

  describe('side effects', () => {
    // Test useEffect, cleanup, etc.
  })

  describe('error handling', () => {
    // Test error conditions and recovery
  })

  describe('cleanup', () => {
    // Test unmount behavior
  })
})
```

---

**Next Steps:**
- Apply this pattern to your custom hooks
- See [Async Hook Pattern](./async-hook.md) for data fetching hooks
- Check [Context Hook Pattern](./context-hook.md) for context-dependent hooks
