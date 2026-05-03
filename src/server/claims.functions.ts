/**
 * Frontend-only mocks for insurance claim submission/lookup.
 */
import { fakeLatency, mockTrackingCode } from "./_mock";

export async function submitInsuranceClaim(_args: {
  data: {
    claimantEmail: string;
    walletAddress: string;
    projectName: string;
    projectSlug?: string;
    incidentType:
      | "liquidity_drain"
      | "lock_breach"
      | "rug_pull"
      | "contract_exploit"
      | "team_abandonment"
      | "other";
    incidentDate: string;
    claimAmountUsd: number;
    description: string;
    evidenceUrls?: string[];
    txHashes?: string[];
  };
}) {
  await fakeLatency(700);
  return { ok: true as const, trackingCode: mockTrackingCode("clm") };
}

export type InsuranceClaimStatusRow = {
  project_name: string;
  status: "submitted" | "under_review" | "evidence_requested" | "approved" | "rejected" | "paid";
  status_note: string | null;
  claim_amount_usd: number;
  incident_type: string;
  incident_date: string;
  created_at: string;
  history: Array<{ status: string; note: string | null; at: string }>;
};

export async function getInsuranceClaimStatus(args: { data: { code: string } }) {
  await fakeLatency(500);
  if (!args.data.code || args.data.code.length < 6) {
    return { ok: false as const, status: null, error: "Invalid tracking code." };
  }
  const created = new Date(Date.now() - 5 * 24 * 3600_000).toISOString();
  const row: InsuranceClaimStatusRow = {
    project_name: "Mock Project",
    status: "under_review",
    status_note: "Reviewing transaction evidence.",
    claim_amount_usd: 1500,
    incident_type: "liquidity_drain",
    incident_date: new Date(Date.now() - 7 * 24 * 3600_000).toISOString().slice(0, 10),
    created_at: created,
    history: [
      { status: "submitted", note: "Claim received", at: created },
      {
        status: "under_review",
        note: "Started review",
        at: new Date(Date.now() - 3 * 24 * 3600_000).toISOString(),
      },
    ],
  };
  return { ok: true as const, status: row };
}
