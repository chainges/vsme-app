# VSME Guru Product Requirements Document (PRD)

**Version:** 4.0 (Final with Epic Structure)
**Date:** August 19, 2025
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

| Date       | Version | Description                                       |
| :--------- | :------ | :------------------------------------------------ |
| 2025-08-19 | 1.0     | Initial PRD draft created from Project Brief.     |
| 2025-08-19 | 2.0     | Expanded requirements to cover all module data.   |
| 2025-08-19 | 3.0     | Incorporated stakeholder feedback.                |
| 2025-08-19 | 4.0     | Final version with requirements structured by Epic. |

## 2. Epic Roadmap

This project will be developed and delivered in the following sequence of Epics. Each Epic represents a significant, standalone increment of value.

*   **Epic 1: Production-Ready Authentication**
*   **Epic 2: User Onboarding & Company Profile Management**
*   **Epic 3: Dashboard & Core Reporting UI**
*   **Epic 4: General Information & Strategy Module**
*   **Epic 5: Environment Module**
*   **Epic 6: Social & Workforce Module**
*   **Epic 7: Governance & Business Conduct Module**
*   *(Future Epics will include Advanced Report Generation and other features from the roadmap.)*

## 3. Functional Requirements by Epic

### **Epic 1: Production-Ready Authentication**
*   **FR-AUTH-1:** The application must fully integrate Clerk for user sign-up, sign-in, and session management, replacing all mock systems.
*   **FR-AUTH-2:** All stories and tasks for this Epic will be derived directly from the provided `clerk-integration-guide.md` document, including the creation of sign-in/sign-up pages and route protection middleware.

### **Epic 2: User Onboarding & Company Profile Management**
*   **FR-ONBOARD-1:** The system must provide an onboarding flow for new users to create a company profile by searching the `brreg.no` API.
*   **FR-ONBOARD-2:** The system must provide a manual data entry form as a fallback if a company cannot be found via the API.
*   **FR-ONBOARD-3:** Upon successful onboarding, a new company document must be created in the central Scope321 MongoDB database. The document will contain the general company information fields defined in FR-B1.5.
*   **FR-ONBOARD-4:** For existing Scope321 users, the system must fetch their company profile directly from the Scope321 database upon login.
*   **FR-ONBOARD-5:** The system must obtain explicit user consent (GDPR) before creating any company profile or importing data.

### **Epic 3: Dashboard & Core Reporting UI**
*   **FR-DASH-1:** The system must display a central dashboard with a progress overview, section statuses, and key metric snapshots as defined in the UI/UX Specification.
*   **FR-DASH-2:** A global, persistent "Reporting Year" selector must be present. The state of this selector will govern all data displayed and saved in the application.
*   **FR-DASH-3:** A dedicated "Reports" page must be created to list all generated reports by year.
*   **FR-DASH-4:** The core application shell, including the primary sidebar navigation, must be implemented.
*   **FR-UI-1:** In Version 1.0, the UI will contain disabled tabs or placeholders for the Comprehensive Module. When hovered over, a tooltip will inform the user that this functionality is planned for a future release.

### **Epic 4: General Information & Strategy Module**
*   **FR-B1.1:** User must select their reporting option: (a) Basic Module only, or (b) Basic and Comprehensive Module.
*   **FR-B1.2:** A field to declare if information has been omitted because it is classified or sensitive. The system must log the user's reason for omission for audit purposes.
*   **FR-B1.5:** A section for general company information, including: Organization Name, Number, HQ Address (City, Country), Website, Contact Person (Name, Title, Email), Legal form, NACE code(s), Balance sheet size (€), Turnover (€), Number of employees (headcount/FTE), Country of primary operations and Geolocation of sites.
    *   **FR-B1.5.1:** Input validation must be in place for fields like Website (must be a valid URL format) and Email (must be a valid email format).
*   **FR-C1.1:** Text areas to describe: significant products/services, significant markets, main business relationships, and key strategy elements related to sustainability.
    *   **FR-C1.1.1:** When a user upgrades from Basic to Comprehensive, relevant data from B1 must be pre-populated here to ensure coherence.
*   **FR-B2.1:** A section for the user to state whether they have practices, policies, or future initiatives for transitioning towards a more sustainable economy.
*   **FR-C2.1:** A structured input form to briefly describe the practices/policies from B2, specify any associated targets, and indicate the highest senior level accountable.

### **Epic 5: Environment Module**
*   **FR-B3.1:** A table to disclose total energy consumption in MWh (`Renewable` and `Non-renewable`).
*   **FR-B3.2:** Optional fields for energy generation/consumption from own renewable sources.
*   **FR-B3.3:** Text areas to describe the methodology and any uncertainty for energy data.
*   **FR-B3.4:** Numeric inputs for gross GHG emissions (tCO2eq) for `Scope 1` and `location-based Scope 2`.
    *   **FR-B3.4.1:** Input fields must validate that values are positive numbers. User-facing error messages will guide the user if invalid data is entered.
*   **FR-B3.5:** Optional numeric input for `Scope 3` emissions.
*   **FR-B3.6:** Text areas to describe the methodology and any uncertainty for GHG data.
*   **FR-B3.7:** The system must automatically calculate and display GHG intensity.
*   **FR-C3.1:** A section to define GHG reduction targets, with fields for: target year/value, base year/value, units, and a list of main actions.
    *   **FR-C3.1.1:** This section will reuse the baseline GHG emissions data entered in FR-B3.4 to provide context for target setting.
*   **FR-B4.1:** A "Mark as not material" checkbox, with text explaining this is for entities required by law to report pollutants. If material, a section to report pollutants by name, amount, and medium.
    *   **FR-B4.1.1:** An optional text area will be available for the user to describe the methodology used for pollution data.
*   **FR-B5.1:** A "Mark as not material" checkbox for Biodiversity. If material, fields for number and area (hectares) of sites.
*   **FR-B6.1:** A "Mark as not material" checkbox for Water. If material, fields for water withdrawal and consumption.
*   **FR-B7.1:** A text area for describing circular economy principles.
*   **FR-B7.2:** A table for annual waste generation (`non-hazardous`, `hazardous`).
*   **FR-B7.3:** A field for total waste diverted to recycling/reuse.
*   **FR-B7.4:** An interface for reporting material circularity (total mass and recycled content mass) for multiple products and packaging types. The system must auto-calculate the recycled rate %.
    *   **FR-B7.4.1:** The interface should be flexible, allowing users to add custom descriptions for materials to support sector-specific needs.
*   **FR-C4.1:** Text areas to describe: climate-related hazards/risks, assessment of exposure, time horizons, and adaptation actions undertaken.

### **Epic 6: Social & Workforce Module**
*   **FR-B8.1:** Breakdown of employees by contract type, gender, and country.
*   **FR-B8.2:** For companies with 50+ employees, a field for employee turnover rate.
*   **FR-B9.1:** Fields for number and rate of work-related accidents and number of fatalities.
*   **FR-B9.2:** A field for the number of employees who have undergone health and safety training.
*   **FR-B10.1:** A Yes/No input for minimum wage compliance (Default: Yes). If "No," a field appears for the percentage of employees under minimum wage.
*   **FR-B10.2:** The system must calculate the gender pay gap.
*   **FR-B10.3:** A field for the percentage of employees covered by collective bargaining.
*   **FR-B10.4:** Fields for average training hours per employee by gender.
*   **FR-C5.1:** For companies with 50+ employees, the system must calculate the female-to-male ratio at the management level.
*   **FR-C5.2:** For companies with 50+ employees, a field for the number of self-employed and temporary workers.
*   **FR-C6.1:** A series of Yes/No questions on the existence and coverage of a human rights policy.
*   **FR-C7.1:** A series of Yes/No questions on confirmed human rights incidents in the workforce and value chain, with a text area for actions taken.
    *   **FR-C7.1.1:** Data entered in this section must be handled with heightened security and should be presented in an anonymized or aggregated format in any reports or analytics.

### **Epic 7: Governance & Business Conduct Module**
*   **FR-B11.1:** Fields for the number of convictions and total amount of fines for corruption and bribery.
*   **FR-C8.1:** A section to disclose revenues from controversial sectors (weapons, tobacco, etc.).
*   **FR-C8.2:** A Yes/No field to disclose if the company is excluded from EU reference benchmarks.
*   **FR-C9.1:** The system must calculate the gender diversity ratio in the governance body.

### **Future Epics: Flexibility and Customization**
*   **FR-FLEX-1:** The system will provide a "Custom Metrics" section where users can define and report on sustainability issues specific to their sector that are not covered by the standard, as encouraged by VSME paragraph 10.

## 4. Non-Functional Requirements (NFR)

*   **NFR-1 (Usability):** The application must be intuitive for non-technical users. All user-facing error messages must be clear, jargon-free, and suggest a solution.
*   **NFR-2 (Performance):** Page load times shall not exceed 3 seconds. PDF report generation shall be completed within 10 seconds. The system must gracefully handle incomplete data during PDF generation, clearly marking sections that are missing information rather than failing.
*   **NFR-3 (Security & Compliance):** All user data must be encrypted at rest and in transit. The application must be **GDPR compliant**, particularly regarding the handling of personal data collected for contact information and workforce metrics. Authentication will be handled by Clerk.
*   **NFR-4 (Reliability):** The application shall have an uptime of 99.5%. User data must be backed up regularly to prevent data loss.
*   **NFR-5 (Integrations):** The integrations with `brreg.no` and the "Scope321" MongoDB Atlas database must be robust and handle potential API errors gracefully, providing clear feedback to the user.
*   **NFR-6 (Accessibility):** The application interface must be compliant with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
*   **NFR-7 (Internationalization):** The application must be built with internationalization in mind. Version 1.0 will launch with English as the primary language, but the architecture must support the future addition of other EU languages.

## 5. Acceptance & Validation Strategy

*   **Acceptance Criteria:** Every functional requirement (FR) listed in this document will be translated into a detailed user story with specific, testable acceptance criteria before development begins. BDD with a GIVEN -> WHEN -> THEN format acceptance tests is preferred.
*   **Testing:** The development process will include unit tests for all calculations and business logic. End-to-end tests will be created for critical user flows, including both onboarding paths and the full report generation process. We run a TTD prcess so for each task we should write the tests first and then implement the feature.
*   **User Feedback Loop:** A beta testing phase with a select group of SMEs will be conducted before the public launch to gather feedback and ensure the application meets the success metrics for usability and time-saving.