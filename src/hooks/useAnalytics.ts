"use client";

import { useCallback } from "react";

/**
 * Frontend-only analytics stub. Logs to console.
 * TODO: Wire to a real analytics backend (PostHog, Plausible, etc.) when ready.
 */
export function useAnalytics() {
  return useCallback((eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line no-console
    console.info("[analytics:stub]", eventName, properties);
  }, []);
}
