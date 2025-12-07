import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { EnrichmentStatus } from '@/lib/types'

interface EnrichmentStatusIndicatorProps {
  status: EnrichmentStatus
  onRetry?: () => void
  isRetrying?: boolean
}

export function EnrichmentStatusIndicator({
  status,
  onRetry,
  isRetrying,
}: EnrichmentStatusIndicatorProps) {
  if (status === 'processing' || status === 'pending') {
    return (
      <div className="flex items-center gap-2 text-gold-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Enriquecendo dados...</span>
      </div>
    )
  }

  if (status === 'completed') {
    return (
      <div className="flex items-center gap-2 text-green-500">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Dados enriquecidos</span>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-destructive">
          <XCircle className="w-4 h-4" />
          <span className="text-sm">Falha no enriquecimento</span>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <RefreshCw className="w-3 h-3 mr-1" />
            )}
            Tentar novamente
          </Button>
        )}
      </div>
    )
  }

  return null
}
