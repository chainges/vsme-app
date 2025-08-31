# Testing Pattern Library

**🎯 Your comprehensive collection of TDD-first testing patterns**

This library provides battle-tested, copy-paste testing patterns that follow proper TDD methodology established in our [TDD Process Guide](../tdd-process-guide.md).

## Quick Navigation

- **Getting Started**: [Testing Quick Start Guide](../testing-quick-start-guide.md) (15-minute setup)
- **Methodology**: [TDD Process Guide](../tdd-process-guide.md) (RED-GREEN-REFACTOR workflow)
- **Patterns**: This library (reusable implementations)

## Pattern Categories

### 🧩 [Component Patterns](./component/)
TDD-first React component testing with user interactions and accessibility validation
- [Basic Component Pattern](./component/basic-component.md)
- [Component with Props Pattern](./component/component-with-props.md)
- [Form Component Pattern](./component/form-component.md)
- [Async Component Pattern](./component/async-component.md)
- [Provider Component Pattern](./component/provider-component.md)

### ⚙️ [Utility Patterns](./utility/)
Pure function and business logic testing with TDD methodology
- [Pure Function Pattern](./utility/pure-function.md)
- [Error Handling Pattern](./utility/error-handling.md)
- [Validation Schema Pattern](./utility/validation-schema.md)
- [Class-based Utility Pattern](./utility/class-utility.md)
- [Performance Testing Pattern](./utility/performance-testing.md)

### 🎣 [Hook Patterns](./hook/)
Custom React hook testing with state management and side effects
- [Basic Hook Pattern](./hook/basic-hook.md)
- [State Management Hook Pattern](./hook/state-management.md)
- [Async Hook Pattern](./hook/async-hook.md)
- [Context Hook Pattern](./hook/context-hook.md)
- [Effect Hook Pattern](./hook/effect-hook.md)

### 🌐 [API Patterns](./api/)
API endpoint testing with MSW and authentication patterns
- [GET Endpoint Pattern](./api/get-endpoint.md)
- [POST Endpoint Pattern](./api/post-endpoint.md)
- [Authentication Pattern](./api/authentication.md)
- [Error Response Pattern](./api/error-response.md)
- [External API Pattern](./api/external-api.md)

### 🔗 [Integration Patterns](./integration/)
Multi-component and system integration testing
- [Component Integration Pattern](./integration/component-integration.md)
- [API Integration Pattern](./integration/api-integration.md)
- [Database Integration Pattern](./integration/database-integration.md)
- [Authentication Flow Pattern](./integration/auth-flow.md)
- [E2E Workflow Pattern](./integration/e2e-workflow.md)

## Pattern Structure

Each pattern follows the same structure for consistency:

```markdown
# Pattern Name

## 🎯 Purpose
What this pattern tests and when to use it

## 🔴 TDD Approach
How to apply RED-GREEN-REFACTOR cycle

## 📋 Template
Copy-paste code template

## 💡 Real Example
Complete working example

## 🧰 Integration
How it works with project infrastructure

## 🚨 Common Issues
Troubleshooting and best practices
```

## BMAD Framework Integration

### Test Level Mapping
- **Unit Tests (P0)**: Utility and Hook patterns primarily
- **Integration Tests (P1)**: Component and API patterns primarily  
- **E2E Tests (P2)**: Integration patterns for critical flows

### Priority Guidelines
- **P0 (Must Test)**: Core business logic, authentication, data validation
- **P1 (Should Test)**: User interactions, API contracts, error handling
- **P2 (Nice to Test)**: Edge cases, performance scenarios
- **P3 (Test if Time)**: Advanced accessibility, complex integrations

### Test ID Format
All patterns use: `{EPIC}.{STORY}-{LEVEL}-{SEQ}`

Example:
```tsx
describe('10.3-UNIT-001: UserValidator email validation', () => {
  // Pattern implementation
})
```

## Infrastructure Integration

### Current Setup
- **Vitest 3.2.4**: Test runner with watch mode
- **@testing-library/react**: Component testing utilities
- **jsdom**: Browser environment simulation
- **MSW**: API mocking capabilities
- **Comprehensive mocks**: ResizeObserver, IntersectionObserver, localStorage

### Path Aliases
```tsx
import { UserProfile } from '@/components/UserProfile'
import { validateEmail } from '@/utils/validation' 
import { useAuth } from '@/hooks/useAuth'
```

### Test Commands
```bash
# TDD workflow (recommended)
bun test                    # Watch mode for active development
bun test PatternName.test.* # Focus on specific pattern

# Validation
bun test:run               # Full test suite
bun test:ui                # Visual test debugging  
bun test --coverage        # Coverage analysis
```

## Quality Standards

### Pattern Requirements
- ✅ **TDD Methodology**: Each pattern demonstrates RED-GREEN-REFACTOR cycle
- ✅ **Copy-Paste Ready**: Templates work immediately with minimal customization  
- ✅ **Real Examples**: Working code from actual project scenarios
- ✅ **Integration**: Works with existing mocking and configuration
- ✅ **Best Practices**: Follows accessibility, performance, and maintainability standards

### Coverage Expectations
- **Unit patterns**: Aim for >90% coverage
- **Integration patterns**: Aim for >80% coverage
- **E2E patterns**: Focus on critical path coverage

## Contributing to Pattern Library

### Adding New Patterns
1. Follow existing pattern structure
2. Include TDD workflow examples
3. Test with real implementation
4. Update this index
5. Cross-reference from relevant documentation

### Pattern Naming Convention
```
[type]-[purpose].md

Examples:
- component-form-validation.md
- utility-data-transformation.md
- hook-async-state-management.md
- api-authentication-flow.md
- integration-user-workflow.md
```

## Related Documentation

- [Testing Quick Start Guide](../testing-quick-start-guide.md) - Get started in 15 minutes
- [TDD Process Guide](../tdd-process-guide.md) - Complete TDD methodology
- [Coding Standards](../coding-standards.md) - Code quality guidelines
- [Test Levels Framework](../../.bmad-core/data/test-levels-framework.md) - BMAD testing approach
- [Test Priority Matrix](../../.bmad-core/data/test-priorities-matrix.md) - Priority guidelines

---

**🎉 Start with any pattern above, or use the [Quick Start Guide](../testing-quick-start-guide.md) if you're new to testing!**
