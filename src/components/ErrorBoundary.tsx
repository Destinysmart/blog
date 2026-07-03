import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-500 mb-6 text-sm">
              We encountered an unexpected error while loading this page.
            </p>
            {this.state.error && (
              <pre className="bg-gray-100 p-4 rounded-xl text-xs text-left overflow-auto text-red-600 mb-6">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
