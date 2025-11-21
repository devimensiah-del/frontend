"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ActionToolbarProps {
  onSaveDraft: () => void;
  onRetryAnalysis: () => void;
  onPublishPDF: () => void;
  onSendEmail: () => void;
  isSaving: boolean;
  isGenerating: boolean;
  isGeneratingPDF: boolean;
  isSending: boolean;
  userEmail: string;
}

export function ActionToolbar({
  onSaveDraft,
  onRetryAnalysis,
  onPublishPDF,
  onSendEmail,
  isSaving,
  isGenerating,
  isGeneratingPDF,
  isSending,
  userEmail,
}: ActionToolbarProps) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const handlePublishConfirm = () => {
    setShowPublishDialog(false);
    onPublishPDF();
  };

  const handleEmailConfirm = () => {
    setShowEmailDialog(false);
    onSendEmail();
  };

  const isAnyActionLoading = isSaving || isGenerating || isGeneratingPDF || isSending;

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Auto-save indicator */}
        {isSaving && (
          <span className="text-xs text-[var(--text-secondary)] animate-pulse">
            Salvando...
          </span>
        )}

        {/* Retry Analysis */}
        <button
          onClick={onRetryAnalysis}
          disabled={isGenerating || isAnyActionLoading}
          className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Gerando...
            </>
          ) : (
            "Refazer Análise"
          )}
        </button>

        {/* Save Draft */}
        <button
          onClick={onSaveDraft}
          disabled={isSaving || isAnyActionLoading}
          className="btn-architect disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isSaving ? "Salvando..." : "Salvar"}
        </button>

        {/* Download PDF */}
        <button
          onClick={() => setShowPublishDialog(true)}
          disabled={isGeneratingPDF || isAnyActionLoading}
          className="bg-[var(--gold-500)] text-white font-heading font-medium uppercase text-xs tracking-widest px-8 py-4 transition-all duration-300 hover:bg-[var(--gold-600)] border-radius-none disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isGeneratingPDF ? "Gerando PDF..." : "Baixar PDF"}
        </button>

        {/* Send Email */}
        <button
          onClick={() => setShowEmailDialog(true)}
          disabled={isSending || isAnyActionLoading}
          className="bg-[var(--navy-900)] text-white font-heading font-medium uppercase text-xs tracking-widest px-8 py-4 transition-all duration-300 hover:bg-[var(--navy-800)] border-radius-none disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isSending ? "Enviando..." : "Enviar por Email"}
        </button>
      </div>

      {/* Publish PDF Confirmation Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Baixar PDF do Relatório</DialogTitle>
            <DialogDescription>
              Você está prestes a gerar e baixar o PDF do relatório estratégico.
              As alterações atuais serão salvas antes da geração.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handlePublishConfirm}>
              Gerar e Baixar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Confirmation Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Relatório por Email</DialogTitle>
            <DialogDescription>
              O relatório estratégico será enviado para:
              <div className="mt-3 p-3 bg-[var(--surface-paper)] rounded font-mono text-sm">
                {userEmail}
              </div>
              <div className="mt-3 text-[var(--text-secondary)] text-sm">
                As alterações atuais serão salvas antes do envio.
                O status da submissão será atualizado para "Concluído".
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEmailDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleEmailConfirm}>
              Enviar Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
