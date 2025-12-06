# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the frontend codebase.

## Project Overview

Next.js 15 frontend for IMENSIAH business intelligence platform. Users submit company information, view enrichment data, and access strategic analysis reports through a multi-tenant dashboard.

## Build & Development Commands

```bash
# Development
npm run dev            # Start dev server (port 3000)

# Build & Production
npm run build          # Production build
npm run start          # Start production server

# Code Quality
npm run lint           # ESLint
npm run type-check     # TypeScript check

# E2E Tests (Playwright)
npm run test:e2e       # Headless E2E tests
npm run test:e2e:ui    # Playwright UI mode
```

## Architecture (2025 Refactor)

### Route Groups (App Router)
```
app/
├── (public)/          # Landing, submission form, thank you
├── (landing)/         # Marketing pages (metodologia, etc.)
├── (dashboard)/       # Protected user routes
│   ├── dashboard/     # User dashboard
│   ├── submissions/   # Submission details & wizard
│   └── companies/     # User company management
├── (admin)/           # Protected admin-only routes
│   └── admin/         # Admin dashboard, submissions, analysis, macroeconomia
├── auth/              # Login, signup, password reset
└── report/[code]/     # Public report viewing (access code)
```

### Component Hierarchy (Design System)
```
components/
├── atoms/             # Basic building blocks (Button, Input, Badge, etc.)
├── molecules/         # Composite components (FormField, Card variants, etc.)
├── organisms/         # Complex UI patterns (forms, tables, modals)
├── layouts/           # Page layouts (Stack, Grid, Container, Section)
├── editorial/         # Editorial design components (Section, Container)
├── wizard/            # Wizard flow components (WizardStep, WizardProgress, etc.)
├── workflow/          # Workflow progress tracking
└── ui/                # Legacy Radix-based components (being phased out)
```

### Design System Tokens
```
lib/design-system/
├── tokens.ts          # Colors, spacing, typography
├── types.ts           # Design system types
└── index.ts           # Exports
```

### State Management
```
lib/
├── providers/
│   └── AuthProvider.tsx   # Auth context (Supabase + Backend)
├── api/
│   └── client.ts          # Typed API client
└── hooks/                 # React Query hooks
```

## Key Patterns

### Authentication
- **Hybrid approach**: Supabase for auth, Backend API for user data
- **Token storage**: localStorage (`auth_token`) + cookies (`sb-access-token`)
- **Middleware**: Auth check only; role check at page level
- **Provider**: `useAuthContext()` hook for auth state

### API Client
```typescript
// lib/api/client.ts - All backend communication
import { apiClient } from '@/lib/api/client';

apiClient.submissions.getById(id);
apiClient.enrichment.getBySubmissionId(id);
apiClient.analysis.getBySubmissionId(id);
apiClient.admin.toggleVisibility(analysisId, true);
apiClient.companies.getMyCompanies();
```

### Route Protection
- `/login`, `/`, `/report/*`, `/landing/*` → Public
- `/dashboard/*`, `/submissions/*`, `/companies/*` → JWT required (user routes)
- `/admin/*` → JWT + admin role (admin-only routes, page-level check)

## API Response Conventions

```typescript
// Single entity
{ submission: Submission }
{ enrichment: Enrichment }
{ analysis: Analysis }

// Paginated list
{ data: T[], total: number }

// Actions
{ message: string }

// Errors
{ error: string }
```

## Required Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Component Conventions

### File Structure per Component
```
components/feature/
├── FeatureComponent.tsx    # Main component
├── FeatureComponent.test.tsx
└── index.ts                # Barrel export
```

### Import Aliases
```typescript
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/lib/providers/AuthProvider';
import { apiClient } from '@/lib/api/client';
import type { Submission } from '@/types';
```

## AI Agent Warnings

### NEVER Change
- **Auth token keys**: `auth_token`, `sb-access-token`, `sb-refresh-token`
- **API response unwrapping**: Always destructure (e.g., `response.submission`)
- **Route group structure**: `(public)`, `(dashboard)`, `(landing)` naming
- **Middleware public routes array**: Must match actual public routes

### MUST Preserve
- **Token persistence on login**: Both localStorage AND cookies
- **404 handling for enrichment/analysis**: Expected when data not yet created
- **Admin role check pattern**: Page-level, not middleware

### Common Mistakes to Avoid
- Don't call Supabase Auth directly for login/signup (use backend proxy)
- Don't assume enrichment/analysis exists (check for 404)
- Don't add auth to `/report/[code]` (public via access code)
- Don't remove cookie setting in `signIn()` (breaks middleware)

## Workflow Status Display

Status flows are tracked on child entities, not submission:
- **Submission**: Always `received` (never changes)
- **Enrichment**: `pending` → `processing` → `completed` | `failed`
- **Analysis**: `pending` → `completed` → `approved` → `sent`

Frontend derives "overall status" from enrichment + analysis statuses.

**IMPORTANT**: EnrichmentStatus does NOT have an "approved" state. Only Analysis has approval workflow.

## UI Design System

- **Framework**: Radix UI primitives + Tailwind CSS
- **Icons**: Lucide React
- **Theme**: CSS variables for color tokens (see `lib/design-system/tokens.ts`)
- **Responsive**: Mobile-first breakpoints
- **Architecture**: Atomic Design (atoms → molecules → organisms → layouts)

## Error Handling

Production-ready error handling with centralized error messages:
- `lib/utils/error-messages.ts` - User-friendly error mapping
- `lib/api/error-handler.ts` - API error transformation

```typescript
import { getErrorMessage, getErrorTitle } from '@/lib/utils/error-messages';

try {
  await someApiCall();
} catch (error) {
  const message = getErrorMessage(error);
  const title = getErrorTitle(error);
  toast({ title, description: message, variant: 'destructive' });
}
```

## Recent Refactor (Prompts 001-006)

### What Was Changed
1. **Design System**: Introduced atoms/molecules/organisms/layouts hierarchy
2. **Landing Page**: Consolidated into single editorial layout
3. **Dashboards**: Rebuilt user and admin dashboards with new components
4. **Admin Routes**: Moved from `(dashboard)/admin/` to dedicated `(admin)/` route group
5. **Error Handling**: Centralized error messages in `lib/utils/error-messages.ts`
6. **Type Safety**: Fixed all EnrichmentStatus references (removed invalid "approved" state)

### What Was Deleted
- `app/(dashboard)/admin/` - Old admin routes (moved to `app/(admin)/`)
- `app/(dashboard)/dashboard/macroeconomia/` - Moved to admin
- Various unused components replaced by new design system

### Running the App
1. Ensure backend is running on port 8080
2. Run `npm run dev` for development
3. Access user dashboard at `http://localhost:3000/dashboard`
4. Access admin panel at `http://localhost:3000/admin` (requires admin role)
