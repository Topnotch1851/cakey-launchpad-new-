/**
 * Frontend-only mocks for application server functions.
 * Original contract preserved so route components import unchanged.
 */
import { fakeLatency, mockTrackingCode } from "./_mock";

export type SubmitApplicationInput = {
  data: {
    projectName: string;
    contactEmail: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    description: string;
    tokenSymbol?: string;
    tokenSupply?: number | null;
    tokenChain?: string;
    teamWallets?: string[];
    documentUrls?: string[];
  };
};

export async function submitApplication(_args: SubmitApplicationInput) {
  await fakeLatency(700);
  return { ok: true as const, trackingCode: mockTrackingCode("app") };
}

export type ApplicationStatusRow = {
  project_name: string;
  status: "submitted" | "under_review" | "approved" | "rejected";
  status_note: string | null;
  created_at: string;
  history: Array<{ status: string; note: string | null; at: string }>;
};

export async function getApplicationStatus(args: { data: { code: string } }) {
  await fakeLatency(500);
  if (!args.data.code || args.data.code.length < 6) {
    return { ok: false as const, status: null, error: "Invalid tracking code." };
  }
  // Deterministic mock based on code
  const seed = args.data.code.charCodeAt(0) % 4;
  const status = (["submitted", "under_review", "approved", "rejected"] as const)[seed];
  const created = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const row: ApplicationStatusRow = {
    project_name: "Demo Project (mock)",
    status,
    status_note:
      status === "rejected"
        ? "Insufficient on-chain history."
        : status === "approved"
          ? "Approved. Launch manager will reach out."
          : null,
    created_at: created,
    history: [
      { status: "submitted", note: "Application received", at: created },
      ...(status !== "submitted"
        ? [
            {
              status: "under_review",
              note: "Reviewing tokenomics",
              at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
            },
          ]
        : []),
      ...(status === "approved" || status === "rejected"
        ? [
            {
              status,
              note: status === "approved" ? "Approved" : "Declined",
              at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
            },
          ]
        : []),
    ],
  };
  return { ok: true as const, status: row };
}
