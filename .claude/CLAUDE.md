# VSME Guru SaaS Platform - Project Context for Claude Code

## Project Overview
**VSME Guru** is a sustainability reporting platform for the SME market, conformant to the VSME EU standard and NSRS. Built as a modern full-stack TypeScript application with Next.js 15, Hono backend, and MongoDB. Currently implementing foundational SaaS UI structure with comprehensive error handling, loading states, and mock authentication system for development.

## Technology Stack

### Runtime & Build
- **Bun v1.2.19+**: Primary runtime and package manager
- **Turborepo**: Monorepo build orchestration with caching
- **Next.js 15.3.0**: Frontend with App Router and Turbopack
- **TypeScript**: Strict mode enabled across the stack

### Frontend
- **React 19**: Latest React features
- **TailwindCSS 4.1.11**: Utility-first styling
- **shadcn/ui**: Reusable component library built on Radix UI
- **Lucide React**: Icon library
- **TanStack Query**: Server state management
- **TanStack Form**: Form state management

### Backend
- **Hono 4.8.10**: Lightweight web framework
- **Prisma 6.13.0**: TypeScript-first ORM
- **MongoDB**: NoSQL database
- **Zod**: Runtime type validation

### Code Quality
- **Biome**: Linting and formatting (extends Ultracite config)
- **Ultracite**: Opinionated code style and quality rules

## Key Development Commands

```bash
# Development
bun dev              # Start all apps
bun dev:web          # Frontend only (port 3001)
bun dev:server       # Backend only (port 3000)

# Quality & Building
bun check            # Biome linting and formatting
bun check-types      # Type checking
bun build            # Build all applications

# Database
bun db:push          # Push schema changes
bun db:studio        # Open Prisma Studio
bun db:generate      # Generate Prisma client
bun db:migrate       # Run migrations
```

## Project Structure

```
apps/
├── server/          # Hono backend API
│   ├── src/
│   │   ├── index.ts
│   │   └── routers/
│   └── prisma/
│       └── schema/
└── web/             # Next.js frontend
    └── src/
        ├── app/     # App Router pages
        ├── components/
        ├── contexts/
        └── lib/
```

## Core Development Principles

### Type Safety & Quality
- Strict TypeScript configuration enforced
- Zero tolerance for `any` types
- Comprehensive error handling required
- All functions must handle edge cases
- Test-driven development approach when tests exist

### Before Writing Code
1. Analyze existing patterns in the codebase
2. Consider edge cases and error scenarios
3. Follow the Ultracite rules below strictly
4. Validate accessibility requirements
5. Use test-driven development cycle when tests exist

### Communication Guidelines
- Maintain objectivity and provide genuine value
- Don't change stance just to please - provide constructive feedback
- Be a trusted technical partner with honest assessment
- Focus on practical solutions and accurate information

## Rules

### Accessibility (a11y)
- Don't use `accessKey` attribute on any HTML element.
- Don't set `aria-hidden="true"` on focusable elements.
- Don't add ARIA roles, states, and properties to elements that don't support them.
- Don't use distracting elements like `<marquee>` or `<blink>`.
- Only use the `scope` prop on `<th>` elements.
- Don't assign non-interactive ARIA roles to interactive HTML elements.
- Make sure label elements have text content and are associated with an input.
- Don't assign interactive ARIA roles to non-interactive HTML elements.
- Don't assign `tabIndex` to non-interactive HTML elements.
- Don't use positive integers for `tabIndex` property.
- Don't include "image", "picture", or "photo" in img alt prop.
- Don't use explicit role property that's the same as the implicit/default role.
- Make static elements with click handlers use a valid role attribute.
- Always include a `title` element for SVG elements.
- Give all elements requiring alt text meaningful information for screen readers.
- Make sure anchors have content that's accessible to screen readers.
- Assign `tabIndex` to non-interactive HTML elements with `aria-activedescendant`.
- Include all required ARIA attributes for elements with ARIA roles.
- Make sure ARIA properties are valid for the element's supported roles.
- Always include a `type` attribute for button elements.
- Make elements with interactive roles and handlers focusable.
- Give heading elements content that's accessible to screen readers (not hidden with `aria-hidden`).
- Always include a `lang` attribute on the html element.
- Always include a `title` attribute for iframe elements.
- Accompany `onClick` with at least one of: `onKeyUp`, `onKeyDown`, or `onKeyPress`.
- Accompany `onMouseOver`/`onMouseOut` with `onFocus`/`onBlur`.
- Include caption tracks for audio and video elements.
- Use semantic elements instead of role attributes in JSX.
- Make sure all anchors are valid and navigable.
- Ensure all ARIA properties (`aria-*`) are valid.
- Use valid, non-abstract ARIA roles for elements with ARIA roles.
- Use valid ARIA state and property values.
- Use valid values for the `autocomplete` attribute on input elements.
- Use correct ISO language/country codes for the `lang` attribute.

### Code Complexity and Quality
- Don't use consecutive spaces in regular expression literals.
- Don't use the `arguments` object.
- Don't use primitive type aliases or misleading types.
- Don't use the comma operator.
- Don't use empty type parameters in type aliases and interfaces.
- Don't write functions that exceed a given Cognitive Complexity score.
- Don't nest describe() blocks too deeply in test files.
- Don't use unnecessary boolean casts.
- Don't use unnecessary callbacks with flatMap.
- Use for...of statements instead of Array.forEach.
- Don't create classes that only have static members (like a static namespace).
- Don't use this and super in static contexts.
- Don't use unnecessary catch clauses.
- Don't use unnecessary constructors.
- Don't use unnecessary continue statements.
- Don't export empty modules that don't change anything.
- Don't use unnecessary escape sequences in regular expression literals.
- Don't use unnecessary fragments.
- Don't use unnecessary labels.
- Don't use unnecessary nested block statements.
- Don't rename imports, exports, and destructured assignments to the same name.
- Don't use unnecessary string or template literal concatenation.
- Don't use String.raw in template literals when there are no escape sequences.
- Don't use useless case statements in switch statements.
- Don't use ternary operators when simpler alternatives exist.
- Don't use useless `this` aliasing.
- Don't use any or unknown as type constraints.
- Don't initialize variables to undefined.
- Don't use the void operators (they're not familiar).
- Use arrow functions instead of function expressions.
- Use Date.now() to get milliseconds since the Unix Epoch.
- Use .flatMap() instead of map().flat() when possible.
- Use literal property access instead of computed property access.
- Don't use parseInt() or Number.parseInt() when binary, octal, or hexadecimal literals work.
- Use concise optional chaining instead of chained logical expressions.
- Use regular expression literals instead of the RegExp constructor when possible.
- Don't use number literal object member names that aren't base 10 or use underscore separators.
- Remove redundant terms from logical expressions.
- Use while loops instead of for loops when you don't need initializer and update expressions.
- Don't pass children as props.
- Don't reassign const variables.
- Don't use constant expressions in conditions.
- Don't use `Math.min` and `Math.max` to clamp values when the result is constant.
- Don't return a value from a constructor.
- Don't use empty character classes in regular expression literals.
- Don't use empty destructuring patterns.
- Don't call global object properties as functions.
- Don't declare functions and vars that are accessible outside their block.
- Make sure builtins are correctly instantiated.
- Don't use super() incorrectly inside classes. Also check that super() is called in classes that extend other constructors.
- Don't use variables and function parameters before they're declared.
- Don't use 8 and 9 escape sequences in string literals.
- Don't use literal numbers that lose precision.

### React and JSX Best Practices
- Don't use the return value of React.render.
- Make sure all dependencies are correctly specified in React hooks.
- Make sure all React hooks are called from the top level of component functions.
- Don't forget key props in iterators and collection literals.
- Don't destructure props inside JSX components in Solid projects.
- Don't define React components inside other components.
- Don't use event handlers on non-interactive elements.
- Don't assign to React component props.
- Don't use both `children` and `dangerouslySetInnerHTML` props on the same element.
- Don't use dangerous JSX props.
- Don't use Array index in keys.
- Don't insert comments as text nodes.
- Don't assign JSX properties multiple times.
- Don't add extra closing tags for components without children.
- Use `<>...</>` instead of `<Fragment>...</Fragment>`.
- Watch out for possible "wrong" semicolons inside JSX elements.

### Correctness and Safety
- Don't assign a value to itself.
- Don't return a value from a setter.
- Don't compare expressions that modify string case with non-compliant values.
- Don't use lexical declarations in switch clauses.
- Don't use variables that haven't been declared in the document.
- Don't write unreachable code.
- Make sure super() is called exactly once on every code path in a class constructor before this is accessed if the class has a superclass.
- Don't use control flow statements in finally blocks.
- Don't use optional chaining where undefined values aren't allowed.
- Don't have unused function parameters.
- Don't have unused imports.
- Don't have unused labels.
- Don't have unused private class members.
- Don't have unused variables.
- Make sure void (self-closing) elements don't have children.
- Don't return a value from a function with the return type 'void'
- Use isNaN() when checking for NaN.
- Make sure "for" loop update clauses move the counter in the right direction.
- Make sure typeof expressions are compared to valid values.
- Make sure generator functions contain yield.
- Don't use await inside loops.
- Don't use bitwise operators.
- Don't use expressions where the operation doesn't change the value.
- Make sure Promise-like statements are handled appropriately.
- Don't use __dirname and __filename in the global scope.
- Prevent import cycles.
- Don't use configured elements.
- Don't hardcode sensitive data like API keys and tokens.
- Don't let variable declarations shadow variables from outer scopes.
- Don't use the TypeScript directive @ts-ignore.
- Prevent duplicate polyfills from Polyfill.io.
- Don't use useless backreferences in regular expressions that always match empty strings.
- Don't use unnecessary escapes in string literals.
- Don't use useless undefined.
- Make sure getters and setters for the same property are next to each other in class and object definitions.
- Make sure object literals are declared consistently (defaults to explicit definitions).
- Use static Response methods instead of new Response() constructor when possible.
- Make sure switch-case statements are exhaustive.
- Make sure the `preconnect` attribute is used when using Google Fonts.
- Use `Array#{indexOf,lastIndexOf}()` instead of `Array#{findIndex,findLastIndex}()` when looking for the index of an item.
- Make sure iterable callbacks return consistent values.
- Use `with { type: "json" }` for JSON module imports.
- Use numeric separators in numeric literals.
- Use object spread instead of `Object.assign()` when constructing new objects.
- Always use the radix argument when using `parseInt()`.
- Make sure JSDoc comment lines start with a single asterisk, except for the first one.
- Include a description parameter for `Symbol()`.
- Don't use spread (`...`) syntax on accumulators.
- Don't use the `delete` operator.
- Don't access namespace imports dynamically.
- Don't use namespace imports.
- Declare regex literals at the top level.
- Don't use `target="_blank"` without `rel="noopener"`.

### TypeScript Best Practices
- Don't use TypeScript enums.
- Don't export imported variables.
- Don't add type annotations to variables, parameters, and class properties that are initialized with literal expressions.
- Don't use TypeScript namespaces.
- Don't use non-null assertions with the `!` postfix operator.
- Don't use parameter properties in class constructors.
- Don't use user-defined types.
- Use `as const` instead of literal types and type annotations.
- Use either `T[]` or `Array<T>` consistently.
- Initialize each enum member value explicitly.
- Use `export type` for types.
- Use `import type` for types.
- Make sure all enum members are literal values.
- Don't use TypeScript const enum.
- Don't declare empty interfaces.
- Don't let variables evolve into any type through reassignments.
- Don't use the any type.
- Don't misuse the non-null assertion operator (!) in TypeScript files.
- Don't use implicit any type on variable declarations.
- Don't merge interfaces and classes unsafely.
- Don't use overload signatures that aren't next to each other.
- Use the namespace keyword instead of the module keyword to declare TypeScript namespaces.

### Style and Consistency
- Don't use global `eval()`.
- Don't use callbacks in asynchronous tests and hooks.
- Don't use negation in `if` statements that have `else` clauses.
- Don't use nested ternary expressions.
- Don't reassign function parameters.
- This rule lets you specify global variable names you don't want to use in your application.
- Don't use specified modules when loaded by import or require.
- Don't use constants whose value is the upper-case version of their name.
- Use `String.slice()` instead of `String.substr()` and `String.substring()`.
- Don't use template literals if you don't need interpolation or special-character handling.
- Don't use `else` blocks when the `if` block breaks early.
- Don't use yoda expressions.
- Don't use Array constructors.
- Use `at()` instead of integer index access.
- Follow curly brace conventions.
- Use `else if` instead of nested `if` statements in `else` clauses.
- Use single `if` statements instead of nested `if` clauses.
- Use `new` for all builtins except `String`, `Number`, and `Boolean`.
- Use consistent accessibility modifiers on class properties and methods.
- Use `const` declarations for variables that are only assigned once.
- Put default function parameters and optional function parameters last.
- Include a `default` clause in switch statements.
- Use the `**` operator instead of `Math.pow`.
- Use `for-of` loops when you need the index to extract an item from the iterated array.
- Use `node:assert/strict` over `node:assert`.
- Use the `node:` protocol for Node.js builtin modules.
- Use Number properties instead of global ones.
- Use assignment operator shorthand where possible.
- Use function types instead of object types with call signatures.
- Use template literals over string concatenation.
- Use `new` when throwing an error.
- Don't throw non-Error values.
- Use `String.trimStart()` and `String.trimEnd()` over `String.trimLeft()` and `String.trimRight()`.
- Use standard constants instead of approximated literals.
- Don't assign values in expressions.
- Don't use async functions as Promise executors.
- Don't reassign exceptions in catch clauses.
- Don't reassign class members.
- Don't compare against -0.
- Don't use labeled statements that aren't loops.
- Don't use void type outside of generic or return types.
- Don't use console.
- Don't use control characters and escape sequences that match control characters in regular expression literals.
- Don't use debugger.
- Don't assign directly to document.cookie.
- Use `===` and `!==`.
- Don't use duplicate case labels.
- Don't use duplicate class members.
- Don't use duplicate conditions in if-else-if chains.
- Don't use two keys with the same name inside objects.
- Don't use duplicate function parameter names.
- Don't have duplicate hooks in describe blocks.
- Don't use empty block statements and static blocks.
- Don't let switch clauses fall through.
- Don't reassign function declarations.
- Don't allow assignments to native objects and read-only global variables.
- Use Number.isFinite instead of global isFinite.
- Use Number.isNaN instead of global isNaN.
- Don't assign to imported bindings.
- Don't use irregular whitespace characters.
- Don't use labels that share a name with a variable.
- Don't use characters made with multiple code points in character class syntax.
- Make sure to use new and constructor properly.
- Don't use shorthand assign when the variable appears on both sides.
- Don't use octal escape sequences in string literals.
- Don't use Object.prototype builtins directly.
- Don't redeclare variables, functions, classes, and types in the same scope.
- Don't have redundant "use strict".
- Don't compare things where both sides are exactly the same.
- Don't let identifiers shadow restricted names.
- Don't use sparse arrays (arrays with holes).
- Don't use template literal placeholder syntax in regular strings.
- Don't use the then property.
- Don't use unsafe negation.
- Don't use var.
- Don't use with statements in non-strict contexts.
- Make sure async functions actually use await.
- Make sure default clauses in switch statements come last.
- Make sure to pass a message value when creating a built-in error.
- Make sure get methods always return a value.
- Use a recommended display strategy with Google Fonts.
- Make sure for-in loops include an if statement.
- Use Array.isArray() instead of instanceof Array.
- Make sure to use the digits argument with Number#toFixed().
- Make sure to use the "use strict" directive in script files.

### Next.js Specific Rules
- Don't use `<img>` elements in Next.js projects.
- Don't use `<head>` elements in Next.js projects.
- Don't import next/document outside of pages/_document.jsx in Next.js projects.
- Don't use the next/head module in pages/_document.js on Next.js projects.

### Testing Best Practices
- Don't use export or module.exports in test files.
- Don't use focused tests.
- Make sure the assertion function, like expect, is placed inside an it() function call.
- Don't use disabled tests.

## Common Tasks
- `npx ultracite init` - Initialize Ultracite in your project
- `npx ultracite format` - Format and fix code automatically
- `npx ultracite lint` - Check for issues without fixing

## File Naming Conventions
- **Components**: `PascalCase` (UserProfile)
- **Files**: `kebab-case` (user-profile.tsx)
- **Functions**: `camelCase` (getUserProfile)
- **Constants**: `SCREAMING_SNAKE_case` (API_BASE_URL)
- **Types/Interfaces**: `PascalCase` (UserProfile, ApiResponse)

## Import Organization
1. External libraries (React, Next.js, etc.)
2. Internal utilities and components
3. Relative imports
4. Type-only imports (use `import type`)

## Component Patterns
- Use functional components with hooks only
- Custom hooks for reusable logic
- Proper dependency arrays in useEffect
- No missing keys in lists
- No components defined inside other components
- Use `<>...</>` instead of `<React.Fragment>`
- PascalCase for component names, kebab-case for file names
- Co-locate types with components
- Props interfaces defined inline or exported
- Default exports for components
- Composition over inheritance

## Database Operations
- Use Prisma for all database interactions
- Proper error handling for database operations
- Type-safe queries with Prisma client
- Use transactions for multi-step operations

## API Development
- Hono router for all endpoints
- Zod validation for request/response
- Proper HTTP status codes
- Consistent error response format
- CORS configuration for frontend

## Security Requirements
- No hardcoded secrets or API keys
- Environment variables for configuration
- Input validation with Zod
- HTTPS in production
- Rate limiting implementation
- Parameterized queries (handled by Prisma)

## Performance Guidelines
- Use Next.js Image component for images
- Implement loading states
- React.memo for expensive components
- Dynamic imports for code splitting
- Database indexes for queries
- Connection pooling for database

## Environment Setup
- MongoDB instance required (local or cloud)
- Environment files: `apps/web/.env` and `apps/server/.env`
- Use `.env.example` files as templates
- Never commit actual `.env` files

### Required Environment Variables
```bash
# apps/server/.env
DATABASE_URL="mongodb://localhost:27017/vsme_guru_dev"
CORS_ORIGIN="http://localhost:3001"

# apps/web/.env  
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Current Component Inventory

### Layout Components (Implemented)
- `apps/web/src/app/layout.tsx` - Root layout with providers and error boundaries
- `apps/web/src/components/layout/header.tsx` - Header with breadcrumbs and theme toggle
- `apps/web/src/components/layout/providers.tsx` - Theme and toast providers
- `apps/web/src/components/layout/app-layout.tsx` - Main application layout wrapper
- `apps/web/src/components/layout/dashboard-loading.tsx` - Dashboard skeleton loading

### Navigation Components (Implemented)
- `apps/web/src/components/navigation/app-sidebar.tsx` - Main sidebar with collapsible navigation
- `apps/web/src/components/navigation/nav-main.tsx` - Primary navigation items
- `apps/web/src/components/navigation/nav-projects.tsx` - Project navigation section
- `apps/web/src/components/navigation/nav-user.tsx` - User profile dropdown
- `apps/web/src/components/navigation/team-switcher.tsx` - Team/organization switcher

### Error Handling Components (Implemented)
- `apps/web/src/components/common/error-boundary.tsx` - React error boundary with recovery
- `apps/web/src/components/common/error-display.tsx` - Error display with retry functionality
- `apps/web/src/app/error.tsx` - Global error page
- `apps/web/src/app/not-found.tsx` - Custom 404 page

### Loading Components (Implemented)
- `apps/web/src/components/common/loading.tsx` - Various loading indicators
- `apps/web/src/components/layout/dashboard-loading.tsx` - Dashboard skeleton
- `apps/web/src/components/ui/skeleton.tsx` - Skeleton loading component

### UI Components (shadcn/ui - Implemented)
- `apps/web/src/components/ui/button.tsx` - Button component with variants
- `apps/web/src/components/ui/card.tsx` - Card component for content containers
- `apps/web/src/components/ui/input.tsx` - Input field component
- `apps/web/src/components/ui/sidebar.tsx` - Sidebar primitives
- `apps/web/src/components/ui/skeleton.tsx` - Loading skeleton
- `apps/web/src/components/ui/switch.tsx` - Toggle switch component
- And many more shadcn/ui components

### Authentication Components (Implemented)
- `apps/web/src/components/auth/auth-demo.tsx` - Mock authentication demo
- `apps/web/src/contexts/auth-context.tsx` - Authentication context provider
- `apps/web/src/contexts/mock-auth-context.tsx` - Mock authentication for development

### Utility Components (Implemented)
- `apps/web/src/components/common/mode-toggle.tsx` - Dark/light theme toggle
- `apps/web/src/components/common/api-status.tsx` - API connection status display

## Current Architecture Patterns

### Authentication System
- Mock authentication context in `apps/web/src/contexts/auth-context.tsx`
- JWT-based authentication routes in `apps/server/src/routes/auth.ts`
- User model with bcrypt password hashing
- localStorage persistence for authentication state

### API Structure
- Hono routers in `apps/server/src/routes/`
- Zod validation schemas in `apps/server/src/lib/validation.ts`
- Prisma database client in `apps/server/src/lib/db.ts`
- JWT utilities in `apps/server/src/lib/jwt.ts`

### Frontend Structure
- Next.js App Router in `apps/web/src/app/`
- Components in `apps/web/src/components/`
- Contexts in `apps/web/src/contexts/`
- Utilities in `apps/web/src/lib/`

## Testing Strategy (Future Implementation)
- Unit tests for individual functions and components
- Integration tests for API endpoints and database operations
- E2E tests for complete user workflows
- Tools under consideration: Vitest, Testing Library, Playwright

## Current State (Last Updated: January 8, 2025)

### What Actually Exists
- ✅ **Frontend**: Next.js 15.3.0 with App Router, React 19, TailwindCSS 4.1.11
- ✅ **Complete Layout System**: Header, sidebar, responsive design with collapsible navigation
- ✅ **shadcn/ui Components**: Button, Card, Input, Switch, and other components implemented
- ✅ **Comprehensive Error Handling**: Error boundaries, global error pages, recovery mechanisms
- ✅ **Loading States System**: Skeleton loading, inline loaders, page loaders, button loaders
- ✅ **Authentication Context**: Mock authentication for development with localStorage persistence
- ✅ **Theme System**: Dark/light mode with system preference detection
- ✅ **Backend**: Hono 4.8.10 with health check route and CORS configuration
- ✅ **Database**: Prisma 6.13.0 configured for MongoDB with type generation
- ✅ **API Integration**: Type-safe API client with error handling and retry logic
- ✅ **Build System**: Turborepo monorepo with Bun runtime, error-free development server

### What's Ready for Implementation
- 🔄 **Database Models**: Prisma schema ready for model definitions
- 🔄 **API Routes**: Hono server ready for route expansion
- 🔄 **Real Authentication**: Clerk integration planned and documented
- 🔄 **Data Fetching**: TanStack Query configured and ready to use
- 🔄 **Form Handling**: TanStack Form configured for complex forms

### Major Accomplishments
1. **Error Handling & Loading States**: Production-ready error boundaries, global error pages, consistent loading experience
2. **UI Foundation**: Complete component library with responsive layout and accessibility features
3. **Development Experience**: Error-free runtime, comprehensive TypeScript coverage, Biome formatting with no semicolons

### Current Implementation Status
Following the SaaS UI Foundation spec with these completed tasks:
- [x] Backend API foundation with Hono server structure and health check route
- [x] Database and validation setup with Prisma and Zod (schema ready for models)
- [x] Mock authentication context for UI development with localStorage persistence
- [x] Complete sidebar-07 block implementation with collapsible navigation
- [x] Comprehensive error handling system (boundaries, global pages, recovery)
- [x] Loading states system (skeleton, inline, page, button loaders)
- [x] Marketing page with VSME Guru branding and Norwegian content
- [x] Dashboard layout with responsive sidebar and breadcrumb navigation
- [x] Complete shadcn/ui component integration with accessibility features
- [x] API client with error handling, retry logic, and type safety
- [ ] Real authentication with Clerk (planned - see clerk-integration spec)
- [ ] Database connection and first models (ready to implement)
- [ ] API routes expansion (ready to implement)

## Development Guidelines

### AI Agent Server Testing (Important)
**Never start development servers using executeBash** as these are long-running processes that will hang execution.

**Recommended Testing Approach:**
1. Ask user to start development server in their terminal
2. Use `curl` commands to test API endpoints (these terminate quickly)
3. Ask user to share terminal output, errors, or startup issues

**Safe Testing Commands:**
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

**Commands to Avoid:**
```bash
bun dev          # Hangs execution
bun dev:server   # Hangs execution  
bun dev:web      # Hangs execution
```

### shadcn/ui Integration Rules
When building UI components:

1. **Discover Assets**: Use `list_components()` and `list_blocks()` to see available assets
2. **Map Request to Assets**: Analyze requirements and map to available components/blocks
3. **Prioritize Blocks**: Use blocks (`get_block`) for complex patterns (login, dashboards, calendars)
4. **Get Demo First**: Always call `get_component_demo(component_name)` before implementation
5. **Retrieve Code**: Use `get_component()` for single components, `get_block()` for composite blocks

### Documentation Evolution Protocol
- Documentation should be **reactive to implementation, not predictive**
- Update steering documents after completing features, not before
- Use real code examples from actual implementation
- Remove outdated theoretical patterns that weren't implemented
- Check current state documents before implementing new features

### Established Best Practices (From Implementation)
1. **Always wrap components with error boundaries**
2. **Implement loading states for all async operations**
3. **Use TypeScript interfaces for all props and API responses**
4. **Follow Next.js App Router conventions for file organization**
5. **Maintain comprehensive documentation for complex implementations**
6. **Code style**: No semicolons (configured in Biome with "asNeeded")

### Critical Notes
- Always run `bun check` before committing
- Use existing component patterns in `apps/web/src/components/`
- Follow established routing patterns in `apps/server/src/routes/`
- Maintain consistency with existing TypeScript configurations
- Leverage Turborepo caching for optimal build performance
- Check current state documents before implementing features

When implementing new features, always examine existing patterns first, follow the established conventions, and maintain the high standards for type safety, accessibility, and code quality that define this project.

## Established Implementation Patterns

### Error Handling Pattern (Required)
```typescript
// Component with error boundary
import { ErrorBoundary } from '@/components/common/error-boundary'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// API call with error handling
const { data, error, isLoading, execute } = useApiCall(apiCalls.healthCheck)

if (isLoading) return <InlineLoader />
if (error) return <ErrorDisplay error={error} onRetry={execute} />
return <div>{data}</div>

// Form submission with loading
const { submit, isLoading, error } = useAsyncSubmit(submitFunction)

<Button onClick={() => submit(formData)} disabled={isLoading}>
  {isLoading ? <ButtonLoader className="mr-2" /> : null}
  Submit
</Button>
```

### Loading State Pattern (Required)
```typescript
import { InlineLoader, PageLoader, ButtonLoader, DashboardLoading } from '@/components/common/loading'

// Page-level loading
if (isLoading) return <PageLoader text="Loading dashboard..." />

// Button loading state
<Button disabled={isLoading}>
  {isLoading ? <ButtonLoader className="mr-2" /> : null}
  {isLoading ? 'Submitting...' : 'Submit'}
</Button>

// Dashboard skeleton loading
<DashboardLoading />
```

### API Route Pattern (Hono)
```typescript
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "../lib/db";

const users = new Hono();

users.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = userSchema.parse(body);
    
    const user = await prisma.user.create({
      data: validatedData
    });
    
    return c.json({ success: true, data: user }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation failed", details: error.issues }, 400);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default users;
```

### React Component Pattern (Required)
```typescript
"use client";

import { ErrorBoundary } from '@/components/common/error-boundary'
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Component({ className, children }: ComponentProps) {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <ErrorBoundary>
      <div className={cn("base-styles", className)}>
        {children}
      </div>
    </ErrorBoundary>
  );
}
```

### Error Handling Pattern
```typescript
// ✅ Good: Comprehensive error handling
try {
  const result = await fetchData();
  return { success: true, data: result };
} catch (error) {
  console.error('API call failed:', error);
  return { success: false, error: error.message };
}

// ❌ Bad: Swallowing errors
try {
  return await fetchData();
} catch (e) {
  console.log(e);
}
```

## Next Implementation Steps
Based on current state, the immediate next steps are:
1. **Database Connection**: Set up MongoDB connection and first model
2. **API Routes**: Implement first CRUD endpoints using established Hono patterns
3. **Real Data Flow**: Connect frontend components to real API data
4. **Clerk Authentication**: Replace mock auth with Clerk integration
5. **Testing Setup**: Implement testing strategy with Vitest
6. **Form Implementation**: Build forms with TanStack Form

## Quality Assessment (Current State)
- **Code Quality**: A+ (Excellent) - Production-ready error boundaries, comprehensive TypeScript coverage
- **Developer Experience**: A+ (Excellent) - Error-free runtime, comprehensive documentation
- **Production Readiness**: B+ (Very Good) - Missing database connection, real authentication, testing