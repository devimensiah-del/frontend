'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Eye, Share2 } from 'lucide-react';
import type { Submission, Enrichment, Analysis } from '@/types';

export interface WorkflowHeaderProps {
  companyName: string;
  submissionId: string;
  createdAt?: string;
  isAdmin: boolean;
  submission?: Submission | null;
  enrichment?: Enrichment | null;
  analysis?: Analysis | null;
  isReleased?: boolean;
  onExportJson?: () => void;
  onViewReport?: () => void;
  onShareLink?: () => void;
  isNavigatingToReport?: boolean;
  className?: string;
}

export function WorkflowHeader({
  companyName,
  submissionId,
  createdAt,
  isAdmin,
  submission,
  enrichment,
  analysis,
  isReleased = false,
  onExportJson,
  onViewReport,
  onShareLink,
  isNavigatingToReport = false,
  className,
}: WorkflowHeaderProps) {
  // Can view report if analysis exists and is completed, approved, or sent
  const canViewReport = analysis && ['completed', 'approved', 'sent'].includes(analysis.status);

  // Get visibility status
  const isVisibleToUser = analysis && ((analysis as any).isVisibleToUser ?? (analysis as any).is_visible_to_user ?? false);

  // Default export JSON handler
  const handleExportJson = () => {
    if (onExportJson) {
      onExportJson();
      return;
    }
    // Default behavior: download all data as JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ submission, enrichment, analysis }, null, 2)
    );
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `project_${submissionId}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4 ${className || ''}`}>
      {/* Left: Company Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Projeto
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-navy-900 truncate">
          {companyName}
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
          <span>ID: {submissionId.slice(0, 8)}</span>
          {createdAt && (
            <>
              <span className="text-gray-300">|</span>
              <span>Criado: {new Date(createdAt).toLocaleDateString('pt-BR')}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Download JSON - Admin only */}
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
          >
            <Download className="w-4 h-4 mr-1.5 flex-shrink-0" />
            Exportar JSON
          </Button>
        )}

        {/* Admin: Copy Link - Only when released */}
        {isAdmin && isReleased && onShareLink && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShareLink}
          >
            <Share2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
            Copiar Link
          </Button>
        )}

        {/* Admin: Visualizar - Only when analysis exists */}
        {isAdmin && canViewReport && onViewReport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewReport}
            disabled={isNavigatingToReport}
          >
            <ExternalLink className="w-4 h-4 mr-1.5 flex-shrink-0" />
            Visualizar
          </Button>
        )}

        {/* Non-admin: View Report - Only when visible to user */}
        {!isAdmin && canViewReport && isVisibleToUser && onViewReport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onViewReport}
            disabled={isNavigatingToReport}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Eye className="w-4 h-4 mr-1.5 flex-shrink-0" />
            Ver Relatório
          </Button>
        )}
      </div>
    </div>
  );
}
