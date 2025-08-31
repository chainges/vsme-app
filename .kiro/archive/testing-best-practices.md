# Testing Best Practices

**🔄 FUTURE IMPLEMENTATION GUIDE**

_This document contains patterns and guidelines for implementing a comprehensive testing strategy. No testing infrastructure currently exists in the project._

**Current Status**: No test setup, no test files, no testing framework installed. This is entirely future implementation guidance.

**Reference**: See `Foundation/steering/current-state.md` for what actually exists right now.

---

## Guidelines for Implementing Testing Strategy

## Testing Philosophy

This project should follow a Test-Driven Development (TDD) approach with testing at multiple levels:

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test API endpoints and database operations
3. **Component Tests**: Test React components with user interactions
4. **E2E Tests**: Test complete user workflows

## Recommended Testing Stack

### Core Testing Tools

- **Vitest**: Fast unit and integration testing framework
- **Testing Library**: React component testing utilities
- **MSW (Mock Service Worker)**: API mocking for frontend tests
- **Playwright**: End-to-end testing framework

### Setup Commands (When Implementing)

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

## Unit Testing Guidelines

### Test Utilities Setup

```typescript
// lib/test-utils.ts
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

// Custom render function with providers
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
```

### Component Testing Patterns

```typescript
// components/__tests__/header.test.tsx
import { render, screen } from "@/lib/test-utils";
import Header from "../header";

describe("Header", () => {
  it("renders navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it("navigates to correct routes", () => {
    render(<Header />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("toggles theme when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const themeToggle = screen.getByRole("button", { name: /toggle theme/i });
    await user.click(themeToggle);

    // Assert theme change behavior
  });
});
```

### Hook Testing Patterns

```typescript
// hooks/__tests__/use-users.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsers } from "../use-users";

// Mock fetch
global.fetch = vi.fn();

describe("useUsers", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  it("fetches users successfully", async () => {
    const mockUsers = [
      { id: "1", name: "John Doe", email: "john@example.com" },
    ];

    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUsers);
  });

  it("handles fetch errors", async () => {
    (fetch as vi.Mock).mockRejectedValueOnce(new Error("Network error"));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUsers(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Network error");
  });
});
```

## API Testing Guidelines

### Hono Route Testing

```typescript
// routers/__tests__/users.test.ts
import { testClient } from "hono/testing";
import app from "../users";
import { prisma } from "@/lib/prisma";

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("Users API", () => {
  const client = testClient(app);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /users", () => {
    it("returns list of users", async () => {
      const mockUsers = [
        { id: "1", name: "John Doe", email: "john@example.com" },
      ];

      (prisma.user.findMany as vi.Mock).mockResolvedValue(mockUsers);

      const response = await client.users.$get();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledOnce();
    });

    it("handles database errors", async () => {
      (prisma.user.findMany as vi.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      const response = await client.users.$get();

      expect(response.status).toBe(500);
    });
  });

  describe("POST /users", () => {
    it("creates a new user", async () => {
      const newUser = { name: "Jane Doe", email: "jane@example.com" };
      const createdUser = { id: "2", ...newUser };

      (prisma.user.create as vi.Mock).mockResolvedValue(createdUser);

      const response = await client.users.$post({
        json: newUser,
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(createdUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: newUser,
      });
    });

    it("validates required fields", async () => {
      const response = await client.users.$post({
        json: { name: "" }, // Missing email
      });

      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.error).toBe("Validation failed");
    });
  });
});
```

### Database Testing

```typescript
// lib/__tests__/database.test.ts
import { PrismaClient } from "@prisma/client";

// Use test database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

describe("Database Operations", () => {
  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("User operations", () => {
    it("creates and retrieves a user", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
      };

      const createdUser = await prisma.user.create({
        data: userData,
      });

      expect(createdUser).toMatchObject(userData);
      expect(createdUser.id).toBeDefined();
      expect(createdUser.createdAt).toBeInstanceOf(Date);

      const retrievedUser = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });

      expect(retrievedUser).toEqual(createdUser);
    });

    it("enforces unique email constraint", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
      };

      await prisma.user.create({ data: userData });

      await expect(prisma.user.create({ data: userData })).rejects.toThrow();
    });
  });
});
```

## Frontend Integration Testing

### MSW Setup for API Mocking

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: "1", name: "John Doe", email: "john@example.com" },
      { id: "2", name: "Jane Doe", email: "jane@example.com" },
    ]);
  }),

  http.post("/api/users", async ({ request }) => {
    const newUser = await request.json();
    return HttpResponse.json({ id: "3", ...newUser }, { status: 201 });
  }),

  http.get("/api/users/:id", ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      name: "John Doe",
      email: "john@example.com",
    });
  }),

  // Error scenarios
  http.get("/api/users/error", () => {
    return new HttpResponse(null, { status: 500 });
  }),
];

// mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

### Component Integration Tests

```typescript
// components/__tests__/user-list.test.tsx
import { render, screen, waitFor } from "@/lib/test-utils";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import UserList from "../user-list";

describe("UserList Integration", () => {
  it("displays users from API", async () => {
    render(<UserList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    server.use(
      http.get("/api/users", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it("shows empty state when no users", async () => {
    server.use(
      http.get("/api/users", () => {
        return HttpResponse.json([]);
      })
    );

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });
  });
});
```

## E2E Testing Guidelines

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "bun dev",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// e2e/user-management.spec.ts
import { test, expect } from "@playwright/test";

test.describe("User Management", () => {
  test.beforeEach(async ({ page }) => {
    // Set up test data or clean state
    await page.goto("/");
  });

  test("creates a new user", async ({ page }) => {
    await page.goto("/users");

    await page.click('button:has-text("Add User")');

    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");

    await page.click('button:has-text("Save")');

    await expect(page.locator("text=Test User")).toBeVisible();
    await expect(page.locator("text=User created successfully")).toBeVisible();
  });

  test("validates form inputs", async ({ page }) => {
    await page.goto("/users");

    await page.click('button:has-text("Add User")');
    await page.click('button:has-text("Save")');

    await expect(page.locator("text=Name is required")).toBeVisible();
    await expect(page.locator("text=Email is required")).toBeVisible();
  });

  test("edits existing user", async ({ page }) => {
    // Assuming user exists
    await page.goto("/users");

    await page.click('[data-testid="edit-user-1"]');

    await page.fill('input[name="name"]', "Updated Name");
    await page.click('button:has-text("Save")');

    await expect(page.locator("text=Updated Name")).toBeVisible();
  });
});
```

## Test Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test-setup.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Test Setup File

```typescript
// src/test-setup.ts
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Start MSW server
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock environment variables
vi.mock("process", () => ({
  env: {
    NODE_ENV: "test",
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
  },
}));
```

## Testing Best Practices

### Test Organization

- Group related tests in `describe` blocks
- Use descriptive test names that explain expected behavior
- Follow the AAA pattern: Arrange, Act, Assert
- Keep tests focused and independent

### Mocking Strategy

- Mock external dependencies (APIs, databases, third-party services)
- Use real implementations for internal logic
- Mock at the boundary (network requests, file system)
- Avoid over-mocking - test real behavior when possible

### Data Management

- Use factories for test data generation
- Clean up test data after each test
- Use separate test databases
- Seed consistent, minimal test data

### Assertion Patterns

```typescript
// Good: Specific assertions
expect(user.name).toBe("John Doe");
expect(response.status).toBe(201);
expect(screen.getByRole("button")).toBeEnabled();

// Better: Multiple related assertions
expect(user).toMatchObject({
  name: "John Doe",
  email: "john@example.com",
  active: true,
});

// Best: Semantic assertions
expect(screen.getByRole("alert")).toHaveTextContent(
  "User created successfully"
);
```

### Performance Testing

- Test loading states and error boundaries
- Verify accessibility with screen readers
- Test responsive design at different viewport sizes
- Monitor test execution time

_Note: These are best practice guidelines to follow when implementing testing. Update this document with real patterns as they emerge from actual testing implementation._
