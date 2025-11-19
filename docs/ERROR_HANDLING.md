# Error Handling System

## Overview

The IMENSIAH frontend has a comprehensive error handling system with multiple layers:

1. **Global Error Boundary** - Catches React component errors
2. **Error Pages** - Handles routing errors (404, 500)
3. **Error Handler Utilities** - Centralized error formatting and logging
4. **Custom Hooks** - Error handling in async operations

## Components

### 1. Error Boundary (`components/error-boundary.tsx`)

React Error Boundary that catches JavaScript errors in child components.

**Features:**
- Catches errors in component tree
- Shows user-friendly fallback UI
- Displays error details in development mode
- Reset button to recover from error
- Logs errors to console and monitoring service

**Usage:**

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

export default function Page() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

**Custom Fallback:**

```tsx
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

### 2. Async Error Boundary (`components/async-error-boundary.tsx`)

Wrapper for handling errors in async operations with reset keys.

**Usage:**

```tsx
import { AsyncErrorBoundary } from '@/components/async-error-boundary';

export default function Page() {
  const [id, setId] = useState(1);

  return (
    <AsyncErrorBoundary
      resetKeys={[id]}
      onReset={() => console.log('Reset')}
    >
      <ComponentWithAsyncOps />
    </AsyncErrorBoundary>
  );
}
```

### 3. Error Pages

#### `app/error.tsx`
Global error page for runtime errors. Automatically used by Next.js when an error occurs in a route.

#### `app/not-found.tsx`
404 page for non-existent routes.

## Utilities

### Error Classes (`lib/utils/error-handler.ts`)

**AppError** - Base error class
```tsx
throw new AppError('Something went wrong', 'CUSTOM_CODE', 500, {
  component: 'ComponentName',
  action: 'userAction',
  data: { /* context */ },
});
```

**ValidationError** - For form/input validation errors
```tsx
throw new ValidationError('Email is invalid', {
  component: 'LoginForm',
  action: 'validateEmail',
});
```

**AuthError** - For authentication errors
```tsx
throw new AuthError('Unauthorized access', {
  component: 'ProtectedRoute',
});
```

**NotFoundError** - For missing resources
```tsx
throw new NotFoundError('User not found', {
  component: 'UserProfile',
  data: { userId: 123 },
});
```

**NetworkError** - For network failures
```tsx
throw new NetworkError('Failed to connect to server', {
  action: 'fetchData',
});
```

### Helper Functions

**getUserFriendlyMessage(error)**
Converts error to user-friendly message in Portuguese.

```tsx
try {
  // operation
} catch (error) {
  const message = getUserFriendlyMessage(error);
  toast.error(message); // "Verifique os dados inseridos..."
}
```

**logError(error, context?)**
Logs error to console (dev) and monitoring service (prod).

```tsx
logError(error, {
  component: 'Dashboard',
  action: 'loadData',
  data: { userId: 123 },
});
```

## Hooks

### useErrorHandler

Handle errors in components with automatic toast notifications.

```tsx
import { useErrorHandler } from '@/hooks/use-error-handler';

export function MyComponent() {
  const { error, handleError, clearError, hasError } = useErrorHandler({
    onError: (error) => console.log('Error:', error),
    showToast: true, // default
  });

  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (err) {
      handleError(err, {
        component: 'MyComponent',
        action: 'handleClick',
      });
    }
  };

  if (hasError) {
    return <div>Error: {error?.message}</div>;
  }

  return <button onClick={handleClick}>Do Something</button>;
}
```

### useAsync

Handle async operations with loading and error states.

```tsx
import { useAsync } from '@/hooks/use-error-handler';

export function UserList() {
  const { data, isLoading, error, execute } = useAsync(
    async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    {
      onSuccess: (data) => console.log('Loaded:', data),
      showToast: true,
    }
  );

  useEffect(() => {
    execute();
  }, [execute]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return <div>{/* render data */}</div>;
}
```

## Best Practices

### 1. Component-Level Error Handling

```tsx
'use client';

import { useErrorHandler } from '@/hooks/use-error-handler';
import { toast } from 'sonner';

export function MyForm() {
  const { handleError } = useErrorHandler();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      toast.success('Success!');
    } catch (error) {
      handleError(error, {
        component: 'MyForm',
        action: 'onSubmit',
        data: data,
      });
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### 2. API Error Handling

```tsx
// lib/api/client.ts
export async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new AuthError('Unauthorized');
      }
      if (response.status === 404) {
        throw new NotFoundError('Resource not found');
      }
      throw new NetworkError(`HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    logError(error, { action: 'apiCall', data: { url } });
    throw error;
  }
}
```

### 3. Global Error Boundary Setup

```tsx
// app/layout.tsx
import { ErrorBoundary } from '@/components/error-boundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### 4. Nested Error Boundaries

Use multiple error boundaries at different levels for granular control:

```tsx
export function Dashboard() {
  return (
    <ErrorBoundary>
      <div>
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>

        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>

        <ErrorBoundary>
          <MainContent />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}
```

## Error Messages (Portuguese)

Standard error messages shown to users:

- **Validation Error**: "Verifique os dados inseridos e tente novamente."
- **Auth Error**: "Você precisa estar autenticado para realizar esta ação."
- **Not Found Error**: "O recurso solicitado não foi encontrado."
- **Network Error**: "Ocorreu um erro de conexão. Por favor, tente novamente."
- **Default Error**: "Um erro inesperado ocorreu. Por favor, tente novamente."

## Monitoring in Production

Errors are automatically sent to the monitoring service in production via:

```tsx
navigator.sendBeacon('/api/logs/errors', JSON.stringify(errorData));
```

The error payload includes:
- Timestamp
- Error message
- Component context
- Current URL
- User agent

## Development vs Production

### Development
- Full error stack traces displayed
- Detailed console logging
- Error details visible to developers

### Production
- User-friendly error messages only
- Errors sent to monitoring service
- Stack traces hidden from users

## Testing Error Scenarios

```tsx
// Throw an error in development
if (process.env.NODE_ENV === 'development') {
  throw new Error('Test error');
}

// Test error boundary
<ErrorBoundary>
  <ComponentThatThrows />
</ErrorBoundary>
```

## Migration Guide

If converting existing error handling:

1. **Replace try/catch blocks:**
```tsx
// Before
try {
  // operation
} catch (e) {
  console.error(e);
  alert('Something went wrong');
}

// After
try {
  // operation
} catch (e) {
  handleError(e, { component: 'Name', action: 'action' });
}
```

2. **Add error boundaries:**
```tsx
// Wrap components in ErrorBoundary
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

3. **Use custom hooks:**
```tsx
// Use useErrorHandler or useAsync instead of useState + manual error handling
const { error, handleError } = useErrorHandler();
```

## Troubleshooting

### Error Boundary Not Catching Errors

Error Boundaries only catch:
- Render errors in child components
- Constructor errors
- Lifecycle method errors

They do NOT catch:
- Event handler errors (use try/catch)
- Async errors (use useAsync hook)
- Server-side errors

### Solution: Wrap async operations

```tsx
const handleClick = async () => {
  try {
    await asyncOperation();
  } catch (error) {
    handleError(error); // Use hook instead
  }
};
```

## Related Files

- Components: `/components/error-boundary.tsx`, `/components/async-error-boundary.tsx`
- Utilities: `/lib/utils/error-handler.ts`
- Hooks: `/hooks/use-error-handler.ts`
- Error Pages: `/app/error.tsx`, `/app/not-found.tsx`
- Layout: `/app/layout.tsx`
