"use client";

import { useMutation } from "@tanstack/react-query";
import { joinWaitlistAction } from "@/features/waitlist/actions";
import type { WaitlistInput, WaitlistResult } from "@/features/waitlist/schemas";

export type { WaitlistInput, WaitlistResult };

/**
 * Submits the waitlist form via the server action.
 *
 * React Query gives us loading/error state + automatic retry policy without forcing
 * us to keep local boolean state in every form.  The server action keeps secrets
 * (Supabase keys, IP salt) off the client.
 */
export function useJoinWaitlist() {
  return useMutation<WaitlistResult, Error, WaitlistInput>({
    mutationFn: (input) => joinWaitlistAction(input),
    retry: 0,
  });
}
