# Error Handling Conventions

*Established patterns and conventions for error handling and loading states*

## Overview

This document outlines the error handling conventions established in the VSME Guru application. These patterns have been implemented and tested, and should be followed for consistency across the codebase.

## Core Principles

1. **Fail Gracefully**: Never let errors crash the entire application
2. **Provide Context**: Give users clear, actionable error messages
3. **Enable Recovery**: Always provide a way for users to retry or recover
4. **Log for Debugging**: Capture error details for developers in development mode
5. **Consistent Experience**: Use the same error patterns across the application

## Error Boundary Implementation

### Required Pattern
All major components must be wrapped with error boundaries:

```typescript
import { ErrorBoundary } from '@/components/common/error-boundary'

// Standard implementation
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>

// Using HOC pattern
export default withErrorBoundary(YourComponent)
```

### Error Boundary Placement
- **Root Level**: App layout has global error boundary
- **Route Level**: Each major route section has error boundaries
- **Component Level**: Complex components have individual error boundaries
- **Provider Level**: Context providers wrapped with error boundaries

## Loading State Patterns

### Standard Loading Components
Use these established loading components:

```typescript
import { 
  InlineLoader, 
  PageLoader, 
  ButtonLoader, 
  DashboardLoading 
} from '@/components/common/loading'

// Button loading state
<Button disabled={isLoading}>
  {isLoading ? <ButtonLoader className="mr-2" /> : null}
  {isLoading ? 'Submitting...' : 'Submit'}
</Button>

// Page-level loading
if (isLoading) return <PageLoader text="Loading dashboard..." />

// Inline loading for small components
{isLoading ? <InlineLoader size="sm" /> : content}

// Dashboard skeleton loading
<DashboardLoading />
```

### Loading State Rules
1. **Always show loading states** for operations > 200ms
2. **Use skeleton loading** for complex layouts
3. **Disable interactive elements** during loading
4. **Provide loading text** for screen readers
5. **Use consistent loading indicators** across the app

## Error Display Patterns

### Standard Error Components
Use the ErrorDisplay component system:

```typescript
import { 
  ErrorDisplay, 
  NetworkError, 
  NotFoundError, 
  UnauthorizedError, 
  ServerError 
} from '@/components/common/error-display'

// Generic error display
<ErrorDisplay 
  error={error} 
  onRetry={handleRetry}
  variant="minimal"
  title="Custom Error Title"
/>

// Specialized error components
<NetworkError onRetry={handleRetry} />
<NotFoundError resource="user" onRetry={goBack} />
<UnauthorizedError onRetry={handleLogin} />
<ServerError onRetry={handleRetry} />
```

### Error Display Variants
- **default**: Full card layout with icon and detailed message
- **minimal**: Compact layout with border and background
- **inline**: Single line with icon and retry button

## Async Operation Patterns

### Standard Hooks
Use established async hooks for consistent behavior:

```typescript
import { useApiCall, useAsyncSubmit } from '@/hooks/use-async'

// For API calls
const { data, error, isLoading, isSuccess, execute } = useApiCall(
  apiFunction,
  { immediate: true, onSuccess: handleSuccess }
)

// For form submissions
const { submit, isLoading, error, reset } = useAsyncSubmit(
  submitFunction,
  { onSuccess: handleSuccess, onError: handleError }
)
```

### API Error Handling
Follow these patterns for API integration:

```typescript
// API utility usage
import { apiCalls, handleApiError } from '@/lib/api'

// Standard API call pattern
const fetchData = async () => {
  try {
    const result = await apiCalls.getData()
    if (result.error) {
      throw new Error(result.error)
    }
    return result.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}
```

## Next.js App Router Error Pages

### Required Error Pages
These error pages must be implemented:

1. **`error.tsx`**: Route-level error boundary
2. **`global-error.tsx`**: Global error fallback
3. **`not-found.tsx`**: Custom 404 page

### Error Page Pattern
```typescript
'use client'

import { useEffect } from 'react'
import { ErrorDisplay } from '@/components/common/error-display'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Route error:', error)
    }
  }, [error])

  return (
    <ErrorDisplay
      error={error.message}
      onRetry={reset}
      title="Something went wrong"
    />
  )
}
```

## Form Error Handling

### Form Validation Errors
Handle form validation consistently:

```typescript
// Using TanStack Form (when implemented)
const form = useForm({
  onSubmit: async ({ value }) => {
    try {
      await submitForm(value)
      toast.success('Form submitted successfully!')
    } catch (error) {
      toast.error(handleApiError(error))
    }
  }
})

// Field-level error display
{field.state.meta.errors && (
  <ErrorDisplay 
    error={field.state.meta.errors[0]} 
    variant="inline"
  />
)}
```

## Toast Notifications

### Toast Usage Patterns
Use Sonner for user feedback:

```typescript
import { toast } from 'sonner'

// Success notifications
toast.success('Operation completed successfully!')

// Error notifications
toast.error('Something went wrong. Please try again.')

// Loading with promise
const promise = submitData()
toast.promise(promise, {
  loading: 'Submitting...',
  success: 'Submitted successfully!',
  error: 'Failed to submit'
})
```

## Development vs Production

### Development Mode
- Show detailed error information
- Include stack traces in console
- Display error boundaries with debug info
- Log all errors to console

### Production Mode
- Show user-friendly error messages
- Hide technical details from users
- Send errors to monitoring service (future)
- Graceful fallback UI

## Testing Error Scenarios

### Required Tests
1. **Error Boundary Tests**: Verify error boundaries catch and display errors
2. **Loading State Tests**: Test loading indicators appear and disappear
3. **Retry Functionality Tests**: Verify retry buttons work correctly
4. **Network Error Tests**: Test offline/network failure scenarios
5. **Form Error Tests**: Test form validation and submission errors

### Testing Patterns
```typescript
// Error boundary testing
const ThrowError = () => {
  throw new Error('Test error')
}

render(
  <ErrorBoundary>
    <ThrowError />
  </ErrorBoundary>
)

expect(screen.getByText('Something went wrong')).toBeInTheDocument()
```

## Performance Considerations

### Error Handling Performance
1. **Lazy load error components** when possible
2. **Avoid error boundary re-renders** with proper key usage
3. **Debounce retry attempts** to prevent spam
4. **Cache error states** to avoid repeated failures

### Loading State Performance
1. **Use skeleton loading** instead of spinners for better perceived performance
2. **Implement progressive loading** for complex data
3. **Avoid layout shifts** with consistent loading placeholders
4. **Optimize loading animations** for smooth experience

## Accessibility Requirements

### Error Accessibility
- Use `aria-live="polite"` for error announcements
- Provide clear, descriptive error messages
- Ensure error states are keyboard accessible
- Use proper color contrast for error indicators

### Loading Accessibility
- Use `aria-busy="true"` during loading states
- Provide loading announcements for screen readers
- Ensure loading states don't trap keyboard focus
- Use semantic HTML for loading indicators

## Documentation References

- **Implementation Guide**: `docs/ERROR_HANDLING_IMPLEMENTATION.md`
- **Best Practices Review**: `docs/ERROR_HANDLING_REVIEW_2024.md`
- **Component Documentation**: Individual component files have JSDoc comments
- **API Documentation**: `apps/web/src/lib/api.ts` contains usage examples

## Future Enhancements

### Planned Improvements
1. **Error Reporting Integration**: Sentry or similar service
2. **Offline Error Handling**: Network status detection
3. **Error Analytics**: User experience metrics
4. **Internationalization**: Localized error messages
5. **Advanced Recovery**: Automatic retry strategies

### Migration Path
When adopting React 19 features:
1. **Actions Integration**: Migrate forms to use React 19 Actions
2. **Enhanced Transitions**: Use improved useTransition for loading states
3. **Suspense Boundaries**: Add Suspense for better streaming
4. **Server Component Errors**: Enhanced server-side error handling

---

*These conventions are based on the current implementation and should be followed for consistency. Update this document when patterns evolve or new requirements emerge.*