# Database Best Practices

**🔄 FUTURE IMPLEMENTATION GUIDE**

_This document contains patterns and guidelines for database design and operations with Prisma and MongoDB. No database models or operations currently exist in the project._

**Current Status**: Prisma is configured for MongoDB, but no models are defined in the schema and no database connection is established. This is entirely future implementation guidance.

**Reference**: See `Foundation/steering/current-state.md` for what actually exists right now.

---

## Guidelines for Database Design and Operations with Prisma and MongoDB

## Prisma Schema Design Guidelines

### Model Definition Patterns

```prisma
// Standard model pattern for MongoDB
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  posts     Post[]
  comments  Comment[]

  @@map("users")
}

model Post {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  authorId  String   @db.ObjectId
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  tags      Tag[]    @relation("PostTags")

  @@map("posts")
}
```

### Relationship Patterns

```prisma
// One-to-many relationship
model User {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  posts Post[]
}

model Post {
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  authorId String @db.ObjectId
  author   User   @relation(fields: [authorId], references: [id])
}

// Many-to-many relationship
model Post {
  id   String @id @default(auto()) @map("_id") @db.ObjectId
  tags Tag[]  @relation("PostTags")
}

model Tag {
  id    String @id @default(auto()) @map("_id") @db.ObjectId
  name  String @unique
  posts Post[] @relation("PostTags")
}
```

## Database Operation Best Practices

### Basic CRUD Patterns

```typescript
// Create with error handling
async function createUser(userData: CreateUserData) {
  try {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
      },
    });
    return { success: true, data: user };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "Email already exists" };
      }
    }
    return { success: false, error: "Failed to create user" };
  }
}

// Read with relations and filtering
const users = await prisma.user.findMany({
  where: {
    email: {
      contains: "@example.com",
    },
  },
  include: {
    posts: {
      where: {
        published: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 10,
});

// Update with validation
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: {
    name: validatedData.name,
    updatedAt: new Date(),
  },
});

// Delete with cascade consideration
await prisma.user.delete({
  where: { id: userId },
  // Related records handled by onDelete: Cascade in schema
});
```

### Complex Query Patterns

```typescript
// Find with nested conditions
const postsWithComments = await prisma.post.findMany({
  where: {
    published: true,
    author: {
      email: {
        endsWith: "@company.com",
      },
    },
  },
  include: {
    author: {
      select: {
        name: true,
        email: true,
      },
    },
    comments: {
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      include: {
        author: true,
      },
    },
    _count: {
      select: {
        comments: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 10,
});
```

### Transaction Patterns

```typescript
// Using interactive transactions for data consistency
const result = await prisma.$transaction(async (tx) => {
  // Create user
  const user = await tx.user.create({
    data: {
      email: "user@example.com",
      name: "John Doe",
    },
  });

  // Create initial post
  const post = await tx.post.create({
    data: {
      title: "Welcome Post",
      content: "Welcome to the platform!",
      authorId: user.id,
      published: true,
    },
  });

  return { user, post };
});
```

## Performance Optimization Guidelines

### Indexing Strategy

```prisma
model Post {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  authorId  String   @db.ObjectId

  author    User     @relation(fields: [authorId], references: [id])

  // Compound indexes for common queries
  @@index([published, createdAt])
  @@index([authorId, published])
  @@map("posts")
}
```

### Query Optimization

```typescript
// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // Don't fetch unnecessary fields like avatar, timestamps
  },
});

// Use cursor-based pagination for large datasets
const posts = await prisma.post.findMany({
  take: 10,
  skip: 1, // Skip the cursor
  cursor: {
    id: lastPostId,
  },
  orderBy: {
    createdAt: "desc",
  },
});

// Use aggregations for statistics
const userStats = await prisma.user.aggregate({
  _count: {
    id: true,
  },
  _avg: {
    posts: true,
  },
  where: {
    createdAt: {
      gte: new Date("2024-01-01"),
    },
  },
});
```

## Error Handling Patterns

### Prisma Error Handling

```typescript
import { Prisma } from "@prisma/client";

async function handleDatabaseOperation() {
  try {
    // Database operation
    const result = await prisma.user.create({ data: userData });
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      switch (error.code) {
        case "P2002":
          return { success: false, error: "Unique constraint violation" };
        case "P2025":
          return { success: false, error: "Record not found" };
        default:
          console.error("Prisma error:", error);
          return { success: false, error: "Database operation failed" };
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return { success: false, error: "Invalid data provided" };
    }

    // Handle unknown errors
    console.error("Unknown database error:", error);
    return { success: false, error: "Internal server error" };
  }
}
```

## Migration Best Practices

### Development Workflow

```bash
# After schema changes, generate Prisma client
bun db:generate

# Push schema changes to database (development)
bun db:push

# Create and run migrations (production)
bun db:migrate
```

### Schema Evolution Guidelines

```prisma
// Adding optional fields (safe)
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  bio       String?  // New optional field - safe to add
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Adding required fields (requires default or migration)
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  role      String   @default("user") // New required field with default
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Connection Management

### Prisma Client Setup

```typescript
// Singleton pattern for Prisma client
import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
```

## Environment Configuration

### Database URLs

```bash
# Development
DATABASE_URL="mongodb://localhost:27017/myapp_dev"

# Testing
TEST_DATABASE_URL="mongodb://localhost:27017/myapp_test"

# Production (example)
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/myapp_prod"
```

## Testing Guidelines (Future)

### Database Testing Setup

```typescript
// Test database setup
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

// Clean database before each test
export async function cleanDatabase() {
  const modelNames = Object.keys(prisma).filter(
    (key) => !key.startsWith("_") && !key.startsWith("$")
  );

  for (const modelName of modelNames) {
    await prisma[modelName].deleteMany();
  }
}

// Seed test data
export async function seedTestData() {
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
    },
  });

  return { user };
}
```

## Security Considerations

### Data Validation

- Always validate data before database operations
- Use Zod schemas for input validation
- Sanitize user input to prevent injection

### Access Control

- Implement proper authorization checks
- Use row-level security where applicable
- Audit sensitive operations

### Data Privacy

- Hash sensitive data (passwords, tokens)
- Implement data retention policies
- Follow GDPR/privacy regulations

_Note: These are best practice guidelines to follow when implementing database features. Update this document with real patterns as they emerge from actual implementation._
