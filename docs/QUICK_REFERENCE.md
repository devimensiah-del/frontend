# Error Handling System - Quick Reference

## One-Minute Setup

The error system is already set up! The `ErrorBoundary` is already wrapping your app in `layout.tsx`.

## Common Usage Patterns

### Handle Async Error (Most Common)
```tsx
import { useErrorHandler } from '@/hooks/use-error-handler';
import { toast } from 'sonner';

const { handleError } = useErrorHandler();

try {
  const result = await fetch('/api/data');
  if (!result.ok) throw new Error('Failed');
} catch (error) {
  handleError(error, { component: 'MyComponent', action: 'fetchData' });
}
```

### Handle Form Submission Error
```tsx
import { ValidationError } from '@/lib/utils/error-handler';
import { useErrorHandler } from '@/hooks/use-error-handler';

const { handleError } = useErrorHandler();

const onSubmit = async (data) => {
  try {
    if (!data.email) {
      throw new ValidationError('Email é obrigatório');
    }
    await submitForm(data);
    toast.success('Formulário enviado!');
  } catch (error) {
    handleError(error, { component: 'MyForm', action: 'onSubmit' });
  }
};
```

### Handle Async Operation with Loading
```tsx
import { useAsync } from '@/hooks/use-error-handler';

const { data, isLoading, error, execute } = useAsync(
  async () => {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
  { showToast: true }
);

useEffect(() => {
  execute();
}, [execute]);
```

### Component Error Boundary
```tsx
import { ErrorBoundary } from '@/components/error-boundary';

export function Page() {
  return (
    <ErrorBoundary>
      <ExpensiveComponent />
    </ErrorBoundary>
  );
}
```

## Error Classes

```tsx
import {
  ValidationError,
  AuthError,
  NotFoundError,
  NetworkError,
  AppError,
} from '@/lib/utils/error-handler';

// Validation
throw new ValidationError('Email inválido');

// Auth
throw new AuthError('Não autenticado');

// Not Found
throw new NotFoundError('Usuário não encontrado');

// Network
throw new NetworkError('Conexão falhou');

// Custom
throw new AppError('Custom message', 'CUSTOM_CODE', 500);
```

## Helper Functions

```tsx
import {
  getUserFriendlyMessage,
  logError,
  parseErrorResponse,
} from '@/lib/utils/error-handler';

// Get Portuguese message
const message = getUserFriendlyMessage(error);
toast.error(message);

// Log with context
logError(error, {
  component: 'Dashboard',
  action: 'loadSubmissions',
  data: { submissionId: 123 },
});

// Parse error response
const { message, code, statusCode } = parseErrorResponse(error);
```

## File Locations

```
frontend/
├── components/
│   ├── error-boundary.tsx          # Global error boundary
│   └── async-error-boundary.tsx    # Async error wrapper
├── hooks/
│   └── use-error-handler.ts        # useErrorHandler, useAsync
├── lib/utils/
│   └── error-handler.ts            # Error classes & utilities
├── app/
│   ├── error.tsx                   # Global error page
│   ├── not-found.tsx               # 404 page
│   └── layout.tsx                  # Already wrapped with ErrorBoundary
└── docs/
    ├── ERROR_HANDLING.md           # Full documentation
    ├── ERROR_SYSTEM_SUMMARY.md     # Implementation details
    └── QUICK_REFERENCE.md          # This file
```

## Testing

```bash
# Run tests
npm test -- error-handler.test.ts

# Test error boundary locally
// In development, throw an error to see error boundary
throw new Error('Test error');
```

## Portuguese Error Messages

| Code | Message |
|------|---------|
| VALIDATION_ERROR | "Verifique os dados inseridos e tente novamente." |
| AUTH_ERROR | "Você precisa estar autenticado para realizar esta ação." |
| NOT_FOUND | "O recurso solicitado não foi encontrado." |
| NETWORK_ERROR | "Ocorreu um erro de conexão. Por favor, tente novamente." |
| Default | "Um erro inesperado ocorreu. Por favor, tente novamente." |

## Error Boundary Features

- Catches all React component errors
- Shows user-friendly fallback UI
- Reset button to recover
- Development: Shows error stack trace
- Production: Hides error details
- Mobile responsive
- Branded with IMENSIAH colors

## Hooks API

### useErrorHandler
```tsx
const {
  error,              // Current error or null
  handleError,        // Function to handle errors
  clearError,         // Clear current error
  hasError,           // Boolean if error exists
} = useErrorHandler({
  onError: (error) => {},  // Callback on error
  showToast: true,         // Show toast notification
});
```

### useAsync
```tsx
const {
  data,       // Async result or null
  isLoading,  // True while loading
  error,      // Error or null
  execute,    // Function to trigger async op
  clearError, // Clear error
} = useAsync(
  async () => { /* async function */ },
  {
    onSuccess: (data) => {},  // Success callback
    onError: (error) => {},   // Error callback
    showToast: true,          // Show toast
  }
);
```

## Best Practices

1. **Always wrap async operations**
   ```tsx
   try {
     await operation();
   } catch (error) {
     handleError(error);
   }
   ```

2. **Provide context when logging**
   ```tsx
   handleError(error, {
     component: 'ComponentName',
     action: 'actionName',
     data: { relevant, context },
   });
   ```

3. **Use specific error classes**
   ```tsx
   // Good
   if (!email) throw new ValidationError('Email required');

   // Avoid
   if (!email) throw new Error('Email required');
   ```

4. **Handle async operations with hook**
   ```tsx
   // Good
   const { data, isLoading } = useAsync(asyncFn);

   // Avoid
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState(null);
   // ... manual handling
   ```

5. **Wrap risky components with boundary**
   ```tsx
   <ErrorBoundary>
     <ExpensiveComponent />
   </ErrorBoundary>
   ```

## Common Errors

### Error Boundary Not Working
Error Boundaries only catch **render-time** errors, not event handlers.
Solution: Use `try/catch` with `handleError()` in event handlers.

### Toast Not Showing
Make sure Sonner provider is setup in `Providers`.
Check: `components/providers.tsx`

### Error Details Not Showing
In production, details are hidden for security.
To test: Add `NODE_ENV=development` to `.env.local`

### Error Not Being Logged
Logs are only sent in production.
Development: Check browser console

## Need Help?

See full documentation: `docs/ERROR_HANDLING.md`

This covers:
- Detailed API documentation
- Advanced patterns
- Integration examples
- Troubleshooting guide
- Monitoring setup
