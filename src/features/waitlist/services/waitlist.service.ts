import type { SupabaseClient } from "@supabase/supabase-js";
import type { WaitlistInput, WaitlistResult } from "../schemas";

type Meta = {
  ipHash: string | null;
  userAgent: string | null;
};

/**
 * Normalise a wallet for storage.
 *   - EVM (`0x...`) is case-insensitive. lowercase for dedup.
 *   - Solana base58 is case-sensitive. preserve casing.
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
 * The service is transport-agnostic. server actions, route handlers, edge functions,
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
      p_email: input.email ?? null,
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

  // Postgres surfaces both `code` (sqlstate) and `message`.  Map each known
  // error path to a clear, user-facing message; map unknown ones to a generic.
  //   23505 = unique_violation.  Disambiguate email vs wallet via the failing
  //           constraint name in `details`/`message`.
  //   P0001 = our custom rate-limit signal raised inside join_waitlist().
  //   22023 = "email_or_wallet_required". should be caught client-side first,
  //           but surfaced cleanly if the form somehow lets a blank through.
  const err = error as
    | { code?: string; message?: string; details?: string; hint?: string }
    | null;
  const code = err?.code ?? "";
  const message = err?.message ?? "";
  const details = err?.details ?? "";
  const haystack = `${code} ${message} ${details}`.toLowerCase();

  if (code === "23505" || haystack.includes("23505")) {
    if (haystack.includes("wallet")) {
      return { ok: false, error: "This wallet is already on the waitlist." };
    }
    return { ok: false, error: "This email is already on the waitlist." };
  }
  if (code === "P0001" || haystack.includes("rate_limit_exceeded")) {
    return {
      ok: false,
      error: "Too many signup attempts. Please try again later.",
    };
  }
  if (code === "22023" || haystack.includes("email_or_wallet_required")) {
    return { ok: false, error: "Enter an email, or connect / paste a wallet." };
  }

  if (process.env.NODE_ENV !== "production") {
     
    console.error("[waitlist:service] insert failed", error);
  }
  return { ok: false, error: "Couldn't join the waitlist. Please try again." };
}
