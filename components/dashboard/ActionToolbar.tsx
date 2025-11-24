import React from "react";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Send, RefreshCw } from "lucide-react";

/* ============================================
   ACTION TOOLBAR COMPONENT
   ============================================ */

interface ActionToolbarProps {
  onDownload?: () => void;
  onApprove?: () => void;
  onSend?: () => void;
  onRetry?: () => void;
  status?: string;
  type: "enrichment" | "analysis";
  isLoading?: boolean;
  isAdmin?: boolean;
  disableSend?: boolean;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onDownload,
  onApprove,
  onSend,
  onRetry,
  status,
  type,
  isLoading = false,
  isAdmin = false,
  disableSend = false,
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Download Button - Always visible if onDownload provided */}
      {onDownload && (
        <Button variant="outline" size="sm" onClick={onDownload} disabled={isLoading} className="gap-2">
          <Download className="w-4 h-4" />
          Download JSON
        </Button>
      )}

      {/* Retry Button - For failed/stuck states */}
      {isAdmin && onRetry && (status === 'failed' || status === 'pending') && (
        <Button variant="outline" size="sm" onClick={onRetry} disabled={isLoading} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </Button>
      )}

      {/* Approve Button - Admin only, when pending approval */}
      {isAdmin && onApprove && status === 'completed' && (
        <Button variant="architect" size="sm" onClick={onApprove} disabled={isLoading} className="gap-2">
          <CheckCircle className="w-4 h-4" />
          Aprovar {type === 'enrichment' ? 'Enriquecimento' : 'Análise'}
        </Button>
      )}

      {/* Send Button - Admin only, when approved but not sent (Analysis only) */}
      {isAdmin && onSend && type === 'analysis' && status === 'approved' && (
        <Button variant="architect" size="sm" onClick={onSend} disabled={isLoading || disableSend} className="gap-2 bg-gold-500 hover:bg-gold-600 text-white">
          <Send className="w-4 h-4" />
          Enviar para Cliente
        </Button>
      )}
    </div>
  );
};
