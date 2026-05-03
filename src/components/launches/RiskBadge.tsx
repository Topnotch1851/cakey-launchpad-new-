import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export type RiskTier = "low" | "moderate" | "elevated" | "unrated";

export function tierFor(score: number | null | undefined): RiskTier {
  if (score == null) return "unrated";
  if (score >= 80) return "low";
  if (score >= 60) return "moderate";
  return "elevated";
}

const TIER: Record<
  RiskTier,
  { label: string; classes: string; Icon: typeof ShieldCheck }
> = {
  low: {
    label: "Low risk",
    classes: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    Icon: ShieldCheck,
  },
  moderate: {
    label: "Moderate risk",
    classes: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    Icon: Shield,
  },
  elevated: {
    label: "Elevated risk",
    classes: "border-rose-400/40 bg-rose-400/10 text-rose-300",
    Icon: ShieldAlert,
  },
  unrated: {
    label: "Unrated",
    classes: "border-border bg-muted/30 text-muted-foreground",
    Icon: Shield,
  },
};

export function RiskBadge({
  score,
  size = "sm",
  showScore = true,
}: {
  score: number | null | undefined;
  size?: "sm" | "md";
  showScore?: boolean;
}) {
  const tier = tierFor(score);
  const meta = TIER[tier];
  const Icon = meta.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wider",
        meta.classes,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
      )}
      aria-label={`${meta.label}${score != null ? `, score ${score} of 100` : ""}`}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      <span>{meta.label}</span>
      {showScore && score != null && (
        <span className="font-mono font-medium opacity-80">· {score}</span>
      )}
    </span>
  );
}
