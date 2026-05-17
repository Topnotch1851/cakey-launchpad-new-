"use server";

import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { createServerSupabase } from "@/lib/supabase/server";
import { waitlistInputSchema, type WaitlistInput, type WaitlistResult } from "./schemas";
import { insertWaitlistSignup } from "./services/waitlist.service";

const DEFAULT_SALT = "cakey-waitlist-fallback-salt";

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

  const salt = process.env.WAITLIST_IP_SALT ?? DEFAULT_SALT;
  const ipHash = ip ? createHash("sha256").update(`${ip}:${salt}`).digest("hex") : null;

  const supabase = createServerSupabase();
  return insertWaitlistSignup(supabase, parsed.data, { ipHash, userAgent });
}
