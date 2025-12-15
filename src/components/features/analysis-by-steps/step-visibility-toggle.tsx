'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff } from 'lucide-react'

interface StepVisibilityToggleProps {
  visible: boolean
  onChange: (visible: boolean) => void
  disabled?: boolean
}

export function StepVisibilityToggle({ visible, onChange, disabled }: StepVisibilityToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id="step-visibility"
        checked={visible}
        onCheckedChange={onChange}
        disabled={disabled}
      />
      <label
        htmlFor="step-visibility"
        className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none"
      >
        {visible ? (
          <>
            <Eye className="h-4 w-4 text-text-secondary" />
            <span>Visível no relatório final</span>
          </>
        ) : (
          <>
            <EyeOff className="h-4 w-4 text-text-secondary" />
            <span>Oculto no relatório final</span>
          </>
        )}
      </label>
    </div>
  )
}
