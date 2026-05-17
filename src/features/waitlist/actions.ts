"use server";

import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { createServerSupabase } from "@/lib/supabase/server";
import { waitlistInputSchema, type WaitlistInput, type WaitlistResult } from "./schemas";
import { insertWaitlistSignup } from "./services/waitlist.service";

// Dev-only fallback so local `next dev` runs without a .env.local entry.
// In production, missing salt throws — a deterministic constant salt would
// make every submitter's IP hash predictable and useless for rate-limit dedup.
const DEV_FALLBACK_SALT = "cakey-waitlist-dev-only-salt";

function readSalt(): string {
  const fromEnv = process.env.WAITLIST_IP_SALT?.trim();
  if (fromEnv && fromEnv.length >= 16) return fromEnv;

  if (process.env.NODE_ENV === "production") {
    // Fail loud at first call rather than silently degrade.  The catch in the
    // service layer will surface a generic error to the client; the throw is
    // caught upstream in the server-action runtime which logs it server-side.
    throw new Error(
      "WAITLIST_IP_SALT is required in production. Set a 32+ byte random string in the deployment env.",
    );
  }
  return DEV_FALLBACK_SALT;
}

/**
 * Server action: validate, hash submitter IP, delegate to the service.
 *
 * Public via "use server".  Always returns a structured result (never throws to the client).
 */
export async function joinWaitlistAction(rawInput: WaitlistInput): Promise<WaitlistResult> {
  const parsed = waitlistInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const reqHeaders = await headers();
  const ip =
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    reqHeaders.get("x-real-ip") ??
    "";
  const userAgent = reqHeaders.get("user-agent") ?? null;

  let ipHash: string | null = null;
  if (ip) {
    try {
      const salt = readSalt();
      ipHash = createHash("sha256").update(`${ip}:${salt}`).digest("hex");
    } catch (err) {
      // In production, missing salt is an operator misconfiguration.  Surface
      // a clear error message instead of letting it cascade.
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("[waitlist:action] salt read failed", err);
      }
      return {
        ok: false,
        error: "Server is misconfigured. Please contact support.",
      };
    }
  }

  // Structured log so Vercel runtime logs show whether the wallet field
  // actually arrived at the action.  Helps diagnose "I connected my wallet
  // but it didn't save" reports.  Doesn't leak the address or the email.
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      lvl: "info",
      evt: "waitlist.submit",
      email_domain: parsed.data.email.split("@")[1] ?? null,
      role: parsed.data.role ?? null,
      wallet_present: Boolean(parsed.data.walletAddress),
      wallet_kind: parsed.data.walletAddress
        ? parsed.data.walletAddress.startsWith("0x")
          ? "evm"
          : "solana"
        : null,
      source: parsed.data.source ?? null,
      ip_hashed: ipHash !== null,
    }),
  );

  const supabase = createServerSupabase();
  return insertWaitlistSignup(supabase, parsed.data, { ipHash, userAgent });
}
