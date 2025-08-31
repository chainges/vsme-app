# POST Endpoint Pattern

## 🎯 Purpose

Test API POST endpoints using TDD methodology with MSW (Mock Service Worker) for realistic request/response testing.

**Use this pattern when:**
- Creating API endpoints that accept data
- Testing data validation and processing
- Following TDD approach for backend development
- Ensuring proper error handling and responses

## 🔴 TDD Approach

### RED Phase: Define API Contract
```tsx
// 🔴 RED: Write failing test first - define what endpoint should do
test('creates user with valid data', async () => {
  const userData = { name: 'John Doe', email: 'john@example.com' }
  
  const response = await request(app).post('/api/users').send(userData)
  
  expect(response.status).toBe(201)
  expect(response.body.user.name).toBe('John Doe')
  expect(response.body.user.id).toBeDefined()
})
```

### GREEN Phase: Minimal Implementation
```tsx
// 🟢 GREEN: Create minimal endpoint to pass test
app.post('/api/users', (req, res) => {
  res.status(201).json({
    user: {
      id: '1',
      name: req.body.name,
      email: req.body.email
    }
  })
})
```

### REFACTOR Phase: Add Validation and Logic
```tsx
// 🔵 REFACTOR: Add proper validation and error handling
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = userSchema.parse(req.body)
    
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }
    
    const user = await User.create({ name, email })
    res.status(201).json({ user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
```

## 📋 Template

```tsx
// src/app/api/your-endpoint/route.test.ts
import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { POST } from './route'

describe('10.3-INTEGRATION-005: POST /api/your-endpoint', () => {
  // 🔴 RED: Success scenarios
  test('creates resource with valid data', async () => {
    const validData = {
      name: 'Test Resource',
      description: 'Test description'
    }
    
    const request = new Request('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify(validData),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data.resource.name).toBe('Test Resource')
    expect(data.resource.id).toBeDefined()
  })

  // 🔴 RED: Validation errors
  test('returns 400 for missing required fields', async () => {
    const invalidData = { description: 'Missing name' }
    
    const request = new Request('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify(invalidData),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toContain('name')
  })

  test('returns 400 for invalid data format', async () => {
    const invalidData = {
      name: '', // Invalid empty name
      description: 'a'.repeat(1001) // Too long
    }
    
    const request = new Request('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify(invalidData),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(400)
  })

  // 🔴 RED: Duplicate handling
  test('returns 409 for duplicate resource', async () => {
    const duplicateData = {
      name: 'Existing Resource',
      description: 'This already exists'
    }
    
    // Create first resource
    await POST(new Request('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify(duplicateData),
      headers: { 'Content-Type': 'application/json' }
    }))
    
    // Try to create duplicate
    const request = new Request('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify(duplicateData),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(409)
  })

  // 🔴 RED: Malformed JSON
  test('returns 400 for malformed JSON', async () => {
    const request = new Request('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: 'invalid-json-{',
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(400)
  })

  // 🔴 RED: Content-Type validation
  test('returns 415 for unsupported content type', async () => {
    const request = new Request('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: 'name=test',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(415)
  })

  // 🔴 RED: Large payload handling
  test('returns 413 for payload too large', async () => {
    const largeData = {
      name: 'Test',
      description: 'a'.repeat(1000000) // 1MB string
    }
    
    const request = new Request('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify(largeData),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(413)
  })
})
```

## 💡 Real Example

```tsx
// src/app/api/users/route.test.ts
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { POST } from './route'

// Mock database
vi.mock('@/lib/database', () => ({
  createUser: vi.fn(),
  findUserByEmail: vi.fn()
}))

import { createUser, findUserByEmail } from '@/lib/database'

describe('10.3-INTEGRATION-006: POST /api/users', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 🔴 RED: Successful user creation
  test('creates user with valid data', async () => {
    const userData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 28
    }

    vi.mocked(findUserByEmail).mockResolvedValue(null)
    vi.mocked(createUser).mockResolvedValue({
      id: 'user_123',
      ...userData,
      createdAt: '2024-01-01T00:00:00.000Z'
    })
    
    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data.user.name).toBe('Jane Smith')
    expect(data.user.id).toBe('user_123')
    expect(findUserByEmail).toHaveBeenCalledWith('jane@example.com')
    expect(createUser).toHaveBeenCalledWith(userData)
  })

  // 🔴 RED: Email validation
  test('rejects invalid email format', async () => {
    const invalidUserData = {
      name: 'John Doe',
      email: 'not-an-email',
      age: 25
    }
    
    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(invalidUserData),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toMatch(/email/i)
  })

  // 🔴 RED: Duplicate email handling
  test('prevents duplicate email registration', async () => {
    const userData = {
      name: 'Bob Wilson',
      email: 'existing@example.com',
      age: 30
    }

    vi.mocked(findUserByEmail).mockResolvedValue({
      id: 'existing_user',
      email: 'existing@example.com'
    })
    
    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(409)
    expect(data.error).toMatch(/email.*already.*exists/i)
    expect(createUser).not.toHaveBeenCalled()
  })

  // 🔴 RED: Age validation
  test('validates age constraints', async () => {
    const underageUser = {
      name: 'Minor User',
      email: 'minor@example.com',
      age: 12
    }
    
    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(underageUser),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toMatch(/age.*must.*be.*at.*least/i)
  })

  // 🔴 RED: Database error handling
  test('handles database errors gracefully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      age: 25
    }

    vi.mocked(findUserByEmail).mockResolvedValue(null)
    vi.mocked(createUser).mockRejectedValue(new Error('Database connection failed'))
    
    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })

  // 🔴 RED: Required fields validation
  test('validates all required fields', async () => {
    const incompleteData = {
      email: 'incomplete@example.com'
      // Missing name and age
    }
    
    const request = new Request('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(incompleteData),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data.error).toMatch(/name.*required/i)
  })
})

// 🟢 GREEN: Implementation driven by tests
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(13, 'Age must be at least 13')
})

export async function POST(request: Request) {
  try {
    // Validate content type
    const contentType = request.headers.get('Content-Type')
    if (contentType !== 'application/json') {
      return Response.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return Response.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      )
    }

    const userData = userSchema.parse(body)

    // Check for existing user
    const existingUser = await findUserByEmail(userData.email)
    if (existingUser) {
      return Response.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // Create user
    const user = await createUser(userData)

    return Response.json({ user }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('User creation error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## 🧰 Integration

### With MSW (Mock Service Worker)

```tsx
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/users', async ({ request }) => {
    const userData = await request.json()
    
    // Mock validation
    if (!userData.name) {
      return HttpResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      user: {
        id: 'mock_user_id',
        ...userData,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 })
  })
]

// src/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

### With Test Setup

```tsx
// src/test-utils/api-test-utils.ts
export function createApiRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  headers: Record<string, string> = {}
) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers
  }

  return new Request(`http://localhost:3000${endpoint}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: defaultHeaders
  })
}

// Usage in tests
test('creates user', async () => {
  const request = createApiRequest('/api/users', 'POST', {
    name: 'John Doe',
    email: 'john@example.com'
  })
  
  const response = await POST(request)
  // Test assertions
})
```

## 🚨 Common Issues

### Issue: Not Testing Edge Cases

**Problem:**
```tsx
// ❌ Only testing happy path
test('creates user', async () => {
  const response = await POST(validRequest)
  expect(response.status).toBe(201)
})
```

**Solution:**
```tsx
// ✅ Test comprehensive scenarios
describe('user creation', () => {
  test('succeeds with valid data', async () => {
    // Happy path
  })
  
  test('fails with invalid email', async () => {
    // Validation error
  })
  
  test('handles database errors', async () => {
    // Error handling
  })
  
  test('prevents duplicates', async () => {
    // Business logic
  })
})
```

### Issue: Not Mocking Dependencies

**Problem:**
```tsx
// ❌ Using real database in unit tests
test('creates user', async () => {
  // This hits real database
  const response = await POST(request)
})
```

**Solution:**
```tsx
// ✅ Mock external dependencies
vi.mock('@/lib/database', () => ({
  createUser: vi.fn(),
  findUserByEmail: vi.fn()
}))

test('creates user', async () => {
  vi.mocked(createUser).mockResolvedValue(mockUser)
  // Test implementation
})
```

### Issue: Not Testing Error Responses

**Problem:**
```tsx
// ❌ Not testing error scenarios
test('handles invalid data', async () => {
  const response = await POST(invalidRequest)
  // No specific error testing
})
```

**Solution:**
```tsx
// ✅ Test specific error responses
test('returns 400 for missing name', async () => {
  const response = await POST(requestWithoutName)
  const data = await response.json()
  
  expect(response.status).toBe(400)
  expect(data.error).toMatch(/name.*required/i)
})
```

## Best Practices

### ✅ DO
- Test all HTTP status codes your endpoint can return
- Validate request body parsing and validation
- Test error handling and edge cases
- Mock external dependencies (database, APIs)
- Use descriptive test names that explain the scenario
- Test authentication and authorization if applicable

### ❌ DON'T
- Use real databases or external services in unit tests
- Only test the happy path
- Ignore request validation
- Skip error response testing
- Use hardcoded values without explanation
- Test multiple concerns in a single test

### API Testing Patterns

```tsx
describe('POST /api/endpoint', () => {
  describe('success scenarios', () => {
    // Valid requests and expected responses
  })

  describe('validation errors', () => {
    // Invalid input handling
  })

  describe('business logic errors', () => {
    // Duplicates, conflicts, etc.
  })

  describe('system errors', () => {
    // Database errors, network issues
  })

  describe('security', () => {
    // Authentication, authorization
  })
})
```

---

**Next Steps:**
- Apply this pattern to your API endpoints
- See [Authentication Pattern](./authentication.md) for auth-protected endpoints
- Check [Error Response Pattern](./error-response.md) for comprehensive error handling
