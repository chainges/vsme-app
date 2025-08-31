# VSME Guru - Project Planning Documents (v1.0)

This document contains the foundational planning artifacts for the VSME Guru project, ready for internal review. It includes:
1.  **The Project Brief:** Outlining the project's purpose, goals, and high-level scope.
2.  **The Product Requirements Document (PRD):** Detailing the specific functional and non-functional requirements for the application.

---

# Project Brief: VSME Guru

**Author:** Mary, Business Analyst
**Date:** August 19, 2025
**Version:** 1.0

### Executive Summary

VSME Guru is a web application designed to empower non-listed Small and Medium-sized Enterprises (SMEs) to efficiently create sustainability reports compliant with the EFRAG Voluntary Sustainability Reporting Standard (VSME). The application will guide users through the data collection process, integrate with existing data sources, and generate a polished, stakeholder-ready PDF report, thereby simplifying compliance and enhancing access to finance and corporate supply chains.

### Problem Statement

Non-listed SMEs are increasingly required by business counterparties (large corporate clients, banks, investors) to provide sustainability data. The new VSME standard provides a framework, but the process of understanding the requirements, collecting the data, and formatting a professional report is a significant, non-revenue-generating burden for resource-constrained SMEs. Existing solutions are often too complex, expensive, or not tailored to the specific VSME standard, creating a barrier to compliance and potentially limiting business opportunities.

### Proposed Solution

VSME Guru will be a user-friendly SaaS application that demystifies and streamlines the entire VSME reporting process. The solution will feature a guided, step-by-step interface that walks users through each section of the VSME Basic Module. It will support both automated data import for users of the "Scope321" application and manual data entry for all others. A key feature will be a materiality assessment, allowing users to bypass non-relevant sections. The final output will be a professionally formatted, branded PDF report that can be confidently shared with stakeholders.

### Target Users

*   **Primary User Segment:** Non-listed micro, small, and medium-sized enterprises (SMEs) within the European Union who need to create a VSME-compliant sustainability report.
*   **Secondary User Personas:**
    1.  **The Integrated User:** An SME that already uses the "Scope321" application and wants to leverage their existing environmental data to accelerate the reporting process.
    2.  **The New User:** An SME with no prior sustainability reporting data that needs a simple, guided tool to start from scratch.

### Goals & Success Metrics

*   **Business Objectives:**
    *   Launch a commercially viable product that captures a significant share of the SME sustainability reporting market.
    *   Reduce the time and effort required for an SME to produce a VSME report by at least 50% compared to manual methods.
*   **User Success Metrics:**
    *   High completion rate of sustainability reports started within the app.
    *   Positive user feedback on the ease of use and clarity of the guided process.
*   **Key Performance Indicators (KPIs):**
    *   Number of active monthly users.
    *   Number of PDF reports successfully generated.
    *   User satisfaction score (e.g., NPS or CSAT).

### Version 1.0 Scope

The initial launch will deliver a complete, end-to-end experience for the VSME **Basic Module**. The following features are considered **Must-Haves** for Version 1.0:

*   **Authentication:** Secure user sign-up and login using **Clerk**.
*   **Dual Onboarding:**
    *   Automated company setup for new users via an API integration with **brreg.no**.
    *   Automated data import for "Scope321" users via an integration with the **MongoDB Atlas** database.
*   **Dashboard:** A central hub showing overall report progress, section-by-section status, and historical comparison charts for key metrics.
*   **Guided Data Entry:** A stepper interface to guide users through each sub-section of the Basic Module (B1-B11).
*   **Materiality Assessment:** A checkbox on each data entry step to allow users to mark a topic as "not material."
*   **Save Progress:** The ability for users to save incomplete work and return later.
*   **Review & Edit Workflow:** A summary page for completed sections with the ability to edit any previously entered information.
*   **Branded PDF Generation:** A feature to generate a polished PDF report that includes the user's uploaded company logo and is structured according to the VSME standard.
*   **UI Scaffolding for Future Growth:** The user interface will include tabs or placeholders for the "Comprehensive Module" to indicate a clear path for future development.

### Post-MVP Vision (Future Roadmap)

Following a successful launch, the product roadmap will explore more advanced functionality, including:

*   Full support for the **Comprehensive Module**.
*   Deeper data analysis and visualization tools.
*   **Carbon budgeting** and target-setting features.
*   **AI-driven insights** and recommendations for improving sustainability metrics.
*   Editable report formats (beyond PDF).
*   Digital export formats for machine readability (e.g., **ESEF/iXBRL**).

### Technical Considerations

*   **Authentication:** Must be implemented using **Clerk**. A note has been made to discuss SSO capabilities during the technical design phase.
*   **Database Integration:** The application must connect to an external **MongoDB Atlas** database to fetch data for "Scope321" users.
*   **API Integration:** The application must integrate with the **brreg.no** API for new company setup.

---
---

# VSME Guru Product Requirements Document (PRD)

**Version:** 2.0
**Date:** 2025-08-19
**Author:** John, Product Manager

## 1. Goals and Background Context

### Goals

*   **Launch a Valuable MVP:** Deliver a user-friendly and commercially viable tool that empowers non-listed SMEs to comply with the VSME sustainability reporting standard.
*   **Accelerate Reporting:** Dramatically simplify and accelerate the reporting process by providing a guided workflow, automated data import, and streamlined data entry.
*   **Deliver a Professional Outcome:** Ensure users can successfully generate a complete, polished, and branded PDF report that is ready to be shared with key stakeholders like banks, investors, and corporate clients.
*   **Establish a Foundation for Growth:** Build a robust application that can be expanded in the future to include the Comprehensive Module and advanced analytics features.

### Background Context

Non-listed SMEs face a growing and complex challenge: the demand for standardized sustainability reporting from their key business partners. The EFRAG VSME standard provides the framework, but for SMEs with limited resources, the process of interpreting the standard, gathering the necessary data, and creating a professional report is a significant operational burden.

VSME Guru is designed to solve this problem by transforming a complex compliance task into a simple, guided workflow. As a SaaS application, it will provide a clear path for SMEs to follow, whether they are starting from scratch or leveraging existing data from the "Scope321" application. By handling the complexity of the standard and the formatting of the final report, VSME Guru will enable SMEs to meet stakeholder requirements efficiently, strengthening their business relationships and improving their access to capital.

### Change Log

| Date       | Version | Description                                       | Author     |
| :--------- | :------ | :------------------------------------------------ | :--------- |
| 2025-08-19 | 1.0     | Initial PRD draft created from Project Brief.     | John, PM   |
| 2025-08-19 | 2.0     | Expanded requirements to cover all module data.   | John, PM   |

## 2. Requirements

### Functional Requirements (FR)

**Reporting Period**
*   **FR-0.1:** The system must allow the user to select a specific reporting year. All data entered will be associated with this selected year.

---
### **Topic: General Information & Strategy**

#### Basic Module Requirements
*   **FR-B1.1:** User must select their reporting option: (a) Basic Module only, or (b) Basic and Comprehensive Module.
*   **FR-B1.2:** A field to declare if any information has been omitted because it is classified or sensitive.
*   **FR-B1.3:** User must specify if the report is on an individual or consolidated basis.
*   **FR-B1.4:** If consolidated, a list to input subsidiary names and registered addresses.
*   **FR-B1.5:** A section for general company information, including:
    *   Organization Name, Number, HQ Address (City, Country), Website.
    *   Contact Person (Name, Title, Email).
    *   Legal form, NACE code(s), Balance sheet size (€), Turnover (€), Number of employees (headcount/FTE).
    *   Country of primary operations and Geolocation of sites.
*   **FR-B1.6:** A text area to describe any sustainability-related certifications or labels.

#### Comprehensive Module Requirements
*   **FR-C1.1:** Text areas to describe: significant products/services, significant markets (including estimated number of suppliers, their sectors, and geographies), main business relationships, and key strategy elements related to sustainability.

---
### **Topic: Practices, Policies, and Initiatives**

#### Basic Module Requirements
*   **FR-B2.1:** A section for the user to state whether they have practices, policies, or future initiatives for transitioning towards a more sustainable economy.

#### Comprehensive Module Requirements
*   **FR-C2.1:** A structured input form (based on the template in VSME Guidance para 213) to briefly describe the practices/policies from B2, specify any associated targets, and indicate the highest senior level accountable.

---
### **Topic: Environment**

#### **Sub-Topic: Energy and Greenhouse Gas Emissions**
#### Basic Module Requirements
*   **FR-B3.1:** A table to disclose total energy consumption in MWh (`Renewable` and `Non-renewable`).
*   **FR-B3.2:** Optional fields for energy generation/consumption from own renewable sources.
*   **FR-B3.3:** Text areas to describe the methodology and any uncertainty for energy data.
*   **FR-B3.4:** Numeric inputs for gross GHG emissions (tCO2eq) for `Scope 1` and `location-based Scope 2`.
*   **FR-B3.5:** Optional numeric input for `Scope 3` emissions.
*   **FR-B3.6:** Text areas to describe the methodology and any uncertainty for GHG data.
*   **FR-B3.7:** The system must automatically calculate and display GHG intensity.

#### Comprehensive Module Requirements
*   **FR-C3.1:** A section to define GHG reduction targets, with fields for: target year/value, base year/value, units, and a list of main actions.
*   **FR-C3.2:** A text area for the climate change mitigation transition plan (if applicable for high-impact sectors).

#### **Sub-Topic: Pollution, Biodiversity, Water, and Resource Use**
#### Basic Module Requirements
*   **FR-B4.1:** A "Mark as not material" checkbox, with text explaining this is for entities required by law to report pollutants. If material, a section to report pollutants by name, amount, and medium.
*   **FR-B5.1:** A "Mark as not material" checkbox for Biodiversity. If material, fields for number and area (hectares) of sites.
*   **FR-B6.1:** A "Mark as not material" checkbox for Water. If material, fields for water withdrawal and consumption.
*   **FR-B7.1:** A text area for describing circular economy principles.
*   **FR-B7.2:** A table for annual waste generation (`non-hazardous`, `hazardous`).
*   **FR-B7.3:** A field for total waste diverted to recycling/reuse.
*   **FR-B7.4:** An interface for reporting material circularity (total mass and recycled content mass) for multiple products and packaging types. The system must auto-calculate the recycled rate %.

#### Comprehensive Module Requirements
*   **FR-C4.1:** Text areas to describe: climate-related hazards/risks, assessment of exposure, time horizons, and adaptation actions undertaken.

---
### **Topic: Social & Workforce**

#### Basic Module Requirements
*   **FR-B8.1:** Breakdown of employees by contract type, gender, and country.
*   **FR-B8.2:** For companies with 50+ employees, a field for employee turnover rate.
*   **FR-B9.1:** Fields for number and rate of work-related accidents and number of fatalities.
*   **FR-B9.2:** A field for the number of employees who have undergone health and safety training.
*   **FR-B10.1:** A Yes/No input for minimum wage compliance (Default: Yes). If "No," a field appears for the percentage of employees under minimum wage.
*   **FR-B10.2:** The system must calculate the gender pay gap.
*   **FR-B10.3:** A field for the percentage of employees covered by collective bargaining.
*   **FR-B10.4:** Fields for average training hours per employee by gender.

#### Comprehensive Module Requirements
*   **FR-C5.1:** For companies with 50+ employees, the system must calculate the female-to-male ratio at the management level.
*   **FR-C5.2:** For companies with 50+ employees, a field for the number of self-employed and temporary workers.
*   **FR-C6.1:** A series of Yes/No questions on the existence and coverage of a human rights policy.
*   **FR-C7.1:** A series of Yes/No questions on confirmed human rights incidents in the workforce and value chain, with a text area for actions taken.

---
### **Topic: Governance & Business Conduct**

#### Basic Module Requirements
*   **FR-B11.1:** Fields for the number of convictions and total amount of fines for corruption and bribery.

#### Comprehensive Module Requirements
*   **FR-C8.1:** A section to disclose revenues from controversial sectors (weapons, tobacco, etc.).
*   **FR-C8.2:** A Yes/No field to disclose if the company is excluded from EU reference benchmarks.
*   **FR-C9.1:** The system must calculate the gender diversity ratio in the governance body.

### Non-Functional Requirements (NFR)

*   **NFR-1 (Usability):** The application must be intuitive for non-technical users. The stepper and guided workflow must be clear and easy to follow.
*   **NFR-2 (Performance):** Page load times shall not exceed 3 seconds. PDF report generation shall be completed within 10 seconds.
*   **NFR-3 (Security):** All user data must be encrypted at rest and in transit. The application must adhere to security best practices to protect sensitive company information. Authentication will be handled by Clerk.
*   **NFR-4 (Reliability):** The application shall have an uptime of 99.5%. User data must be backed up regularly to prevent data loss.
*   **NFR-5 (Integrations):** The integrations with `brreg.no` and the "Scope321" MongoDB Atlas database must be robust and handle potential API errors gracefully.