"use client";

interface AnalysisData {
  submissionId: string;
  companyName: string;
  lastUpdated: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  pestel: {
    political: string[];
    economic: string[];
    social: string[];
    technological: string[];
    environmental: string[];
    legal: string[];
  };
  porter: {
    competitiveRivalry: {
      intensity: string;
      factors: string[];
    };
    threatOfNewEntrants: {
      intensity: string;
      factors: string[];
    };
    bargainingPowerOfSuppliers: {
      intensity: string;
      factors: string[];
    };
    bargainingPowerOfBuyers: {
      intensity: string;
      factors: string[];
    };
    threatOfSubstitutes: {
      intensity: string;
      factors: string[];
    };
  };
}

interface PreviewPanelProps {
  analysis: AnalysisData;
}

export function PreviewPanel({ analysis }: PreviewPanelProps) {
  const generateHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #111827;
              line-height: 1.6;
              background: #F7F6F4;
            }

            .page {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              background: white;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              margin: 0 auto;
            }

            .header {
              border-bottom: 2px solid #0A101D;
              padding-bottom: 16px;
              margin-bottom: 32px;
            }

            .header h1 {
              font-size: 32px;
              font-weight: 600;
              color: #0A101D;
              letter-spacing: -0.025em;
              margin-bottom: 8px;
            }

            .header .meta {
              font-size: 12px;
              color: #52525B;
              text-transform: uppercase;
              letter-spacing: 0.15em;
            }

            .section {
              margin-bottom: 32px;
            }

            .section-title {
              font-size: 18px;
              font-weight: 600;
              color: #0A101D;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 1px solid #E5E0D6;
            }

            .subsection {
              margin-bottom: 20px;
            }

            .subsection-title {
              font-size: 14px;
              font-weight: 600;
              color: #B89E68;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              margin-bottom: 8px;
            }

            .list {
              list-style: none;
              padding-left: 0;
            }

            .list li {
              padding-left: 20px;
              margin-bottom: 8px;
              position: relative;
              font-size: 14px;
              line-height: 1.6;
            }

            .list li:before {
              content: "•";
              position: absolute;
              left: 0;
              color: #B89E68;
              font-weight: bold;
            }

            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }

            .intensity {
              display: inline-block;
              padding: 4px 12px;
              background: #EBE5D9;
              color: #0A101D;
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              margin-bottom: 8px;
            }

            .footer {
              margin-top: 48px;
              padding-top: 16px;
              border-top: 1px solid #E5E0D6;
              text-align: center;
              font-size: 11px;
              color: #71717A;
            }
          </style>
        </head>
        <body>
          <div class="page">
            <!-- Header -->
            <div class="header">
              <h1>Strategic Analysis Report</h1>
              <div class="meta">${analysis.companyName} • ${new Date(
      analysis.lastUpdated
    ).toLocaleDateString("pt-BR")}</div>
            </div>

            <!-- SWOT Analysis -->
            <div class="section">
              <h2 class="section-title">SWOT Analysis</h2>
              <div class="grid-2">
                <div class="subsection">
                  <h3 class="subsection-title">Strengths</h3>
                  <ul class="list">
                    ${analysis.swot.strengths
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
                <div class="subsection">
                  <h3 class="subsection-title">Weaknesses</h3>
                  <ul class="list">
                    ${analysis.swot.weaknesses
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
                <div class="subsection">
                  <h3 class="subsection-title">Opportunities</h3>
                  <ul class="list">
                    ${analysis.swot.opportunities
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
                <div class="subsection">
                  <h3 class="subsection-title">Threats</h3>
                  <ul class="list">
                    ${analysis.swot.threats
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
              </div>
            </div>

            <!-- PESTEL Analysis -->
            <div class="section">
              <h2 class="section-title">PESTEL Analysis</h2>
              <div class="grid-2">
                <div class="subsection">
                  <h3 class="subsection-title">Political</h3>
                  <ul class="list">
                    ${analysis.pestel.political
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
                <div class="subsection">
                  <h3 class="subsection-title">Economic</h3>
                  <ul class="list">
                    ${analysis.pestel.economic
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
                <div class="subsection">
                  <h3 class="subsection-title">Social</h3>
                  <ul class="list">
                    ${analysis.pestel.social
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
                <div class="subsection">
                  <h3 class="subsection-title">Technological</h3>
                  <ul class="list">
                    ${analysis.pestel.technological
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
                <div class="subsection">
                  <h3 class="subsection-title">Environmental</h3>
                  <ul class="list">
                    ${analysis.pestel.environmental
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
                <div class="subsection">
                  <h3 class="subsection-title">Legal</h3>
                  <ul class="list">
                    ${analysis.pestel.legal
                      .map((item) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
              </div>
            </div>

            <!-- Porter's Five Forces -->
            <div class="section">
              <h2 class="section-title">Porter's Five Forces</h2>

              <div class="subsection">
                <h3 class="subsection-title">Competitive Rivalry</h3>
                <div class="intensity">${
                  analysis.porter.competitiveRivalry.intensity
                }</div>
                <ul class="list">
                  ${analysis.porter.competitiveRivalry.factors
                    .map((item) => `<li>${item}</li>`)
                    .join("")}
                </ul>
              </div>

              <div class="subsection">
                <h3 class="subsection-title">Threat of New Entrants</h3>
                <div class="intensity">${
                  analysis.porter.threatOfNewEntrants.intensity
                }</div>
                <ul class="list">
                  ${analysis.porter.threatOfNewEntrants.factors
                    .map((item) => `<li>${item}</li>`)
                    .join("")}
                </ul>
              </div>

              <div class="subsection">
                <h3 class="subsection-title">Bargaining Power of Suppliers</h3>
                <div class="intensity">${
                  analysis.porter.bargainingPowerOfSuppliers.intensity
                }</div>
                <ul class="list">
                  ${analysis.porter.bargainingPowerOfSuppliers.factors
                    .map((item) => `<li>${item}</li>`)
                    .join("")}
                </ul>
              </div>

              <div class="subsection">
                <h3 class="subsection-title">Bargaining Power of Buyers</h3>
                <div class="intensity">${
                  analysis.porter.bargainingPowerOfBuyers.intensity
                }</div>
                <ul class="list">
                  ${analysis.porter.bargainingPowerOfBuyers.factors
                    .map((item) => `<li>${item}</li>`)
                    .join("")}
                </ul>
              </div>

              <div class="subsection">
                <h3 class="subsection-title">Threat of Substitutes</h3>
                <div class="intensity">${
                  analysis.porter.threatOfSubstitutes.intensity
                }</div>
                <ul class="list">
                  ${analysis.porter.threatOfSubstitutes.factors
                    .map((item) => `<li>${item}</li>`)
                    .join("")}
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>IMENSIAH | Estratégia Privada</p>
              <p>Confidential Strategic Analysis • ${new Date().getFullYear()}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="mb-4">
        <h3 className="font-heading text-sm uppercase tracking-widest text-[var(--text-secondary)] font-medium">
          A4 Preview
        </h3>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-y-auto bg-[var(--surface-paper)] p-8">
        <div className="max-w-[210mm] mx-auto">
          <iframe
            srcDoc={generateHTML()}
            className="w-full min-h-[297mm] bg-white border border-[var(--line-color)] shadow-lg"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}
