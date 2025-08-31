# VSME Guru Epics Index

This directory contains all epics for the VSME Guru project, organized according to the BMAD methodology.

## Epic Status

### Active Epics

#### Epic 4.1: Multistep Form System
- **Status:** Active
- **Type:** Brownfield Enhancement
- **File:** [epic-multistep-form-system.md](./epic-multistep-form-system.md)
- **Focus:** Reusable multi-step form architecture for sustainability reporting
- **Stories:** 8 stories planned (8-15 from implementation plan)
- **Dependencies:** Epic 3 (Core UI), existing UI components
- **Current Phase:** Epic creation and story planning

### Planned Epics

#### Epic 1: Production-Ready Authentication
- **Status:** Planned
- **Focus:** User authentication and session management
- **Technology:** Clerk integration
- **Dependencies:** None

#### Epic 2: User Onboarding & Company Profile Management
- **Status:** Planned
- **Focus:** User registration and company profile creation
- **Dependencies:** Epic 1 (Authentication)

#### Epic 3: Dashboard & Core Reporting UI
- **Status:** Planned
- **Focus:** Core application interface and navigation
- **Dependencies:** Epic 2 (User onboarding)

#### Epic 4: General Information & Strategy Module
- **Status:** Planned
- **Focus:** Company information and strategic sustainability data
- **Dependencies:** Epic 3 (Core UI)

#### Epic 5: Environment Module
- **Status:** Planned
- **Focus:** Environmental impact and sustainability metrics
- **Dependencies:** Epic 4 (General Information)

#### Epic 6: Social & Workforce Module
- **Status:** Planned
- **Focus:** Social responsibility and workforce metrics
- **Dependencies:** Epic 5 (Environment)

#### Epic 7: Governance & Business Conduct Module
- **Status:** Planned
- **Focus:** Governance, ethics, and business conduct
- **Dependencies:** Epic 6 (Social & Workforce)

## Epic Management

### BMAD Epic Types

1. **Brownfield Enhancement Epics** (like Epic 4.1)
   - For isolated features or modifications
   - Can be completed in 1-3 stories
   - Follow existing project patterns
   - Minimal architectural changes required

2. **Full PRD/Architecture Epics** (like Epics 1-7)
   - For significant new features or modules
   - Require architectural planning
   - Multiple coordinated stories
   - Significant integration work

### Epic Creation Process

- **Brownfield Epics:** Use `*create-brownfield-epic` command
- **Full Epics:** Use `*create-brownfield-prd` command for comprehensive planning

### Epic to Story Workflow

1. Epic created and validated
2. Stories created using `*create-brownfield-story` command
3. Stories executed incrementally
4. Epic completed when all stories are done

## Current Focus

**Epic 4.1: Multistep Form System** is the current active epic, representing a brownfield enhancement that:

- Builds on existing UI infrastructure
- Follows established patterns and architecture
- Provides immediate value for sustainability reporting
- Sets foundation for future form implementations

## Next Steps

1. **Complete Epic 4.1 Stories:** Execute the 8 remaining stories for the multistep form system
2. **Validate Epic Completion:** Ensure all acceptance criteria are met
3. **Plan Next Epic:** Determine whether to proceed with Epic 1 (Authentication) or Epic 4 (General Information)
4. **Story Creation:** Use BMAD story creation workflow for next epic

## Epic Dependencies Visualization

```
Epic 1 (Auth) → Epic 2 (Onboarding) → Epic 3 (UI) → Epic 4 (General)
                                    ↓                    ↓
                              Epic 4.1 (Forms)      Epic 5 (Environment)
                                                           ↓
Epic 7 (Governance) ← Epic 6 (Social) ← Epic 5 (Environment)
```

**Note:** Epic 4.1 (Multistep Form System) is a parallel enhancement that can be developed alongside Epic 4 (General Information) once Epic 3 (Core UI) is complete. 