import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | Error | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  title?: string;
  variant?: 'error' | 'warning' | 'info';
  showRetry?: boolean;
  showDismiss?: boolean;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  title = 'Something went wrong',
  variant = 'error',
  showRetry = true,
  showDismiss = true,
  className = ''
}) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  const getStyles = () => {
    switch (variant) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          title: 'text-red-800',
          message: 'text-red-700',
          button: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: 'text-yellow-600',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          title: 'text-blue-800',
          message: 'text-blue-700',
          button: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          title: 'text-gray-800',
          message: 'text-gray-700',
          button: 'bg-gray-600 hover:bg-gray-700 text-white'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`${styles.container} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className={`h-5 w-5 ${styles.icon} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${styles.title}`}>
            {title}
          </h3>
          <p className={`text-sm ${styles.message} mt-1`}>
            {errorMessage}
          </p>
          {(showRetry || showDismiss) && (
            <div className="mt-3 flex space-x-2">
              {showRetry && onRetry && (
                <button
                  onClick={onRetry}
                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${styles.button}`}
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Try Again</span>
                </button>
              )}
              {showDismiss && onDismiss && (
                <button
                  onClick={onDismiss}
                  className="inline-flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="h-3 w-3" />
                  <span>Dismiss</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
