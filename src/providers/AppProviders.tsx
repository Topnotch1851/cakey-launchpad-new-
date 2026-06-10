"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/**
 * Lightweight root providers. QueryClient + Toaster + ErrorBoundary.
 *
 * Wagmi + RainbowKit are NOT mounted here on purpose.  Marketing pages
 * (privacy, terms, features, etc.) never need a wallet, so their bundle
 * stays small.  The wallet island lives in `WaitlistWalletUI` and is loaded
 * via `next/dynamic` from the homepage waitlist form only.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
          mutations: { retry: 0 },
        },
      }),
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors theme="dark" position="top-center" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
