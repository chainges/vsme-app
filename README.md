# My Better T App - Project Scaffolding

**Status: Basic Tech Stack Scaffolding with Mock Authentication**

This is a **greenfield project scaffolding** built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) that provides the foundation for building a full-stack TypeScript application. Currently, this is a **minimal implementation** with basic UI components and mock authentication for development purposes.

## 🚧 **Current Implementation Status**

### ✅ **What Actually Exists Right Now**

#### **Frontend (apps/web/)**
- **Next.js 15.3.0** with App Router (basic setup)
- **React 19** functional components
- **TailwindCSS 4.1.11** for styling
- **Theme System** with dark/light mode toggle
- **Basic Layout System** with sidebar navigation structure
- **shadcn/ui Components** (multiple components installed and configured)
- **Mock Authentication System** with context and localStorage persistence
- **Landing Page** with VSME Guru branding (Norwegian content)
- **Dashboard Layout** with responsive sidebar (no actual dashboard content)

#### **Backend (apps/server/)**
- **Hono 4.8.10** web framework (basic setup)
- **Health Check Route**: GET / returns server status
- **Prisma 6.13.0** configured for MongoDB
- **Database Schema** defined but no actual data models implemented
- **Placeholder API Routes** for authentication (returns 501 Not Implemented)

#### **Infrastructure**
- **Turborepo** monorepo setup
- **Biome** linting and formatting (extends ultracite config)
- **TypeScript** strict mode enabled
- **Bun** v1.2.19+ as package manager

### ❌ **What Does NOT Exist Yet**

- **Real Authentication** (Clerk integration planned but not implemented)
- **Database Connection** (schema exists but no actual database operations)
- **API Endpoints** (only health check and placeholder routes)
- **Business Logic** (no actual application features)
- **Full Test Suite Coverage** ✅ (137/180 tests passing, infrastructure complete)
- **Error Handling System** (basic error boundaries only)
- **Loading States** (minimal implementation)

## 🎯 **Project Purpose**

This scaffolding serves as a **development foundation** for:

1. **Learning and Experimentation** - Test the tech stack and patterns
2. **Rapid Prototyping** - Build new features on solid foundations
3. **Team Onboarding** - Standardized development environment
4. **Future Development** - Ready for implementing real business logic

## 🚀 **Quick Start**

### Prerequisites
- **Bun** v1.2.19+ ([Installation Guide](https://bun.sh/docs/installation))
- **MongoDB** (optional for now - schema exists but not connected)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd my-better-t-app
bun install
```

2. **Environment Setup:**
```bash
# Copy environment templates
cp apps/web/.env.example apps/web/.env
cp apps/server/.env.example apps/server/.env
```

3. **Start Development Servers:**
```bash
# Start all services
bun dev

# Or start individually
bun dev:web    # Frontend only (port 3001)
bun dev:server # Backend only (port 3000)
```

4. **Access the Application:**
- **Frontend**: [http://localhost:3001](http://localhost:3001)
- **API**: [http://localhost:3000](http://localhost:3000)

## 📁 **Project Structure**

```
my-better-t-app/
├── apps/
│   ├── web/                    # Frontend Next.js application
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router pages
│   │   │   │   ├── (LandingPages)/ # Marketing page
│   │   │   │   ├── (SignedIn)/     # Protected routes (mock auth)
│   │   │   │   └── layout.tsx      # Root layout
│   │   │   ├── components/    # React components
│   │   │   │   ├── ui/        # shadcn/ui components
│   │   │   │   ├── layout/    # Layout components
│   │   │   │   ├── navigation/# Navigation components
│   │   │   │   └── auth/      # Mock authentication
│   │   │   ├── contexts/      # React contexts (auth, theme)
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   └── lib/           # Utilities
│   │   └── ...
│   └── server/                 # Backend Hono API server
│       ├── src/
│       │   ├── app.ts         # Hono app configuration
│       │   ├── routes/        # API route handlers (placeholder)
│       │   └── index.ts       # Server entry point
│       └── prisma/            # Database schema (not connected)
├── .kiro/                     # Project documentation and AI assistance
│   ├── steering/              # Development guidelines
│   ├── specs/                 # Feature specifications
│   └── hooks/                 # AI workflow hooks
└── ...
```

## 🛠️ **Available Scripts**

### Development
```bash
bun dev              # Start all applications in development mode
bun dev:web          # Start only the frontend (port 3001)
bun dev:server       # Start only the backend (port 3000)
bun build            # Build all applications for production
bun check-types      # Type check across all applications
bun check            # Run Biome linting and formatting
```

### Testing
```bash
bun test            # Run test suite in watch mode (TDD-optimized)
bun test:run        # Run all tests once (CI/production)
bun test:ui         # Open Vitest UI for test debugging
bun test --coverage # Generate coverage reports
```

**📚 Comprehensive Testing Documentation:**
- **🚀 [Quick Start Guide](./docs/reference/testing-quick-start-guide.md)** - Write your first test in 15 minutes
- **🔴 [TDD Process Guide](./docs/reference/tdd-process-guide.md)** - Complete RED-GREEN-REFACTOR methodology  
- **📚 [Testing Pattern Library](./docs/reference/testing-patterns/)** - Copy-paste patterns for all testing scenarios

**Pattern Categories:**
- [Component Patterns](./docs/reference/testing-patterns/component/) - React component testing with TDD
- [Utility Patterns](./docs/reference/testing-patterns/utility/) - Pure function and business logic testing
- [Hook Patterns](./docs/reference/testing-patterns/hook/) - Custom React hook testing
- [API Patterns](./docs/reference/testing-patterns/api/) - API endpoint testing with MSW
- [Integration Patterns](./docs/reference/testing-patterns/integration/) - Multi-component system testing

### Database (Schema Only - Not Connected)
```bash
bun db:generate      # Generate Prisma client (when database is connected)
bun db:push          # Push schema changes (when database is connected)
bun db:studio        # Open Prisma Studio (when database is connected)
```

## 🔧 **Current Configuration**

### **Frontend Configuration**
- **Theme System**: Dark/light mode with system preference detection
- **Mock Authentication**: localStorage-based with context provider
- **Responsive Design**: Mobile-first TailwindCSS approach
- **Component Library**: shadcn/ui with "new-york" style
- **Testing Infrastructure**: Vitest + @testing-library/react with comprehensive component testing

### **Backend Configuration**
- **CORS**: Configured for frontend communication (localhost:3001)
- **Logging**: Basic request logging enabled
- **API Routes**: Mounted at `/api/v1` (currently placeholder routes)

### **Code Quality**
- **Biome**: Linting and formatting with ultracite configuration
- **TypeScript**: Strict mode enabled
- **No Semicolons**: Configured with "asNeeded" setting

## 📚 **Documentation**

### **Entry Point**
- **This README.md** - Current project status and setup
- **`.kiro/steering/README.md`** - Documentation organization guide

### **Story Documentation**
- **`docs/stories/story-7.5-fix-vitest-configuration.md`** - Test infrastructure implementation
- **`docs/handover/story-7.5-remaining-tasks.md`** - Remaining tasks for Scrum Master

### **Current State Documentation**
- **`.kiro/steering/current-state.md`** - What actually exists vs. what doesn't
- **`.kiro/steering/tech.md`** - Technology stack and commands
- **`.kiro/steering/structure.md`** - Project file organization

### **Future Implementation Guides**
- **`.kiro/steering/api-best-practices.md`** - API development patterns
- **`.kiro/steering/ui-best-practices.md`** - UI component patterns
- **`.kiro/steering/testing-best-practices.md`** - Testing strategy
- **`.kiro/steering/database-best-practices.md`** - Database patterns

### **Specifications**
- **`.kiro/specs/saas-ui-foundation/`** - UI foundation requirements
- **`.kiro/specs/clerk-integration/`** - Authentication integration plan
- **`.kiro/specs/testing-strategy/`** - Testing implementation plan

## 🎯 **Next Steps for Development**

### **Immediate Priorities**
1. **Story 8: MultiStepForm Implementation** ✅ - Testing infrastructure ready
2. **Connect Database** - Set up MongoDB connection and test Prisma
3. **Implement Real Authentication** - Replace mock auth with Clerk
4. **Build API Endpoints** - Create actual business logic routes
5. **Add Error Handling** - Implement comprehensive error boundaries
6. **Complete Test Suite** - Address remaining 24/180 test issues (optional)

### **Development Workflow**
1. **Check Current State** - Review `.kiro/steering/current-state.md`
2. **Follow Best Practices** - Use appropriate `.kiro/steering/*.md` guides
3. **Update Documentation** - Keep current-state.md accurate
4. **Test Incrementally** - Build and test features step by step

## 🤝 **Contributing**

1. **Understand Current State** - Read this README and current-state.md first
2. **Follow Guidelines** - Use the best-practices documents for implementation
3. **Update Documentation** - Keep current-state.md accurate as you build
4. **Code Quality** - Run `bun check` before committing

## 📞 **Support & Questions**

- **Current Implementation**: Check `.kiro/steering/current-state.md`
- **Development Guidelines**: See `.kiro/steering/development.md`
- **Technology Details**: Reference `.kiro/steering/tech.md`
- **Project Structure**: Review `.kiro/steering/structure.md`

---

**Remember**: This is a **scaffolding project** - it provides the foundation but doesn't implement business logic yet. Use the documentation in `.kiro/steering/` to understand what exists and what needs to be built.
