# VSME Guru PRD - Epic Roadmap

**Source:** PRD Section 2  
**Version:** 4.0  
**Date:** August 19, 2025

## Development Strategy

This project will be developed and delivered in the following sequence of Epics. Each Epic represents a significant, standalone increment of value.

## Epic Sequence

### Epic 1: Production-Ready Authentication
- **Focus:** User authentication and session management
- **Technology:** Clerk integration
- **Dependencies:** None
- **Value:** Secure user access foundation

### Epic 2: User Onboarding & Company Profile Management
- **Focus:** User registration and company profile creation
- **Integrations:** brreg.no API, Scope321 database
- **Dependencies:** Epic 1 (Authentication)
- **Value:** User onboarding and data foundation

### Epic 3: Dashboard & Core Reporting UI
- **Focus:** Core application interface and navigation
- **Features:** Dashboard, progress tracking, reporting year selector
- **Dependencies:** Epic 2 (User onboarding)
- **Value:** User experience foundation

### Epic 4: General Information & Strategy Module
- **Focus:** Company information and strategic sustainability data
- **Scope:** Basic Module (B1, B2) + Comprehensive Module (C1, C2)
- **Dependencies:** Epic 3 (Core UI)
- **Value:** Core reporting data collection

### Epic 4.1: Multistep Form System
- **Focus:** Reusable multi-step form architecture for sustainability reporting
- **Scope:** TanStack Forms integration, Zod validation, accessibility compliance
- **Dependencies:** Epic 3 (Core UI), existing UI components
- **Value:** Enhanced user experience and form infrastructure foundation

### Epic 5: Environment Module
- **Focus:** Environmental impact and sustainability metrics
- **Scope:** Basic Module (B3-B7) + Comprehensive Module (C3, C4)
- **Dependencies:** Epic 4 (General Information)
- **Value:** Environmental reporting capabilities

### Epic 6: Social & Workforce Module
- **Focus:** Social responsibility and workforce metrics
- **Scope:** Basic Module (B8-B10) + Comprehensive Module (C5-C7)
- **Dependencies:** Epic 5 (Environment)
- **Value:** Social responsibility reporting

### Epic 7: Governance & Business Conduct Module
- **Focus:** Governance, ethics, and business conduct
- **Scope:** Basic Module (B11) + Comprehensive Module (C8, C9)
- **Dependencies:** Epic 6 (Social & Workforce)
- **Value:** Governance and compliance reporting

## Future Epics

### Advanced Report Generation
- **Focus:** PDF generation, customization, and export
- **Dependencies:** All core modules (Epics 4-7)
- **Value:** Complete reporting solution

### Analytics and Insights
- **Focus:** Data analysis, benchmarking, and insights
- **Dependencies:** All core modules
- **Value:** Strategic decision support

### Multi-language Support
- **Focus:** Internationalization for EU markets
- **Dependencies:** Core application foundation
- **Value:** Market expansion

## Epic Dependencies Map

```
Epic 1 (Auth) → Epic 2 (Onboarding) → Epic 3 (UI) → Epic 4 (General)
                                    ↓                    ↓
                              Epic 4.1 (Forms)      Epic 5 (Environment)
                                                           ↓
Epic 7 (Governance) ← Epic 6 (Social) ← Epic 5 (Environment)
```

## Success Criteria

Each Epic must deliver:
- **Working functionality** for all specified requirements
- **User acceptance testing** completed
- **Performance benchmarks** met
- **Security requirements** satisfied
- **Accessibility standards** maintained 