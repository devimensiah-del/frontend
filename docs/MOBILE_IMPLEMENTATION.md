# Mobile Implementation Guide

## Overview

This document details the mobile-first implementation for the IMENSIAH application, ensuring excellent user experience across all device sizes from 375px (iPhone SE) to large desktops.

## Mobile Breakpoints

```css
xs:  375px  /* iPhone SE */
sm:  640px  /* Mobile landscape */
md:  768px  /* Tablet portrait */
lg:  1024px /* Tablet landscape / Desktop */
xl:  1280px /* Desktop */
2xl: 1536px /* Large desktop */
```

## Touch Targets

All interactive elements meet WCAG 2.1 Level AAA guidelines:
- **Minimum touch target**: 44x44px
- **Recommended touch target**: 48x48px
- **Spacing between targets**: Minimum 8px

### Button Sizes
```tsx
default: min-h-[44px]  // Primary buttons
sm:      min-h-[44px]  // Small buttons
lg:      min-h-[48px]  // Large buttons
icon:    44x44px       // Icon-only buttons
```

## Safe Area Support (iOS Notch)

### CSS Variables
```css
--safe-area-inset-top: env(safe-area-inset-top);
--safe-area-inset-right: env(safe-area-inset-right);
--safe-area-inset-bottom: env(safe-area-inset-bottom);
--safe-area-inset-left: env(safe-area-inset-left);
```

### Utility Classes
```tsx
<div className="safe-area-pt">  // Padding-top with safe area
<div className="safe-area-pb">  // Padding-bottom with safe area
<div className="safe-area-p">   // All sides with safe area
```

## Mobile Components

### 1. BottomNav (`components/mobile/BottomNav.tsx`)
Sticky bottom navigation that appears only on mobile/tablet (<1024px).

**Features:**
- Auto-hides on public pages
- Different navigation for users vs admins
- Active state highlighting
- Badge indicators for notifications
- Safe area padding for iOS

**Usage:**
```tsx
// Already included in app/layout.tsx
<BottomNav />
```

### 2. Mobile Cards

#### MobileSubmissionCard
```tsx
import { MobileSubmissionCard } from '@/components/mobile/MobileSubmissionCard';

<MobileSubmissionCard
  submission={submission}
  showActions={true}
/>
```

#### MobileEnrichmentCard
```tsx
import { MobileEnrichmentCard } from '@/components/mobile/MobileEnrichmentCard';

<MobileEnrichmentCard
  enrichment={enrichment}
  showActions={true}
/>
```

#### MobileAnalysisCard
```tsx
import { MobileAnalysisCard } from '@/components/mobile/MobileAnalysisCard';

<MobileAnalysisCard
  analysis={analysis}
  showActions={true}
  onDownloadPDF={() => handleDownload()}
/>
```

## Mobile Utilities (`lib/utils/mobile.ts`)

### Device Detection
```typescript
import { isMobile, isTablet, isDesktop } from '@/lib/utils/mobile';

if (isMobile()) {
  // Mobile-specific logic
}
```

### Breakpoint Detection
```typescript
import { getBreakpoint } from '@/lib/utils/mobile';

const breakpoint = getBreakpoint();
// Returns: 'mobile' | 'mobile-landscape' | 'tablet' | 'tablet-landscape' | 'desktop'
```

### Date Formatting (Mobile-Optimized)
```typescript
import { formatDateMobile } from '@/lib/utils/mobile';

formatDateMobile('2025-11-23T10:00:00Z');
// Today: "10:00"
// This week: "seg"
// Older: "23 nov"
```

### Text Truncation
```typescript
import { truncateText } from '@/lib/utils/mobile';

truncateText('Very long company name here', 50);
// "Very long company name here..."
```

## Responsive Patterns

### 1. Hide/Show by Breakpoint
```tsx
{/* Desktop only */}
<div className="hidden lg:block">
  <DataTable />
</div>

{/* Mobile only */}
<div className="lg:hidden">
  <MobileCardList />
</div>

{/* Tablet and up */}
<div className="hidden md:block">
  <ComplexLayout />
</div>
```

### 2. Grid Responsiveness
```tsx
{/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

{/* Mobile: 2 columns, Desktop: 4 columns */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
  <StatCard />
</div>
```

### 3. Stack on Mobile
```tsx
{/* Mobile: Stacked, Desktop: Horizontal */}
<div className="flex flex-col lg:flex-row gap-4">
  <div className="flex-1">Left content</div>
  <div className="flex-1">Right content</div>
</div>
```

### 4. Responsive Typography
```tsx
<h1 className="text-2xl sm:text-3xl lg:text-5xl">
  Responsive Heading
</h1>

<p className="text-sm sm:text-base">
  Responsive body text
</p>
```

### 5. Responsive Spacing
```tsx
<div className="p-4 sm:p-6 lg:p-8">
  {/* Padding increases with screen size */}
</div>

<div className="space-y-3 sm:space-y-4 lg:space-y-6">
  {/* Vertical spacing increases with screen size */}
</div>
```

## Page-Specific Implementations

### User Dashboard (`app/(dashboard)/painel/page.tsx`)

**Mobile Layout:**
```tsx
{/* Mobile: Stack all cards vertically */}
<div className="lg:hidden space-y-4 pb-20">
  <SubmissionCard />
  {enrichment && <EnrichmentCard />}
  {analysis && <AnalysisCard />}
</div>

{/* Desktop: 2-column grid */}
<div className="hidden lg:grid grid-cols-2 gap-6">
  {/* Desktop layout */}
</div>
```

**Mobile Optimizations:**
- Accordion sections for organization
- Progress stepper (vertical on mobile)
- Bottom navigation spacing (`pb-20`)
- Touch-friendly card heights

### Admin Dashboard (`app/admin/dashboard/page.tsx`)

**Mobile Layout:**
```tsx
{/* Stats: 2x2 grid on mobile */}
<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
  <StatCard />
</div>

{/* Hide table on mobile, show cards */}
<div className="hidden lg:block">
  <DataTable />
</div>

<div className="lg:hidden space-y-4">
  {submissions.map(sub => (
    <MobileSubmissionCard key={sub.id} submission={sub} />
  ))}
</div>
```

**Mobile Optimizations:**
- Filter tabs with horizontal scroll
- Card-based list view
- Batch actions in sticky footer
- Swipe gestures (future enhancement)

### Enrichment Editor (`app/admin/enriquecimento/[id]/page.tsx`)

**Mobile Layout:**
```tsx
{/* Mobile: Stack editor and sidebar */}
<div className="lg:hidden space-y-4 pb-20">
  {/* Sticky header */}
  <div className="sticky top-0 z-10 bg-white border-b p-4">
    <StatusBadge />
  </div>

  <EnrichmentForm />

  {/* Collapsible timeline */}
  <Accordion>
    <AccordionItem value="timeline">
      <AccordionTrigger>Timeline</AccordionTrigger>
      <AccordionContent>
        <StatusTimeline />
      </AccordionContent>
    </AccordionItem>
  </Accordion>

  {/* Sticky footer actions */}
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 safe-area-pb">
    <div className="flex gap-2">
      <Button variant="outline" className="flex-1">Salvar</Button>
      <Button className="flex-1">Aprovar</Button>
    </div>
  </div>
</div>
```

## Performance Optimizations

### 1. Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/logo.svg"
  alt="Logo"
  width={200}
  height={50}
  loading="lazy"
  className="w-full h-auto"
/>
```

### 2. Code Splitting
```tsx
import dynamic from 'next/dynamic';

const MobileChart = dynamic(() => import('@/components/mobile/MobileChart'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

### 3. Reduce Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Accessibility

### 1. Focus States
All interactive elements have visible focus indicators:
```tsx
*:focus-visible {
  outline: 2px solid var(--gold-500);
  outline-offset: 2px;
}
```

### 2. Screen Reader Support
```tsx
<button aria-label="Open menu">
  <MenuIcon />
</button>

<nav aria-label="Main navigation">
  <BottomNav />
</nav>
```

### 3. Semantic HTML
```tsx
<main id="main-content">
  <h1>Page Title</h1>
  <section aria-labelledby="section-heading">
    <h2 id="section-heading">Section</h2>
  </section>
</main>
```

## Testing Checklist

### Device Testing
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 14 Pro Max (428px)
- [ ] iPad portrait (768px)
- [ ] iPad landscape (1024px)
- [ ] Desktop (1440px)

### Functionality Testing
- [ ] No horizontal scrolling on any page
- [ ] All text is readable (min 14px on mobile)
- [ ] Touch targets are minimum 44px
- [ ] Forms are easy to fill on mobile
- [ ] Tables convert to cards on mobile
- [ ] Navigation is accessible
- [ ] Loading states work correctly
- [ ] Modals/dialogs fit screen
- [ ] Safe area insets work on iOS

### Performance Testing
- [ ] LCP < 2.5s on 3G
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Images are optimized
- [ ] Fonts are preloaded
- [ ] Code is split appropriately

## Browser Support

- **iOS Safari**: 14+
- **Chrome Android**: Last 2 versions
- **Samsung Internet**: Last 2 versions
- **Chrome Desktop**: Last 2 versions
- **Firefox**: Last 2 versions
- **Safari macOS**: Last 2 versions
- **Edge**: Last 2 versions

## Future Enhancements

### 1. PWA Support
```json
// manifest.json
{
  "name": "IMENSIAH",
  "short_name": "IMENSIAH",
  "theme_color": "#0A101D",
  "background_color": "#F7F6F4",
  "display": "standalone",
  "orientation": "portrait"
}
```

### 2. Offline Support
```typescript
// service-worker.ts
// Cache static assets
// Offline fallback pages
```

### 3. Swipe Gestures
```tsx
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => nextCard(),
  onSwipedRight: () => prevCard(),
});
```

### 4. Pull to Refresh
```tsx
const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  // Implementation
};
```

## Troubleshooting

### Issue: Viewport Height on Mobile Safari
**Problem:** Elements sized with `100vh` are too tall due to Safari's dynamic toolbar.

**Solution:**
```css
.full-height {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}
```

### Issue: Fixed Elements and iOS Keyboard
**Problem:** Fixed elements jump when keyboard opens.

**Solution:**
```tsx
useEffect(() => {
  const viewport = window.visualViewport;
  if (viewport) {
    const handleResize = () => {
      document.documentElement.style.setProperty(
        '--viewport-height',
        `${viewport.height}px`
      );
    };
    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }
}, []);
```

### Issue: Touch Delay on iOS
**Problem:** 300ms delay on tap events.

**Solution:**
```css
* {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
```

## Resources

- [Web.dev Mobile Performance](https://web.dev/mobile-performance/)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Material Design Mobile](https://material.io/design/layout/responsive-layout-grid.html)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
