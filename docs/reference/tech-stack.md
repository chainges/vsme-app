# Technology Stack Reference

**📚 REFERENCE DOCUMENT - Consolidated technology information**

_This document consolidates all technology stack information, versions, and commands into a single reference. It combines information from tech.md and other technology-related documents._

## 🚀 **Runtime & Package Manager**

### **Primary Runtime**
- **Bun**: v1.2.19+ - Primary runtime and package manager
- **Node.js**: Compatible for tooling (optional)

### **Package Management**
```bash
# Install dependencies
bun install

# Add new dependencies
bun add package-name
bun add -D package-name  # Dev dependencies

# Remove dependencies
bun remove package-name

# Update dependencies
bun update
```

## 🏗️ **Build System**

### **Monorepo Management**
- **Turborepo**: Monorepo build orchestration with caching
- **Workspaces**: Configured for apps/* and packages/*

### **Build Commands**
```bash
# Build all applications
bun build

# Build specific app
bun build --filter=web
bun build --filter=server

# Type checking
bun check-types
```

## 🌐 **Frontend Stack**

### **Core Framework**
- **Next.js**: 15.3.0 with App Router
- **React**: 19.1.1 with latest features
- **TypeScript**: 5.9.2 with strict mode

### **Styling & UI**
- **TailwindCSS**: 4.1.11 utility-first CSS framework
- **shadcn/ui**: Component library with "new-york" style
- **Radix UI**: Headless UI primitives
- **Lucide React**: Icon library

### **State Management**
- **TanStack Query**: Server state management (installed, not implemented)
- **TanStack Form**: Form state management (installed, not implemented)
- **React Context**: Theme and authentication state

### **Frontend Commands**
```bash
# Start frontend development server
bun dev:web          # Port 3001

# Build frontend
bun build --filter=web

# Type check frontend
bun check-types --filter=web
```

## 🔧 **Backend Stack**

### **Web Framework**
- **Hono**: 4.8.10 lightweight web framework
- **Bun**: Runtime for backend server

### **Database & ORM**
- **Prisma**: 6.13.0 TypeScript-first ORM
- **MongoDB**: NoSQL database (schema defined, not connected)

### **Validation & Types**
- **Zod**: 4.0.14 runtime type validation
- **TypeScript**: Strict mode enabled

### **Backend Commands**
```bash
# Start backend development server
bun dev:server       # Port 3000

# Build backend
bun build --filter=server

# Type check backend
bun check-types --filter=server
```

## 🗄️ **Database Stack**

### **Current Status**
- **Schema**: Prisma schema defined with ESG models
- **Connection**: Not yet implemented
- **Models**: User, Company, Report with ESG data types

### **Database Commands (When Connected)**
```bash
# Generate Prisma client
bun db:generate

# Push schema to database
bun db:push

# Open database studio
bun db:studio

# Run migrations
bun db:migrate

# Seed database
bun db:seed
bun db:seed:dev
bun db:seed:prod

# Database status
bun db:status
bun db:test-external
```

### **Database Configuration**
```bash
# Environment variables needed
PRIMARY_DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/database-name
SCOPE321_DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/shared-data
EXTERNAL_DATABASE_NAME=co2-intensities-dev
```

## 🎨 **UI Component System**

### **shadcn/ui Configuration**
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

### **Component Categories**
- **Layout**: Sidebar, header, navigation components
- **UI**: Button, input, form, and display components
- **Navigation**: Menu, dropdown, and routing components
- **Feedback**: Toast, alert, and status components

### **Theme System**
- **Dark/Light Mode**: System preference detection
- **CSS Variables**: Dynamic theme switching
- **Color Palette**: Blue primary, emerald/teal secondary
- **Typography**: Geist font family

## 🔍 **Code Quality & Formatting**

### **Linting & Formatting**
- **Biome**: 2.1.2 lightning-fast formatter and linter
- **Ultracite**: 5.1.2 opinionated code quality rules
- **Configuration**: Extends ultracite config with no semicolons

### **Code Quality Commands**
```bash
# Lint and format code
bun check

# Check types across monorepo
bun check-types

# Validate type alignment
bun validate:types
```

### **Code Style Rules**
- **No Semicolons**: Configured with "asNeeded" setting
- **TypeScript Strict**: Zero `any` types allowed
- **Accessibility**: WCAG 2.1 AA compliance required
- **React Hooks**: Proper dependency arrays required

## 🧪 **Testing Stack (Planned)**

### **Recommended Tools**
- **Vitest**: Fast unit and integration testing
- **Testing Library**: React component testing utilities
- **MSW**: API mocking for frontend tests
- **Playwright**: End-to-end testing framework

### **Testing Commands (When Implemented)**
```bash
# Run tests
bun test

# Run tests with UI
bun test:ui

# Run tests with coverage
bun test:coverage

# Run E2E tests
bun test:e2e
```

## 🚀 **Development Commands**

### **Development Servers**
```bash
# Start all services
bun dev

# Start specific services
bun dev:web          # Frontend only (port 3001)
bun dev:server       # Backend only (port 3000)
bun dev:native       # Native app (if implemented)
```

### **Build & Production**
```bash
# Build all applications
bun build

# Build specific applications
bun build --filter=web
bun build --filter=server

# Check types across monorepo
bun check-types
```

### **Environment Management**
```bash
# Environment setup
bun env:setup
bun env:validate

# Type validation
bun validate:types
```

## 📱 **Mobile & Native (Future)**

### **Planned Support**
- **React Native**: Mobile application development
- **Native Bundling**: Bun native compilation support
- **Cross-platform**: Shared business logic between web and mobile

### **Native Commands (When Implemented)**
```bash
# Start native development
bun dev:native

# Build native app
bun build --filter=native

# Compile native binary
bun run compile
```

## 🔧 **Configuration Files**

### **Root Configuration**
- `package.json`: Workspace configuration and scripts
- `turbo.json`: Turborepo task definitions
- `biome.json`: Code formatting and linting rules
- `tsconfig.json`: Root TypeScript configuration
- `bunfig.toml`: Bun runtime configuration

### **App-specific Configuration**
- `apps/web/next.config.ts`: Next.js configuration
- `apps/web/components.json`: shadcn/ui configuration
- `apps/web/postcss.config.mjs`: PostCSS configuration
- `apps/server/prisma/schema/schema.prisma`: Database schema

### **Environment Files**
- `apps/web/.env`: Frontend environment variables
- `apps/server/.env`: Backend environment variables
- Both apps have `.env.example` files as templates

## 🌍 **Environment Support**

### **Environment Types**
- **Development**: Local development with hot reload
- **Test**: Testing environment with test database
- **Staging**: Pre-production environment
- **Production**: Production environment

### **Environment Variables**
```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Backend
PRIMARY_DATABASE_URL=mongodb://...
SCOPE321_DATABASE_URL=mongodb://...
NODE_ENV=development
```

## 📊 **Performance & Optimization**

### **Build Optimization**
- **Turborepo Caching**: Incremental builds and caching
- **Code Splitting**: Next.js automatic code splitting
- **Tree Shaking**: Unused code elimination
- **Bundle Analysis**: Build size optimization

### **Runtime Performance**
- **Bun Runtime**: Fast JavaScript runtime
- **Hono Framework**: Lightweight and performant
- **Prisma ORM**: Optimized database queries
- **React 19**: Latest performance optimizations

## 🔒 **Security Features**

### **Current Security**
- **CORS Configuration**: Proper cross-origin setup
- **Type Safety**: TypeScript strict mode
- **Input Validation**: Zod schema validation (when implemented)

### **Planned Security**
- **Authentication**: Clerk integration
- **Authorization**: Role-based access control
- **Data Encryption**: Encrypted storage and transmission
- **API Security**: Rate limiting and validation

## 📚 **Documentation & Resources**

### **Official Documentation**
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Hono**: https://hono.dev
- **Prisma**: https://www.prisma.io/docs
- **TailwindCSS**: https://tailwindcss.com/docs

### **Component Libraries**
- **shadcn/ui**: https://ui.shadcn.com
- **Radix UI**: https://www.radix-ui.com
- **Lucide Icons**: https://lucide.dev

### **Development Tools**
- **Biome**: https://biomejs.dev
- **Turborepo**: https://turbo.build/repo
- **Bun**: https://bun.sh/docs

---

**Note**: This document consolidates technology information from multiple sources. When implementing new features, refer to the appropriate sections and ensure compatibility with the current technology stack.
