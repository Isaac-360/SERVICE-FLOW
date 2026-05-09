import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
              <p className="text-slate-500">
                An unexpected error occurred. Don't worry, we've been notified.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-left">
              <p className="text-xs font-mono text-red-500 overflow-auto max-h-32">
                {this.state.error?.message || 'Unknown Error'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={this.handleReset} className="flex-1 gap-2">
                <RefreshCw size={18} />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className="flex-1 gap-2"
              >
                <Home size={18} />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
