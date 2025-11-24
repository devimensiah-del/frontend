# Mobile Testing Guide

## Quick Test Checklist

### Visual Regression Testing

```bash
# Test at all breakpoints
375px   - iPhone SE
390px   - iPhone 12/13/14
428px   - iPhone 14 Pro Max
768px   - iPad Portrait
1024px  - iPad Landscape
1440px  - Desktop
```

### Testing Commands

```bash
# Development server
npm run dev

# Open in different viewports (Chrome DevTools)
Ctrl/Cmd + Shift + M  # Toggle device toolbar

# Test specific pages
http://localhost:3000/painel
http://localhost:3000/admin/dashboard
http://localhost:3000/admin/enriquecimento
http://localhost:3000/admin/analise
```

## Page-by-Page Testing

### 1. User Dashboard (`/painel`)
- [ ] Accordion sections work on mobile
- [ ] Cards stack vertically on mobile
- [ ] Bottom navigation visible and functional
- [ ] No horizontal scroll
- [ ] Status badges fit in cards
- [ ] Loading skeleton displays correctly
- [ ] Empty state displays properly

### 2. Admin Dashboard (`/admin/dashboard`)
- [ ] Stats cards in 2x2 grid on mobile
- [ ] Table hidden on mobile, cards visible
- [ ] Horizontal scroll on filter tabs works
- [ ] Batch selection works on mobile cards
- [ ] Sticky footer for batch actions
- [ ] Search/filter UI accessible on mobile

### 3. Enrichment Editor (`/admin/enriquecimento/[id]`)
- [ ] Form fields stack vertically
- [ ] Sticky header with status
- [ ] Sticky footer with actions
- [ ] Timeline collapses in accordion
- [ ] Input fields have proper keyboard types
- [ ] Touch targets are 44px minimum
- [ ] Validation messages display correctly

### 4. Analysis Editor (`/admin/analise/[id]`)
- [ ] Framework selector works on mobile
- [ ] Editor panels stack vertically
- [ ] Sticky toolbar for actions
- [ ] Preview mode works on mobile
- [ ] PDF generation works
- [ ] Version selector accessible

## Automated Testing

### Lighthouse CI
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.settings.preset=mobile
```

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### Responsive Design Testing
```bash
# Using Playwright
npx playwright test --project=mobile

# Using Cypress
npm run cypress:open
```

## Manual Testing Workflow

### 1. Chrome DevTools Device Emulation

**Steps:**
1. Open DevTools (F12)
2. Click device toggle (Ctrl/Cmd + Shift + M)
3. Select device from dropdown
4. Test all pages
5. Rotate device (landscape/portrait)

**Devices to test:**
- iPhone SE
- iPhone 12 Pro
- iPhone 14 Pro Max
- iPad
- Samsung Galaxy S20

### 2. Real Device Testing

**iOS:**
```bash
# Start development server
npm run dev

# Find your local IP
ipconfig (Windows) / ifconfig (Mac/Linux)

# Access from device
http://[YOUR-IP]:3000
```

**Android:**
```bash
# Use Chrome Remote Debugging
chrome://inspect
```

### 3. BrowserStack / Sauce Labs
- Test on real devices in cloud
- Automated screenshot testing
- Performance monitoring

## Performance Testing

### 1. Lighthouse Performance Audit
```bash
# Mobile audit
lighthouse http://localhost:3000/painel \
  --view \
  --preset=mobile \
  --output=html \
  --output-path=./lighthouse-mobile.html
```

**Key Metrics:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- TTI (Time to Interactive): < 3.8s

### 2. Network Throttling
```bash
# Chrome DevTools Network tab
# Set to "Slow 3G" or "Fast 3G"
```

**Test scenarios:**
- Page load on 3G
- Image loading on slow connection
- Form submission on slow connection
- Real-time updates on slow connection

### 3. Bundle Size Analysis
```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer
```

**Target sizes:**
- Initial JS bundle: < 200KB (gzipped)
- CSS: < 50KB (gzipped)
- Images: Optimized and lazy-loaded

## Accessibility Testing

### 1. Screen Reader Testing

**iOS VoiceOver:**
1. Settings > Accessibility > VoiceOver
2. Enable VoiceOver
3. Navigate app using gestures
4. Verify all interactive elements are announced

**Android TalkBack:**
1. Settings > Accessibility > TalkBack
2. Enable TalkBack
3. Navigate app
4. Verify labels and roles

### 2. Keyboard Navigation
- [ ] All interactive elements reachable via Tab
- [ ] Focus indicators visible
- [ ] Logical tab order
- [ ] No keyboard traps
- [ ] Skip links work

### 3. Color Contrast
```bash
# Use axe DevTools or WAVE
# Check contrast ratios
# Minimum 4.5:1 for normal text
# Minimum 3:1 for large text
```

## Touch Target Testing

### Minimum Requirements
- **All interactive elements**: 44x44px
- **Spacing between elements**: 8px minimum
- **Primary CTAs**: 48x48px recommended

### Test Script
```javascript
// Run in browser console
document.querySelectorAll('button, a, input[type="submit"]').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.height < 44 || rect.width < 44) {
    console.warn('Touch target too small:', el, `${rect.width}x${rect.height}`);
  }
});
```

## Form Testing

### Input Types
- [ ] `type="email"` shows email keyboard
- [ ] `type="tel"` shows phone keyboard
- [ ] `type="number"` shows numeric keyboard
- [ ] `inputMode="numeric"` for numbers without spinner

### Validation
- [ ] Error messages display clearly
- [ ] Error messages are accessible
- [ ] Validation happens on blur and submit
- [ ] Success states are clear

### Autocomplete
```tsx
<input
  type="email"
  autoComplete="email"
  inputMode="email"
/>
```

## Safe Area Testing (iOS Notch)

### Test Devices
- iPhone X and newer (with notch)
- iPhone 14 Pro and newer (Dynamic Island)

### Check Points
- [ ] Bottom navigation respects safe area
- [ ] Fixed headers respect safe area
- [ ] Sticky elements don't overlap notch
- [ ] Fullscreen content handles safe areas

### Test CSS
```css
/* Apply to elements */
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Image Testing

### Responsive Images
- [ ] Images use `srcset` and `sizes`
- [ ] Images lazy load correctly
- [ ] Placeholder/skeleton while loading
- [ ] Images don't cause layout shift

### Format Testing
- [ ] WebP support with fallback
- [ ] SVG for icons and logos
- [ ] Optimized PNG/JPEG for photos

## Animation Testing

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Test that animations are disabled */
}
```

### Performance
- [ ] Animations use GPU (transform, opacity)
- [ ] No janky animations on mobile
- [ ] 60fps on animations

## Orientation Testing

### Portrait Mode
- [ ] All pages render correctly
- [ ] Bottom navigation displays
- [ ] Forms are usable

### Landscape Mode
- [ ] Layout adapts appropriately
- [ ] Bottom navigation adapts or hides
- [ ] Content doesn't overflow

## Common Issues to Check

### 1. Horizontal Scroll
```javascript
// Find overflowing elements
document.querySelectorAll('*').forEach(el => {
  if (el.scrollWidth > document.documentElement.clientWidth) {
    console.log('Overflows:', el);
  }
});
```

### 2. Text Readability
- [ ] Minimum font size: 14px on mobile
- [ ] Line height: 1.5 for body text
- [ ] Line length: 50-75 characters

### 3. Fixed Elements
- [ ] Don't cover content
- [ ] Don't jump when keyboard opens
- [ ] Work with safe areas

### 4. Modals/Dialogs
- [ ] Fit on screen
- [ ] Close button accessible
- [ ] Background scrolling prevented
- [ ] Focus trapped in modal

## Cross-Browser Testing

### iOS Safari
- [ ] Safe area insets work
- [ ] Touch events work
- [ ] CSS Grid/Flexbox works
- [ ] Viewport height correct

### Chrome Android
- [ ] Touch targets adequate
- [ ] Forms work correctly
- [ ] Transitions smooth

### Samsung Internet
- [ ] All features work
- [ ] Performance good

## Testing Tools

### Browser DevTools
```bash
# Chrome DevTools
Ctrl/Cmd + Shift + M  # Device toolbar
Ctrl/Cmd + Shift + P  # Command palette → "Capture screenshot"
```

### Extensions
- **Lighthouse** - Performance audits
- **axe DevTools** - Accessibility testing
- **WAVE** - Web accessibility evaluation
- **Responsive Viewer** - Multiple viewports

### Third-Party Services
- **BrowserStack** - Real device testing
- **LambdaTest** - Cross-browser testing
- **Percy** - Visual regression testing
- **Sauce Labs** - Automated testing

## CI/CD Integration

### GitHub Actions
```yaml
name: Mobile Testing
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse CI
        run: |
          npm ci
          npm run build
          npx @lhci/cli@0.12.x autorun
```

### Automated Checks
- [ ] Lighthouse performance scores
- [ ] Bundle size limits
- [ ] Accessibility scores
- [ ] Visual regression tests

## Reporting Issues

### Issue Template
```markdown
## Device Information
- Device: iPhone 14 Pro
- OS: iOS 17.1
- Browser: Safari 17.1

## Issue Description
[Describe the issue]

## Steps to Reproduce
1. Navigate to /painel
2. Tap on "Ver Detalhes"
3. Observe incorrect behavior

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[Attach screenshots]

## Additional Context
[Any other relevant information]
```

## Success Criteria

### Performance
- ✅ LCP < 2.5s on 3G
- ✅ FID < 100ms
- ✅ CLS < 0.1
- ✅ Lighthouse Performance Score > 90

### Accessibility
- ✅ All touch targets ≥ 44px
- ✅ WCAG 2.1 Level AA compliant
- ✅ Screen reader friendly
- ✅ Keyboard navigable

### Usability
- ✅ No horizontal scroll
- ✅ Forms easy to fill on mobile
- ✅ Text readable (min 14px)
- ✅ Sufficient contrast ratios

### Compatibility
- ✅ Works on iOS Safari 14+
- ✅ Works on Chrome Android
- ✅ Works on Samsung Internet
- ✅ Safe area insets respected

## Next Steps

After completing this checklist:
1. Fix any identified issues
2. Re-test affected areas
3. Document fixes in pull request
4. Request QA review
5. Deploy to staging
6. Final testing on staging
7. Deploy to production
