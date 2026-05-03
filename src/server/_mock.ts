/**
 * Shared utilities for frontend-only mock "server functions".
 * Mimics the original TanStack Start `createServerFn` callable shape
 * so route components can import without modification.
 */

export const FRONTEND_ONLY_NOTICE =
  "Backend not connected. Returning mock data for frontend preview.";

export async function fakeLatency(ms = 350) {
  await new Promise((r) => setTimeout(r, ms));
}

export function nowIso() {
  return new Date().toISOString();
}

export function mockTrackingCode(prefix = "cak") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
