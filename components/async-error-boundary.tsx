'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary } from './error-boundary';

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  resetKeys?: Array<string | number>;
  onReset?: () => void;
  fallback?: ReactNode;
}

export function AsyncErrorBoundary({
  children,
  resetKeys = [],
  onReset,
  fallback,
}: AsyncErrorBoundaryProps) {
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    setKey((prev) => prev + 1);
  }, resetKeys);

  const handleReset = () => {
    onReset?.();
  };

  return (
    <ErrorBoundary key={key} fallback={fallback}>
      {React.cloneElement(children as React.ReactElement, {
        onResetError: handleReset,
      })}
    </ErrorBoundary>
  );
}
