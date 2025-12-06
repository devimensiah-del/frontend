/**
 * ReportHeader Component
 *
 * Header section for public report pages with company info and download button.
 */

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/atoms/Button";
import { Download } from "lucide-react";

// ============================================
// TYPES
// ============================================

export interface ReportHeaderProps {
  companyName: string;
  reportDate: string;
  pdfUrl?: string;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  companyName,
  reportDate,
  pdfUrl,
  className,
}) => {
  return (
    <div className={cn("bg-navy-900 text-white py-12 px-6", className)}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Company Info */}
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-wider mb-2">
              {companyName}
            </h1>
            <p className="text-sm text-gold-500 uppercase tracking-widest">
              Relatório de Análise Estratégica
            </p>
            <p className="text-xs text-white/60 mt-2">
              Gerado em {new Date(reportDate).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Download Button */}
          {pdfUrl && (
            <div>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download>
                <Button variant="outline" size="lg" className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-navy-900">
                  <Download className="w-5 h-5 mr-2" />
                  Baixar PDF
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
