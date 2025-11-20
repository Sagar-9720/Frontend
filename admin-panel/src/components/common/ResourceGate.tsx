import React from 'react';
import { ErrorBanner } from './ErrorBanner';

export interface ResourceGateProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => Promise<void> | void;
  children: React.ReactNode;
  skeleton?: React.ReactNode; // optional custom skeleton
  showError: boolean;
}

/**
 * Central gate handling initial loading skeleton, error banner, and content display.
 * Shows error banner above content to maintain table structure visibility.
 */
export const ResourceGate: React.FC<ResourceGateProps> = ({
  loading,
  error,
  onRetry,
  children,
  skeleton,
  showError,
}) => {
  console.log('ResourceGate Props:', { loading, showError, error });
  
  if (loading) {
    return (
      <div data-testid="resource-skeleton">
        {skeleton || (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-100 rounded" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded" />
            ))}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <>
      {showError && (
        <ErrorBanner
          message={error || 'Failed to load data.'}
          onRetry={async () => { if (onRetry) await onRetry(); }}
          className="mb-4"
        />
      )}
      {children}
    </>
  );
};