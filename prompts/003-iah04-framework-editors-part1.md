<objective>
Create the first batch of framework-specific editors for IAH-04: PESTEL, SWOT, Porter, Benchmarking, and TAM-SAM-SOM.

These are structured form editors that allow users to edit AI-generated framework outputs using editable fields and lists.
</objective>

<context>
Project: IMENSIAH frontend_v2 - Next.js 15, React 18, TypeScript
Dependencies: Phase 1 and 2 must be complete

Read these files to understand patterns:
- @src/lib/types/domain.ts - Framework type definitions (PESTELAnalysis, SWOTAnalysis, etc.)
- @src/app/(admin)/admin/companies/[id]/page.tsx - EditableField and EditableList patterns
- @src/components/report/frameworks/PESTELView.tsx - Read-only view structure
- @src/components/report/frameworks/SWOTView.tsx - SWOT structure with items
</context>

<requirements>
## Create Editor Directory

Create `src/components/features/analysis-by-steps/editors/`

## Shared Types for Editors

Each editor receives these props:
```typescript
interface EditorProps<T> {
  data: T | null
  onChange: (data: T) => void
  disabled?: boolean
}
```

## 1. pestel-editor.tsx

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import type { PESTELAnalysis } from '@/lib/types'

interface PESTELEditorProps {
  data: PESTELAnalysis | null
  onChange: (data: PESTELAnalysis) => void
  disabled?: boolean
}

const CATEGORIES = [
  { key: 'political' as const, label: 'Político', color: 'border-red-200 bg-red-50' },
  { key: 'economic' as const, label: 'Econômico', color: 'border-blue-200 bg-blue-50' },
  { key: 'social' as const, label: 'Social', color: 'border-green-200 bg-green-50' },
  { key: 'technological' as const, label: 'Tecnológico', color: 'border-purple-200 bg-purple-50' },
  { key: 'environmental' as const, label: 'Ambiental', color: 'border-teal-200 bg-teal-50' },
  { key: 'legal' as const, label: 'Legal', color: 'border-orange-200 bg-orange-50' },
]

const DEFAULT_DATA: PESTELAnalysis = {
  political: [],
  economic: [],
  social: [],
  technological: [],
  environmental: [],
  legal: [],
  summary: '',
}

export function PESTELEditor({ data, onChange, disabled }: PESTELEditorProps) {
  const [formData, setFormData] = useState<PESTELAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) setFormData(data)
  }, [data])

  const updateField = <K extends keyof PESTELAnalysis>(key: K, value: PESTELAnalysis[K]) => {
    const newData = { ...formData, [key]: value }
    setFormData(newData)
    onChange(newData)
  }

  const addItem = (key: keyof Omit<PESTELAnalysis, 'summary'>) => {
    const items = [...(formData[key] || []), '']
    updateField(key, items)
  }

  const updateItem = (key: keyof Omit<PESTELAnalysis, 'summary'>, index: number, value: string) => {
    const items = [...(formData[key] || [])]
    items[index] = value
    updateField(key, items)
  }

  const removeItem = (key: keyof Omit<PESTELAnalysis, 'summary'>, index: number) => {
    const items = (formData[key] || []).filter((_, i) => i !== index)
    updateField(key, items)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map(({ key, label, color }) => (
          <div key={key} className={`rounded-lg border p-4 ${color}`}>
            <h4 className="font-medium mb-3">{label}</h4>
            <div className="space-y-2">
              {(formData[key] || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateItem(key, index, e.target.value)}
                    disabled={disabled}
                    className="bg-white"
                    placeholder={`Fator ${label.toLowerCase()}...`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(key, index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem(key)}
                disabled={disabled}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Resumo</label>
        <Textarea
          value={formData.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
          disabled={disabled}
          rows={4}
          placeholder="Resumo da análise PESTEL..."
        />
      </div>
    </div>
  )
}
```

## 2. swot-editor.tsx

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X } from 'lucide-react'
import type { SWOTAnalysis, SWOTItem } from '@/lib/types'

interface SWOTEditorProps {
  data: SWOTAnalysis | null
  onChange: (data: SWOTAnalysis) => void
  disabled?: boolean
}

const QUADRANTS = [
  { key: 'strengths' as const, label: 'Forças', color: 'border-green-200 bg-green-50' },
  { key: 'weaknesses' as const, label: 'Fraquezas', color: 'border-red-200 bg-red-50' },
  { key: 'opportunities' as const, label: 'Oportunidades', color: 'border-blue-200 bg-blue-50' },
  { key: 'threats' as const, label: 'Ameaças', color: 'border-orange-200 bg-orange-50' },
]

const CONFIDENCE_OPTIONS = ['Alta', 'Média', 'Baixa']

const DEFAULT_ITEM: SWOTItem = { content: '', confidence: 'Média', source: '' }

const DEFAULT_DATA: SWOTAnalysis = {
  strengths: [],
  weaknesses: [],
  opportunities: [],
  threats: [],
  summary: '',
}

export function SWOTEditor({ data, onChange, disabled }: SWOTEditorProps) {
  const [formData, setFormData] = useState<SWOTAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) setFormData(data)
  }, [data])

  const updateField = <K extends keyof SWOTAnalysis>(key: K, value: SWOTAnalysis[K]) => {
    const newData = { ...formData, [key]: value }
    setFormData(newData)
    onChange(newData)
  }

  const addItem = (quadrant: keyof Omit<SWOTAnalysis, 'summary'>) => {
    const items = [...(formData[quadrant] || []), { ...DEFAULT_ITEM }]
    updateField(quadrant, items)
  }

  const updateItem = (quadrant: keyof Omit<SWOTAnalysis, 'summary'>, index: number, field: keyof SWOTItem, value: string) => {
    const items = [...(formData[quadrant] || [])]
    items[index] = { ...items[index], [field]: value }
    updateField(quadrant, items)
  }

  const removeItem = (quadrant: keyof Omit<SWOTAnalysis, 'summary'>, index: number) => {
    const items = (formData[quadrant] || []).filter((_, i) => i !== index)
    updateField(quadrant, items)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {QUADRANTS.map(({ key, label, color }) => (
          <div key={key} className={`rounded-lg border p-4 ${color}`}>
            <h4 className="font-medium mb-3">{label}</h4>
            <div className="space-y-3">
              {(formData[key] || []).map((item, index) => (
                <div key={index} className="space-y-2 p-3 bg-white rounded border">
                  <div className="flex gap-2">
                    <Input
                      value={item.content}
                      onChange={(e) => updateItem(key, index, 'content', e.target.value)}
                      disabled={disabled}
                      placeholder="Descrição..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(key, index)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={item.confidence}
                      onValueChange={(v) => updateItem(key, index, 'confidence', v)}
                      disabled={disabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Confiança" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONFIDENCE_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={item.source}
                      onChange={(e) => updateItem(key, index, 'source', e.target.value)}
                      disabled={disabled}
                      placeholder="Fonte..."
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem(key)}
                disabled={disabled}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Resumo</label>
        <Textarea
          value={formData.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
          disabled={disabled}
          rows={4}
          placeholder="Resumo da análise SWOT..."
        />
      </div>
    </div>
  )
}
```

## 3. porter-editor.tsx

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X } from 'lucide-react'
import type { PorterAnalysis, PorterForce } from '@/lib/types'

interface PorterEditorProps {
  data: PorterAnalysis | null
  onChange: (data: PorterAnalysis) => void
  disabled?: boolean
}

const INTENSITY_OPTIONS = ['Alta', 'Média', 'Baixa']

const DEFAULT_FORCE: PorterForce = { force: '', intensity: 'Média', description: '' }

const DEFAULT_DATA: PorterAnalysis = {
  forces: [],
  overallAttractiveness: '',
  summary: '',
}

export function PorterEditor({ data, onChange, disabled }: PorterEditorProps) {
  const [formData, setFormData] = useState<PorterAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) setFormData(data)
  }, [data])

  const updateField = <K extends keyof PorterAnalysis>(key: K, value: PorterAnalysis[K]) => {
    const newData = { ...formData, [key]: value }
    setFormData(newData)
    onChange(newData)
  }

  const addForce = () => {
    updateField('forces', [...(formData.forces || []), { ...DEFAULT_FORCE }])
  }

  const updateForce = (index: number, field: keyof PorterForce, value: string) => {
    const forces = [...(formData.forces || [])]
    forces[index] = { ...forces[index], [field]: value }
    updateField('forces', forces)
  }

  const removeForce = (index: number) => {
    updateField('forces', (formData.forces || []).filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Forças Competitivas</h4>
          <Button type="button" variant="outline" size="sm" onClick={addForce} disabled={disabled}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar Força
          </Button>
        </div>
        <div className="space-y-3">
          {(formData.forces || []).map((force, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-3">
              <div className="flex gap-2">
                <Input
                  value={force.force}
                  onChange={(e) => updateForce(index, 'force', e.target.value)}
                  disabled={disabled}
                  placeholder="Nome da força..."
                  className="flex-1"
                />
                <Select
                  value={force.intensity}
                  onValueChange={(v) => updateForce(index, 'intensity', v)}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Intensidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTENSITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeForce(index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={force.description}
                onChange={(e) => updateForce(index, 'description', e.target.value)}
                disabled={disabled}
                rows={2}
                placeholder="Descrição da força..."
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Atratividade Geral</label>
        <Input
          value={formData.overallAttractiveness || ''}
          onChange={(e) => updateField('overallAttractiveness', e.target.value)}
          disabled={disabled}
          placeholder="Ex: Moderadamente atrativo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Resumo</label>
        <Textarea
          value={formData.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
          disabled={disabled}
          rows={4}
          placeholder="Resumo da análise de Porter..."
        />
      </div>
    </div>
  )
}
```

## 4. benchmarking-editor.tsx

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import type { BenchmarkingAnalysis } from '@/lib/types'

interface BenchmarkingEditorProps {
  data: BenchmarkingAnalysis | null
  onChange: (data: BenchmarkingAnalysis) => void
  disabled?: boolean
}

const DEFAULT_DATA: BenchmarkingAnalysis = {
  competitorsAnalyzed: [],
  performanceGaps: [],
  bestPractices: [],
  summary: '',
}

export function BenchmarkingEditor({ data, onChange, disabled }: BenchmarkingEditorProps) {
  const [formData, setFormData] = useState<BenchmarkingAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) setFormData(data)
  }, [data])

  const updateField = <K extends keyof BenchmarkingAnalysis>(key: K, value: BenchmarkingAnalysis[K]) => {
    const newData = { ...formData, [key]: value }
    setFormData(newData)
    onChange(newData)
  }

  const addItem = (key: 'competitorsAnalyzed' | 'performanceGaps' | 'bestPractices') => {
    updateField(key, [...(formData[key] || []), ''])
  }

  const updateItem = (key: 'competitorsAnalyzed' | 'performanceGaps' | 'bestPractices', index: number, value: string) => {
    const items = [...(formData[key] || [])]
    items[index] = value
    updateField(key, items)
  }

  const removeItem = (key: 'competitorsAnalyzed' | 'performanceGaps' | 'bestPractices', index: number) => {
    updateField(key, (formData[key] || []).filter((_, i) => i !== index))
  }

  const sections = [
    { key: 'competitorsAnalyzed' as const, label: 'Concorrentes Analisados', placeholder: 'Nome do concorrente...' },
    { key: 'performanceGaps' as const, label: 'Gaps de Performance', placeholder: 'Descrição do gap...' },
    { key: 'bestPractices' as const, label: 'Melhores Práticas', placeholder: 'Descrição da prática...' },
  ]

  return (
    <div className="space-y-6">
      {sections.map(({ key, label, placeholder }) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">{label}</h4>
            <Button type="button" variant="outline" size="sm" onClick={() => addItem(key)} disabled={disabled}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
          <div className="space-y-2">
            {(formData[key] || []).map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateItem(key, index, e.target.value)}
                  disabled={disabled}
                  placeholder={placeholder}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(key, index)}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium mb-2">Resumo</label>
        <Textarea
          value={formData.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
          disabled={disabled}
          rows={4}
          placeholder="Resumo do benchmarking..."
        />
      </div>
    </div>
  )
}
```

## 5. tam-sam-som-editor.tsx

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import type { TamSamSomAnalysis } from '@/lib/types'

interface TamSamSomEditorProps {
  data: TamSamSomAnalysis | null
  onChange: (data: TamSamSomAnalysis) => void
  disabled?: boolean
}

const DEFAULT_DATA: TamSamSomAnalysis = {
  tam: '',
  sam: '',
  som: '',
  assumptions: [],
  cagr: '',
  summary: '',
}

export function TamSamSomEditor({ data, onChange, disabled }: TamSamSomEditorProps) {
  const [formData, setFormData] = useState<TamSamSomAnalysis>(data || DEFAULT_DATA)

  useEffect(() => {
    if (data) setFormData(data)
  }, [data])

  const updateField = <K extends keyof TamSamSomAnalysis>(key: K, value: TamSamSomAnalysis[K]) => {
    const newData = { ...formData, [key]: value }
    setFormData(newData)
    onChange(newData)
  }

  const addAssumption = () => {
    updateField('assumptions', [...(formData.assumptions || []), ''])
  }

  const updateAssumption = (index: number, value: string) => {
    const items = [...(formData.assumptions || [])]
    items[index] = value
    updateField('assumptions', items)
  }

  const removeAssumption = (index: number) => {
    updateField('assumptions', (formData.assumptions || []).filter((_, i) => i !== index))
  }

  const marketFields = [
    { key: 'tam' as const, label: 'TAM (Total Addressable Market)', placeholder: 'Ex: R$ 50 bilhões' },
    { key: 'sam' as const, label: 'SAM (Serviceable Addressable Market)', placeholder: 'Ex: R$ 10 bilhões' },
    { key: 'som' as const, label: 'SOM (Serviceable Obtainable Market)', placeholder: 'Ex: R$ 500 milhões' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {marketFields.map(({ key, label, placeholder }) => (
          <div key={key} className="p-4 border rounded-lg bg-blue-50">
            <label className="block text-sm font-medium mb-2">{label}</label>
            <Input
              value={formData[key] || ''}
              onChange={(e) => updateField(key, e.target.value)}
              disabled={disabled}
              placeholder={placeholder}
              className="bg-white"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">CAGR Projetado</label>
        <Input
          value={formData.cagr || ''}
          onChange={(e) => updateField('cagr', e.target.value)}
          disabled={disabled}
          placeholder="Ex: 15% ao ano"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Premissas</h4>
          <Button type="button" variant="outline" size="sm" onClick={addAssumption} disabled={disabled}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        </div>
        <div className="space-y-2">
          {(formData.assumptions || []).map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateAssumption(index, e.target.value)}
                disabled={disabled}
                placeholder="Premissa..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAssumption(index)}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Resumo</label>
        <Textarea
          value={formData.summary || ''}
          onChange={(e) => updateField('summary', e.target.value)}
          disabled={disabled}
          rows={4}
          placeholder="Resumo da análise TAM-SAM-SOM..."
        />
      </div>
    </div>
  )
}
```
</requirements>

<verification>
After implementation:
1. No TypeScript errors: `npm run type-check`
2. Each editor properly handles null data with defaults
3. onChange called correctly when form changes
4. Disabled state respected on all inputs
5. Add/remove items work correctly
</verification>

<success_criteria>
- 5 editor files created in src/components/features/analysis-by-steps/editors/
- All editors handle null data gracefully
- All editors call onChange on form updates
- Forms are structured (not raw JSON textareas)
- UI follows existing Tailwind patterns
</success_criteria>
