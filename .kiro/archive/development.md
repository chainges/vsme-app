# Development Guidelines

**🔄 DEVELOPMENT GUIDELINES**

_This document provides workflow guidelines and project standards for development. For technology stack details and commands, see `Foundation/steering/tech.md`._

## Environment Setup

### Prerequisites

- **Bun v1.2.19+**: Primary runtime and package manager
- **Node.js**: Compatible for tooling (optional)
- **MongoDB**: Database instance (local or cloud)

### Initial Setup

```bash
# Clone and install dependencies
bun install

# Set up environment variables
cp apps/web/.env.example apps/web/.env
cp apps/server/.env.example apps/server/.env

# Configure database (when models are defined)
bun db:generate
bun db:push
```

## Development Workflow

**📋 For complete command reference, see `Foundation/steering/tech.md`**

### Quick Command Reference

- `bun dev` - Start all services
- `bun check` - Format and lint code
- `bun db:studio` - Open database management interface

### AI Agent Development Server Testing

**Important**: AI agents should NOT start development servers using `executeBash` as these are long-running processes that will hang the execution.

#### Recommended Testing Approach

1. **User starts server**: Ask the user to start the development server in their terminal
2. **Agent tests endpoints**: Use `curl` commands to test API endpoints (these terminate quickly)
3. **User provides feedback**: Ask user to share any terminal output, errors, or startup issues

#### Testing Commands (AI Agent Safe)

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

#### Commands to Avoid in AI Agent Execution

```bash
# These will hang the agent execution:
bun dev          # Starts all services (long-running)
bun dev:server   # Starts backend server (long-running)
bun dev:web      # Starts frontend server (long-running)
```

## Project Standards

### File Organization

- **Components**: Place in `apps/web/src/components/`
  - UI components: `apps/web/src/components/ui/`
  - Common components: `apps/web/src/components/common/`
  - Layout components: `apps/web/src/components/layout/`
  - Navigation components: `apps/web/src/components/navigation/`
- **Pages**: Use Next.js App Router in `apps/web/src/app/`
- **API Routes**: Place in `apps/server/src/routers/`
- **Utilities**: Place in respective `lib/` directories
- **Hooks**: Place in `apps/web/src/hooks/`
- **Types**: Co-locate with components or in dedicated `types/` directories

### Naming Conventions

- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions**: camelCase (e.g., `getUserProfile`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`, `ApiResponse`)
- **Hooks**: camelCase starting with 'use' (e.g., `useApiCall`)

### Import Order

1. External libraries (React, Next.js, etc.)
2. Internal utilities and components
3. Relative imports
4. Type-only imports (use `import type`)

### Component Patterns

- Use functional components with hooks
- Prefer composition over inheritance
- Extract custom hooks for reusable logic
- Use TypeScript interfaces for props
- Export components as default from their files
- **Always wrap components with error boundaries**
- **Implement loading states for all async operations**
- **Use consistent error handling patterns**

### Established Best Practices
Based on current implementation:

1. **Error Handling**: All components should be wrapped with error boundaries
2. **Loading States**: Use consistent loading patterns across the application
3. **Type Safety**: All props, API responses, and hooks should be properly typed
4. **Accessibility**: Include ARIA labels and keyboard navigation
5. **Code Style**: No semicolons (configured in Biome)
6. **Client Components**: Mark interactive components with `"use client"`

## Testing Strategy (Future)

_Note: No testing setup exists yet. This will be documented when we implement testing._

### Planned Approach

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows

### Tools Under Consideration

- **Vitest**: Unit and integration testing
- **Testing Library**: Component testing
- **Playwright**: E2E testing

## Performance Guidelines

### Frontend Optimization

- Use Next.js Image component for images
- Implement proper loading states
- Use React.memo for expensive components
- Optimize bundle size with dynamic imports

### Backend Optimization

- Use database indexes appropriately
- Implement proper caching strategies
- Use connection pooling for database
- Monitor API response times

## Security Best Practices

### Environment Variables

- Never commit `.env` files
- Use different environments for development/production
- Validate environment variables at startup

### API Security

- Implement proper CORS configuration
- Use input validation with Zod
- Implement rate limiting
- Use HTTPS in production

### Database Security

- Use parameterized queries (Prisma handles this)
- Implement proper access controls
- Regular security updates

## Deployment Considerations

### Build Process

```bash
bun build        # Build all applications
```

### Environment Configuration

- Set appropriate `NODE_ENV`
- Configure database connections
- Set up monitoring and logging

### Performance Monitoring

- Monitor application metrics
- Set up error tracking
- Implement health checks
