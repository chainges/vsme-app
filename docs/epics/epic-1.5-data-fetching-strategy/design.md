# Data Fetching Strategy Design

## Overview

This design outlines a comprehensive data fetching architecture that integrates both primary and external MongoDB Atlas databases with TanStack Query for efficient client-side state management. The architecture supports authentication-aware data access, robust error handling, and optimized caching strategies while maintaining type safety throughout the stack.

## Architecture

### Data Flow Architecture
```
Frontend (React + TanStack Query)
    ↓ API Calls
Hono API Server
    ↓ Database Operations
┌─────────────────┬─────────────────┐
│ Primary DB      │ External DB     │
│ (MongoDB Atlas) │ (MongoDB Atlas) │
│ - User data     │ - Shared data   │
│ - App-specific  │ - Read-only     │
│ - Full CRUD     │ - GET only      │
└─────────────────┴─────────────────┘
```

### Component Architecture
```
App Layout
├── QueryClientProvider (TanStack Query)
├── AuthProvider (Clerk)
└── Application Components
    ├── Data Fetching Hooks
    │   ├── usePrimaryData (CRUD operations)
    │   ├── useExternalData (Read operations)
    │   └── useAuthenticatedQuery (Protected data)
    ├── Error Boundaries
    └── Loading States
```

## Database Architecture

### Primary Database Configuration
```typescript
// apps/server/src/lib/primary-db.ts
import { PrismaClient } from '../prisma/generated/client'

export const primaryDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PRIMARY_DATABASE_URL
    }
  },
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
})
```

### External Database Configuration
```typescript
// apps/server/src/lib/external-db.ts
import { MongoClient } from 'mongodb'

class ExternalDbClient {
  private client: MongoClient
  
  constructor() {
    this.client = new MongoClient(process.env.EXTERNAL_DATABASE_URL!)
  }
  
  async connect() {
    await this.client.connect()
  }
  
  getDatabase(name: string) {
    return this.client.db(name)
  }
}

export const externalDb = new ExternalDbClient()
```

## API Layer Design

### Primary Database Routes
```typescript
// apps/server/src/routes/primary-data.ts
import { Hono } from 'hono'
import { z } from 'zod'
import { primaryDb } from '../lib/primary-db'
import { authMiddleware } from '../middleware/auth'

const primaryData = new Hono()

// Protected route with Clerk authentication
primaryData.use('/*', authMiddleware)

// GET /api/v1/primary-data/users
primaryData.get('/users', async (c) => {
  try {
    const userId = c.get('userId') // From Clerk middleware
    const users = await primaryDb.user.findMany({
      where: { organizationId: userId }
    })
    return c.json({ data: users })
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

// POST /api/v1/primary-data/users
primaryData.post('/users', async (c) => {
  const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email()
  })
  
  try {
    const body = await c.req.json()
    const validatedData = createUserSchema.parse(body)
    const userId = c.get('userId')
    
    const user = await primaryDb.user.create({
      data: {
        ...validatedData,
        createdBy: userId
      }
    })
    
    return c.json({ data: user }, 201)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400)
    }
    return c.json({ error: 'Failed to create user' }, 500)
  }
})
```

### External Database Routes
```typescript
// apps/server/src/routes/external-data.ts
import { Hono } from 'hono'
import { z } from 'zod'
import { externalDb } from '../lib/external-db'
import { authMiddleware } from '../middleware/auth'

const externalData = new Hono()

// Protected route - requires authentication
externalData.use('/*', authMiddleware)

// External data response schema for validation
const externalDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  data: z.record(z.any()),
  createdAt: z.string().datetime()
})

// GET /api/v1/external-data/shared-resources
externalData.get('/shared-resources', async (c) => {
  try {
    const database = externalDb.getDatabase('shared_app')
    const collection = database.collection('resources')
    
    const resources = await collection.find({}).toArray()
    
    // Validate external data structure
    const validatedResources = resources.map(resource => 
      externalDataSchema.parse(resource)
    )
    
    return c.json({ data: validatedResources })
  } catch (error) {
    console.error('External data fetch error:', error)
    return c.json({ error: 'Failed to fetch external data' }, 500)
  }
})
```

## Frontend Architecture

### TanStack Query Configuration
```typescript
// apps/web/src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 429
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status
          if (status >= 400 && status < 500 && status !== 429) {
            return false
          }
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    },
    mutations: {
      retry: 1
    }
  }
})
```

### Query Provider Setup
```typescript
// apps/web/src/components/providers/query-provider.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
```

### Custom Data Fetching Hooks
```typescript
// apps/web/src/hooks/use-primary-data.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function usePrimaryUsers() {
  return useQuery({
    queryKey: ['primary-data', 'users'],
    queryFn: async () => {
      const response = await fetch('/api/v1/primary-data/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      return response.json()
    }
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (userData: { name: string; email: string }) => {
      const response = await fetch('/api/v1/primary-data/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create user')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['primary-data', 'users'] })
    }
  })
}
```

### External Data Hooks
```typescript
// apps/web/src/hooks/use-external-data.ts
import { useQuery } from '@tanstack/react-query'

export function useExternalResources() {
  return useQuery({
    queryKey: ['external-data', 'shared-resources'],
    queryFn: async () => {
      const response = await fetch('/api/v1/external-data/shared-resources')
      if (!response.ok) {
        throw new Error('Failed to fetch external resources')
      }
      return response.json()
    },
    staleTime: 10 * 60 * 1000, // External data is less frequently updated
    gcTime: 30 * 60 * 1000 // Keep in cache longer
  })
}
```

## Data Models

### Primary Database Schema
```prisma
// apps/server/prisma/schema/schema.prisma
model User {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  clerkId        String   @unique // Clerk user ID
  email          String   @unique
  name           String
  organizationId String?  // For multi-tenant data isolation
  createdBy      String   @db.ObjectId
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  projects       Project[]
  activities     Activity[]

  @@map("users")
}

model Project {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  description String?
  status      String   @default("active")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  ownerId     String   @db.ObjectId
  owner       User     @relation(fields: [ownerId], references: [id])
  activities  Activity[]

  @@map("projects")
}
```

### External Data Types
```typescript
// apps/web/src/types/external-data.ts
export interface ExternalResource {
  id: string
  name: string
  data: Record<string, any>
  createdAt: string
}

export interface ExternalApiResponse<T> {
  data: T[]
  pagination?: {
    page: number
    limit: number
    total: number
  }
}
```

## Error Handling Strategy

### API Error Handling
```typescript
// apps/server/src/middleware/error-handler.ts
import { Context, Next } from 'hono'

export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof z.ZodError) {
      return c.json({
        error: 'Validation failed',
        details: error.issues
      }, 400)
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return c.json({ error: 'Resource already exists' }, 409)
      }
      if (error.code === 'P2025') {
        return c.json({ error: 'Resource not found' }, 404)
      }
    }

    return c.json({ error: 'Internal server error' }, 500)
  }
}
```

### Frontend Error Boundaries
```typescript
// apps/web/src/components/error-boundary.tsx
'use client'

import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="text-red-600 mt-2">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  )
}

export function QueryErrorBoundary({ children }: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={reset}
    >
      {children}
    </ReactErrorBoundary>
  )
}
```

## Security Considerations

### Environment Variables and Secrets Management

#### Database Connection Security
```bash
# apps/server/.env
# Primary database connection with restricted permissions
PRIMARY_DATABASE_URL="mongodb+srv://app_user:${PRIMARY_DB_PASSWORD}@primary-cluster.mongodb.net/app_production?retryWrites=true&w=majority"

# External database connection with read-only access
EXTERNAL_DATABASE_URL="mongodb+srv://readonly_user:${EXTERNAL_DB_PASSWORD}@external-cluster.mongodb.net/shared_app?retryWrites=false&readPreference=secondary"

# Clerk authentication
CLERK_SECRET_KEY="${CLERK_SECRET_KEY}"
CLERK_PUBLISHABLE_KEY="${CLERK_PUBLISHABLE_KEY}"

# API security
API_SECRET_KEY="${API_SECRET_KEY}"
CORS_ORIGIN="${CORS_ORIGIN}"
```

#### Database User Permissions
```javascript
// MongoDB Atlas - Primary Database User Permissions
{
  "roles": [
    {
      "role": "readWrite",
      "db": "app_production"
    }
  ],
  "restrictions": {
    "clientSource": ["${APP_SERVER_IP_RANGE}"],
    "serverAddress": ["primary-cluster.mongodb.net"]
  }
}

// MongoDB Atlas - External Database User Permissions (Read-only)
{
  "roles": [
    {
      "role": "read",
      "db": "shared_app"
    }
  ],
  "restrictions": {
    "clientSource": ["${APP_SERVER_IP_RANGE}"],
    "serverAddress": ["external-cluster.mongodb.net"]
  }
}
```

### Authentication and Authorization

#### Clerk Integration Security
```typescript
// apps/server/src/middleware/auth.ts
import { clerkClient } from '@clerk/nextjs'
import { Context, Next } from 'hono'

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.substring(7)
    const session = await clerkClient.sessions.verifySession(token)

    if (!session) {
      return c.json({ error: 'Invalid session' }, 401)
    }

    // Set user context for downstream handlers
    c.set('userId', session.userId)
    c.set('sessionId', session.id)

    await next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return c.json({ error: 'Authentication failed' }, 401)
  }
}
```

#### Data Access Control
```typescript
// apps/server/src/lib/access-control.ts
export class DataAccessControl {
  static async canAccessPrimaryData(userId: string, resourceId: string): Promise<boolean> {
    // Check if user has permission to access primary database resource
    const user = await primaryDb.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) return false

    // Implement organization-based access control
    const resource = await primaryDb.project.findUnique({
      where: { id: resourceId },
      include: { owner: true }
    })

    return resource?.owner.organizationId === user.organizationId
  }

  static async canAccessExternalData(userId: string): Promise<boolean> {
    // Verify user is authenticated and belongs to authorized organization
    const user = await primaryDb.user.findUnique({
      where: { clerkId: userId }
    })

    // Only users with specific roles can access external data
    return user?.role === 'admin' || user?.role === 'manager'
  }
}
```

### API Security Patterns

#### Request Validation and Sanitization
```typescript
// apps/server/src/lib/validation.ts
import { z } from 'zod'

// Sanitize and validate all user inputs
export const sanitizeString = (str: string) => {
  return str.trim().replace(/[<>]/g, '') // Basic XSS prevention
}

export const createUserSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .transform(sanitizeString),
  email: z.string()
    .email('Invalid email format')
    .transform(str => str.toLowerCase()),
  organizationId: z.string()
    .optional()
    .transform(str => str ? sanitizeString(str) : undefined)
})

// Rate limiting schema for external API calls
export const externalQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
  filters: z.record(z.string()).optional()
})
```

#### Rate Limiting and DDoS Protection
```typescript
// apps/server/src/middleware/rate-limit.ts
import { Context, Next } from 'hono'

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(maxRequests: number, windowMs: number) {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId') || c.req.header('x-forwarded-for') || 'anonymous'
    const now = Date.now()
    const windowStart = now - windowMs

    const userLimit = rateLimitStore.get(userId)

    if (!userLimit || userLimit.resetTime < windowStart) {
      rateLimitStore.set(userId, { count: 1, resetTime: now + windowMs })
      await next()
      return
    }

    if (userLimit.count >= maxRequests) {
      return c.json({
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
      }, 429)
    }

    userLimit.count++
    await next()
  }
}

// Usage in routes
externalData.use('/shared-resources', rateLimit(10, 60000)) // 10 requests per minute
```

### Data Encryption and Privacy

#### Sensitive Data Handling
```typescript
// apps/server/src/lib/encryption.ts
import crypto from 'crypto'

export class DataEncryption {
  private static readonly algorithm = 'aes-256-gcm'
  private static readonly secretKey = process.env.ENCRYPTION_KEY!

  static encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.algorithm, this.secretKey)
    cipher.setAAD(Buffer.from('additional-data'))

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const tag = cipher.getAuthTag()

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    }
  }

  static decrypt(encryptedData: { encrypted: string; iv: string; tag: string }): string {
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey)
    decipher.setAAD(Buffer.from('additional-data'))
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'))

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }
}
```

#### Audit Logging
```typescript
// apps/server/src/lib/audit-logger.ts
export class AuditLogger {
  static async logDataAccess(
    userId: string,
    action: 'read' | 'write' | 'delete',
    resource: string,
    metadata?: Record<string, any>
  ) {
    await primaryDb.auditLog.create({
      data: {
        userId,
        action,
        resource,
        metadata: metadata || {},
        timestamp: new Date(),
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent
      }
    })
  }
}

// Usage in API routes
primaryData.get('/users', async (c) => {
  const userId = c.get('userId')

  // Log the data access
  await AuditLogger.logDataAccess(userId, 'read', 'users', {
    ipAddress: c.req.header('x-forwarded-for'),
    userAgent: c.req.header('user-agent')
  })

  // ... rest of the handler
})
```

## Performance Considerations

### Query Optimization Strategies

#### Database Query Optimization
```typescript
// Efficient pagination for large datasets
export async function getPaginatedUsers(
  page: number,
  limit: number,
  organizationId: string
) {
  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    primaryDb.user.findMany({
      where: { organizationId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
        // Only select needed fields
      }
    }),
    primaryDb.user.count({
      where: { organizationId }
    })
  ])

  return { users, total, hasMore: skip + limit < total }
}
```

#### Frontend Performance Patterns
```typescript
// apps/web/src/hooks/use-infinite-users.ts
import { useInfiniteQuery } from '@tanstack/react-query'

export function useInfiniteUsers(organizationId: string) {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite', organizationId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `/api/v1/primary-data/users?page=${pageParam}&limit=20&org=${organizationId}`
      )
      return response.json()
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
}
```

### Caching Strategy

#### Multi-level Caching
```typescript
// apps/server/src/lib/cache.ts
import { Redis } from 'ioredis'

class CacheManager {
  private redis: Redis

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!)
  }

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key)
    return cached ? JSON.parse(cached) : null
  }

  async set(key: string, value: any, ttlSeconds: number = 300) {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value))
  }

  async invalidate(pattern: string) {
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }
}

export const cache = new CacheManager()

// Usage in API routes
primaryData.get('/users', async (c) => {
  const organizationId = c.get('organizationId')
  const cacheKey = `users:${organizationId}`

  // Try cache first
  let users = await cache.get(cacheKey)

  if (!users) {
    users = await primaryDb.user.findMany({
      where: { organizationId }
    })

    // Cache for 5 minutes
    await cache.set(cacheKey, users, 300)
  }

  return c.json({ data: users })
})
```

## Testing Strategy

### API Testing
```typescript
// apps/server/src/__tests__/primary-data.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { testClient } from 'hono/testing'
import app from '../app'

describe('Primary Data API', () => {
  beforeEach(async () => {
    // Set up test database
    await setupTestDatabase()
  })

  afterEach(async () => {
    // Clean up test data
    await cleanupTestDatabase()
  })

  it('should fetch users with authentication', async () => {
    const mockUserId = 'test-user-id'
    const res = await testClient(app)
      .api.v1['primary-data'].users.$get(
        {},
        {
          headers: {
            Authorization: `Bearer ${generateTestToken(mockUserId)}`
          }
        }
      )

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.data).toBeInstanceOf(Array)
  })

  it('should reject unauthenticated requests', async () => {
    const res = await testClient(app)
      .api.v1['primary-data'].users.$get()

    expect(res.status).toBe(401)
  })
})
```

### Frontend Hook Testing
```typescript
// apps/web/src/hooks/__tests__/use-primary-data.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePrimaryUsers } from '../use-primary-data'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('usePrimaryUsers', () => {
  it('should fetch users successfully', async () => {
    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [{ id: '1', name: 'Test User' }] })
    })

    const { result } = renderHook(() => usePrimaryUsers(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({ data: [{ id: '1', name: 'Test User' }] })
  })
})
```

## Migration Strategy

### Phase 1: Foundation Setup
1. Configure primary MongoDB Atlas connection
2. Set up basic Prisma models
3. Install and configure TanStack Query
4. Create basic API structure

### Phase 2: Core Data Operations
1. Implement CRUD operations for primary database
2. Create custom hooks for data fetching
3. Add error handling and loading states
4. Set up authentication middleware

### Phase 3: External Database Integration
1. Configure external MongoDB connection
2. Create read-only API endpoints
3. Implement external data hooks
4. Add data validation and type safety

### Phase 4: Optimization and Security
1. Implement caching strategies
2. Add rate limiting and security measures
3. Set up monitoring and logging
4. Performance optimization and testing

## Monitoring and Analytics

### Performance Monitoring
```typescript
// apps/server/src/middleware/performance.ts
export async function performanceMiddleware(c: Context, next: Next) {
  const start = Date.now()

  await next()

  const duration = Date.now() - start
  const route = c.req.path
  const method = c.req.method

  // Log slow queries
  if (duration > 1000) {
    console.warn(`Slow query detected: ${method} ${route} took ${duration}ms`)
  }

  // Add performance headers
  c.res.headers.set('X-Response-Time', `${duration}ms`)
}
```

### Error Tracking
```typescript
// apps/web/src/lib/error-tracking.ts
export class ErrorTracker {
  static trackError(error: Error, context?: Record<string, any>) {
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, LogRocket, etc.
    }
  }

  static trackQueryError(queryKey: string[], error: Error) {
    this.trackError(error, {
      type: 'query-error',
      queryKey,
      userAgent: navigator.userAgent
    })
  }
}
```
```
