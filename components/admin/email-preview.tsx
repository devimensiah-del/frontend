'use client';

import { Card } from '@/components/ui/card';
import { Mail, FileText } from 'lucide-react';

interface EmailPreviewProps {
  to: string;
  subject: string;
  pdfUrl?: string;
  dashboardUrl: string;
}

export function EmailPreview({ to, subject, pdfUrl, dashboardUrl }: EmailPreviewProps) {
  return (
    <Card className="p-6 bg-white border-2">
      {/* Email Header */}
      <div className="border-b pb-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Mail className="w-4 h-4" />
          <span className="font-semibold">De:</span> noreply@imensiah.com
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Mail className="w-4 h-4" />
          <span className="font-semibold">Para:</span> {to}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-semibold">Assunto:</span> {subject}
        </div>
      </div>

      {/* Email Body */}
      <div className="space-y-4 text-sm">
        <div className="text-center py-4">
          <div className="text-2xl font-bold text-[hsl(195_100%_8%)] mb-2">IMENSIAH</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Relatórios Estratégicos Inteligentes
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-gray-700">
            <strong>Olá!</strong>
          </p>

          <p className="text-gray-700">
            Seu Relatório Estratégico está pronto! 🎉
          </p>

          <p className="text-gray-700">
            Nossa equipe finalizou a análise completa da sua empresa. O relatório inclui
            insights valiosos sobre presença digital, oportunidades de mercado e
            recomendações estratégicas práticas.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 py-4">
          <a
            href={dashboardUrl}
            className="block w-full bg-[hsl(195_100%_8%)] text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-[hsl(195_100%_8%)]/90 transition-colors"
          >
            Ver Relatório no Dashboard
          </a>

          {pdfUrl && (
            <a
              href={pdfUrl}
              className="block w-full bg-white border-2 border-[hsl(195_100%_8%)] text-[hsl(195_100%_8%)] text-center py-3 px-6 rounded-lg font-semibold hover:bg-[hsl(195_100%_8%)]/5 transition-colors"
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Baixar PDF
            </a>
          )}
        </div>

        {/* Additional Info */}
        <div className="bg-[hsl(195_100%_8%)]/10 border border-[hsl(195_100%_8%)]/20 rounded-lg p-4 space-y-2">
          <div className="font-semibold text-[hsl(195_100%_8%)] text-sm">O que você receberá:</div>
          <ul className="space-y-1 text-xs text-[hsl(195_100%_8%)]/80">
            <li className="flex items-start gap-2">
              <span className="text-[hsl(195_100%_8%)]">•</span>
              <span>Análise completa de presença digital</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[hsl(195_100%_8%)]">•</span>
              <span>Benchmarking com concorrentes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[hsl(195_100%_8%)]">•</span>
              <span>Oportunidades de mercado identificadas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[hsl(195_100%_8%)]">•</span>
              <span>Recomendações estratégicas práticas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[hsl(195_100%_8%)]">•</span>
              <span>Plano de ação implementável</span>
            </li>
          </ul>
        </div>

        <p className="text-gray-700 text-xs">
          <strong>Precisa de ajuda?</strong>
          <br />
          Nossa equipe está disponível para esclarecer dúvidas sobre o relatório.
          Responda este email ou entre em contato em{' '}
          <a href="mailto:suporte@imensiah.com" className="text-[hsl(195_100%_8%)] hover:underline">
            suporte@imensiah.com
          </a>
        </p>

        {/* Footer */}
        <div className="border-t pt-4 mt-6 text-center text-xs text-gray-500">
          <p>Este email foi enviado por IMENSIAH</p>
          <p className="mt-1">
            <a href="https://imensiah.com" className="text-[hsl(195_100%_8%)] hover:underline">
              imensiah.com
            </a>
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} IMENSIAH. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </Card>
  );
}
