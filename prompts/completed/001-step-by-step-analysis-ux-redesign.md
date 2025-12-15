<objective>
Redesign the step-by-step analysis UI/UX to create an intuitive, beautiful, and consistent experience for admins navigating through the 14 strategic framework steps.

The current implementation has basic functionality but lacks polish. This redesign focuses on:
1. Pill-based step navigation with clickable dots
2. In-page content transitions (no route changes)
3. Auto-generation of Step 1 when starting analysis
4. Consistent minimalist design matching the admin panel aesthetic
5. Clear visual feedback for all states
</objective>

<context>
**Project**: IMENSIAH strategic analysis platform (Next.js 15, React 18, TypeScript, Tailwind CSS, Radix UI)
**Branch**: feature/IAH-04-step-by-step-ui
**Working Directory**: frontend_v2 (separate repo from backend_v3)

**Existing Files to Modify**:
- `src/app/(admin)/admin/analysis-by-steps/[id]/page.tsx` - Main page component
- `src/components/features/analysis-by-steps/step-progress.tsx` - Progress indicator
- `src/components/features/analysis-by-steps/step-actions.tsx` - Action buttons
- `src/components/features/analysis-by-steps/previous-steps.tsx` - Previous steps accordion
- `src/lib/hooks/use-analysis-by-steps.ts` - React Query hooks

**Design Reference**: Study `src/app/(admin)/admin/companies/[id]/page.tsx` for:
- Color palette (navy-900, gold-500/600, text-muted-foreground)
- Badge styling patterns
- Section/card layouts
- Button variants
- Typography (uppercase tracking-wide labels, font-medium headings)

**Backend Already Supports** (DO NOT modify backend):
- GET `/analyses/{id}/steps/state` - Returns current_step, all steps, framework metadata
- POST `/analyses/{id}/steps/{stepNumber}/generate` - Generate AI content
- PUT `/analyses/{id}/steps/{stepNumber}/edit` - Save human edits
- POST `/analyses/{id}/steps/{stepNumber}/approve` - Approve and advance
- PATCH `/analyses/{id}/steps/{stepNumber}/visibility` - Toggle visibility

**14 Framework Steps** (step_number 0-13):
0. challenge_refinement, 1. pestel, 2. porter, 3. benchmarking, 4. swot, 5. swotcross,
6. tam_sam_som, 7. blue_ocean, 8. growth_hacking, 9. scenarios, 10. decision_matrix,
11. okrs, 12. bsc, 13. synthesis
</context>

<requirements>
<ui_navigation>
**Pill-Based Step Navigation**:
- Replace current progress bar with horizontal pill badges
- Each pill shows: step number + abbreviated framework name (e.g., "1. PESTEL", "5. SWOT")
- Clickable pills for steps 0 through current frontier (furthest generated step)
- Pills beyond frontier are disabled/grayed out
- Visual states:
  - **Approved**: Filled navy-900 background, white text
  - **Current/Active**: Gold border ring, gold text on white background
  - **Generated (not approved)**: Light gold background, navy text
  - **Pending**: Gray background, muted text, disabled cursor
- Show "5/14 concluídas" progress indicator alongside pills
- Pills should wrap nicely on mobile (flex-wrap)
</ui_navigation>

<in_page_transitions>
**In-Page Navigation** (NOT route-based):
- When clicking a pill, content swaps in place with subtle fade/slide animation
- Use Framer Motion (already installed) for smooth transitions
- Maintain scroll position or scroll to top of editor area
- Track `selectedStep` in local state, separate from `currentStep` (frontier)
- When viewing a previous step (selectedStep < currentStep):
  - Show "Você está visualizando uma etapa anterior" info banner
  - Enable full editing and saving
  - On save, show warning toast: "Alterações salvas. Etapas posteriores não foram afetadas."
</in_page_transitions>

<auto_generation>
**Auto-Generate on Start**:
- When `useStartAnalysisBySteps` succeeds and redirects to this page:
- If step 0 has status "pending", automatically trigger `generateStep` mutation
- Show generating state immediately with skeleton/loader in editor area
- This eliminates the need for user to manually click "Gerar com IA" on first load
</auto_generation>

<completion_flow>
**Completion Behavior**:
- When final step (synthesis, step 13) is approved:
- Auto-redirect to `/report/{accessCode}` immediately
- The approve mutation already returns `is_complete: true` and `access_code`
</completion_flow>

<visual_design>
**Consistent Minimalist Design**:
- Match admin company page aesthetic (see design reference files)
- Use existing design tokens: `text-navy-900`, `text-gold-600`, `bg-gold-50`, `border-line`
- Card containers: `bg-white border border-line p-4 lg:p-6`
- Section headers: `text-sm font-medium uppercase tracking-wide`
- Status badges: Use existing Badge component patterns from companies page
- Buttons: Use existing Button variants (outline, ghost, architect)
- Remove emoji icons from step progress (use Lucide icons instead)
- Clean typography, generous whitespace
</visual_design>

<editor_area>
**Step Editor Area Improvements**:
- Wrap editor in a well-styled card container
- Add framework name as card header
- Show step number badge in header
- Guidance text should be in a collapsible info tooltip (use Radix Tooltip), not always visible
- Visibility toggle should be more prominent with clear labels
- Action buttons should be sticky at bottom on mobile
</editor_area>

<state_management>
**State Management**:
- `selectedStepNumber`: Which step is currently being viewed (local state)
- `currentStepNumber`: The frontier step (from API response)
- When user clicks pill: `setSelectedStepNumber(n)`, fetch that step's data
- Use React Query's existing caching to avoid refetching viewed steps
- Handle generating state: disable pill navigation while generating
</state_management>
</requirements>

<implementation>
**Step 1: Create New StepNavigationPills Component**
Create `src/components/features/analysis-by-steps/step-navigation-pills.tsx`:
- Props: `steps: AnalysisStep[]`, `selectedStep: number`, `currentStep: number`, `onSelect: (n: number) => void`, `disabled: boolean`
- Render horizontal flex container with wrapped pills
- Use conditional styling based on step status and selection
- Include progress counter "X/14 concluídas"

**Step 2: Refactor Main Page for In-Page Navigation**
Modify `src/app/(admin)/admin/analysis-by-steps/[id]/page.tsx`:
- Add `selectedStepNumber` state (default to current frontier)
- Fetch all steps on mount (use existing useAllSteps hook)
- Pass selectedStep data to editor instead of always current
- Add AnimatePresence wrapper around editor for transitions
- Implement auto-generate logic in useEffect

**Step 3: Enhance Step Progress Component**
Replace content in `src/components/features/analysis-by-steps/step-progress.tsx`:
- Remove old progress bar implementation
- Use new StepNavigationPills component
- Add proper header with back button and report link

**Step 4: Add Warning Banner Component**
Create `src/components/features/analysis-by-steps/edit-warning-banner.tsx`:
- Shows when viewing a step before the frontier
- Subtle info style (light blue/gray background)
- Dismissible or persistent based on preference

**Step 5: Update Step Actions for Context**
Modify `src/components/features/analysis-by-steps/step-actions.tsx`:
- Add prop `isViewingPreviousStep: boolean`
- When viewing previous: hide "Aprovar e Continuar", only show "Salvar"
- When on frontier: show full action set (Generate, Save, Approve)

**Step 6: Polish Editor Container**
Modify `src/components/features/analysis-by-steps/step-editor.tsx`:
- Add proper card wrapper with header
- Move guidance text to info icon tooltip
- Improve spacing and visual hierarchy

**Step 7: Update Types if Needed**
Check `src/lib/types/domain.ts` for any missing types (FrameworkMeta, etc.)
</implementation>

<constraints>
- DO NOT modify any backend code (backend_v3 folder)
- DO NOT change API endpoints or request/response shapes
- DO NOT break existing functionality - this is a UI enhancement
- Keep all text in Portuguese (Brazilian) to match existing app
- Use existing UI components from `@/components/ui/*` (Radix-based)
- Maintain mobile responsiveness
- Keep bundle size reasonable - avoid adding new heavy dependencies
</constraints>

<output>
Files to create:
- `./src/components/features/analysis-by-steps/step-navigation-pills.tsx`
- `./src/components/features/analysis-by-steps/edit-warning-banner.tsx`

Files to modify:
- `./src/app/(admin)/admin/analysis-by-steps/[id]/page.tsx`
- `./src/components/features/analysis-by-steps/step-progress.tsx`
- `./src/components/features/analysis-by-steps/step-actions.tsx`
- `./src/components/features/analysis-by-steps/step-editor.tsx`
- `./src/components/features/analysis-by-steps/index.ts` (add new exports)

Optionally modify:
- `./src/lib/types/domain.ts` (if FrameworkMeta type is missing)
</output>

<verification>
Before declaring complete:

1. **Visual Check**: The pill navigation renders correctly with proper styling
2. **Navigation Test**: Click different pills, content transitions smoothly
3. **State Test**: Previous steps show warning banner, frontier step doesn't
4. **Auto-Generate Test**: Starting new analysis auto-triggers step 0 generation
5. **Save Flow Test**: Editing previous step shows warning toast on save
6. **Completion Test**: Approving step 13 redirects to report
7. **Mobile Test**: Responsive design, pills wrap, actions are accessible
8. **Type Check**: Run `npm run type-check` - no TypeScript errors
9. **Lint Check**: Run `npm run lint` - no ESLint errors

Test commands:
!npm run type-check
!npm run lint
!npm run dev
</verification>

<success_criteria>
- Admin can see all 14 steps as clickable pills at top of page
- Pills show clear visual distinction between approved/current/pending states
- Clicking a previous step loads its content in-place with animation
- Editing a previous step is possible with warning feedback
- New analysis auto-starts generating step 0
- Final approval redirects to report automatically
- Design is consistent with admin company page aesthetic
- No TypeScript or ESLint errors
- Fully responsive on mobile devices
</success_criteria>
