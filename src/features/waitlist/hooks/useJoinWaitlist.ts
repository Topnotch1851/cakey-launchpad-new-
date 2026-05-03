"use client";

import { useMutation } from "@tanstack/react-query";

export type WaitlistInput = {
  email: string;
  role?: "investor" | "team" | "other" | null;
  walletAddress?: string | null;
  source?: string | null;
};

/**
 * Frontend-only stub. Simulates a waitlist join with a delay.
 * TODO: Replace with real API call when backend is ready.
 */
export function useJoinWaitlist() {
  return useMutation({
    mutationFn: async (input: WaitlistInput) => {
      await new Promise((r) => setTimeout(r, 600));
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.info("[waitlist:stub]", input);
      }
      const result: { ok: true; id: string } | { ok: false; error: string } = {
        ok: true,
        id: crypto.randomUUID(),
      };
      return result;
    },
  });
}
