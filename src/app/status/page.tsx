"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Loader2, CheckCircle2, Clock, XCircle, FileSearch } from "lucide-react";
import { getApplicationStatus, type ApplicationStatusRow } from "@/server/applications.functions";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { cn } from "@/lib/utils";

type StatusKey = "submitted" | "under_review" | "approved" | "rejected";

const STATUS_META: Record<
  StatusKey,
  { label: string; tone: string; icon: React.ComponentType<{ className?: string }>; desc: string }
> = {
  submitted: { label: "Submitted", tone: "border-sky-400/40 bg-sky-400/10 text-sky-300", icon: FileSearch, desc: "Your application has been received." },
  under_review: { label: "Under review", tone: "border-amber-400/40 bg-amber-400/10 text-amber-300", icon: Clock, desc: "Our team is reviewing tokenomics, team, and on-chain history." },
  approved: { label: "Approved", tone: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300", icon: CheckCircle2, desc: "Approved for launch. Expect contact from your launch manager." },
  rejected: { label: "Rejected", tone: "border-destructive/40 bg-destructive/10 text-destructive", icon: XCircle, desc: "We're unable to move forward at this time." },
};
const STEPS: StatusKey[] = ["submitted", "under_review", "approved"];

type StatusResp = Awaited<ReturnType<typeof getApplicationStatus>>;

export default function StatusPage() {
  const params = useSearchParams();
  const initialCode = params.get("code") ?? "";
  const [code, setCode] = useState(initialCode);
  const [data, setData] = useState<StatusResp | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (e?: React.FormEvent, codeOverride?: string) => {
    e?.preventDefault();
    const c = (codeOverride ?? code).trim();
    if (!c) return;
    setBusy(true);
    setError(null);
    try {
      const res = await getApplicationStatus({ data: { code: c } });
      if (!res.ok) setError(("error" in res ? res.error : null) ?? "Lookup failed");
      setData(res);
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (initialCode) void lookup(undefined, initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const status: ApplicationStatusRow | null = data && data.ok ? data.status : null;
  const meta = status ? STATUS_META[status.status as StatusKey] : null;
  const stepIdx = status ? STEPS.indexOf(status.status as StatusKey) : -1;
  const isRejected = status?.status === "rejected";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <section className="relative isolate pt-32 pb-24">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />

        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>

          <div className="mt-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              <FileSearch className="h-3 w-3" /> Application status
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
              Track your <span className="text-gradient">submission</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Enter the tracking code you received after submitting your project application.
            </p>
          </div>

          <form onSubmit={lookup} className="glass mt-8 flex flex-col gap-2 rounded-2xl p-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. a1b2c3d4e5f6"
                className="w-full rounded-xl border border-border bg-background/40 py-3 pl-9 pr-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Look up
            </button>
          </form>
          {error && <p className="mt-3 text-center text-xs text-destructive">{error}</p>}

          {data && data.ok && !status && (
            <div className="glass mt-6 rounded-2xl p-6 text-center text-sm text-muted-foreground">
              No application found for that code.
            </div>
          )}

          {status && meta && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass mt-8 rounded-2xl p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold">{status.project_name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Submitted {new Date(status.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider", meta.tone)}>
                  <meta.icon className="h-3.5 w-3.5" />
                  {meta.label}
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">{meta.desc}</p>
              {status.status_note && (
                <div className="mt-3 rounded-xl border border-border bg-background/40 p-3 text-sm">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Note from team</span>
                  <p className="mt-1">{status.status_note}</p>
                </div>
              )}

              {!isRejected && (
                <div className="mt-8">
                  <div className="flex items-center">
                    {STEPS.map((s, i) => {
                      const m = STATUS_META[s];
                      const done = i <= stepIdx;
                      const current = i === stepIdx;
                      return (
                        <div key={s} className="flex flex-1 items-center">
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                                done
                                  ? "border-accent bg-accent/20 text-accent"
                                  : "border-border bg-background/40 text-muted-foreground",
                                current && "ring-4 ring-accent/20",
                              )}
                            >
                              <m.icon className="h-4 w-4" />
                            </div>
                            <div className={cn("mt-2 text-[11px] font-medium", done ? "text-foreground" : "text-muted-foreground")}>
                              {m.label}
                            </div>
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className={cn("mx-2 h-0.5 flex-1 rounded-full", i < stepIdx ? "bg-accent" : "bg-border")} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {Array.isArray(status.history) && status.history.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Updates
                  </h3>
                  <ol className="mt-3 space-y-2">
                    {[...status.history].reverse().map((h, i) => {
                      const hm = STATUS_META[(h.status as StatusKey)] ?? STATUS_META.submitted;
                      return (
                        <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-background/30 p-3">
                          <hm.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">{hm.label}</span>
                              <span className="text-[11px] text-muted-foreground">
                                {new Date(h.at).toLocaleString()}
                              </span>
                            </div>
                            {h.note && <p className="mt-0.5 text-xs text-muted-foreground">{h.note}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </motion.div>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Lost your code? Email <a className="underline" href="mailto:apply@cakey.ai">apply@cakey.ai</a>.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
