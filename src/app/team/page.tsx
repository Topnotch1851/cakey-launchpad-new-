"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  Loader2,
  Briefcase,
  ArrowRight,
  Lock,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useIsAdmin } from "@/features/auth/hooks/useIsAdmin";
import { useMyApplications, type Application } from "@/features/team/hooks/useMyApplications";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, { label: string; classes: string }> = {
  submitted: { label: "Submitted", classes: "border-sky-400/40 bg-sky-400/10 text-sky-300" },
  under_review: { label: "Under review", classes: "border-amber-400/40 bg-amber-400/10 text-amber-300" },
  approved: { label: "Approved", classes: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" },
  rejected: { label: "Rejected", classes: "border-rose-400/40 bg-rose-400/10 text-rose-300" },
};

export default function TeamPage() {
  const { user } = useAuth();
  const { isAdmin, checking } = useIsAdmin(user?.id);
  const router = useRouter();
  // Frontend-only: allow page render in preview without an authed user.
  const { data: apps = [], isPending: fetching, error } = useMyApplications(true);

  useEffect(() => {
    if (!checking && isAdmin) router.push("/admin");
  }, [checking, isAdmin, router]);

  if (checking || isAdmin) return null;

  return (
    <DashboardShell
      eyebrow="Project team"
      title="My projects"
      description={`Applications submitted with ${user?.email ?? "your account"} appear here. Track vetting and launch milestones.`}
      actions={
        <Link
          href="/apply"
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          New application <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <div className="space-y-6">
        {fetching ? (
          <div className="glass flex items-center justify-center rounded-2xl p-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-6 text-sm text-rose-300">
            Something went wrong loading your projects.
          </div>
        ) : apps.length === 0 ? (
          <EmptyState />
        ) : (
          apps.map((a: Application) => <ApplicationCard key={a.id} app={a} />)
        )}
      </div>
    </DashboardShell>
  );
}

function ApplicationCard({ app }: { app: Application }) {
  const meta = STATUS_LABEL[app.status] ?? STATUS_LABEL.submitted;
  const milestones = mockMilestones(app.status);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold">{app.project_name}</h2>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                meta.classes,
              )}
            >
              {meta.label}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>
              {app.token_symbol ?? "—"} · {app.token_chain ?? "—"}
            </span>
            <span>·</span>
            <span>
              Submitted{" "}
              {new Date(app.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span className="font-mono">Code: {app.tracking_code}</span>
          </div>
          {app.status_note && (
            <p className="mt-3 rounded-lg border border-border bg-background/30 px-3 py-2 text-xs text-muted-foreground">
              {app.status_note}
            </p>
          )}
        </div>
        <Link
          href={`/status?code=${encodeURIComponent(app.tracking_code)}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-background/40 px-3 py-1.5 text-xs font-medium hover:border-accent/40 hover:text-accent"
        >
          View timeline <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <div className="font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Commitment milestones
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {milestones.map((m) => {
            const Icon = m.done ? CheckCircle2 : Circle;
            return (
              <li
                key={m.label}
                className="flex items-start gap-2.5 rounded-lg border border-border bg-background/30 p-3"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                    m.done ? "bg-emerald-400/10 text-emerald-300" : "bg-muted/30 text-muted-foreground",
                  )}
                >
                  <m.icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {m.label}
                    <Icon
                      className={cn("h-3.5 w-3.5", m.done ? "text-emerald-400" : "text-muted-foreground/50")}
                    />
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{m.detail}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border">
        <Briefcase className="h-6 w-6 text-accent" />
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold">No applications yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Submit your project to start the vetting and listing process.
      </p>
      <Link
        href="/apply"
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Apply to launch <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function mockMilestones(status: string) {
  const approved = status === "approved";
  const reviewing = status === "under_review" || approved;
  return [
    { label: "Application reviewed", detail: "Initial vetting and contact verification.", icon: Briefcase, done: reviewing },
    { label: "Smart contract audit", detail: "Automated audit pipeline before listing.", icon: ShieldCheck, done: approved },
    { label: "Liquidity lock configured", detail: "On-chain lock for the duration of vesting.", icon: Lock, done: approved },
    { label: "Collateral staked", detail: "Optional team collateral with exit penalties.", icon: Coins, done: false },
  ];
}
