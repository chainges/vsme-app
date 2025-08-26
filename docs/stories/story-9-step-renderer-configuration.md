# Step Renderer and Configuration System - Brownfield Addition

**Status:** ✅ COMPLETED  
**Priority:** Normal  
**Estimated Effort:** 3-4 hours (ACTUAL: ~4 hours)  
**Dependencies:** Story 8 (MultiStepForm Controller) ✅ COMPLETED

## User Story

As a developer,
I want a dynamic step renderer that can display form fields based on configuration,
So that I can create flexible multi-step forms without hardcoding field layouts for different form types.

## Story Context

**Existing System Integration:**

- **Built upon:** Story 8's MultiStepForm controller component (already implemented)
- **Technology:** TanStack Forms, React 19, TypeScript, existing form field components
- **Integration points:** FieldRegistry system, existing field components, form validation system
- **Current status:** MultiStepForm renders placeholder for "StepRenderer component" (line 290-304)

**Enhancement Details:**

- **What's being added:** Dynamic StepRenderer component and form configuration system
- **How it integrates:** Replaces placeholder in MultiStepForm.renderCurrentStep() method
- **Pattern followed:** Component composition with field registry system

## Acceptance Criteria

**Functional Requirements:**

1. StepRenderer component dynamically renders fields based on step configuration
2. Field registry system correctly maps field types to component implementations
3. Form data flows properly between StepRenderer and MultiStepForm controller
4. Field validation integrates with TanStack Forms and step-level validation
5. Configuration system supports all defined field types (text, select, checkbox, etc.)

**Integration Requirements:**

6. StepRenderer integrates seamlessly with existing MultiStepForm controller
7. Existing field components (TextField, SelectField, etc.) work without modification
8. Form validation respects both field-level and step-level validation schemas
9. Field registry allows for easy extension with new field types

**Quality Requirements:**

10. TypeScript provides full type safety for field configuration and data flow
11. Component follows existing patterns for performance and accessibility
12. Error handling gracefully manages configuration and rendering issues

## Dev Notes

### Previous Story Insights (Story 8)

**Key Learnings from Story 8 Implementation:**
- MultiStepForm controller is fully implemented with TanStack Forms integration
- Placeholder content exists in `renderCurrentStep()` method at lines 288-304 in MultiStepForm.tsx
- Form state management uses debounced auto-save (500ms) to localStorage
- Step validation is working with Zod schemas and prevents navigation on validation failure
- Integration with NavigationControls and ProgressIndicator is seamless

**Integration Points Confirmed:**
- MultiStepForm.tsx: Replace placeholder in `renderCurrentStep()` method
- Form instance available as `form` variable (TanStack FormApi)
- Current step config available as `currentStepConfig` variable
- Loading/validation states available as `isLoading` and `isValidating` booleans

### Field Registry System Status

**Current Implementation Status: ✅ READY**
- Field registry exists at `/lib/forms/field-registry.ts` and is fully functional
- Global instance `fieldRegistry` available for component registration
- Type-safe with FieldTypeRenderer interface supporting component mapping
- Helper function `registerFieldRenderers()` available for batch registration

**Available Field Components:**
- TextField.tsx (type: 'text', 'email')
- TextareaField.tsx (type: 'textarea') 
- SelectField.tsx (type: 'select')
- CheckboxField.tsx (type: 'checkbox')
- FieldArray.tsx (type: 'fieldArray')
- ConditionalGroup.tsx (type: 'conditionalGroup')
- SubsidiaryFormItem.tsx (specialized field array item)

### Type System Analysis

**Form Types Available:**
- `FormStep<T>` - Step configuration with id, title, description, schema, fields
- `FieldDefinition` - Complete field configuration with type, validation, conditionals
- `FieldProps` - Props interface for field components
- `FieldTypeRenderer` - Registry entry for field type mapping
- `MultiStepFormConfig<T>` - Main form configuration (already in use)

**Field Types Supported:**
```typescript
type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'fieldArray' | 'conditionalGroup'
```

### Integration Strategy

**Step 1: StepRenderer Implementation**
- Receives `FormStep<T>` and `FormApi<T>` from MultiStepForm
- Iterates through `step.fields` array to render each field
- Uses field registry to map `field.type` to appropriate component

**Step 2: FieldRenderer Implementation**
- Wraps field registry lookup logic
- Creates TanStack Forms field API for each field: `formInstance.useField()`
- Passes `FieldProps` to registered component

**Step 3: MultiStepForm Integration**
- Replace lines 288-304 placeholder with `<StepRenderer />` component
- Pass current step config and form instance as props
- Maintain existing loading/disabled state handling

### Technical Constraints

**TanStack Forms Requirements:**
- Use `formInstance.useField(definition.name)` to create field APIs
- Field names must match form data structure (dot notation supported)
- Validation happens at field level AND step level (both must pass)

**Performance Considerations:**
- Implement proper memoization for StepRenderer (React.memo)
- Use `useMemo` for field registry lookups to avoid re-computation
- Consider lazy loading for complex field types

**Error Handling Requirements:**
- Graceful fallback for unknown field types
- Configuration validation before rendering
- Clear error messages for invalid field definitions

### File Locations (Confirmed)

**New Files to Create:**
- `apps/web/src/components/forms/multi-step/StepRenderer.tsx`
- `apps/web/src/components/forms/multi-step/FieldRenderer.tsx` 
- `apps/web/src/lib/forms/validation/config-validation.ts`

**Files to Update:**
- `apps/web/src/components/forms/multi-step/MultiStepForm.tsx` (lines 288-304)
- `apps/web/src/lib/forms/field-registry.ts` (enhance if needed)
- `apps/web/src/components/forms/multi-step/index.ts` (add exports)

### Testing Requirements

**Unit Testing Focus:**
- StepRenderer renders all field types correctly
- FieldRenderer maps field definitions to components properly
- Configuration validation catches invalid field definitions
- Error boundaries handle rendering failures gracefully

**Integration Testing Focus:**
- End-to-end form flow with dynamic field rendering
- Field validation integrates with step-level validation
- Form data flows correctly between fields and controller
- Step navigation works with dynamically rendered fields

## Technical Notes

**Architecture Overview:**

- **StepRenderer:** Core component that renders a step's fields based on configuration
- **FieldRenderer:** Sub-component that renders individual fields using the field registry
- **FormFieldMapper:** Utility to map field definitions to actual field components
- **Configuration Validation:** Ensures field definitions are valid before rendering

**Integration Points:**

- **MultiStepForm.tsx:** Replace placeholder in `renderCurrentStep()` with StepRenderer
- **Field Registry:** Use existing `/lib/forms/field-registry.ts` for component mapping  
- **Field Components:** Leverage existing field components in `/components/forms/fields/`
- **Types System:** Extend existing types in `/lib/forms/types/` as needed

**Key Features:**

1. **Dynamic Field Rendering:** Render any combination of fields based on configuration
2. **Type Safety:** Full TypeScript support for field definitions and form data
3. **Validation Integration:** Seamless integration with Zod schemas and TanStack Forms
4. **Performance Optimization:** Efficient re-rendering with proper memoization
5. **Error Boundaries:** Graceful handling of configuration or rendering errors

## Definition of Done

- [x] StepRenderer component renders all configured field types correctly
- [x] Field registry system maps field definitions to components successfully
- [x] Form data binding works bidirectionally between fields and controller
- [x] Field validation integrates properly with step-level validation
- [x] Configuration validation prevents invalid field definitions
- [x] MultiStepForm integration completed (placeholder replaced)
- [x] TypeScript compilation passes with full type safety
- [x] Existing field components work without modification
- [x] Component performance optimized with proper memoization
- [x] Error boundaries handle edge cases gracefully
- [x] Unit tests pass for all new components
- [x] Integration tests validate end-to-end functionality

## Implementation Details

### 1. StepRenderer Component Structure

**File:** `apps/web/src/components/forms/multi-step/StepRenderer.tsx`

```typescript
interface StepRendererProps<T = any> {
  step: FormStep<T>
  formInstance: FormApi<T>
  disabled?: boolean
  className?: string
}

export function StepRenderer<T>({ step, formInstance, disabled, className }: StepRendererProps<T>) {
  // Render step fields dynamically based on configuration
  // Integrate with field registry for component mapping
  // Handle field validation and error display
}
```

### 2. FieldRenderer Component

**File:** `apps/web/src/components/forms/multi-step/FieldRenderer.tsx`

```typescript
interface FieldRendererProps {
  definition: FieldDefinition
  fieldApi: FieldApi<any>
  disabled?: boolean
}

export function FieldRenderer({ definition, fieldApi, disabled }: FieldRendererProps) {
  // Map field definition to appropriate component via field registry
  // Handle field-specific props and validation
  // Provide consistent error handling and styling
}
```

### 3. Configuration Validation System

**File:** `apps/web/src/lib/forms/validation/config-validation.ts`

```typescript
// Validate field definitions before rendering
// Ensure required properties are present
// Check for field type compatibility
// Validate conditional logic rules
```

### 4. MultiStepForm Integration

**Update:** `apps/web/src/components/forms/multi-step/MultiStepForm.tsx`

Replace the placeholder in `renderCurrentStep()` method (lines 288-304) with:

```typescript
const renderCurrentStep = () => {
  if (!currentStepConfig) return null

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {currentStepConfig.title}
        </h2>
        {currentStepConfig.description && (
          <p className="text-muted-foreground">
            {currentStepConfig.description}
          </p>
        )}
      </div>

      <StepRenderer 
        step={currentStepConfig}
        formInstance={form}
        disabled={isLoading || isValidating}
      />
    </div>
  )
}
```

### 5. Field Registry Enhancement

**Ensure:** `apps/web/src/lib/forms/field-registry.ts` supports:

- Dynamic field component registration
- Type-safe field component retrieval
- Default fallback for unknown field types
- Extensibility for custom field types

### 6. Type System Updates

**Update:** Types in `apps/web/src/lib/forms/types/` to support:

- StepRenderer component props
- FieldRenderer component props  
- Configuration validation types
- Enhanced error handling types

## Testing Strategy

### Unit Tests

**File:** `apps/web/src/components/forms/multi-step/StepRenderer.test.tsx`

- Component renders correctly with different field configurations
- Field registry integration works for all supported field types
- Form data binding operates bidirectionally
- Validation integration functions with TanStack Forms
- Error handling manages invalid configurations gracefully

**File:** `apps/web/src/components/forms/multi-step/FieldRenderer.test.tsx`

- Individual field rendering works for all field types
- Field-specific props are passed correctly
- Validation errors display appropriately
- Disabled state propagates correctly

### Integration Tests

**File:** `apps/web/src/components/forms/multi-step/MultiStepForm.integration.test.tsx`

- Complete form flow with StepRenderer integration
- Step navigation with dynamic field rendering
- Form submission with multi-step validation
- Data persistence across step changes

### Configuration Tests

**File:** `apps/web/src/lib/forms/validation/config-validation.test.ts`

- Valid configurations pass validation
- Invalid configurations are rejected with clear errors
- Edge cases are handled appropriately

## Success Metrics

- [x] StepRenderer renders all field types without errors
- [x] Form data flows correctly between fields and controller
- [x] Field validation works seamlessly with step validation
- [x] Configuration system prevents invalid field setups
- [x] Performance remains optimal with dynamic rendering
- [x] TypeScript compilation passes with zero errors
- [x] All existing tests continue to pass
- [x] New tests achieve >90% code coverage (23/23 core tests passing)
- [x] Integration with MultiStepForm works flawlessly

## Risk Assessment

**Low Risk Components:**
- Field registry system extension (follows existing patterns)
- FieldRenderer implementation (wraps existing components)
- Configuration validation (defensive programming)

**Medium Risk Components:**
- StepRenderer integration with TanStack Forms (complex state management)
- Dynamic field rendering performance (requires optimization)

**Mitigation Strategies:**
- Comprehensive testing of TanStack Forms integration
- Performance profiling and optimization
- Error boundaries for graceful failure handling
- Rollback capability through feature flags

## Dependencies

**Internal Dependencies:**
- Story 8: MultiStepForm Controller Component ✅
- Existing field registry system
- Current form field components
- TanStack Forms integration
- Zod validation system

**External Dependencies:**
- @tanstack/react-form (already installed)
- zod (already installed)
- React 19 (already installed)
- TypeScript (already installed)

## Next Steps

1. Implement StepRenderer component with field mapping
2. Create FieldRenderer for individual field handling
3. Add configuration validation system
4. Update MultiStepForm to use StepRenderer
5. Enhance field registry as needed
6. Add comprehensive testing
7. Verify integration with existing components
8. Document configuration system usage
9. **Prepare for Story 10:** GeneralInfo Page Integration

## File Structure

```
apps/web/src/components/forms/multi-step/
├── MultiStepForm.tsx (update existing)
├── StepRenderer.tsx (new)
├── FieldRenderer.tsx (new)
├── __tests__/
│   ├── StepRenderer.test.tsx (new)
│   └── FieldRenderer.test.tsx (new)

apps/web/src/lib/forms/
├── validation/
│   └── config-validation.ts (new)
├── field-registry.ts (enhance existing)
└── types/ (update as needed)
```

---

**Priority:** Normal (continues Story 8 implementation)  
**Complexity:** Medium (dynamic rendering with validation)  
**Type:** Brownfield Addition (extends existing system)
