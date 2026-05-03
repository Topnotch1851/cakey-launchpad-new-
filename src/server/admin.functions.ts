/**
 * Frontend-only admin mocks.
 */
import { fakeLatency } from "./_mock";

export type AdminApplicationRow = {
  id: string;
  project_name: string;
  contact_email: string;
  status: "submitted" | "under_review" | "approved" | "rejected";
  status_note: string | null;
  token_chain: string | null;
  token_symbol: string | null;
  created_at: string;
  tracking_code: string;
};

export async function adminListApplications() {
  await fakeLatency(400);
  const apps: AdminApplicationRow[] = [
    {
      id: "a1",
      project_name: "Obelisk Protocol",
      contact_email: "founder@obelisk.xyz",
      status: "under_review",
      status_note: null,
      token_chain: "Base",
      token_symbol: "OBL",
      created_at: new Date(Date.now() - 4 * 86400_000).toISOString(),
      tracking_code: "app_demo123",
    },
    {
      id: "a2",
      project_name: "Lumen AI",
      contact_email: "team@lumen.ai",
      status: "approved",
      status_note: "Cleared diligence.",
      token_chain: "Arbitrum",
      token_symbol: "LMN",
      created_at: new Date(Date.now() - 12 * 86400_000).toISOString(),
      tracking_code: "app_lumen42",
    },
  ];
  return { ok: true as const, applications: apps };
}

export async function adminUpdateApplicationStatus(_args: {
  data: { id: string; status: string; note?: string | null };
}) {
  await fakeLatency(300);
  return { ok: true as const };
}

export type WaitlistRow = {
  id: string;
  email: string;
  role: string | null;
  wallet_address: string | null;
  source: string | null;
  created_at: string;
};

export async function adminListWaitlist(): Promise<WaitlistRow[]> {
  await fakeLatency(400);
  return [
    {
      id: "w1",
      email: "investor1@example.com",
      role: "investor",
      wallet_address: "0xabc1234567890def1234567890abcdef12345678",
      source: "landing_hero",
      created_at: new Date(Date.now() - 2 * 86400_000).toISOString(),
    },
    {
      id: "w2",
      email: "team@lumen.ai",
      role: "team",
      wallet_address: null,
      source: "founders_referral",
      created_at: new Date(Date.now() - 5 * 86400_000).toISOString(),
    },
    {
      id: "w3",
      email: "fan@protocol.xyz",
      role: "investor",
      wallet_address: "0xdef0011223344556677889900aabbccddeeff001",
      source: "twitter",
      created_at: new Date(Date.now() - 8 * 86400_000).toISOString(),
    },
  ];
}
