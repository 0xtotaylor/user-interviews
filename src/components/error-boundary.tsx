"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Props interface for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  /** Child components to render when no error occurs */
  children: ReactNode;
  /** Optional fallback UI to render when an error occurs */
  fallback?: ReactNode;
  /** Optional callback function called when an error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State interface for the ErrorBoundary component.
 */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error object, if any */
  error?: Error;
  /** Additional error information from React */
  errorInfo?: ErrorInfo;
}

/**
 * ErrorBoundary component that catches JavaScript errors in child components.
 * 
 * This component provides a fallback UI when errors occur and prevents the
 * entire application from crashing. It's useful for graceful error handling
 * in production environments.
 * 
 * Features:
 * - Catches errors in child component tree
 * - Displays user-friendly error message
 * - Provides retry functionality
 * - Logs errors for debugging
 * - Customizable fallback UI
 * 
 * @example
 * ```tsx
 * <ErrorBoundary onError={(error) => console.error(error)}>
 *   <SomeComponentThatMightFail />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
    };
  }

  /**
   * Static method called when an error occurs during rendering.
   * Updates the component state to show the error UI.
   * 
   * @param error - The error that was thrown
   * @returns New state object indicating an error has occurred
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle method called when an error occurs.
   * Used for logging and calling the onError callback.
   * 
   * @param error - The error that was thrown
   * @param errorInfo - Additional information about the error
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });
    
    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Resets the error boundary state to allow retry.
   * Called when user clicks the "Try Again" button.
   */
  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  /**
   * Reloads the current page.
   * Used as a last resort for error recovery.
   */
  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Render default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. This has been logged and will be investigated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Show error details in development mode */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-2">Error Details (Development Only):</p>
                  <p className="text-xs text-muted-foreground break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer">Component Stack</summary>
                      <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full">
                  Try Again
                </Button>
                <Button onClick={this.handleReload} variant="outline" className="w-full">
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // No error occurred, render children normally
    return this.props.children;
  }
}

/**
 * Hook-based error boundary for functional components.
 * Uses the ErrorBoundary class component internally.
 * 
 * @param props - ErrorBoundary props
 * @returns ErrorBoundary component
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}