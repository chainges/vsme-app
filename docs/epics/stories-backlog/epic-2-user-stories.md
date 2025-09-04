# Epic 2: User Onboarding & Company Profile Management - User Stories

## Overview
Epic 2 focuses on enabling company profile creation. It builds on secure authentication established in Epic 1 and integrates with external systems like brreg.no and the Scope321 database to validate and store company data.

## User Stories
### 1. Platform onboarding for existing customer
- **User Story:** As an existing user of Scope321, I want to access the VSME guru platform with my Scope321 credetials so that I don't need to register again to use the product.
- - **Acceptance Criteria:**
  - A user that is already registered with a company in the Scope321 database will bypass onboarding an land on the dashboard directly.
  - Data needed to populate the dashboard is fetched from the Scope321 database.
  - The first time an existing user access vsme guru a welcome modal is displayed on top of the dashboard with welcoming copy and a button to go directly to general information form(/generalinfo)

### 2. Existing Company Data Access
- **User Story:** As the system, I want to have access to the Scope321 database when an existing user of Scope321 access the vsme guru
- **Acceptance Criteria:**
- An existing Scope321 user is recognized as a Scope321 user when accessing vsme guru
- Data for the company of the existing user is available in the app

### 3. Company Profile Creation
- **User Story:** As a registered user, I want to create and manage my company's profile so that my business information is accurately represented on the platform.
- **Acceptance Criteria:**
  - A combobox for searching the brreg api is available for the user to look up their company in the database with organization number or by name
  - Alternative company/entity creation form is provided with fields for company name, address, Nace Code, Industry sector contactperson information(Name, email).
  - Real-time validations check the accuracy of the input data.
  - The data is saved persistently to the Scope321 database.

### 4. Integration with brreg.no API
- **User Story:** As the system, I want to validate company information using the brreg.no API so that only authentic company data is recorded.
- **Acceptance Criteria:**
  - The system automatically calls and searches the brreg.no API using the name or organization number.
  - Validation results are displayed on the profile creation screen.
  - The UI handles API errors gracefully and informs the user accordingly.

### 5. Data Security and Compliance
- **User Story:** As a user, I want assurance that my registration and company data are managed securely and in compliance with GDPR.
- **Acceptance Criteria:**
  - All data transmissions occur over secure channels (HTTPS).
  - Sensitive data is encrypted at rest and in transit.
  - The system complies with GDPR and other relevant data protection regulations.

### 6. User Experience Enhancements
- **User Story:** As a user, I want a seamless onboarding experience so that I can register and set up my company profile efficiently.
- **Acceptance Criteria:**
  - The registration and profile creation forms load quickly and are mobile-responsive.
  - Clear error messages and guidance are provided for form corrections.
  - The overall user interface is intuitive and accessible.

## Dependencies and Considerations
- **Dependency:** 
  - Epic 1: Production-Ready Authentication must be completed to ensure secure access with Clerk.
  - Epic 1.5: Data Fetching Strategy
- **Integration:** Requires secure integration with external systems (brreg.no API, Scope321 database).
- **Compliance:** Must adhere to GDPR and other data protection regulations.

---

This document outlines the detailed user stories for Epic 2. It serves as a reference for developers and stakeholders to understand the requirements and expected outcomes of the user onboarding and company profile management functionality.
