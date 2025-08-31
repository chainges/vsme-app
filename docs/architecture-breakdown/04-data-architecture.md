# VSME Guru Architecture - Data Architecture

**Source:** Architecture Document Section 5  
**Version:** 1.0  
**Date:** August 19, 2025  
**Author:** Winston, Architect

## Overview

The project will use a **Unified Company Directory Model** that leverages existing infrastructure while maintaining clear separation of concerns. This approach provides data consistency, leverages team expertise, and ensures scalability for future growth.

## Dual Database Strategy

### Database Separation Principle
The system uses **two separate MongoDB Atlas databases** with distinct responsibilities:

1. **Scope321 MongoDB Atlas:** Company and user profile data (existing)
2. **VSME Guru MongoDB Atlas:** VSME-specific reporting data (new)

### Benefits of Dual Database Approach
- **Leverage Existing Infrastructure:** Reuse established Scope321 database
- **Clear Separation of Concerns:** Reporting data separate from company profiles
- **Scalability:** Each database can scale independently
- **Security:** Isolated access controls for different data types
- **Maintenance:** Independent backup and maintenance schedules

## Scope321 Database (Existing)

### Purpose
This database serves as the **single source of truth for all `company` and `user` profile data**.

### Data Types
- **Company Profiles:** Organization information, contact details, business metrics
- **User Accounts:** User authentication data, permissions, preferences
- **Company Relationships:** User-company associations and roles
- **Metadata:** Audit trails, creation dates, update history

### Access Pattern
- **VSME Guru API:** Creates and fetches company profiles
- **Read Operations:** Frequent reads for company information
- **Write Operations:** Occasional updates during onboarding and profile changes
- **Data Ownership:** Scope321 application maintains primary control

### Integration Points
- **Onboarding Flow:** New company creation during user registration
- **Profile Updates:** Company information modifications
- **User Authentication:** Company association for authenticated users
- **Data Validation:** Company data verification and enrichment

## VSME Guru Database (New)

### Purpose
This database is dedicated solely to storing **VSME-specific reporting data**.

### Data Types
- **Report Data:** All sustainability reporting information
- **Module Data:** Environment, social, and governance metrics
- **Calculation Results:** Computed values and derived metrics
- **Report Metadata:** Generation dates, status, versions

### Data Structure
Each document in the VSME Guru database will be linked to:
- **Company ID:** Reference to company in Scope321 database
- **Reporting Year:** Annual reporting period
- **Module Type:** Specific sustainability module (B1, B2, C1, etc.)
- **Data Version:** Version control for data changes

### Access Pattern
- **VSME Guru API:** Primary read/write operations
- **Data Entry:** Frequent writes during form completion
- **Report Generation:** Read operations for PDF generation
- **Data Analysis:** Read operations for dashboard and analytics

## Prisma ORM Integration

### Single Schema Approach
Prisma will be used as the ORM to manage **both database connections** from a single configuration.

### Schema Definition
- **`schema.prisma`:** Single source of truth for all database models
- **Multi-Database:** Configuration for both Scope321 and VSME Guru databases
- **Type Generation:** Auto-generated Prisma Client for type-safe operations

### Database Connections
```prisma
// Example schema.prisma structure
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

// Scope321 Models
model Company {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  // ... other company fields
}

// VSME Guru Models
model Report {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  companyId String   @db.ObjectId
  year      Int
  // ... other report fields
}
```

## Data Relationships

### Company-Report Relationship
- **One-to-Many:** One company can have multiple reports (by year)
- **Referential Integrity:** Company ID in VSME Guru database references Scope321
- **Cascade Operations:** Company deletion affects associated reports

### Data Consistency
- **Foreign Key Validation:** Ensure company exists before creating reports
- **Data Synchronization:** Keep company data in sync between databases
- **Audit Trails:** Track all data changes and modifications

## Data Models

### Company Profile Model (Scope321)
```typescript
interface Company {
  id: string;
  name: string;
  organizationNumber: string;
  address: {
    city: string;
    country: string;
  };
  website?: string;
  contactPerson: {
    name: string;
    title: string;
    email: string;
  };
  legalForm: string;
  naceCodes: string[];
  balanceSheetSize: number;
  turnover: number;
  employeeCount: number;
  primaryCountry: string;
  siteLocations: GeoLocation[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Report Data Model (VSME Guru)
```typescript
interface Report {
  id: string;
  companyId: string; // References Scope321 company
  year: number;
  status: 'draft' | 'in-progress' | 'completed';
  modules: {
    general: GeneralModuleData;
    environment: EnvironmentModuleData;
    social: SocialModuleData;
    governance: GovernanceModuleData;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastModifiedBy: string;
    version: number;
  };
}
```

### Module Data Models
```typescript
interface GeneralModuleData {
  reportingOption: 'basic' | 'comprehensive';
  companyInfo: CompanyInfoData;
  strategy: StrategyData;
  omissions?: OmissionData[];
}

interface EnvironmentModuleData {
  energyConsumption: EnergyData;
  ghgEmissions: GHGData;
  pollutants: PollutantData;
  biodiversity: BiodiversityData;
  water: WaterData;
  circularEconomy: CircularEconomyData;
  waste: WasteData;
  materialCircularity: MaterialCircularityData;
}
```

## Data Validation

### Zod Schema Integration
- **Frontend Validation:** Form data validation before submission
- **Backend Validation:** API request validation
- **Database Validation:** Prisma schema validation
- **Type Safety:** End-to-end validation from form to database

### Validation Rules
- **Required Fields:** Mandatory data for each module
- **Data Types:** Proper type validation for all fields
- **Business Rules:** Domain-specific validation logic
- **Cross-Field Validation:** Relationships between different fields

## Data Migration and Seeding

### Initial Setup
- **Database Creation:** Set up VSME Guru database
- **Schema Migration:** Apply Prisma schema to both databases
- **Initial Data:** Seed with sample data for development

### Data Migration Strategy
- **Incremental Migration:** Migrate data in phases
- **Data Validation:** Ensure data integrity during migration
- **Rollback Plan:** Ability to revert changes if needed
- **Testing:** Validate migration in staging environment

## Data Security

### Access Control
- **Authentication:** Clerk JWT-based authentication
- **Authorization:** Role-based access control
- **Data Isolation:** Company data isolation for multi-tenancy
- **Audit Logging:** Track all data access and modifications

### Data Protection
- **Encryption:** Data encrypted at rest and in transit
- **Backup Strategy:** Regular automated backups
- **Data Retention:** Appropriate data retention policies
- **GDPR Compliance:** User consent and data rights management

## Performance Considerations

### Database Optimization
- **Indexing Strategy:** Optimize queries with proper indexes
- **Query Optimization:** Efficient database queries
- **Connection Pooling:** Manage database connections efficiently
- **Caching Strategy:** Implement appropriate caching layers

### Scalability
- **Horizontal Scaling:** MongoDB Atlas automatic scaling
- **Read Replicas:** Use read replicas for reporting queries
- **Data Partitioning:** Partition data by company or year if needed
- **Performance Monitoring:** Track and optimize slow queries

## Data Backup and Recovery

### Backup Strategy
- **Automated Backups:** Daily automated backups
- **Point-in-Time Recovery:** Ability to restore to specific points
- **Cross-Region Backup:** Geographic redundancy
- **Backup Testing:** Regular backup restoration testing

### Disaster Recovery
- **Recovery Time Objective (RTO):** Maximum acceptable downtime
- **Recovery Point Objective (RPO):** Maximum acceptable data loss
- **Recovery Procedures:** Documented recovery processes
- **Regular Testing:** Periodic disaster recovery testing

## Monitoring and Observability

### Data Health Monitoring
- **Connection Status:** Monitor database connectivity
- **Query Performance:** Track slow queries and performance
- **Data Integrity:** Monitor for data corruption or inconsistencies
- **Storage Usage:** Track database storage and growth

### Alerting
- **Performance Alerts:** Notify on performance degradation
- **Error Alerts:** Alert on database errors or failures
- **Capacity Alerts:** Warn when approaching storage limits
- **Security Alerts:** Alert on suspicious access patterns

## Next Steps

### Immediate Actions
1. **Database Setup:** Create VSME Guru MongoDB Atlas database
2. **Prisma Configuration:** Set up dual-database Prisma configuration
3. **Schema Design:** Design detailed database schema
4. **Connection Setup:** Configure database connections

### Development Preparation
1. **Data Models:** Create TypeScript interfaces for all data models
2. **Validation Schemas:** Implement Zod validation schemas
3. **Migration Scripts:** Prepare database migration scripts
4. **Testing Data:** Create test data for development

### Long-term Planning
1. **Performance Optimization:** Plan for database performance tuning
2. **Scaling Strategy:** Plan for future growth and scaling
3. **Backup Strategy:** Implement comprehensive backup and recovery
4. **Monitoring Setup:** Establish monitoring and alerting systems 