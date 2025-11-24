import type { Analysis, Submission } from "@/types";
import { getPageMapping, TOTAL_PAGES } from "./templates/pageMapping";
import { SwotPage } from "./templates/SwotPage";
import { CoverPage } from "./templates/CoverPage";
import { ExecSummaryPage } from "./templates/ExecSummaryPage";
import { TocPage, DividerPage } from "./templates/SimplePagesPage";
import { PestelPesPage } from "./templates/PestelPesPage";
import { PestelTelPage } from "./templates/PestelTelPage";
import { PorterPage } from "./templates/PorterPage";
import {
    TamSamSomPage, BlueOceanPage, OkrsPage, ScenariosPage,
    BenchmarkingPage, PlaceholderPage
} from "./templates/AllPages";

interface ReportPreviewProps {
    data: Analysis['analysis'];
    analysis: Analysis;
    submission?: Submission;
}

export function ReportPreview({ data, analysis, submission }: ReportPreviewProps) {
    const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
    const currentDate = new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const companyName = submission?.companyName || "Company Name";
    const industry = submission?.industry || "Technology";
    const market = submission?.targetMarket || submission?.strategicGoal || "B2B";

    const renderPage = (pageNum: number) => {
        const mapping = getPageMapping(pageNum);

        if (pageNum === 1) {
            return (
                <CoverPage
                    companyName={companyName}
                    industry={industry}
                    market={market}
                    date={currentDate}
                    version={analysis.version}
                />
            );
        }

        if (pageNum === 2 && data.synthesis) {
            return (
                <ExecSummaryPage
                    data={data.synthesis}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 3) {
            return <TocPage companyName={companyName} date={currentDate} />;
        }

        if (pageNum === 4) {
            return (
                <DividerPage
                    title="Parte 1"
                    subtitle="Análise Ambiental"
                    pageNumber="04"
                />
            );
        }

        if (pageNum === 5 && data.pestel) {
            return (
                <PestelPesPage
                    data={data.pestel}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 6 && data.pestel) {
            return (
                <PestelTelPage
                    data={data.pestel}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 7 && data.porter) {
            return (
                <PorterPage
                    data={data.porter}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 8 && data.swot) {
            return (
                <SwotPage
                    data={data.swot}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 9 && data.tamSamSom) {
            return (
                <TamSamSomPage
                    data={data.tamSamSom}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 10) {
            return (
                <DividerPage
                    title="Parte 2"
                    subtitle="Posicionamento Estratégico"
                    pageNumber="10"
                />
            );
        }

        if (pageNum === 11 && data.blueOcean) {
            return (
                <BlueOceanPage
                    data={data.blueOcean}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 12) {
            return (
                <PlaceholderPage
                    pageNumber="12"
                    title="Business Model Canvas"
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 13 && data.benchmarking) {
            return (
                <BenchmarkingPage
                    data={data.benchmarking}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 14) {
            return (
                <DividerPage
                    title="Parte 3"
                    subtitle="Roadmap de Execução"
                    pageNumber="14"
                />
            );
        }

        if (pageNum === 15 && data.okrs) {
            return (
                <OkrsPage
                    data={data.okrs}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum >= 16 && pageNum <= 18) {
            const titles = {
                16: "Projeções Financeiras",
                17: "Growth Loops",
                18: "Estratégia GTM"
            };
            return (
                <PlaceholderPage
                    pageNumber={String(pageNum).padStart(2, '0')}
                    title={titles[pageNum as keyof typeof titles]}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 19) {
            return (
                <DividerPage
                    title="Parte 4"
                    subtitle="Riscos e Planejamento"
                    pageNumber="19"
                />
            );
        }

        if (pageNum === 20) {
            return (
                <PlaceholderPage
                    pageNumber="20"
                    title="Matriz de Riscos"
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum === 21 && data.scenarios) {
            return (
                <ScenariosPage
                    data={data.scenarios}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        if (pageNum >= 22 && pageNum <= 24) {
            const titles = {
                22: "Roadmap Estratégico",
                23: "Recomendações",
                24: "Apêndice"
            };
            return (
                <PlaceholderPage
                    pageNumber={String(pageNum).padStart(2, '0')}
                    title={titles[pageNum as keyof typeof titles]}
                    companyName={companyName}
                    date={currentDate}
                />
            );
        }

        return (
            <PlaceholderPage
                pageNumber={String(pageNum).padStart(2, '0')}
                title={mapping?.title || `Page ${pageNum}`}
                companyName={companyName}
                date={currentDate}
            />
        );
    };

    return (
        <div className="flex flex-col items-center py-12 space-y-8 bg-[#525659]">
            {pages.map((pageNum) => (
                <div
                    key={pageNum}
                    className="relative bg-white shadow-2xl origin-top"
                    style={{
                        width: '1122px',
                        height: '793px',
                        transform: 'scale(0.85)',
                        marginBottom: '-100px'
                    }}
                >
                    <div className="absolute inset-0 overflow-hidden">
                        {renderPage(pageNum)}
                    </div>

                    <div className="absolute bottom-4 right-8 text-xs text-gray-400 font-mono">
                        Page {pageNum} of {TOTAL_PAGES}
                    </div>
                </div>
            ))}
        </div>
    );
}
