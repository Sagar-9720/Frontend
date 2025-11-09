import React from 'react';
import { Button } from './Button';

export type ErrorBannerProps = {
  message?: React.ReactNode;
  onRetry?: () => void | Promise<void>;
  className?: string;
  retryText?: string;
};

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message = 'Something went wrong',
  onRetry,
  className = '',
  retryText = 'Retry',
}) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-red-700 font-medium text-sm">{message}</span>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            {retryText}
          </Button>
        )}
      </div>
    </div>
  );
};
