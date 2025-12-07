'use client'

import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BlurredContentProps {
  children: React.ReactNode
  isBlurred: boolean
  frameworkName: string
  onContactClick?: () => void
}

export function BlurredContent({
  children,
  isBlurred,
  frameworkName,
  onContactClick
}: BlurredContentProps) {
  if (!isBlurred) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-[400px]">
      {/* Blurred content */}
      <div
        className="blur-md pointer-events-none select-none"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 rounded-full mb-4">
            <Lock className="w-8 h-8 text-gold-500" />
          </div>

          <h3 className="text-xl font-heading font-medium text-navy-900 mb-2">
            {frameworkName} - Conteúdo Premium
          </h3>

          <p className="text-sm text-text-secondary mb-6">
            Este framework faz parte do pacote premium.
            Entre em contato para acesso completo ao diagnóstico estratégico.
          </p>

          <Button
            variant="architect"
            onClick={onContactClick}
            className="w-full sm:w-auto"
          >
            Fale com um Consultor
          </Button>
        </div>
      </div>
    </div>
  )
}
