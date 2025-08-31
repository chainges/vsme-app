# VSME Guru Architecture - Repository & Code Structure

**Source:** Architecture Document Section 4  
**Version:** 1.0  
**Date:** August 19, 2025  
**Author:** Winston, Architect

## Overview

The project will be organized as a **Turborepo monorepo** to facilitate code sharing and maintain a single source of truth for types and configurations. This structure enables efficient development, shared tooling, and seamless type sharing between frontend and backend.

## Monorepo Benefits

### Code Sharing
- **Shared Types:** Common TypeScript interfaces and types
- **Shared Utilities:** Common utility functions and helpers
- **Shared Configurations:** ESLint, Prettier, and build configurations
- **Shared Constants:** Application-wide constants and enums

### Development Efficiency
- **Single Repository:** One place for all project code
- **Unified Tooling:** Consistent development tools across applications
- **Parallel Development:** Frontend and backend can be developed simultaneously
- **Dependency Management:** Centralized package management

### Type Safety
- **End-to-End Types:** Types flow from database to frontend
- **Shared Schemas:** Zod schemas shared between frontend and backend
- **Generated Types:** Prisma-generated types available everywhere
- **Consistent Interfaces:** Same data structures across the stack

## Root Structure

### Directory Organization
```
/
├── apps/                    # Application packages
│   ├── api/                # Hono Backend Application
│   └── web/                # Next.js Frontend Application
├── packages/                # Shared packages
│   ├── shared-types/       # Generated Prisma types, Zod schemas
│   └── ui/                 # (Optional) Shared React components
├── .eslintrc.js            # Root ESLint config
├── prettier.config.js      # Root Prettier config
├── netlify.toml            # Netlify deployment configuration
├── package.json            # Root package.json with workspaces
├── turbo.json              # Turborepo configuration
└── tsconfig.json           # Root TypeScript configuration
```

### Key Files
- **`package.json`:** Defines workspaces and root dependencies
- **`turbo.json`:** Configures build pipelines and caching
- **`.eslintrc.js`:** Shared ESLint rules across all packages
- **`prettier.config.js`:** Consistent code formatting rules
- **`netlify.toml`:** Deployment configuration for both applications

## Backend Structure (`apps/api`)

### Feature-Based Architecture
The Hono backend follows a **feature-based ("co-location") structure** for maintainability and clear organization.

### Directory Structure
```
apps/api/src/
├── index.ts                 # Application entry point
├── middleware/              # Global middleware
│   ├── auth.ts             # Authentication middleware
│   ├── cors.ts             # CORS configuration
│   └── validation.ts       # Request validation middleware
├── features/                # Feature-based modules
│   ├── company/            # Company management feature
│   │   ├── company.controller.ts  # Hono route definitions
│   │   ├── company.service.ts     # Business logic
│   │   ├── company.types.ts       # Type definitions
│   │   └── company.validation.ts  # Zod validation schemas
│   ├── reports/            # Report management feature
│   │   ├── report.controller.ts
│   │   ├── report.service.ts
│   │   ├── report.types.ts
│   │   ├── report.validation.ts
│   │   └── pdf.generator.ts       # PDF generation logic
│   ├── auth/               # Authentication feature
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.middleware.ts
│   └── health/             # Health check feature
│       └── health.controller.ts
├── lib/                     # Shared utilities and configurations
│   ├── database.ts         # Database connection setup
│   ├── logger.ts           # Logging configuration
│   ├── errors.ts           # Error handling utilities
│   └── constants.ts        # Application constants
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma       # Single source of truth for DB schema
│   ├── migrations/         # Database migration files
│   └── seed.ts             # Database seeding script
└── types/                   # Global type definitions
    ├── global.ts           # Global type augmentations
    └── api.ts              # API-specific types
```

### Feature Organization Principles

#### 1. Co-location
- **Related Files:** Keep related functionality together
- **Clear Boundaries:** Each feature is self-contained
- **Easy Navigation:** Developers can find all related code in one place

#### 2. Separation of Concerns
- **Controller:** Route definitions and request handling
- **Service:** Business logic and data processing
- **Types:** TypeScript interfaces and types
- **Validation:** Zod schemas for request validation

#### 3. Consistent Naming
- **File Names:** Descriptive and consistent naming convention
- **Function Names:** Clear and descriptive function names
- **Variable Names:** Meaningful variable and constant names

## Frontend Structure (`apps/web`)

### Next.js App Router Structure
The Next.js frontend follows a **feature-based structure**, co-locating components with the pages that use them.

### Directory Structure
```
apps/web/src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Authentication route group
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/        # Dashboard route group
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── dashboard-overview.tsx
│   │   │       ├── progress-chart.tsx
│   │   │       └── quick-actions.tsx
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── report-list.tsx
│   │   │       ├── report-card.tsx
│   │   │       └── create-report-button.tsx
│   │   └── report/[year]/  # Dynamic report year route
│   │       ├── page.tsx
│   │       ├── layout.tsx
│   │       ├── general/
│   │       │   ├── page.tsx
│   │       │   └── components/
│   │       │       ├── company-info-form.tsx
│   │       │       └── strategy-form.tsx
│   │       ├── environment/
│   │       │   ├── page.tsx
│   │       │   └── components/
│   │       │       ├── energy-consumption-form.tsx
│   │       │       ├── ghg-emissions-form.tsx
│   │       │       └── waste-management-form.tsx
│   │       ├── social/
│   │       │   ├── page.tsx
│   │       │   └── components/
│   │       │       ├── workforce-form.tsx
│   │       │       └── human-rights-form.tsx
│   │       └── governance/
│   │           ├── page.tsx
│   │           └── components/
│   │               ├── business-conduct-form.tsx
│   │               └── governance-form.tsx
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/              # Shared components
│   ├── ui/                 # shadcn/ui components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components
│   └── common/             # Common utility components
├── lib/                     # Utility functions and configurations
│   ├── api.ts              # API client configuration
│   ├── auth.ts             # Authentication utilities
│   ├── utils.ts            # Common utility functions
│   └── constants.ts        # Application constants
├── hooks/                   # Custom React hooks
│   ├── use-auth.ts         # Authentication hook
│   ├── use-company.ts      # Company data hook
│   └── use-reports.ts      # Reports data hook
├── types/                   # TypeScript type definitions
│   ├── api.ts              # API response types
│   ├── forms.ts            # Form data types
│   └── common.ts           # Common types
└── styles/                  # Additional styling
    ├── components.css      # Component-specific styles
    └── themes.css          # Theme configurations
```

### Component Organization Principles

#### 1. Feature Co-location
- **Page Components:** Main page components
- **Feature Components:** Components specific to each feature
- **Shared Components:** Reusable components in shared directories

#### 2. Component Hierarchy
- **UI Components:** Base shadcn/ui components
- **Form Components:** Specialized form components
- **Layout Components:** Page layout and navigation
- **Feature Components:** Business logic components

#### 3. File Naming Convention
- **Components:** PascalCase (e.g., `CompanyInfoForm.tsx`)
- **Pages:** lowercase with hyphens (e.g., `company-info.tsx`)
- **Utilities:** camelCase (e.g., `formatCurrency.ts`)
- **Types:** camelCase with `.types.ts` suffix

## Shared Packages (`packages/`)

### Shared Types Package
```
packages/shared-types/
├── package.json            # Package configuration
├── src/
│   ├── index.ts           # Main export file
│   ├── database.ts        # Database-generated types
│   ├── api.ts             # API request/response types
│   ├── forms.ts           # Form data types
│   └── common.ts          # Common shared types
├── tsconfig.json          # TypeScript configuration
└── README.md              # Package documentation
```

### Shared UI Package (Optional)
```
packages/ui/
├── package.json            # Package configuration
├── src/
│   ├── index.ts           # Main export file
│   ├── components/         # Shared React components
│   ├── hooks/             # Shared React hooks
│   └── utils/             # Shared utility functions
├── tsconfig.json          # TypeScript configuration
└── README.md              # Package documentation
```

## Configuration Files

### Root Configuration
- **`package.json`:** Workspace definitions and root scripts
- **`turbo.json`:** Build pipeline configuration
- **`tsconfig.json`:** Base TypeScript configuration
- **`.eslintrc.js`:** Shared ESLint rules
- **`prettier.config.js`:** Code formatting rules

### Application-Specific Configuration
- **`apps/api/tsconfig.json`:** Backend TypeScript configuration
- **`apps/web/tsconfig.json`:** Frontend TypeScript configuration
- **`apps/api/package.json`:** Backend dependencies and scripts
- **`apps/web/package.json`:** Frontend dependencies and scripts

## Development Workflow

### Package Management
- **Root Dependencies:** Common development tools and build tools
- **App Dependencies:** Application-specific dependencies
- **Shared Dependencies:** Dependencies used across multiple apps
- **Dev Dependencies:** Development and testing tools

### Build Process
- **Turborepo Pipeline:** Optimized build and test execution
- **Parallel Execution:** Build multiple packages simultaneously
- **Intelligent Caching:** Cache build outputs for faster rebuilds
- **Dependency Graph:** Automatic dependency resolution

### Development Commands
```bash
# Install all dependencies
npm install

# Start development servers
npm run dev

# Build all packages
npm run build

# Run tests across all packages
npm run test

# Lint all packages
npm run lint

# Format all packages
npm run format
```

## Benefits of This Structure

### Development Efficiency
- **Single Repository:** One place for all project code
- **Shared Tooling:** Consistent development experience
- **Type Sharing:** Seamless type sharing between applications
- **Parallel Development:** Multiple teams can work simultaneously

### Code Quality
- **Consistent Standards:** Unified coding standards across applications
- **Shared Validation:** Common validation schemas
- **Type Safety:** End-to-end TypeScript support
- **Code Reuse:** Shared utilities and components

### Maintenance
- **Clear Organization:** Logical file and folder structure
- **Easy Navigation:** Developers can quickly find relevant code
- **Scalable Structure:** Easy to add new features and applications
- **Dependency Management:** Centralized package management

## Next Steps

### Immediate Actions
1. **Repository Setup:** Initialize Turborepo monorepo structure
2. **Package Creation:** Create all necessary packages and applications
3. **Configuration Setup:** Configure TypeScript, ESLint, and Prettier
4. **Dependency Installation:** Install all required dependencies

### Development Preparation
1. **Team Training:** Ensure team understands monorepo structure
2. **Development Standards:** Establish coding standards and conventions
3. **Tooling Setup:** Configure development tools and workflows
4. **Documentation:** Document structure and development guidelines 