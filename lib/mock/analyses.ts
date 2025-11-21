/**
 * Mock Analysis Data
 * Complete strategic analysis frameworks for submissions
 * Contains all 11 frameworks: PESTEL, Porter, SWOT, VRIO, Value Chain, BCG, Ansoff, BSC, 7S, Blue Ocean, Core Competencies
 */

import { Analysis } from '../types';

export const mockAnalyses: Analysis[] = [
  {
    id: 'ana_001',
    submissionId: 'sub_001',
    enrichmentId: 'enr_001',

    pestel: {
      political: {
        factors: [
          'Política energética nacional favorece transição gradual',
          'Pressão internacional por descarbonização',
          'Influência governamental em decisões estratégicas (empresa estatal)',
        ],
        impact: 'neutro',
        opportunities: ['Incentivos para energia renovável', 'Parcerias público-privadas'],
        threats: ['Interferência política em precificação', 'Mudanças regulatórias abruptas'],
      },
      economic: {
        factors: [
          'Volatilidade do preço do petróleo',
          'Taxa de câmbio favorável para exportações',
          'Crescimento moderado da economia brasileira',
        ],
        impact: 'positivo',
        opportunities: ['Exportação de petróleo', 'Investimento em infraestrutura energética'],
        threats: ['Recessão global', 'Queda prolongada no preço do barril'],
      },
      social: {
        factors: [
          'Crescente consciência ambiental da população',
          'Demanda por transparência e responsabilidade social',
          'Envelhecimento da força de trabalho especializada',
        ],
        impact: 'negativo',
        opportunities: ['Liderar em sustentabilidade', 'Programas de desenvolvimento social'],
        threats: ['Rejeição social a combustíveis fósseis', 'Ativismo ambiental'],
      },
      technological: {
        factors: [
          'Avanços em exploração offshore',
          'Tecnologias de captura de carbono',
          'Digitalização e IoT na indústria',
        ],
        impact: 'positivo',
        opportunities: ['Liderança tecnológica em pré-sal', 'Automação e eficiência'],
        threats: ['Disrupção por energias renováveis', 'Obsolescência de ativos'],
      },
      environmental: {
        factors: [
          'Compromissos climáticos do Acordo de Paris',
          'Regulação ambiental mais rigorosa',
          'Risco de desastres ambientais',
        ],
        impact: 'negativo',
        opportunities: ['Investimento em energias limpas', 'Carbon credits'],
        threats: ['Multas ambientais', 'Danos à reputação', 'Stranded assets'],
      },
      legal: {
        factors: [
          'Marco regulatório do pré-sal',
          'Legislação trabalhista complexa',
          'Compliance pós-Lava Jato',
        ],
        impact: 'neutro',
        opportunities: ['Leilões de novas áreas de exploração'],
        threats: ['Litígios ambientais', 'Investigações regulatórias'],
      },
    },

    porterFiveForces: {
      threatOfNewEntrants: {
        level: 'baixa',
        factors: [
          'Alto investimento de capital necessário',
          'Tecnologia complexa de pré-sal',
          'Regulação rigorosa',
          'Economias de escala significativas',
        ],
        analysis: 'Barreiras de entrada extremamente altas protegem a posição da Petrobras',
      },
      bargainingPowerOfSuppliers: {
        level: 'média',
        factors: [
          'Poucos fornecedores de equipamentos especializados',
          'Dependência de tecnologia importada',
          'Contratos de longo prazo',
        ],
        analysis: 'Poder moderado devido à especialização, mas mitigado por escala da Petrobras',
      },
      bargainingPowerOfBuyers: {
        level: 'média',
        factors: [
          'Commodity com preço definido pelo mercado',
          'Grandes clientes corporativos',
          'Produto relativamente padronizado',
        ],
        analysis: 'Poder moderado, limitado pela natureza commodity do produto',
      },
      threatOfSubstitutes: {
        level: 'alta',
        factors: [
          'Energias renováveis em crescimento',
          'Veículos elétricos',
          'Hidrogênio verde',
          'Biocombustíveis',
        ],
        analysis: 'Ameaça crescente de substituição por fontes de energia limpa',
      },
      competitiveRivalry: {
        level: 'média',
        factors: [
          'Domínio da Petrobras no mercado nacional',
          'Competição com majors internacionais em leilões',
          'Guerra por participação de mercado em refino',
        ],
        analysis: 'Rivalidade moderada no Brasil, intensa em mercados internacionais',
      },
      overallIndustryAttractiveness: 'média',
    },

    swot: {
      strengths: [
        {
          item: 'Liderança tecnológica em exploração de pré-sal',
          impact: 'alto',
          description: 'Tecnologia proprietária que permite exploração econômica de reservas em águas ultraprofundas',
        },
        {
          item: 'Infraestrutura integrada de produção e refino',
          impact: 'alto',
          description: 'Cadeia de valor verticalmente integrada garante eficiência e margens',
        },
        {
          item: 'Marca forte e reconhecida nacionalmente',
          impact: 'médio',
          description: 'Reputação como empresa nacional estratégica',
        },
        {
          item: 'Geração de caixa robusta',
          impact: 'alto',
          description: 'Fluxo de caixa consistente permite investimentos e redução de dívida',
        },
      ],
      weaknesses: [
        {
          item: 'Dependência de combustíveis fósseis',
          impact: 'alto',
          description: '90%+ da receita vem de petróleo e gás, vulnerável à transição energética',
        },
        {
          item: 'Burocracia e lentidão decisória',
          impact: 'médio',
          description: 'Estrutura estatal limita agilidade comparada a competidores privados',
        },
        {
          item: 'Passivo ambiental e reputacional',
          impact: 'médio',
          description: 'Histórico de acidentes e percepção negativa em sustentabilidade',
        },
        {
          item: 'Atraso em energias renováveis',
          impact: 'alto',
          description: 'Menor experiência e portfólio em renováveis comparado a competidores globais',
        },
      ],
      opportunities: [
        {
          item: 'Expansão em energias renováveis',
          potential: 'alto',
          description: 'Mercado de energia solar, eólica e hidrogênio verde em crescimento acelerado',
        },
        {
          item: 'Exportação de petróleo do pré-sal',
          potential: 'alto',
          description: 'Demanda global por petróleo de qualidade superior',
        },
        {
          item: 'Captura e armazenamento de carbono',
          potential: 'médio',
          description: 'Tecnologia emergente para descarbonização',
        },
        {
          item: 'Biocombustíveis avançados',
          potential: 'médio',
          description: 'Crescimento do mercado de SAF (combustível de aviação sustentável)',
        },
      ],
      threats: [
        {
          item: 'Transição energética acelerada',
          severity: 'alta',
          description: 'Redução mais rápida que o esperado na demanda por combustíveis fósseis',
        },
        {
          item: 'Regulação ambiental mais rigorosa',
          severity: 'alta',
          description: 'Custos crescentes de compliance e restrições operacionais',
        },
        {
          item: 'Volatilidade nos preços de commodities',
          severity: 'média',
          description: 'Oscilações no preço do barril impactam rentabilidade',
        },
        {
          item: 'Competição com majors internacionais',
          severity: 'média',
          description: 'Empresas globais com maior capital e experiência em renováveis',
        },
      ],
      strategicImplications: 'A Petrobras deve acelerar sua transição energética enquanto maximiza o valor de seus ativos em petróleo e gás. A diversificação para renováveis é crítica para sustentabilidade de longo prazo.',
    },

    vrio: {
      resources: [
        {
          resource: 'Tecnologia de exploração em pré-sal',
          valuable: true,
          rare: true,
          inimitable: true,
          organized: true,
          competitiveImplication: 'vantagem_sustentável',
          analysis: 'Capacidade única desenvolvida ao longo de décadas, difícil de replicar',
        },
        {
          resource: 'Reservas provadas de petróleo',
          valuable: true,
          rare: true,
          inimitable: false,
          organized: true,
          competitiveImplication: 'vantagem_temporária',
          analysis: 'Ativo valioso mas limitado no contexto de transição energética',
        },
        {
          resource: 'Infraestrutura de refino',
          valuable: true,
          rare: false,
          inimitable: false,
          organized: true,
          competitiveImplication: 'paridade',
          analysis: 'Infraestrutura necessária mas não diferenciadora',
        },
        {
          resource: 'Força de trabalho especializada',
          valuable: true,
          rare: true,
          inimitable: false,
          organized: true,
          competitiveImplication: 'vantagem_temporária',
          analysis: 'Expertise valiosa mas pode ser desenvolvida por competidores',
        },
      ],
    },

    valueChain: {
      primaryActivities: {
        inboundLogistics: {
          activities: ['Exploração e mapeamento de reservas', 'Perfuração de poços'],
          valueCreation: 'alta',
          improvements: ['Automação de perfuração', 'IA para mapeamento geológico'],
        },
        operations: {
          activities: ['Extração de petróleo', 'Processamento inicial', 'Refino'],
          valueCreation: 'alta',
          improvements: ['Otimização de processos', 'Manutenção preditiva'],
        },
        outboundLogistics: {
          activities: ['Armazenamento', 'Transporte por dutos e navios', 'Distribuição'],
          valueCreation: 'média',
          improvements: ['Logística inteligente', 'Redução de tempos de espera'],
        },
        marketingAndSales: {
          activities: ['Contratos de longo prazo', 'Trading de commodities'],
          valueCreation: 'média',
          improvements: ['Diversificação de clientes', 'Hedging mais sofisticado'],
        },
        service: {
          activities: ['Suporte técnico a clientes', 'Gestão de contratos'],
          valueCreation: 'baixa',
          improvements: ['Serviços de valor agregado', 'Consultoria energética'],
        },
      },
      supportActivities: {
        firmInfrastructure: {
          activities: ['Governança corporativa', 'Gestão financeira', 'Relações institucionais'],
          valueCreation: 'média',
          improvements: ['Desburocratização', 'Agilidade decisória'],
        },
        hrManagement: {
          activities: ['Recrutamento especializado', 'Treinamento técnico', 'Segurança do trabalho'],
          valueCreation: 'alta',
          improvements: ['Atração de novos talentos', 'Retenção de expertise'],
        },
        technologyDevelopment: {
          activities: ['P&D em CENPES', 'Inovação em exploração', 'Digitalização'],
          valueCreation: 'alta',
          improvements: ['Parcerias com startups', 'Inovação aberta'],
        },
        procurement: {
          activities: ['Compra de equipamentos', 'Contratos de serviços', 'Gestão de fornecedores'],
          valueCreation: 'média',
          improvements: ['Nacionalização de fornecedores', 'Negociação global'],
        },
      },
    },

    bcgMatrix: {
      businessUnits: [
        {
          name: 'Exploração e Produção (Pré-sal)',
          category: 'estrela',
          marketGrowthRate: 15,
          relativeMarketShare: 2.5,
          strategicRecommendation: 'Investir agressivamente para manter liderança',
        },
        {
          name: 'Refino e Distribuição',
          category: 'vaca_leiteira',
          marketGrowthRate: 2,
          relativeMarketShare: 3.0,
          strategicRecommendation: 'Otimizar operações e maximizar caixa',
        },
        {
          name: 'Gás Natural',
          category: 'ponto_interrogacao',
          marketGrowthRate: 12,
          relativeMarketShare: 0.8,
          strategicRecommendation: 'Avaliar investimentos seletivos',
        },
        {
          name: 'Energia Renovável',
          category: 'ponto_interrogacao',
          marketGrowthRate: 25,
          relativeMarketShare: 0.3,
          strategicRecommendation: 'Investir para construir posição competitiva',
        },
      ],
    },

    ansoffMatrix: {
      marketPenetration: {
        feasibility: 'alta',
        strategies: [
          'Aumentar participação em refino e distribuição',
          'Competir agressivamente em leilões de exploração',
          'Melhorar eficiência operacional',
        ],
        risks: ['Saturação de mercado', 'Margens comprimidas'],
      },
      marketDevelopment: {
        feasibility: 'média',
        strategies: [
          'Exportar petróleo do pré-sal para novos mercados',
          'Expandir presença internacional em países estratégicos',
        ],
        risks: ['Competição internacional intensa', 'Complexidade geopolítica'],
      },
      productDevelopment: {
        feasibility: 'alta',
        strategies: [
          'Desenvolver biocombustíveis avançados',
          'Investir em hidrogênio verde',
          'Criar produtos de maior valor agregado no refino',
        ],
        risks: ['Investimento alto em P&D', 'Incerteza tecnológica'],
      },
      diversification: {
        feasibility: 'média',
        strategies: [
          'Entrar em energia solar e eólica',
          'Desenvolver soluções de armazenamento de energia',
          'Investir em captura de carbono',
        ],
        risks: ['Falta de expertise', 'Competição com players estabelecidos'],
      },
      recommendedStrategy: 'Combinação de penetração de mercado (curto prazo) com desenvolvimento de produtos e diversificação (médio/longo prazo) para gestão de transição energética',
    },

    balancedScorecard: {
      financial: {
        objectives: ['Maximizar geração de caixa', 'Reduzir endividamento', 'Melhorar ROIC'],
        measures: ['EBITDA', 'Relação dívida/EBITDA', 'ROIC'],
        targets: ['R$ 180 bi/ano', '< 1.5x', '> 12%'],
        initiatives: ['Otimização de portfólio', 'Eficiência operacional', 'Gestão de capital'],
      },
      customer: {
        objectives: ['Garantir fornecimento confiável', 'Melhorar percepção de sustentabilidade'],
        measures: ['Índice de satisfação', 'NPS', 'Share of wallet'],
        targets: ['> 85%', '> 50', '> 60%'],
        initiatives: ['Qualidade de produto', 'Comunicação ESG', 'Relacionamento'],
      },
      internalProcesses: {
        objectives: ['Excelência operacional', 'Segurança', 'Descarbonização'],
        measures: ['Uptime', 'Taxa de acidentes', 'Emissões CO2'],
        targets: ['> 95%', '< 0.5/milhão horas', '-25% até 2030'],
        initiatives: ['Manutenção preditiva', 'Cultura de segurança', 'Captura de carbono'],
      },
      learningAndGrowth: {
        objectives: ['Desenvolver competências em renováveis', 'Digitalização', 'Inovação'],
        measures: ['% funcionários treinados', 'Maturidade digital', 'Investimento P&D'],
        targets: ['80%', 'Nível 4', '2% receita'],
        initiatives: ['Academia Petrobras', 'Transformação digital', 'Parcerias inovação'],
      },
    },

    mckinsey7S: {
      strategy: {
        description: 'Transição energética gradual com maximização de valor de ativos tradicionais',
        alignment: 'médio',
        gaps: ['Velocidade de transição insuficiente', 'Ambiguidade em prioridades'],
      },
      structure: {
        description: 'Estrutura matricial com unidades de negócio e áreas corporativas',
        alignment: 'médio',
        gaps: ['Silos entre unidades', 'Decisões lentas'],
      },
      systems: {
        description: 'Sistemas robustos de gestão, controle e compliance',
        alignment: 'alto',
        gaps: ['Agilidade limitada', 'Integração de dados'],
      },
      sharedValues: {
        description: 'Segurança, sustentabilidade, excelência técnica',
        alignment: 'alto',
        gaps: ['Inovação não totalmente internalizada'],
      },
      style: {
        description: 'Liderança hierárquica com movimentos para maior colaboração',
        alignment: 'médio',
        gaps: ['Cultura de comando e controle', 'Pouca autonomia'],
      },
      staff: {
        description: 'Força de trabalho altamente qualificada, mas envelhecida',
        alignment: 'médio',
        gaps: ['Renovação de talentos', 'Novas competências'],
      },
      skills: {
        description: 'Excelência em exploração offshore, gaps em renováveis',
        alignment: 'médio',
        gaps: ['Competências digitais', 'Expertise em energias limpas'],
      },
      overallAlignment: 'médio',
    },

    blueOcean: {
      currentMarketSpace: {
        competingFactors: [
          'Preço competitivo',
          'Confiabilidade de fornecimento',
          'Qualidade de produto',
          'Escala de operações',
        ],
        industryNorms: ['Competição por custo', 'Foco em eficiência operacional'],
      },
      blueOceanOpportunities: [
        {
          factor: 'Soluções de energia integradas',
          action: 'criar',
          rationale: 'Oferecer pacotes completos de energia (fóssil + renovável) para grandes clientes',
          expectedImpact: 'Diferenciação e aumento de valor',
        },
        {
          factor: 'Competição puramente por preço',
          action: 'reduzir',
          rationale: 'Focar em valor agregado e sustentabilidade',
          expectedImpact: 'Margens melhores',
        },
        {
          factor: 'Expertise em captura de carbono',
          action: 'elevar',
          rationale: 'Tornar-se referência em descarbonização',
          expectedImpact: 'Liderança tecnológica',
        },
        {
          factor: 'Commodities puras',
          action: 'eliminar',
          rationale: 'Migrar para produtos especializados de alto valor',
          expectedImpact: 'Diferenciação competitiva',
        },
      ],
      valueInnovation: 'Transição de fornecedor de commodities para parceiro de soluções energéticas sustentáveis',
      strategicMove: 'Criar categoria de "Energia com Responsabilidade" combinando excelência operacional em fósseis com liderança em transição',
    },

    coreCompetencies: {
      competencies: [
        {
          competency: 'Exploração em águas ultraprofundas',
          providesCustomerValue: true,
          difficultToImitate: true,
          broadMarketApplicability: false,
          isCoreCompetency: true,
          analysis: 'Competência única que permite acesso a reservas de alto valor',
          developmentRecommendations: [
            'Continuar investimento em P&D',
            'Proteger propriedade intelectual',
            'Desenvolver parcerias tecnológicas',
          ],
        },
        {
          competency: 'Gestão de refino complexo',
          providesCustomerValue: true,
          difficultToImitate: false,
          broadMarketApplicability: true,
          isCoreCompetency: false,
          analysis: 'Competência importante mas replicável por competidores',
          developmentRecommendations: [
            'Otimizar eficiência',
            'Automatizar processos',
          ],
        },
        {
          competency: 'Integração de cadeia de valor',
          providesCustomerValue: true,
          difficultToImitate: false,
          broadMarketApplicability: true,
          isCoreCompetency: false,
          analysis: 'Vantagem competitiva mas não única',
          developmentRecommendations: [
            'Digitalizar integração',
            'Melhorar sincronização',
          ],
        },
      ],
    },

    strategicRecommendations: [
      'Acelerar investimentos em energias renováveis para 20-30% do CAPEX até 2030',
      'Desenvolver centro de excelência em hidrogênio verde aproveitando expertise em engenharia',
      'Criar divisão de soluções energéticas integradas para grandes clientes corporativos',
      'Implementar programa agressivo de descarbonização de operações',
      'Estabelecer parcerias estratégicas com players de tecnologia para digitalização',
      'Desinvestir em ativos não-core e focar em áreas de vantagem competitiva',
    ],

    priorityActions: [
      {
        action: 'Lançar programa de transição energética com metas claras e timeline',
        priority: 'crítica',
        timeframe: 'curto_prazo',
        expectedImpact: 'Direcionamento estratégico claro e mobilização organizacional',
      },
      {
        action: 'Investir em projeto piloto de hidrogênio verde no Nordeste',
        priority: 'alta',
        timeframe: 'médio_prazo',
        expectedImpact: 'Aprendizado e posicionamento em tecnologia emergente',
      },
      {
        action: 'Criar venture capital para investir em startups de energia limpa',
        priority: 'média',
        timeframe: 'curto_prazo',
        expectedImpact: 'Acesso a inovação e novas tecnologias',
      },
      {
        action: 'Implementar programa de requalificação de força de trabalho',
        priority: 'alta',
        timeframe: 'médio_prazo',
        expectedImpact: 'Desenvolvimento de competências necessárias para transição',
      },
    ],

    analysisQualityScore: 94,
    confidenceLevel: 'alta',
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-02-20T16:30:00Z',
  },
  {
    id: 'ana_002',
    submissionId: 'sub_002',
    enrichmentId: 'enr_002',

    pestel: {
      political: {
        factors: [
          'Estabilidade política favorável para negócios',
          'Incentivos governamentais para bioeconomia',
          'Regulação de ingredientes naturais',
        ],
        impact: 'positivo',
        opportunities: ['Programa de bioeconomia', 'Incentivos fiscais'],
        threats: ['Mudanças regulatórias', 'Instabilidade política'],
      },
      economic: {
        factors: [
          'Crescimento da classe média',
          'Valorização de produtos premium',
          'Taxa de juros impactando consumo',
        ],
        impact: 'neutro',
        opportunities: ['Expansão para novos mercados', 'Premiumização'],
        threats: ['Recessão econômica', 'Inflação'],
      },
      social: {
        factors: [
          'Consciência crescente sobre sustentabilidade',
          'Valorização de beleza natural e diversidade',
          'Empoderamento feminino',
        ],
        impact: 'positivo',
        opportunities: ['Produtos sustentáveis', 'Movimento de inclusão'],
        threats: ['Mudança rápida de preferências'],
      },
      technological: {
        factors: [
          'E-commerce e social commerce',
          'Biotecnologia em cosméticos',
          'Personalização por IA',
        ],
        impact: 'positivo',
        opportunities: ['Vendas digitais', 'Produtos personalizados'],
        threats: ['Disrupção digital', 'Competição tech-first'],
      },
      environmental: {
        factors: [
          'Demanda por produtos limpos e naturais',
          'Pressão por embalagens sustentáveis',
          'Preservação da Amazônia',
        ],
        impact: 'positivo',
        opportunities: ['Liderança em sustentabilidade', 'Certificações verdes'],
        threats: ['Custo de sustentabilidade', 'Greenwashing backlash'],
      },
      legal: {
        factors: [
          'Regulação ANVISA rigorosa',
          'Proibição de testes em animais',
          'Rastreabilidade de ingredientes',
        ],
        impact: 'neutro',
        opportunities: ['Diferenciação por compliance'],
        threats: ['Custos regulatórios', 'Complexidade operacional'],
      },
    },

    porterFiveForces: {
      threatOfNewEntrants: {
        level: 'média',
        factors: [
          'Investimento moderado necessário',
          'Acesso facilitado a canais digitais',
          'Marca e reputação como barreira',
        ],
        analysis: 'Barreiras moderadas, especialmente em nichos digitais',
      },
      bargainingPowerOfSuppliers: {
        level: 'baixa',
        factors: [
          'Múltiplos fornecedores de matéria-prima',
          'Integração com comunidades fornecedoras',
          'Desenvolvimento próprio de bioingredientes',
        ],
        analysis: 'Poder baixo devido à diversificação e integração',
      },
      bargainingPowerOfBuyers: {
        level: 'média',
        factors: [
          'Consultoras como intermediárias',
          'Consumidores com múltiplas opções',
          'Baixo custo de mudança para clientes',
        ],
        analysis: 'Poder moderado, mitigado por fidelidade à marca',
      },
      threatOfSubstitutes: {
        level: 'alta',
        factors: [
          'Marcas internacionais premium',
          'Produtos de beleza coreanos (K-beauty)',
          'Cosméticos clean de nicho',
        ],
        analysis: 'Alta disponibilidade de alternativas',
      },
      competitiveRivalry: {
        level: 'alta',
        factors: [
          'Competição com O Boticário e Avon',
          'Entrada de marcas internacionais',
          'Guerra por consultoras',
        ],
        analysis: 'Rivalidade intensa em todos segmentos',
      },
      overallIndustryAttractiveness: 'média',
    },

    swot: {
      strengths: [
        {
          item: 'Marca forte com propósito autêntico',
          impact: 'alto',
          description: 'Conexão emocional com sustentabilidade e valores',
        },
        {
          item: 'Ingredientes amazônicos exclusivos',
          impact: 'alto',
          description: 'Diferenciação única com bioativos brasileiros',
        },
        {
          item: 'Rede de consultoras engajadas',
          impact: 'médio',
          description: 'Canal de vendas com relacionamento próximo',
        },
      ],
      weaknesses: [
        {
          item: 'Preço premium limita alcance',
          impact: 'médio',
          description: 'Posicionamento alto restringe mercado potencial',
        },
        {
          item: 'Dependência de venda direta',
          impact: 'alto',
          description: 'Modelo tradicional em era digital',
        },
      ],
      opportunities: [
        {
          item: 'Expansão internacional',
          potential: 'alto',
          description: 'Crescimento na América Latina e novos mercados',
        },
        {
          item: 'Digital transformation',
          potential: 'alto',
          description: 'Omnichannel e social commerce',
        },
      ],
      threats: [
        {
          item: 'Competição digital-first',
          severity: 'alta',
          description: 'Marcas nativas digitais com menor custo',
        },
        {
          item: 'Endividamento do grupo',
          severity: 'média',
          description: 'Pressão financeira limita investimentos',
        },
      ],
      strategicImplications: 'Natura deve digitalizar rapidamente mantendo autenticidade da marca e modelo consultivo',
    },

    vrio: {
      resources: [
        {
          resource: 'Relacionamento com comunidades amazônicas',
          valuable: true,
          rare: true,
          inimitable: true,
          organized: true,
          competitiveImplication: 'vantagem_sustentável',
          analysis: 'Ativo único construído ao longo de décadas',
        },
        {
          resource: 'Rede de consultoras',
          valuable: true,
          rare: true,
          inimitable: false,
          organized: true,
          competitiveImplication: 'vantagem_temporária',
          analysis: 'Canal valioso mas replicável',
        },
      ],
    },

    valueChain: {
      primaryActivities: {
        inboundLogistics: {
          activities: ['Sourcing de bioingredientes', 'Relacionamento com comunidades'],
          valueCreation: 'alta',
          improvements: ['Rastreabilidade blockchain', 'Fair trade certificado'],
        },
        operations: {
          activities: ['Formulação de produtos', 'Produção sustentável'],
          valueCreation: 'alta',
          improvements: ['Biotecnologia', 'Automação verde'],
        },
        outboundLogistics: {
          activities: ['Distribuição para consultoras', 'E-commerce fulfillment'],
          valueCreation: 'média',
          improvements: ['Logística verde', 'Centros de distribuição regionais'],
        },
        marketingAndSales: {
          activities: ['Venda consultiva', 'Marketing digital', 'Gestão de marca'],
          valueCreation: 'alta',
          improvements: ['Social commerce', 'Influencer marketing'],
        },
        service: {
          activities: ['Suporte a consultoras', 'Atendimento ao cliente'],
          valueCreation: 'média',
          improvements: ['App de consultoras', 'Chatbot AI'],
        },
      },
      supportActivities: {
        firmInfrastructure: {
          activities: ['Governança ESG', 'Gestão financeira'],
          valueCreation: 'média',
          improvements: ['Transparência radical', 'Reporting integrado'],
        },
        hrManagement: {
          activities: ['Desenvolvimento de consultoras', 'Cultura organizacional'],
          valueCreation: 'alta',
          improvements: ['Academia digital', 'Programas de diversidade'],
        },
        technologyDevelopment: {
          activities: ['P&D de bioativos', 'Inovação sustentável'],
          valueCreation: 'alta',
          improvements: ['Parcerias universitárias', 'Open innovation'],
        },
        procurement: {
          activities: ['Compra sustentável', 'Gestão de fornecedores'],
          valueCreation: 'alta',
          improvements: ['Blockchain para rastreio', 'Fair trade expansion'],
        },
      },
    },

    bcgMatrix: {
      businessUnits: [
        {
          name: 'Natura Brasil (venda direta)',
          category: 'vaca_leiteira',
          marketGrowthRate: 3,
          relativeMarketShare: 2.8,
          strategicRecommendation: 'Otimizar e extrair caixa para investir em digital',
        },
        {
          name: 'E-commerce Natura',
          category: 'estrela',
          marketGrowthRate: 25,
          relativeMarketShare: 1.5,
          strategicRecommendation: 'Investir agressivamente',
        },
        {
          name: 'Expansão internacional',
          category: 'ponto_interrogacao',
          marketGrowthRate: 15,
          relativeMarketShare: 0.5,
          strategicRecommendation: 'Investimentos seletivos em mercados-chave',
        },
      ],
    },

    ansoffMatrix: {
      marketPenetration: {
        feasibility: 'alta',
        strategies: [
          'Aumentar frequência de compra de clientes atuais',
          'Programas de fidelidade para consultoras',
        ],
        risks: ['Saturação', 'Canibalização'],
      },
      marketDevelopment: {
        feasibility: 'alta',
        strategies: [
          'Expansão geográfica na América Latina',
          'Novos canais (lojas próprias, marketplace)',
        ],
        risks: ['Adaptação cultural', 'Competição local'],
      },
      productDevelopment: {
        feasibility: 'alta',
        strategies: [
          'Linhas premium de biotech',
          'Produtos masculinos',
          'Clean beauty extremo',
        ],
        risks: ['Diluição de marca', 'Investimento alto'],
      },
      diversification: {
        feasibility: 'média',
        strategies: [
          'Wellness e suplementos',
          'Serviços de beleza',
        ],
        risks: ['Falta de expertise', 'Dispersão de recursos'],
      },
      recommendedStrategy: 'Desenvolvimento de mercado (internacional) combinado com desenvolvimento de produtos (inovação)',
    },

    balancedScorecard: {
      financial: {
        objectives: ['Crescimento lucrativo', 'Margem saudável'],
        measures: ['Receita', 'EBITDA margin'],
        targets: ['+10% a.a.', '18%'],
        initiatives: ['Premiumização', 'Eficiência operacional'],
      },
      customer: {
        objectives: ['Aumentar base de clientes', 'Fidelizar consultoras'],
        measures: ['Novos clientes', 'Retenção de consultoras'],
        targets: ['+15%', '>85%'],
        initiatives: ['Marketing digital', 'Programa de incentivos'],
      },
      internalProcesses: {
        objectives: ['Inovação em produtos', 'Sustentabilidade radical'],
        measures: ['% receita de novos produtos', 'Carbon footprint'],
        targets: ['>30%', '-50% até 2030'],
        initiatives: ['P&D biotech', 'Embalagens 100% recicláveis'],
      },
      learningAndGrowth: {
        objectives: ['Capacitação digital', 'Cultura de inovação'],
        measures: ['Consultoras digitais', 'Ideias implementadas'],
        targets: ['>70%', '>100/ano'],
        initiatives: ['Academia Natura Digital', 'Hackathons'],
      },
    },

    mckinsey7S: {
      strategy: {
        description: 'Sustentabilidade como diferenciação + digitalização do modelo',
        alignment: 'alto',
        gaps: ['Velocidade de execução'],
      },
      structure: {
        description: 'Matriz com unidades de negócio e marcas',
        alignment: 'médio',
        gaps: ['Integração entre marcas do grupo'],
      },
      systems: {
        description: 'Sistemas robustos de gestão e compliance',
        alignment: 'alto',
        gaps: ['Agilidade de processos'],
      },
      sharedValues: {
        description: 'Sustentabilidade, bem-estar, relações',
        alignment: 'alto',
        gaps: ['Internalização em todas áreas'],
      },
      style: {
        description: 'Liderança colaborativa e inclusiva',
        alignment: 'alto',
        gaps: ['Velocidade de decisão'],
      },
      staff: {
        description: 'Talento engajado com propósito',
        alignment: 'alto',
        gaps: ['Competências digitais'],
      },
      skills: {
        description: 'Expertise em sustentabilidade e bioativos',
        alignment: 'alto',
        gaps: ['Tecnologia e dados'],
      },
      overallAlignment: 'alto',
    },

    blueOcean: {
      currentMarketSpace: {
        competingFactors: ['Preço', 'Qualidade', 'Marca', 'Disponibilidade'],
        industryNorms: ['Competição por preço', 'Launches frequentes'],
      },
      blueOceanOpportunities: [
        {
          factor: 'Programa de impacto social integrado',
          action: 'criar',
          rationale: 'Consumidor participa ativamente de impacto social',
          expectedImpact: 'Diferenciação radical e fidelização',
        },
        {
          factor: 'Promoções e descontos',
          action: 'reduzir',
          rationale: 'Focar em valor percebido, não preço',
          expectedImpact: 'Margens melhores',
        },
        {
          factor: 'Transparência radical de cadeia',
          action: 'elevar',
          rationale: 'Rastreabilidade completa via blockchain',
          expectedImpact: 'Confiança e autenticidade',
        },
      ],
      valueInnovation: 'Beleza com propósito mensurável',
      strategicMove: 'Criar categoria de "Beauty with Impact" onde cliente vê impacto real de cada compra',
    },

    coreCompetencies: {
      competencies: [
        {
          competency: 'Desenvolvimento de bioingredientes amazônicos',
          providesCustomerValue: true,
          difficultToImitate: true,
          broadMarketApplicability: true,
          isCoreCompetency: true,
          analysis: 'Competência única de alto valor',
          developmentRecommendations: [
            'Expandir portfólio de bioativos',
            'Patentear inovações',
          ],
        },
      ],
    },

    strategicRecommendations: [
      'Acelerar transformação digital com foco em omnichannel',
      'Expandir presença internacional na América Latina',
      'Investir em biotecnologia para produtos ultra-premium',
      'Criar programa de impacto social rastreável',
      'Desenvolver marketplace próprio de beleza sustentável',
    ],

    priorityActions: [
      {
        action: 'Lançar super-app Natura integrando e-commerce, consultoria e impacto social',
        priority: 'crítica',
        timeframe: 'curto_prazo',
        expectedImpact: 'Digitalização do modelo e retenção de consultoras',
      },
      {
        action: 'Criar linha biotech premium com tecnologia proprietária',
        priority: 'alta',
        timeframe: 'médio_prazo',
        expectedImpact: 'Diferenciação e margens superiores',
      },
    ],

    analysisQualityScore: 91,
    confidenceLevel: 'alta',
    createdAt: '2024-02-18T10:00:00Z',
    updatedAt: '2024-03-05T14:00:00Z',
  },
];

export const getAnalysisById = (id: string): Analysis | undefined => {
  return mockAnalyses.find(ana => ana.id === id);
};

export const getAnalysisBySubmissionId = (submissionId: string): Analysis | undefined => {
  return mockAnalyses.find(ana => ana.submissionId === submissionId);
};
