# Accessibility Quick Reference

*Quick reference guide for implementing accessibility patterns in the VSME Guru application*

## Essential ARIA Patterns

### Navigation Elements
```typescript
// ✅ Main navigation
<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li>
      <a href="/dashboard" aria-current="page">Dashboard</a>
    </li>
  </ul>
</nav>

// ✅ Dropdown menus
<button 
  aria-expanded={isOpen}
  aria-haspopup="menu"
  aria-controls="menu-id"
>
  Menu
</button>
<ul role="menu" id="menu-id">
  <li role="none">
    <a role="menuitem" href="/settings">Settings</a>
  </li>
</ul>
```

### Interactive Elements
```typescript
// ✅ Icon buttons
<button aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

// ✅ User avatars
<Avatar>
  <AvatarImage alt="John Doe's profile picture" src="/avatar.jpg" />
  <AvatarFallback aria-label="John Doe initials">JD</AvatarFallback>
</Avatar>

// ✅ Status indicators
<div role="status" aria-label="Loading">
  <Spinner aria-hidden="true" />
  <span className="sr-only">Loading content...</span>
</div>
```

## Mobile Touch Targets

### Minimum Sizes
```typescript
// ✅ Mobile-friendly buttons
<Button className={cn(
  "min-h-[44px] min-w-[44px]",
  isMobile && "py-3 px-4"
)}>
  Action
</Button>

// ✅ Touch-optimized navigation
<SidebarMenuButton className={cn(
  isMobile && "min-h-[44px] py-3"
)}>
  Navigation Item
</SidebarMenuButton>
```

## Focus Management

### Route Changes
```typescript
// ✅ Automatic focus management (already implemented)
import { useFocusManagement } from '@/hooks/use-focus-management'

function MyComponent() {
  useFocusManagement() // Handles focus on route changes
  return <div>Content</div>
}
```

### Manual Focus
```typescript
// ✅ Focus management for modals
const dialogRef = useRef<HTMLDivElement>(null)

const openDialog = () => {
  setIsOpen(true)
  // Focus the dialog when it opens
  setTimeout(() => {
    dialogRef.current?.focus()
  }, 0)
}

<Dialog ref={dialogRef} tabIndex={-1}>
  <DialogTitle>Dialog Title</DialogTitle>
  <DialogContent>Content</DialogContent>
</Dialog>
```

## Common Mistakes to Avoid

### ❌ Don't Do This
```typescript
// Missing ARIA labels
<button onClick={handleClose}>
  <X />
</button>

// Decorative icons not hidden
<ChevronRight />

// Poor alt text
<img alt="image" src="/photo.jpg" />

// Insufficient touch targets
<button className="h-4 w-4">×</button>

// Missing semantic structure
<div onClick={handleClick}>Menu Item</div>
```

### ✅ Do This Instead
```typescript
// Proper ARIA labels
<button onClick={handleClose} aria-label="Close dialog">
  <X aria-hidden="true" />
</button>

// Hidden decorative icons
<ChevronRight aria-hidden="true" />

// Descriptive alt text
<img alt="Team photo from company retreat 2024" src="/photo.jpg" />

// Adequate touch targets
<button className="min-h-[44px] min-w-[44px] p-2">
  <X aria-hidden="true" />
  <span className="sr-only">Close</span>
</button>

// Proper semantic structure
<button onClick={handleClick}>Menu Item</button>
```

## Testing Checklist

### Quick Manual Tests
- [ ] Tab through all interactive elements
- [ ] Test with screen reader (VoiceOver on Mac: Cmd+F5)
- [ ] Verify skip link works (Tab on page load)
- [ ] Check focus indicators are visible
- [ ] Test keyboard shortcuts (Cmd/Ctrl+B for sidebar)

### Automated Testing
```bash
# Run accessibility tests
npm run test:a11y

# Check with Lighthouse
npm run lighthouse

# Validate HTML
npm run validate:html
```

## Useful CSS Classes

### Screen Reader Only
```css
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
```

### Focus Indicators
```css
/* Only show focus indicators during keyboard navigation */
.keyboard-navigation *:focus {
  @apply outline-2 outline-offset-2 outline-blue-600;
}
```

## Resources

- [Full Accessibility Patterns Documentation](./ACCESSIBILITY_PATTERNS.md)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)

## Need Help?

1. Check the [full accessibility documentation](./ACCESSIBILITY_PATTERNS.md)
2. Test with a screen reader
3. Use browser dev tools accessibility panel
4. Ask the team for accessibility review