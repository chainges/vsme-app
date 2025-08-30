# Story: Restructure Multi-Step Form Files for Better Organization

## Status
In Progress

## Story
**As a** developer,  
**I want** to structure the multistep form files in a logical structure,  
**so that** I can understand how the files are inter-related.

## Acceptance Criteria
1. [x] All form components organized by step in `/components/forms/multi-step/steps/`
2. [x] Each step directory contains all related components, schemas, and fields
3. [x] Each step has its own `__tests__` directory with step-specific tests
4. [x] Root `__tests__` directory contains cross-step integration tests
5. [x] All existing functionality preserved after restructuring
6. [x] All existing tests pass after restructuring
7. [x] No broken import paths anywhere in the codebase
8. [x] Import paths updated throughout the codebase
9. [x] Index files properly configured for new structure
10. [x] Main multi-step form component updated to use new step-based imports
11. [x] Page components updated to use new import structure
12. [x] Type checking passes without errors
13. [x] Build process succeeds without errors
14. [x] No console errors in browser development mode
15. [x] Follow TDD methodology with RED-GREEN-REFACTOR cycles
16. [x] Comprehensive test coverage for all moved components
17. [x] Integration tests verify form flow still works correctly
18. [x] Code follows project standards for TypeScript and React

## Tasks / Subtasks
- [x] Create new `steps/` directory with subdirectories for each step
  - [x] Create `step-1-company-info/` directory
  - [x] Create `step-2-business-model/` directory
  - [x] Create `step-3-sustainability-initiatives/` directory
  - [x] Create `step-4-sustainability-practices/` directory
- [x] Set up proper `__tests__` directories for each step
  - [x] Create `__tests__` directory in `step-1-company-info/`
  - [x] Create `__tests__` directory in `step-2-business-model/`
  - [x] Create `__tests__` directory in `step-3-sustainability-initiatives/`
  - [x] Create `__tests__` directory in `step-4-sustainability-practices/`
- [x] Create initial index files for new structure
  - [x] Create index.ts in each step directory
  - [x] Create index.ts in steps/ directory
- [x] Move step-specific components to respective step directories
  - [x] Move company info related files to `step-1-company-info/`
  - [x] Move business model related files to `step-2-business-model/`
  - [x] Move sustainability initiatives components to `step-3-sustainability-initiatives/`
  - [x] Move sustainability practices related files to `step-4-sustainability-practices/`
- [x] Move schemas and fields to respective step directories
  - [x] Move company-info.ts schema to `step-1-company-info/schema.ts`
  - [x] Move business-model.ts schema to `step-2-business-model/schema.ts`
  - [x] Move sustainability.ts schema to `step-4-sustainability-practices/schema.ts`
- [x] Move existing test files to new test structure
  - [x] Move business model tests to `step-2-business-model/__tests__/schema.test.ts`
  - [x] Move sustainability initiatives tests to `step-3-sustainability-initiatives/__tests__/`
  - [x] Move existing tests to appropriate step `__tests__` directories
- [x] Update all import paths throughout the codebase
  - [x] Update imports in multi-step-form.tsx
  - [x] Update imports in page components
  - [x] Update imports in all test files
- [x] Update main multi-step form to use new step-based imports
- [x] Update step configurations to reference new structure
- [x] Update external references (page components, etc.)
- [x] Run type checking to ensure all imports are correct
- [x] Run all tests to verify functionality
- [x] Test form in browser to ensure it works correctly
- [x] Verify build process succeeds

## Dev Notes
### Current Structure Analysis:
The current directory structure has components organized by type rather than by step:
```
/components/forms/
├── multi-step/
│   ├── components/
│   ├── hooks/
│   ├── schemas/
│   └── multi-step-form.tsx
├── sustainability/
│   ├── InitiativeForm.tsx
│   ├── InitiativeManager.tsx
│   └── InitiativesTable.tsx
```

### Target Structure:
The proposed restructuring will organize components by step sequence:
```
/components/forms/
├── multi-step/
│   ├── index.ts
│   ├── multi-step-form.tsx
│   ├── types.ts
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── use-multi-step-form.ts
│   │   └── use-step-navigation.ts
│   ├── steps/
│   │   ├── index.ts
│   │   ├── step-1-company-info/
│   │   │   ├── schema.ts
│   │   │   ├── fields.ts
│   │   │   └── __tests__/
│   │   │       ├── schema.test.ts
│   │   │       └── fields.test.ts
│   │   ├── step-2-business-model/
│   │   │   ├── schema.ts
│   │   │   ├── fields.ts
│   │   │   ├── subsidiary-manager.tsx
│   │   │   └── __tests__/
│   │   │       ├── schema.test.ts
│   │   │       ├── fields.test.ts
│   │   │       └── subsidiary-manager.test.ts
│   │   ├── step-3-sustainability-initiatives/
│   │   │   ├── schema.ts
│   │   │   ├── InitiativeForm.tsx
│   │   │   ├── InitiativeManager.tsx
│   │   │   ├── InitiativesTable.tsx
│   │   │   └── __tests__/
│   │   │       ├── schema.test.ts
│   │   │       ├── InitiativeForm.test.tsx
│   │   │       ├── InitiativeManager.test.tsx
│   │   │       └── InitiativesTable.test.tsx
│   │   └── step-4-sustainability-practices/
│   │       ├── schema.ts
│   │       ├── fields.ts
│   │       └── __tests__/
│   │           ├── schema.test.ts
│   │           └── fields.test.ts
│   ├── components/
│   │   ├── index.ts
│   │   ├── form-field.tsx
│   │   ├── step-indicator.tsx
│   │   ├── progress-bar.tsx
│   │   ├── completion-screen.tsx
│   │   └── form-navigation.tsx
│   └── __tests__/
│       ├── integration.test.tsx
│       ├── components.test.tsx
│       └── hooks.test.ts
```

### Benefits:
1. Clear step-based organization makes it easier to locate related files
2. All components, schemas, and tests for a step are colocated
3. Import paths become more intuitive and logical
4. Easier to understand the form flow by looking at the directory structure
5. Better test organization improves maintainability

### Testing
- Each step has its own dedicated test directory
- Step-specific tests are easier to find and run
- Cross-step integration tests remain in the root test directory
- Follow TDD methodology with RED-GREEN-REFACTOR cycles
- Comprehensive test coverage for all moved components
- Integration tests verify form flow still works correctly

### Risk Considerations
A comprehensive risk profile has been created for this story which identifies several key risks:
1. **High risk of broken import paths** during the restructure process
2. **Potential loss of test coverage** during file moves
3. **Runtime errors** possible even with passing tests

The full risk profile can be found at: `docs/qa/assessments/multi-step-form-restructure-risk-profile-20250830.md`

Key mitigation strategies include:
- Implementing a phased approach to the restructure
- Continuous testing during the process
- Having a rollback procedure in place
- Updating import paths systematically

### Implementation Guidance
To ensure successful implementation of this restructure, two key documents have been created:

1. **Risk Mitigation Plan**: A comprehensive plan that addresses each identified risk with specific strategies and procedures.
   - Location: `docs/qa/mitigation-plans/multi-step-form-restructure-mitigation-plan.md`

2. **Phased Implementation Plan**: A detailed step-by-step guide for implementing the restructure in phases to minimize risk.
   - Location: `docs/qa/implementation-plans/multi-step-form-restructure-implementation-plan.md`

These documents should be reviewed and followed during implementation to ensure all risks are properly mitigated.

## QA Results

### QA Gate Decision
A QA gate decision has been created for this story with a status of **CONCERNS**. The story is well-defined but has identified risks that need to be addressed during implementation.

The full QA gate decision can be found at: `docs/qa/gates/multi-step-form-restructure.yml`

Key conditions for proceeding:
- Risk mitigation strategies must be implemented
- Phased approach is recommended
- Continuous testing and monitoring during the process

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-08-30 | 1.0 | Initial story creation based on multistep-form-restructure-handover.md | Bob (Scrum Master) |
| 2025-08-30 | 1.1 | Updated status to Ready for Development, added risk considerations and QA gate information | Quinn (QA Assistant) |
| 2025-08-30 | 1.2 | Added implementation guidance and mitigation plan references | Quinn (QA Assistant) |
| 2025-08-30 | 1.3 | Started implementation - Phase 1 (Preparation and Setup) completed | James (Full Stack Developer) |
| 2025-08-30 | 1.4 | Phase 2a (Step 1 - Company Info) completed | James (Full Stack Developer) |
| 2025-08-30 | 1.5 | Phase 2b (Step 2 - Business Model) completed | James (Full Stack Developer) |
| 2025-08-30 | 1.6 | Phase 2c (Step 3 - Sustainability Initiatives) completed | James (Full Stack Developer) |
| 2025-08-30 | 1.7 | Phase 2d (Step 4 - Sustainability Practices) completed | James (Full Stack Developer) |