import type { SupabaseClient } from "@supabase/supabase-js";
import type { WaitlistInput, WaitlistResult } from "../schemas";

type Meta = {
  ipHash: string | null;
  userAgent: string | null;
};

/**
 * Normalise a wallet for storage.
 *   - EVM (`0x...`) is case-insensitive — lowercase for dedup.
 *   - Solana base58 is case-sensitive — preserve casing.
 * Returns null when there's no wallet to store.
 */
function normaliseWallet(wallet: string | null | undefined): string | null {
  if (!wallet) return null;
  const trimmed = wallet.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("0x") ? trimmed.toLowerCase() : trimmed;
}

/**
 * Pure waitlist service: takes a Supabase client + validated input + meta, returns a result.
 *
 * The service is transport-agnostic — server actions, route handlers, edge functions,
 * and tests can all reuse it.
 */
export async function insertWaitlistSignup(
  supabase: SupabaseClient,
  input: WaitlistInput,
  meta: Meta,
): Promise<WaitlistResult> {
  // Prefer the RPC: it does the insert and returns the queue position in one round-trip.
  const { data, error } = await supabase
    .rpc("join_waitlist", {
      p_email: input.email,
      p_role: input.role ?? null,
      p_wallet_address: normaliseWallet(input.walletAddress),
      p_source: input.source ?? null,
      p_ip_hash: meta.ipHash,
      p_user_agent: meta.userAgent,
    })
    .single<{ id: string; queue_position: number }>();

  if (!error && data) {
    return { ok: true, id: data.id, position: data.queue_position };
  }

  // Postgres exposes both a numeric `code` (sqlstate) and a `message`.
  // 23505 = unique_violation (duplicate email).
  // P0001 = our custom rate-limit signal raised inside join_waitlist().
  const code = (error as { code?: string } | null)?.code ?? "";
  const message = (error as { message?: string } | null)?.message ?? "";

  if (code === "23505" || message.includes("23505")) {
    return { ok: false, error: "This email is already on the waitlist." };
  }
  if (code === "P0001" || message.includes("rate_limit_exceeded")) {
    return {
      ok: false,
      error: "Too many signup attempts. Please try again later.",
    };
  }

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error("[waitlist:service] insert failed", error);
  }
  return { ok: false, error: "Couldn't join the waitlist. Please try again." };
}
