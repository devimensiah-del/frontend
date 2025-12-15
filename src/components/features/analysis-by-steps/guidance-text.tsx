'use client'

import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface GuidanceTextProps {
  text: string
}

export function GuidanceText({ text }: GuidanceTextProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded flex items-start gap-3">
      <Info className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium uppercase tracking-wide text-blue-900">
            Orientação para Reflexão
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-blue-600 hover:text-blue-800">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="text-sm whitespace-pre-wrap">{text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-blue-700 mt-1 line-clamp-2">
          {text}
        </p>
      </div>
    </div>
  )
}
