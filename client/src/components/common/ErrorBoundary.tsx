import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center space-y-8 p-10 bg-white rounded-xl shadow-2xl border border-gray-100">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              We encountered an unexpected error. Our team has been notified.
            </p>

            {this.state.error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg text-left overflow-auto max-h-40 border border-red-100">
                <p className="text-xs font-mono text-red-700 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                onClick={() => this.setState({ hasError: false })}
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
