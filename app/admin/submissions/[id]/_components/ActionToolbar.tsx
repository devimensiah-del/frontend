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
import { Select, SelectOption } from "@/components/ui/Select";
import type { Analysis } from "@/types";

interface ActionToolbarProps {
  analysis: Analysis | null;
  allVersions: Analysis[];
  currentVersion: number;
  onVersionChange: (version: number) => void;
  onSaveDraft: () => void;
  onRetryAnalysis: () => void;
  onApproveAnalysis: () => void;
  onPublishPDF: () => void;
  onSendToUser: () => void;
  onCreateNewVersion: () => void;
  isSaving: boolean;
  isApproving: boolean;
  isGeneratingPDF: boolean;
  isSending: boolean;
  isCreatingVersion: boolean;
  userEmail: string;
}

export function ActionToolbar({
  analysis,
  allVersions,
  currentVersion,
  onVersionChange,
  onSaveDraft,
  onRetryAnalysis,
  onApproveAnalysis,
  onPublishPDF,
  onSendToUser,
  onCreateNewVersion,
  isSaving,
  isApproving,
  isGeneratingPDF,
  isSending,
  isCreatingVersion,
  userEmail,
}: ActionToolbarProps) {
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);

  const handleApproveConfirm = () => {
    setShowApproveDialog(false);
    onApproveAnalysis();
  };

  const handlePublishConfirm = () => {
    setShowPublishDialog(false);
    onPublishPDF();
  };

  const handleSendConfirm = () => {
    setShowSendDialog(false);
    onSendToUser();
  };

  const handleVersionConfirm = () => {
    setShowVersionDialog(false);
    onCreateNewVersion();
  };

  const isAnyActionLoading =
    isSaving ||
    isGeneratingPDF ||
    isSending ||
    isApproving ||
    isCreatingVersion;

  const currentStatus = analysis?.status;

  // Status-based button visibility
  const canApprove = currentStatus === "completed";
  const canSend = currentStatus === "approved";
  const canDownloadPDF = currentStatus === "approved" || currentStatus === "sent";

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left side: Version selector and save indicator */}
        <div className="flex items-center gap-3">
          {/* Version Selector */}
          {allVersions.length > 1 && (
            <Select
              value={currentVersion.toString()}
              onChange={(e) => onVersionChange(parseInt(e.target.value))}
              className="w-40"
            >
              {allVersions.map((v) => (
                <SelectOption key={v.version} value={v.version.toString()}>
                  v{v.version}
                  {v.status === "sent" && " (Enviado)"}
                  {v.status === "approved" && " (Aprovado)"}
                </SelectOption>
              ))}
            </Select>
          )}

          {/* Auto-save indicator */}
          {isSaving && (
            <span className="text-xs text-[var(--text-secondary)] animate-pulse">
              Salvando...
            </span>
          )}
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Retry Analysis */}
          <button
            onClick={onRetryAnalysis}
            disabled={isAnyActionLoading}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Refazer Análise
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

          {/* Create New Version */}
          <button
            onClick={() => setShowVersionDialog(true)}
            disabled={isCreatingVersion || isAnyActionLoading}
            className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {isCreatingVersion ? "Criando..." : "Nova Versão"}
          </button>

          {/* Approve Analysis - Only when status is 'completed' */}
          {canApprove && (
            <button
              onClick={() => setShowApproveDialog(true)}
              disabled={isApproving || isAnyActionLoading}
              className="bg-green-600 text-white font-heading font-medium uppercase text-xs tracking-widest px-8 py-4 transition-all duration-300 hover:bg-green-700 border-radius-none disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isApproving ? "Aprovando..." : "Aprovar Análise"}
            </button>
          )}

          {/* Download PDF - Only when status is 'approved' or 'sent' */}
          {canDownloadPDF && (
            <button
              onClick={() => setShowPublishDialog(true)}
              disabled={isGeneratingPDF || isAnyActionLoading}
              className="bg-[var(--gold-500)] text-white font-heading font-medium uppercase text-xs tracking-widest px-8 py-4 transition-all duration-300 hover:bg-[var(--gold-600)] border-radius-none disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isGeneratingPDF ? "Gerando PDF..." : "Baixar PDF"}
            </button>
          )}

          {/* Send to User - Only when status is 'approved' */}
          {canSend && (
            <button
              onClick={() => setShowSendDialog(true)}
              disabled={isSending || isAnyActionLoading}
              className="bg-[var(--navy-900)] text-white font-heading font-medium uppercase text-xs tracking-widest px-8 py-4 transition-all duration-300 hover:bg-[var(--navy-800)] border-radius-none disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isSending ? "Enviando..." : "Enviar para Usuário"}
            </button>
          )}
        </div>
      </div>

      {/* Approve Analysis Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Análise</DialogTitle>
            <DialogDescription>
              Ao aprovar esta análise, o status será atualizado para "Aprovado"
              e o PDF do relatório será gerado automaticamente.
              <div className="mt-3 p-3 bg-[var(--surface-paper)] rounded text-sm">
                <strong>Versão:</strong> v{analysis?.version}
                <br />
                <strong>Status Atual:</strong> {analysis?.status}
                <br />
                <strong>Novo Status:</strong> approved
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApproveConfirm}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download PDF Dialog */}
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
            <Button onClick={handlePublishConfirm}>Gerar e Baixar PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send to User Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Relatório para Usuário</DialogTitle>
            <DialogDescription>
              O relatório estratégico será enviado por email para:
              <div className="mt-3 p-3 bg-[var(--surface-paper)] rounded font-mono text-sm">
                {userEmail}
              </div>
              <div className="mt-3 text-[var(--text-secondary)] text-sm">
                As alterações atuais serão salvas antes do envio. O status da
                análise será atualizado para "Enviado".
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendConfirm}>Enviar Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Version Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Versão da Análise</DialogTitle>
            <DialogDescription>
              Você está prestes a criar uma nova versão da análise estratégica.
              <div className="mt-3 p-3 bg-[var(--surface-paper)] rounded text-sm">
                <strong>Versão Atual:</strong> v{analysis?.version}
                <br />
                <strong>Nova Versão:</strong> v{(analysis?.version || 0) + 1}
                <br />
                <strong>Status Herdado:</strong> {analysis?.status}
              </div>
              <div className="mt-3 text-[var(--text-secondary)] text-sm">
                A nova versão herdará o status da versão atual. Você poderá
                editar e aprovar a nova versão independentemente.
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowVersionDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleVersionConfirm}>Criar Nova Versão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
