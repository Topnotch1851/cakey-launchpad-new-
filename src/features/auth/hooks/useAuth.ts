"use client";

/**
 * Frontend-only stub. Returns no session.
 * TODO: Wire to real auth provider when backend is ready.
 */
export function useAuth() {
  return {
    session: null as null,
    user: null as null | { id: string; email?: string },
    loading: false,
  };
}
