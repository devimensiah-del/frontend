# Admin Navigation Visual Guide

## Desktop Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ SIDEBAR (w-64)                    │ MAIN CONTENT                │
│ bg-navy-900                        │ bg-surface-paper            │
├───────────────────────────────────┼─────────────────────────────┤
│                                    │                             │
│ ┌─ LOGO & BRANDING ─────────────┐ │                             │
│ │  [Logo] IMENSIAH               │ │                             │
│ │         Admin                  │ │                             │
│ └────────────────────────────────┘ │                             │
│                                    │                             │
│ ┌─ WORKFLOW ────────────────────┐ │                             │
│ │                                │ │                             │
│ │  ┌───┬──────────────────┬───┐ │ │    Dashboard content        │
│ │  │ 1 │ 📋 ENVIOS        │ 5 │ │ │    shows here               │
│ │  │   │ Revisar envios   │   │ │ │                             │
│ │  └───┴──────────────────┴───┘ │ │                             │
│ │          │ (connecting line)   │ │                             │
│ │  ┌───┬──────────────────┬───┐ │ │                             │
│ │  │ 2 │ ✨ ENRIQUECIMENTO│ 3 │ │ │                             │
│ │  │   │ Editar dados     │   │ │ │                             │
│ │  └───┴──────────────────┴───┘ │ │                             │
│ │          │ (connecting line)   │ │                             │
│ │  ┌───┬──────────────────┬───┐ │ │                             │
│ │  │ 3 │ 📊 ANÁLISE       │ 2 │ │ │                             │
│ │  │   │ Criar relatórios │   │ │ │                             │
│ │  └───┴──────────────────┴───┘ │ │                             │
│ │                                │ │                             │
│ └────────────────────────────────┘ │                             │
│                                    │                             │
│ ─────────────────────────────────  │                             │
│                                    │                             │
│ ┌─ TOOLS ───────────────────────┐ │                             │
│ │  📊 Dashboard Overview         │ │                             │
│ │  📈 Analytics                  │ │                             │
│ │  ⚙️  Settings                  │ │                             │
│ └────────────────────────────────┘ │                             │
│                                    │                             │
│ ─────────────────────────────────  │                             │
│                                    │                             │
│ ┌─ USER ────────────────────────┐ │                             │
│ │  [AD] Admin User               │ │                             │
│ │       admin@imensiah.com       │ │                             │
│ └────────────────────────────────┘ │                             │
│                                    │                             │
└────────────────────────────────────┴─────────────────────────────┘
```

## Mobile Layout (< lg breakpoint)

### Menu Closed
```
┌─────────────────────────────┐
│ [☰] MAIN CONTENT           │
│                             │
│ Dashboard content           │
│ shows here                  │
│                             │
│                             │
└─────────────────────────────┘
```

### Menu Open
```
┌───────────────────┬─────────┐
│ SIDEBAR           │░░░░░░░░░│ (overlay)
│ (slides from left)│░░░░░░░░░│
│                   │░░░░░░░░░│
│ WORKFLOW          │░░░░░░░░░│
│ 1. Envios [5]     │░░░░░░░░░│
│ 2. Enriquecimento │░░░░░░░░░│
│ 3. Análise [2]    │░░░░░░░░░│
│                   │░░░░░░░░░│
│ TOOLS             │░░░░░░░░░│
│ Dashboard         │░░░░░░░░░│
│ Analytics         │░░░░░░░░░│
│                   │░░░░░░░░░│
└───────────────────┴─────────┘
```

## Workflow Stage States

### Inactive Stage
```
┌───┬──────────────────────┬───┐
│ 1 │ 📋 ENVIOS            │ 5 │
│   │ Revisar envios       │   │
└───┴──────────────────────┴───┘
     └─ text-gray-300
     └─ bg-transparent
     └─ hover:bg-navy-800
```

### Active Stage (Current Page)
```
┌───┬──────────────────────┬───┐
│ 1 │ 📋 ENVIOS            │ 5 │  ← GOLD HIGHLIGHT
│   │ Revisar envios       │   │
└───┴──────────────────────┴───┘
     └─ text-gold-500
     └─ bg-gold-500/10
     └─ border-gold-500/30
     └─ stage circle: bg-gold-500
```

### Loading State
```
┌───┬──────────────────────┬─────┐
│ 1 │ 📋 ENVIOS            │ ... │  ← Loading
│   │ Revisar envios       │     │
└───┴──────────────────────┴─────┘
```

### Empty State (0 items)
```
┌───┬──────────────────────┬───┐
│ 1 │ 📋 ENVIOS            │ 0 │  ← Reduced opacity
│   │ Revisar envios       │   │
└───┴──────────────────────┴───┘
     └─ badge opacity: 40%
```

## Color Scheme

### Navy Tones
- **Navy 900**: `#0A1929` - Sidebar background
- **Navy 800**: `#1E293B` - Hover states, dividers
- **Navy 700**: `#334155` - Active non-workflow items

### Gold Tones
- **Gold 500**: `#D4AF37` - Active stage circle, text
- **Gold 500/10**: `rgba(212, 175, 55, 0.1)` - Active stage background
- **Gold 500/30**: `rgba(212, 175, 55, 0.3)` - Active stage border

### Gray Tones
- **Gray 300**: `#CBD5E1` - Inactive text
- **Gray 400**: `#94A3B8` - Secondary text
- **Gray 500**: `#64748B` - Section headers

## Typography

### Section Headers
- **Font**: Heading font (Manrope)
- **Size**: text-xs (0.75rem)
- **Weight**: font-bold (700)
- **Tracking**: tracking-widest (0.1em)
- **Transform**: uppercase
- **Color**: text-gray-500

### Stage Names
- **Font**: Heading font (Manrope)
- **Size**: text-xs (0.75rem)
- **Weight**: font-bold (700)
- **Tracking**: tracking-widest (0.1em)
- **Transform**: uppercase
- **Color**: text-gray-300 (inactive) / text-gold-500 (active)

### Stage Descriptions
- **Font**: Body font (Inter)
- **Size**: text-[10px]
- **Weight**: font-normal (400)
- **Color**: text-gray-500

### Badge Counts
- **Font**: Heading font (Manrope)
- **Size**: text-xs (0.75rem)
- **Weight**: font-bold (700)
- **Padding**: px-3 py-1
- **Border**: rounded-full

## Spacing & Layout

### Sidebar
- **Width**: w-64 (16rem / 256px)
- **Padding**: p-4 (1rem)
- **Border**: border-r border-navy-800

### Stage Items
- **Padding**: px-3 py-3
- **Gap**: gap-3 (0.75rem)
- **Margin**: connecting line h-3 (0.75rem)
- **Border Radius**: rounded-lg (0.5rem)

### Stage Number Circle
- **Size**: w-8 h-8 (2rem)
- **Border Radius**: rounded-full
- **Font Size**: text-xs (0.75rem)
- **Font Weight**: font-bold (700)

### Connecting Lines
- **Height**: h-3 (0.75rem)
- **Width**: w-0.5 (0.125rem / 2px)
- **Margin**: ml-7 (1.75rem to align with circle center)
- **Color**: bg-navy-800

## Interactions

### Hover Effects
```css
hover:bg-navy-800/50    /* Inactive stages */
hover:bg-navy-800       /* Tool items */
group-hover:bg-navy-700 /* Stage circle */
group-hover:text-white  /* Stage text */
```

### Transitions
```css
transition-all duration-200  /* Smooth animations */
transition-colors           /* Color changes */
transition-transform        /* Mobile menu slide */
```

### Active States
- Gold background overlay
- Gold border
- Gold text color
- Gold circle background
- Shadow: shadow-sm

## Accessibility

### Semantic HTML
- `<nav>` for navigation container
- `<Link>` for all clickable items
- `role="status"` for badges
- `aria-label` for mobile menu button

### Keyboard Navigation
- All items focusable with Tab
- Visual focus states
- Enter/Space to activate links

### Screen Readers
- Clear labels for all elements
- Status information in badges
- Descriptive link text

## Real-time Updates

### React Query Configuration
```typescript
{
  queryKey: ['workflow-counts'],
  refetchInterval: 30000,      // 30 seconds
  staleTime: 10000,            // 10 seconds
}
```

### Update Flow
1. Component mounts → Initial fetch
2. Every 30s → Background refetch
3. Badge updates automatically
4. No loading spinner after initial load
5. Graceful error handling (shows 0)

## Implementation Details

### Files Structure
```
lib/hooks/
  └─ use-workflow-counts.ts      (Data fetching)

components/admin/
  └─ WorkflowProgress.tsx        (Visual component)

app/admin/
  └─ layout.tsx                  (Layout integration)

lib/config/
  └─ site.ts                     (Configuration)
```

### Status to Stage Mapping
```typescript
Stage 1: ['pendente', 'aguardando_pagamento']
Stage 2: ['em_enriquecimento', 'enriquecimento_completo']
Stage 3: ['em_analise', 'analise_completa', 'em_geracao_relatorio']
```

---

**This visual guide provides a complete reference for the admin navigation design and behavior.**
