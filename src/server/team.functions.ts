/**
 * Frontend-only mock for "my applications" (team dashboard).
 */
import { fakeLatency } from "./_mock";

export type MyApplicationRow = {
  id: string;
  project_name: string;
  contact_email: string;
  status: "submitted" | "under_review" | "approved" | "rejected";
  status_note: string | null;
  token_chain: string | null;
  token_symbol: string | null;
  created_at: string;
  tracking_code: string;
  website: string | null;
};

export async function listMyApplications() {
  await fakeLatency(400);
  const apps: MyApplicationRow[] = [
    {
      id: "demo-1",
      project_name: "Obelisk Protocol",
      contact_email: "you@example.com",
      status: "under_review",
      status_note: "Reviewing team docs.",
      token_chain: "Base",
      token_symbol: "OBL",
      created_at: new Date(Date.now() - 4 * 86400_000).toISOString(),
      tracking_code: "app_demo123",
      website: "https://example.com",
    },
  ];
  return { ok: true as const, applications: apps };
}
