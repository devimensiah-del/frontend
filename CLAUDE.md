# IMENSIAH Frontend - Claude Code Guidelines

## Architecture
- Next.js 15 App Router
- React Server Components where possible
- Client Components only when needed (use "use client" directive)
- Colocation: components near pages that use them

## File Structure
```
/app/
  /dashboard/              # User dashboard
    page.tsx              # < 150 lines
    layout.tsx            # < 100 lines
    /components/          # Page-specific components
  /admin/                 # Admin dashboard
    page.tsx
    /submissions/
      page.tsx
      /[id]/page.tsx      # Submission detail page
    /analytics/page.tsx
    /enrichment/page.tsx
  /auth/                  # Authentication pages
    /login/page.tsx
    /signup/page.tsx
    /reset-password/page.tsx
  /reports/               # Public report viewing
    /[token]/page.tsx
  /payment/
    /success/page.tsx
  page.tsx                # Landing page
  layout.tsx              # Root layout
  globals.css             # Global styles

/components/
  /ui/                    # Reusable UI components (IMMUTABLE)
    button.tsx
    input.tsx
    card.tsx
    badge.tsx
    dialog.tsx
    accordion.tsx
    etc.
  /layouts/               # Layout components
    header.tsx
    footer.tsx
    page-layout.tsx
    dashboard-layout.tsx
  /forms/                 # Form components
    submission-form.tsx
    enhanced-form.tsx
  /dashboard/             # Dashboard-specific components
    stats-card.tsx
    submissions-table.tsx
    report-modal.tsx
  /admin/                 # Admin-specific components
    submission-detail.tsx
    enrichment-display.tsx
    quality-assessment.tsx
  providers.tsx           # React Query + Toast providers

/lib/
  /api/
    client.ts             # API client setup
    auth.ts               # Auth endpoints
    submissions.ts        # Submission endpoints
    admin.ts              # Admin endpoints
  /auth/
    supabase.ts           # Supabase client
    context.tsx           # Auth context
    protected-route.tsx   # Route protection HOC
  /utils/
    cn.ts                 # Class merger
    formatters.ts         # Date, currency, status formatters
    validators.ts         # Custom Zod validators

/types/
  index.ts                # All TypeScript types
```

## Component Size Limits
- **Components**: < 200 lines
- **Hooks**: < 100 lines
- **Pages**: < 250 lines (extract sections to components)
- **If larger**: Extract sub-components or hooks

## Naming Conventions
- **Components**: PascalCase (SubmissionForm.tsx)
- **Hooks**: camelCase starting with "use" (useAuth.ts, useSubmissions.ts)
- **Utils**: camelCase (formatCurrency.ts, validateEmail.ts)
- **Types**: PascalCase (SubmissionData, UserProfile, ReportStatus)
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL, MAX_FILE_SIZE)

## State Management
- **Auth state**: React Context (lib/auth/context.tsx)
- **Server state**: React Query (@tanstack/react-query)
- **Local UI state**: useState for component-specific state
- **Form state**: React Hook Form
- **NO Redux** unless absolutely necessary

## 📚 Complete Documentation

**For comprehensive project documentation, see:**
- **`/docs/PROJECT_GUIDE.md`** - Complete project guide (tech stack, database, API, deployment)
- **`/docs/DATABASE_SCHEMA.md`** - Detailed database schema with RLS policies
- **This file** - Frontend-specific guidelines and conventions

---

## 🎨 Design System (CRITICAL - READ FIRST)

**MANDATORY**: ALL components MUST import from `@/lib/design`

```typescript
import {
  gradientStyles,
  textStyles,
  buttonStyles,
  cardStyles,
  iconStyles,
  colors,
  cn
} from '@/lib/design';
```

### GOLDEN RULES

1. **NO HARDCODED COLORS**: Never use `bg-blue-900`, `text-teal-500`, etc.
2. **ONLY 2 BRAND COLORS**: Ocean Blue (#001A2E) and Gold (#FFC107)
3. **USE DESIGN TOKENS**: Import from `@/lib/design`, never raw values
4. **NO INLINE STYLES**: Use className with design tokens
5. **ICONS RARELY COLORED**: Only when semantically meaningful

### Brand Colors (ONLY THESE)

- **Primary**: Ocean Blue `hsl(195 100% 8%)` (#001A2E)
  - Usage: Primary text, backgrounds, main branding
  - Tailwind: `text-[hsl(195_100%_8%)]` or `bg-[hsl(195_100%_8%)]`

- **Accent**: Gold `hsl(45 100% 55%)` (#FFC107)
  - Usage: CTAs, highlights, pricing, accents
  - Tailwind: `text-[hsl(45_100%_55%)]` or `bg-[hsl(45_100%_55%)]`

### Semantic Colors (Rare Use Only)

- **Success**: Green - Only for success states, checkmarks
- **Warning**: Orange - Only for actual warnings
- **Error**: Red - Only for errors
- **Muted**: Gray - For disabled states, subtle text

**❌ FORBIDDEN**: Teal, orange, purple, blue (except semantic use)

### Pre-built Styles (USE THESE)

```typescript
// Buttons
<Button className={cn(buttonStyles.primary, buttonStyles.size.lg)}>

// Cards
<div className={cardStyles.hoverLift}>

// Typography
<h1 className={textStyles.h1}>
<p className={textStyles.body}>

// Icons (size only, color separately when needed)
<Icon className={cn(iconStyles.size.md, "text-[hsl(45_100%_55%)]")} />

// Sections
<section className={sectionStyles.withBg}>
  <div className={sectionStyles.container}>

// Gradients
<section className={gradientStyles.hero}>
```

### How to Check Compliance

```bash
# Before committing, search for violations:
grep -r "text-blue\|bg-teal\|text-orange" components/  # Should return nothing
grep -r "style={{" components/                         # Should return nothing
grep -r "@/lib/design" components/                     # Should be in every file
```

**Full documentation**: `/docs/DESIGN_SYSTEM.md`

### Typography
- **Body**: Inter (variable font)
- **Headings**: Work Sans (variable font)
- **Sizes**: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl

### Spacing
- **Consistent spacing**: Use Tailwind scale (4px increments)
- **Component padding**: p-4 (mobile), p-6 (tablet), p-8 (desktop)
- **Section margins**: mb-8 (mobile), mb-12 (tablet), mb-16 (desktop)

### Shadows & Effects
- **Soft shadows**: shadow-sm, shadow
- **Medium shadows**: shadow-md, shadow-lg
- **Strong shadows**: shadow-xl, shadow-2xl
- **Glassmorphism**: .glass class (background blur + opacity)
- **Gradients**: gradient-hero, gradient-imensiah classes

## Forms
- **Library**: React Hook Form
- **Validation**: Zod schemas
- **Real-time validation**: validateMode: "onChange"
- **Clear error messages**: Portuguese Brazilian
- **Loading states**: Disable submit button, show spinner
- **Success feedback**: Toast notification (Sonner)

### Form Pattern
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  website: z.string().url('URL inválida'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email')}
        label="Email"
        error={errors.email?.message}
      />
      <Button type="submit" loading={isSubmitting}>
        Enviar
      </Button>
    </form>
  );
}
```

## API Calls
- **Centralized**: lib/api/
- **TypeScript types**: For all requests and responses
- **Error handling**: try/catch with toast notifications
- **Loading states**: React Query isLoading
- **Caching**: React Query automatic caching

### API Pattern
```tsx
// lib/api/submissions.ts
export async function getSubmissions() {
  const response = await fetch('/api/submissions', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}

// In component
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['submissions'],
  queryFn: getSubmissions,
});
```

## Responsive Design
- **Mobile-first**: Start with 375px (mobile)
- **Breakpoints**:
  - `sm`: 640px (tablet portrait)
  - `md`: 768px (tablet landscape)
  - `lg`: 1024px (desktop)
  - `xl`: 1280px (large desktop)
- **Test on all breakpoints** before committing

### Responsive Patterns
- **Grids**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Padding**: `p-4 md:p-6 lg:p-8`
- **Text**: `text-2xl md:text-3xl lg:text-4xl`
- **Hide/Show**: `hidden md:block`, `block md:hidden`

## Accessibility
- **Semantic HTML**: Use correct tags (nav, header, main, article, section)
- **ARIA labels**: On all interactive elements
- **Keyboard navigation**: Focus states, tab order
- **Screen reader support**: aria-label, aria-describedby
- **Color contrast**: WCAG AA compliant (4.5:1 for text)
- **Form labels**: Always associate label with input
- **Error messages**: Link to inputs with aria-describedby

## Performance
- **Images**: Use next/image for all images
- **Lazy loading**: Below-fold content with React.lazy()
- **Code splitting**: Per route (automatic with App Router)
- **Font optimization**: Variable fonts, font-display: swap
- **Bundle size**: Monitor with next build

## Testing
- **Unit tests**: Utility functions
- **Component tests**: React Testing Library
- **E2E tests**: Playwright for critical flows:
  - Landing page → Form submission → Payment
  - Login → Dashboard → View report
  - Admin → Review submission → Approve

## When Adding Features
1. **Read this CLAUDE.md** (every time!)
2. **Check existing components** in /components/ui/ (don't reinvent)
3. **Follow naming conventions** (PascalCase for components, camelCase for functions)
4. **Keep files small** (< 200 lines per component)
5. **Mobile-first responsive** (test at 375px, 768px, 1024px+)
6. **TypeScript types** for everything
7. **Error handling** with try/catch and toasts
8. **Loading states** for async operations
9. **Accessibility** (ARIA labels, semantic HTML)
10. **Test on multiple devices** before committing

## Critical Dad's Dashboard Fixes
When building admin submission detail page:

### 1. Enrichment Data Display
- **NOT**: Just show "enrichment_sessions" object
- **YES**: Parse and display actual usable data:
  - Website data (title, description, keywords)
  - LinkedIn data (company info, employee count)
  - Social media (Instagram, TikTok profiles)
  - Brazil DBs (CNPJ, registration data)
- Show **confidence scores** per field
- Highlight **conflicts** (e.g., email domain ≠ website domain)

### 2. Status Tracking
- **Separate** AI status from Review status:
  - **AI Status**: queued → collecting_data → analyzing → complete/failed
  - **Review Status**: analysis_complete → in_review → approved → delivered
- Show progress bars, timestamps, logs

### 3. Quality Assessment
- **NOT**: Just "Dados Mínimos"
- **YES**: Explain what it means:
  - Data completeness: X/15 fields filled
  - Average confidence score: 0.85
  - Red flags list:
    - Conflicting data detected
    - Generic analysis warning
    - Low confidence fields: [list]
    - Missing critical data: [list]

### 4. Conflict Detection
- Alert dad when:
  - Email domain ≠ website domain
  - LinkedIn company ≠ submitted company name
  - CNPJ data ≠ submitted data
- Visual indicators (red badge, warning icon)

## Environment Variables
Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Common Pitfalls to Avoid
1. ❌ Creating new UI components when one exists
2. ❌ Using inline styles instead of Tailwind
3. ❌ Prop drilling (use Context for auth, React Query for data)
4. ❌ Not handling loading/error states
5. ❌ Forgetting mobile responsiveness
6. ❌ Not using TypeScript types
7. ❌ Creating files > 200 lines
8. ❌ Not testing on multiple breakpoints
9. ❌ Missing ARIA labels
10. ❌ Hardcoding API URLs (use env vars)

## Success Checklist
Before marking a feature complete:
- [ ] Component < 200 lines (or extracted)
- [ ] TypeScript types defined
- [ ] Responsive (tested 375px, 768px, 1024px+)
- [ ] Loading state shown
- [ ] Error handling with toast
- [ ] ARIA labels on interactive elements
- [ ] No inline styles
- [ ] No prop drilling
- [ ] Uses existing UI components
- [ ] Follows naming conventions
- [ ] Env vars for API URLs
- [ ] Portuguese Brazilian text

---

**Remember**: This CLAUDE.md is your single source of truth. Read it before every coding session. Follow it exactly to prevent debugging hell and ensure consistency across the entire frontend.
