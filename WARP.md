# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Radix UI (Shadcn/UI)
- **Backend/Auth**: Supabase
- **State Management**: React Query (@tanstack/react-query), React Hook Form, Zod
- **Testing**: Playwright (E2E)

## Common Commands
### Development
- `npm run dev`: Start the development server.
- `npm run lint`: Lint code using ESLint.
- `npm run type-check`: Run TypeScript type checking.
- `npm run build`: Build the application for production.

### Testing
- `npm run test:e2e`: Run all E2E tests (headless).
- `npm run test:e2e:ui`: Run tests with UI mode (recommended for debugging).
- `npm run test:e2e:headed`: Run tests in headed mode (browser visible).
- `npm run test:e2e:report`: Show the Playwright test report.

## Architecture & Structure

### Directory Structure
- `app/`: Next.js App Router pages and layouts.
  - `(dashboard)/`: Protected user dashboard routes.
  - `(public)/`: Public facing pages.
  - `admin/`: Admin-specific routes (requires admin role).
  - `auth/`: Authentication routes (signup, password reset).
- `components/`: React components.
  - `ui/`: Reusable UI components (Shadcn/UI).
  - `mobile/`: Mobile-optimized components (BottomNav, Cards).
  - `admin/`, `workflow/`: Feature-specific components.
- `lib/`: Utilities and library code.
  - `utils/`: Helper functions (mobile detection, workflow logic, formatting).
- `tests/`: Playwright E2E tests.

### Authentication (Supabase)
- **Middleware**: `middleware.ts` protects routes.
  - Public routes: `/`, `/login`, `/auth/*`.
  - Admin routes: `/admin/*` require `admin` or `super_admin` role in `user_profiles` table.
- **Client**: `lib/utils/supabase-client.ts` for client-side usage.

### Mobile Implementation
This project has a "Mobile-First" focus. Refer to `MOBILE_README.md` for details.
- **Breakpoints**: Custom breakpoints in `tailwind.config.ts` (xs: 375px).
- **Detection**: `lib/utils/mobile.ts` contains `isMobile()`, `formatDateMobile()`.
- **Components**: Use `components/mobile` for mobile-specific views (e.g., `MobileSubmissionCard`).
- **Design**: Ensure touch targets are min 44px. Safe area insets are handled for iOS.

### Workflows
- Core business logic around workflows resides in `lib/utils/workflow.ts` and `workflow-helpers.ts`.
- Workflow components are in `components/workflow/`.

## Development Guidelines
- **Supabase**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`.
- **Mobile Testing**: Test changes on mobile viewports (Chrome DevTools or physical device).
- **Styling**: Use `cn()` for class merging. Prefer Tailwind classes over custom CSS.
