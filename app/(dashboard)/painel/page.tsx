'use client';

import { SubmissionCard } from '../_components/SubmissionCard';
import { EnrichmentCard } from '../_components/EnrichmentCard';
import { AnalysisCard } from '../_components/AnalysisCard';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { DashboardSkeleton } from '@/components/skeletons';
import { useEffect, useState } from 'react';

// Mock data - in production, fetch from API
const mockSubmission = {
  id: 'sub_001',
  organizationName: 'TechInova Solutions',
  ownerName: 'Maria Silva',
  ownerEmail: 'maria@techinova.com.br',
  ownerPhone: '+55 11 98765-4321',
  website: 'https://techinova.com.br',
  socialMedia: '@techinova',
  innovationDescription:
    'Plataforma de IA para otimização de processos industriais, reduzindo custos operacionais em até 30% através de análise preditiva e automação inteligente.',
  targetAudience:
    'Indústrias de médio e grande porte nos setores de manufatura, logística e energia.',
  problemSolution:
    'Resolvemos a ineficiência operacional causada por processos manuais e falta de dados em tempo real, oferecendo uma solução integrada de IoT e IA.',
  stage: 'MVP em Produção',
  teamSize: 8,
  hasRevenue: true,
  monthlyRevenue: 45000,
  fundingReceived: 250000,
  businessModel: 'SaaS com mensalidade recorrente',
  mainChallenge: 'Expansão para novos mercados internacionais',
  supportNeeded: 'Mentoria em estratégia de go-to-market e networking com investidores',
  status: 'completed',
  createdAt: '2025-01-15T10:30:00Z',
};

const mockEnrichment = {
  id: 'enr_001',
  marketSize: 'Mercado global de automação industrial estimado em US$ 326 bilhões até 2027, com CAGR de 9.8%. No Brasil, setor representa R$ 45 bilhões em 2024.',
  competitors: [
    'Siemens Industrial AI',
    'Rockwell Automation',
    'Schneider Electric',
    'ABB Digital Solutions',
  ],
  technologyStack: [
    'Python',
    'TensorFlow',
    'IoT Sensors',
    'AWS',
    'PostgreSQL',
    'React',
  ],
  regulatoryRequirements:
    'LGPD para dados industriais, certificações ISO 27001 e IEC 62443 para segurança cibernética em ambientes industriais.',
  marketTrends:
    'Crescimento acelerado de Indústria 4.0, adoção de edge computing, e foco em sustentabilidade energética. Tendência de consolidação de fornecedores em plataformas integradas.',
  swotAnalysis: {
    strengths: [
      'Solução específica para mercado brasileiro',
      'Custo 40% menor que concorrentes internacionais',
      'Expertise em integração com sistemas legados',
    ],
    weaknesses: [
      'Equipe pequena para suporte 24/7',
      'Marca ainda pouco conhecida no mercado',
      'Dependência de conectividade estável',
    ],
    opportunities: [
      'Expansão para América Latina',
      'Parcerias com fabricantes de equipamentos',
      'Crescimento de incentivos governamentais para digitalização',
    ],
    threats: [
      'Entrada de grandes players globais no mercado local',
      'Resistência à mudança em indústrias tradicionais',
      'Volatilidade cambial afetando investimentos',
    ],
  },
  fundingOpportunities: [
    'BNDES Inovação - Linha de crédito para indústria 4.0',
    'Fundos de VC especializados em Industrial Tech',
    'Programa EMBRAPII para P&D em automação',
  ],
  partnerships: [
    'Integradores de sistemas industriais',
    'Universidades com centros de pesquisa em IA',
    'Associações setoriais (ABINEE, CNI)',
  ],
  growthPotential:
    'Alto potencial de crescimento (8-10x em 3 anos). Mercado em expansão, produto validado, e possibilidade de escala regional com adaptações mínimas.',
  status: 'completed',
  createdAt: '2025-01-16T14:20:00Z',
  updatedAt: '2025-01-16T18:45:00Z',
};

const mockAnalysis = {
  id: 'ana_001',
  summary: `A TechInova Solutions apresenta uma proposta de valor clara e diferenciada no mercado de automação industrial. Com um MVP já em produção e receita recorrente estabelecida, a empresa demonstra tração significativa.

Pontos fortes incluem: solução tecnicamente sólida, equipe qualificada, e posicionamento competitivo com custo-benefício atrativo para o mercado brasileiro.

Áreas de atenção: necessidade de fortalecer capacidade de suporte, investir em marketing B2B, e estabelecer parcerias estratégicas para acelerar go-to-market.

O momento é favorável para captação de investimento Série A (R$ 2-3M) focado em expansão comercial e fortalecimento da equipe.`,
  score: 78,
  recommendations: [
    'Estruturar programa de Customer Success para reduzir churn e aumentar LTV dos clientes atuais',
    'Desenvolver estratégia de parceria com integradores regionais para acelerar penetração de mercado',
    'Investir em certificações de segurança (ISO 27001) como diferencial competitivo em vendas enterprise',
    'Criar casos de uso documentados por vertical industrial para facilitar ciclo de vendas',
    'Estabelecer roadmap de produto focado em features mais demandadas por clientes potenciais',
  ],
  pdfUrl: '/mock/analise-completa.pdf',
  status: 'sent',
  createdAt: '2025-01-17T09:15:00Z',
  sentAt: '2025-01-17T11:30:00Z',
};

export default function PainelPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  const hasEnrichment = mockSubmission.status !== 'pending' && mockSubmission.status !== 'in_review';
  const hasAnalysis = mockSubmission.status === 'completed';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meu Painel</h1>
        <p className="text-gray-600 mt-2">
          Acompanhe o status da sua submissão e acesse os resultados da análise.
        </p>
      </div>

      {/* Accordion Sections */}
      <Accordion type="single" collapsible defaultValue="submission" className="space-y-4">
        {/* 1. Submission Data - Always visible */}
        <AccordionItem value="submission" className="border border-gray-200 rounded-lg bg-white">
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between w-full mr-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#00a859] text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Dados de Envio
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Sempre visível
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <SubmissionCard submission={mockSubmission} />
          </AccordionContent>
        </AccordionItem>

        {/* 2. Enrichment Data - Dropdown, only if enriched */}
        {hasEnrichment && (
          <AccordionItem value="enrichment" className="border border-gray-200 rounded-lg bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Enriquecimento de Dados
                  </span>
                </div>
                <span className="text-sm text-indigo-600 font-medium">
                  Disponível
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <EnrichmentCard enrichment={mockEnrichment} />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* 3. Analysis/Report - Dropdown, only when admin sends it */}
        {hasAnalysis && (
          <AccordionItem value="analysis" className="border border-gray-200 rounded-lg bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    Análise e Relatório
                  </span>
                </div>
                <span className="text-sm text-green-600 font-medium">
                  Relatório disponível
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <AnalysisCard analysis={mockAnalysis} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Status Messages */}
      {!hasEnrichment && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Sua submissão está em análise
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Estamos processando seus dados. O enriquecimento estará disponível em breve.
              </p>
            </div>
          </div>
        </div>
      )}

      {hasEnrichment && !hasAnalysis && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-purple-600 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-purple-900">
                Análise em andamento
              </p>
              <p className="text-sm text-purple-700 mt-1">
                Nossos especialistas estão revisando seu caso. O relatório final será disponibilizado em breve.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
