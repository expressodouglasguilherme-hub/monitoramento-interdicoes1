/**
 * LoadingIndicator - Visual loading indicator component
 * Feature: monitoramento-interdicoes-combustiveis
 * 
 * Requirements: 8.1, 8.2
 */

import React from 'react';

export interface LoadingIndicatorProps {
  /** Optional message to display below the spinner */
  message?: string;
  
  /** Size of the loading indicator */
  size?: 'small' | 'medium' | 'large';
}

/**
 * LoadingIndicator component - Displays animated spinner with optional message
 * 
 * @param props - Component props
 * @returns JSX.Element
 */
export function LoadingIndicator({ message, size = 'medium' }: LoadingIndicatorProps): JSX.Element {
  // Size mappings for spinner
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8" role="status" aria-live="polite">
      {/* Animated spinner */}
      <div
        className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
        aria-hidden="true"
      />
      
      {/* Optional message */}
      {message && (
        <p className={`mt-4 text-gray-700 ${textSizeClasses[size]}`}>
          {message}
        </p>
      )}
      
      {/* Screen reader text */}
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
