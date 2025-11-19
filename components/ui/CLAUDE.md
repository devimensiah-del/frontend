# UI Components Guidelines

## Component Library
These components are **IMMUTABLE CONTRACTS**.
DO NOT modify without team approval.

## Philosophy
- **Consistent**: All components follow the same patterns
- **Accessible**: ARIA labels, keyboard navigation, semantic HTML
- **Typed**: Full TypeScript support with strict types
- **Responsive**: Works on mobile, tablet, desktop
- **Brand-aligned**: Uses IMENSIAH colors and design system

## Available Components

### Button
Primary interactive element for actions.

**Variants:**
- `primary` - Ocean blue gradient, gold glow on hover (main CTAs)
- `secondary` - Ocean blue solid (secondary actions)
- `outline` - Border only (tertiary actions)
- `ghost` - No background (inline actions)
- `destructive` - Red (delete/cancel actions)

**Sizes:**
- `sm` - Compact (32px height)
- `default` - Standard (40px height)
- `lg` - Large (48px height)
- `xl` - Extra large (56px height)
- `icon` - Square icon button

**Props:**
- `loading?: boolean` - Shows spinner, disables button
- `disabled?: boolean` - Disables button
- `className?: string` - Additional classes

**Usage:**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary" size="lg" loading={isLoading}>
  Solicitar Diagnóstico
</Button>
```

### Input
Text input field with label, error, and helper text.

**Features:**
- Automatic label/input association
- Error state styling
- Helper text support
- Character count (optional)
- Icon support (left/right)

**Props:**
- `label: string` - Input label (required)
- `error?: string` - Error message
- `helperText?: string` - Helper text below input
- `maxLength?: number` - Max character count
- `showCount?: boolean` - Show character counter

**Usage:**
```tsx
import { Input } from '@/components/ui/input';

<Input
  label="Email Corporativo"
  type="email"
  error={errors.email?.message}
  helperText="Usaremos apenas para enviar o relatório"
/>
```

### Textarea
Multi-line text input with character count.

**Features:**
- Auto-resize support
- Character count
- Error state styling
- Helper text support

**Props:**
- `label: string` - Textarea label
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `maxLength?: number` - Max characters
- `showCount?: boolean` - Show counter (default: true if maxLength set)
- `rows?: number` - Initial rows (default: 4)

**Usage:**
```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea
  label="Qual é o principal desafio da sua empresa?"
  maxLength={800}
  showCount
  error={errors.challenge?.message}
/>
```

### Select
Dropdown selection field.

**Features:**
- Label support
- Error state styling
- Placeholder support
- Accessible with keyboard navigation

**Props:**
- `label: string` - Select label
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `placeholder?: string` - Placeholder text
- `options: Array<{value: string, label: string}>` - Options

**Usage:**
```tsx
import { Select } from '@/components/ui/select';

<Select
  label="Setor"
  options={[
    { value: 'tech', label: 'Tecnologia' },
    { value: 'health', label: 'Saúde' },
  ]}
  error={errors.industry?.message}
/>
```

### Card
Container component for content sections.

**Variants:**
- `default` - White background, shadow
- `glass` - Glassmorphism effect
- `gradient` - Ocean blue gradient

**Props:**
- `variant?: 'default' | 'glass' | 'gradient'`
- `className?: string`

**Compound Components:**
- `Card.Header` - Card header section
- `Card.Title` - Title text (h3)
- `Card.Description` - Description text
- `Card.Content` - Main content area
- `Card.Footer` - Footer section (actions)

**Usage:**
```tsx
import { Card } from '@/components/ui/card';

<Card variant="glass">
  <Card.Header>
    <Card.Title>Análise Completa</Card.Title>
    <Card.Description>IA + IH em 24 horas</Card.Description>
  </Card.Header>
  <Card.Content>
    {/* Content */}
  </Card.Content>
  <Card.Footer>
    <Button>Solicitar</Button>
  </Card.Footer>
</Card>
```

### Badge
Status indicator or tag.

**Variants:**
- `default` - Gray
- `pending` - Yellow (pending payment)
- `analyzing` - Purple (AI analyzing)
- `complete` - Green (completed)
- `failed` - Red (failed/error)

**Sizes:**
- `sm` - Small
- `default` - Standard
- `lg` - Large

**Usage:**
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="analyzing" size="sm">
  Analisando
</Badge>
```

### Dialog (Modal)
Modal overlay for dialogs and confirmations.

**Sizes:**
- `sm` - 400px max width
- `md` - 600px max width (default)
- `lg` - 800px max width
- `xl` - 1000px max width
- `full` - Full screen (mobile default)

**Props:**
- `open: boolean` - Control open state
- `onOpenChange: (open: boolean) => void` - Handle state change
- `size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'`

**Compound Components:**
- `Dialog.Content` - Modal content container
- `Dialog.Header` - Header section
- `Dialog.Title` - Title text (h2)
- `Dialog.Description` - Description text
- `Dialog.Footer` - Footer section (actions)

**Usage:**
```tsx
import { Dialog } from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen} size="lg">
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Relatório Completo</Dialog.Title>
      <Dialog.Description>Análise estratégica da sua empresa</Dialog.Description>
    </Dialog.Header>
    <div className="p-6">
      {/* Content */}
    </div>
    <Dialog.Footer>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Fechar
      </Button>
      <Button variant="primary">
        Download PDF
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

### Accordion
Collapsible content sections.

**Features:**
- Single or multiple expand
- Keyboard navigation
- Smooth animations
- Accessible

**Props:**
- `type?: 'single' | 'multiple'` - Expand behavior
- `defaultValue?: string | string[]` - Default open items

**Compound Components:**
- `Accordion.Item` - Individual accordion item
- `Accordion.Trigger` - Clickable trigger button
- `Accordion.Content` - Collapsible content

**Usage:**
```tsx
import { Accordion } from '@/components/ui/accordion';

<Accordion type="single">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>
      O que é IA + IH?
    </Accordion.Trigger>
    <Accordion.Content>
      Inteligência Artificial coleta dados públicos automaticamente...
    </Accordion.Content>
  </Accordion.Item>
</Accordion>
```

## Usage Rules

### DO:
✅ Import from `@/components/ui/`
✅ Use existing variants and sizes
✅ Extend with `className` prop for positioning/spacing
✅ Compose components together
✅ Follow accessibility patterns

### DON'T:
❌ Modify component source code without approval
❌ Add new variants without team discussion
❌ Override internal styles with `!important`
❌ Create custom UI components that duplicate existing ones
❌ Use inline styles

## Adding New Components

If you need a component that doesn't exist:

1. **Check if it can be composed** from existing components
2. **Propose in team chat** with use case and design
3. **Get approval** before implementing
4. **Follow the pattern**:
   - TypeScript with strict types
   - Variants with class-variance-authority
   - Accessibility with ARIA labels
   - Responsive design
   - Brand colors
5. **Add to this documentation**
6. **Write tests** (React Testing Library)

## Component Pattern Template

```tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const componentVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'default-classes',
        primary: 'primary-classes',
      },
      size: {
        sm: 'small-classes',
        default: 'default-classes',
        lg: 'large-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

export const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Component.displayName = 'Component';
```

## Accessibility Checklist

Every component MUST:
- [ ] Use semantic HTML
- [ ] Have ARIA labels on interactive elements
- [ ] Support keyboard navigation (Tab, Enter, Space, Arrow keys)
- [ ] Have focus indicators
- [ ] Link errors to inputs with aria-describedby
- [ ] Use role attributes when needed
- [ ] Have proper color contrast (WCAG AA: 4.5:1)
- [ ] Work with screen readers

## Testing Components

Test with:
- **Keyboard only**: Tab through, activate with Enter/Space
- **Screen reader**: VoiceOver (Mac), NVDA (Windows)
- **Mobile devices**: Touch targets > 44x44px
- **Different zoom levels**: 100%, 125%, 150%, 200%
- **Color contrast checker**: Browser DevTools or online tools

## Questions?

Before modifying any UI component:
1. Read this CLAUDE.md
2. Check if the change is necessary
3. Discuss with the team
4. Get approval
5. Update documentation

---

**Remember**: UI components are the foundation of the entire app. Keep them consistent, accessible, and brand-aligned. When in doubt, ask first.
