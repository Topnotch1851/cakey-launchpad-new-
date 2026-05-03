import { Brain, FlaskConical, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskBadge, tierFor } from "./RiskBadge";

type Pillar = {
  key: "behavioral" | "simulation" | "commitment" | "insurance";
  label: string;
  detail: string;
  icon: typeof Brain;
  score: number;
};

/**
 * Mock pillar breakdown derived deterministically from the trust score.
 * When real per-pillar scoring lands, swap this for server-provided values.
 */
function mockBreakdown(trustScore: number | null | undefined): Pillar[] {
  const base = trustScore ?? 50;
  const j = (offset: number) => Math.max(0, Math.min(100, base + offset));
  return [
    {
      key: "behavioral",
      label: "Behavioral Trust Score",
      detail: "Developer wallet history, prior project credibility.",
      icon: Brain,
      score: j(2),
    },
    {
      key: "simulation",
      label: "Pre-Launch Simulation",
      detail: "Liquidity, whale impact, and tokenomics stress test.",
      icon: FlaskConical,
      score: j(-4),
    },
    {
      key: "commitment",
      label: "Proof of Commitment",
      detail: "Liquidity locks, collateral, and exit penalties.",
      icon: Lock,
      score: j(6),
    },
    {
      key: "insurance",
      label: "Insurance Coverage",
      detail: "Protection pool allocation for this launch.",
      icon: ShieldCheck,
      score: j(-2),
    },
  ];
}

export function RiskBreakdown({
  trustScore,
}: {
  trustScore: number | null | undefined;
}) {
  const pillars = mockBreakdown(trustScore);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Risk profile
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Composite of four protection pillars. Higher is safer.
          </p>
        </div>
        <RiskBadge score={trustScore ?? null} size="md" />
      </div>

      <ul className="space-y-3">
        {pillars.map((p) => {
          const tier = tierFor(p.score);
          const bar =
            tier === "low"
              ? "bg-emerald-400"
              : tier === "moderate"
                ? "bg-amber-400"
                : tier === "elevated"
                  ? "bg-rose-400"
                  : "bg-muted-foreground/40";
          return (
            <li
              key={p.key}
              className="rounded-xl border border-border bg-background/30 p-3"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border">
                  <p.icon className="h-4 w-4 text-accent" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-sm font-medium text-foreground">
                      {p.label}
                    </div>
                    <div className="font-mono text-xs tabular-nums text-muted-foreground">
                      {p.score}/100
                    </div>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.detail}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/40">
                    <div
                      className={cn("h-full transition-all", bar)}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Scores are produced by Cakey's AI trust engine and updated continuously.
        They are guidance, not financial advice.
      </p>
    </div>
  );
}
