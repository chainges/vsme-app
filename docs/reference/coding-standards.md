# Coding Standards & Best Practices

**📚 REFERENCE DOCUMENT - Consolidated from multiple sources**

_This document consolidates all coding standards, best practices, and development guidelines into a single reference. It combines rules from MAIN.md, best practices documents, and current project patterns._

## 🎯 **Core Development Principles**

### **Before Writing Code**
1. **Analyze existing patterns** in the codebase
2. **Consider edge cases** and error scenarios  
3. **Follow the rules below** strictly
4. **Validate accessibility requirements**
5. **Follow TDD methodology** - Write tests before implementation using [TDD Process Guide](./tdd-process-guide.md)

### **Code Quality Standards**
- **Biome**: Fast linting and formatting (extends ultracite config)
- **TypeScript**: Strict mode enabled, zero `any` types
- **Ultracite**: Opinionated code style configuration
- **No Semicolons**: Configured with "asNeeded" setting

## ♿ **Accessibility (a11y) - REQUIRED**

### **HTML Elements & ARIA**
- Don't use `accessKey` attribute on any HTML element
- Don't set `aria-hidden="true"` on focusable elements
- Don't add ARIA roles, states, and properties to elements that don't support them
- Don't use distracting elements like `<marquee>` or `<blink>`
- Only use the `scope` prop on `<th>` elements
- Don't assign non-interactive ARIA roles to interactive HTML elements
- Make sure label elements have text content and are associated with an input
- Don't assign interactive ARIA roles to non-interactive HTML elements
- Don't assign `tabIndex` to non-interactive HTML elements
- Don't use positive integers for `tabIndex` property

### **Images & Media**
- Don't include "image", "picture", or "photo" in img alt prop
- Give all elements requiring alt text meaningful information for screen readers
- Always include a `title` element for SVG elements
- Always include a `title` attribute for iframe elements
- Include caption tracks for audio and video elements

### **Interactive Elements**
- Always include a `type` attribute for button elements
- Make elements with interactive roles and handlers focusable
- Make static elements with click handlers use a valid role attribute
- Don't use explicit role property that's the same as the implicit/default role
- Make sure all anchors are valid and navigable

### **Keyboard & Focus Management**
- Accompany `onClick` with at least one of: `onKeyUp`, `onKeyDown`, or `onKeyPress`
- Accompany `onMouseOver`/`onMouseOut` with `onFocus`/`onBlur`
- Don't assign `tabIndex` to non-interactive HTML elements with `aria-activedescendant`
- Include all required ARIA attributes for elements with ARIA roles

### **Semantic HTML**
- Use semantic elements instead of role attributes in JSX
- Give heading elements content that's accessible to screen readers (not hidden with `aria-hidden`)
- Always include a `lang` attribute on the html element
- Use correct ISO language/country codes for the `lang` attribute

### **Form Accessibility**
- Make sure ARIA properties (`aria-*`) are valid
- Use valid, non-abstract ARIA roles for elements with ARIA roles
- Use valid ARIA state and property values
- Use valid values for the `autocomplete` attribute on input elements
- Make sure ARIA properties are valid for the element's supported roles

## 🔧 **Code Complexity & Quality**

### **Function & Class Design**
- Don't write functions that exceed a given Cognitive Complexity score
- Don't create classes that only have static members (like a static namespace)
- Don't use `this` and `super` in static contexts
- Don't use unnecessary constructors
- Don't return a value from a constructor
- Don't use unnecessary catch clauses
- Don't use unnecessary continue statements

### **Control Flow**
- Don't use the comma operator
- Don't use unnecessary labels
- Don't use unnecessary nested block statements
- Don't use unnecessary fragments
- Don't use unnecessary boolean casts
- Don't use unnecessary callbacks with flatMap
- Don't use unnecessary escape sequences in regular expression literals
- Don't use unnecessary string or template literal concatenation

### **Data Handling**
- Don't use the `arguments` object
- Don't use primitive type aliases or misleading types
- Don't use empty type parameters in type aliases and interfaces
- Don't use unnecessary ternary operators when simpler alternatives exist
- Don't use unnecessary destructuring patterns
- Don't use unnecessary nested ternary expressions

### **Best Practices**
- Use `for...of` statements instead of `Array.forEach`
- Use arrow functions instead of function expressions
- Use `Date.now()` to get milliseconds since the Unix Epoch
- Use `.flatMap()` instead of `map().flat()` when possible
- Use literal property access instead of computed property access
- Use regular expression literals instead of the RegExp constructor when possible

## ⚛️ **React & JSX Best Practices**

### **Component Structure**
- Use functional components with hooks only
- Don't define React components inside other components
- Don't use the return value of React.render
- Don't forget key props in iterators and collection literals
- Don't destructure props inside JSX components in Solid projects

### **Hooks & State**
- Make sure all React hooks are called from the top level of component functions
- Make sure all dependencies are correctly specified in React hooks
- Don't assign to React component props
- Don't use both `children` and `dangerouslySetInnerHTML` props on the same element

### **JSX Patterns**
- Use `<>...</>` instead of `<Fragment>...</Fragment>`
- Don't use dangerous JSX props
- Don't use Array index in keys
- Don't insert comments as text nodes
- Don't assign JSX properties multiple times
- Don't add extra closing tags for components without children
- Watch out for possible "wrong" semicolons inside JSX elements

### **Event Handling**
- Don't use event handlers on non-interactive elements
- Make sure all dependencies are correctly specified in React hooks

## 📝 **TypeScript Best Practices**

### **Type Safety**
- Don't use TypeScript enums
- Don't export imported variables
- Don't add type annotations to variables, parameters, and class properties that are initialized with literal expressions
- Don't use TypeScript namespaces
- Don't use non-null assertions with the `!` postfix operator
- Don't use parameter properties in class constructors
- Don't use user-defined types

### **Type Definitions**
- Use `as const` instead of literal types and type annotations
- Use either `T[]` or `Array<T>` consistently
- Use `export type` for types
- Use `import type` for types
- Don't declare empty interfaces
- Don't let variables evolve into any type through reassignments
- Don't use the any type

### **Type Constraints**
- Don't use any or unknown as type constraints
- Don't misuse the non-null assertion operator (!) in TypeScript files
- Don't use implicit any type on variable declarations
- Don't merge interfaces and classes unsafely
- Don't use overload signatures that aren't next to each other

## 🎨 **Style & Consistency**

### **Code Style**
- Don't use global `eval()`
- Don't use callbacks in asynchronous tests and hooks
- Don't use negation in `if` statements that have `else` clauses
- Don't use nested ternary expressions
- Don't reassign function parameters
- Don't use specified modules when loaded by import or require

### **Naming & Organization**
- Don't use constants whose value is the upper-case version of their name
- Don't use unnecessary escape sequences in string literals
- Don't use template literals if you don't need interpolation or special-character handling
- Don't use `else` blocks when the `if` block breaks early
- Don't use yoda expressions

### **Data Structures**
- Don't use Array constructors
- Use `at()` instead of integer index access
- Follow curly brace conventions
- Use `else if` instead of nested `if` statements in `else` clauses
- Use single `if` statements instead of nested `if` clauses

### **Built-ins & Utilities**
- Use `new` for all builtins except `String`, `Number`, and `Boolean`
- Use consistent accessibility modifiers on class properties and methods
- Use `const` declarations for variables that are only assigned once
- Put default function parameters and optional function parameters last
- Include a `default` clause in switch statements

## 🧪 **Testing Best Practices**

### **📚 Comprehensive Testing Documentation**

**Essential Guides:**
- **🚀 [Testing Quick Start Guide](./testing-quick-start-guide.md)** - Write your first test in 15 minutes
- **🔴 [TDD Process Guide](./tdd-process-guide.md)** - Complete RED-GREEN-REFACTOR methodology
- **📚 [Testing Pattern Library](./testing-patterns/)** - Copy-paste patterns for all scenarios

**Pattern Categories:**
- [Component Patterns](./testing-patterns/component/) - React component testing with TDD
- [Utility Patterns](./testing-patterns/utility/) - Pure function and business logic testing  
- [Hook Patterns](./testing-patterns/hook/) - Custom React hook testing
- [API Patterns](./testing-patterns/api/) - API endpoint testing with MSW
- [Integration Patterns](./testing-patterns/integration/) - Multi-component system testing

### **Test Structure Standards**
- Don't use export or module.exports in test files
- Don't use focused tests (`test.only`, `describe.only`)
- Make sure the assertion function, like expect, is placed inside an `it()` function call
- Don't use disabled tests (`test.skip`, `describe.skip`) - remove or fix them
- Don't nest describe() blocks too deeply in test files (max 3 levels)
- Don't have duplicate hooks in describe blocks

### **TDD Methodology Requirements**
- **Follow RED-GREEN-REFACTOR cycle** - Write failing test first, minimal implementation, then improve
- **Test-first development** - Write tests before implementation code
- **Small iterations** - Keep TDD cycles short (minutes, not hours)
- **Commit at GREEN phase** - Commit when tests pass for safe refactoring

### **Test Quality Standards**
- **Test user behavior, not implementation** - Focus on what users experience
- **Use accessibility-focused queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
- **Test error states and edge cases** - Don't only test happy path
- **Mock external dependencies** - Database, APIs, file system operations
- **Use descriptive test names** - Explain what behavior is being tested

### **Test Implementation**
- Don't use callbacks in asynchronous tests and hooks
- Don't use empty block statements and static blocks
- Don't let switch clauses fall through
- Don't reassign function declarations
- Don't allow assignments to native objects and read-only global variables

## 🚀 **Performance & Security**

### **Performance**
- Don't use await inside loops
- Don't use bitwise operators
- Don't use expressions where the operation doesn't change the value
- Make sure Promise-like statements are handled appropriately
- Don't use `__dirname` and `__filename` in the global scope

### **Security**
- Don't hardcode sensitive data like API keys and tokens
- Don't use the TypeScript directive @ts-ignore
- Don't use `target="_blank"` without `rel="noopener"`
- Don't use global `eval()`
- Don't use configured elements

### **Memory & Resources**
- Prevent import cycles
- Don't use namespace imports
- Don't access namespace imports dynamically
- Don't use the `delete` operator
- Don't use spread (`...`) syntax on accumulators

## 📚 **Next.js Specific Rules**

- Don't use `<img>` elements in Next.js projects
- Don't use `<head>` elements in Next.js projects
- Don't import next/document outside of pages/_document.jsx in Next.js projects
- Don't use the next/head module in pages/_document.js on Next.js projects

## 🔍 **Code Validation**

### **Before Committing**
1. Run `bun check` for Biome linting and formatting
2. Run `bun check-types` for TypeScript validation
3. Ensure all accessibility requirements are met
4. Verify component structure follows React best practices
5. Check that types are properly defined and used

### **Quality Checks**
- No TypeScript errors
- No accessibility violations
- No React hook rule violations
- Consistent code formatting
- Proper error handling patterns

---

**Note**: This document consolidates standards from MAIN.md, best practices documents, and current project patterns. When implementing new features, refer to the appropriate sections and ensure compliance with all relevant standards.
