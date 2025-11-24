interface CoverPageProps {
    companyName: string;
    industry: string;
    market: string;
    date: string;
    version: number;
}

export function CoverPage({ companyName, industry, market, date, version }: CoverPageProps) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-10 flex flex-col relative bg-white">
            <style jsx>{`
        .accent-bar {
          position: absolute;
          left: 0;
          top: 100px;
          width: 6px;
          height: 180px;
          background: linear-gradient(180deg, #B89E68 0%, #A18852 100%);
        }
      `}</style>

            <div className="accent-bar" />

            {/* Logo */}
            <div className="mt-[60px] mb-10 text-center">
                <svg className="w-[100px] h-[100px] mx-auto" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="58" fill="none" stroke="#0A101D" strokeWidth="2" />
                    <text x="60" y="75" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="700" fill="#0A101D" textAnchor="middle">IM</text>
                </svg>
            </div>

            {/* Title Section */}
            <div className="flex-1 flex flex-col justify-center pl-10">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B89E68] mb-5">
                    Relatório de Análise Estratégica
                </div>
                <h1 className="text-[42px] font-light tracking-tight text-[#0A101D] mb-3 leading-tight">
                    {companyName}
                </h1>
                <div className="text-[18px] font-normal text-[#52525B] mb-[50px] tracking-wide">
                    Inteligência de Negócios Completa
                </div>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-4 gap-5 pl-10">
                <div className="border-l-2 border-[#E5E0D6] pl-3">
                    <div className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#71717A] mb-1">Setor</div>
                    <div className="text-[12px] font-medium text-[#0A101D]">{industry}</div>
                </div>
                <div className="border-l-2 border-[#E5E0D6] pl-3">
                    <div className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#71717A] mb-1">Mercado</div>
                    <div className="text-[12px] font-medium text-[#0A101D]">{market}</div>
                </div>
                <div className="border-l-2 border-[#E5E0D6] pl-3">
                    <div className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#71717A] mb-1">Data do Relatório</div>
                    <div className="text-[12px] font-medium text-[#0A101D]">{date}</div>
                </div>
                <div className="border-l-2 border-[#E5E0D6] pl-3">
                    <div className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#71717A] mb-1">Versão</div>
                    <div className="text-[12px] font-medium text-[#0A101D]">{version}.0</div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-10 right-10 pt-5 border-t border-[#E5E0D6]">
                <div className="text-[8px] text-[#71717A] text-center tracking-wider">
                    <span className="font-semibold text-[#B89E68]">IMENSIAH</span> — Inteligência Artificial + Inteligência Humana
                </div>
            </div>
        </div>
    );
}
