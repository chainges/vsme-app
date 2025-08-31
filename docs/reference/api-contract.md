# API Contract Reference

**📚 REFERENCE DOCUMENT - VSME Guru API specifications**

_This document consolidates API contract information from the greenfield architecture plans and provides a reference for implementing the VSME Guru backend API._

## 🎯 **API Overview**

### **Architecture**
- **Framework**: Hono API running on Netlify Functions
- **Authentication**: Clerk JWT-based authentication
- **Style**: RESTful API with TypeScript end-to-end type safety
- **Validation**: Zod schema validation for all requests/responses

### **Base Configuration**
- **Base URL**: `/api` (when deployed on Netlify)
- **Authentication**: `Authorization: Bearer <jwt_token>` header required
- **Content Type**: `application/json` for all requests
- **Response Format**: Consistent JSON response structure

## 🔐 **Authentication & Security**

### **JWT Authentication**
- **Provider**: Clerk authentication service
- **Header Format**: `Authorization: Bearer <token>`
- **Scope**: All API endpoints require valid JWT
- **Validation**: Automatic token validation on every request

### **Security Features**
- **Route Protection**: All endpoints protected by authentication middleware
- **Token Validation**: JWT signature and expiration validation
- **User Context**: User information extracted from JWT for authorization
- **Rate Limiting**: API rate limiting to prevent abuse

### **Authentication Middleware**
```typescript
// Example authentication middleware
import { clerkClient } from '@clerk/backend';

const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  try {
    const session = await clerkClient.sessions.verifySession(token);
    c.set('user', session);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};
```

## 🏢 **Company Management Endpoints**

### **GET /api/company**
**Purpose**: Fetches the company profile from the Scope321 database

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

### **POST /api/company**
**Purpose**: Creates a new company profile in the Scope321 database after `brreg.no` onboarding

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
  "employeeCount": 25,
  "primaryCountry": "Norway",
  "siteLocations": [
    {
      "city": "Oslo",
      "country": "Norway",
      "coordinates": {
        "latitude": 59.9139,
        "longitude": 10.7522
      }
    }
  ]
}
```

**Response:**
```typescript
interface CompanyCreateResponse {
  success: boolean;
  data?: Company;
  error?: string;
}
```

**Status Codes:**
- `201 Created`: Company profile created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing JWT token
- `409 Conflict`: Company with organization number already exists
- `500 Internal Server Error`: Server error

### **PUT /api/company**
**Purpose**: Updates an existing company profile

**Request:**
```http
PUT /api/company
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Company Name",
  "website": "https://updated-company.com",
  "contactPerson": {
    "name": "Jane Doe",
    "title": "CTO",
    "email": "jane@company.com"
  }
}
```

**Response:**
```typescript
interface CompanyUpdateResponse {
  success: boolean;
  data?: Company;
  error?: string;
}
```

**Status Codes:**
- `200 OK`: Company profile updated successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Company profile not found
- `500 Internal Server Error`: Server error

## 📊 **VSME Reporting Endpoints**

### **GET /api/reports**
**Purpose**: Fetches VSME reports for the authenticated user's company

**Request:**
```http
GET /api/reports?year=2024&module=b1&status=draft
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `year` (optional): Reporting year filter
- `module` (optional): VSME module filter (b1, b2, c1, etc.)
- `status` (optional): Report status filter (draft, submitted, approved)

**Response:**
```typescript
interface ReportsResponse {
  success: boolean;
  data?: VSMEReport[];
  error?: string;
}

interface VSMEReport {
  id: string;
  companyId: string;
  reportingYear: number;
  module: string;
  data: Record<string, any>;
  status: 'draft' | 'submitted' | 'approved';
  createdAt: Date;
  updatedAt: Date;
}
```

**Status Codes:**
- `200 OK`: Reports retrieved successfully
- `401 Unauthorized`: Invalid or missing JWT token
- `500 Internal Server Error`: Server error

### **POST /api/reports**
**Purpose**: Creates a new VSME report

**Request:**
```http
POST /api/reports
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reportingYear": 2024,
  "module": "b1",
  "data": {
    "businessModel": "Manufacturing",
    "strategy": "Sustainability-focused growth",
    "stakeholders": ["employees", "customers", "suppliers"]
  }
}
```

**Response:**
```typescript
interface ReportCreateResponse {
  success: boolean;
  data?: VSMEReport;
  error?: string;
}
```

**Status Codes:**
- `201 Created`: Report created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing JWT token
- `409 Conflict`: Report for year/module combination already exists
- `500 Internal Server Error`: Server error

### **PUT /api/reports/:id**
**Purpose**: Updates an existing VSME report

**Request:**
```http
PUT /api/reports/64f8a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "data": {
    "businessModel": "Updated Manufacturing",
    "strategy": "Updated sustainability strategy",
    "stakeholders": ["employees", "customers", "suppliers", "investors"]
  },
  "status": "submitted"
}
```

**Response:**
```typescript
interface ReportUpdateResponse {
  success: boolean;
  data?: VSMEReport;
  error?: string;
}
```

**Status Codes:**
- `200 OK`: Report updated successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Report not found
- `500 Internal Server Error`: Server error

### **DELETE /api/reports/:id**
**Purpose**: Deletes a VSME report (only draft reports can be deleted)

**Request:**
```http
DELETE /api/reports/64f8a1b2c3d4e5f6a7b8c9d0
Authorization: Bearer <jwt_token>
```

**Response:**
```typescript
interface ReportDeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

**Status Codes:**
- `200 OK`: Report deleted successfully
- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden`: Cannot delete non-draft report
- `404 Not Found`: Report not found
- `500 Internal Server Error`: Server error

## 🔍 **Company Search Endpoints**

### **GET /api/company/search**
**Purpose**: Searches for companies using brreg.no API integration

**Request:**
```http
GET /api/company/search?q=company+name&limit=10
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `q` (required): Search query (company name or organization number)
- `limit` (optional): Maximum number of results (default: 10)

**Response:**
```typescript
interface CompanySearchResponse {
  success: boolean;
  data?: CompanySearchResult[];
  error?: string;
}

interface CompanySearchResult {
  organizationNumber: string;
  name: string;
  address: {
    city: string;
    country: string;
  };
  legalForm: string;
  naceCodes: string[];
  status: 'active' | 'inactive';
}
```

**Status Codes:**
- `200 OK`: Search completed successfully
- `400 Bad Request`: Missing search query
- `401 Unauthorized`: Invalid or missing JWT token
- `500 Internal Server Error`: Server error

## 📈 **Analytics Endpoints**

### **GET /api/analytics/sustainability**
**Purpose**: Fetches sustainability metrics and analytics data

**Request:**
```http
GET /api/analytics/sustainability?year=2024&module=b1
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `year` (required): Reporting year
- `module` (optional): Specific VSME module

**Response:**
```typescript
interface SustainabilityAnalyticsResponse {
  success: boolean;
  data?: {
    metrics: SustainabilityMetric[];
    trends: TrendData[];
    compliance: ComplianceStatus;
  };
  error?: string;
}

interface SustainabilityMetric {
  name: string;
  value: number;
  unit: string;
  target?: number;
  status: 'on-track' | 'at-risk' | 'behind';
}

interface TrendData {
  period: string;
  value: number;
  change: number;
}

interface ComplianceStatus {
  overall: number; // Percentage
  modules: Record<string, number>;
  nextDeadline: Date;
}
```

**Status Codes:**
- `200 OK`: Analytics data retrieved successfully
- `400 Bad Request`: Missing required parameters
- `401 Unauthorized`: Invalid or missing JWT token
- `500 Internal Server Error`: Server error

## 📄 **Report Generation Endpoints**

### **POST /api/reports/:id/generate**
**Purpose**: Generates a PDF report from VSME data

**Request:**
```http
POST /api/reports/64f8a1b2c3d4e5f6a7b8c9d0/generate
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "format": "pdf",
  "includeCharts": true,
  "language": "en"
}
```

**Response:**
```typescript
interface ReportGenerationResponse {
  success: boolean;
  data?: {
    downloadUrl: string;
    expiresAt: Date;
    fileSize: number;
  };
  error?: string;
}
```

**Status Codes:**
- `200 OK`: Report generated successfully
- `400 Bad Request**: Invalid generation parameters
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Report not found
- `500 Internal Server Error`: Server error

## 🔄 **Data Export Endpoints**

### **GET /api/export/data**
**Purpose**: Exports VSME data in various formats

**Request:**
```http
GET /api/export/data?format=csv&year=2024&module=b1
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `format` (required): Export format (csv, json, xlsx)
- `year` (required): Reporting year
- `module` (optional): Specific VSME module

**Response:**
```typescript
interface DataExportResponse {
  success: boolean;
  data?: {
    downloadUrl: string;
    expiresAt: Date;
    fileSize: number;
    recordCount: number;
  };
  error?: string;
}
```

**Status Codes:**
- `200 OK`: Data exported successfully
- `400 Bad Request**: Invalid export parameters
- `401 Unauthorized`: Invalid or missing JWT token
- `500 Internal Server Error**: Server error

## 🚨 **Error Handling**

### **Standard Error Response Format**
```typescript
interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
  timestamp: string;
  requestId: string;
}
```

### **Common Error Codes**
- `400 Bad Request`: Invalid request data or parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### **Validation Error Response**
```typescript
interface ValidationErrorResponse {
  success: false;
  error: "Validation failed";
  details: {
    field: string;
    message: string;
    code: string;
  }[];
  timestamp: string;
  requestId: string;
}
```

## 📝 **Request/Response Validation**

### **Zod Schema Examples**
```typescript
import { z } from 'zod';

// Company creation schema
const CompanyCreateSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  organizationNumber: z.string().regex(/^\d{9}$/, "Invalid organization number"),
  address: z.object({
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
  }),
  website: z.string().url().optional(),
  contactPerson: z.object({
    name: z.string().min(1, "Contact person name is required"),
    title: z.string().min(1, "Title is required"),
    email: z.string().email("Invalid email format"),
  }),
  legalForm: z.string().min(1, "Legal form is required"),
  naceCodes: z.array(z.string()).min(1, "At least one NACE code is required"),
  balanceSheetSize: z.number().positive("Balance sheet size must be positive"),
  turnover: z.number().positive("Turnover must be positive"),
  employeeCount: z.number().int().positive("Employee count must be a positive integer"),
  primaryCountry: z.string().min(1, "Primary country is required"),
  siteLocations: z.array(z.object({
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
    coordinates: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }).optional(),
  })).min(1, "At least one site location is required"),
});

// VSME report creation schema
const VSMEReportCreateSchema = z.object({
  reportingYear: z.number().int().min(2020).max(2030),
  module: z.enum(['b1', 'b2', 'c1', 'c2', 'c3', 'c4']),
  data: z.record(z.any()), // Module-specific data structure
});
```

## 🔧 **Implementation Notes**

### **Middleware Order**
1. **CORS**: Handle cross-origin requests
2. **Authentication**: Validate JWT tokens
3. **Rate Limiting**: Prevent API abuse
4. **Validation**: Validate request data
5. **Business Logic**: Process the request
6. **Response**: Return formatted response

### **Database Operations**
- **Scope321 Database**: Company profile operations
- **VSME Guru Database**: Report and analytics operations
- **Prisma Client**: Single client managing both connections
- **Transactions**: Use transactions for multi-database operations

### **Performance Considerations**
- **Caching**: Cache frequently accessed data
- **Pagination**: Implement pagination for list endpoints
- **Indexing**: Optimize database queries with proper indexes
- **Rate Limiting**: Prevent abuse and ensure fair usage

---

**Note**: This document provides the API contract specifications for implementing the VSME Guru backend. When implementing endpoints, ensure compliance with the authentication, validation, and error handling patterns described here.
