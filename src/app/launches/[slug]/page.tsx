"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Globe,
  AtSign,
  Send,
  FileText,
  Calendar,
  Coins,
  Star,
} from "lucide-react";
import { getLaunch, type LaunchDetail } from "@/server/launches.functions";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { RiskBreakdown } from "@/components/launches/RiskBreakdown";
import { RiskBadge } from "@/components/launches/RiskBadge";
import { cn } from "@/lib/utils";

const WATCHLIST_KEY = "cakey:watchlist";

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    live: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    upcoming: "border-sky-400/40 bg-sky-400/10 text-sky-300",
    ended: "border-muted-foreground/30 bg-muted/30 text-muted-foreground",
    cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
  };
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider", map[status])}>
      {status === "live" && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
      )}
      {status}
    </span>
  );
}

function fmtUsd(n: number | string | null | undefined) {
  if (n == null) return "—";
  return `$${Number(n).toLocaleString()}`;
}
function fmtDate(s: string | null) {
  return s ? new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";
}

export default function LaunchDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [l, setL] = useState<LaunchDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLaunch({ data: { slug } })
      .then((res) => setL(res.ok ? res.launch : null))
      .finally(() => setLoading(false));
  }, [slug]);

  const [watching, setWatching] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !l) return;
    try {
      const raw = window.localStorage.getItem(WATCHLIST_KEY);
      const list: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) setWatching(list.includes(l.slug));
    } catch {
      // ignore
    }
  }, [l]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="mx-auto max-w-3xl px-6 py-32 text-center text-muted-foreground">
          Loading launch…
        </main>
      </div>
    );
  }

  if (!l) {
    return (
      <div className="min-h-screen bg-background">
        <Nav />
        <main className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1 className="font-display text-3xl font-semibold">Launch not found</h1>
          <p className="mt-2 text-muted-foreground">
            This token sale doesn&apos;t exist or has been removed.
          </p>
          <Link href="/launches" className="mt-6 inline-flex items-center gap-2 text-accent hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to launches
          </Link>
        </main>
      </div>
    );
  }

  const pct =
    l.hard_cap_usd && l.raised_usd
      ? Math.min(100, Math.round((Number(l.raised_usd) / Number(l.hard_cap_usd)) * 100))
      : 0;

  const toggleWatch = () => {
    if (typeof window === "undefined") return;
    let list: string[] = [];
    try {
      const raw = window.localStorage.getItem(WATCHLIST_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      list = Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
    } catch {
      list = [];
    }
    const next = watching ? list.filter((s) => s !== l.slug) : [...list, l.slug];
    window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
    setWatching(!watching);
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <Link
            href="/launches"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All launches
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 font-display text-2xl font-bold">
                {l.project_name.slice(0, 1)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-3xl font-semibold sm:text-4xl">{l.project_name}</h1>
                  <StatusPill status={l.status} />
                </div>
                <p className="mt-1 text-muted-foreground">{l.tagline}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(l.tags ?? []).map((t: string) => (
                    <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <RiskBadge score={l.trust_score} size="md" />
              <button
                type="button"
                onClick={toggleWatch}
                aria-pressed={watching}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-colors",
                  watching
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-border bg-background/40 text-muted-foreground hover:border-accent/40 hover:text-accent",
                )}
              >
                <Star className={cn("h-3.5 w-3.5", watching && "fill-accent")} />
                {watching ? "Watching" : "Watch"}
              </button>
            </div>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Section title="About">
                <p className="text-sm leading-relaxed text-muted-foreground">{l.description}</p>
              </Section>

              <Section title="Tokenomics">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Field label="Symbol" value={l.token_symbol} icon={<Coins className="h-3.5 w-3.5" />} />
                  <Field label="Chain" value={l.token_chain} />
                  <Field label="Total supply" value={l.total_supply ? Number(l.total_supply).toLocaleString() : "—"} />
                  <Field label="Sale supply" value={l.sale_supply ? Number(l.sale_supply).toLocaleString() : "—"} />
                  <Field label="Price" value={l.price_usd ? `$${Number(l.price_usd)}` : "—"} />
                  <Field label="Hard cap" value={fmtUsd(l.hard_cap_usd)} />
                  <Field label="Raised" value={fmtUsd(l.raised_usd)} />
                  <Field label="Progress" value={`${pct}%`} />
                </div>
                {l.hard_cap_usd ? (
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted/40">
                    <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
                  </div>
                ) : null}
              </Section>

              <Section title="Schedule">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Starts" value={fmtDate(l.starts_at)} icon={<Calendar className="h-3.5 w-3.5" />} />
                  <Field label="Ends" value={fmtDate(l.ends_at)} icon={<Calendar className="h-3.5 w-3.5" />} />
                </div>
              </Section>
            </div>

            <aside className="space-y-6">
              <div className="glass rounded-2xl p-5">
                <RiskBreakdown trustScore={l.trust_score} />
              </div>
              <div className="glass rounded-2xl p-5">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Participate
                </h3>
                <Link
                  href="/early-access"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Get allocation
                </Link>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Allocation requires waitlist confirmation and a connected wallet.
                </p>
              </div>

              <Section title="Links">
                <div className="space-y-2">
                  {l.website && <ExtLink href={l.website} icon={<Globe className="h-4 w-4" />} label="Website" />}
                  {l.twitter && (
                    <ExtLink
                      href={`https://twitter.com/${l.twitter.replace("@", "")}`}
                      icon={<AtSign className="h-4 w-4" />}
                      label={l.twitter}
                    />
                  )}
                  {l.telegram && <ExtLink href={l.telegram} icon={<Send className="h-4 w-4" />} label="Telegram" />}
                  {l.whitepaper_url && (
                    <ExtLink href={l.whitepaper_url} icon={<FileText className="h-4 w-4" />} label="Whitepaper" />
                  )}
                  {!l.website && !l.twitter && !l.telegram && !l.whitepaper_url && (
                    <p className="text-xs text-muted-foreground">No links provided.</p>
                  )}
                </div>
              </Section>
            </aside>
          </div>
          <div className="h-24" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background/30 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-medium">{value}</div>
    </div>
  );
}

function ExtLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-lg border border-border bg-background/30 px-3 py-2 text-sm text-foreground transition-colors hover:border-accent/40 hover:text-accent"
    >
      {icon}
      <span className="truncate">{label}</span>
    </a>
  );
}
