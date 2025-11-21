"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - React Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console (in production, send to error tracking service like Sentry)
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Log to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-architect-cream p-6">
          <div className="max-w-md w-full space-y-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-architect-gold/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-architect-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-heading font-light text-architect-black tracking-tight">
                Algo deu errado
              </h1>
              <p className="text-architect-gray-dark font-body text-sm leading-relaxed">
                Encontramos um problema inesperado. Não se preocupe, sua
                informação está segura. Por favor, tente novamente.
              </p>
            </div>

            {/* Development Mode: Show Error Details */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left bg-red-50 border border-red-200 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-red-800 text-sm">
                  Detalhes do erro (apenas em desenvolvimento)
                </summary>
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-mono text-red-700 break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs font-mono text-red-600 overflow-auto max-h-40 bg-white p-2 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                variant="architect"
                className="w-full"
              >
                Tentar Novamente
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="w-full"
              >
                Voltar ao Início
              </Button>
            </div>

            {/* Support Message */}
            <p className="text-xs text-architect-gray font-body">
              Se o problema persistir, entre em contato com nosso suporte.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
