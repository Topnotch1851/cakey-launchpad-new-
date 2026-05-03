"use client";

import { motion } from "framer-motion";
import { Brain, FlaskConical, Lock, ShieldCheck, Radar } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { cn } from "@/lib/utils";

type Accent = "purple" | "cyan";

interface FeatureStat {
  value: string;
  label: string;
  trend?: string;
}

interface Feature {
  icon: typeof Brain;
  title: string;
  body: string;
  accent: Accent;
  hero: FeatureStat;
  sub?: FeatureStat[];
}

const features: Feature[] = [
  {
    icon: Brain,
    title: "Behavioral Trust Score",
    body: "Wallet-level reputation built from on-chain history. Detect repeat offenders before they ever list.",
    accent: "purple",
    hero: { value: "12k+", label: "Wallets scored", trend: "+18% this week" },
    sub: [
      { value: "98%", label: "Detection accuracy" },
      { value: "340", label: "Repeat offenders flagged" },
    ],
  },
  {
    icon: FlaskConical,
    title: "Simulation Engine",
    body: "Model whale behavior, slippage, and liquidity shocks before a single token moves.",
    accent: "cyan",
    hero: { value: "10M+", label: "Scenarios run", trend: "Per launch" },
    sub: [
      { value: "<2s", label: "Avg simulation" },
      { value: "24", label: "Risk vectors" },
    ],
  },
  {
    icon: Lock,
    title: "Proof of Commitment",
    body: "On-chain locks and collateral with penalty logic that punishes early exits.",
    accent: "purple",
    hero: { value: "100%", label: "Funds on-chain", trend: "Non-custodial" },
    sub: [
      { value: "0", label: "Custody breaches" },
      { value: "12mo", label: "Max lock window" },
    ],
  },
  {
    icon: Radar,
    title: "Real-time Monitoring",
    body: "Continuous surveillance of liquidity flows and suspicious wallets after launch.",
    accent: "cyan",
    hero: { value: "24/7", label: "Active surveillance", trend: "Cross-chain" },
    sub: [
      { value: "<400ms", label: "Alert latency" },
      { value: "5", label: "Chains covered" },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Insurance Pool",
    body: "A shared safety net funded by protocol fees, with transparent on-chain claim logic.",
    accent: "purple",
    hero: { value: "$2.4M", label: "Pool reserves", trend: "Auto-replenishing" },
    sub: [
      { value: "0", label: "Claims pending" },
      { value: "100%", label: "On-chain transparency" },
    ],
  },
];

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Capabilities"
        title={
          <>
            Built for an <span className="text-gradient">institutional standard.</span>
          </>
        }
        description="Every system works together — intelligence, enforcement, and protection in a single launch stack."
      />

      <div className="mt-12 space-y-12 sm:mt-20 sm:space-y-16 lg:space-y-24">
        {features.map((f, i) => (
          <FeatureRow key={f.title} feature={f} index={i} />
        ))}
      </div>
    </Section>
  );
}

function FeatureRow({ feature, index }: { feature: Feature; index: number }) {
  const reverse = index % 2 === 1;
  const accentText = feature.accent === "cyan" ? "text-accent" : "text-primary-glow";
  const accentBg = feature.accent === "cyan" ? "bg-accent/15" : "bg-primary/15";
  const accentGlow =
    feature.accent === "cyan"
      ? "radial-gradient(600px circle at 50% 50%, oklch(0.82 0.16 210 / 0.18), transparent 70%)"
      : "radial-gradient(600px circle at 50% 50%, oklch(0.62 0.22 295 / 0.20), transparent 70%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-14",
        reverse && "md:[&>*:first-child]:order-2",
      )}
    >
      {/* Visual / stats panel */}
      <div className="relative">
        <div className="glass relative overflow-hidden rounded-2xl p-5 sm:p-8 sm:aspect-[16/10]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-80"
            style={{ background: accentGlow }}
          />
          <div className="relative flex h-full flex-col justify-between gap-6 sm:gap-0">
            <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
              <span className="inline-flex items-center gap-2">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    feature.accent === "cyan" ? "bg-accent" : "bg-primary-glow",
                  )}
                  style={{
                    boxShadow:
                      feature.accent === "cyan"
                        ? "0 0 10px var(--cyan)"
                        : "0 0 10px var(--primary)",
                  }}
                />
                Live
              </span>
              <span className="tabular-nums">0{index + 1} / 0{features.length}</span>
            </div>

            <div>
              <div
                className={cn(
                  "font-display text-5xl font-semibold tabular-nums leading-none break-words sm:text-6xl lg:text-7xl",
                  accentText,
                )}
              >
                {feature.hero.value}
              </div>
              <div className="mt-3 text-sm font-medium text-foreground">
                {feature.hero.label}
              </div>
              {feature.hero.trend && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {feature.hero.trend}
                </div>
              )}
            </div>

            {feature.sub && (
              <div className="grid grid-cols-2 gap-3 border-t border-border/50 pt-4">
                {feature.sub.map((s) => (
                  <div key={s.label} className="min-w-0">
                    <div
                      className={cn(
                        "font-display text-xl font-semibold tabular-nums leading-tight break-words sm:text-2xl",
                        accentText,
                      )}
                    >
                      {s.value}
                    </div>
                    <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text panel */}
      <div className="max-w-xl">
        <div
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-border",
            accentBg,
            accentText,
          )}
        >
          <feature.icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold leading-tight sm:mt-5 sm:text-3xl lg:text-4xl">
          {feature.title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
          {feature.body}
        </p>
      </div>
    </motion.div>
  );
}
