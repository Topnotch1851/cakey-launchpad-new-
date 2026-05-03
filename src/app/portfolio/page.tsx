"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Loader2, Wallet, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useIsAdmin } from "@/features/auth/hooks/useIsAdmin";
import { useLaunches, type Launch } from "@/features/launches/hooks/useLaunches";
import { useWatchlist } from "@/features/portfolio/hooks/useWatchlist";
import { RiskBadge, tierFor } from "@/components/launches/RiskBadge";

export default function PortfolioPage() {
  const { user } = useAuth();
  const { isAdmin, checking } = useIsAdmin(user?.id);
  const router = useRouter();
  const { slugs, remove: removeFromWatchlist } = useWatchlist();
  const { data: launches = [], isPending: fetching } = useLaunches({ status: "all", q: "" });

  useEffect(() => {
    if (!checking && isAdmin) router.push("/admin");
  }, [checking, isAdmin, router]);

  const watched = useMemo(() => launches.filter((l) => slugs.includes(l.slug)), [launches, slugs]);

  const summary = useMemo(() => {
    const scores = watched
      .map((l: Launch) => l.trust_score)
      .filter((s: number | null): s is number => typeof s === "number");
    const avg = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null;
    const tally = { low: 0, moderate: 0, elevated: 0, unrated: 0 };
    for (const l of watched) tally[tierFor(l.trust_score)]++;
    return { avg, tally, count: watched.length };
  }, [watched]);

  if (checking || isAdmin) return null;

  return (
    <DashboardShell
      eyebrow="Investor"
      title="Your portfolio"
      description="Track allocations, monitor risk across watched projects, and stay ahead of post-launch changes."
    >
      <>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryStat label="Watchlist" value={String(summary.count)} />
          <SummaryStat label="Avg trust" value={summary.avg != null ? String(summary.avg) : "—"} />
          <SummaryStat label="Low risk" value={String(summary.tally.low)} tone="emerald" />
          <SummaryStat label="Elevated" value={String(summary.tally.elevated)} tone="rose" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Panel title="Active allocations" eyebrow="Participations" description="Token sales you've contributed to.">
            <EmptyState
              title="No active allocations"
              body="Allocations will appear here once you participate in a launch."
              cta={{ to: "/launches", label: "Browse launches" }}
            />
          </Panel>

          <Panel
            title="Watchlist"
            eyebrow={`${summary.count} project${summary.count === 1 ? "" : "s"}`}
            description="Projects you're tracking. Risk score is updated live."
          >
            {fetching ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : watched.length === 0 ? (
              <EmptyState
                title="Nothing watched yet"
                body="Open any launch and tap Watch to add it here."
                cta={{ to: "/launches", label: "Find launches" }}
                icon={Star}
              />
            ) : (
              <ul className="space-y-2">
                {watched.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/30 p-3"
                  >
                    <Link href={`/launches/${l.slug}`} className="flex min-w-0 flex-1 items-center gap-3 hover:opacity-90">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 font-display text-sm font-bold">
                        {l.project_name.slice(0, 1)}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{l.project_name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {l.token_symbol} · {l.token_chain}
                        </div>
                      </div>
                    </Link>
                    <div className="flex shrink-0 items-center gap-2">
                      <RiskBadge score={l.trust_score} showScore={false} />
                      <button
                        type="button"
                        onClick={() => removeFromWatchlist(l.slug)}
                        className="rounded-lg border border-border bg-background/40 px-2 py-1 text-[11px] text-muted-foreground hover:border-rose-400/40 hover:text-rose-300"
                        aria-label={`Remove ${l.project_name} from watchlist`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="mt-10 mb-24">
          <Panel title="Protection coverage" eyebrow="Insurance pool" description="Live coverage across your watched projects.">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-accent" />
                Every Cakey-vetted launch is backed by the shared insurance pool.
              </div>
              <Link
                href="/insurance"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/40 px-4 py-2 text-sm font-medium text-foreground hover:border-accent/40 hover:text-accent"
              >
                How the pool works <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Panel>
        </div>
      </>
    </DashboardShell>
  );
}

function SummaryStat({ label, value, tone }: { label: string; value: string; tone?: "emerald" | "rose" }) {
  const color = tone === "emerald" ? "text-emerald-300" : tone === "rose" ? "text-rose-300" : "text-foreground";
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-2xl font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function Panel({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {eyebrow && (
          <span className="font-display text-[10px] uppercase tracking-[0.2em] text-accent">{eyebrow}</span>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function EmptyState({
  title,
  body,
  cta,
  icon: Icon = Wallet,
}: {
  title: string;
  body: string;
  cta: { to: string; label: string };
  icon?: typeof Wallet;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-background/20 px-6 py-10 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border">
        <Icon className="h-5 w-5 text-accent" />
      </span>
      <div className="mt-3 font-display text-sm font-semibold">{title}</div>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
      <Link
        href={cta.to}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-xs font-semibold text-primary-foreground"
      >
        {cta.label} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
