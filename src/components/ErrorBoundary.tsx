"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches render errors from descendant client components (e.g. wagmi/RainbowKit)
 * and prevents a single crash from white-screening the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }): void {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <h2 className="font-display text-2xl font-semibold">Something went wrong.</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          An unexpected error occurred. You can try again or refresh the page.
        </p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={this.reset}
            className="rounded-xl border border-border bg-card/60 px-4 py-2 text-sm font-medium hover:bg-card"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-glow"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
