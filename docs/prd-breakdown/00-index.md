# VSME Guru PRD - Document Breakdown Index

**Source:** Complete PRD Document  
**Version:** 4.0  
**Date:** August 19, 2025  
**Author:** John, Product Manager

## Overview

This document provides an index to the broken-down sections of the VSME Guru Product Requirements Document (PRD). Each section has been separated into manageable, focused documents for easier reference and implementation.

## Document Structure

### 1. [Goals and Background Context](./01-goals-and-context.md)
- **Content:** Project goals, background context, problem statement, solution approach
- **Key Sections:** 4 main goals, business impact, stakeholder identification
- **Use Case:** Understanding project vision and business context

### 2. [Epic Roadmap](./02-epic-roadmap.md)
- **Content:** Development strategy, epic sequence, dependencies, future planning
- **Key Sections:** 7 core epics, dependencies map, success criteria
- **Use Case:** Development planning and project management

### 3. [Functional Requirements by Epic](./03-functional-requirements.md)
- **Content:** Detailed functional requirements organized by epic
- **Key Sections:** All FR requirements from Epics 1-7, future epics
- **Use Case:** Feature development and implementation planning

### 4. [Non-Functional Requirements](./04-non-functional-requirements.md)
- **Content:** Performance, security, accessibility, and quality requirements
- **Key Sections:** 7 NFR categories, compliance standards, testing strategy
- **Use Case:** System architecture and quality assurance

### 5. [Acceptance & Validation Strategy](./05-acceptance-validation-strategy.md)
- **Content:** Testing approach, user feedback, quality assurance process
- **Key Sections:** TDD process, testing strategy, compliance validation
- **Use Case:** Development methodology and quality assurance

## Quick Reference

### Epic Development Order
1. **Epic 1:** Production-Ready Authentication
2. **Epic 2:** User Onboarding & Company Profile Management
3. **Epic 3:** Dashboard & Core Reporting UI
4. **Epic 4:** General Information & Strategy Module
5. **Epic 5:** Environment Module
6. **Epic 6:** Social & Workforce Module
7. **Epic 7:** Governance & Business Conduct Module

### Key Requirements Summary
- **Authentication:** Clerk integration, route protection
- **Onboarding:** brreg.no API integration, GDPR compliance
- **Core UI:** Dashboard, progress tracking, reporting year selector
- **Modules:** 3 main sustainability reporting modules
- **Performance:** 3s page load, 10s PDF generation
- **Compliance:** GDPR, WCAG 2.1 AA, VSME standard

### Development Approach
- **Methodology:** Test-Driven Development (TDD)
- **Testing:** 90% code coverage, comprehensive testing strategy
- **Quality:** Code review, automated testing, performance validation
- **User Feedback:** Beta testing phase, continuous improvement

## Implementation Notes

### Current Status
- **Foundation:** Backend API, database setup, UI foundation completed
- **Next Phase:** Epic 1 (Production-Ready Authentication)
- **Dependencies:** Clerk integration guide required

### Technology Stack
- **Frontend:** Next.js 15.3.0, React 19, TailwindCSS 4.1.11
- **Backend:** Hono 4.8.10, Prisma 6.13.0, MongoDB
- **Quality:** Biome linter/formatter, TypeScript strict mode
- **Testing:** TDD approach with comprehensive test coverage

### Key Integrations
- **Authentication:** Clerk
- **Company Data:** Scope321 MongoDB Atlas
- **Database:** Scope321 MongoDB Atlas
- **External:** VSME standard compliance, brreg.no API

## Document Maintenance

### Version Control
- All documents maintain version 4.0 alignment with main PRD
- Changes should be synchronized across all breakdown documents
- Date stamps indicate last update

### Updates Required
- Document updates when PRD changes
- Implementation status updates
- New requirements or epics added
- Technical specification changes

### Collaboration
- Product team maintains PRD content
- Development team provides implementation feedback
- Stakeholders review and approve changes
- Regular review cycles for document accuracy

## Contact and Support

### Document Owner
- **Product Manager:** John
- **Last Updated:** August 19, 2025
- **Version:** 4.0 (Final with Epic Structure)

### Questions and Clarifications
- Refer to main PRD document for complete context
- Contact product team for requirement clarifications
- Development team for technical implementation questions
- Stakeholders for business requirement validation 