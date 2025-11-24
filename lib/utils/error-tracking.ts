/**
 * Error Tracking Utility
 *
 * Centralized error logging and tracking.
 * Ready for Sentry integration - just add Sentry SDK and uncomment the code below.
 *
 * To enable Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Uncomment Sentry code below
 * 4. Add NEXT_PUBLIC_SENTRY_DSN to .env.local
 */

// import * as Sentry from '@sentry/nextjs';

interface ErrorContext {
  user?: {
    id?: string;
    email?: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

/**
 * Initialize error tracking (call in _app.tsx or layout.tsx)
 */
export function initErrorTracking() {
  if (process.env.NODE_ENV === 'production') {
    // Sentry.init({
    //   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    //   environment: process.env.NODE_ENV,
    //   tracesSampleRate: 1.0,
    //   beforeSend(event, hint) {
    //     // Filter out errors we don't want to track
    //     if (event.exception) {
    //       const error = hint.originalException;
    //       // Add any filtering logic here
    //     }
    //     return event;
    //   },
    // });

    console.log('[Error Tracking] Production error tracking ready (Sentry not configured)');
  } else {
    console.log('[Error Tracking] Development mode - errors logged to console only');
  }
}

/**
 * Log an error to the tracking service
 */
export function logError(error: Error, context?: ErrorContext) {
  // Log to console in all environments
  console.error('[Error Tracking]', error, context);

  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, {
    //   user: context?.user,
    //   tags: context?.tags,
    //   extra: context?.extra,
    // });
  }
}

/**
 * Log a message (for non-error important events)
 */
export function logMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
  console.log(`[Error Tracking] ${level.toUpperCase()}:`, message, context);

  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureMessage(message, {
    //   level: level,
    //   user: context?.user,
    //   tags: context?.tags,
    //   extra: context?.extra,
    // });
  }
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: { id: string; email: string; name?: string }) {
  console.log('[Error Tracking] User context set:', user.email);

  // Sentry.setUser({
  //   id: user.id,
  //   email: user.email,
  //   username: user.name,
  // });
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext() {
  console.log('[Error Tracking] User context cleared');

  // Sentry.setUser(null);
}

/**
 * Add breadcrumb for tracking user actions
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  console.log(`[Error Tracking] Breadcrumb [${category}]:`, message, data);

  // Sentry.addBreadcrumb({
  //   message,
  //   category,
  //   data,
  //   level: 'info',
  // });
}

/**
 * Create an error boundary error handler
 */
export function createErrorBoundaryHandler(componentName: string) {
  return (error: Error, errorInfo: React.ErrorInfo) => {
    logError(error, {
      tags: {
        component: componentName,
        errorBoundary: 'true',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  };
}
