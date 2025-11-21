# Accessibility Quick Start Guide

Quick reference for implementing accessibility features in Imensiah components.

---

## Quick Checklist

### Every New Component Must Have:

- [ ] **Keyboard Navigation**: All interactive elements accessible via Tab
- [ ] **Focus Visible**: Clear focus indicators (gold ring)
- [ ] **ARIA Labels**: Meaningful labels for screen readers
- [ ] **Semantic HTML**: Proper HTML elements (`<button>`, `<nav>`, etc.)
- [ ] **Color Contrast**: Text meets WCAG AA 4.5:1 ratio

---

## Common Patterns

### 1. Button with Icon Only

```tsx
import { Button } from '@/components/ui/button';

<Button aria-label="Close dialog">
  <X className="w-4 h-4" aria-hidden="true" />
</Button>
```

### 2. Form Field with Validation

```tsx
import { FormField } from '@/components/ui/FormField';

<FormField
  label="Email"
  id="email"
  type="email"
  required
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### 3. Status Badge

```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="success" aria-label="Status: Approved">
  Approved
</Badge>
```

### 4. Navigation Landmark

```tsx
<nav role="navigation" aria-label="Main navigation">
  {/* Navigation items */}
</nav>
```

### 5. Main Content Area

```tsx
<main id="main-content" role="main">
  {children}
</main>
```

### 6. Skip to Content Link

```tsx
import { SkipToContent } from '@/components/a11y/SkipToContent';

<SkipToContent targetId="main-content" />
```

### 7. Screen Reader Announcement

```tsx
import { announceToScreenReader } from '@/lib/utils/accessibility';

// On form submit
announceToScreenReader('Form submitted successfully', 'polite');

// On error
announceToScreenReader('Error: Invalid email', 'assertive');
```

### 8. Dynamic Content (Loading/Updates)

```tsx
<div role="status" aria-live="polite" aria-atomic="true">
  {isLoading ? 'Loading...' : 'Data loaded'}
</div>
```

### 9. Error Message

```tsx
const errorId = 'email-error';

<input
  id="email"
  aria-invalid={hasError}
  aria-describedby={errorId}
/>
{hasError && (
  <p id={errorId} role="alert" className="text-red-500">
    Invalid email format
  </p>
)}
```

### 10. Modal/Dialog

```tsx
import { Dialog, DialogContent } from '@/components/ui/dialog';

<Dialog>
  <DialogContent>
    {/* Focus automatically trapped */}
    {/* Escape key closes dialog */}
  </DialogContent>
</Dialog>
```

---

## Color Palette (WCAG AA Compliant)

### High Contrast Combinations

```css
/* Navy on White - 14.8:1 ✅ */
color: var(--navy-900);
background: var(--surface-white);

/* Navy on Paper - 13.9:1 ✅ */
color: var(--navy-900);
background: var(--surface-paper);

/* Gold on White - 5.2:1 ✅ */
color: var(--gold-600);
background: var(--surface-white);

/* White on Navy - 14.8:1 ✅ */
color: var(--surface-white);
background: var(--navy-900);
```

---

## Testing Commands

```bash
# Manual keyboard test
# 1. Tab through page
# 2. All elements should be focusable
# 3. Focus indicators visible

# Screen reader test (NVDA)
# Install NVDA and test with Insert+Down Arrow

# Run Lighthouse audit
npm run lighthouse

# Check color contrast
# Use browser DevTools or online checker
```

---

## Common Mistakes to Avoid

### ❌ Don't Do This:

```tsx
// No aria-label on icon-only button
<button><X /></button>

// Using div instead of button
<div onClick={handleClick}>Click me</div>

// Color-only status indication
<span style={{color: 'red'}}>Error</span>

// Missing label
<input type="text" />

// Generic error message
<p className="error">Error</p>
```

### ✅ Do This Instead:

```tsx
// Proper aria-label
<button aria-label="Close"><X aria-hidden="true" /></button>

// Use semantic button
<button onClick={handleClick}>Click me</button>

// Text + color for status
<Badge variant="error">Error</Badge>

// Associated label
<Label htmlFor="email">Email</Label>
<input id="email" type="text" />

// Linked error message
<input aria-describedby="email-error" aria-invalid />
<p id="email-error" role="alert">Invalid email format</p>
```

---

## Utility Functions

```typescript
import {
  createId,
  announceToScreenReader,
  trapFocus,
  meetsContrastRequirement
} from '@/lib/utils/accessibility';

// Generate unique ID
const errorId = createId('email-error');

// Announce to screen reader
announceToScreenReader('Form submitted', 'polite');

// Focus trap (for modals)
const cleanup = trapFocus(modalElement);
// Call cleanup() when closing

// Check contrast
const isAccessible = meetsContrastRequirement('#0A101D', '#FFFFFF');
```

---

## Resources

- [Full Documentation](./ACCESSIBILITY.md)
- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Support

Questions? Check the full [ACCESSIBILITY.md](./ACCESSIBILITY.md) guide.
