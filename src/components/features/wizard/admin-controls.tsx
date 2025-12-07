'use client'

import * as React from 'react'
import { Check, Code, RotateCcw, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface AdminControlsProps {
  onForceApprove: () => void
  onResetStep: () => void
  rawOutput?: Record<string, unknown>
  isForceApproving?: boolean
  isResetting?: boolean
  className?: string
}

/**
 * Admin-only controls for wizard management
 * Visible only when user.role === 'admin'
 */
export function AdminControls({
  onForceApprove,
  onResetStep,
  rawOutput,
  isForceApproving,
  isResetting,
  className,
}: AdminControlsProps) {
  const [showRawJson, setShowRawJson] = React.useState(false)

  return (
    <div
      className={cn(
        'border-2 border-dashed border-error/50 bg-error-light/20 p-4',
        className
      )}
    >
      {/* Admin Badge */}
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-4 w-4 text-error" />
        <span className="text-xs font-bold uppercase tracking-widest text-error">
          Admin Controls
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {/* Force Approve */}
        <Button
          variant="outline"
          size="sm"
          onClick={onForceApprove}
          disabled={isForceApproving}
          className="border-error text-error hover:bg-error hover:text-white"
        >
          <Check className="mr-2 h-3.5 w-3.5" />
          {isForceApproving ? 'Approving...' : 'Force Approve'}
        </Button>

        {/* Reset Step */}
        <Button
          variant="outline"
          size="sm"
          onClick={onResetStep}
          disabled={isResetting}
          className="border-error text-error hover:bg-error hover:text-white"
        >
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          {isResetting ? 'Resetting...' : 'Reset Step'}
        </Button>

        {/* View Raw JSON */}
        <Dialog open={showRawJson} onOpenChange={setShowRawJson}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-error text-error hover:bg-error hover:text-white"
            >
              <Code className="mr-2 h-3.5 w-3.5" />
              View Raw JSON
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Raw JSON Output</DialogTitle>
              <DialogDescription>
                Raw framework output for debugging
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              <pre className="p-4 bg-navy-900 text-white text-xs overflow-auto">
                {rawOutput
                  ? JSON.stringify(rawOutput, null, 2)
                  : 'No output available'}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Warning */}
      <p className="mt-3 text-xs text-error/80">
        ⚠️ These actions bypass normal wizard flow. Use with caution.
      </p>
    </div>
  )
}
