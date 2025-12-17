# Editor Translation Guide - Portuguese (pt-BR)

## Quick Reference Translation Table

### Common Button Labels
| English | Portuguese |
|---------|-----------|
| Add | Adicionar |
| Remove | Remover |
| Delete | Excluir |
| Save | Salvar |
| Cancel | Cancelar |
| Edit | Editar |
| Submit | Enviar |
| Generate | Gerar |
| Retry | Tentar Novamente |

### Common Placeholders
| English Pattern | Portuguese Pattern |
|----------------|-------------------|
| Enter {field}... | Digite {field}... |
| {field} name... | Nome do {field}... |
| Add {item}... | Adicionar {item}... |
| Select {option}... | Selecione {option}... |

### Common Empty States
| English | Portuguese |
|---------|-----------|
| No items added yet | Nenhum item adicionado ainda |
| No {items} found | Nenhum {items} encontrado |
| No data available | Nenhum dado disponível |
| Empty list | Lista vazia |

### Framework Names (for labels)
| Code | English | Portuguese |
|------|---------|-----------|
| pestel | PESTEL Analysis | Análise PESTEL |
| porter | Porter's Forces | Forças de Porter |
| swot | SWOT Analysis | Análise SWOT |
| swotcross | SWOT Cross Strategies | Estratégias Cruzadas SWOT |
| tam_sam_som | TAM-SAM-SOM | TAM-SAM-SOM |
| blue_ocean | Blue Ocean Strategy | Estratégia Oceano Azul |
| growth_hacking | Growth Hacking | Growth Hacking |
| scenarios | Strategic Scenarios | Cenários Estratégicos |
| decision_matrix | Decision Matrix | Matriz de Decisão |
| okrs | OKRs | OKRs |
| bsc | Balanced Scorecard | Balanced Scorecard |
| synthesis | Executive Synthesis | Síntese Executiva |
| challenge_refinement | Challenge Refinement | Refinamento do Desafio |
| benchmarking | Benchmarking | Benchmarking |

## Editor-Specific Translations

### SWOT Editor
```typescript
// Quadrants
strengths → Forças
weaknesses → Fraquezas
opportunities → Oportunidades
threats → Ameaças

// Confidence levels
High → Alta
Medium → Média
Low → Baixa

// Labels
Content → Conteúdo
Confidence → Confiança
Source → Fonte
Summary → Resumo
```

### Porter Editor
```typescript
// Force labels
Competitive Rivalry → Rivalidade Competitiva
Threat of New Entrants → Ameaça de Novos Entrantes
Bargaining Power of Suppliers → Poder de Barganha dos Fornecedores
Bargaining Power of Buyers → Poder de Barganha dos Compradores
Threat of Substitutes → Ameaça de Substitutos
Complementors → Complementadores
Government/Regulation → Governo/Regulação

// Intensity levels
Very High → Muito Alta
High → Alta
Medium → Média
Low → Baixa
Very Low → Muito Baixa

// Labels
Force → Força
Intensity → Intensidade
Description → Descrição
Overall Attractiveness → Atratividade Geral
Summary → Resumo
```

### TAM-SAM-SOM Editor
```typescript
TAM (Total Addressable Market) → TAM (Mercado Total Endereçável)
SAM (Serviceable Available Market) → SAM (Mercado Disponível)
SOM (Serviceable Obtainable Market) → SOM (Mercado Obtível)
Assumptions → Premissas
CAGR → CAGR (Taxa de Crescimento Anual Composta)
Confidence Level → Nível de Confiança
Estimation Method → Método de Estimação
Calculation Notes → Notas de Cálculo
Caveat Message → Aviso
Summary → Resumo
```

### Blue Ocean Editor
```typescript
// Four Actions Framework
Eliminate → Eliminar
Reduce → Reduzir
Raise → Elevar
Create → Criar

// Labels
Factors → Fatores
New Value Curve → Nova Curva de Valor
Summary → Resumo
```

### Benchmarking Editor
```typescript
Competitors Analyzed → Concorrentes Analisados
Performance Gaps → Lacunas de Performance
Best Practices → Melhores Práticas
Summary → Resumo
```

### Growth Hacking Editor
```typescript
// Loop types
Viral Loop → Loop Viral
Content Loop → Loop de Conteúdo
Paid Loop → Loop Pago
Sales Loop → Loop de Vendas

// Labels
Loop Name → Nome do Loop
Type → Tipo
Steps → Passos
Metrics → Métricas
Bottleneck → Gargalo
Leap Loop → Loop de Salto
Scale Loop → Loop de Escala
Summary → Resumo
```

### Scenarios Editor
```typescript
// Scenario types
Optimistic → Otimista
Realistic → Realista
Pessimistic → Pessimista

// Labels
Scenario → Cenário
Probability → Probabilidade
Description → Descrição
Required Actions → Ações Necessárias
Mitigation Tactics → Táticas de Mitigação
Early Warning Signals → Sinais de Alerta Precoce
Summary → Resumo
```

### Decision Matrix Editor
```typescript
Alternatives → Alternativas
Criteria → Critérios
Final Recommendation → Recomendação Final
Recommended Option → Opção Recomendada
Score → Pontuação
Score Comparison → Comparação de Pontuação
Priority Recommendations → Recomendações Prioritárias
Review Cycle → Ciclo de Revisão
Monitoring Metrics → Métricas de Monitoramento
Priority → Prioridade
Title → Título
Description → Descrição
Timeline → Cronograma
Budget → Orçamento
Frequency → Frequência
Extraordinary Triggers → Gatilhos Extraordinários
Summary → Resumo
```

### OKRs Editor
```typescript
// Monthly OKRs
Month → Mês
Focus → Foco
Objective → Objetivo
Key Results → Resultados-Chave
Investment → Investimento
Aligned Recommendation → Recomendação Alinhada

// Plan
90-Day Plan → Plano de 90 Dias
Total Investment → Investimento Total
Success Metrics → Métricas de Sucesso
Summary → Resumo
```

### BSC (Balanced Scorecard) Editor
```typescript
// Perspectives
Financial → Financeiro
Customer → Cliente
Internal Processes → Processos Internos
Learning & Growth → Aprendizado e Crescimento

// Labels
Perspective → Perspectiva
Metrics → Métricas
Summary → Resumo
```

### Synthesis Editor
```typescript
Executive Summary → Resumo Executivo
Key Findings → Principais Descobertas
Strategic Priorities → Prioridades Estratégicas
Roadmap → Roteiro
Overall Recommendation → Recomendação Geral
```

### Challenge Refinement Editor
```typescript
Original Challenge → Desafio Original
Refined Challenge → Desafio Refinado
Key Assumptions → Premissas-Chave
Success Criteria → Critérios de Sucesso
Constraints → Restrições
Summary → Resumo
```

### SWOT Cross Editor
```typescript
// Strategy types
SO (Strengths-Opportunities) → FO (Forças-Oportunidades)
WO (Weaknesses-Opportunities) → FrO (Fraquezas-Oportunidades)
ST (Strengths-Threats) → FA (Forças-Ameaças)
WT (Weaknesses-Threats) → FrA (Fraquezas-Ameaças)

// Labels
Strategy → Estratégia
Description → Descrição
Actions → Ações
Summary → Resumo
```

## Translation Pattern for Each Editor

### Step 1: Constants
Replace English constants with Portuguese:
```typescript
// Before
const CATEGORIES = [
  { key: 'political', label: 'Political', color: 'border-l-purple-500' },
]

// After
const CATEGORIES = [
  { key: 'political', label: 'Político', color: 'border-l-purple-500' },
]
```

### Step 2: Button Labels
```typescript
// Before
<Button>Add</Button>

// After
<Button>Adicionar</Button>
```

### Step 3: Placeholders
```typescript
// Before
placeholder="Enter factor..."

// After
placeholder="Digite o fator..."
```

### Step 4: Empty States
```typescript
// Before
<p>No items added yet</p>

// After
<p>Nenhum item adicionado ainda</p>
```

### Step 5: Section Headers
```typescript
// Before
<label>Summary</label>

// After
<label>Resumo</label>
```

### Step 6: Select/Dropdown Options
```typescript
// Before
<SelectItem value="high">High</SelectItem>

// After
<SelectItem value="high">Alta</SelectItem>
```

## Testing Checklist for Each Editor

After translating each editor, verify:
- [ ] All button labels are in Portuguese
- [ ] All placeholders are in Portuguese
- [ ] All section headers are in Portuguese
- [ ] All empty state messages are in Portuguese
- [ ] All dropdown/select options are in Portuguese
- [ ] No English text remains visible to users
- [ ] Editor still functions correctly
- [ ] Data structure unchanged (only UI labels changed)

## Priority Order for Translation

1. ✅ PESTEL (completed)
2. SWOT (high usage)
3. Porter (high usage)
4. TAM-SAM-SOM (high usage)
5. Blue Ocean
6. Scenarios
7. Decision Matrix
8. OKRs
9. BSC
10. Growth Hacking
11. Benchmarking
12. SWOT Cross
13. Synthesis
14. Challenge Refinement

## Notes
- Keep code/keys in English (only translate UI labels)
- Maintain consistent terminology across all editors
- Use formal Portuguese (não/não use gírias)
- Keep acronyms when widely understood (OKR, BSC, SWOT)
- Test each editor after translation
