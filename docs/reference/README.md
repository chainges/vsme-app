# Reference Documentation Index

This directory contains essential reference documentation for the My Better T App project. All documents in this folder provide authoritative guidance on coding standards, architecture, technology stack, and development practices.

## Documents

### Core Reference Documents

- **[accessibility.md](./accessibility.md)** - Comprehensive accessibility guidelines and requirements for WCAG 2.1 AA compliance, including HTML elements, ARIA attributes, images, media, interactive elements, keyboard navigation, semantic HTML, and form accessibility.

- **[current-state.md](./current-state.md)** - Current state audit documenting what actually exists in the codebase versus what is planned, including frontend/backend components, dependencies, and missing features.

- **[api-contract.md](./api-contract.md)** - API contract specifications including endpoint definitions, request/response formats, authentication requirements, error handling patterns, and example implementations for the backend API.

- **[architecture.md](./architecture.md)** - High-level architectural overview of the project including frontend/backend structure, component organization, data flow patterns, performance considerations, and deployment architecture.

- **[coding-standards.md](./coding-standards.md)** - Complete coding standards and best practices covering core development principles, accessibility requirements, code complexity rules, React/JSX patterns, TypeScript best practices, style guidelines, and testing requirements.

- **[development-workflow.md](./development-workflow.md)** - Development workflow guidelines consolidating project standards, implementation patterns, code quality requirements, and best practices for consistent development practices.

- **[error-handling.md](./error-handling.md)** - Error handling patterns and conventions including error boundary implementation, error display components, async state management, and API error handling strategies.

- **[tech-stack.md](./tech-stack.md)** - Technology stack reference documenting all technologies, versions, dependencies, build systems, frontend/backend stacks, database configurations, UI components, code quality tools, and development commands.

### Testing Documentation

- **[testing-quick-start-guide.md](./testing-quick-start-guide.md)** - Rapid onboarding guide for writing tests with copy-paste patterns, covering component testing, utility testing, hook testing, API testing, and integration testing.

- **[tdd-process-guide.md](./tdd-process-guide.md)** - Complete Test-Driven Development methodology guide with RED-GREEN-REFACTOR cycles, test patterns, quality gates, performance metrics, and implementation examples.

- **[testing-patterns/](./testing-patterns/)** - Pattern library with copy-paste templates organized by category:
  - **[Component Patterns](./testing-patterns/component/)** - React component testing with user interactions and accessibility validation
    - [basic-component.md](./testing-patterns/component/basic-component.md) - Testing basic React components with props and user interactions
  - **[Utility Patterns](./testing-patterns/utility/)** - Pure function and business logic testing
    - [pure-function.md](./testing-patterns/utility/pure-function.md) - Testing pure functions with various input scenarios
  - **[Hook Patterns](./testing-patterns/hook/)** - Custom React hook testing with state management and side effects
    - [basic-hook.md](./testing-patterns/hook/basic-hook.md) - Testing basic React hooks with state and effects
  - **[API Patterns](./testing-patterns/api/)** - API endpoint testing with MSW and authentication patterns
    - [post-endpoint.md](./testing-patterns/api/post-endpoint.md) - Testing POST endpoints with request validation and response handling
  - **[Integration Patterns](./testing-patterns/integration/)** - Multi-component and system integration testing

### Epic Documentation

- **[epic-10-completion-notes.md](./epic-10-completion-notes.md)** - Comprehensive documentation of Epic 10 implementation including TDD strategy, testing infrastructure, pattern library, and quality improvements.

- **[epic-10-testing-strategy-assessment.md](./epic-10-testing-strategy-assessment.md)** - Quality assessment and strategic evaluation of the Epic 10 testing strategy implementation with performance metrics and future recommendations.

## Usage Guidelines

These reference documents should be consulted when:
- Implementing new features or components
- Onboarding new team members
- Making architectural decisions
- Writing or reviewing code
- Setting up development environments
- Troubleshooting technical issues

All documents follow BMAD principles of simplicity, correctness, lean content, and accuracy. They are maintained as living documentation that evolves with the project.

## Maintenance

This index is automatically maintained by the Documentation Specialist. When adding new documents to this directory, please update this README to include a brief description of the new document's purpose and contents.