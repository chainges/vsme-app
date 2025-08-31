# Documentation

This folder contains comprehensive documentation for the VSME Guru application.

## Contents

### Error Handling Documentation
- **[ERROR_HANDLING_IMPLEMENTATION.md](./ERROR_HANDLING_IMPLEMENTATION.md)** - Comprehensive guide to the error handling and loading states system implemented in the application
- **[ERROR_HANDLING_REVIEW_2024.md](./ERROR_HANDLING_REVIEW_2024.md)** - Review of the implementation against latest Next.js 15 and React 19 best practices

## Related Documentation

### Steering Documents
The `.kiro/steering/` folder contains operational guidelines and conventions:
- **error-handling-conventions.md** - Team conventions for error handling patterns
- **current-state.md** - Current state of the project
- **ui-best-practices.md** - UI development guidelines
- **development.md** - Development workflow and standards

### Specification Documents
The `.kiro/specs/` folder contains feature specifications and requirements.

## Documentation Philosophy

This project follows a **reactive documentation** approach:
- Documentation is updated **after** implementation, not before
- All examples are based on **real, working code**
- Documentation reflects the **current state** of the project
- Patterns are documented only after they've been **tested and proven**

## Contributing to Documentation

When implementing new features:
1. **Implement first** - Build the feature with proper error handling
2. **Document patterns** - Update relevant steering documents with new patterns
3. **Update current state** - Reflect changes in current-state.md
4. **Capture lessons** - Add insights to learning-journal.md

This ensures documentation stays accurate and useful for the development team.