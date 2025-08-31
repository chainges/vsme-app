# Accessibility Patterns Documentation

*Key accessibility patterns and implementations for the VSME Guru application*

## Overview

This document outlines the accessibility (A11y) patterns implemented throughout the application to ensure WCAG 2.1 AA compliance and provide an inclusive user experience for all users, including those using assistive technologies.

## Core Accessibility Principles

### 1. Perceivable
- **Color Contrast**: All text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- **Focus Indicators**: Enhanced focus rings with 2px outline and 2px offset for keyboard navigation
- **Alternative Text**: Descriptive alt text for all meaningful images and icons
- **Screen Reader Support**: Proper semantic markup and ARIA labels

### 2. Operable
- **Keyboard Navigation**: Full keyboard accessibility with logical tab order
- **Touch Targets**: Minimum 44px touch targets on mobile devices
- **Focus Management**: Automatic focus management for route changes
- **Skip Links**: Skip-to-content functionality for keyboard users

### 3. Understandable
- **Semantic HTML**: Proper use of headings, landmarks, and semantic elements
- **ARIA Labels**: Clear, descriptive labels for interactive elements
- **Error Messages**: Clear, actionable error messages
- **Consistent Navigation**: Predictable navigation patterns

### 4. Robust
- **Valid HTML**: Semantic, standards-compliant markup
- **ARIA Compliance**: Proper ARIA roles, properties, and states
- **Progressive Enhancement**: Works without JavaScript
- **Cross-browser Compatibility**: Tested across modern browsers and assistive technologies

## Implementation Patterns

### Navigation Accessibility

#### Main Navigation (`nav-main.tsx`)
```typescript
// Semantic navigation structure
<SidebarMenu role="navigation" aria-label="Main navigation">
  {items.map((item) => (
    <SidebarMenuItem>
      <Link 
        href={item.url}
        aria-expanded={item.isActive}
        aria-describedby={item.items?.length ? `${item.title}-submenu` : undefined}
      >
        {item.icon && <item.icon aria-hidden="true" />}
        <span>{item.title}</span>
      </Link>
      
      {/* Submenu with proper ARIA relationships */}
      <SidebarMenuSub 
        role="menu" 
        aria-label={`${item.title} submenu`}
        id={`${item.title}-submenu`}
      >
        {item.items.map((subItem) => (
          <SidebarMenuSubItem role="none">
            <Link href={subItem.url} role="menuitem">
              {subItem.title}
            </Link>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  ))}
</SidebarMenu>
```

**Key Patterns:**
- `role="navigation"` for main navigation container
- `aria-label` for navigation identification
- `aria-expanded` for collapsible items
- `aria-describedby` to link main items with submenus
- `role="menu"` and `role="menuitem"` for dropdown menus
- `aria-hidden="true"` for decorative icons

#### User Menu (`nav-user.tsx`)
```typescript
<SidebarMenuButton
  aria-label={`User menu for ${user.name}`}
>
  <Avatar>
    <AvatarImage alt={`${user.name}'s profile picture`} src={user.avatar} />
    <AvatarFallback aria-label={`${user.name} initials`}>
      {initials}
    </AvatarFallback>
  </Avatar>
  <ChevronsUpDown aria-hidden="true" />
</SidebarMenuButton>
```

**Key Patterns:**
- Descriptive `aria-label` for user context
- Proper alt text for profile images
- `aria-label` for avatar fallbacks
- `aria-hidden="true"` for decorative chevron icons

#### Team Switcher (`team-switcher.tsx`)
```typescript
<SidebarMenuButton
  aria-label={`Switch organization, currently ${activeTeam.name}`}
>
  <DropdownMenuItem
    aria-label={`Switch to ${team.name} organization`}
  >
    <team.logo aria-hidden="true" />
    {team.name}
    <DropdownMenuShortcut aria-label={`Keyboard shortcut: Command ${index + 1}`}>
      ⌘{index + 1}
    </DropdownMenuShortcut>
  </DropdownMenuItem>
</SidebarMenuButton>
```

**Key Patterns:**
- Context-aware `aria-label` showing current state
- Action-specific labels for menu items
- Accessible keyboard shortcut descriptions
- Hidden decorative logos

### Focus Management

#### Route Change Focus (`use-focus-management.ts`)
```typescript
export function useFocusManagement() {
  const pathname = usePathname()
  
  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      // Focus main content area
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1')
        mainContent.focus()
        
        // Remove tabindex to avoid tab order issues
        setTimeout(() => {
          mainContent.removeAttribute('tabindex')
        }, 100)
      }
      
      // Announce route change to screen readers
      announceRouteChange(pathname)
    }
  }, [pathname])
}
```

**Key Patterns:**
- Automatic focus management on route changes
- Temporary `tabindex="-1"` for programmatic focus
- Screen reader announcements via live regions
- Focus restoration without disrupting tab order

#### Keyboard Navigation
```typescript
export function useKeyboardNavigation() {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        // Close modals, dropdowns
        const activeElement = document.activeElement as HTMLElement
        if (activeElement?.blur) {
          activeElement.blur()
        }
        break
      
      case 'Tab':
        // Show keyboard focus indicators
        document.body.classList.add('keyboard-navigation')
        break
    }
  }
}
```

**Key Patterns:**
- Escape key handling for modal dismissal
- Visual focus indicators only during keyboard navigation
- Mouse interaction removes keyboard navigation class

### Mobile Accessibility

#### Touch Targets
```css
/* Improve touch targets on mobile */
@media (max-width: 768px) {
  button,
  a,
  input,
  select,
  textarea {
    min-height: 44px;
    min-width: 44px;
  }
}
```

#### Mobile Navigation Enhancements
```typescript
// Enhanced touch targets for mobile
className={cn(
  isMobile && "min-h-[44px] py-3"
)}

// Auto-close mobile sidebar on navigation
const handleNavigation = () => {
  if (isMobile) {
    setOpenMobile(false)
  }
}
```

**Key Patterns:**
- Minimum 44px touch targets (Apple/WCAG recommendation)
- Larger interactive areas on mobile
- Auto-close mobile menus after navigation
- Mobile-specific spacing and sizing

### Form Accessibility

#### Mode Toggle (`mode-toggle.tsx`)
```typescript
<Button 
  size="icon" 
  variant="outline"
  className={isMobile ? 'min-h-[44px] min-w-[44px]' : ''}
>
  <Sun className="..." />
  <Moon className="..." />
  <span className="sr-only">Toggle theme</span>
</Button>

<DropdownMenuItem 
  onClick={() => setTheme('light')}
  className={isMobile ? 'min-h-[44px] py-3' : ''}
>
  Light
</DropdownMenuItem>
```

**Key Patterns:**
- Screen reader text for icon-only buttons
- Mobile-optimized touch targets
- Clear action descriptions
- Consistent interaction patterns

### Page Structure Accessibility

#### Marketing Page (`page.tsx`)
```typescript
<main className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
  <section className="space-y-6 sm:space-y-8" aria-labelledby="hero-heading">
    <h1 id="hero-heading">Forenklet VSME-rapportering</h1>
    
    <section className="space-y-3" aria-label="Platform status overview">
      <div role="status" aria-label="Compliance status">
        <CheckCircle aria-hidden="true" />
        <div>Samsvarsstatus</div>
      </div>
    </section>
    
    <div role="complementary" aria-label="Compliance certification">
      <span>I samsvar med ESRS</span>
    </div>
  </section>
  
  <aside aria-label="Dashboard preview">
    <h3>VSME Guru Dashboard</h3>
  </aside>
</main>
```

**Key Patterns:**
- Proper landmark roles (`main`, `section`, `aside`)
- Heading hierarchy with `aria-labelledby`
- Status information with `role="status"`
- Complementary content with `role="complementary"`
- Descriptive section labels

### CSS Accessibility Enhancements

#### Focus Indicators
```css
/* Enhanced focus indicators for keyboard navigation */
.keyboard-navigation *:focus {
  @apply outline-2 outline-offset-2 outline-blue-600;
}

/* Ensure sufficient color contrast for focus states */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  @apply outline-2 outline-offset-2 outline-blue-600;
}
```

#### Screen Reader Utilities
```css
/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Skip link for keyboard users */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: white;
  color: black;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}
```

## Testing Guidelines

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Verify logical tab order
- [ ] Test Escape key functionality
- [ ] Verify skip links work
- [ ] Test keyboard shortcuts (Cmd/Ctrl+B for sidebar)

#### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS)
- [ ] Verify route announcements
- [ ] Check ARIA label accuracy

#### Mobile Accessibility
- [ ] Verify 44px minimum touch targets
- [ ] Test with mobile screen readers
- [ ] Check gesture navigation
- [ ] Verify auto-close functionality

#### Color and Contrast
- [ ] Test with high contrast mode
- [ ] Verify color contrast ratios
- [ ] Test with color blindness simulators
- [ ] Check focus indicator visibility

### Automated Testing

#### Tools to Use
- **axe-core**: Automated accessibility testing
- **Lighthouse**: Accessibility audit
- **WAVE**: Web accessibility evaluation
- **Color Contrast Analyzers**: For contrast verification

#### Example Test Implementation
```typescript
// Example accessibility test with @testing-library
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('navigation should be accessible', async () => {
  const { container } = render(<NavMain items={mockItems} />)
  
  // Check for accessibility violations
  const results = await axe(container)
  expect(results).toHaveNoViolations()
  
  // Verify ARIA labels
  expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  
  // Test keyboard navigation
  const firstLink = screen.getByRole('link', { name: /dashboard/i })
  firstLink.focus()
  expect(firstLink).toHaveFocus()
})
```

## Common Accessibility Pitfalls to Avoid

### ❌ Don't Do This
```typescript
// Missing ARIA labels
<button onClick={handleClick}>
  <Icon />
</button>

// Decorative icons not hidden
<ChevronRight />

// Poor focus management
onClick={() => {
  navigate('/dashboard')
  // No focus management
}}

// Insufficient touch targets
<button className="h-6 w-6">×</button>
```

### ✅ Do This Instead
```typescript
// Proper ARIA labels
<button onClick={handleClick} aria-label="Close dialog">
  <Icon aria-hidden="true" />
</button>

// Hidden decorative icons
<ChevronRight aria-hidden="true" />

// Proper focus management
onClick={() => {
  navigate('/dashboard')
  // Focus will be managed by useFocusManagement hook
}}

// Adequate touch targets
<button className="min-h-[44px] min-w-[44px] p-2">
  <span aria-hidden="true">×</span>
  <span className="sr-only">Close</span>
</button>
```

## Resources and References

### WCAG Guidelines
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Accessibility Guidelines](https://webaim.org/standards/wcag/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Analyzers](https://www.tpgi.com/color-contrast-checker/)

### Screen Readers
- [NVDA (Free)](https://www.nvaccess.org/download/)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (Built into macOS/iOS)](https://support.apple.com/guide/voiceover/)

## Maintenance and Updates

### Regular Accessibility Audits
- Run automated tests with each deployment
- Conduct manual testing quarterly
- Update patterns based on user feedback
- Stay current with WCAG updates

### Team Training
- Regular accessibility training sessions
- Code review checklist for accessibility
- User testing with disabled users
- Accessibility-first design thinking

This documentation should be updated as new patterns are implemented and accessibility requirements evolve.