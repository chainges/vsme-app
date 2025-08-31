# Database Implementation Specification

*Planned dual-database architecture for VSME Guru application*

## 📋 **Status: PLANNED - NOT YET IMPLEMENTED**

**⚠️ Important**: This document describes the **planned** database architecture. The database connection and models are **configured but not yet connected**.

## 🎯 **Planned Architecture**

### **Dual-Database Strategy**
- **Primary Database**: MongoDB Atlas for application data (Users, Companies, Reports)
- **External Database**: MongoDB Atlas for shared data from other applications in the same Clerk domain

### **External Database Integration Benefits**
The external database will provide read-only access to shared resources and reference data from other applications, enabling:
- Cross-application data sharing within the same organization
- Reference data lookups (industry standards, benchmarks)
- Shared resource discovery and utilization

## 🗄️ **Planned Database Models**

### **User Model**
Will represent authenticated users linked to Clerk authentication:
- `clerkId`: Unique identifier from Clerk authentication system
- `organizationId`: Multi-tenant isolation for data access
- **Usage**: Authentication middleware, data access control

### **Company Model**
Will represent companies that submit ESG reports:
- Basic company information (name, registration number, industry)
- Financial data (revenue, NACE code, CO2 intensity)
- **Usage**: ESG reporting forms, company management UI

### **Report Model**
Will represent ESG reports with nested data structures:
- **Environmental**: Energy consumption, emissions (Scope 1/2/3), renewable energy
- **Social**: Employee counts, diversity metrics
- **Governance**: Ethics, compliance, fines and penalties
- **Usage**: ESG data collection forms, reporting dashboards, analytics

## ⚙️ **Environment Configuration (Ready)**

### **Required Environment Variables**
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

### **Environment-Specific Configuration**
The system will support multiple deployment environments with automatic database name resolution:

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

## 🔧 **Current Implementation Status**

### **✅ What's Ready**
- Environment variable configuration
- Database connection scripts
- Prisma schema configuration
- Environment validation

### **❌ What's Missing**
- Actual database connections
- Database models implementation
- Data access layer
- Connection pooling
- Error handling for database operations

## 🚀 **Implementation Roadmap**

### **Phase 1: Database Connection**
1. **Set up MongoDB Atlas clusters**
2. **Implement database connection logic**
3. **Test connection health checks**
4. **Add connection error handling**

### **Phase 2: Model Implementation**
1. **Implement User model with Clerk integration**
2. **Create Company model with ESG fields**
3. **Build Report model with nested structures**
4. **Add data validation with Zod**

### **Phase 3: Data Access Layer**
1. **Create repository pattern for data access**
2. **Implement CRUD operations**
3. **Add transaction support**
4. **Implement data migration scripts**

### **Phase 4: External Database Integration**
1. **Connect to external database**
2. **Implement read-only data access**
3. **Add data synchronization logic**
4. **Create reference data services**

## 📚 **Related Documentation**

- **Current State**: `.kiro/steering/current-state.md`
- **Architecture**: `.kiro/reference/architecture.md`
- **API Contract**: `.kiro/reference/api-contract.md`
- **Development Workflow**: `.kiro/reference/development-workflow.md`

## 🎯 **Next Steps**

1. **Review current Prisma schema** in `apps/server/prisma/schema/schema.prisma`
2. **Set up MongoDB Atlas clusters** for both databases
3. **Implement database connection logic** in `apps/server/src/lib/`
4. **Test connection health** using existing scripts
5. **Begin model implementation** following the planned structure

## ⚠️ **Important Notes**

- **This is a specification document** - not implementation documentation
- **Database models are planned** but not yet built
- **Environment variables are configured** but connections are not active
- **Follow the implementation roadmap** to build this incrementally
