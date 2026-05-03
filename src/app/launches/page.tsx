"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, Sparkles, ArrowRight, Star } from "lucide-react";
import { listLaunches, type LaunchSummary } from "@/server/launches.functions";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { RiskBadge } from "@/components/launches/RiskBadge";
import { cn } from "@/lib/utils";

type LaunchStatus = "all" | "upcoming" | "live" | "ended" | "cancelled";

const STATUSES: { value: LaunchStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ended", label: "Ended" },
];

export default function LaunchesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const status = ((params.get("status") || "all") as LaunchStatus);
  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [launches, setLaunches] = useState<LaunchSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listLaunches({ data: { status, search: initialQ } })
      .then((res) => setLaunches(res.ok ? res.launches : []))
      .finally(() => setLoading(false));
  }, [status, initialQ]);

  const setStatus = (s: LaunchStatus) => {
    const sp = new URLSearchParams();
    if (s !== "all") sp.set("status", s);
    if (initialQ) sp.set("q", initialQ);
    router.push(`/launches${sp.toString() ? `?${sp.toString()}` : ""}`);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (status !== "all") sp.set("status", status);
    if (q) sp.set("q", q);
    router.push(`/launches${sp.toString() ? `?${sp.toString()}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-32">
        <section className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-accent">
                <Sparkles className="h-3 w-3" /> Launch dashboard
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Vetted <span className="text-gradient">token launches.</span>
              </h1>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Every project is scored by Cakey&apos;s AI trust engine across team, code,
                tokenomics, and on-chain behavior.
              </p>
            </div>
            <form onSubmit={submitSearch} className="glass flex w-full items-center gap-2 rounded-xl px-3 py-2 md:w-80">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search projects…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </form>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                  status === s.value
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 pb-24 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full rounded-2xl border border-border bg-background/30 p-12 text-center text-muted-foreground">
                Loading launches…
              </div>
            ) : launches.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-border bg-background/30 p-12 text-center text-muted-foreground">
                No launches match your filters.
              </div>
            ) : (
              launches.map((l, i) => <LaunchCard key={l.id} l={l} idx={i} />)
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    live: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    upcoming: "border-sky-400/40 bg-sky-400/10 text-sky-300",
    ended: "border-muted-foreground/30 bg-muted/30 text-muted-foreground",
    cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        map[status] ?? map.upcoming,
      )}
    >
      {status === "live" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
      )}
      {status}
    </span>
  );
}

function LaunchCard({ l, idx }: { l: LaunchSummary; idx: number }) {
  const pct =
    l.hard_cap_usd && l.raised_usd
      ? Math.min(100, Math.round((Number(l.raised_usd) / Number(l.hard_cap_usd)) * 100))
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.04 }}
    >
      <Link
        href={`/launches/${l.slug}`}
        className="group glass relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-5 transition-all hover:border-accent/40 hover:shadow-[0_30px_80px_-30px_oklch(0.62_0.22_295/0.4)]"
      >
        <div className="flex items-start gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 font-display text-lg font-bold">
            {l.project_name.slice(0, 1)}
            {l.featured && (
              <span
                aria-label="Featured"
                title="Featured"
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-accent/50 bg-background text-accent shadow-sm"
              >
                <Star className="h-3 w-3 fill-accent" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="min-w-0 flex-1 truncate font-display text-lg font-semibold">{l.project_name}</h3>
              <StatusBadge status={l.status} />
            </div>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{l.tagline}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Stat label="Token" value={l.token_symbol} />
          <Stat label="Chain" value={l.token_chain} />
        </div>
        <div>
          <RiskBadge score={l.trust_score} />
        </div>

        {l.hard_cap_usd ? (
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>${Number(l.raised_usd).toLocaleString()} raised</span>
              <span>{pct}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-1">
            {(l.tags ?? []).slice(0, 3).map((t) => (
              <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent transition-transform group-hover:translate-x-0.5">
            Details <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background/30 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-sm font-medium">{value}</div>
    </div>
  );
}
