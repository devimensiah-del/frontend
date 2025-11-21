/**
 * Mock Report Data
 * Complete 13-page HTML reports for submissions
 */

import { Report } from '../types';

export const mockReports: Report[] = [
  {
    id: 'rep_001',
    submissionId: 'sub_001',
    analysisId: 'ana_001',

    executiveSummary: {
      title: 'Sumário Executivo',
      pageNumber: 1,
      content: `
        <div class="executive-summary">
          <h1>Relatório Estratégico - Petrobras</h1>
          <h2>Sumário Executivo</h2>

          <div class="key-findings">
            <h3>Principais Conclusões</h3>
            <ul>
              <li><strong>Posição Competitiva:</strong> Líder absoluto no mercado brasileiro de petróleo e gás com domínio tecnológico em exploração de pré-sal</li>
              <li><strong>Desafio Estratégico:</strong> Necessidade urgente de acelerar transição energética enquanto maximiza valor de ativos tradicionais</li>
              <li><strong>Oportunidade Principal:</strong> Diversificação para energias renováveis, especialmente hidrogênio verde e captura de carbono</li>
              <li><strong>Risco Crítico:</strong> Velocidade de transição energética global pode tornar ativos obsoletos antes do esperado</li>
            </ul>
          </div>

          <div class="strategic-imperatives">
            <h3>Imperativos Estratégicos</h3>
            <ol>
              <li>Acelerar investimentos em energias renováveis para 20-30% do CAPEX até 2030</li>
              <li>Desenvolver centro de excelência em hidrogênio verde</li>
              <li>Criar divisão de soluções energéticas integradas</li>
              <li>Implementar programa agressivo de descarbonização</li>
              <li>Estabelecer parcerias com players de tecnologia</li>
            </ol>
          </div>

          <div class="financial-outlook">
            <h3>Perspectiva Financeira</h3>
            <p>
              <strong>Geração de Caixa:</strong> R$ 180 bilhões/ano (EBITDA)<br>
              <strong>Capacidade de Investimento:</strong> US$ 10-12 bilhões/ano<br>
              <strong>Saúde Financeira:</strong> Sólida, com redução consistente de endividamento
            </p>
          </div>

          <div class="timeline">
            <h3>Horizonte de Implementação</h3>
            <table>
              <tr>
                <th>Curto Prazo (0-12 meses)</th>
                <td>Lançar programa de transição energética, criar venture capital para startups</td>
              </tr>
              <tr>
                <th>Médio Prazo (1-3 anos)</th>
                <td>Projetos piloto de hidrogênio verde, requalificação de força de trabalho</td>
              </tr>
              <tr>
                <th>Longo Prazo (3-5 anos)</th>
                <td>Portfólio diversificado com 20% em renováveis, liderança em captura de carbono</td>
              </tr>
            </table>
          </div>
        </div>
      `,
    },

    companyOverview: {
      title: 'Visão Geral da Empresa',
      pageNumber: 2,
      content: `
        <div class="company-overview">
          <h2>Visão Geral da Empresa</h2>

          <div class="company-profile">
            <h3>Perfil Corporativo</h3>
            <table>
              <tr><td><strong>Razão Social:</strong></td><td>Petróleo Brasileiro S.A.</td></tr>
              <tr><td><strong>Nome Fantasia:</strong></td><td>Petrobras</td></tr>
              <tr><td><strong>CNPJ:</strong></td><td>33.000.167/0001-01</td></tr>
              <tr><td><strong>Fundação:</strong></td><td>1953</td></tr>
              <tr><td><strong>Sede:</strong></td><td>Rio de Janeiro, RJ</td></tr>
              <tr><td><strong>Funcionários:</strong></td><td>45.000</td></tr>
              <tr><td><strong>Receita Anual:</strong></td><td>R$ 425 bilhões (2023)</td></tr>
            </table>
          </div>

          <div class="strategic-profile">
            <h3>Perfil Estratégico</h3>
            <p><strong>Missão:</strong> Operar de forma segura e rentável na indústria de óleo, gás e energia, com responsabilidade social e ambiental</p>
            <p><strong>Visão:</strong> Ser uma empresa integrada de energia, reconhecida por sua excelência e compromisso com a sustentabilidade</p>

            <h4>Valores Fundamentais</h4>
            <ul>
              <li>Segurança em primeiro lugar</li>
              <li>Respeito à vida</li>
              <li>Sustentabilidade</li>
              <li>Integridade</li>
              <li>Excelência operacional</li>
            </ul>
          </div>

          <div class="core-competencies">
            <h3>Competências-Chave</h3>
            <div class="competency-grid">
              <div class="competency">
                <h4>Exploração em Águas Profundas</h4>
                <p>Tecnologia proprietária líder mundial em exploração offshore</p>
              </div>
              <div class="competency">
                <h4>Refino de Alta Complexidade</h4>
                <p>Capacidade de processar petróleos pesados e ácidos</p>
              </div>
              <div class="competency">
                <h4>Gestão de Grandes Projetos</h4>
                <p>Expertise em projetos complexos de E&P</p>
              </div>
              <div class="competency">
                <h4>Inovação Tecnológica</h4>
                <p>Centro de pesquisa CENPES de classe mundial</p>
              </div>
            </div>
          </div>
        </div>
      `,
    },

    marketAnalysis: {
      title: 'Análise de Mercado',
      pageNumber: 3,
      content: `
        <div class="market-analysis">
          <h2>Análise de Mercado</h2>

          <div class="market-overview">
            <h3>Panorama do Setor</h3>
            <p>O setor de energia global está em profunda transformação, com pressão crescente por descarbonização e transição para fontes renováveis. O mercado brasileiro de energia representa R$ 2,5 trilhões, com crescimento de 2-3% ao ano em energia tradicional e 15-20% em renováveis.</p>
          </div>

          <div class="pestel">
            <h3>Análise PESTEL</h3>

            <h4>Político ⚖️</h4>
            <p><strong>Impacto:</strong> Neutro</p>
            <ul>
              <li>✅ Política energética favorece transição gradual</li>
              <li>⚠️ Pressão internacional por descarbonização</li>
              <li>⚠️ Influência governamental em decisões (empresa estatal)</li>
            </ul>

            <h4>Econômico 💰</h4>
            <p><strong>Impacto:</strong> Positivo</p>
            <ul>
              <li>✅ Taxa de câmbio favorável para exportações</li>
              <li>⚠️ Volatilidade do preço do petróleo</li>
              <li>➡️ Crescimento moderado da economia brasileira</li>
            </ul>

            <h4>Social 👥</h4>
            <p><strong>Impacto:</strong> Negativo</p>
            <ul>
              <li>⚠️ Crescente consciência ambiental da população</li>
              <li>⚠️ Demanda por transparência e responsabilidade social</li>
              <li>❌ Ativismo ambiental contra combustíveis fósseis</li>
            </ul>

            <h4>Tecnológico 🔬</h4>
            <p><strong>Impacto:</strong> Positivo</p>
            <ul>
              <li>✅ Avanços em exploração offshore</li>
              <li>✅ Tecnologias de captura de carbono</li>
              <li>✅ Digitalização e IoT na indústria</li>
            </ul>

            <h4>Ambiental 🌍</h4>
            <p><strong>Impacto:</strong> Negativo</p>
            <ul>
              <li>❌ Compromissos climáticos do Acordo de Paris</li>
              <li>❌ Regulação ambiental mais rigorosa</li>
              <li>⚠️ Risco de desastres ambientais</li>
            </ul>

            <h4>Legal ⚖️</h4>
            <p><strong>Impacto:</strong> Neutro</p>
            <ul>
              <li>✅ Marco regulatório do pré-sal favorável</li>
              <li>⚠️ Legislação trabalhista complexa</li>
              <li>➡️ Compliance pós-Lava Jato</li>
            </ul>
          </div>

          <div class="market-trends">
            <h3>Tendências-Chave do Mercado</h3>
            <ol>
              <li><strong>Transição Energética Global:</strong> Aceleração da substituição de combustíveis fósseis</li>
              <li><strong>ESG e Sustentabilidade:</strong> Crescente pressão de investidores e stakeholders</li>
              <li><strong>Digitalização:</strong> Automação e IA transformando operações</li>
              <li><strong>Hidrogênio Verde:</strong> Emergência como combustível do futuro</li>
              <li><strong>Captura de Carbono:</strong> Tecnologia crítica para descarbonização</li>
            </ol>
          </div>
        </div>
      `,
    },

    competitiveAnalysis: {
      title: 'Análise Competitiva',
      pageNumber: 4,
      content: `
        <div class="competitive-analysis">
          <h2>Análise Competitiva</h2>

          <div class="porter-five-forces">
            <h3>5 Forças de Porter</h3>

            <div class="force">
              <h4>Ameaça de Novos Entrantes: <span class="level-low">BAIXA</span></h4>
              <p>Barreiras de entrada extremamente altas protegem posição da Petrobras devido a alto investimento de capital, tecnologia complexa e regulação rigorosa.</p>
            </div>

            <div class="force">
              <h4>Poder de Barganha dos Fornecedores: <span class="level-medium">MÉDIO</span></h4>
              <p>Poder moderado devido à especialização de equipamentos offshore, mitigado pela escala da Petrobras.</p>
            </div>

            <div class="force">
              <h4>Poder de Barganha dos Compradores: <span class="level-medium">MÉDIO</span></h4>
              <p>Poder moderado, limitado pela natureza commodity do produto e preços definidos pelo mercado.</p>
            </div>

            <div class="force">
              <h4>Ameaça de Substitutos: <span class="level-high">ALTA</span></h4>
              <p>Ameaça crescente de energias renováveis, veículos elétricos e hidrogênio verde.</p>
            </div>

            <div class="force">
              <h4>Rivalidade Competitiva: <span class="level-medium">MÉDIA</span></h4>
              <p>Domínio no Brasil, mas competição intensa com majors internacionais em leilões e mercados externos.</p>
            </div>

            <div class="attractiveness">
              <p><strong>Atratividade Geral do Setor:</strong> <span class="level-medium">MÉDIA</span></p>
            </div>
          </div>

          <div class="competitive-landscape">
            <h3>Panorama Competitivo</h3>

            <table class="competitors-table">
              <thead>
                <tr>
                  <th>Competidor</th>
                  <th>Market Share</th>
                  <th>Forças</th>
                  <th>Fraquezas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Shell Brasil</strong></td>
                  <td>8%</td>
                  <td>Tecnologia global, capital financeiro, experiência em renováveis</td>
                  <td>Menor conhecimento local, custos operacionais mais altos</td>
                </tr>
                <tr>
                  <td><strong>Equinor</strong></td>
                  <td>5%</td>
                  <td>Expertise em offshore, sustentabilidade, inovação</td>
                  <td>Presença menor no Brasil, escala limitada</td>
                </tr>
                <tr>
                  <td><strong>TotalEnergies</strong></td>
                  <td>4%</td>
                  <td>Portfólio diversificado, investimento em renováveis</td>
                  <td>Entrada recente, menor rede de distribuição</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="competitive-advantages">
            <h3>Vantagens Competitivas</h3>
            <ul class="advantages-list">
              <li>✅ Domínio da tecnologia de pré-sal (única no mundo)</li>
              <li>✅ Infraestrutura estabelecida nacionalmente</li>
              <li>✅ Conhecimento profundo do mercado local</li>
              <li>✅ Escala de operações incomparável</li>
              <li>✅ Marca forte e reconhecida</li>
            </ul>

            <h3>Desvantagens Competitivas</h3>
            <ul class="disadvantages-list">
              <li>❌ Burocracia estatal limita agilidade</li>
              <li>❌ Dependência de commodities voláteis</li>
              <li>❌ Menor experiência em renováveis</li>
              <li>❌ Passivo reputacional ambiental</li>
            </ul>
          </div>
        </div>
      `,
    },

    swotAnalysis: {
      title: 'Análise SWOT',
      pageNumber: 5,
      content: `
        <div class="swot-analysis">
          <h2>Análise SWOT</h2>

          <div class="swot-matrix">
            <div class="swot-quadrant strengths">
              <h3>Forças (Strengths)</h3>
              <ul>
                <li><strong>Liderança tecnológica em pré-sal</strong> [ALTO IMPACTO]<br>
                    Tecnologia proprietária para exploração econômica em águas ultraprofundas</li>
                <li><strong>Infraestrutura integrada</strong> [ALTO IMPACTO]<br>
                    Cadeia de valor verticalmente integrada garante eficiência</li>
                <li><strong>Geração de caixa robusta</strong> [ALTO IMPACTO]<br>
                    Fluxo consistente permite investimentos e redução de dívida</li>
                <li><strong>Marca forte</strong> [MÉDIO IMPACTO]<br>
                    Reputação como empresa nacional estratégica</li>
              </ul>
            </div>

            <div class="swot-quadrant weaknesses">
              <h3>Fraquezas (Weaknesses)</h3>
              <ul>
                <li><strong>Dependência de combustíveis fósseis</strong> [ALTO IMPACTO]<br>
                    90%+ da receita vulnerável à transição energética</li>
                <li><strong>Atraso em renováveis</strong> [ALTO IMPACTO]<br>
                    Menor experiência que competidores globais</li>
                <li><strong>Burocracia estatal</strong> [MÉDIO IMPACTO]<br>
                    Lentidão decisória comparada a competidores privados</li>
                <li><strong>Passivo ambiental</strong> [MÉDIO IMPACTO]<br>
                    Histórico de acidentes e percepção negativa</li>
              </ul>
            </div>

            <div class="swot-quadrant opportunities">
              <h3>Oportunidades (Opportunities)</h3>
              <ul>
                <li><strong>Expansão em renováveis</strong> [ALTO POTENCIAL]<br>
                    Mercado de solar, eólica e hidrogênio verde crescendo</li>
                <li><strong>Exportação de pré-sal</strong> [ALTO POTENCIAL]<br>
                    Demanda global por petróleo de qualidade superior</li>
                <li><strong>Biocombustíveis avançados</strong> [MÉDIO POTENCIAL]<br>
                    Crescimento do SAF (combustível de aviação sustentável)</li>
                <li><strong>Captura de carbono</strong> [MÉDIO POTENCIAL]<br>
                    Tecnologia emergente para descarbonização</li>
              </ul>
            </div>

            <div class="swot-quadrant threats">
              <h3>Ameaças (Threats)</h3>
              <ul>
                <li><strong>Transição energética acelerada</strong> [ALTA SEVERIDADE]<br>
                    Redução mais rápida na demanda por fósseis</li>
                <li><strong>Regulação ambiental rigorosa</strong> [ALTA SEVERIDADE]<br>
                    Custos crescentes de compliance</li>
                <li><strong>Volatilidade de commodities</strong> [MÉDIA SEVERIDADE]<br>
                    Oscilações no preço do barril</li>
                <li><strong>Competição internacional</strong> [MÉDIA SEVERIDADE]<br>
                    Majors com maior capital e experiência</li>
              </ul>
            </div>
          </div>

          <div class="strategic-implications">
            <h3>Implicações Estratégicas</h3>
            <p class="highlight">
              A Petrobras deve <strong>acelerar sua transição energética</strong> enquanto <strong>maximiza o valor de seus ativos tradicionais</strong>. A diversificação para renováveis é <strong>crítica para sustentabilidade de longo prazo</strong>, mas deve ser executada sem comprometer a geração de caixa atual.
            </p>
          </div>

          <div class="strategic-options">
            <h3>Opções Estratégicas</h3>
            <div class="option">
              <h4>SO (Strengths-Opportunities)</h4>
              <p>Usar expertise em projetos complexos para liderar em hidrogênio verde offshore</p>
            </div>
            <div class="option">
              <h4>WO (Weaknesses-Opportunities)</h4>
              <p>Acelerar investimento em renováveis para superar atraso competitivo</p>
            </div>
            <div class="option">
              <h4>ST (Strengths-Threats)</h4>
              <p>Maximizar valor do pré-sal enquanto há demanda</p>
            </div>
            <div class="option">
              <h4>WT (Weaknesses-Threats)</h4>
              <p>Desburocratizar para ganhar agilidade frente à competição</p>
            </div>
          </div>
        </div>
      `,
    },

    strategicFrameworks: {
      title: 'Frameworks Estratégicos',
      pageNumber: 6,
      content: `
        <div class="strategic-frameworks">
          <h2>Frameworks Estratégicos</h2>

          <div class="bcg-matrix">
            <h3>Matriz BCG</h3>
            <div class="bcg-grid">
              <div class="bcg-quadrant stars">
                <h4>⭐ Estrelas</h4>
                <p><strong>Exploração e Produção (Pré-sal)</strong></p>
                <p>Crescimento: 15% | Market Share: 2.5x</p>
                <p class="recommendation">✅ Investir agressivamente para manter liderança</p>
              </div>
              <div class="bcg-quadrant question-marks">
                <h4>❓ Pontos de Interrogação</h4>
                <p><strong>Energia Renovável</strong></p>
                <p>Crescimento: 25% | Market Share: 0.3x</p>
                <p class="recommendation">✅ Investir para construir posição competitiva</p>
                <p><strong>Gás Natural</strong></p>
                <p>Crescimento: 12% | Market Share: 0.8x</p>
                <p class="recommendation">⚠️ Avaliar investimentos seletivos</p>
              </div>
              <div class="bcg-quadrant cash-cows">
                <h4>🐄 Vacas Leiteiras</h4>
                <p><strong>Refino e Distribuição</strong></p>
                <p>Crescimento: 2% | Market Share: 3.0x</p>
                <p class="recommendation">✅ Otimizar operações e maximizar caixa</p>
              </div>
              <div class="bcg-quadrant dogs">
                <h4>🐶 Abacaxis</h4>
                <p><em>Nenhuma unidade identificada</em></p>
              </div>
            </div>
          </div>

          <div class="ansoff-matrix">
            <h3>Matriz de Ansoff</h3>
            <table class="ansoff-table">
              <tr>
                <th></th>
                <th>Produtos Existentes</th>
                <th>Novos Produtos</th>
              </tr>
              <tr>
                <th>Mercados Existentes</th>
                <td class="penetration">
                  <strong>Penetração de Mercado</strong><br>
                  <span class="feasibility high">Viabilidade: ALTA</span>
                  <ul>
                    <li>Aumentar participação em refino</li>
                    <li>Competir em leilões</li>
                  </ul>
                  <p class="risk">⚠️ Saturação de mercado</p>
                </td>
                <td class="product-dev">
                  <strong>Desenvolvimento de Produto</strong><br>
                  <span class="feasibility high">Viabilidade: ALTA</span>
                  <ul>
                    <li>Biocombustíveis avançados</li>
                    <li>Hidrogênio verde</li>
                  </ul>
                  <p class="risk">⚠️ Investimento alto em P&D</p>
                </td>
              </tr>
              <tr>
                <th>Novos Mercados</th>
                <td class="market-dev">
                  <strong>Desenvolvimento de Mercado</strong><br>
                  <span class="feasibility medium">Viabilidade: MÉDIA</span>
                  <ul>
                    <li>Exportar pré-sal</li>
                    <li>Expansão internacional</li>
                  </ul>
                  <p class="risk">⚠️ Competição internacional</p>
                </td>
                <td class="diversification">
                  <strong>Diversificação</strong><br>
                  <span class="feasibility medium">Viabilidade: MÉDIA</span>
                  <ul>
                    <li>Energia solar e eólica</li>
                    <li>Armazenamento de energia</li>
                  </ul>
                  <p class="risk">⚠️ Falta de expertise</p>
                </td>
              </tr>
            </table>
            <p class="recommendation"><strong>Estratégia Recomendada:</strong> Combinação de penetração (curto prazo) com desenvolvimento de produtos e diversificação (médio/longo prazo)</p>
          </div>

          <div class="vrio">
            <h3>Análise VRIO</h3>
            <table class="vrio-table">
              <thead>
                <tr>
                  <th>Recurso</th>
                  <th>Valioso?</th>
                  <th>Raro?</th>
                  <th>Imitável?</th>
                  <th>Organizado?</th>
                  <th>Implicação Competitiva</th>
                </tr>
              </thead>
              <tbody>
                <tr class="sustainable-advantage">
                  <td>Tecnologia de pré-sal</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td><strong>Vantagem Sustentável</strong></td>
                </tr>
                <tr class="temporary-advantage">
                  <td>Reservas provadas</td>
                  <td>✅</td>
                  <td>✅</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>Vantagem Temporária</td>
                </tr>
                <tr class="parity">
                  <td>Infraestrutura de refino</td>
                  <td>✅</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>Paridade Competitiva</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `,
    },

    valueChainAnalysis: {
      title: 'Análise da Cadeia de Valor',
      pageNumber: 7,
      content: `
        <div class="value-chain">
          <h2>Análise da Cadeia de Valor</h2>

          <div class="primary-activities">
            <h3>Atividades Primárias</h3>

            <div class="activity">
              <h4>Logística de Entrada <span class="value high">Criação de Valor: ALTA</span></h4>
              <ul>
                <li>Exploração e mapeamento de reservas</li>
                <li>Perfuração de poços</li>
              </ul>
              <p class="improvements"><strong>Melhorias:</strong> Automação de perfuração, IA para mapeamento geológico</p>
            </div>

            <div class="activity">
              <h4>Operações <span class="value high">Criação de Valor: ALTA</span></h4>
              <ul>
                <li>Extração de petróleo</li>
                <li>Processamento inicial</li>
                <li>Refino</li>
              </ul>
              <p class="improvements"><strong>Melhorias:</strong> Otimização de processos, manutenção preditiva</p>
            </div>

            <div class="activity">
              <h4>Logística de Saída <span class="value medium">Criação de Valor: MÉDIA</span></h4>
              <ul>
                <li>Armazenamento</li>
                <li>Transporte por dutos e navios</li>
                <li>Distribuição</li>
              </ul>
              <p class="improvements"><strong>Melhorias:</strong> Logística inteligente, redução de tempos</p>
            </div>

            <div class="activity">
              <h4>Marketing e Vendas <span class="value medium">Criação de Valor: MÉDIA</span></h4>
              <ul>
                <li>Contratos de longo prazo</li>
                <li>Trading de commodities</li>
              </ul>
              <p class="improvements"><strong>Melhorias:</strong> Diversificação de clientes, hedging sofisticado</p>
            </div>

            <div class="activity">
              <h4>Serviços <span class="value low">Criação de Valor: BAIXA</span></h4>
              <ul>
                <li>Suporte técnico a clientes</li>
                <li>Gestão de contratos</li>
              </ul>
              <p class="improvements"><strong>Melhorias:</strong> Serviços de valor agregado, consultoria energética</p>
            </div>
          </div>

          <div class="support-activities">
            <h3>Atividades de Suporte</h3>

            <div class="activity">
              <h4>Infraestrutura da Empresa <span class="value medium">Criação de Valor: MÉDIA</span></h4>
              <ul>
                <li>Governança corporativa</li>
                <li>Gestão financeira</li>
                <li>Relações institucionais</li>
              </ul>
              <p class="improvements"><strong>Melhorias:</strong> Desburocratização, agilidade decisória</p>
            </div>

            <div class="activity">
              <h4>Gestão de Recursos Humanos <span class="value high">Criação de Valor: ALTA</span></h4>
              <ul>
                <li>Recrutamento especializado</li>
                <li>Treinamento técnico</li>
                <li>Segurança do trabalho</li>
              </ul>
              <p class="improvements"><strong>Melhorias:</strong> Atração de talentos, retenção de expertise</p>
            </div>

            <div class="activity">
              <h4>Desenvolvimento de Tecnologia <span class="value high">Criação de Valor: ALTA</span></h4>
              <ul>
                <li>P&D em CENPES</li>
                <li>Inovação em exploração</li>
                <li>Digitalização</li>
              </ul>
              <p class="improvements"><strong>Melhorias:</strong> Parcerias com startups, inovação aberta</p>
            </div>

            <div class="activity">
              <h4>Aquisições <span class="value medium">Criação de Valor: MÉDIA</span></h4>
              <ul>
                <li>Compra de equipamentos</li>
                <li>Contratos de serviços</li>
                <li>Gestão de fornecedores</li>
              </ul>
              <p class="improvements"><strong>Melhorias:</strong> Nacionalização, negociação global</p>
            </div>
          </div>
        </div>
      `,
    },

    portfolioAnalysis: {
      title: 'Análise de Portfólio',
      pageNumber: 8,
      content: `
        <div class="portfolio-analysis">
          <h2>Análise de Portfólio</h2>
          <p>Análise detalhada do portfólio de negócios e recomendações de alocação de recursos...</p>
        </div>
      `,
    },

    balancedScorecard: {
      title: 'Balanced Scorecard',
      pageNumber: 9,
      content: `
        <div class="balanced-scorecard">
          <h2>Balanced Scorecard</h2>
          <p>Mapa estratégico com objetivos, medidas, metas e iniciativas...</p>
        </div>
      `,
    },

    organizationalAlignment: {
      title: 'Alinhamento Organizacional',
      pageNumber: 10,
      content: `
        <div class="organizational-alignment">
          <h2>Alinhamento Organizacional (McKinsey 7S)</h2>
          <p>Análise de alinhamento entre estratégia, estrutura, sistemas, valores, estilo, pessoas e habilidades...</p>
        </div>
      `,
    },

    strategicOpportunities: {
      title: 'Oportunidades Estratégicas',
      pageNumber: 11,
      content: `
        <div class="strategic-opportunities">
          <h2>Oportunidades Estratégicas</h2>
          <p>Blue Ocean Strategy e identificação de novos espaços de mercado...</p>
        </div>
      `,
    },

    implementationRoadmap: {
      title: 'Roadmap de Implementação',
      pageNumber: 12,
      content: `
        <div class="implementation-roadmap">
          <h2>Roadmap de Implementação</h2>

          <div class="priority-actions">
            <h3>Ações Prioritárias</h3>

            <div class="action critical">
              <h4>🔴 CRÍTICA - Curto Prazo (0-12 meses)</h4>
              <p><strong>Lançar programa de transição energética com metas claras</strong></p>
              <p>Impacto Esperado: Direcionamento estratégico claro e mobilização organizacional</p>
            </div>

            <div class="action high">
              <h4>🟠 ALTA - Médio Prazo (1-3 anos)</h4>
              <p><strong>Investir em projeto piloto de hidrogênio verde no Nordeste</strong></p>
              <p>Impacto Esperado: Aprendizado e posicionamento em tecnologia emergente</p>
            </div>

            <div class="action medium">
              <h4>🟡 MÉDIA - Curto Prazo (0-12 meses)</h4>
              <p><strong>Criar venture capital para startups de energia limpa</strong></p>
              <p>Impacto Esperado: Acesso a inovação e novas tecnologias</p>
            </div>
          </div>

          <div class="timeline">
            <h3>Cronograma de Implementação</h3>
            <table>
              <thead>
                <tr>
                  <th>Fase</th>
                  <th>Prazo</th>
                  <th>Iniciativas-Chave</th>
                  <th>Investimento</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Fase 1: Fundação</strong></td>
                  <td>0-12 meses</td>
                  <td>
                    • Programa de transição energética<br>
                    • Venture capital<br>
                    • Partnerships de tecnologia
                  </td>
                  <td>R$ 500 milhões</td>
                </tr>
                <tr>
                  <td><strong>Fase 2: Construção</strong></td>
                  <td>1-3 anos</td>
                  <td>
                    • Projetos piloto H2 verde<br>
                    • Requalificação de pessoal<br>
                    • Digitalização
                  </td>
                  <td>R$ 5 bilhões</td>
                </tr>
                <tr>
                  <td><strong>Fase 3: Escala</strong></td>
                  <td>3-5 anos</td>
                  <td>
                    • Portfólio 20% renováveis<br>
                    • Liderança em captura de carbono<br>
                    • Soluções integradas
                  </td>
                  <td>R$ 15 bilhões</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `,
    },

    appendices: {
      title: 'Apêndices e Referências',
      pageNumber: 13,
      content: `
        <div class="appendices">
          <h2>Apêndices e Referências</h2>

          <div class="data-sources">
            <h3>Fontes de Dados</h3>
            <ul>
              <li>Relatório Anual Petrobras 2023</li>
              <li>CVM - Comissão de Valores Mobiliários</li>
              <li>ANP - Agência Nacional de Petróleo</li>
              <li>Bloomberg Terminal</li>
              <li>Valor Econômico</li>
            </ul>
          </div>

          <div class="methodology">
            <h3>Metodologia</h3>
            <p>Esta análise utilizou 11 frameworks estratégicos consolidados:</p>
            <ol>
              <li>PESTEL - Análise macroambiental</li>
              <li>5 Forças de Porter - Análise de atratividade da indústria</li>
              <li>SWOT - Análise de posicionamento competitivo</li>
              <li>VRIO - Análise de recursos e capacidades</li>
              <li>Cadeia de Valor - Análise de atividades geradoras de valor</li>
              <li>Matriz BCG - Análise de portfólio</li>
              <li>Matriz de Ansoff - Análise de opções de crescimento</li>
              <li>Balanced Scorecard - Desdobramento estratégico</li>
              <li>McKinsey 7S - Análise de alinhamento organizacional</li>
              <li>Blue Ocean - Identificação de novos espaços de mercado</li>
              <li>Core Competencies - Análise de competências essenciais</li>
            </ol>
          </div>

          <div class="quality-metrics">
            <h3>Métricas de Qualidade</h3>
            <table>
              <tr>
                <td><strong>Score de Qualidade de Dados:</strong></td>
                <td>92/100</td>
              </tr>
              <tr>
                <td><strong>Confiabilidade das Fontes:</strong></td>
                <td>Alta</td>
              </tr>
              <tr>
                <td><strong>Score de Qualidade da Análise:</strong></td>
                <td>94/100</td>
              </tr>
              <tr>
                <td><strong>Nível de Confiança:</strong></td>
                <td>Alto</td>
              </tr>
              <tr>
                <td><strong>Última Verificação:</strong></td>
                <td>20/02/2024</td>
              </tr>
            </table>
          </div>

          <div class="disclaimer">
            <h3>Aviso Legal</h3>
            <p>Este relatório foi gerado com base em informações públicas e análises proprietárias. As recomendações estratégicas são de natureza consultiva e devem ser avaliadas no contexto específico da organização. A Imensiah não se responsabiliza por decisões tomadas com base exclusiva neste documento.</p>
          </div>
        </div>
      `,
    },

    generatedAt: '2024-02-25T18:45:00Z',
    version: '1.0',
    format: 'html',
    sharingToken: 'tk_abc123xyz',
    expiresAt: '2025-02-25T18:45:00Z',
    createdAt: '2024-02-25T18:30:00Z',
    updatedAt: '2024-02-25T18:45:00Z',
  },
];

export const getReportById = (id: string): Report | undefined => {
  return mockReports.find(rep => rep.id === id);
};

export const getReportBySubmissionId = (submissionId: string): Report | undefined => {
  return mockReports.find(rep => rep.submissionId === submissionId);
};

export const getReportByToken = (token: string): Report | undefined => {
  return mockReports.find(rep => rep.sharingToken === token);
};
