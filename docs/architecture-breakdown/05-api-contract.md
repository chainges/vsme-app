# VSME Guru Architecture - API Contract

**Source:** Architecture Document Section 6  
**Version:** 1.0  
**Date:** August 19, 2025  
**Author:** Winston, Architect

## Overview

The Hono backend will expose a **RESTful API** that provides all necessary endpoints for the VSME Guru application. All endpoints are authenticated via a Clerk JWT sent in the `Authorization: Bearer <token>` header.

## Authentication & Security

### JWT Authentication
- **Provider:** Clerk authentication service
- **Header Format:** `Authorization: Bearer <token>`
- **Scope:** All API endpoints require valid JWT
- **Validation:** Automatic token validation on every request

### Security Features
- **Route Protection:** All endpoints protected by authentication middleware
- **Token Validation:** JWT signature and expiration validation
- **User Context:** User information extracted from JWT for authorization
- **Rate Limiting:** API rate limiting to prevent abuse

## API Endpoints

### Company Management Endpoints

#### GET /api/company
**Purpose:** Fetches the company profile from the Scope321 database

**Request:**
```http
GET /api/company
Authorization: Bearer <jwt_token>
```

**Response:**
```typescript
interface CompanyResponse {
  success: boolean;
  data?: Company;
  error?: string;
}

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

**Status Codes:**
- `200 OK`: Company profile retrieved successfully
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Company profile not found
- `500 Internal Server Error`: Server error

#### POST /api/company
**Purpose:** Creates a new company profile in the Scope321 database after `brreg.no` onboarding

**Request:**
```http
POST /api/company
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Company Name",
  "organizationNumber": "123456789",
  "address": {
    "city": "Oslo",
    "country": "Norway"
  },
  "website": "https://company.com",
  "contactPerson": {
    "name": "John Doe",
    "title": "CEO",
    "email": "john@company.com"
  },
  "legalForm": "AS",
  "naceCodes": ["62.01.0"],
  "balanceSheetSize": 1000000,
  "turnover": 5000000,
  "employeeCount": 50,
  "primaryCountry": "Norway",
  "siteLocations": [
    {
      "latitude": 59.9139,
      "longitude": 10.7522,
      "description": "Headquarters"
    }
  ]
}
```

**Response:**
```typescript
interface CreateCompanyResponse {
  success: boolean;
  data?: Company;
  error?: string;
}
```

**Status Codes:**
- `201 Created`: Company profile created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing JWT token
- `409 Conflict`: Company already exists
- `500 Internal Server Error`: Server error

### Report Management Endpoints

#### GET /api/reports
**Purpose:** Fetches a summary list of all reports for the company

**Request:**
```http
GET /api/reports
Authorization: Bearer <jwt_token>
```

**Response:**
```typescript
interface ReportsListResponse {
  success: boolean;
  data?: ReportSummary[];
  error?: string;
}

interface ReportSummary {
  id: string;
  year: number;
  status: 'draft' | 'in-progress' | 'completed';
  progress: number; // 0-100
  lastModified: Date;
  modules: {
    general: boolean;
    environment: boolean;
    social: boolean;
    governance: boolean;
  };
}
```

**Status Codes:**
- `200 OK`: Reports list retrieved successfully
- `401 Unauthorized`: Invalid or missing JWT token
- `500 Internal Server Error`: Server error

#### GET /api/reports/{year}
**Purpose:** Fetches all data for a specific report year from the VSME Guru database

**Request:**
```http
GET /api/reports/2024
Authorization: Bearer <jwt_token>
```

**Response:**
```typescript
interface ReportDataResponse {
  success: boolean;
  data?: Report;
  error?: string;
}

interface Report {
  id: string;
  companyId: string;
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

**Status Codes:**
- `200 OK`: Report data retrieved successfully
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Report not found for specified year
- `500 Internal Server Error`: Server error

#### PUT /api/reports/{year}/{section}
**Purpose:** Saves/updates data for a specific section of a report in the VSME Guru database

**Request:**
```http
PUT /api/reports/2024/general
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reportingOption": "comprehensive",
  "companyInfo": {
    // ... company info data
  },
  "strategy": {
    // ... strategy data
  }
}
```

**Response:**
```typescript
interface UpdateReportResponse {
  success: boolean;
  data?: {
    updatedAt: Date;
    version: number;
  };
  error?: string;
}
```

**Status Codes:**
- `200 OK`: Report section updated successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Report or section not found
- `500 Internal Server Error`: Server error

### PDF Generation Endpoints

#### POST /api/reports/{year}/generate
**Purpose:** Triggers the asynchronous PDF generation process

**Request:**
```http
POST /api/reports/2024/generate
Authorization: Bearer <jwt_token>
```

**Response:**
```typescript
interface GeneratePDFResponse {
  success: boolean;
  data?: {
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    estimatedCompletionTime?: Date;
  };
  error?: string;
}
```

**Status Codes:**
- `202 Accepted`: PDF generation job queued successfully
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Report not found for specified year
- `409 Conflict`: PDF generation already in progress
- `500 Internal Server Error`: Server error

#### GET /api/jobs/{jobId}
**Purpose:** Checks the status of a PDF generation job

**Request:**
```http
GET /api/jobs/abc123
Authorization: Bearer <jwt_token>
```

**Response:**
```typescript
interface JobStatusResponse {
  success: boolean;
  data?: {
    jobId: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress?: number; // 0-100
    estimatedCompletionTime?: Date;
    completedAt?: Date;
    downloadUrl?: string;
    error?: string;
  };
  error?: string;
}
```

**Status Codes:**
- `200 OK`: Job status retrieved successfully
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Job not found
- `500 Internal Server Error`: Server error

#### GET /api/reports/{year}/download
**Purpose:** Downloads the generated PDF report

**Request:**
```http
GET /api/reports/2024/download
Authorization: Bearer <jwt_token>
```

**Response:**
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="vsme-report-2024.pdf"`
- **Body:** PDF file content

**Status Codes:**
- `200 OK`: PDF file returned successfully
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Report or PDF not found
- `500 Internal Server Error`: Server error

## Request/Response Patterns

### Standard Response Format
All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}
```

### Error Handling
- **Validation Errors:** 400 Bad Request with detailed error messages
- **Authentication Errors:** 401 Unauthorized
- **Authorization Errors:** 403 Forbidden
- **Not Found Errors:** 404 Not Found
- **Server Errors:** 500 Internal Server Error

### Pagination (Future)
For endpoints that return lists, pagination will be implemented:

```typescript
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Data Validation

### Request Validation
- **Zod Schemas:** All request data validated using Zod
- **Type Safety:** TypeScript interfaces for all request/response types
- **Error Messages:** Clear, user-friendly error messages
- **Partial Updates:** Support for partial data updates

### Response Validation
- **Data Integrity:** Ensure response data matches expected schema
- **Type Consistency:** Maintain consistent data types across responses
- **Error Handling:** Proper error responses for all failure scenarios

## API Versioning

### Version Strategy
- **URL Versioning:** `/api/v1/company` for future versioning
- **Backward Compatibility:** Maintain compatibility within major versions
- **Deprecation Policy:** Clear deprecation timeline for breaking changes
- **Migration Guide:** Documentation for version migrations

## Rate Limiting

### Rate Limit Configuration
- **Requests per Minute:** Configurable rate limits per endpoint
- **User-based Limits:** Different limits for different user types
- **IP-based Limits:** Fallback rate limiting for unauthenticated requests
- **Graceful Degradation:** Informative error messages when limits exceeded

## Monitoring & Analytics

### API Metrics
- **Response Times:** Track endpoint performance
- **Error Rates:** Monitor error frequencies
- **Usage Patterns:** Analyze API usage trends
- **User Behavior:** Understand how users interact with the API

### Health Checks
- **Endpoint Health:** `/api/health` for system status
- **Database Health:** Database connectivity monitoring
- **External Services:** Monitor external service dependencies
- **Performance Metrics:** Track API performance over time

## Documentation

### API Documentation
- **OpenAPI/Swagger:** Auto-generated API documentation
- **Interactive Testing:** Swagger UI for API testing
- **Code Examples:** Request/response examples in multiple languages
- **Error Reference:** Comprehensive error code documentation

### Developer Experience
- **Clear Examples:** Well-documented request/response examples
- **Error Handling:** Detailed error message documentation
- **Best Practices:** Guidelines for API usage
- **SDK Support:** Client libraries for common languages

## Testing Strategy

### API Testing
- **Unit Tests:** Test individual endpoint logic
- **Integration Tests:** Test API with database integration
- **End-to-End Tests:** Test complete API workflows
- **Performance Tests:** Load testing for API endpoints

### Test Data
- **Mock Data:** Consistent test data for development
- **Test Database:** Separate test database environment
- **Data Seeding:** Automated test data setup
- **Cleanup:** Automatic test data cleanup

## Next Steps

### Immediate Actions
1. **Endpoint Implementation:** Implement all defined API endpoints
2. **Authentication Middleware:** Set up JWT validation middleware
3. **Validation Schemas:** Create Zod validation schemas
4. **Error Handling:** Implement comprehensive error handling

### Development Preparation
1. **API Testing:** Set up API testing framework
2. **Documentation:** Generate API documentation
3. **Client Integration:** Test frontend-backend integration
4. **Performance Testing:** Establish performance benchmarks

### Long-term Planning
1. **API Versioning:** Plan for future API versions
2. **Monitoring Setup:** Implement API monitoring and analytics
3. **Rate Limiting:** Configure appropriate rate limiting
4. **Security Hardening:** Additional security measures 