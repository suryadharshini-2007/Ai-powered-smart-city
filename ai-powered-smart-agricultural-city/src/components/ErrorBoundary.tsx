import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[360px] p-8 flex flex-col items-center justify-center text-center bg-slate-950/80 rounded-2xl border border-rose-500/30 m-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-white mb-2">
            {this.props.fallbackTitle || '3D Scene Rendering Issue Encountered'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md font-mono mb-6">
            {this.state.error?.message || 'WebGL context or component tree encountered a non-fatal disruption.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Experience</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
