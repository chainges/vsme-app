# Design Document

## Overview

This design outlines a comprehensive, reusable multi-step form system built with TanStack Forms and Zod validation. The architecture prioritizes type safety, reusability, and excellent developer experience while supporting complex data structures including nested objects and dynamic arrays. The system will initially use local storage for persistence and testing, with a clear migration path to MongoDB Atlas.

## Architecture

### Core Architecture Principles

1. **Component Composition**: Modular components that can be composed to create different form configurations
2. **Type Safety**: Full TypeScript integration with Zod schema inference
3. **Data Structure Alignment**: Native support for TanStack Forms' object and array handling patterns
4. **Storage Abstraction**: Pluggable storage layer supporting local storage and MongoDB Atlas
5. **Accessibility First**: WCAG 2.1 AA compliance built into all components

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  GeneralInfoPage  │  OtherFormPages  │  Future Form Pages  │
├─────────────────────────────────────────────────────────────┤
│                  Form Configuration Layer                   │
├─────────────────────────────────────────────────────────────┤
│              Multi-Step Form System Core                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  MultiStepForm  │  │   StepRenderer  │  │ FieldTypes  │ │
│  │   Controller    │  │    Component    │  │  Registry   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    TanStack Forms Layer                     │
├─────────────────────────────────────────────────────────────┤
│                   Validation Layer (Zod)                   │
├─────────────────────────────────────────────────────────────┤
│                    Storage Abstraction                      │
│  ┌─────────────────┐              ┌─────────────────────┐   │
│  │  LocalStorage   │              │   MongoDB Atlas     │   │
│  │    Provider     │              │     Provider        │   │
│  └─────────────────┘              └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Core Form Configuration Interface

```typescript
interface MultiStepFormConfig<T = any> {
  id: string
  title: string
  description?: string
  steps: FormStep<T>[]
  onSubmit: (data: T) => Promise<void> | void
  onSave?: (data: Partial<T>) => Promise<void> | void
  storage?: StorageProvider
  validation?: {
    mode: 'onChange' | 'onBlur' | 'onSubmit'
    reValidateMode: 'onChange' | 'onBlur'
  }
}

interface FormStep<T = any> {
  id: string
  title: string
  description?: string
  schema: z.ZodSchema<any>
  fields: FieldDefinition[]
  conditionalLogic?: ConditionalRule[]
}

interface FieldDefinition {
  name: string
  type: FieldType
  label: string
  placeholder?: string
  required?: boolean
  validation?: z.ZodSchema<any>
  conditionalDisplay?: ConditionalRule
  fieldProps?: Record<string, any>
}
```

### 2. Sustainability Initiative Types

The system will use predefined initiative categories and labels:

```typescript
// Initiative types
type InitiativeType = 
  | 'WorkforceDevelopment'
  | 'Biodiversity'
  | 'ClimateAction'
  | 'WasteReduction'
  | 'EnergyEfficiency'
  | 'WaterConservation'
  | 'CommunityEngagement'
  | 'SupplyChainSustainability'

// Initiative categories for UI grouping
export const INITIATIVE_CATEGORIES = {
  environmental: [
    'Biodiversity',
    'ClimateAction',
    'WasteReduction',
    'EnergyEfficiency',
    'WaterConservation',
  ] as InitiativeType[],
  social: [
    'WorkforceDevelopment',
    'CommunityEngagement',
    'SupplyChainSustainability',
  ] as InitiativeType[],
} as const

// Initiative display names
export const INITIATIVE_LABELS: Record<InitiativeType, string> = {
  WorkforceDevelopment: 'Workforce Development',
  Biodiversity: 'Biodiversity Conservation',
  ClimateAction: 'Climate Action',
  WasteReduction: 'Waste Reduction',
  EnergyEfficiency: 'Energy Efficiency',
  WaterConservation: 'Water Conservation',
  CommunityEngagement: 'Community Engagement',
  SupplyChainSustainability: 'Supply Chain Sustainability',
}
```

### 3. TanStack Forms Integration

The system will leverage TanStack Forms' native capabilities for handling complex data structures:

```typescript
// Organization data structure following TanStack Forms patterns
interface OrganizationFormData {
  // Step 1: Basic organization info
  organization: {
    name: string
    number: string
    naceCode: string
    industry: string
    revenue: number
    employeeCount: number
    contact: {
      name: string
      email: string
    }
  }
  
  // Step 2: Business model and subsidiaries
  businessModel: {
    description: string
    hasSubsidiaries: boolean
    subsidiaries: Array<{
      name: string
      organizationNumber: string
      address: string
    }>
  }
  
  // Step 3: Sustainability initiatives
  sustainability: {
    initiatives: Array<{
      type: InitiativeType
      selected: boolean
      description?: string
      goal?: string
      responsiblePerson?: string
    }>
  }
}
}


```

### 4. Field Type System

```typescript
type FieldType = 
  | 'text'
  | 'email' 
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'fieldArray'
  | 'conditionalGroup'

interface FieldTypeRenderer {
  type: FieldType
  component: React.ComponentType<FieldProps>
  validator?: (value: any) => boolean
}

interface FieldProps {
  field: FieldApi<any, any, any, any>
  definition: FieldDefinition
  disabled?: boolean
}
```

### 5. Storage Abstraction Layer

```typescript
interface StorageProvider {
  save(key: string, data: any): Promise<void>
  load(key: string): Promise<any | null>
  clear(key: string): Promise<void>
  exists(key: string): Promise<boolean>
}

class LocalStorageProvider implements StorageProvider {
  async save(key: string, data: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
      version: '1.0'
    }))
  }
  
  async load(key: string): Promise<any | null> {
    const stored = localStorage.getItem(key)
    if (!stored) return null
    
    try {
      const parsed = JSON.parse(stored)
      return parsed.data
    } catch {
      return null
    }
  }
  
  async clear(key: string): Promise<void> {
    localStorage.removeItem(key)
  }
  
  async exists(key: string): Promise<boolean> {
    return localStorage.getItem(key) !== null
  }
}

class MongoDBStorageProvider implements StorageProvider {
  // Future implementation for MongoDB Atlas integration
  // Will use the same interface for seamless migration
}
```

## Data Models

### TanStack Forms Field Array Handling

For dynamic arrays (subsidiaries, initiatives), the system will use TanStack Forms' field array capabilities:

```typescript
// Subsidiary management using TanStack Forms field arrays
<form.Field name="businessModel.subsidiaries" mode="array">
  {(field) => (
    <div>
      {field.state.value.map((_, index) => (
        <div key={index}>
          <form.Field name={`businessModel.subsidiaries[${index}].name`}>
            {(subField) => (
              <Input
                value={subField.state.value}
                onChange={(e) => subField.handleChange(e.target.value)}
                placeholder="Subsidiary name"
              />
            )}
          </form.Field>
          
          <form.Field name={`businessModel.subsidiaries[${index}].organizationNumber`}>
            {(subField) => (
              <Input
                value={subField.state.value}
                onChange={(e) => subField.handleChange(e.target.value)}
                placeholder="Organization number"
              />
            )}
          </form.Field>
          
          <Button 
            type="button"
            onClick={() => field.removeValue(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      
      <Button 
        type="button"
        onClick={() => field.pushValue({ name: '', organizationNumber: '', address: '' })}
      >
        Add Subsidiary
      </Button>
    </div>
  )}
</form.Field>
```

### Conditional Field Rendering

```typescript
// Conditional display based on other field values
<form.Field name="businessModel.hasSubsidiaries">
  {(field) => (
    <div>
      <label>
        <input
          type="checkbox"
          checked={field.state.value}
          onChange={(e) => field.handleChange(e.target.checked)}
        />
        Does your organization have subsidiaries?
      </label>
    </div>
  )}
</form.Field>

{/* Conditional subsidiaries section */}
<form.Subscribe
  selector={(state) => state.values.businessModel?.hasSubsidiaries}
>
  {(hasSubsidiaries) => 
    hasSubsidiaries && (
      <form.Field name="businessModel.subsidiaries" mode="array">
        {/* Subsidiary fields */}
      </form.Field>
    )
  }
</form.Subscribe>
```

## Error Handling

### Validation Strategy

1. **Real-time Validation**: Using TanStack Forms' `onChange` validators with Zod schemas
2. **Step-level Validation**: Prevent navigation until current step is valid
3. **Cross-field Validation**: Support for validation rules that depend on multiple fields
4. **Async Validation**: Debounced validation for server-side checks (future)

```typescript
// Zod schema with TanStack Forms integration
const organizationSchema = z.object({
  organization: z.object({
    name: z.string().min(2, 'Organization name must be at least 2 characters'),
    number: z.string().min(1, 'Organization number is required'),
    naceCode: z.string().min(1, 'NACE code is required'),
    industry: z.string().min(1, 'Industry is required'),
    revenue: z.number().positive('Revenue must be positive'),
    employeeCount: z.number().int().positive('Employee count must be a positive integer'),
    contact: z.object({
      name: z.string().min(2, 'Contact name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email address')
    })
  })
})

// Usage in form field
<form.Field
  name="organization.name"
  validators={{
    onChange: organizationSchema.shape.organization.shape.name
  }}
>
  {(field) => (
    <div>
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.errors.map((error) => (
        <span key={error} className="text-destructive text-sm">
          {error}
        </span>
      ))}
    </div>
  )}
</form.Field>
```

## Testing Strategy

### Unit Testing Approach

1. **Component Testing**: Test individual field components and form steps
2. **Integration Testing**: Test complete form flows with mock data
3. **Validation Testing**: Test Zod schema validation rules
4. **Storage Testing**: Test local storage and future MongoDB integration
5. **Accessibility Testing**: Automated accessibility testing with jest-axe

### Test Structure

```typescript
// Example test structure
describe('MultiStepForm', () => {
  describe('Organization Step', () => {
    it('should validate organization name field', () => {
      // Test field validation
    })
    
    it('should save progress to local storage', () => {
      // Test persistence
    })
    
    it('should restore data from local storage', () => {
      // Test data restoration
    })
  })
  
  describe('Subsidiaries Step', () => {
    it('should show subsidiary fields when hasSubsidiaries is true', () => {
      // Test conditional rendering
    })
    
    it('should add and remove subsidiaries dynamically', () => {
      // Test field array operations
    })
  })
})
```

## File Structure

```
apps/web/src/
├── components/
│   ├── forms/
│   │   ├── multi-step/
│   │   │   ├── MultiStepForm.tsx           # Main form controller
│   │   │   ├── StepRenderer.tsx            # Individual step renderer
│   │   │   ├── ProgressIndicator.tsx       # Progress bar and step indicators
│   │   │   ├── NavigationControls.tsx      # Next/Previous buttons
│   │   │   └── index.ts                    # Exports
│   │   ├── fields/
│   │   │   ├── TextField.tsx               # Text input field
│   │   │   ├── TextareaField.tsx           # Textarea field
│   │   │   ├── SelectField.tsx             # Select dropdown field
│   │   │   ├── CheckboxField.tsx           # Checkbox field
│   │   │   ├── FieldArray.tsx              # Dynamic array field
│   │   │   ├── ConditionalGroup.tsx        # Conditional field group
│   │   │   └── index.ts                    # Field registry
│   │   └── configurations/
│   │       ├── sustainability-form.config.ts  # Sustainability form config
│   │       └── index.ts                    # Config exports
│   └── ui/                                 # Existing shadcn/ui components
├── lib/
│   ├── forms/
│   │   ├── storage/
│   │   │   ├── LocalStorageProvider.ts     # Local storage implementation
│   │   │   ├── MongoDBStorageProvider.ts   # Future MongoDB implementation
│   │   │   └── index.ts                    # Storage exports
│   │   ├── validation/
│   │   │   ├── sustainability-schemas.ts   # Zod schemas for sustainability form
│   │   │   └── index.ts                    # Schema exports
│   │   └── types/
│   │       ├── form-types.ts               # Form configuration types
│   │       ├── field-types.ts              # Field definition types
│   │       └── index.ts                    # Type exports
│   └── utils.ts                            # Existing utilities
└── app/
    └── (SignedIn)/
        └── generalinfo/
            └── page.tsx                    # Updated general info page
```

## Migration Strategy

### Phase 1: Local Storage Implementation
- Build core multi-step form system with local storage
- Implement sustainability form configuration
- Add comprehensive testing
- Ensure data persistence for testing (don't clear on submit)

### Phase 2: MongoDB Atlas Integration
- Implement MongoDBStorageProvider
- Add authentication integration for user-specific data
- Implement data synchronization between local and remote storage
- Add conflict resolution for concurrent edits

### Phase 3: Advanced Features
- Real-time collaboration
- Form versioning and history
- Advanced analytics and reporting
- Performance optimizations

## Performance Considerations

1. **Lazy Loading**: Load form steps and field components on demand
2. **Memoization**: Use React.memo for expensive field components
3. **Debounced Validation**: Prevent excessive validation calls
4. **Virtual Scrolling**: For large field arrays (future enhancement)
5. **Bundle Splitting**: Separate form system into its own chunk

## Accessibility Implementation

1. **ARIA Labels**: Comprehensive labeling for all form elements
2. **Focus Management**: Proper focus handling during navigation
3. **Screen Reader Support**: Announcements for dynamic content changes
4. **Keyboard Navigation**: Full keyboard accessibility
5. **Error Announcements**: Accessible error messaging
6. **Progress Indication**: Screen reader accessible progress updates

This design provides a solid foundation for building a reusable, type-safe multi-step form system that aligns with TanStack Forms best practices while supporting complex data structures and future MongoDB integration.