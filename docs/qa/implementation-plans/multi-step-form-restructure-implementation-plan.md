# Phased Implementation Plan: Multi-Step Form Restructure

## Document Information
- **Story**: Restructure Multi-Step Form Files for Better Organization
- **Plan Date**: 2025-08-30
- **Author**: Quinn (QA Assistant)
- **Target Developer**: James (Full Stack Developer)

## Overview
This implementation plan provides a detailed, phased approach for restructuring the multi-step form files. Each phase includes specific tasks, validation steps, and success criteria to ensure the restructure is completed safely and successfully.

## Phase 1: Preparation and Setup

### Objective
Establish the new directory structure and prepare for migration while maintaining current functionality.

### Tasks
1. Create new directory structure:
   ```bash
   mkdir -p apps/web/src/components/forms/multi-step/steps/step-1-company-info/__tests__
   mkdir -p apps/web/src/components/forms/multi-step/steps/step-2-business-model/__tests__
   mkdir -p apps/web/src/components/forms/multi-step/steps/step-3-sustainability-initiatives/__tests__
   mkdir -p apps/web/src/components/forms/multi-step/steps/step-4-sustainability-practices/__tests__
   ```

2. Create initial index files:
   ```bash
   touch apps/web/src/components/forms/multi-step/steps/index.ts
   touch apps/web/src/components/forms/multi-step/steps/step-1-company-info/index.ts
   touch apps/web/src/components/forms/multi-step/steps/step-2-business-model/index.ts
   touch apps/web/src/components/forms/multi-step/steps/step-3-sustainability-initiatives/index.ts
   touch apps/web/src/components/forms/multi-step/steps/step-4-sustainability-practices/index.ts
   ```

3. Document current import paths:
   - Create a mapping document of all current import paths
   - Identify all files that reference multi-step form components
   - List all external references to be updated

4. Run baseline validation:
   ```bash
   bun check-types
   bun test:run
   bun dev:web  # Verify current functionality
   ```

### Validation
- [ ] New directory structure matches target structure
- [ ] All index files created and properly configured
- [ ] Current import path mapping document completed
- [ ] Baseline tests pass
- [ ] Current functionality verified in browser

### Success Criteria
- New directory structure is in place
- No impact on existing functionality
- All preparation tasks completed

### Time Estimate
2-3 hours

## Phase 2: Component Migration (Step by Step)

### Phase 2a: Step 1 - Company Info

#### Objective
Migrate company info components to the new structure while maintaining functionality.

#### Tasks
1. Move company info related files:
   ```bash
   # Move schema
   mv apps/web/src/components/forms/multi-step/schemas/company-info.ts apps/web/src/components/forms/multi-step/steps/step-1-company-info/schema.ts
   
   # Move any company info specific components (if any)
   # Check for any files in components/ or hooks/ that are specific to step 1
   ```

2. Move existing tests:
   ```bash
   # Identify and move tests related to company info
   # Tests may be in apps/web/src/components/forms/multi-step/__tests__/
   ```

3. Update import paths:
   - Update references in multi-step-form.tsx
   - Update references in page components
   - Update references in test files

4. Update main multi-step form to use new imports

#### Validation
- [ ] Run type checking: `bun check-types`
- [ ] Run tests: `bun test:run`
- [ ] Test in browser: `bun dev:web`
- [ ] Verify build: `bun build`

#### Success Criteria
- All company info components moved to new structure
- All tests pass
- No console errors in browser
- Build process succeeds

#### Time Estimate
3-4 hours

### Phase 2b: Step 2 - Business Model

#### Objective
Migrate business model components to the new structure while maintaining functionality.

#### Tasks
1. Move business model related files:
   ```bash
   # Move schema
   mv apps/web/src/components/forms/multi-step/schemas/business-model.ts apps/web/src/components/forms/multi-step/steps/step-2-business-model/schema.ts
   
   # Move subsidiary manager if it exists
   # Check for business-model specific components
   ```

2. Move existing tests:
   ```bash
   # Identify and move tests related to business model
   ```

3. Update import paths:
   - Update references in multi-step-form.tsx
   - Update references in page components
   - Update references in test files

4. Update main multi-step form to use new imports

#### Validation
- [ ] Run type checking: `bun check-types`
- [ ] Run tests: `bun test:run`
- [ ] Test in browser: `bun dev:web`
- [ ] Verify build: `bun build`

#### Success Criteria
- All business model components moved to new structure
- All tests pass
- No console errors in browser
- Build process succeeds

#### Time Estimate
3-4 hours

### Phase 2c: Step 3 - Sustainability Initiatives

#### Objective
Migrate sustainability initiatives components to the new structure while maintaining functionality.

#### Tasks
1. Move sustainability initiatives components:
   ```bash
   # Move components from sustainability/ directory
   mv apps/web/src/components/forms/sustainability/* apps/web/src/components/forms/multi-step/steps/step-3-sustainability-initiatives/
   
   # Move tests
   mv apps/web/src/components/forms/sustainability/__tests__/* apps/web/src/components/forms/multi-step/steps/step-3-sustainability-initiatives/__tests__/
   ```

2. Update import paths:
   - Update references in multi-step-form.tsx
   - Update references in page components
   - Update references in test files

3. Update main multi-step form to use new imports

#### Validation
- [ ] Run type checking: `bun check-types`
- [ ] Run tests: `bun test:run`
- [ ] Test in browser: `bun dev:web`
- [ ] Verify build: `bun build`

#### Success Criteria
- All sustainability initiatives components moved to new structure
- All tests pass
- No console errors in browser
- Build process succeeds

#### Time Estimate
3-4 hours

### Phase 2d: Step 4 - Sustainability Practices

#### Objective
Migrate sustainability practices components to the new structure while maintaining functionality.

#### Tasks
1. Move sustainability practices related files:
   ```bash
   # Move schema
   mv apps/web/src/components/forms/multi-step/schemas/sustainability.ts apps/web/src/components/forms/multi-step/steps/step-4-sustainability-practices/schema.ts
   
   # Check for any other sustainability practices components
   ```

2. Move existing tests:
   ```bash
   # Identify and move tests related to sustainability practices
   ```

3. Update import paths:
   - Update references in multi-step-form.tsx
   - Update references in page components
   - Update references in test files

4. Update main multi-step form to use new imports

#### Validation
- [ ] Run type checking: `bun check-types`
- [ ] Run tests: `bun test:run`
- [ ] Test in browser: `bun dev:web`
- [ ] Verify build: `bun build`

#### Success Criteria
- All sustainability practices components moved to new structure
- All tests pass
- No console errors in browser
- Build process succeeds

#### Time Estimate
3-4 hours

## Phase 3: Integration and Finalization

### Objective
Complete integration of all components and verify all functionality.

### Tasks
1. Update step configurations to reference new structure:
   - Update any configuration files that reference step components
   - Update routing if applicable

2. Update external references:
   - Update page components that import multi-step form components
   - Update any shared components or utilities
   - Update documentation references

3. Update all remaining import paths:
   - Do a final sweep for any remaining import paths
   - Use search functionality to find all references

4. Run comprehensive validation:
   ```bash
   bun check-types
   bun test:run
   bun test --coverage
   bun build
   bun dev:web  # Extensive browser testing
   ```

5. Update documentation:
   - Update any README files
   - Update code comments if necessary

### Validation
- [ ] All acceptance criteria pass
- [ ] All existing tests pass
- [ ] No console errors in browser
- [ ] Build process succeeds
- [ ] Type checking passes without errors
- [ ] Code follows project standards

### Success Criteria
- All components successfully migrated to new structure
- All functionality preserved
- All tests passing
- No regressions introduced
- Documentation updated

### Time Estimate
4-5 hours

## Phase 4: Final Review and QA Gate Update

### Objective
Complete final review and update QA gate decision to PASS status.

### Tasks
1. Final comprehensive testing:
   - End-to-end testing of complete form flow
   - Cross-browser testing if applicable
   - Performance testing

2. Code quality review:
   - Biome linting: `bun lint`
   - Code review of all changes
   - Verify adherence to project standards

3. Update QA documentation:
   - Update risk profile with actual outcomes
   - Update QA gate decision to PASS status
   - Document lessons learned

4. Team communication:
   - Notify team of completion
   - Update any relevant documentation
   - Prepare for knowledge transfer if needed

### Validation
- [ ] Final QA gate decision updated to PASS
- [ ] Risk profile updated with outcomes
- [ ] Team notified of completion
- [ ] Documentation updated

### Success Criteria
- QA gate decision updated to PASS
- All risks properly mitigated
- Team informed of completion
- Documentation complete

### Time Estimate
2-3 hours

## Overall Timeline

| Phase | Duration | Start Date | End Date |
|-------|----------|------------|----------|
| Phase 1: Preparation | 2-3 hours | 2025-08-31 | 2025-08-31 |
| Phase 2a: Step 1 | 3-4 hours | 2025-09-01 | 2025-09-01 |
| Phase 2b: Step 2 | 3-4 hours | 2025-09-02 | 2025-09-02 |
| Phase 2c: Step 3 | 3-4 hours | 2025-09-03 | 2025-09-03 |
| Phase 2d: Step 4 | 3-4 hours | 2025-09-04 | 2025-09-04 |
| Phase 3: Integration | 4-5 hours | 2025-09-05 | 2025-09-05 |
| Phase 4: Final Review | 2-3 hours | 2025-09-06 | 2025-09-06 |

**Total Estimated Time**: 20-26 hours

## Risk Monitoring During Implementation

### Daily Checkpoints
1. **Morning Standup**:
   - Report progress from previous day
   - Identify any blockers or issues
   - Confirm plan for current day

2. **Mid-day Check**:
   - Verify no compilation errors
   - Run quick tests if significant changes made
   - Update task checklist

3. **End of Day Review**:
   - Run full validation suite
   - Commit changes with descriptive messages
   - Update progress documentation

### Escalation Process
1. **Minor Issues** (Risk Score 1-3):
   - Document and continue
   - Mention in next standup

2. **Moderate Issues** (Risk Score 4-6):
   - Document and notify team lead
   - Assess impact on timeline
   - Implement mitigation strategy

3. **Major Issues** (Risk Score 7-9):
   - Stop work immediately
   - Document issue with full details
   - Notify team lead and QA
   - Execute rollback procedure if necessary

## Tools and Commands

### Essential Commands
```bash
# Type checking
bun check-types

# Running tests
bun test:run
bun test --coverage

# Development server
bun dev:web

# Build verification
bun build

# Code quality
bun lint
bun check
```

### Useful Search Patterns
```bash
# Find all import references
grep -r "multi-step" apps/web/src/

# Find all references to specific components
grep -r "CompanyInfo\|BusinessModel\|Initiative\|Sustainability" apps/web/src/

# Find test files
find apps/web/src -name "*.test.*"
```

## Approval

This implementation plan has been reviewed and approved for the multi-step form restructure implementation.

**Approved by**: Quinn (QA Assistant)  
**Date**: 2025-08-30  
**Target Developer**: James (Full Stack Developer)