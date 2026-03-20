import { Component, ErrorInfo, ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application render error:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="fatal-screen">
          <div className="fatal-card">
            <p className="eyebrow">Runtime Error</p>
            <h1>The app failed to load</h1>
            <p>
              A client-side error occurred during startup. The message below is
              shown so the app does not fail as a blank white page.
            </p>
            <pre>{this.state.error.message}</pre>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
