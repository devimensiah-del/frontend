import React from "react";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Send, RefreshCw, Eye, EyeOff } from "lucide-react";

/* ============================================
   ACTION TOOLBAR COMPONENT
   ============================================ */

interface ActionToolbarProps {
  onDownload?: () => void;
  onApprove?: () => void;
  onSend?: () => void;
  onRetry?: () => void;
  onToggleBlur?: (blurred: boolean) => void;
  status?: string;
  type: "enrichment" | "analysis";
  isLoading?: boolean;
  isAdmin?: boolean;
  disableSend?: boolean;
  isBlurred?: boolean;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onDownload,
  onApprove,
  onSend,
  onRetry,
  onToggleBlur,
  status,
  type,
  isLoading = false,
  isAdmin = false,
  disableSend = false,
  isBlurred = true,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      {/* Download Button - Always visible if onDownload provided */}
      {onDownload && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDownload}
          disabled={isLoading}
          className="gap-2 w-full sm:w-auto min-h-[44px] text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Download JSON
        </Button>
      )}

      {/* Retry Button - For failed/stuck states */}
      {isAdmin && onRetry && (status === 'failed' || status === 'pending') && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isLoading}
          className="gap-2 w-full sm:w-auto min-h-[44px] text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </Button>
      )}

      {/* Approve Button - Admin only, when pending approval */}
      {isAdmin && onApprove && status === 'completed' && (
        <Button
          variant="architect"
          size="sm"
          onClick={onApprove}
          disabled={isLoading}
          className="gap-2 w-full sm:w-auto min-h-[44px] text-sm font-medium"
        >
          <CheckCircle className="w-4 h-4" />
          <span className="truncate">Aprovar {type === 'enrichment' ? 'Enriquecimento' : 'Análise'}</span>
        </Button>
      )}

      {/* Blur Toggle Button - Admin only, for analysis when approved */}
      {isAdmin && type === 'analysis' && onToggleBlur && status === 'approved' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleBlur(!isBlurred)}
          disabled={isLoading}
          className="gap-2 w-full sm:w-auto min-h-[44px] text-sm font-medium"
          title={isBlurred ? 'Desbloquear análise premium' : 'Bloquear análise premium'}
        >
          {isBlurred ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="truncate">Desbloquear Premium</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span className="truncate">Bloquear Premium</span>
            </>
          )}
        </Button>
      )}

      {/* PDF DISABLED - TEMPORARY
      {isAdmin && onSend && type === 'analysis' && status === 'approved' && (
        <Button
          variant="architect"
          size="sm"
          onClick={onSend}
          disabled={isLoading || disableSend}
          className="gap-2 w-full sm:w-auto min-h-[44px] text-sm font-medium bg-gold-500 hover:bg-gold-600 text-white"
        >
          <Send className="w-4 h-4" />
          <span className="truncate">Gerar PDF</span>
        </Button>
      )}
      */}
    </div>
  );
};
