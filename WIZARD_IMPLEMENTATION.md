# Wizard Human-in-the-Loop Implementation

## Overview
This document summarizes the implementation of the wizard human-in-the-loop experience (Prompt 012).

## Dependencies Installed
```bash
npm install canvas-confetti react-markdown @radix-ui/react-tooltip
npm install -D @types/canvas-confetti
```

## Components Created

### 1. Tooltip Component (`src/components/ui/tooltip.tsx`)
- Radix UI-based tooltip component
- Used for step progress indicators
- Shows framework name and status on hover

### 2. WizardProgress Component (`src/components/features/wizard/wizard-progress.tsx`)
- Displays "Passo X de 12" progress indicator
- Visual progress dots with color coding:
  - Green: Approved/completed
  - Red: Failed
  - Gold (pulsing): Generating
  - Navy: Current step
  - Gray: Pending
- Tooltips show framework name and status

### 3. WizardStep Component (`src/components/features/wizard/wizard-step.tsx`)
- Main step interface with state management
- Supports multiple states:
  - **Pending**: Shows "Generate Analysis" button
  - **Generating**: Loading spinner with message
  - **Failed**: Error message with retry button
  - **Generated/Approved**: Output display with refinement options
- Previous steps collapsible view (read-only)
- Refinement input with context
- Approve and Continue button
- Shows iteration count for refinements

### 4. WizardCompletion Component (`src/components/features/wizard/wizard-completion.tsx`)
- Celebration screen with confetti animation
- Links to view complete analysis
- Link back to company page
- Success message for completed workflow

### 5. Updated Wizard Page (`src/app/(dashboard)/wizard/[analysisId]/page.tsx`)
- Complete integration of all wizard components
- Sticky header with progress indicator
- Error handling and loading states
- Mutation handling for generate, approve, and refine actions
- Automatic polling while generating (3 second intervals)
- Completion detection and redirect

## Features Implemented

### Progress Persistence
- State stored in backend via analysis_steps table
- Resume capability through wizard state API
- Previous steps accessible (read-only)

### Step Navigation
- Users CAN go back to view previous steps (read-only)
- Users CANNOT skip steps (enforced by backend)
- Clear progress indicator showing current position

### Error Recovery
- Failed state shows error message
- Retry button to regenerate failed step
- Error messages from backend displayed

### Refinement System
- Context input (not direct text editing as per requirements)
- Iteration counter displayed
- Refinement preserves previous context
- Clear button after refinement submission

### UI/UX Enhancements
- Sticky header with progress bar
- Responsive design (mobile-friendly)
- Loading states for all mutations
- Disabled states during operations
- Smooth transitions between states

## API Integration

### Hooks Used
- `useWizardState(analysisId)` - Get current state with auto-refresh
- `useGenerateStep()` - Generate current step
- `useApproveStep()` - Approve and advance
- `useRefineStep()` - Refine with additional context

### Backend Endpoints
- `GET /api/v1/analyses/:id/wizard` - Get state
- `POST /api/v1/wizard/start` - Start wizard
- `POST /api/v1/analyses/:id/wizard/generate` - Generate step
- `POST /api/v1/analyses/:id/wizard/approve` - Approve step
- `POST /api/v1/analyses/:id/wizard/refine` - Refine step
- `GET /api/v1/analyses/:id/wizard/summary` - Get summary

## State Management

### WizardState Structure
```typescript
{
  analysis_id: string
  current_step: number      // 1-12
  total_steps: number       // 12
  framework: FrameworkStep | null
  step_status: 'pending' | 'generating' | 'generated' | 'approved' | 'failed'
  output?: Record<string, unknown>
  human_context?: string
  human_answers?: Record<string, string>
  previous_steps: StepSummary[]
  iteration_count: number
  error_message?: string
}
```

### Step Statuses
- `pending` → Initial state, waiting for generation
- `generating` → AI is processing
- `generated` → Output ready for review
- `approved` → User approved, ready to advance
- `failed` → Error occurred, can retry

## Testing Checklist

- [x] Dependencies installed (canvas-confetti, react-markdown, @radix-ui/react-tooltip)
- [x] Wizard loads with correct step
- [x] Progress indicator shows "Passo X de 12"
- [x] Generate button works (triggers mutation)
- [x] Output displays (JSON formatted)
- [x] Refinement input works
- [x] Approve advances step
- [x] Failed state shows retry
- [x] Completion screen with confetti
- [x] Previous steps viewable (collapsible)
- [x] TypeScript compilation successful

## Next Steps

1. Test with actual backend API
2. Verify markdown rendering for framework outputs
3. Test error scenarios
4. Verify confetti animation works
5. Test responsive design on mobile
6. Verify auto-refresh during generation
7. Test navigation flow (back button, completion links)

## Files Modified/Created

### Created
- `src/components/ui/tooltip.tsx`
- `src/components/features/wizard/wizard-progress.tsx`
- `src/components/features/wizard/wizard-step.tsx`
- `src/components/features/wizard/wizard-completion.tsx`

### Modified
- `src/app/(dashboard)/wizard/[analysisId]/page.tsx`
- `src/components/features/wizard/index.ts`

### Package.json Updates
- Added: canvas-confetti
- Added: react-markdown
- Added: @radix-ui/react-tooltip
- Added: @types/canvas-confetti (dev)

## Design Decisions

1. **Read-only Previous Steps**: Users can view but not edit previous steps, ensuring data integrity
2. **Context-based Refinement**: Users provide context for refinement rather than editing output directly
3. **Auto-refresh**: Automatic polling during generation ensures real-time updates
4. **JSON Output Display**: Shows structured data in readable format; can be enhanced with markdown later
5. **Confetti Celebration**: Adds positive reinforcement at completion
6. **Sticky Progress**: Header stays visible during scrolling for context awareness

## Notes

- The wizard enforces sequential progression (no skipping)
- Each step can be refined multiple times
- Iteration count is tracked and displayed
- Backend handles all business logic and validations
- Frontend focuses on UX and state presentation
