'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-paper">
      <div className="max-w-md w-full px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold text-navy-900 mb-2">
          Algo deu errado
        </h1>
        <p className="text-muted-foreground mb-8">
          Ocorreu um erro inesperado. Nossa equipe foi notificada e estamos trabalhando para resolver.
        </p>

        {error.digest && (
          <p className="text-xs text-muted-foreground mb-6 font-mono bg-surface-card p-2 rounded">
            Codigo do erro: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={reset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Ir para Home
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-line">
          <p className="text-sm text-muted-foreground mb-4">
            Se o problema persistir, entre em contato:
          </p>
          <a
            href="mailto:suporte@imensiah.com"
            className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600"
          >
            <Mail className="w-4 h-4" />
            suporte@imensiah.com
          </a>
        </div>
      </div>
    </div>
  )
}
