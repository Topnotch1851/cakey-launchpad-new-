"use client";

import { motion } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type MilestoneStatus = "done" | "in_progress" | "planned";

type Milestone = {
  label: string;
  detail: string;
  status: MilestoneStatus;
};

type Phase = {
  phase: string;
  title: string;
  body: string;
  status: "active" | "next" | "planned";
  milestones: Milestone[];
};

const phases: Phase[] = [
  {
    phase: "Phase 01",
    title: "Foundation",
    body: "V2 stabilization, community consolidation through Floor Holders, and a manually vetted launchpad.",
    status: "active",
    milestones: [
      { label: "Landing & positioning", detail: "Public site, waitlist, product story.", status: "done" },
      { label: "Manual vetting structure", detail: "Internal review process for early projects.", status: "in_progress" },
      { label: "MVP launchpad", detail: "Wallet, listings, participation flow, admin dashboard.", status: "in_progress" },
    ],
  },
  {
    phase: "Phase 02",
    title: "AI Integration",
    body: "Smart contract AI auditing, project scoring engine, and a real-time risk alert system.",
    status: "next",
    milestones: [
      { label: "Intelligence layer (initial)", detail: "Rule-based risk scoring and analytics dashboard.", status: "planned" },
      { label: "Advanced AI systems", detail: "Behavioral wallet tracking, simulation engine.", status: "planned" },
      { label: "Smart contract auditor", detail: "Automated audit pipeline before listing approval.", status: "planned" },
    ],
  },
  {
    phase: "Phase 03",
    title: "Expansion",
    body: "Full AI automation, cross-chain compatibility, and institutional partnerships.",
    status: "planned",
    milestones: [
      { label: "Protection layer", detail: "Insurance pool, compensation, claim processing.", status: "planned" },
      { label: "Cross-chain rollout", detail: "Expand beyond the launch chain to new ecosystems.", status: "planned" },
      { label: "Institutional partnerships", detail: "Funds, custodians, and infra providers.", status: "planned" },
    ],
  },
];

const statusIcon = { done: Check, in_progress: Loader2, planned: Circle };
const statusColor: Record<MilestoneStatus, string> = {
  done: "text-accent border-accent/40 bg-accent/10",
  in_progress: "text-primary-glow border-primary/40 bg-primary/10",
  planned: "text-muted-foreground/70 border-border bg-background/40",
};

const progressPct = 25; // phase 01 in progress

export function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl text-left">
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent backdrop-blur sm:w-auto sm:justify-start">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_oklch(0.82_0.11_82/0.5)]" />
              Roadmap
            </span>
            <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              Shipping the <span className="text-accent">trust stack.</span>
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              Three product phases — each backed by concrete build milestones.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_oklch(0.82_0.11_82/0.5)] animate-glow-pulse" />
            Currently shipping Phase 01
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-12">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-card/60">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>Foundation</span>
            <span className="text-center">AI Integration</span>
            <span className="text-right">Expansion</span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {phases.map((p, i) => {
            const isActive = p.status === "active";
            return (
              <motion.article
                key={p.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={cn(
                  "relative flex flex-col rounded-3xl border p-7 backdrop-blur transition-colors",
                  isActive
                    ? "border-accent/30 bg-card/55 shadow-[0_0_0_1px_oklch(0.82_0.11_82/0.08),0_18px_50px_-30px_oklch(0.82_0.11_82/0.35)]"
                    : "border-border bg-card/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs tracking-[0.25em] text-accent">
                    {p.phase.toUpperCase()}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                      isActive
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : p.status === "next"
                          ? "border-primary/40 bg-primary/10 text-primary-glow"
                          : "border-border bg-background/40 text-muted-foreground",
                    )}
                  >
                    {isActive ? "In progress" : p.status === "next" ? "Up next" : "Planned"}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>

                <ul className="mt-6 space-y-3 border-t border-border/60 pt-5">
                  {p.milestones.map((m) => {
                    const Icon = statusIcon[m.status];
                    return (
                      <li key={m.label} className="flex items-start gap-3">
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            statusColor[m.status],
                          )}
                        >
                          <Icon
                            className={cn("h-3 w-3", m.status === "in_progress" && "animate-spin")}
                          />
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground">{m.label}</div>
                          <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {m.detail}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
