"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Ignore Web3/Ethereum related errors
    if (error.message.includes('ethereum') || error.message.includes('web3')) {
      console.log('Web3 error caught and ignored:', error.message);
      this.setState({ hasError: false });
      return;
    }
    
    console.error('Unexpected error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && !this.state.error?.message.includes('ethereum')) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Something went wrong
            </h2>
            <button
              className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded-lg"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;