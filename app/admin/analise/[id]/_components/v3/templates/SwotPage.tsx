import type { SWOTAnalysis } from "@/types";

interface SwotPageProps {
    data: SWOTAnalysis;
    companyName: string;
    date: string;
}

export function SwotPage({ data, companyName, date }: SwotPageProps) {
    return (
        <div className="w-[842px] h-[595px] max-w-[842px] max-h-[595px] overflow-hidden p-8 flex flex-col bg-white">
            <style jsx>{`
        .swot-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          flex: 1;
          overflow: hidden;
        }
        .swot-box {
          border: 1px solid #E5E0D6;
          padding: 14px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .swot-title {
          font-size: 10px;
          font-weight: 700;
          color: #FFFFFF;
          padding: 7px 10px;
          margin: -14px -14px 10px -14px;
        }
        .swot-strengths .swot-title { background: #10b981; }
        .swot-weaknesses .swot-title { background: #0A101D; }
        .swot-opportunities .swot-title { background: #B89E68; }
        .swot-threats .swot-title { background: #71717A; }
        .swot-list {
          list-style: none;
          flex: 1;
          overflow: hidden;
        }
        .swot-item {
          font-size: 8.5px;
          line-height: 1.35;
          color: #111827;
          margin-bottom: 8px;
          padding-left: 10px;
          position: relative;
        }
        .swot-item::before {
          content: '•';
          position: absolute;
          left: 0;
          font-weight: 700;
        }
        .swot-strengths .swot-item::before { color: #10b981; }
        .swot-weaknesses .swot-item::before { color: #0A101D; }
        .swot-opportunities .swot-item::before { color: #B89E68; }
        .swot-threats .swot-item::before { color: #71717A; }
        .swot-item-content {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 3px;
        }
        .swot-meta {
          display: flex;
          gap: 6px;
          align-items: center;
          font-size: 6px;
          margin-top: 2px;
        }
        .confidence-badge {
          display: inline-block;
          padding: 2px 5px;
          border-radius: 2px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .confidence-alta { background: #D1FAE5; color: #065F46; }
        .confidence-média { background: #FEF3C7; color: #92400E; }
        .confidence-baixa { background: #FEE2E2; color: #991B1B; }
        .source-indicator {
          color: #71717A;
          font-style: italic;
        }
      `}</style>

            {/* Header */}
            <div className="flex justify-between mb-4 pb-2 border-b border-[#E5E0D6]">
                <div className="text-[10px] font-semibold text-[#B89E68]">06</div>
                <div className="text-[10px] text-[#71717A]">{companyName}</div>
            </div>

            {/* Title */}
            <h1 className="text-[22px] font-light text-[#0A101D] mb-1">Análise SWOT</h1>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-[#B89E68] mb-4">
                Posicionamento Estratégico
            </div>

            {/* SWOT Grid */}
            <div className="swot-grid">
                {/* Strengths */}
                <div className="swot-box swot-strengths">
                    <div className="swot-title">Forças</div>
                    <ul className="swot-list">
                        {data.strengths?.map((item, idx) => (
                            <li key={idx} className="swot-item">
                                <div className="swot-item-content">{item.content}</div>
                                <div className="swot-meta">
                                    <span className={`confidence-badge confidence-${item.confidence?.toLowerCase()}`}>
                                        {item.confidence}
                                    </span>
                                    <span className="source-indicator">{item.source}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div className="swot-box swot-weaknesses">
                    <div className="swot-title">Fraquezas</div>
                    <ul className="swot-list">
                        {data.weaknesses?.map((item, idx) => (
                            <li key={idx} className="swot-item">
                                <div className="swot-item-content">{item.content}</div>
                                <div className="swot-meta">
                                    <span className={`confidence-badge confidence-${item.confidence?.toLowerCase()}`}>
                                        {item.confidence}
                                    </span>
                                    <span className="source-indicator">{item.source}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Opportunities */}
                <div className="swot-box swot-opportunities">
                    <div className="swot-title">Oportunidades</div>
                    <ul className="swot-list">
                        {data.opportunities?.map((item, idx) => (
                            <li key={idx} className="swot-item">
                                <div className="swot-item-content">{item.content}</div>
                                <div className="swot-meta">
                                    <span className={`confidence-badge confidence-${item.confidence?.toLowerCase()}`}>
                                        {item.confidence}
                                    </span>
                                    <span className="source-indicator">{item.source}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Threats */}
                <div className="swot-box swot-threats">
                    <div className="swot-title">Ameaças</div>
                    <ul className="swot-list">
                        {data.threats?.map((item, idx) => (
                            <li key={idx} className="swot-item">
                                <div className="swot-item-content">{item.content}</div>
                                <div className="swot-meta">
                                    <span className={`confidence-badge confidence-${item.confidence?.toLowerCase()}`}>
                                        {item.confidence}
                                    </span>
                                    <span className="source-indicator">{item.source}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between pt-3 border-t border-[#E5E0D6] text-[8px] text-[#71717A] mt-auto">
                <div>IMENSIAH — Relatório de Inteligência Estratégica</div>
                <div>{date}</div>
            </div>
        </div>
    );
}
