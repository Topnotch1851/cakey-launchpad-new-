/**
 * Frontend-only mocks for waitlist server functions.
 * Mirrors the original input/output shapes.
 */
import { fakeLatency } from "./_mock";

export async function joinWaitlist(args: {
  data: {
    email: string;
    role?: "investor" | "team" | "other" | null;
    walletAddress?: string | null;
    source?: string | null;
  };
}) {
  await fakeLatency(500);
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[waitlist:mock] joined", args.data);
  }
  return { ok: true as const };
}

export async function getWaitlistByWallet(args: { data: { wallet: string } }) {
  await fakeLatency(400);
  // Mock: every wallet considered eligible for demo
  return {
    ok: true as const,
    eligible: true,
    role: "investor" as string | null,
    joinedAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString() as
      | string
      | null,
  };
}

export async function linkWalletToWaitlist(args: {
  data: { email: string; wallet: string };
}) {
  await fakeLatency(450);
  if (!args.data.email.includes("@")) {
    return { ok: false as const, error: "Invalid email" };
  }
  return { ok: true as const };
}
