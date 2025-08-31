# VSME Guru PRD Breakdown

## Overview

The VSME Guru Product Requirements Document (PRD) has been broken down into manageable, focused documents to facilitate development planning and implementation. This breakdown makes it easier for development teams to work with specific sections while maintaining the overall project context.

## What's Been Created

### 📋 [Index Document](./00-index.md)
- **Purpose:** Navigation and overview of all breakdown documents
- **Content:** Quick reference, epic order, key requirements summary
- **Use Case:** Getting started, project overview, quick lookups

### 🎯 [Goals and Background Context](./01-goals-and-context.md)
- **Purpose:** Understanding project vision and business context
- **Content:** 4 main goals, problem statement, solution approach
- **Audience:** Stakeholders, product team, development leads

### 🗺️ [Epic Roadmap](./02-epic-roadmap.md)
- **Purpose:** Development planning and project management
- **Content:** 7 core epics, dependencies, success criteria
- **Audience:** Project managers, development leads, product team

### ⚙️ [Functional Requirements by Epic](./03-functional-requirements.md)
- **Purpose:** Feature development and implementation planning
- **Content:** All FR requirements organized by epic
- **Audience:** Development teams, QA teams, product owners

### 🏗️ [Non-Functional Requirements](./04-non-functional-requirements.md)
- **Purpose:** System architecture and quality assurance
- **Content:** Performance, security, accessibility requirements
- **Audience:** Architects, DevOps, security teams

### ✅ [Acceptance & Validation Strategy](./05-acceptance-validation-strategy.md)
- **Purpose:** Development methodology and quality assurance
- **Content:** TDD process, testing strategy, compliance validation
- **Audience:** Development teams, QA teams, project managers

## How to Use These Documents

### For Development Teams
1. **Start with the Index** to understand the overall structure
2. **Review the Epic Roadmap** to understand your current phase
3. **Focus on your Epic's requirements** in the Functional Requirements document
4. **Reference NFRs** for system architecture decisions
5. **Follow the Acceptance Strategy** for testing and validation

### For Product Managers
1. **Use Goals and Context** for stakeholder presentations
2. **Reference Epic Roadmap** for project planning
3. **Track requirements** in the Functional Requirements document
4. **Validate quality** against NFRs and Acceptance Strategy

### For Project Managers
1. **Plan sprints** using the Epic Roadmap
2. **Track progress** against epic requirements
3. **Manage dependencies** between epics
4. **Ensure quality** through Acceptance Strategy compliance

## Epic Development Sequence

The project follows a logical development sequence:

```
Epic 1 (Auth) → Epic 2 (Onboarding) → Epic 3 (UI) → Epic 4 (General)
                                                           ↓
Epic 7 (Governance) ← Epic 6 (Social) ← Epic 5 (Environment)
```

### Current Status
- ✅ **Foundation Complete:** Backend API, database, UI foundation
- 🔄 **Next Phase:** Epic 1 (Production-Ready Authentication)
- ⏳ **Dependencies:** Clerk integration guide required

## Key Requirements Summary

### Authentication & Security
- **Clerk Integration:** Complete authentication system
- **GDPR Compliance:** User consent and data protection
- **Route Protection:** Secure access to application features

### Core Functionality
- **Company Onboarding:** brreg.no API integration + manual fallback
- **Dashboard:** Progress tracking, reporting year selector
- **Module System:** 3 main sustainability reporting modules

### Quality Standards
- **Performance:** 3s page load, 10s PDF generation
- **Accessibility:** WCAG 2.1 Level AA compliance
- **Testing:** 90% code coverage, TDD approach

## Development Guidelines

### Test-Driven Development
- Write tests first for all requirements
- Maintain 90% code coverage
- Follow BDD format for acceptance criteria

### Quality Assurance
- Code review for all changes
- Automated testing in CI/CD pipeline
- Performance and accessibility validation

### User Experience
- Intuitive interface for non-technical users
- Clear error messages with solutions
- Comprehensive loading states and error handling

## Technology Stack

### Frontend
- **Framework:** Next.js 15.3.0, React 19
- **Styling:** TailwindCSS 4.1.11, shadcn/ui
- **Quality:** Biome linter/formatter

### Backend
- **Runtime:** Bun v1.2.19+ (primary), Node.js compatible
- **Framework:** Hono 4.8.10
- **Database:** Prisma 6.13.0, MongoDB

### Integrations
- **Authentication:** Clerk
- **Company Data:** brreg.no API
- **Database:** Scope321 MongoDB Atlas

## Getting Started

### For New Team Members
1. Read the [Index Document](./00-index.md) for overview
2. Review [Goals and Context](./01-goals-and-context.md) for project vision
3. Understand your [Epic's requirements](./03-functional-requirements.md)
4. Follow the [Acceptance Strategy](./05-acceptance-validation-strategy.md)

### For Development Planning
1. Identify your current epic from the [Roadmap](./02-epic-roadmap.md)
2. Review requirements in [Functional Requirements](./03-functional-requirements.md)
3. Consider [NFRs](./04-non-functional-requirements.md) for architecture
4. Plan testing using [Acceptance Strategy](./05-acceptance-validation-strategy.md)

### For Stakeholder Updates
1. Use [Goals and Context](./01-goals-and-context.md) for vision
2. Reference [Epic Roadmap](./02-epic-roadmap.md) for progress
3. Show requirements from [Functional Requirements](./03-functional-requirements.md)
4. Validate quality against [NFRs](./04-non-functional-requirements.md)

## Maintenance and Updates

### Document Synchronization
- All documents maintain version 4.0 alignment
- Changes should be synchronized across related documents
- Regular review cycles for accuracy

### Feedback and Improvements
- Development team provides implementation feedback
- Product team maintains requirement accuracy
- Stakeholders validate business requirements
- Continuous improvement based on user feedback

## Support and Questions

### For Technical Questions
- Development team for implementation details
- Architecture team for system design decisions
- QA team for testing and validation approaches

### For Business Questions
- Product team for requirement clarifications
- Stakeholders for business context and validation
- Legal team for compliance requirements

### For Process Questions
- Project managers for development methodology
- Product owners for requirement prioritization
- Team leads for technical implementation guidance

---

**Last Updated:** August 19, 2025  
**Version:** 4.0 (Final with Epic Structure)  
**Maintained By:** Product Team 