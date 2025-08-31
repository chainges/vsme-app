# VSME Guru PRD - Functional Requirements by Epic

**Source:** PRD Section 3  
**Version:** 4.0  
**Date:** August 19, 2025

## Epic 1: Production-Ready Authentication

### FR-AUTH-1: Clerk Integration
- **Requirement:** Full Clerk integration for user sign-up, sign-in, and session management
- **Action:** Replace all mock authentication systems
- **Scope:** Complete authentication lifecycle

### FR-AUTH-2: Implementation Guide
- **Requirement:** All stories and tasks derived from `clerk-integration-guide.md`
- **Deliverables:** Sign-in/sign-up pages, route protection middleware
- **Dependencies:** Clerk integration guide document

## Epic 2: User Onboarding & Company Profile Management

### FR-ONBOARD-1: Company Profile Search
- **Requirement:** Onboarding flow for new users to create company profile
- **Method:** Search via `brreg.no` API
- **User Experience:** Guided company discovery

### FR-ONBOARD-2: Manual Data Entry Fallback
- **Requirement:** Manual data entry form as fallback
- **Trigger:** Company not found via API
- **Purpose:** Ensure all companies can be onboarded

### FR-ONBOARD-3: Database Integration
- **Requirement:** Create company document in Scope321 MongoDB database
- **Content:** General company information fields (FR-B1.5)
- **Data Structure:** Centralized company profile

### FR-ONBOARD-4: Existing User Integration
- **Requirement:** Fetch company profile from Scope321 database for existing users
- **Trigger:** User login
- **Data Source:** Scope321 MongoDB Atlas

### FR-ONBOARD-5: GDPR Compliance
- **Requirement:** Explicit user consent before profile creation or data import
- **Scope:** Company profile creation, data import
- **Compliance:** GDPR Article 6 legal basis

## Epic 3: Dashboard & Core Reporting UI

### FR-DASH-1: Central Dashboard
- **Requirement:** Display central dashboard with progress overview
- **Components:** Section statuses, key metric snapshots
- **Reference:** UI/UX Specification

### FR-DASH-2: Reporting Year Selector
- **Requirement:** Global, persistent "Reporting Year" selector
- **Behavior:** Governs all data displayed and saved
- **Scope:** Application-wide state management

### FR-DASH-3: Reports Page
- **Requirement:** Dedicated "Reports" page listing all generated reports by year
- **Organization:** Chronological listing
- **Access:** User's report history

### FR-DASH-4: Application Shell
- **Requirement:** Core application shell implementation
- **Components:** Primary sidebar navigation
- **Foundation:** Core UI structure

### FR-UI-1: Comprehensive Module Placeholders
- **Requirement:** Disabled tabs/placeholders for Comprehensive Module in v1.0
- **User Experience:** Tooltip explaining future functionality
- **Scope:** UI preparation for future features

## Epic 4: General Information & Strategy Module

### FR-B1.1: Reporting Option Selection
- **Requirement:** User selects reporting option
- **Options:** (a) Basic Module only, (b) Basic and Comprehensive Module
- **Impact:** Determines available features

### FR-B1.2: Information Omission Declaration
- **Requirement:** Field to declare omitted information due to classification/sensitivity
- **Audit:** System logs user's reason for omission
- **Compliance:** Audit trail for reporting decisions

### FR-B1.5: General Company Information
- **Requirement:** Section for general company information
- **Fields:** Organization Name, Number, HQ Address (City, Country), Website, Contact Person (Name, Title, Email), Legal form, NACE code(s), Balance sheet size (€), Turnover (€), Number of employees (headcount/FTE), Country of primary operations, Geolocation of sites

#### FR-B1.5.1: Input Validation
- **Requirement:** Input validation for specific fields
- **Fields:** Website (valid URL format), Email (valid email format)
- **User Experience:** Clear error messages

### FR-C1.1: Strategic Information
- **Requirement:** Text areas for strategic descriptions
- **Content:** Significant products/services, significant markets, main business relationships, key strategy elements related to sustainability

#### FR-C1.1.1: Data Pre-population
- **Requirement:** Pre-populate relevant B1 data when upgrading to Comprehensive
- **Purpose:** Ensure data coherence
- **Trigger:** Module upgrade

### FR-B2.1: Sustainability Practices
- **Requirement:** Section for sustainability practices, policies, or future initiatives
- **Focus:** Transition towards more sustainable economy
- **Scope:** Current and planned practices

### FR-C2.1: Practice Documentation
- **Requirement:** Structured input form for practices/policies
- **Fields:** Brief description, associated targets, highest senior level accountable
- **Source:** Data from B2 section

## Epic 5: Environment Module

### FR-B3.1: Energy Consumption Table
- **Requirement:** Table for total energy consumption in MWh
- **Categories:** Renewable and Non-renewable
- **Unit:** MWh

### FR-B3.2: Own Renewable Sources
- **Requirement:** Optional fields for energy generation/consumption from own renewable sources
- **Scope:** Self-generated renewable energy
- **Optional:** Not required for Basic Module

### FR-B3.3: Energy Methodology
- **Requirement:** Text areas for methodology and uncertainty description
- **Content:** Energy data collection and calculation methods
- **Purpose:** Transparency and auditability

### FR-B3.4: GHG Emissions
- **Requirement:** Numeric inputs for gross GHG emissions (tCO2eq)
- **Scopes:** Scope 1 and location-based Scope 2
- **Unit:** tCO2eq

#### FR-B3.4.1: Input Validation
- **Requirement:** Validate values as positive numbers
- **User Experience:** Clear error messages for invalid data
- **Validation:** Positive number requirement

### FR-B3.5: Scope 3 Emissions
- **Requirement:** Optional numeric input for Scope 3 emissions
- **Scope:** Value chain emissions
- **Optional:** Not required for Basic Module

### FR-B3.6: GHG Methodology
- **Requirement:** Text areas for methodology and uncertainty description
- **Content:** GHG data collection and calculation methods
- **Purpose:** Transparency and auditability

### FR-B3.7: GHG Intensity Calculation
- **Requirement:** Automatic calculation and display of GHG intensity
- **Calculation:** Based on emissions and company metrics
- **Display:** Real-time calculation

### FR-C3.1: GHG Reduction Targets
- **Requirement:** Section for GHG reduction targets
- **Fields:** Target year/value, base year/value, units, list of main actions
- **Context:** Reuses baseline GHG emissions data

#### FR-C3.1.1: Baseline Data Integration
- **Requirement:** Reuse baseline GHG emissions data from FR-B3.4
- **Purpose:** Provide context for target setting
- **Integration:** Cross-module data sharing

### FR-B4.1: Pollutants Reporting
- **Requirement:** "Mark as not material" checkbox for pollutants
- **Context:** For entities required by law to report pollutants
- **Conditional:** If material, report by name, amount, and medium

#### FR-B4.1.1: Pollution Methodology
- **Requirement:** Optional text area for pollution data methodology
- **Content:** Methods used for pollution data collection
- **Optional:** Not required for Basic Module

### FR-B5.1: Biodiversity
- **Requirement:** "Mark as not material" checkbox for Biodiversity
- **Conditional:** If material, fields for number and area (hectares) of sites
- **Unit:** Hectares for area

### FR-B6.1: Water
- **Requirement:** "Mark as not material" checkbox for Water
- **Conditional:** If material, fields for water withdrawal and consumption
- **Scope:** Water resource management

### FR-B7.1: Circular Economy
- **Requirement:** Text area for describing circular economy principles
- **Content:** Company's circular economy approach
- **Scope:** Sustainability strategy

### FR-B7.2: Waste Generation
- **Requirement:** Table for annual waste generation
- **Categories:** Non-hazardous, hazardous
- **Frequency:** Annual reporting

### FR-B7.3: Waste Diversion
- **Requirement:** Field for total waste diverted to recycling/reuse
- **Purpose:** Track waste management efficiency
- **Metric:** Total diverted waste

### FR-B7.4: Material Circularity
- **Requirement:** Interface for reporting material circularity
- **Fields:** Total mass and recycled content mass for multiple products and packaging types
- **Calculation:** Auto-calculate recycled rate %

#### FR-B7.4.1: Flexible Descriptions
- **Requirement:** Allow custom descriptions for materials
- **Purpose:** Support sector-specific needs
- **Flexibility:** Custom material categorization

### FR-C4.1: Climate Adaptation
- **Requirement:** Text areas for climate-related information
- **Content:** Climate-related hazards/risks, assessment of exposure, time horizons, adaptation actions undertaken
- **Scope:** Climate resilience strategy

## Epic 6: Social & Workforce Module

### FR-B8.1: Employee Breakdown
- **Requirement:** Breakdown of employees by contract type, gender, and country
- **Categories:** Contract type, gender, country
- **Purpose:** Workforce diversity tracking

### FR-B8.2: Employee Turnover
- **Requirement:** Field for employee turnover rate
- **Condition:** For companies with 50+ employees
- **Metric:** Annual turnover rate

### FR-B9.1: Workplace Safety
- **Requirement:** Fields for work-related accidents and fatalities
- **Metrics:** Number and rate of accidents, number of fatalities
- **Scope:** Occupational health and safety

### FR-B9.2: Safety Training
- **Requirement:** Field for employees who have undergone health and safety training
- **Metric:** Number of trained employees
- **Purpose:** Safety compliance tracking

### FR-B10.1: Minimum Wage Compliance
- **Requirement:** Yes/No input for minimum wage compliance
- **Default:** Yes
- **Conditional:** If "No," field for percentage of employees under minimum wage

### FR-B10.2: Gender Pay Gap
- **Requirement:** Automatic calculation of gender pay gap
- **Calculation:** Based on workforce data
- **Display:** Real-time calculation

### FR-B10.3: Collective Bargaining
- **Requirement:** Field for percentage of employees covered by collective bargaining
- **Metric:** Coverage percentage
- **Purpose:** Labor relations tracking

### FR-B10.4: Training Hours
- **Requirement:** Fields for average training hours per employee by gender
- **Breakdown:** By gender
- **Metric:** Average hours per employee

### FR-C5.1: Management Diversity
- **Requirement:** Calculate female-to-male ratio at management level
- **Condition:** For companies with 50+ employees
- **Calculation:** Automatic ratio calculation

### FR-C5.2: Workforce Composition
- **Requirement:** Field for number of self-employed and temporary workers
- **Condition:** For companies with 50+ employees
- **Scope:** Non-permanent workforce

### FR-C6.1: Human Rights Policy
- **Requirement:** Series of Yes/No questions on human rights policy
- **Scope:** Existence and coverage of human rights policy
- **Format:** Structured questionnaire

### FR-C7.1: Human Rights Incidents
- **Requirement:** Series of Yes/No questions on confirmed human rights incidents
- **Scope:** Workforce and value chain incidents
- **Additional:** Text area for actions taken

#### FR-C7.1.1: Data Security
- **Requirement:** Handle data with heightened security
- **Presentation:** Anonymized or aggregated format in reports/analytics
- **Purpose:** Protect sensitive information

## Epic 7: Governance & Business Conduct Module

### FR-B11.1: Corruption and Bribery
- **Requirement:** Fields for convictions and fines
- **Metrics:** Number of convictions, total amount of fines
- **Scope:** Corruption and bribery incidents

### FR-C8.1: Controversial Sectors
- **Requirement:** Section for disclosing revenues from controversial sectors
- **Examples:** Weapons, tobacco, etc.
- **Purpose:** Transparency in business activities

### FR-C8.2: EU Benchmark Exclusion
- **Requirement:** Yes/No field for EU reference benchmark exclusion
- **Scope:** Regulatory compliance status
- **Impact:** Investment eligibility

### FR-C9.1: Governance Diversity
- **Requirement:** Calculate gender diversity ratio in governance body
- **Calculation:** Automatic ratio calculation
- **Scope:** Board and governance composition

## Future Epics: Flexibility and Customization

### FR-FLEX-1: Custom Metrics
- **Requirement:** "Custom Metrics" section for sector-specific sustainability issues
- **Scope:** Issues not covered by VSME standard
- **Reference:** VSME paragraph 10 encouragement
- **Purpose:** Flexibility for diverse business sectors 