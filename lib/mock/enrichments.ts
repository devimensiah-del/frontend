/**
 * Mock Enrichment Data
 * Detailed enrichment data for each submission
 */

import { Enrichment } from '../types';

export const mockEnrichments: Enrichment[] = [
  {
    id: 'enr_001',
    submissionId: 'sub_001',
    strategicProfile: {
      mission: 'Operar de forma segura e rentável na indústria de óleo, gás e energia, com responsabilidade social e ambiental',
      vision: 'Ser uma empresa integrada de energia, reconhecida por sua excelência e compromisso com a sustentabilidade',
      coreValues: ['Segurança', 'Respeito à vida', 'Sustentabilidade', 'Integridade', 'Excelência operacional'],
      keyCompetencies: [
        'Exploração em águas profundas',
        'Refino de alta complexidade',
        'Gestão de grandes projetos',
        'Tecnologia de exploração offshore',
      ],
      strategicPriorities: [
        'Transição energética',
        'Descarbonização',
        'Eficiência operacional',
        'Inovação tecnológica',
        'Diversificação de portfólio',
      ],
      organizationalCulture: 'Cultura de engenharia forte, hierárquica, em processo de transformação para maior agilidade e inovação',
    },
    companyOverview: {
      legalName: 'Petróleo Brasileiro S.A.',
      tradeName: 'Petrobras',
      cnpj: '33.000.167/0001-01',
      foundedYear: 1953,
      headquarters: 'Rio de Janeiro, RJ',
      numberOfEmployees: 45000,
      annualRevenue: 'R$ 425 bilhões (2023)',
      mainProducts: ['Petróleo', 'Gás natural', 'Derivados de petróleo', 'Biocombustíveis'],
      mainServices: ['Exploração', 'Produção', 'Refino', 'Distribuição'],
      targetMarkets: ['Brasil', 'América do Sul', 'Mercado internacional'],
      geographicPresence: ['Todas regiões do Brasil', 'Bolívia', 'Argentina', 'Uruguai'],
      corporateStructure: 'Sociedade de economia mista de capital aberto',
      keyExecutives: [
        { name: 'Jean Paul Prates', position: 'Presidente', background: 'Senador, especialista em energia' },
        { name: 'Sergio Caetano Leite', position: 'Diretor Financeiro', background: 'Executivo com experiência em mercado de capitais' },
      ],
    },
    marketIntelligence: {
      industryOverview: 'Setor de energia global em transformação, com pressão crescente por descarbonização e transição para fontes renováveis',
      marketSize: 'R$ 2,5 trilhões (mercado brasileiro de energia)',
      growthRate: '2-3% ao ano (energia tradicional), 15-20% (renováveis)',
      keyTrends: [
        'Transição energética global',
        'ESG e sustentabilidade',
        'Digitalização e automação',
        'Descarbonização',
        'Hidrogênio verde',
        'Captura de carbono',
      ],
      regulatoryEnvironment: [
        'ANP - Agência Nacional de Petróleo',
        'Políticas de conteúdo local',
        'Compromissos climáticos internacionais',
        'Lei de Mudanças Climáticas',
      ],
      technologyDisruptions: [
        'Energias renováveis',
        'Veículos elétricos',
        'Armazenamento de energia',
        'Hidrogênio verde',
        'Biocombustíveis avançados',
      ],
    },
    competitiveLandscape: {
      mainCompetitors: [
        {
          name: 'Shell Brasil',
          marketShare: '8%',
          strengths: ['Tecnologia global', 'Capital financeiro', 'Experiência em renováveis'],
          weaknesses: ['Menor conhecimento local', 'Custos operacionais mais altos'],
        },
        {
          name: 'Equinor',
          marketShare: '5%',
          strengths: ['Expertise em offshore', 'Sustentabilidade', 'Inovação'],
          weaknesses: ['Presença menor no Brasil', 'Escala limitada'],
        },
        {
          name: 'TotalEnergies',
          marketShare: '4%',
          strengths: ['Portfólio diversificado', 'Investimento em renováveis'],
          weaknesses: ['Entrada recente no mercado', 'Menor rede de distribuição'],
        },
      ],
      competitiveAdvantages: [
        'Domínio da tecnologia de pré-sal',
        'Infraestrutura estabelecida',
        'Conhecimento profundo do mercado local',
        'Escala de operações',
        'Marca forte',
      ],
      competitiveDisadvantages: [
        'Burocracia estatal',
        'Agilidade limitada',
        'Dependência de commodities',
        'Menor experiência em renováveis que competidores internacionais',
      ],
      marketPosition: 'Líder absoluto no Brasil com 90%+ da produção nacional de petróleo',
      differentiationFactors: [
        'Tecnologia proprietária de pré-sal',
        'Integração vertical completa',
        'Presença nacional abrangente',
      ],
    },
    financialMetrics: {
      revenue: 'R$ 425 bilhões',
      revenueGrowth: '12% a.a.',
      profitMargin: '25%',
      ebitda: 'R$ 180 bilhões',
      debtLevel: 'R$ 250 bilhões (em redução)',
      liquidityPosition: 'Forte - caixa de R$ 80 bilhões',
      investmentCapacity: 'US$ 10-12 bilhões/ano',
      financialHealth: 'Sólida, com geração de caixa consistente e redução de endividamento',
    },
    operationalCapabilities: {
      productionCapacity: '2,8 milhões de barris/dia',
      technologyInfrastructure: [
        'Plataformas FPSO de última geração',
        'Sistemas de automação avançados',
        'Centros de pesquisa (CENPES)',
        'Infraestrutura de refino moderna',
      ],
      supplyChainMaturity: 'Alta - cadeia integrada desde exploração até distribuição',
      qualityCertifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'API Q1', 'API Q2'],
      innovationCapabilities: [
        'Centro de pesquisa CENPES',
        'Parcerias com universidades',
        'Programas de inovação aberta',
        'Investimento em startups de energia',
      ],
      digitalMaturity: 'Média-alta, com iniciativas de IoT, IA e digitalização de processos',
    },
    riskAssessment: {
      strategicRisks: [
        {
          risk: 'Transição energética mais rápida que o planejado',
          severity: 'alta',
          mitigation: 'Acelerar investimentos em renováveis e diversificação',
        },
        {
          risk: 'Pressão política sobre preços e investimentos',
          severity: 'alta',
          mitigation: 'Governança robusta e comunicação transparente',
        },
      ],
      operationalRisks: [
        {
          risk: 'Acidentes ambientais',
          severity: 'crítica',
          mitigation: 'Protocolos de segurança rigorosos e sistemas de contingência',
        },
        {
          risk: 'Falhas em equipamentos offshore',
          severity: 'alta',
          mitigation: 'Manutenção preditiva e redundância de sistemas',
        },
      ],
      financialRisks: [
        {
          risk: 'Volatilidade no preço do petróleo',
          severity: 'alta',
          mitigation: 'Hedging e gestão de portfólio',
        },
        {
          risk: 'Exposição cambial',
          severity: 'média',
          mitigation: 'Estratégias de hedge cambial',
        },
      ],
      complianceRisks: [
        {
          risk: 'Mudanças regulatórias ambientais',
          severity: 'alta',
          mitigation: 'Monitoramento regulatório contínuo e adaptação proativa',
        },
        {
          risk: 'Investigações de compliance',
          severity: 'média',
          mitigation: 'Programa de compliance robusto pós-Lava Jato',
        },
      ],
    },
    dataQualityScore: 92,
    sourceReliability: 'alta',
    lastVerified: '2024-02-20T10:00:00Z',
    dataSources: [
      'Relatório Anual Petrobras 2023',
      'CVM - Comissão de Valores Mobiliários',
      'ANP - Agência Nacional de Petróleo',
      'Bloomberg',
      'Valor Econômico',
    ],
    createdAt: '2024-02-12T14:30:00Z',
    updatedAt: '2024-02-20T10:00:00Z',
  },
  {
    id: 'enr_002',
    submissionId: 'sub_002',
    strategicProfile: {
      mission: 'Criar e comercializar produtos e serviços que promovam o bem-estar e a felicidade',
      vision: 'Ser a marca brasileira de maior desejo e relevância global, transformando o setor de beleza com sustentabilidade',
      coreValues: ['Sustentabilidade', 'Inovação', 'Relações transparentes', 'Valorização da diversidade'],
      keyCompetencies: [
        'Ingredientes naturais brasileiros',
        'Venda direta consultiva',
        'Inovação sustentável',
        'Branding emocional',
      ],
      strategicPriorities: [
        'Expansão internacional',
        'Digitalização',
        'Sustentabilidade radical',
        'Inovação em produtos',
        'Empoderamento de consultoras',
      ],
      organizationalCulture: 'Cultura horizontal, colaborativa, com forte propósito social e ambiental',
    },
    companyOverview: {
      legalName: 'Natura Cosméticos S.A.',
      tradeName: 'Natura',
      cnpj: '71.673.990/0001-77',
      foundedYear: 1969,
      headquarters: 'São Paulo, SP',
      numberOfEmployees: 7500,
      annualRevenue: 'R$ 12,5 bilhões (2023)',
      mainProducts: ['Cosméticos', 'Fragrâncias', 'Cuidados pessoais', 'Maquiagem'],
      mainServices: ['Venda direta', 'Consultoria de beleza', 'E-commerce'],
      targetMarkets: ['Brasil', 'América Latina', 'França', 'Mercados emergentes'],
      geographicPresence: ['Brasil', 'Argentina', 'Chile', 'Colômbia', 'México', 'Peru', 'França'],
      corporateStructure: 'Sociedade Anônima, parte do grupo Natura &Co',
      keyExecutives: [
        { name: 'Fabio Barbosa', position: 'CEO Natura &Co', background: 'Ex-presidente do Santander Brasil' },
        { name: 'João Paulo Ferreira', position: 'CEO Natura Brasil', background: 'Executivo de longa data na empresa' },
      ],
    },
    marketIntelligence: {
      industryOverview: 'Mercado de beleza em crescimento com forte tendência de sustentabilidade e clean beauty',
      marketSize: 'R$ 180 bilhões (Brasil), US$ 500 bilhões (global)',
      growthRate: '5-7% ao ano',
      keyTrends: [
        'Clean beauty',
        'Sustentabilidade',
        'Ingredientes naturais',
        'Personalização',
        'Digital-first',
        'Social commerce',
      ],
      regulatoryEnvironment: [
        'ANVISA - Agência Nacional de Vigilância Sanitária',
        'Regulação de cosméticos orgânicos',
        'Testes em animais proibidos',
        'Rastreabilidade de ingredientes',
      ],
      technologyDisruptions: [
        'E-commerce e marketplace',
        'IA para personalização',
        'Biotecnologia',
        'Realidade aumentada para try-on',
      ],
    },
    competitiveLandscape: {
      mainCompetitors: [
        {
          name: 'O Boticário',
          marketShare: '12%',
          strengths: ['Rede de franquias', 'Preço competitivo', 'Presença omnichannel'],
          weaknesses: ['Menor diferenciação em sustentabilidade', 'Posicionamento menos premium'],
        },
        {
          name: "L'Oréal Brasil",
          marketShare: '15%',
          strengths: ['Portfolio amplo', 'Inovação tecnológica', 'Força de marca global'],
          weaknesses: ['Menor conexão emocional local', 'Sustentabilidade menos evidenciada'],
        },
        {
          name: 'Avon',
          marketShare: '8%',
          strengths: ['Venda direta', 'Marca consolidada', 'Preço acessível'],
          weaknesses: ['Marca envelhecida', 'Menor inovação', 'Problemas operacionais'],
        },
      ],
      competitiveAdvantages: [
        'Liderança em sustentabilidade',
        'Ingredientes amazônicos únicos',
        'Conexão emocional forte com consultoras',
        'Propósito de marca autêntico',
      ],
      competitiveDisadvantages: [
        'Preço premium limita alcance',
        'Dependência de venda direta em era digital',
        'Complexidade de gestão de marketplace',
      ],
      marketPosition: 'Líder em venda direta de cosméticos no Brasil, top 3 no mercado total',
      differentiationFactors: [
        'Sustentabilidade radical',
        'Bioingredientes amazônicos',
        'Modelo de negócio com impacto social',
      ],
    },
    financialMetrics: {
      revenue: 'R$ 12,5 bilhões',
      revenueGrowth: '8% a.a.',
      profitMargin: '15%',
      ebitda: 'R$ 2,1 bilhões',
      debtLevel: 'R$ 8 bilhões (controlado)',
      liquidityPosition: 'Adequada',
      investmentCapacity: 'R$ 800 milhões/ano',
      financialHealth: 'Sólida, com geração de caixa recorrente',
    },
    operationalCapabilities: {
      productionCapacity: '1,2 bilhões de unidades/ano',
      technologyInfrastructure: [
        'Fábrica sustentável em Cajamar (SP)',
        'Centro de inovação Natura',
        'Plataforma de e-commerce própria',
        'Sistema de gestão de consultoras',
      ],
      supplyChainMaturity: 'Alta - cadeia rastreável e sustentável',
      qualityCertifications: ['ISO 9001', 'ISO 14001', 'Certificação B Corp', 'Ecocert', 'Rainforest Alliance'],
      innovationCapabilities: [
        'Centro de inovação interno',
        'Parcerias com comunidades amazônicas',
        'Laboratório de biotecnologia',
        'Design thinking',
      ],
      digitalMaturity: 'Média-alta, investindo em omnichannel e social commerce',
    },
    riskAssessment: {
      strategicRisks: [
        {
          risk: 'Digitalização acelerada do varejo de beleza',
          severity: 'alta',
          mitigation: 'Investimento em plataforma digital e capacitação de consultoras',
        },
        {
          risk: 'Dependência de modelo de venda direta',
          severity: 'média',
          mitigation: 'Diversificação de canais (lojas, e-commerce, marketplace)',
        },
      ],
      operationalRisks: [
        {
          risk: 'Ruptura na cadeia de bioingredientes',
          severity: 'média',
          mitigation: 'Diversificação de fornecedores e desenvolvimento de biotech',
        },
        {
          risk: 'Complexidade logística multi-canal',
          severity: 'média',
          mitigation: 'Investimento em centros de distribuição e tecnologia logística',
        },
      ],
      financialRisks: [
        {
          risk: 'Endividamento do grupo Natura &Co',
          severity: 'média',
          mitigation: 'Desinvestimentos seletivos e controle de custos',
        },
        {
          risk: 'Pressão de margens por competição',
          severity: 'média',
          mitigation: 'Premiumização e eficiência operacional',
        },
      ],
      complianceRisks: [
        {
          risk: 'Regulação de ingredientes naturais',
          severity: 'baixa',
          mitigation: 'Compliance robusto e rastreabilidade total',
        },
      ],
    },
    dataQualityScore: 88,
    sourceReliability: 'alta',
    lastVerified: '2024-03-01T10:00:00Z',
    dataSources: [
      'Relatório Anual Natura &Co 2023',
      'B3 - Bolsa de Valores',
      'Euromonitor International',
      'Folha de São Paulo',
    ],
    createdAt: '2024-02-16T09:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'enr_003',
    submissionId: 'sub_003',
    strategicProfile: {
      mission: 'Inovar para servir e encantar todos os brasileiros',
      vision: 'Ser o maior ecossistema de varejo e serviços digitais da América Latina',
      coreValues: ['Cliente no centro', 'Inovação', 'Coragem', 'Diversidade', 'Eficiência'],
      keyCompetencies: [
        'Omnichannel integrado',
        'Marketplace robusto',
        'Logística própria',
        'Plataforma de serviços financeiros',
      ],
      strategicPriorities: [
        'Super-app de serviços',
        'Ecossistema digital',
        'Eficiência logística',
        'Rentabilização de fintech',
        'Expansão de marketplace',
      ],
    },
    companyOverview: {
      legalName: 'Magazine Luiza S.A.',
      tradeName: 'Magazine Luiza (Magalu)',
      cnpj: '47.960.950/0001-21',
      foundedYear: 1957,
      headquarters: 'Franca, SP',
      numberOfEmployees: 45000,
      annualRevenue: 'R$ 42 bilhões (2023)',
      mainProducts: ['Eletrônicos', 'Eletrodomésticos', 'Móveis', 'Moda', 'Beleza'],
      mainServices: ['Marketplace', 'Logística', 'Fintech (MagaluPay)', 'Publicidade digital'],
      targetMarkets: ['Brasil - todas classes sociais'],
      geographicPresence: ['Todo território nacional'],
      corporateStructure: 'Sociedade Anônima de capital aberto',
      keyExecutives: [
        { name: 'Frederico Trajano', position: 'CEO', background: 'Família fundadora, liderou transformação digital' },
        { name: 'Eduardo Galanternick', position: 'CFO', background: 'Executivo com experiência em varejo' },
      ],
    },
    marketIntelligence: {
      industryOverview: 'E-commerce brasileiro crescendo aceleradamente, com consolidação de grandes players',
      marketSize: 'R$ 185 bilhões (e-commerce Brasil 2023)',
      growthRate: '12-15% ao ano',
      keyTrends: [
        'Mobile-first',
        'Omnichannel',
        'Social commerce',
        'Fintech integrado',
        'Quick commerce',
        'Live commerce',
      ],
      regulatoryEnvironment: [
        'Código de Defesa do Consumidor',
        'LGPD - Lei Geral de Proteção de Dados',
        'Regulação de marketplace',
        'Tributação de e-commerce',
      ],
      technologyDisruptions: [
        'Inteligência artificial',
        'Personalização avançada',
        'Pagamentos instantâneos (Pix)',
        'Automação de fulfillment',
      ],
    },
    competitiveLandscape: {
      mainCompetitors: [
        {
          name: 'Mercado Livre',
          marketShare: '28%',
          strengths: ['Marketplace líder', 'Fintech consolidado', 'Logística própria'],
          weaknesses: ['Menos lojas físicas', 'Marca menos brasileira'],
        },
        {
          name: 'Amazon Brasil',
          marketShare: '12%',
          strengths: ['Tecnologia global', 'Prime', 'Capital ilimitado'],
          weaknesses: ['Sortimento limitado', 'Menos conhecimento local'],
        },
        {
          name: 'Casas Bahia (Via)',
          marketShare: '15%',
          strengths: ['Rede de lojas', 'Crédito próprio', 'Marca forte'],
          weaknesses: ['Digitalização mais lenta', 'Problemas financeiros'],
        },
      ],
      competitiveAdvantages: [
        'Integração omnichannel avançada',
        'Cultura de inovação',
        'Agilidade e velocidade',
        'Marca amada',
        'Logística eficiente',
      ],
      competitiveDisadvantages: [
        'Menor marketplace que Mercado Livre',
        'Fintech ainda em maturação',
        'Pressão de margens',
      ],
      marketPosition: 'Top 3 em e-commerce brasileiro, líder em omnichannel',
      differentiationFactors: [
        'Ecossistema integrado',
        'Experiência de compra superior',
        'Inovação constante',
      ],
    },
    financialMetrics: {
      revenue: 'R$ 42 bilhões',
      revenueGrowth: '18% a.a.',
      profitMargin: '3% (em recuperação)',
      ebitda: 'R$ 2,8 bilhões',
      debtLevel: 'R$ 5 bilhões (gerenciável)',
      liquidityPosition: 'Adequada',
      investmentCapacity: 'R$ 1,5 bilhões/ano',
      financialHealth: 'Recuperação após fase de investimentos pesados',
    },
    operationalCapabilities: {
      productionCapacity: 'N/A (varejo)',
      technologyInfrastructura: [
        'Plataforma de e-commerce proprietária',
        'App mobile avançado',
        'Sistema de marketplace',
        'IA para recomendações',
      ],
      supplyChainMaturity: 'Alta - logística própria e inteligente',
      qualityCertifications: ['ISO 9001', 'PCI DSS (segurança de pagamentos)'],
      innovationCapabilities: [
        'Luizalabs (centro de inovação)',
        'Parceria com startups',
        'Cultura ágil',
        'Times multidisciplinares',
      ],
      digitalMaturity: 'Muito alta - empresa digital-first',
    },
    riskAssessment: {
      strategicRiscos: [
        {
          risk: 'Competição intensa com Mercado Livre e Amazon',
          severity: 'alta',
          mitigation: 'Diferenciação por omnichannel e ecossistema',
        },
        {
          risk: 'Rentabilização de marketplace',
          severity: 'média',
          mitigation: 'Otimização de mix e serviços de valor agregado',
        },
      ],
      operationalRisks: [
        {
          risk: 'Complexidade logística',
          severity: 'média',
          mitigation: 'Investimento em centros de distribuição e automação',
        },
        {
          risk: 'Fraudes e segurança',
          severity: 'média',
          mitigation: 'Sistemas de antifraude e segurança da informação',
        },
      ],
      financialRisks: [
        {
          risk: 'Pressão de margens',
          severity: 'alta',
          mitigation: 'Eficiência operacional e monetização de serviços',
        },
        {
          risk: 'Necessidade de capital para crescimento',
          severity: 'média',
          mitigation: 'Gestão de caixa e acesso a mercado de capitais',
        },
      ],
      complianceRisks: [
        {
          risk: 'LGPD e privacidade de dados',
          severity: 'média',
          mitigation: 'Programa de compliance de dados robusto',
        },
      ],
    },
    dataQualityScore: 90,
    sourceReliability: 'alta',
    lastVerified: '2024-03-10T10:00:00Z',
    dataSources: [
      'Relatório Anual Magazine Luiza 2023',
      'B3 - Bolsa de Valores',
      'Ebit/Nielsen',
      'Valor Econômico',
    ],
    createdAt: '2024-03-02T11:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
];

export const getEnrichmentById = (id: string): Enrichment | undefined => {
  return mockEnrichments.find(enr => enr.id === id);
};

export const getEnrichmentBySubmissionId = (submissionId: string): Enrichment | undefined => {
  return mockEnrichments.find(enr => enr.submissionId === submissionId);
};
