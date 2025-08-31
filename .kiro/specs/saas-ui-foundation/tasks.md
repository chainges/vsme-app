# Implementation Plan

## Authentication Note

**Authentication will be handled by a Clerk integration. See [Clerk Integration Spec](../clerk-integration/tasks.md) for authentication-related tasks.**

**For UI development**: We'll use a simple mock auth state to enable UI development without being blocked by authentication implementation.

- [x] 1. Set up backend API foundation
- [x] 1.1 Create Hono server structure

  - Set up modular routing structure in apps/server/src/routes/
  - Create main app.ts with route mounting using app.route()
  - Configure CORS and logging middleware
  - _Requirements: Backend architecture foundation_

- [x] 1.2 Set up database and validation

  - Configure Prisma with MongoDB for User model
  - Create shared Zod validation schemas in lib/validation.ts
  - Set up database connection and client export
  - _Requirements: Data persistence and validation_

- [x] 1.3 Implement authentication routes (DEPRECATED - replaced by Clerk)

  - ~~Create auth.ts router with login, register, logout endpoints~~
  - ~~Implement JWT token generation and validation~~
  - ~~Add password hashing with bcrypt~~
  - **Note**: This task is completed but will be replaced by Clerk integration soon
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Create mock authentication for UI development
- [x] 2.1 Set up mock auth context

  - Create simple MockAuthProvider with toggleable auth state
  - Implement mock user data for UI development
  - Add environment variable to enable/disable mock mode
  - Create mock auth hooks (useMockAuth) for components
  - _Requirements: UI development enablement_

- [x] 2.2 Set up RPC type export and API structure

  - Create routes/index.ts for route aggregation
  - Export AppType for frontend RPC integration
  - Ensure full type safety across API surface
  - Set up API routes that will work with Clerk authentication
  - _Requirements: Type safety and developer experience_

- [x] 3. Install and configure required shadcn/ui components

  - Install sidebar, dropdown-menu, avatar, breadcrumb, and collapsible components
  - Configure component imports and ensure proper styling
  - Test component functionality with existing theme system
  - _Requirements: 3.1, 3.2_

- [x] 4. Implement sidebar-07 block components
- [x] 4.1 Create base sidebar structure

  - Copy and adapt AppSidebar component from sidebar-07 block
  - Implement SidebarProvider and SidebarInset layout structure
  - Customize branding for VSME Guru in sidebar header
  - _Requirements: 3.1, 3.2, 3.6_

- [x] 4.2 Implement navigation components

  - Create NavMain component with VSME Guru navigation items
  - Implement NavProjects component for project navigation
  - Create TeamSwitcher component customized for VSME Guru branding
  - _Requirements: 3.2, 3.3_

- [x] 4.3 Create user profile navigation with mock auth

  - Create NavUser component using mock auth state
  - Implement user profile dropdown with mock user data
  - Add sign-out functionality that toggles mock auth state
  - **Note**: Will be replaced by Clerk's UserButton in final implementation
  - _Requirements: 3.5, 3.6_

- [x] 5. Create dashboard layout and routing
- [x] 5.1 Implement dashboard layout component

  - Create DashboardLayout component using sidebar structure
  - Add breadcrumb navigation and sidebar trigger
  - Ensure responsive design with mobile sidebar collapse
  - _Requirements: 3.1, 3.4, 5.1, 5.2, 6.1, 6.2_

- [x] 5.2 Create dashboard pages and routing

  - Create /dashboard route with basic dashboard content
  - Implement /dashboard/projects and /dashboard/settings routes
  - Add proper Next.js App Router structure for dashboard
  - Set up basic routing structure (authentication will be handled by Clerk)
  - _Requirements: 3.3, 5.5_

- [x] 6. Transform marketing page
- [x] 6.1 Create simple marketing layout
  - Remove current ASCII art and create clean marketing layout
  - Implement simple hero section with VSME Guru title, ask the user for an example picture.
  - Add centered layout with minimal design
  - _Requirements: 1.1, 1.4, 6.1_

- [x] 6.2 Create sign-in with mock auth
  - Create SignInButton component that toggles mock auth state
  - Add blue styling and proper visual feedback
  - Implement mock sign-in flow that redirects to dashboard
  - **Note**: Final sign-in functionality will be implemented with Clerk
  - _Requirements: 1.2, 2.1, 2.2_

- [x] 7. Add loading states and error handling
  - Add error boundaries for component failures
  - Create fallback UI for missing data or errors
  - Handle API errors and network failures gracefully
  - Set up basic loading state patterns
  - _Requirements: 2.5, 5.4_

- [x] 8. Implement responsive design and accessibility
- [x] 8.1 Ensure mobile responsiveness
  - Test sidebar collapse functionality on mobile devices
  - Verify marketing page responsive design
  - Add proper touch interactions for mobile sidebar
  - _Requirements: 1.3, 3.4, 6.1, 6.2_

- [x] 8.2 Add accessibility features
  - Implement proper ARIA labels for navigation elements
  - Add keyboard navigation support for sidebar and dropdowns
  - Ensure focus management for route changes
  - Test screen reader compatibility
  - _Requirements: 6.3, 6.4, 6.5_

- [x] 9. Apply color scheme and theming
- [x] 9.1 Implement blue and emerald color scheme
  - Update Tailwind configuration with custom blue and emerald colors
  - Apply primary blue colors to key UI elements
  - Add emerald/teal accents to secondary elements
  - _Requirements: 1.6, 1.7_

- [x] 9.2 Ensure theme compatibility
  - Test color scheme with both light and dark themes
  - Maintain existing theme toggle functionality
  - Verify color contrast and accessibility standards
  - _Requirements: 1.5, 5.3_

- [x] 10. Final UI foundation testing
- [x] 10.1 Test UI components and layout
  - Verify all sidebar navigation components work correctly
  - Test responsive behavior across different screen sizes
  - Confirm proper URL updates and browser history
  - Test component styling and theming
  - _Requirements: 3.2, 3.3, 5.5, 5.6_

- [x] 10.2 Prepare for Clerk integration
  - Test complete UI flow with mock authentication
  - Verify layout switching between marketing and dashboard
  - Document mock auth integration points for Clerk replacement
  - Ensure all components work with mock auth state
  - **Next Step**: Implement [Clerk Integration Spec](../clerk-integration/tasks.md)
  - _Requirements: Integration preparation_
