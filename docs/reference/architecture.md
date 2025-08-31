# Project Architecture & Technical Decisions

**📚 REFERENCE DOCUMENT - Consolidated architectural information**

_This document consolidates architectural decisions, current implementation status, and future plans into a single reference. It combines information from decision-log.md, current-state.md, and the greenfield architecture plans._

## 🏗️ **Current Architecture Overview**

### **Project Type**
- **Status**: Basic Tech Stack Scaffolding with Mock Authentication
- **Purpose**: Development foundation for building full-stack TypeScript applications
- **Maturity**: Minimal implementation with basic UI components

### **Architecture Pattern**
- **Monorepo Structure**: Turborepo-based with apps/web and apps/server
- **Frontend**: Next.js 15 with App Router and React 19
- **Backend**: Hono 4.8.10 with Prisma ORM
- **Database**: MongoDB with Prisma schema (not yet connected)

## 🎯 **Target Architecture (Greenfield Plans)**

### **VSME Guru Full-Stack Architecture**
- **Style**: Decoupled frontend/backend with Turborepo monorepo
- **Platform**: Netlify (serverless-first)
- **Frontend**: Next.js 14+ with App Router
- **Backend**: Hono API on Netlify Functions
- **Database**: MongoDB Atlas (dual-database approach)

### **Key Architectural Decisions**
- **Monorepo**: Turborepo for code sharing and type safety
- **Serverless**: Netlify Functions for backend scalability
- **Dual Database**: Scope321 for company data, VSME Guru for reporting
- **Type Safety**: Prisma-generated types across full stack

## 🏢 **Monorepo Structure**

### **Current Structure**
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

### **Target Structure (Netlify Deployment)**
```
my-better-t-app/
├── apps/
│   ├── web/                    # Next.js Frontend (Netlify)
│   │   ├── src/
│   │   │   ├── app/           # App Router with VSME modules
│   │   │   ├── components/    # VSME-specific components
│   │   │   ├── lib/           # VSME utilities and API client
│   │   │   └── types/         # Shared type definitions
│   │   └── ...
│   └── api/                    # Hono API (Netlify Functions)
│       ├── src/
│       │   ├── functions/     # Netlify function handlers
│       │   ├── lib/           # API utilities and services
│       │   ├── middleware/    # Authentication and validation
│       │   └── types/         # API type definitions
│       └── prisma/            # Dual database schema
├── packages/                   # Shared packages
│   ├── types/                 # Shared TypeScript types
│   ├── utils/                 # Shared utility functions
│   └── validation/            # Shared Zod schemas
└── ...
```

## 🌐 **Frontend Architecture**

### **Current Implementation**
- **Next.js 15.3.0** with App Router (basic setup)
- **React 19** functional components
- **Theme System** with dark/light mode toggle
- **Mock Authentication** with context and localStorage persistence
- **Basic Layout** with sidebar navigation structure

### **Target Implementation (VSME Guru)**
- **Next.js 14+** with App Router and VSME modules
- **VSME-Specific Components** for sustainability reporting
- **Clerk Authentication** integration
- **TanStack Query** for server state management
- **TanStack Form** for complex form handling
- **VSME Module System** (B1, B2, C1, etc.)

### **VSME Module Structure**
```
src/
├── app/
│   ├── (auth)/                # Authentication routes
│   ├── (dashboard)/           # Dashboard and reporting
│   │   ├── modules/           # VSME reporting modules
│   │   │   ├── b1/            # Business model and strategy
│   │   │   ├── b2/            # Policies and due diligence
│   │   │   ├── c1/            # Climate change
│   │   │   └── ...            # Additional modules
│   │   └── reports/           # Report management
│   └── (marketing)/           # Public marketing pages
├── components/
│   ├── vsme/                  # VSME-specific components
│   ├── forms/                 # Complex form components
│   └── reports/               # Report generation components
└── lib/
    ├── vsme/                  # VSME calculation utilities
    ├── api/                   # API client with Clerk auth
    └── validation/            # VSME data validation
```

## 🔧 **Backend Architecture**

### **Current Implementation**
- **Hono 4.8.10** web framework (basic setup)
- **Health Check Route**: GET / returns server status
- **Placeholder API Routes** for authentication (returns 501 Not Implemented)
- **Prisma 6.13.0** configured for MongoDB

### **Target Implementation (Netlify Functions)**
- **Hono API** running on Netlify Functions
- **Serverless-first** approach for scalability
- **JWT Authentication** via Clerk
- **Dual Database** integration (Scope321 + VSME Guru)
- **External API Integration** (brreg.no for company data)

### **API Architecture**
```typescript
// Target API structure
src/
├── functions/
│   ├── company.ts             # Company management endpoints
│   ├── reports.ts             # VSME reporting endpoints
│   ├── auth.ts                # Authentication middleware
│   └── index.ts               # Function aggregation
├── lib/
│   ├── prisma/                # Dual database clients
│   ├── clerk/                 # Clerk authentication
│   ├── brreg/                 # brreg.no API integration
│   └── validation/            # Request validation
└── types/
    ├── api.ts                 # API request/response types
    ├── vsme.ts                # VSME data types
    └── company.ts             # Company data types
```

## 🗄️ **Database Architecture**

### **Current Schema (Single Database)**
- **Single MongoDB** connection with ESG models
- **Basic Models**: User, Company, Report with ESG data types
- **Prisma Schema**: Defined but not connected

### **Target Schema (Dual Database)**
- **Scope321 Database**: Company and user profile data (existing)
- **VSME Guru Database**: VSME-specific reporting data (new)
- **Unified Company Directory Model** with clear separation

### **Dual Database Strategy**
```prisma
// Target schema.prisma structure
datasource scope321 {
  provider = "mongodb"
  url      = env("SCOPE321_DATABASE_URL")
}

datasource vsmeGuru {
  provider = "mongodb"
  url      = env("VSME_GURU_DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Scope321 Models (Company Profiles)
model Company {
  id                 String   @id @default(auto()) @map("_id") @db.ObjectId
  name               String
  organizationNumber String   @unique
  address            Address
  contactPerson      ContactPerson
  legalForm          String
  naceCodes         String[]
  balanceSheetSize   number
  turnover          number
  employeeCount     number
  primaryCountry    String
  siteLocations     GeoLocation[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("companies")
}

// VSME Guru Models (Reporting Data)
model VSMEReport {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  companyId    String   @db.ObjectId
  reportingYear Int
  module       String   // B1, B2, C1, etc.
  data         Json     // Module-specific data
  status       String   // draft, submitted, approved
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("vsme_reports")
}
```

### **Data Flow Architecture**
1. **Company Onboarding**: brreg.no API → Scope321 database
2. **VSME Reporting**: VSME Guru UI → VSME Guru database
3. **Data Linking**: Company ID references between databases
4. **Unified Access**: Single Prisma client managing both connections

## 🔐 **Authentication Architecture**

### **Current Implementation**
- **Mock System**: React context with localStorage persistence
- **Route Protection**: Next.js middleware for protected routes
- **User Context**: Authentication state management throughout the app

### **Target Implementation (Clerk)**
- **Clerk Integration**: Third-party authentication service
- **JWT Tokens**: Secure token-based authentication
- **Organization Support**: Multi-tenant authentication system
- **Role-based Access**: User permissions and access control

### **Authentication Flow**
```typescript
// Target authentication flow
1. User Login → Clerk authentication
2. JWT Token → VSME Guru API
3. Token Validation → Clerk verification
4. User Context → Company association
5. Authorization → Role-based access control
```

## 🎨 **UI/UX Architecture**

### **Current Design System**
- **Color Palette**: Blue primary, emerald/teal secondary
- **Typography**: Geist font family (sans and mono variants)
- **Component Library**: shadcn/ui with "new-york" style
- **Theme System**: Dark/light mode with system preference detection

### **Target VSME Design System**
- **VSME Branding**: EU sustainability compliance focus
- **Module-based UI**: Clear navigation between VSME modules
- **Form Complexity**: Multi-step forms for VSME data entry
- **Report Generation**: PDF generation and export capabilities
- **Dashboard Analytics**: Sustainability metrics visualization

### **VSME Component Architecture**
```typescript
// Target VSME component structure
components/
├── vsme/
│   ├── ModuleNavigator.tsx    # VSME module navigation
│   ├── DataEntryForm.tsx      # Multi-step data entry
│   ├── ReportGenerator.tsx    # PDF report generation
│   └── SustainabilityChart.tsx # Metrics visualization
├── forms/
│   ├── MultiStepForm.tsx      # Complex form handling
│   ├── FieldValidation.tsx    # Real-time validation
│   └── ProgressIndicator.tsx  # Form progress tracking
└── reports/
    ├── ReportViewer.tsx       # Report display
    ├── ExportOptions.tsx      # Export functionality
    └── ComplianceChecker.tsx  # VSME compliance validation
```

## 🚀 **Performance Architecture**

### **Current Performance**
- **Next.js Optimization**: App Router with automatic code splitting
- **Bundle Optimization**: Turborepo for build optimization
- **Basic Caching**: No advanced caching implemented

### **Target Performance (Netlify)**
- **Serverless Functions**: Automatic scaling and optimization
- **Edge Functions**: Global performance optimization
- **CDN Integration**: Netlify CDN for static assets
- **Database Optimization**: Strategic indexing and query optimization

## 🔒 **Security Architecture**

### **Current Security**
- **CORS Configuration**: Proper cross-origin setup
- **Type Safety**: TypeScript strict mode
- **Basic Validation**: No input validation implemented

### **Target Security**
- **JWT Authentication**: Clerk-based secure authentication
- **Input Validation**: Zod schema validation throughout
- **Rate Limiting**: API abuse prevention
- **Data Encryption**: Encrypted data transmission
- **Role-based Access**: Granular permission system

## 🧪 **Testing Architecture**

### **Current Testing**
- **No Testing Framework**: No tests implemented
- **No Test Infrastructure**: No testing setup

### **Target Testing**
- **Vitest**: Fast unit and integration testing
- **Testing Library**: React component testing
- **MSW**: API mocking for frontend tests
- **Playwright**: End-to-end testing
- **Test Coverage**: Comprehensive VSME module testing

## 📊 **Monitoring & Observability**

### **Current Monitoring**
- **Basic Logging**: Hono logger middleware
- **Health Checks**: Server health endpoint
- **Error Boundaries**: React error boundary components

### **Target Monitoring**
- **Netlify Analytics**: Built-in performance monitoring
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: VSME usage and compliance tracking
- **Performance Metrics**: Real-time sustainability metrics

## 🔄 **Deployment Architecture**

### **Current Deployment**
- **Local Development**: Bun runtime for development
- **No Production**: No deployment configuration

### **Target Deployment (Netlify)**
- **Unified Platform**: Frontend and backend on Netlify
- **Serverless Functions**: Hono API on Netlify Functions
- **Automatic Scaling**: Serverless-first approach
- **Global CDN**: Netlify edge network
- **CI/CD Integration**: Automated deployment pipeline

## 🎯 **Implementation Roadmap**

### **Phase 1: Foundation Alignment**
1. **Update Prisma Schema**: Implement dual database configuration
2. **Clerk Integration**: Replace mock authentication
3. **API Structure**: Implement VSME API endpoints
4. **Database Connection**: Connect to MongoDB Atlas

### **Phase 2: VSME Implementation**
1. **VSME Modules**: Implement B1, B2, C1 modules
2. **Form System**: Multi-step VSME data entry
3. **Report Generation**: PDF export functionality
4. **Dashboard**: Sustainability metrics visualization

### **Phase 3: Production Readiness**
1. **Netlify Migration**: Move to serverless architecture
2. **Testing Coverage**: Comprehensive testing implementation
3. **Performance Optimization**: Caching and optimization
4. **Security Hardening**: Production security measures

## 📚 **Architecture Documentation**

### **Greenfield Architecture Plans**
- **`docs/architecture-breakdown/`**: Complete VSME Guru architecture
- **API Contracts**: Detailed endpoint specifications
- **Data Models**: Dual database schema design
- **Deployment Strategy**: Netlify serverless approach

### **Current Implementation Status**
- **Basic Scaffolding**: Tech stack foundation ready
- **Mock Authentication**: Development authentication system
- **Basic UI Components**: Layout and navigation structure
- **Prisma Schema**: ESG models defined but not connected

---

**Note**: This document consolidates architectural information from multiple sources and aligns current implementation with greenfield architecture plans. When implementing new features, refer to the appropriate sections and ensure alignment with the overall VSME Guru architecture goals.
