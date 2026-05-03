"use client";

import { useMemo, useState } from "react";
import {
  Loader2,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Clock,
  Check,
  X,
  FileSearch,
  AlertTriangle,
  Wallet,
  Mail,
  Calendar,
  DollarSign,
  Hash,
  History,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  useAdminClaims,
  useClaimHistory,
  useUpdateClaimStatus,
} from "@/features/admin/hooks/useAdminData";
import { cn } from "@/lib/utils";

type ClaimStatus =
  | "submitted"
  | "under_review"
  | "evidence_requested"
  | "approved"
  | "rejected"
  | "paid";

const STATUS_OPTIONS: ClaimStatus[] = [
  "submitted",
  "under_review",
  "evidence_requested",
  "approved",
  "rejected",
  "paid",
];

interface ClaimRow {
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
  status: ClaimStatus;
  status_note: string | null;
  created_at: string;
  updated_at: string;
}

interface HistoryRow {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
}

export default function AdminClaimsPage() {
  const isAdmin = true; // frontend-only build
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: claimsData = [], isPending: loadingRows, refetch } = useAdminClaims(isAdmin);
  const claims = claimsData as ClaimRow[];
  const { data: historyData } = useClaimHistory(expanded);
  const updateMutation = useUpdateClaimStatus();
  const updating = updateMutation.isPending ? updateMutation.variables?.id ?? null : null;

  const refresh = () => {
    refetch();
  };

  const filtered = useMemo(
    () =>
      claims.filter((c) => {
        if (statusFilter && c.status !== statusFilter) return false;
        if (filter) {
          const f = filter.toLowerCase();
          if (
            !c.project_name.toLowerCase().includes(f) &&
            !c.claimant_email.toLowerCase().includes(f) &&
            !c.tracking_code.toLowerCase().includes(f) &&
            !c.wallet_address.toLowerCase().includes(f)
          )
            return false;
        }
        return true;
      }),
    [claims, filter, statusFilter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of STATUS_OPTIONS) c[s] = 0;
    for (const claim of claims) c[claim.status] = (c[claim.status] ?? 0) + 1;
    return c;
  }, [claims]);

  const toggleExpand = (id: string) => setExpanded((cur) => (cur === id ? null : id));

  const handleDecision = async (id: string, status: ClaimStatus, promptLabel: string) => {
    const note = window.prompt(`${promptLabel} — note for the claimant (optional):`) || null;
    try {
      await updateMutation.mutateAsync({ id, status, note });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update claim";
      alert(msg);
    }
  };

  return (
    <DashboardShell
      eyebrow="Insurance claims review"
      title="Claims Review Panel"
      description={`${filtered.length} of ${claims.length} claims · Verify evidence, approve, or reject`}
    >
      <div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
              className={cn("glass rounded-xl p-3 text-left transition", statusFilter === s && "ring-2 ring-accent")}
            >
              <div className="text-2xl font-semibold">{counts[s] ?? 0}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {s.replace("_", " ")}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search project, email, wallet, or tracking code…"
              className="w-full rounded-xl border border-border bg-background/40 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-background/40 px-3 py-2.5 text-sm"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
          <button onClick={refresh} className="rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-card/70">
            Refresh
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {loadingRows ? (
            <div className="glass flex items-center justify-center rounded-2xl p-10">
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
              No claims match your filters.
            </div>
          ) : (
            filtered.map((c) => (
              <ClaimCard
                key={c.id}
                claim={c}
                expanded={expanded === c.id}
                onToggle={() => toggleExpand(c.id)}
                history={expanded === c.id ? (historyData as HistoryRow[] | undefined) : undefined}
                onDecision={handleDecision}
                updating={updating === c.id}
              />
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function ClaimCard({
  claim,
  expanded,
  onToggle,
  history,
  onDecision,
  updating,
}: {
  claim: ClaimRow;
  expanded: boolean;
  onToggle: () => void;
  history: HistoryRow[] | undefined;
  onDecision: (id: string, status: ClaimStatus, label: string) => void;
  updating: boolean;
}) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <button onClick={onToggle} className="flex w-full items-start justify-between gap-4 p-5 text-left hover:bg-card/30">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-lg font-semibold">{claim.project_name}</span>
            <StatusPill status={claim.status} />
            <span className="font-mono text-[10px] text-muted-foreground">#{claim.tracking_code}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3 w-3" /> {claim.claimant_email}
            </span>
            <span className="inline-flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {Number(claim.claim_amount_usd).toLocaleString()} USD
            </span>
            <span className="inline-flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {claim.incident_type.replace("_", " ")}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {claim.incident_date}
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border p-5">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Section title="Incident description">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{claim.description}</p>
              </Section>

              <Section title={`Evidence URLs (${claim.evidence_urls.length})`} icon={FileSearch}>
                {claim.evidence_urls.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No evidence URLs submitted.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {claim.evidence_urls.map((url, i) => (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 break-all text-xs text-accent hover:underline"
                        >
                          <ExternalLink className="h-3 w-3 shrink-0" />
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title={`On-chain transactions (${claim.tx_hashes.length})`} icon={Hash}>
                {claim.tx_hashes.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No transaction hashes submitted.</p>
                ) : (
                  <ul className="space-y-1">
                    {claim.tx_hashes.map((h, i) => (
                      <li key={i} className="break-all font-mono text-xs text-muted-foreground">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title="Claimant wallet" icon={Wallet}>
                <p className="break-all font-mono text-xs text-muted-foreground">{claim.wallet_address}</p>
              </Section>

              {claim.status_note && (
                <Section title="Current admin note">
                  <p className="rounded-lg border border-border bg-background/40 p-3 text-xs text-muted-foreground">
                    {claim.status_note}
                  </p>
                </Section>
              )}

              <Section title="Status history" icon={History}>
                {!history ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading…
                  </div>
                ) : history.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No history yet.</p>
                ) : (
                  <ol className="space-y-2">
                    {history.map((h) => (
                      <li key={h.id} className="flex gap-3 text-xs">
                        <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusPill status={h.status as ClaimStatus} small />
                            <span className="text-muted-foreground">{new Date(h.created_at).toLocaleString()}</span>
                          </div>
                          {h.note && <p className="mt-1 text-muted-foreground">{h.note}</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </Section>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Decision</h3>
              <div className="glass space-y-2 rounded-xl border border-border/50 p-4">
                <DecisionBtn
                  onClick={() => onDecision(claim.id, "under_review", "Move to under review")}
                  disabled={updating || claim.status === "under_review"}
                  variant="neutral"
                  icon={FileSearch}
                >
                  Mark under review
                </DecisionBtn>
                <DecisionBtn
                  onClick={() => onDecision(claim.id, "evidence_requested", "Request more evidence")}
                  disabled={updating}
                  variant="warn"
                  icon={AlertTriangle}
                >
                  Request more evidence
                </DecisionBtn>
                <DecisionBtn
                  onClick={() => onDecision(claim.id, "approved", "Approve claim")}
                  disabled={updating || claim.status === "approved" || claim.status === "paid"}
                  variant="success"
                  icon={Check}
                >
                  Approve claim
                </DecisionBtn>
                <DecisionBtn
                  onClick={() => onDecision(claim.id, "paid", "Mark as paid out")}
                  disabled={updating || claim.status !== "approved"}
                  variant="success"
                  icon={DollarSign}
                >
                  Mark paid out
                </DecisionBtn>
                <DecisionBtn
                  onClick={() => onDecision(claim.id, "rejected", "Reject claim")}
                  disabled={updating || claim.status === "rejected"}
                  variant="danger"
                  icon={X}
                >
                  Reject claim
                </DecisionBtn>
                {updating && (
                  <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> Updating…
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Submitted {new Date(claim.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />} {title}
      </h3>
      {children}
    </div>
  );
}

function StatusPill({ status, small }: { status: ClaimStatus; small?: boolean }) {
  const styles: Record<ClaimStatus, string> = {
    submitted: "border-sky-400/40 bg-sky-400/10 text-sky-300",
    under_review: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    evidence_requested: "border-orange-400/40 bg-orange-400/10 text-orange-300",
    approved: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    paid: "border-violet-400/40 bg-violet-400/10 text-violet-300",
    rejected: "border-destructive/40 bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={cn(
        "rounded-full border font-semibold uppercase tracking-wider",
        small ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]",
        styles[status],
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function DecisionBtn({
  onClick,
  disabled,
  variant,
  icon: Icon,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant: "success" | "danger" | "warn" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const styles = {
    success: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20",
    danger: "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
    warn: "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20",
    neutral: "border-border bg-background/40 text-foreground hover:bg-card/70",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
        styles[variant],
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
