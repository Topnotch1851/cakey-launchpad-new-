"use client";

/**
 * Frontend-only stub. Always returns false.
 * TODO: Wire to real role check when backend is ready.
 */
export function useIsAdmin(_userId: string | undefined) {
  return { isAdmin: false, checking: false };
}
