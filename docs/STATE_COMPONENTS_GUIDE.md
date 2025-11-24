# Guia de Componentes de Estado

Este documento descreve os componentes de estado consistentes implementados no dashboard da plataforma Imensiah.

## Visão Geral

Os componentes de estado fornecem uma experiência de usuário consistente para situações de carregamento, processamento, estados vazios e erros em todo o dashboard.

## Componentes Disponíveis

### 1. LoadingState

**Propósito**: Exibir um estado de carregamento centralizado com spinner animado.

**Quando usar**:
- Carregamento inicial de páginas
- Aguardando dados do servidor
- Transições entre estados

**Exemplo de uso**:
```tsx
import { LoadingState } from "@/components/ui/state-components";

<LoadingState
  message="Carregando seus projetos..."
  size="lg"
/>
```

**Props**:
- `message?: string` - Mensagem exibida (default: "Carregando...")
- `size?: "sm" | "md" | "lg"` - Tamanho do spinner e espaçamento
- `variant?: "default" | "processing"` - Variante visual
- `className?: string` - Classes CSS adicionais

---

### 2. ProcessingState

**Propósito**: Exibir um estado de processamento ativo com barra de progresso e tempo estimado.

**Quando usar**:
- Enriquecimento de dados em andamento
- Análise estratégica sendo processada
- Geração de relatórios
- Qualquer operação com progresso rastreável

**Exemplo de uso**:
```tsx
import { ProcessingState } from "@/components/ui/state-components";

<ProcessingState
  title="Enriquecimento em Andamento"
  description="Nossa IA está coletando e analisando informações adicionais sobre a empresa."
  progress={45}
  estimatedTime="2-5 minutos"
/>
```

**Props**:
- `title: string` - Título do processo
- `description?: string` - Descrição detalhada
- `progress?: number` - Percentual de progresso (0-100)
- `estimatedTime?: string` - Tempo estimado para conclusão
- `className?: string` - Classes CSS adicionais

---

### 3. EmptyState

**Propósito**: Exibir uma mensagem quando não há dados disponíveis.

**Quando usar**:
- Listas vazias
- Resultados de busca sem correspondências
- Seções sem conteúdo

**Exemplo de uso**:
```tsx
import { EmptyState } from "@/components/ui/state-components";

<EmptyState
  variant="inbox"
  title="Nenhum projeto ainda"
  description="Você ainda não enviou nenhum projeto. Comece criando seu primeiro envio."
  action={{
    label: "Criar Projeto",
    onClick: () => router.push("/novo-projeto")
  }}
/>
```

**Props**:
- `icon?: React.ComponentType` - Ícone customizado (Lucide icon)
- `title: string` - Título principal
- `description?: string` - Descrição adicional
- `action?: { label: string; onClick: () => void }` - Botão de ação opcional
- `variant?: "default" | "search" | "inbox"` - Variante com ícones pré-definidos
- `className?: string` - Classes CSS adicionais

---

### 4. ErrorState

**Propósito**: Exibir mensagens de erro com opção de tentar novamente.

**Quando usar**:
- Falhas em requisições
- Erros de processamento
- Timeouts
- Problemas de autorização

**Exemplo de uso**:
```tsx
import { ErrorState } from "@/components/ui/state-components";

<ErrorState
  title="Erro no Enriquecimento"
  message="Não foi possível completar o enriquecimento de dados."
  onRetry={() => retryMutation.mutate()}
  retryLabel="Tentar Novamente"
  variant="error"
  details="Error: Network timeout after 30s"
/>
```

**Props**:
- `title?: string` - Título do erro (default: "Algo deu errado")
- `message: string` - Mensagem descritiva do erro
- `onRetry?: () => void` - Função para tentar novamente
- `retryLabel?: string` - Label do botão de retry (default: "Tentar Novamente")
- `details?: string` - Detalhes técnicos do erro (colapsável)
- `variant?: "error" | "warning"` - Variante visual
- `className?: string` - Classes CSS adicionais

---

### 5. WorkflowPending

**Propósito**: Componente especializado para etapas de workflow (enriquecimento, análise, relatório).

**Quando usar**:
- Estado pendente específico de cada etapa do workflow

**Exemplo de uso**:
```tsx
import { WorkflowPending } from "@/components/ui/state-components";

<WorkflowPending stage="enrichment" />
```

**Props**:
- `stage: "enrichment" | "analysis" | "report"` - Etapa do workflow
- `className?: string` - Classes CSS adicionais

---

### 6. NoDataYet

**Propósito**: Indicar que dados ainda não foram gerados (diferente de "vazio").

**Quando usar**:
- Dados que serão gerados automaticamente
- Aguardando conclusão de etapa anterior
- Conteúdo que depende de processamento

**Exemplo de uso**:
```tsx
import { NoDataYet } from "@/components/ui/state-components";

<NoDataYet
  dataType="Análise estratégica"
  expectedWhen="A análise será gerada após a aprovação do enriquecimento."
/>
```

**Props**:
- `dataType: string` - Tipo de dado esperado
- `expectedWhen?: string` - Quando o dado estará disponível
- `className?: string` - Classes CSS adicionais

---

## Implementação no Dashboard

### Dashboard Principal (dashboard/page.tsx)

- **LoadingState**: Carregamento inicial da página
- **EmptyState**: Quando não há projetos

### Detalhes do Projeto (submissions/[id]/page.tsx)

- **LoadingState**: Carregamento dos detalhes
- **ErrorState**: Projeto não encontrado

### Enriquecimento (EnrichmentDetails.tsx)

- **NoDataYet**: Nenhum enriquecimento iniciado
- **ProcessingState**: Enriquecimento em andamento (pending/processing)
- **ErrorState**: Falha no enriquecimento (failed)
- **Conteúdo normal**: Enriquecimento completo (completed/approved)

### Análise (AnalysisDetails.tsx)

- **NoDataYet**: Nenhuma análise iniciada
- **ProcessingState**: Análise em andamento (pending/processing)
- **ErrorState**: Falha na análise (failed)
- **Conteúdo normal**: Análise completa (completed/approved/sent)

---

## Padrões de Design

### Cores

- **Loading/Processing**: Azul (`blue-500`, `blue-50`)
- **Success**: Verde (`green-500`, `green-50`)
- **Warning**: Amarelo/Âmbar (`amber-500`, `yellow-50`)
- **Error**: Vermelho (`red-500`, `red-50`)
- **Neutral**: Cinza (`gray-500`, `gray-50`)

### Ícones (Lucide)

- **Loading**: `Loader2` (com animação spin)
- **Processing**: `Zap` (com animação pulse)
- **Empty**: `FileQuestion`, `Search`, `Inbox`
- **Error**: `AlertCircle`
- **Time**: `Clock`

### Animações

- **Spinner**: Rotação contínua
- **Processing Icon**: Pulse suave
- **Progress Bar**: Transição suave de largura
- **Fade In**: Entrada suave de conteúdo

---

## Boas Práticas

### 1. Sempre use mensagens em português
```tsx
// ✅ Correto
<LoadingState message="Carregando seus projetos..." />

// ❌ Incorreto
<LoadingState message="Loading your projects..." />
```

### 2. Forneça contexto útil
```tsx
// ✅ Correto
<EmptyState
  title="Nenhum projeto ainda"
  description="Você ainda não enviou nenhum projeto. Comece criando seu primeiro envio."
/>

// ❌ Incorreto
<EmptyState title="Vazio" />
```

### 3. Use variantes apropriadas
```tsx
// ✅ Correto - Erro crítico
<ErrorState variant="error" message="Falha ao processar dados" />

// ✅ Correto - Aviso não crítico
<ErrorState variant="warning" message="Dados não encontrados" />
```

### 4. Sempre forneça ação de retry quando possível
```tsx
// ✅ Correto
<ErrorState
  message="Falha na conexão"
  onRetry={() => refetch()}
/>

// ⚠️ Aceitável apenas se retry não for possível
<ErrorState message="Dados não encontrados" />
```

### 5. Use estados de processamento para operações longas
```tsx
// ✅ Correto - Mostra progresso
<ProcessingState
  title="Processando análise"
  progress={progress}
  estimatedTime="3-5 minutos"
/>

// ❌ Incorreto - Sem feedback de progresso
<LoadingState message="Processando..." />
```

---

## Testes

Para testar os componentes de estado:

1. **LoadingState**: Simule latência de rede
2. **ProcessingState**: Teste com diferentes valores de progresso
3. **EmptyState**: Verifique listas vazias
4. **ErrorState**: Force erros em requisições
5. **WorkflowPending**: Teste transições entre etapas

---

## Manutenção

Estes componentes estão localizados em:
```
frontend/components/ui/state-components.tsx
```

Ao atualizar:
1. Mantenha consistência visual com o design system
2. Garanta que todas as mensagens estejam em português
3. Teste em mobile e desktop
4. Verifique acessibilidade (ARIA labels, cores de contraste)
5. Atualize este guia com mudanças significativas

---

## Checklist de Implementação

Ao adicionar um novo componente de estado:

- [ ] Componente criado em `state-components.tsx`
- [ ] Props tipadas corretamente com TypeScript
- [ ] Mensagens em português
- [ ] Ícones apropriados (Lucide)
- [ ] Animações suaves
- [ ] Responsivo (mobile e desktop)
- [ ] Classes Tailwind consistentes
- [ ] Exemplo adicionado neste guia
- [ ] Testado em diferentes cenários
- [ ] Documentação atualizada

---

## Exemplos Completos

### Página com todos os estados

```tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/state-components";

export default function ExamplePage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: fetchData
  });

  if (isLoading) {
    return <LoadingState message="Carregando dados..." size="lg" />;
  }

  if (error) {
    return (
      <ErrorState
        message="Não foi possível carregar os dados."
        onRetry={refetch}
        variant="error"
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="inbox"
        title="Nenhum dado disponível"
        description="Comece adicionando seu primeiro item."
      />
    );
  }

  return <div>{/* Renderizar dados */}</div>;
}
```

---

## Suporte

Para dúvidas ou sugestões sobre os componentes de estado:
1. Consulte este guia
2. Verifique a implementação em `state-components.tsx`
3. Veja exemplos de uso nas páginas do dashboard
4. Entre em contato com a equipe de desenvolvimento
