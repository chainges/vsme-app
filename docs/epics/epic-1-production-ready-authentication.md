# Epic 1: Production-Ready Authentication (Clerk Integration)

**Overview:**

This epic focuses on transitioning the VSME Guru application from a mock authentication system to a production-ready authentication solution using Clerk. The goal is to enhance security, user experience, and scalability by leveraging Clerk's authentication features.

**Objectives:**

- Replace the existing mock authentication with Clerk.
- Integrate Clerk into the root layout and authentication hooks.
- Update components (landing page, navigation, dashboard, sidebar) to use Clerk-verified user data.
- Implement secure sign-in/sign-up flows with Clerk's built-in components.
- Ensure that route protection and middleware are correctly configured.

**Key Tasks:**

1. **Dependency Installation & Environment Setup:**
   - Install `@clerk/nextjs` using Bun (e.g., `bun add @clerk/nextjs`).
   - Update environment variables in `apps/web/.env` for Clerk keys and URLs.

2. **Root Layout Update:**
   - Replace the existing `AuthProvider` with Clerk’s `ClerkProvider` in `apps/web/src/app/layout.tsx`.

3. **Authentication Hook Update:**
   - Update the authentication hook (e.g., in `apps/web/src/hooks/use-auth.ts`) to wrap Clerk's authentication methods and user extraction.

4. **Component Updates:**
   - Update component imports to replace `useMockAuth` with the new `useAuth` implementation based on Clerk.
   - Modify the sign-in button on the landing page to use Clerk’s `SignInButton`.
   - Update the navigation component to use Clerk’s `SignOutButton` or `UserButton`.

5. **Route Protection & Middleware:**
   - Create or update a middleware (`apps/web/src/middleware.ts`) that uses Clerk's `authMiddleware` to secure protected routes.

6. **Sign-In/Sign-Up Pages:**
   - Create dedicated sign-in and sign-up pages under `apps/web/src/app/sign-in` and `apps/web/src/app/sign-up` using Clerk components.

**Success Criteria:**

- Users are redirected correctly after sign-in and sign-out.
- Only authenticated users can access protected routes.
- User data displays accurately across the application.
- The authentication flow is seamless and secure, with production-ready standards.

**Reference:**

For detailed integration steps, please refer to the [Clerk Integration Guide](../clerk-integration-guide.md).

---

This document, created using the brownfield epic creation process, outlines the plan for achieving a production-ready authentication system by leveraging Clerk. It will serve as the foundation for breaking down further user stories and tasks related to authentication migration.
