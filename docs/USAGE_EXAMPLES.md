# Exemplos de Uso - API Client e Hooks

Este documento demonstra como usar a API mock, hooks customizados e traduções em português.

## Índice

1. [Autenticação](#autenticação)
2. [Gerenciamento de Envios](#gerenciamento-de-envios)
3. [Enriquecimento de Dados](#enriquecimento-de-dados)
4. [Análise](#análise)
5. [Perfil do Usuário](#perfil-do-usuário)
6. [Traduções](#traduções)

---

## Autenticação

### Login de Usuário

```typescript
import { useAuth } from '@/lib/hooks';
import { ptBR } from '@/lib/i18n/pt-BR';

function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();

  const handleLogin = async () => {
    try {
      const user = await login({
        email: 'usuario@exemplo.com',
        password: 'senha123',
      });
      console.log('Usuário logado:', user);
    } catch (error) {
      console.error(ptBR.auth.invalidCredentials);
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoggingIn}>
      {isLoggingIn ? ptBR.common.loading : ptBR.auth.login}
    </button>
  );
}
```

### Cadastro de Novo Usuário

```typescript
import { useAuth } from '@/lib/hooks';
import { ptBR } from '@/lib/i18n/pt-BR';

function SignupPage() {
  const { signup, isSigningUp, signupError } = useAuth();

  const handleSignup = async () => {
    try {
      const user = await signup({
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: 'senha123',
      });
      console.log('Conta criada:', user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleSignup} disabled={isSigningUp}>
      {isSigningUp ? ptBR.common.loading : ptBR.auth.signup}
    </button>
  );
}
```

### Recuperação de Senha

```typescript
import { useAuth } from '@/lib/hooks';
import { ptBR } from '@/lib/i18n/pt-BR';

function ForgotPasswordPage() {
  const { forgotPassword, isSendingReset, forgotPasswordError } = useAuth();

  const handleForgotPassword = async (email: string) => {
    try {
      const result = await forgotPassword(email);
      console.log(result.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={() => handleForgotPassword('usuario@exemplo.com')}
      disabled={isSendingReset}
    >
      {isSendingReset ? ptBR.common.loading : ptBR.auth.sendResetLink}
    </button>
  );
}
```

---

## Gerenciamento de Envios

### Listar Envios do Usuário

```typescript
import { useSubmissions } from '@/lib/hooks';
import { ptBR } from '@/lib/i18n/pt-BR';

function SubmissionsListPage() {
  const { submissions, total, isLoading, error } = useSubmissions({
    userId: 'user-2',
    status: 'completed',
    page: 1,
    limit: 10,
  });

  if (isLoading) return <div>{ptBR.common.loading}</div>;
  if (error) return <div>{ptBR.common.error}: {error.message}</div>;

  return (
    <div>
      <h1>{ptBR.dashboard.mySubmissions}</h1>
      <p>{ptBR.dashboard.totalSubmissions}: {total}</p>
      <ul>
        {submissions.map((submission) => (
          <li key={submission.id}>
            {submission.personalInfo.fullName} - {ptBR.status[submission.status]}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Criar Novo Envio

```typescript
import { useSubmissions } from '@/lib/hooks';
import { ptBR } from '@/lib/i18n/pt-BR';

function NewSubmissionPage() {
  const { create, isCreating, createError } = useSubmissions();

  const handleCreate = async () => {
    try {
      const newSubmission = await create({
        userId: 'user-2',
        status: 'pending',
        personalInfo: {
          fullName: 'João Silva',
          email: 'joao@exemplo.com',
          phone: '(11) 98765-4321',
          document: '123.456.789-00',
        },
        address: {
          street: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
        },
        notes: 'Análise de crédito',
      });
      console.log(ptBR.notifications.submissionCreated, newSubmission);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleCreate} disabled={isCreating}>
      {isCreating ? ptBR.common.loading : ptBR.dashboard.newSubmission}
    </button>
  );
}
```

### Visualizar e Atualizar Envio

```typescript
import { useSubmission } from '@/lib/hooks';
import { ptBR } from '@/lib/i18n/pt-BR';

function SubmissionDetailPage({ id }: { id: string }) {
  const {
    submission,
    isLoading,
    error,
    update,
    isUpdating,
    delete: deleteSubmission,
    isDeleting,
  } = useSubmission(id);

  if (isLoading) return <div>{ptBR.common.loading}</div>;
  if (error) return <div>{ptBR.common.error}: {error.message}</div>;
  if (!submission) return <div>{ptBR.common.notFound}</div>;

  const handleUpdate = async () => {
    try {
      await update({ status: 'processing' });
      console.log(ptBR.notifications.submissionUpdated);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubmission();
      console.log(ptBR.notifications.submissionDeleted);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{ptBR.dashboard.submissionDetails}</h1>
      <p>{submission.personalInfo.fullName}</p>
      <p>{ptBR.status[submission.status]}</p>
      <button onClick={handleUpdate} disabled={isUpdating}>
        {isUpdating ? ptBR.common.loading : ptBR.common.edit}
      </button>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? ptBR.common.loading : ptBR.common.delete}
      </button>
    </div>
  );
}
```

---

## Enriquecimento de Dados

### Visualizar Dados de Enriquecimento

```typescript
import { useEnrichment } from '@/lib/hooks';
import { ptBR } from '@/lib/i18n/pt-BR';

function EnrichmentPage({ submissionId }: { submissionId: string }) {
  const {
    enrichment,
    isLoading,
    error,
    approve,
    isApproving,
    reject,
    isRejecting,
  } = useEnrichment(submissionId);

  if (isLoading) return <div>{ptBR.common.loading}</div>;
  if (error) return <div>{ptBR.common.error}: {error.message}</div>;
  if (!enrichment) return <div>{ptBR.common.notFound}</div>;

  const handleApprove = async () => {
    try {
      await approve();
      console.log(ptBR.notifications.enrichmentApproved);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      await reject('Dados inconsistentes');
      console.log(ptBR.notifications.enrichmentRejected);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{ptBR.dashboard.enrichmentData}</h1>
      <p>{ptBR.forms.enrichment.confidence}: {enrichment.confidence * 100}%</p>
      <p>{ptBR.status[enrichment.status]}</p>
      <button onClick={handleApprove} disabled={isApproving}>
        {isApproving ? ptBR.common.loading : ptBR.forms.enrichment.approve}
      </button>
      <button onClick={handleReject} disabled={isRejecting}>
        {isRejecting ? ptBR.common.loading : ptBR.forms.enrichment.reject}
      </button>
    </div>
  );
}
```

---

## Análise

### Gerar e Visualizar Análise

```typescript
import { useAnalysis } from '@/lib/hooks';
import { ptBR } from '@/lib/i18n/pt-BR';

function AnalysisPage({ submissionId }: { submissionId: string }) {
  const {
    analysis,
    isLoading,
    error,
    generate,
    isGenerating,
    generatePDF,
    isGeneratingPDF,
    sendToUser,
    isSending,
  } = useAnalysis(submissionId);

  if (isLoading) return <div>{ptBR.common.loading}</div>;
  if (error) return <div>{ptBR.common.error}: {error.message}</div>;

  const handleGenerate = async () => {
    try {
      const newAnalysis = await generate();
      console.log(ptBR.notifications.analysisGenerated, newAnalysis);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const result = await generatePDF();
      console.log('PDF gerado:', result.url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendToUser = async () => {
    try {
      await sendToUser('user-2');
      console.log(ptBR.notifications.reportSent);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{ptBR.dashboard.analysisReport}</h1>
      {!analysis ? (
        <button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? ptBR.common.loading : ptBR.forms.analysis.generatePDF}
        </button>
      ) : (
        <>
          <h2>{ptBR.forms.analysis.summary}</h2>
          <p>{analysis.summary}</p>
          <h3>{ptBR.forms.analysis.findings}</h3>
          <ul>
            {analysis.findings.map((finding, index) => (
              <li key={index}>{finding}</li>
            ))}
          </ul>
          <h3>{ptBR.forms.analysis.recommendations}</h3>
          <ul>
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
          <p>{ptBR.forms.analysis.riskLevel}: {ptBR.forms.analysis[`risk${analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)}`]}</p>
          <button onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
            {isGeneratingPDF ? ptBR.common.loading : ptBR.forms.analysis.generatePDF}
          </button>
          <button onClick={handleSendToUser} disabled={isSending}>
            {isSending ? ptBR.common.loading : ptBR.forms.analysis.sendReport}
          </button>
        </>
      )}
    </div>
  );
}
```

---

## Perfil do Usuário

### Visualizar e Atualizar Perfil

```typescript
import { useProfile } from '@/lib/hooks';
import { ptBR } from '@/lib/i18n/pt-BR';

function ProfilePage() {
  const {
    profile,
    isLoading,
    error,
    update,
    isUpdating,
    updatePassword,
    isUpdatingPassword,
  } = useProfile();

  if (isLoading) return <div>{ptBR.common.loading}</div>;
  if (error) return <div>{ptBR.common.error}: {error.message}</div>;
  if (!profile) return <div>{ptBR.auth.noAccount}</div>;

  const handleUpdateProfile = async () => {
    try {
      await update({ name: 'João Silva Atualizado' });
      console.log(ptBR.notifications.profileUpdated);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword({
        oldPassword: 'senha123',
        newPassword: 'novaSenha456',
      });
      console.log(ptBR.notifications.passwordChanged);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>{ptBR.dashboard.profile}</h1>
      <p>{ptBR.auth.name}: {profile.name}</p>
      <p>{ptBR.auth.email}: {profile.email}</p>
      <button onClick={handleUpdateProfile} disabled={isUpdating}>
        {isUpdating ? ptBR.common.loading : ptBR.common.edit}
      </button>
      <button onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
        {isUpdatingPassword ? ptBR.common.loading : ptBR.auth.updatePassword}
      </button>
    </div>
  );
}
```

---

## Traduções

### Uso das Traduções

```typescript
import { ptBR } from '@/lib/i18n/pt-BR';

// Autenticação
console.log(ptBR.auth.login); // "Entrar"
console.log(ptBR.auth.signup); // "Criar Conta"
console.log(ptBR.auth.forgotPassword); // "Esqueceu a senha?"

// Dashboard
console.log(ptBR.dashboard.title); // "Painel"
console.log(ptBR.dashboard.mySubmissions); // "Meus Envios"
console.log(ptBR.dashboard.newSubmission); // "Novo Envio"

// Status
console.log(ptBR.status.pending); // "Pendente"
console.log(ptBR.status.processing); // "Processando"
console.log(ptBR.status.completed); // "Concluído"

// Comum
console.log(ptBR.common.save); // "Salvar"
console.log(ptBR.common.cancel); // "Cancelar"
console.log(ptBR.common.loading); // "Carregando..."

// Notificações
console.log(ptBR.notifications.submissionCreated); // "Envio criado com sucesso"
console.log(ptBR.notifications.profileUpdated); // "Perfil atualizado com sucesso"

// Validação
console.log(ptBR.validation.required); // "Este campo é obrigatório"
console.log(ptBR.validation.invalidEmail); // "E-mail inválido"
```

### Interpolação de Variáveis

Para mensagens com variáveis, você pode usar template strings:

```typescript
import { ptBR } from '@/lib/i18n/pt-BR';

const minLength = 8;
const message = ptBR.validation.minLength.replace('{{min}}', String(minLength));
console.log(message); // "Mínimo de 8 caracteres"

const count = 5;
const timeMessage = ptBR.time.minutesAgo.replace('{{count}}', String(count));
console.log(timeMessage); // "5 minutos atrás"
```

---

## Tratamento de Erros

### Lidando com Erros da API

```typescript
import { ApiError } from '@/lib/api/client';
import { ptBR } from '@/lib/i18n/pt-BR';

async function handleApiCall() {
  try {
    // ... chamada à API
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          console.error(ptBR.common.unauthorized);
          break;
        case 403:
          console.error(ptBR.common.forbidden);
          break;
        case 404:
          console.error(ptBR.common.notFound);
          break;
        case 500:
          console.error(ptBR.common.serverError);
          break;
        default:
          console.error(ptBR.common.unknownError);
      }
    } else {
      console.error(ptBR.common.networkError);
    }
  }
}
```

---

## Contexto de Autenticação

### Usando o Contexto de Auth

```typescript
import { useAuthContext } from '@/lib/providers';
import { ptBR } from '@/lib/i18n/pt-BR';

function Header() {
  const { user, isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) return <div>{ptBR.common.loading}</div>;

  return (
    <header>
      {isAuthenticated ? (
        <div>
          {ptBR.dashboard.welcome}, {user?.name}!
        </div>
      ) : (
        <div>{ptBR.auth.noAccount}</div>
      )}
    </header>
  );
}
```

---

## Configuração de Cache

Os hooks usam React Query com configurações otimizadas:

- **Stale Time**: 30 segundos (dados são considerados frescos)
- **Cache Time**: 5 minutos (dados inativos permanecem em cache)
- **Retry**: 2 tentativas para queries, 1 para mutations
- **Refetch on Window Focus**: Desabilitado
- **Refetch on Reconnect**: Habilitado

### Invalidação Manual de Cache

```typescript
import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();

  const refreshSubmissions = () => {
    // Invalidar lista de envios
    queryClient.invalidateQueries({ queryKey: ['submissions'] });
  };

  const refreshSubmission = (id: string) => {
    // Invalidar envio específico
    queryClient.invalidateQueries({ queryKey: ['submission', id] });
  };

  return (
    <button onClick={refreshSubmissions}>
      {ptBR.common.refresh}
    </button>
  );
}
```

---

## Notas Importantes

1. **Dados Mock**: Todos os dados são simulados e armazenados em memória
2. **Delays**: APIs simulam delays realistas (500-2000ms)
3. **Erros**: 10% de chance de falha simulada
4. **Type Safety**: Todos os hooks e APIs são totalmente tipados
5. **Cache Automático**: React Query gerencia cache automaticamente
6. **Português**: Todas as strings estão em português brasileiro

---

## Próximos Passos

1. Substituir API mock por API real do Auth Proxy
2. Configurar autenticação persistente
3. Adicionar tratamento de erros global
4. Implementar sistema de notificações
5. Adicionar suporte a múltiplos idiomas
