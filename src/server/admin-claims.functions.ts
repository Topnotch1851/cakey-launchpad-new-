/**
 * Frontend-only admin claims mocks.
 */
import { fakeLatency } from "./_mock";

export type AdminClaimRow = {
  id: string;
  tracking_code: string;
  claimant_email: string;
  wallet_address: string;
  project_name: string;
  project_slug: string | null;
  incident_type: string;
  incident_date: string;
  claim_amount_usd: number;
  description: string;
  evidence_urls: string[];
  tx_hashes: string[];
  status: string;
  status_note: string | null;
  created_at: string;
  updated_at: string;
};

const MOCK_CLAIMS: AdminClaimRow[] = [
  {
    id: "c1",
    tracking_code: "clm_demo987",
    claimant_email: "victim@example.com",
    wallet_address: "0xabc...123",
    project_name: "Lost Project",
    project_slug: null,
    incident_type: "rug_pull",
    incident_date: new Date(Date.now() - 14 * 86400_000).toISOString().slice(0, 10),
    claim_amount_usd: 5400,
    description: "Liquidity removed without notice.",
    evidence_urls: [],
    tx_hashes: [],
    status: "under_review",
    status_note: null,
    created_at: new Date(Date.now() - 5 * 86400_000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400_000).toISOString(),
  },
];

export async function adminListClaims() {
  await fakeLatency(400);
  return { ok: true as const, claims: MOCK_CLAIMS };
}

export async function adminGetClaimHistory(_args: { data: { claimId: string } }) {
  await fakeLatency(250);
  return {
    ok: true as const,
    history: [
      {
        id: "h1",
        status: "submitted",
        note: "Claim received",
        created_at: new Date(Date.now() - 5 * 86400_000).toISOString(),
        created_by: null,
      },
      {
        id: "h2",
        status: "under_review",
        note: "Started review",
        created_at: new Date(Date.now() - 3 * 86400_000).toISOString(),
        created_by: null,
      },
    ],
  };
}

export async function adminUpdateClaimStatus(_args: {
  data: {
    id: string;
    status:
      | "submitted"
      | "under_review"
      | "evidence_requested"
      | "approved"
      | "rejected"
      | "paid";
    note?: string | null;
  };
}) {
  await fakeLatency(350);
  return { ok: true as const };
}
