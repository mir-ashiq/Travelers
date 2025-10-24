import React, { ReactNode, Component } from 'react';
import { AlertCircle } from 'lucide-react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by Error Boundary', error);
    this.setState({
      error,
      errorInfo,
    });
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
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="mt-4 text-xl font-bold text-gray-900 text-center">
                Oops! Something went wrong
              </h1>
              <p className="mt-2 text-sm text-gray-600 text-center">
                We encountered an unexpected error. Please try again.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 p-3 bg-red-50 rounded text-sm text-red-800 font-mono max-h-32 overflow-auto">
                  <summary className="cursor-pointer font-bold mb-2">Error Details</summary>
                  <div className="whitespace-pre-wrap">{this.state.error.toString()}</div>
                  {this.state.errorInfo && (
                    <div className="mt-2 whitespace-pre-wrap text-xs">
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </details>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Go Home
                </button>
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
