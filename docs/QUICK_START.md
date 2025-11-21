# Guia Rápido - API Client e Hooks

## Instalação

As dependências já estão instaladas:
- ✅ `@tanstack/react-query@5.90.8`
- ✅ `@tanstack/react-query-devtools`

## Uso Básico

### 1. Autenticação

```typescript
import { useAuth } from '@/lib/hooks';
import { ptBR } from '@/lib/i18n/pt-BR';

function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'usuario@exemplo.com', password: 'senha123' });
    } catch (error) {
      alert(ptBR.auth.invalidCredentials);
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoggingIn}>
      {isLoggingIn ? ptBR.common.loading : ptBR.auth.login}
    </button>
  );
}
```

### 2. Listar Envios

```typescript
import { useSubmissions } from '@/lib/hooks';

function SubmissionsList() {
  const { submissions, isLoading, error } = useSubmissions();

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <ul>
      {submissions.map(sub => (
        <li key={sub.id}>{sub.personalInfo.fullName}</li>
      ))}
    </ul>
  );
}
```

### 3. Visualizar Envio

```typescript
import { useSubmission } from '@/lib/hooks';

function SubmissionDetail({ id }: { id: string }) {
  const { submission, isLoading, update } = useSubmission(id);

  if (isLoading) return <div>Carregando...</div>;
  if (!submission) return <div>Não encontrado</div>;

  return (
    <div>
      <h1>{submission.personalInfo.fullName}</h1>
      <button onClick={() => update({ status: 'processing' })}>
        Processar
      </button>
    </div>
  );
}
```

### 4. Contexto de Autenticação

```typescript
import { useAuthContext } from '@/lib/providers';

function Header() {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      {isAuthenticated ? `Olá, ${user?.name}!` : 'Visitante'}
    </div>
  );
}
```

## Usuários Mock para Teste

```typescript
// Login com estes usuários:
{
  email: 'admin@imensiah.com',
  password: 'qualquer_senha' // senha não é validada no mock
}

{
  email: 'usuario@exemplo.com',
  password: 'qualquer_senha'
}
```

## Traduções

```typescript
import { ptBR } from '@/lib/i18n/pt-BR';

// Exemplos:
ptBR.auth.login           // "Entrar"
ptBR.dashboard.title      // "Painel"
ptBR.status.pending       // "Pendente"
ptBR.common.loading       // "Carregando..."
ptBR.notifications.submissionCreated  // "Envio criado com sucesso"
```

## Estrutura de Dados

### Submission
```typescript
{
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    document: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Hooks Disponíveis

| Hook | Descrição |
|------|-----------|
| `useAuth()` | Login, signup, logout, forgot password |
| `useSubmissions(params?)` | Listar envios com filtros |
| `useSubmission(id)` | Envio único, update, delete |
| `useEnrichment(submissionId)` | Dados enriquecidos, approve, reject |
| `useAnalysis(submissionId)` | Análise, generate, PDF, send |
| `useProfile(userId?)` | Perfil do usuário, update |
| `useAuthContext()` | Contexto global de autenticação |

## Características

- ✅ **Type-Safe**: 100% TypeScript
- ✅ **Cache Automático**: React Query gerencia cache
- ✅ **Delays Realistas**: 500-2000ms
- ✅ **Erros Simulados**: 10% de falha
- ✅ **Português**: Todas as strings traduzidas
- ✅ **DevTools**: Debug visual do cache (dev mode)

## Ver Mais

- **Exemplos Completos**: `docs/USAGE_EXAMPLES.md`
- **Resumo da Implementação**: `docs/IMPLEMENTATION_SUMMARY.md`
- **Código Mock**: `lib/mock/*.ts`
- **API Client**: `lib/api/client.ts`
