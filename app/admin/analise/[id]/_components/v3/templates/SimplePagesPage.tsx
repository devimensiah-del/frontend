// Simple divider/placeholder pages for TOC and section dividers

export function TocPage({ companyName, date }: { companyName: string; date: string }) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
                <div className="text-[10px] font-semibold text-[#B89E68]">03</div>
                <div className="text-[10px] text-[#71717A]">{companyName}</div>
            </div>

            <h1 className="text-[24px] font-light text-[#0A101D] mb-6">Índice</h1>

            <div className="space-y-3 text-[10px]">
                <div className="flex justify-between border-b border-[#E5E0D6] pb-2">
                    <span>Sumário Executivo</span>
                    <span className="text-[#B89E68]">02</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E0D6] pb-2">
                    <span>Análise PESTEL</span>
                    <span className="text-[#B89E68]">05-06</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E0D6] pb-2">
                    <span>7 Forças de Porter</span>
                    <span className="text-[#B89E68]">07</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E0D6] pb-2">
                    <span>Análise SWOT</span>
                    <span className="text-[#B89E68]">08</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E0D6] pb-2">
                    <span>TAM SAM SOM</span>
                    <span className="text-[#B89E68]">09</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E0D6] pb-2">
                    <span>Blue Ocean Strategy</span>
                    <span className="text-[#B89E68]">11</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E0D6] pb-2">
                    <span>OKRs Estratégicos</span>
                    <span className="text-[#B89E68]">15</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E0D6] pb-2">
                    <span>Cenários Futuros</span>
                    <span className="text-[#B89E68]">21</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E0D6] pb-2">
                    <span>Recomendações</span>
                    <span className="text-[#B89E68]">23</span>
                </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#E5E0D6] text-[8px] text-[#71717A] mt-auto">
                <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
                <div>{date}</div>
            </div>
        </div>
    );
}

export function DividerPage({ title, subtitle, pageNumber }: { title: string; subtitle: string; pageNumber: string }) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0A101D] to-[#1F2937]">
            <div className="text-center">
                <div className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#B89E68] mb-6">
                    {subtitle}
                </div>
                <h1 className="text-[48px] font-light text-white tracking-tight">
                    {title}
                </h1>
            </div>
            <div className="absolute bottom-8 right-8 text-[10px] text-[#B89E68] font-semibold">
                {pageNumber}
            </div>
        </div>
    );
}
