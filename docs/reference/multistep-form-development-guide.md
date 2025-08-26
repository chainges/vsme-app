# MultiStepForm Development Guide

**📚 DEVELOPER REFERENCE - Form Infrastructure & Development Patterns**

_This guide explains how to leverage the MultiStepForm infrastructure for rapid development of new information capture forms._

---

## 🚀 **OVERVIEW: FROM DAYS TO HOURS**

### **Strategic Value**

The MultiStepForm infrastructure transforms form development from a **complex engineering task** into a **simple configuration exercise**.

| Aspect | Before Infrastructure | With Infrastructure |
|--------|----------------------|-------------------|
| **New Form Development** | 3-5 days | **2-4 hours** |
| **Validation Setup** | Custom logic each time | **Pre-built Zod integration** |
| **Data Persistence** | Build localStorage logic | **Automatic with storage key** |
| **Step Navigation** | Custom navigation controls | **Built-in with validation** |
| **Progress Indication** | Custom progress bars | **Automatic step tracking** |
| **Error Handling** | Custom error states | **Built-in error boundary** |
| **Accessibility** | Manual WCAG compliance | **Built-in accessibility** |
| **Responsive Design** | Custom mobile handling | **Automatic responsive** |
| **Testing** | Write all tests from scratch | **Reusable test patterns** |

---

## 🛠️ **INFRASTRUCTURE COMPONENTS**

### **Core Components Built (Epic 4.1 Stories 4.1.8 & 4.1.9)**

- **MultiStepForm Controller** - Orchestrates entire form flow with TanStack Forms
- **StepRenderer** - Dynamically renders any step configuration with validation
- **NavigationControls** - Previous/Next buttons with smart validation
- **ProgressIndicator** - Shows current step and completion progress
- **LocalStorageProvider** - Automatic data persistence with debounced auto-save
- **Field Registry** - All common field types ready to use
- **Validation Integration** - Zod schemas work out of the box
- **Error Boundaries** - Graceful error handling
- **Accessibility Features** - WCAG 2.1 AA compliance built-in

### **Field Types Available**

```typescript
// Already supported field types - use immediately:
{ type: 'text', name: 'companyName', label: 'Company Name' }
{ type: 'textarea', name: 'description', label: 'Description' }
{ type: 'select', name: 'industry', label: 'Industry', options: [...] }
{ type: 'checkbox', name: 'agree', label: 'I agree to terms' }
{ type: 'fieldArray', name: 'contacts', label: 'Contact List' }
{ type: 'conditionalGroup', name: 'advanced', condition: {...} }
```

---

## ⚡ **NEW FORM CREATION PROCESS**

### **4-Step Development Process (2-4 Hours Total)**

#### **Step 1: Define Data Structure (30 minutes)**
```typescript
// types/employee-onboarding-types.ts
export interface EmployeeOnboardingData {
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  employment: {
    department: string
    position: string
    startDate: string
    salary: number
  }
  benefits: {
    healthInsurance: boolean
    retirement401k: boolean
    vacationDays: number
  }
}
```

#### **Step 2: Create Validation Schemas (45 minutes)**
```typescript
// validation/employee-onboarding-schemas.ts
import { z } from 'zod'

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone number required')
})

export const employmentSchema = z.object({
  department: z.string().min(1, 'Department required'),
  position: z.string().min(1, 'Position required'),
  startDate: z.string().min(1, 'Start date required'),
  salary: z.number().min(0, 'Salary must be positive')
})

export const benefitsSchema = z.object({
  healthInsurance: z.boolean(),
  retirement401k: z.boolean(),
  vacationDays: z.number().min(0).max(30)
})
```

#### **Step 3: Configure Form (60 minutes)**
```typescript
// configs/employee-onboarding-config.ts
import type { MultiStepFormConfig } from '@/lib/forms/types'
import type { EmployeeOnboardingData } from '../types/employee-onboarding-types'
import { personalInfoSchema, employmentSchema, benefitsSchema } from '../validation/employee-onboarding-schemas'

export const employeeOnboardingConfig: MultiStepFormConfig<EmployeeOnboardingData> = {
  id: 'employee-onboarding',
  title: 'Employee Onboarding',
  steps: [
    {
      id: 'personal',
      title: 'Personal Information',
      schema: personalInfoSchema,
      fields: [
        { type: 'text', name: 'firstName', label: 'First Name', required: true },
        { type: 'text', name: 'lastName', label: 'Last Name', required: true },
        { type: 'email', name: 'email', label: 'Email Address', required: true },
        { type: 'text', name: 'phone', label: 'Phone Number', required: true }
      ]
    },
    {
      id: 'employment',
      title: 'Employment Details',
      schema: employmentSchema,
      fields: [
        { 
          type: 'select', 
          name: 'department', 
          label: 'Department', 
          options: [
            { value: 'engineering', label: 'Engineering' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'sales', label: 'Sales' }
          ]
        },
        { type: 'text', name: 'position', label: 'Position Title' },
        { type: 'date', name: 'startDate', label: 'Start Date' },
        { type: 'number', name: 'salary', label: 'Annual Salary' }
      ]
    },
    {
      id: 'benefits',
      title: 'Benefits Selection',
      schema: benefitsSchema,
      fields: [
        { type: 'checkbox', name: 'healthInsurance', label: 'Enroll in Health Insurance' },
        { type: 'checkbox', name: 'retirement401k', label: 'Enroll in 401(k) Plan' },
        { type: 'number', name: 'vacationDays', label: 'Vacation Days (0-30)', min: 0, max: 30 }
      ]
    }
  ],
  onSubmit: async (data: EmployeeOnboardingData) => {
    // Handle form submission
    console.log('Submitting employee onboarding:', data)
    await submitEmployeeOnboarding(data)
  }
}
```

#### **Step 4: Integrate into Page (15 minutes)**
```tsx
// pages/employee-onboarding.tsx
import { MultiStepForm } from '@/components/forms/multi-step/MultiStepForm'
import { employeeOnboardingConfig } from '@/lib/forms/configs/employee-onboarding-config'

export default function EmployeeOnboardingPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Employee Onboarding</h1>
        <MultiStepForm 
          config={employeeOnboardingConfig}
          onStepChange={(step) => console.log('Current step:', step)}
        />
      </div>
    </div>
  )
}
```

**Total Development Time: 2.5 hours instead of 3-5 days!**

---

## 🎯 **COMMON FORM PATTERNS**

### **Customer Registration Form**
```typescript
// 3 steps: Account Info → Company Details → Preferences
const customerRegistrationConfig: MultiStepFormConfig<CustomerData> = {
  id: 'customer-registration',
  steps: [
    { id: 'account', title: 'Account Information', ... },
    { id: 'company', title: 'Company Details', ... },
    { id: 'preferences', title: 'Preferences', ... }
  ]
}
```

### **Project Setup Form**
```typescript
// 3 steps: Basic Info → Team Members → Configuration
const projectSetupConfig: MultiStepFormConfig<ProjectData> = {
  id: 'project-setup',
  steps: [
    { id: 'basic', title: 'Project Information', ... },
    { id: 'team', title: 'Team Members', ... },
    { id: 'config', title: 'Configuration', ... }
  ]
}
```

### **Survey Form**
```typescript
// Variable steps: Demographics → Questions → Feedback
const surveyConfig: MultiStepFormConfig<SurveyData> = {
  id: 'customer-survey',
  steps: [
    { id: 'demographics', title: 'About You', ... },
    { id: 'questions', title: 'Survey Questions', ... },
    { id: 'feedback', title: 'Additional Feedback', ... }
  ]
}
```

---

## 🔧 **ADVANCED CUSTOMIZATION**

### **Custom Field Types**
```typescript
// Add to field registry once, use everywhere
export const customFieldRegistry = {
  ...defaultFieldRegistry,
  'color-picker': ColorPickerField,
  'file-upload': FileUploadField,
  'rich-text': RichTextEditorField
}
```

### **Custom Storage Provider**
```typescript
// Override default localStorage
const customConfig: MultiStepFormConfig<MyData> = {
  id: 'my-form',
  storage: new DatabaseStorageProvider('my-form'),
  // ... rest of config
}
```

### **Conditional Step Logic**
```typescript
// Dynamic steps based on user input
const dynamicSteps = useMemo(() => {
  const baseSteps = [step1, step2]
  if (userType === 'premium') {
    baseSteps.push(premiumStep)
  }
  return baseSteps
}, [userType])
```

### **Custom Validation**
```typescript
// Complex cross-field validation
const customSchema = z.object({
  startDate: z.string(),
  endDate: z.string()
}).refine((data) => {
  return new Date(data.endDate) > new Date(data.startDate)
}, {
  message: "End date must be after start date",
  path: ["endDate"]
})
```

---

## 🧪 **TESTING PATTERNS**

### **Configuration Testing**
```typescript
// test/configs/employee-onboarding-config.test.ts
import { describe, it, expect } from 'vitest'
import { employeeOnboardingConfig } from '@/lib/forms/configs/employee-onboarding-config'

describe('Employee Onboarding Config', () => {
  it('should have valid configuration structure', () => {
    expect(employeeOnboardingConfig.id).toBe('employee-onboarding')
    expect(employeeOnboardingConfig.steps).toHaveLength(3)
  })

  it('should validate personal info step correctly', () => {
    const personalStep = employeeOnboardingConfig.steps[0]
    const result = personalStep.schema.safeParse({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890'
    })
    expect(result.success).toBe(true)
  })
})
```

### **Integration Testing**
```typescript
// test/components/EmployeeOnboardingPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import EmployeeOnboardingPage from '@/pages/employee-onboarding'

describe('Employee Onboarding Page', () => {
  it('should render first step initially', () => {
    render(<EmployeeOnboardingPage />)
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
  })

  it('should navigate to next step on valid input', async () => {
    render(<EmployeeOnboardingPage />)
    
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '1234567890' } })
    
    fireEvent.click(screen.getByText('Next'))
    
    await waitFor(() => {
      expect(screen.getByText('Employment Details')).toBeInTheDocument()
    })
  })
})
```

---

## 📚 **REFERENCE EXAMPLES**

### **Complete Working Example: GeneralInfo Form**

See `docs/stories/4.1.10.generalinfo-page-integration.story.md` for a complete implementation example including:
- Full form configuration with 3 steps
- Sustainability reporting field requirements  
- Integration with existing page layout
- Comprehensive testing strategy

**Files Created:**
- `apps/web/src/lib/forms/configs/general-info-config.ts`
- `apps/web/src/lib/forms/types/general-info-types.ts`  
- `apps/web/src/lib/forms/validation/general-info-schemas.ts`
- `apps/web/src/app/(SignedIn)/generalinfo/page.tsx` (updated)

---

## 🚀 **BEST PRACTICES**

### **Configuration Organization**
```
lib/forms/
├── configs/          # Form configurations
│   ├── general-info-config.ts
│   ├── employee-onboarding-config.ts
│   └── customer-registration-config.ts
├── types/           # TypeScript interfaces  
│   ├── general-info-types.ts
│   └── employee-onboarding-types.ts
├── validation/      # Zod schemas
│   ├── general-info-schemas.ts
│   └── employee-onboarding-schemas.ts
└── utils/          # Form utilities
    ├── field-helpers.ts
    └── validation-helpers.ts
```

### **Naming Conventions**
- **Form IDs**: kebab-case (`employee-onboarding`, `customer-registration`)
- **Step IDs**: kebab-case (`personal-info`, `company-details`)
- **Field names**: camelCase (`firstName`, `companyName`)
- **Schema names**: camelCase with Schema suffix (`personalInfoSchema`)

### **Performance Optimization**
- **Lazy load** large form configurations
- **Debounce validation** for real-time feedback (already built-in)
- **Memoize** expensive field calculations
- **Optimize re-renders** with proper dependency arrays

### **Error Handling**
- **Graceful degradation** when validation fails
- **Clear error messages** for user feedback
- **Error boundaries** for configuration issues (built-in)
- **Fallback states** for network failures

---

## 🎯 **STRATEGIC IMPACT**

### **Development Velocity**
- **10x faster** form development (days → hours)
- **Consistent UX** across all forms
- **Reduced testing burden** with reusable patterns
- **Lower maintenance** with centralized infrastructure

### **Quality Improvements**
- **Built-in accessibility** compliance
- **Automatic data persistence** 
- **Consistent validation** patterns
- **Professional UI/UX** out of the box

### **Team Benefits**
- **Reduced learning curve** for new forms
- **Standardized patterns** across codebase
- **Faster onboarding** for new developers
- **Focus on business logic** instead of form mechanics

---

## 📞 **SUPPORT & RESOURCES**

### **Getting Help**
1. **Review this guide** for standard patterns
2. **Check existing configs** for similar use cases
3. **Review MultiStepForm component** documentation  
4. **Test configuration** thoroughly before integration

### **Contributing**
- **Add new field types** to registry when needed
- **Share reusable patterns** in this guide
- **Update documentation** when extending infrastructure
- **Create test examples** for complex configurations

---

**The MultiStepForm infrastructure is a "form factory" - feed it configuration and get a professional, accessible, validated, persistent multi-step form with zero custom form logic needed! 🚀**

---

*Last Updated: 2025-08-26 - Based on Epic 4.1 Infrastructure (Stories 4.1.8, 4.1.9, 4.1.10)*
