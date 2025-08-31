# Development Workflow & Project Standards

**📚 REFERENCE DOCUMENT - Consolidated development guidelines**

_This document consolidates development workflow, project standards, and implementation patterns into a single reference. It combines information from development.md, best practices documents, and current project patterns._

## 🚀 **Environment Setup**

### **Prerequisites**
- **Bun v1.2.19+**: Primary runtime and package manager
- **Node.js**: Compatible for tooling (optional)
- **MongoDB**: Database instance (when implementing database features)

### **Initial Setup**
```bash
# Clone and install dependencies
bun install

# Set up environment variables
cp apps/web/.env.example apps/web/.env
cp apps/server/.env.example apps/server/.env

# Configure database (when models are implemented)
bun db:generate
bun db:push
```

## 🔄 **Development Workflow**

### **Quick Command Reference**
- `bun dev` - Start all services
- `bun check` - Format and lint code
- `bun check-types` - TypeScript type checking
- `bun db:studio` - Open database management interface (when connected)

### **AI Agent Development Server Testing**

**Important**: AI agents should NOT start development servers using `executeBash` as these are long-running processes that will hang the execution.

#### **Recommended Testing Approach**
1. **User starts server**: Ask the user to start the development server in their terminal
2. **Agent tests endpoints**: Use `curl` commands to test API endpoints (these terminate quickly)
3. **User provides feedback**: Ask user to share any terminal output, errors, or startup issues

#### **Testing Commands (AI Agent Safe)**
```bash
# Test health endpoint
curl -s http://localhost:3000/

# Test API endpoints
curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'

# Check compilation without starting server
bun check-types
```

#### **Commands to Avoid in AI Agent Execution**
```bash
# These will hang the agent execution:
bun dev          # Starts all services (long-running)
bun dev:server   # Starts backend server (long-running)
bun dev:web      # Starts frontend server (long-running)
```

## 📁 **Project Standards**

### **File Organization**

#### **Frontend (apps/web/)**
- **Components**: Place in `apps/web/src/components/`
  - UI components: `apps/web/src/components/ui/`
  - Common components: `apps/web/src/components/common/`
  - Layout components: `apps/web/src/components/layout/`
  - Navigation components: `apps/web/src/components/navigation/`
- **Pages**: Use Next.js App Router in `apps/web/src/app/`
- **Hooks**: Place in `apps/web/src/hooks/`
- **Types**: Co-locate with components or in dedicated `types/` directories
- **Utilities**: Place in `apps/web/src/lib/`

#### **Backend (apps/server/)**
- **API Routes**: Place in `apps/server/src/routers/`
- **Services**: Place in `apps/server/src/services/`
- **Utilities**: Place in `apps/server/src/lib/`
- **Types**: Co-locate with routes or in dedicated `types/` directories

### **Naming Conventions**
- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions**: camelCase (e.g., `getUserProfile`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`, `ApiResponse`)
- **Hooks**: camelCase starting with 'use' (e.g., `useApiCall`)

### **Import Order**
1. **External libraries** (React, Next.js, etc.)
2. **Internal utilities and components**
3. **Relative imports**
4. **Type-only imports last**

## 🏗️ **Implementation Patterns**

### **Component Development**
```typescript
interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  // Other props...
}

export default function Component({
  children,
  className,
  ...props
}: ComponentProps) {
  return (
    <div className={cn("base-styles", className)} {...props}>
      {children}
    </div>
  );
}
```

### **API Route Development**
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

export default users;
```

### **Validation Patterns**
```typescript
import { z } from "zod";

// Define schemas for validation
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  age: z.number().min(0, "Age must be positive").optional(),
});

// Use in route handlers
const userData = userSchema.parse(body);
```

### **Error Handling Patterns**
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
```

## 🎨 **UI Development Guidelines**

### **shadcn/ui Integration**
This project is configured for shadcn/ui v4 with "new-york" style:

```json
{
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### **Theme System Implementation**
```typescript
// Theme provider setup (already implemented)
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### **Responsive Design**
- **Mobile-first approach** with Tailwind breakpoints
- **Consistent spacing** using Tailwind's spacing scale
- **Flexible layouts** that adapt to different screen sizes

## 🗄️ **Database Development**

### **Prisma Schema Patterns**
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  companies Company[]
  reports   Report[]

  @@map("users")
}
```

### **Database Operations**
```typescript
// Create
const user = await prisma.user.create({
  data: userData,
});

// Read
const users = await prisma.user.findMany({
  where: { active: true },
  include: { companies: true },
});

// Update
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: updateData,
});

// Delete
await prisma.user.delete({
  where: { id: userId },
});
```

## 🧪 **Testing Strategy**

### **Testing Philosophy**
This project should follow a Test-Driven Development (TDD) approach with testing at multiple levels:

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test API endpoints and database operations
3. **Component Tests**: Test React components with user interactions
4. **E2E Tests**: Test complete user workflows

### **Recommended Testing Stack**
- **Vitest**: Fast unit and integration testing framework
- **Testing Library**: React component testing utilities
- **MSW (Mock Service Worker)**: API mocking for frontend tests
- **Playwright**: End-to-end testing framework

### **Test Setup Commands (When Implementing)**
```bash
# Install testing dependencies
bun add -D vitest @testing-library/react @testing-library/jest-dom
bun add -D @testing-library/user-event msw playwright

# Add to package.json scripts
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage",
"test:e2e": "playwright test"
```

## 🔍 **Code Quality & Validation**

### **Pre-commit Checks**
1. **Run `bun check`** for Biome linting and formatting
2. **Run `bun check-types`** for TypeScript validation
3. **Ensure accessibility compliance** with all components
4. **Verify component structure** follows React best practices
5. **Check error handling** patterns are implemented

### **Quality Standards**
- **No TypeScript errors**
- **No accessibility violations**
- **No React hook rule violations**
- **Consistent code formatting**
- **Proper error handling patterns**

## 📚 **Documentation Standards**

### **Code Documentation**
- **JSDoc comments** for complex functions and components
- **Type definitions** for all props and return values
- **Usage examples** for reusable components
- **Error handling documentation** for API endpoints

### **Project Documentation**
- **Keep current-state.md updated** as features are implemented
- **Update best practices** when new patterns emerge
- **Document architectural decisions** in decision-log.md
- **Maintain learning journal** with development insights

## 🚀 **Deployment & Production**

### **Build Process**
```bash
bun build           # Build all applications
bun check-types     # Verify type safety
bun check           # Ensure code quality
```

### **Environment Configuration**
- **Development**: Local development with hot reload
- **Test**: Testing environment with test database
- **Staging**: Pre-production environment
- **Production**: Production environment

### **Database Migration**
```bash
# Generate Prisma client
bun db:generate

# Push schema changes
bun db:push

# Run migrations (when implemented)
bun db:migrate
```

---

**Note**: This document consolidates development workflow information from multiple sources. When implementing new features, refer to the appropriate sections and ensure compliance with all relevant standards.
