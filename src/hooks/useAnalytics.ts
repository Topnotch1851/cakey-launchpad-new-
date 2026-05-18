"use client";

import { useCallback } from "react";

/**
 * Frontend-only analytics stub. Logs to console.
 * TODO: Wire to a real analytics backend (PostHog, Plausible, etc.) when ready.
 */
export function useAnalytics() {
  return useCallback((eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") {
       
      console.info("[analytics:stub]", eventName, properties);
    }
  }, []);
}
