# API Development Best Practices

**🔄 FUTURE IMPLEMENTATION GUIDE**

_This document contains patterns and guidelines to follow when implementing API features. These patterns do not currently exist in the codebase - they are recommendations for future development._

**Current Status**: Only a basic health check endpoint exists. No API routers, authentication, or CRUD operations are implemented yet.

**Reference**: See `Foundation/steering/current-state.md` for what actually exists right now.

---

## Guidelines for Backend API Development with Hono and Prisma

## Backend Architecture Guidelines

### Router Organization

Organize API routes in `apps/server/src/routers/` using Hono's routing system:

```typescript
// Example pattern for apps/server/src/routers/users.ts
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const users = new Hono();

// GET /users
users.get("/", async (c) => {
  try {
    const users = await prisma.user.findMany();
    return c.json(users);
  } catch (error) {
    return c.json({ error: "Failed to fetch users" }, 500);
  }
});

// POST /users
users.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const userData = userSchema.parse(body);

    const user = await prisma.user.create({
      data: userData,
    });

    return c.json(user, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation failed", details: error.errors }, 400);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default users;
```

### Validation Best Practices

Use Zod for request validation:

```typescript
import { z } from "zod";

// Define schemas for validation
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  age: z.number().min(0, "Age must be positive").optional(),
});

const updateUserSchema = userSchema.partial();

// Use in route handlers
const userData = userSchema.parse(body);
```

### Error Handling Patterns

Implement consistent error responses:

```typescript
// Validation error
if (error instanceof z.ZodError) {
  return c.json(
    {
      error: "Validation failed",
      details: error.errors,
    },
    400
  );
}

// Not found
if (!user) {
  return c.json({ error: "User not found" }, 404);
}

// Database error
if (error instanceof Prisma.PrismaClientKnownRequestError) {
  if (error.code === "P2002") {
    return c.json({ error: "Email already exists" }, 409);
  }
}

// Generic server error
return c.json({ error: "Internal server error" }, 500);
```

### Database Operation Patterns

Use Prisma for type-safe database operations:

```typescript
// Basic CRUD operations
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
  },
});

// Find with relations
const user = await prisma.user.findUnique({
  where: { id },
  include: { posts: true },
});

// Update with validation
const updatedUser = await prisma.user.update({
  where: { id },
  data: validatedData,
});

// Delete with cascade handling
await prisma.user.delete({
  where: { id },
});
```

## Frontend Integration Guidelines

### TanStack Query Patterns

Use TanStack Query for server state management:

```typescript
// Custom hook for data fetching
function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });
}

// Usage in components
function UsersList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Mutation Patterns

Handle data mutations with proper error handling:

```typescript
function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create user");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
```

## API Response Standards

### Success Response Patterns

```typescript
// Single resource
return c.json({
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  createdAt: "2025-01-08T10:00:00Z",
});

// Collection with metadata
return c.json({
  data: users,
  meta: {
    total: 100,
    page: 1,
    limit: 10,
    hasNext: true,
  },
});
```

### Error Response Standards

```typescript
// Validation error
return c.json(
  {
    error: "Validation failed",
    details: [
      { field: "name", message: "Name is required" },
      { field: "email", message: "Invalid email format" },
    ],
  },
  400
);

// Not found
return c.json(
  {
    error: "Resource not found",
    resource: "user",
    id: userId,
  },
  404
);

// Server error
return c.json(
  {
    error: "Internal server error",
    timestamp: new Date().toISOString(),
  },
  500
);
```

## Environment Configuration Guidelines

### Server Environment Variables

```bash
# apps/server/.env
DATABASE_URL="mongodb://localhost:27017/myapp_dev"
CORS_ORIGIN="http://localhost:3001"
PORT=3000
NODE_ENV="development"
```

### Frontend Environment Variables

```bash
# apps/web/.env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## CORS Configuration Best Practices

Configure CORS appropriately for different environments:

```typescript
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Only if needed for authentication
  })
);
```

## Security Best Practices

### Input Validation

- Always validate input with Zod schemas
- Sanitize user input to prevent injection attacks
- Use parameterized queries (Prisma handles this)

### Error Handling

- Don't expose internal error details in production
- Log errors server-side for debugging
- Return consistent error formats

### Rate Limiting (Future)

```typescript
// Example rate limiting middleware
import { rateLimiter } from "hono-rate-limiter";

app.use(
  "/api/*",
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP",
  })
);
```

## Testing Guidelines (Future)

### API Testing Pattern

```typescript
// Example API test structure
describe("Users API", () => {
  beforeEach(async () => {
    // Clean test database
    await prisma.user.deleteMany();
  });

  it("should create a user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
    };

    const response = await request(app)
      .post("/api/users")
      .send(userData)
      .expect(201);

    expect(response.body).toMatchObject(userData);
  });
});
```

_Note: These are best practice guidelines to follow when implementing API features. Update this document with real patterns as they emerge from actual implementation._
