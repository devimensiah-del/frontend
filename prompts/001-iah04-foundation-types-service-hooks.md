<objective>
Implement the foundation layer for IAH-04 step-by-step analysis feature: TypeScript types, API service, and React Query hooks.

This is Phase 1 of the IAH-04 (Jira) implementation - creating the data layer that all UI components will depend on.
</objective>

<context>
Project: IMENSIAH frontend_v2 - Next.js 15, React 18, TypeScript, React Query 5
Backend: IAH-3 API already implemented at `/api/v1/analyses/steps/*`

Read these files first to understand existing patterns:
- @src/lib/types/domain.ts - Existing TypeScript types (add new types here)
- @src/lib/api.ts - API client configuration
- @src/lib/services/admin-service.ts - Service pattern to follow
- @src/lib/hooks/use-admin.ts - React Query hook patterns
- @src/lib/services/index.ts - Service exports
- @src/lib/hooks/index.ts - Hook exports
</context>

<requirements>
## 1. Add TypeScript Types to domain.ts

Add these types at the end of `src/lib/types/domain.ts`:

```typescript
// ============================================================================
// Step-by-Step Analysis Types (IAH-3)
// ============================================================================

export type StepStatus = 'pending' | 'generating' | 'generated' | 'approved' | 'failed'

export type FrameworkCode =
  | 'challenge_refinement'
  | 'pestel'
  | 'porter'
  | 'benchmarking'
  | 'swot'
  | 'swotcross'
  | 'tam_sam_som'
  | 'blue_ocean'
  | 'growth_hacking'
  | 'scenarios'
  | 'decision_matrix'
  | 'okrs'
  | 'bsc'
  | 'synthesis'

export interface AnalysisStep {
  id: string
  analysis_id: string
  framework_code: FrameworkCode
  step_number: number
  ai_output?: string | null
  human_edited?: string | null
  visible: boolean
  status: StepStatus
  generated_at?: string | null
  approved_at?: string | null
  created_at: string
  updated_at: string
  effective_output?: string | null
  is_edited: boolean
}

export interface FrameworkMeta {
  code: FrameworkCode
  name: string
  guidance_text: string
}

export interface StartAnalysisResponse {
  analysis_id: string
  challenge_id: string
  total_steps: number
  current_step: number
  steps: AnalysisStep[]
}

export interface ApproveResponse {
  approved_step: AnalysisStep
  next_step: AnalysisStep | null
  is_complete: boolean
  current_step: number
}

export interface StepStateResponse {
  analysis_id: string
  current_step: number
  total_steps: number
  current_step_data: AnalysisStep | null
  previous_steps: AnalysisStep[]
  framework_meta: FrameworkMeta | null
}
```

## 2. Create API Service

Create `src/lib/services/analysis-by-steps-service.ts`:

```typescript
import api from '@/lib/api'
import type {
  AnalysisStep,
  StartAnalysisResponse,
  ApproveResponse,
  StepStateResponse,
} from '@/lib/types'

export const analysisByStepsService = {
  // Start new step-by-step analysis
  start: (challengeId: string) =>
    api.post<StartAnalysisResponse>('/analyses/steps/start', { challenge_id: challengeId })
      .then(r => r.data),

  // Generate AI output for a step
  generateStep: (analysisId: string, stepNumber: number) =>
    api.post<{ step: AnalysisStep }>(`/analyses/${analysisId}/steps/${stepNumber}/generate`)
      .then(r => r.data.step),

  // Save human edit
  saveEdit: (analysisId: string, stepNumber: number, editedContent: string) =>
    api.put<{ step: AnalysisStep }>(`/analyses/${analysisId}/steps/${stepNumber}/edit`, { edited_content: editedContent })
      .then(r => r.data.step),

  // Approve step and advance
  approveStep: (analysisId: string, stepNumber: number) =>
    api.post<ApproveResponse>(`/analyses/${analysisId}/steps/${stepNumber}/approve`)
      .then(r => r.data),

  // Get current state for UI
  getState: (analysisId: string) =>
    api.get<StepStateResponse>(`/analyses/${analysisId}/steps/state`)
      .then(r => r.data),

  // Get all steps
  getSteps: (analysisId: string) =>
    api.get<{ steps: AnalysisStep[] }>(`/analyses/${analysisId}/steps`)
      .then(r => r.data.steps),

  // Toggle visibility in report
  toggleVisibility: (analysisId: string, stepNumber: number, visible: boolean) =>
    api.patch<{ step: AnalysisStep }>(`/analyses/${analysisId}/steps/${stepNumber}/visibility`, { visible })
      .then(r => r.data.step),
}
```

## 3. Create React Query Hooks

Create `src/lib/hooks/use-analysis-by-steps.ts`:

```typescript
'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { analysisByStepsService } from '@/lib/services/analysis-by-steps-service'

// Query key factory
const stepKeys = {
  all: ['analysis-steps'] as const,
  state: (analysisId: string) => [...stepKeys.all, 'state', analysisId] as const,
  steps: (analysisId: string) => [...stepKeys.all, 'list', analysisId] as const,
}

// Start a new step-by-step analysis
export function useStartAnalysisBySteps() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (challengeId: string) => analysisByStepsService.start(challengeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
      toast.success('Análise por etapas iniciada')
    },
    onError: () => {
      toast.error('Erro ao iniciar análise por etapas')
    },
  })
}

// Generate AI output for current step
export function useGenerateStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ analysisId, stepNumber }: { analysisId: string; stepNumber: number }) =>
      analysisByStepsService.generateStep(analysisId, stepNumber),
    onSuccess: (_, { analysisId }) => {
      queryClient.invalidateQueries({ queryKey: stepKeys.state(analysisId) })
      toast.success('Conteúdo gerado com sucesso')
    },
    onError: () => {
      toast.error('Erro ao gerar conteúdo')
    },
  })
}

// Save human edit
export function useSaveStepEdit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ analysisId, stepNumber, content }: { analysisId: string; stepNumber: number; content: string }) =>
      analysisByStepsService.saveEdit(analysisId, stepNumber, content),
    onSuccess: (_, { analysisId }) => {
      queryClient.invalidateQueries({ queryKey: stepKeys.state(analysisId) })
      toast.success('Alterações salvas')
    },
    onError: () => {
      toast.error('Erro ao salvar alterações')
    },
  })
}

// Approve step and advance
export function useApproveStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ analysisId, stepNumber }: { analysisId: string; stepNumber: number }) =>
      analysisByStepsService.approveStep(analysisId, stepNumber),
    onSuccess: (data, { analysisId }) => {
      queryClient.invalidateQueries({ queryKey: stepKeys.state(analysisId) })
      queryClient.invalidateQueries({ queryKey: stepKeys.steps(analysisId) })
      if (data.is_complete) {
        toast.success('Análise concluída!')
        queryClient.invalidateQueries({ queryKey: ['challenges'] })
      } else {
        toast.success('Etapa aprovada')
      }
    },
    onError: () => {
      toast.error('Erro ao aprovar etapa')
    },
  })
}

// Get current step state (polls while generating)
export function useStepState(analysisId: string) {
  return useQuery({
    queryKey: stepKeys.state(analysisId),
    queryFn: () => analysisByStepsService.getState(analysisId),
    enabled: !!analysisId,
    refetchInterval: (query) => {
      // Poll every 3s while generating
      const status = query.state.data?.current_step_data?.status
      return status === 'generating' ? 3000 : false
    },
    staleTime: 10 * 1000, // 10 seconds
  })
}

// Get all steps
export function useAllSteps(analysisId: string) {
  return useQuery({
    queryKey: stepKeys.steps(analysisId),
    queryFn: () => analysisByStepsService.getSteps(analysisId),
    enabled: !!analysisId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Toggle step visibility
export function useToggleStepVisibility() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ analysisId, stepNumber, visible }: { analysisId: string; stepNumber: number; visible: boolean }) =>
      analysisByStepsService.toggleVisibility(analysisId, stepNumber, visible),
    onSuccess: (_, { analysisId }) => {
      queryClient.invalidateQueries({ queryKey: stepKeys.state(analysisId) })
      toast.success('Visibilidade atualizada')
    },
    onError: () => {
      toast.error('Erro ao alterar visibilidade')
    },
  })
}
```

## 4. Update Exports

Add to `src/lib/services/index.ts`:
```typescript
export * from './analysis-by-steps-service'
```

Add to `src/lib/hooks/index.ts`:
```typescript
export * from './use-analysis-by-steps'
```
</requirements>

<verification>
After implementation, verify:
1. No TypeScript errors: `npm run type-check`
2. Types are properly exported from domain.ts
3. Service follows existing patterns from admin-service.ts
4. Hooks follow existing patterns from use-admin.ts
5. Exports are added to index files
</verification>

<success_criteria>
- All new types added to domain.ts with proper exports
- analysis-by-steps-service.ts created with all 7 API methods
- use-analysis-by-steps.ts created with all hooks including polling
- Service and hooks exported from index files
- No TypeScript compilation errors
</success_criteria>
