# Database Setup and Management

This document describes the database architecture, setup procedures, and management commands for the ESG reporting application.

## Overview

The application uses a dual-database architecture:
- **Primary Database**: MongoDB Atlas for application data (Users, Companies, Reports)
- **External Database**: MongoDB Atlas for shared data from other applications in the same Clerk domain

### External Database Integration
The external database provides read-only access to shared resources and reference data from other applications. This enables:
- Cross-application data sharing within the same organization
- Reference data lookups (industry standards, benchmarks)
- Shared resource discovery and utilization

## Database Models

### User Model
Represents authenticated users linked to Clerk authentication:
- `clerkId`: Unique identifier from Clerk authentication system
- `organizationId`: Multi-tenant isolation for data access
- Used by: Authentication middleware, data access control

### Company Model
Represents companies that submit ESG reports:
- Basic company information (name, registration number, industry)
- Financial data (revenue, NACE code, CO2 intensity)
- Used by: ESG reporting forms, company management UI

### Report Model
Represents ESG reports with nested data structures:
- **Environmental**: Energy consumption, emissions (Scope 1/2/3), renewable energy
- **Social**: Employee counts, diversity metrics
- **Governance**: Ethics, compliance, fines and penalties
- Used by: ESG data collection forms, reporting dashboards, analytics

## Environment Configuration

### Required Environment Variables

```bash
# Primary database (application data)
PRIMARY_DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/database

# External database (shared data)
SCOPE321_DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/shared_db

# External database name (environment-specific)
EXTERNAL_DATABASE_NAME=co2-intensities-dev

# Clerk authentication
CLERK_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key

# API configuration
CORS_ORIGIN=http://localhost:3001
```

### Environment-Specific Configuration

The application supports multiple deployment environments with automatic database name resolution:

**Development Environment:**
- External Database: `co2-intensities-dev`
- Features: Debug logging, query logging, detailed errors

**Test Environment:**
- External Database: `co2-intensities-test`
- Features: Query logging, detailed errors, minimal connection pools

**Staging Environment:**
- External Database: `co2-intensities-staging`
- Features: Performance monitoring, production-like settings

**Production Environment:**
- External Database: `co2-intensities`
- Features: Performance monitoring, error tracking, optimized connection pools

The system automatically selects the appropriate database name based on `NODE_ENV`, with the option to override using `EXTERNAL_DATABASE_NAME`.

### Database User Permissions

**Primary Database User:**
- Role: `readWrite` on application database
- Purpose: Full CRUD operations for application data
- Used by: All API endpoints, data services

**External Database User:**
- Role: `read` on shared database
- Purpose: Read-only access to shared reference data
- Used by: External data fetching, reference lookups
- Configuration: Optimized connection pooling with shorter timeouts
- Features: Automatic retry logic, connection health monitoring, graceful degradation

## Database Management Commands

### Development Commands

```bash
# Generate Prisma client after schema changes
bun db:generate

# Push schema changes to database (development)
bun db:push

# Open Prisma Studio for data browsing
bun db:studio

# Seed development data
bun run db:seed:dev

# Reset database with fresh data
bun run db:reset

# Check database status and health
bun run db:status

# Test external database service
bun run db:test-external

# Environment setup and validation
bun run env:setup
bun run env:setup production  # Show setup for specific environment

# Type alignment validation
bun run validate:types       # Validate TypeScript types ↔ Zod schemas alignment
```

### Production Commands

```bash
# Run database migrations
bun run db:migrate

# Seed production data (with safety checks)
bun run db:seed:prod

# Validate production database
bun run db:status
```

## Seeding System

### Development Seeding
**Purpose**: Creates realistic test data for UI development and testing
**Used by**: Local development, testing environments
**Contains**:
- 3 users across different organizations
- 5 companies with varied profiles (tech, manufacturing, services)
- 10 ESG reports with different completion levels

**Script**: `bun run db:seed:dev`

### Production Seeding
**Purpose**: Creates minimal required data for production operation
**Used by**: Production deployment, system initialization
**Contains**:
- System constraints validation
- Reference data setup (currently minimal)

**Script**: `bun run db:seed:prod`

## Migration System

### Migration Tracking
- Migrations are tracked in a `migrations` collection
- Each migration records: name, applied date, checksum
- Used by: Deployment scripts to ensure schema consistency

### Migration Files
Located in `src/lib/migrations/`
- `migration-runner.ts`: Core migration execution logic
- Used by: Deployment automation, database updates

## Service Layer Architecture

### Company Service (`src/lib/services/company-service.ts`)
**Purpose**: Handles all company-related database operations
**Used by**: Company API endpoints, business logic
**Methods**:
- `createCompany()`: Create new company with validation
- `getCompaniesByOrganization()`: Multi-tenant company listing
- `updateCompany()`: Update company with access control
- `deleteCompany()`: Safe company deletion

### Report Service (`src/lib/services/report-service.ts`)
**Purpose**: Handles ESG report database operations
**Used by**: Report API endpoints, ESG data processing
**Methods**:
- `createReport()`: Create ESG report with nested data
- `updateESGSection()`: Update specific ESG sections
- `getReportsByCompany()`: Company-specific report history
- `getReportsByYear()`: Year-based report aggregation

### External Data Service (`src/lib/services/external-data-service.ts`)
**Purpose**: Handles all external database operations with validation and caching
**Used by**: External data API endpoints, reference data lookups, cross-application data sharing
**Methods**:
- `getSharedResources()`: Fetch shared resources with pagination and filtering
- `getSharedResourceById()`: Retrieve specific external resource by ID
- `searchSharedResources()`: Text-based search across external resources
- `getExternalDataStats()`: Statistics and health information for external data
- `getAggregatedData()`: Complex aggregation queries on external data

## Data Validation

### Zod Schemas (`src/lib/validation/esg-schemas.ts`)
**Purpose**: Runtime validation of ESG data structures
**Used by**: API endpoints, data processing, form validation
**Schemas**:
- `companySchema`: Company data validation
- `reportSchema`: Complete ESG report validation
- `environmentalSchema`: Environmental data validation
- `socialSchema`: Social data validation
- `governanceSchema`: Governance data validation

## Type Safety and Validation

### Type Alignment System

The application maintains type safety across three layers:

1. **Prisma Models** (Database Layer): Auto-generated from schema
2. **TypeScript Interfaces** (Business Layer): Manual definitions in `src/types/`
3. **Zod Schemas** (API Layer): Manual validation schemas in `src/lib/validation/`

### Automatic Validation

**Kiro Hooks** automatically validate type alignment when:
- Prisma schema files are modified
- TypeScript type definitions change
- Zod validation schemas are updated
- After `db:generate`, `db:push`, or `db:migrate` operations

**Manual Validation:**
```bash
bun run validate:types  # Run comprehensive type alignment check
```

**Validation Checks:**
- CompanyData interface ↔ companySchema alignment
- ReportData interface ↔ reportSchema alignment
- ESG nested types ↔ their Zod schemas
- Prisma client generation and accessibility

### Maintaining Type Alignment

When making schema changes:
1. Update Prisma schema first
2. Run `bun db:generate` and `bun db:push`
3. Update TypeScript interfaces in `src/types/`
4. Update Zod schemas in `src/lib/validation/`
5. Run `bun run validate:types` to verify alignment

## Performance Optimization

### Database Indexes
**Purpose**: Optimize common query patterns
**Indexes**:
- `users_clerkId_key`: Unique index for authentication lookups
- `companies_organizationId_year_idx`: Multi-tenant company queries
- `companies_registrationNumber_idx`: Company lookup by registration
- `reports_organizationId_year_idx`: Multi-tenant report queries
- `reports_companyId_year_idx`: Company report history

### Query Patterns
- Organization-based filtering for multi-tenancy
- Year-based aggregation for reporting periods
- Company-report relationships for data integrity

## Troubleshooting

### Common Issues

**Connection Errors**:
- Verify environment variables are set correctly
- Check MongoDB Atlas IP whitelist
- Validate database user permissions

**Migration Issues**:
- Run `bun run db:status` to check migration state
- Use `bun db:push` for development schema updates
- Check migration logs for specific errors

**Seeding Problems**:
- Clean existing data with `bun run db:reset`
- Verify Clerk IDs don't conflict with existing data
- Check organization ID consistency

### Health Checks

Use `bun run db:status` to get comprehensive database health information:
- Connection status for both databases
- Migration state and pending changes
- Data summary and organization breakdown
- Performance validation

## Security Considerations

### Data Access Control
- All queries filtered by `organizationId` for multi-tenancy
- User authentication required for all operations
- Audit trail maintained with `createdBy` fields

### Environment Security
- Database credentials stored in environment variables
- Separate read/write permissions for different databases
- IP restrictions on database access

### Data Privacy
- ESG data isolated by organization
- User data linked to Clerk for authentication
- No sensitive data stored in plain text

## Backup and Recovery

### Development
- Use `bun run db:reset` to restore clean development state
- Seeding scripts provide consistent test data

### Production
- MongoDB Atlas automated backups
- Point-in-time recovery available
- Migration system allows rollback capabilities

## Monitoring

### Database Health
- Connection testing in `database-test.ts`
- Performance validation in status scripts
- Migration tracking for deployment validation

### Data Quality
- Zod validation ensures data integrity
- Service layer provides consistent access patterns
- Audit trails track data changes