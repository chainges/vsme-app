# Multi-Step Form System Foundation

This directory contains the core foundation for the multi-step form system built with TanStack Forms and Zod validation.

## Structure

```
src/lib/forms/
├── types/
│   ├── form-types.ts           # Core form configuration types
│   ├── field-types.ts          # Field definition and component types
│   ├── sustainability-types.ts # Sustainability form specific types
│   └── index.ts               # Type exports
├── field-registry.ts          # Field type registry implementation
├── utils.ts                   # Form utility functions
├── test-config.ts             # Test configuration for type verification
├── dependency-check.ts        # Dependency availability check
└── README.md                  # This file
```

## Key Types

### Core Form Types
- `MultiStepFormConfig<T>` - Main form configuration interface
- `FormStep<T>` - Individual step configuration
- `FormState<T>` - Form state management
- `StorageProvider` - Data persistence interface

### Field Types
- `FieldDefinition` - Field configuration
- `FieldProps` - Props for field components
- `FieldType` - Supported field types
- `ConditionalRule` - Conditional field rendering

### Sustainability Types
- `OrganizationFormData` - Complete form data structure
- `InitiativeType` - Sustainability initiative types
- `INITIATIVE_CATEGORIES` - Initiative groupings
- `INITIATIVE_LABELS` - Display names

## Dependencies

- ✅ `@tanstack/react-form` - Form state management
- ✅ `zod` - Runtime type validation
- ✅ `framer-motion` - Animations

## TanStack Forms Alignment

The type system is designed to work seamlessly with TanStack Forms patterns:

- Object and array handling through nested field names
- Field API integration with proper typing
- Validation schema integration with Zod
- Conditional rendering support
- Dynamic field arrays for complex data structures

## Next Steps

This foundation provides the type system and utilities needed for:
1. Storage abstraction layer implementation
2. Zod validation schemas
3. Core field components
4. Multi-step form controller
5. Progress indicators and navigation

All types are fully compatible with TanStack Forms and provide excellent TypeScript intellisense and error checking.