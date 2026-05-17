import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

type FeatureContent = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  hero: string;
  highlights: { label: string; value: string }[];
  bullets: string[];
  cta?: { href: string; label: string };
};

const FEATURES: Record<string, FeatureContent> = {
  "trust-score": {
    eyebrow: "Behavioral Trust Score",
    title: "Wallet-level reputation,",
    titleAccent: "engineered for launches.",
    description:
      "Every wallet on Cakey carries a quantitative trust score derived from on-chain history. Repeat offenders are flagged before they can list, and high-integrity wallets earn priority access.",
    hero: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      { label: "Wallets scored", value: "12k+" },
      { label: "Detection accuracy", value: "98%" },
      { label: "Risk vectors", value: "24" },
    ],
    bullets: [
      "On-chain history analyzed across Ethereum, Base, Arbitrum, Polygon and Solana",
      "Composite score combining liquidity behavior, holding patterns, and rug history",
      "Score updates in real-time as wallets move funds",
      "Public scorecard available for every project team wallet",
    ],
  },
  simulation: {
    eyebrow: "Simulation Engine",
    title: "Stress-test launches",
    titleAccent: "before any token moves.",
    description:
      "Our simulation engine models whale behavior, slippage shocks, and liquidity drains across thousands of scenarios — exposing fragile launches before they go live.",
    hero: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      { label: "Scenarios per launch", value: "10M+" },
      { label: "Risk vectors", value: "24" },
      { label: "Run time", value: "<2s" },
    ],
    bullets: [
      "Whale concentration and dump simulations across 30 days",
      "Liquidity curve stress tests under extreme volume",
      "Vesting cliff risk scoring against historical post-launch behavior",
      "Public simulation report attached to every approved launch",
    ],
  },
  "proof-of-commitment": {
    eyebrow: "Proof of Commitment",
    title: "On-chain locks",
    titleAccent: "that punish early exits.",
    description:
      "Project teams commit collateral and accept lock periods enforced by smart contracts. Early exits trigger automatic penalties — making rug pulls financially irrational.",
    hero: "https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      { label: "Custody breaches", value: "0" },
      { label: "Non-custodial", value: "100%" },
      { label: "Lock window", value: "Up to 12mo" },
    ],
    bullets: [
      "Smart contract escrow with transparent on-chain proof",
      "Configurable lock windows from 30 days to 12 months",
      "Automatic slashing on early exit attempts",
      "Public dashboard tracking every team's lock status",
    ],
  },
  monitoring: {
    eyebrow: "Real-time Monitoring",
    title: "24/7 cross-chain",
    titleAccent: "post-launch surveillance.",
    description:
      "After launch, Cakey continuously watches liquidity flows and suspicious wallet activity. Anomalies trigger alerts within milliseconds — giving investors a real chance to react.",
    hero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      { label: "Chains covered", value: "5" },
      { label: "Alert latency", value: "<400ms" },
      { label: "Coverage", value: "24/7" },
    ],
    bullets: [
      "Liquidity drain detection with millisecond alerting",
      "Suspicious wallet clustering across post-launch trades",
      "Live anomaly feed visible to every project investor",
      "Automated insurance pool triggers on confirmed exploits",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(FEATURES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const f = FEATURES[slug];
  if (!f) return { title: "Feature not found" };
  const canonical = `/features/${slug}`;
  return {
    title: f.eyebrow,
    description: f.description,
    alternates: { canonical },
    openGraph: {
      title: `${f.eyebrow} — Cakey AI`,
      description: f.description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${f.eyebrow} — Cakey AI`,
      description: f.description,
    },
  };
}

export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = FEATURES[slug];
  if (!feature) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <section className="relative isolate pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />

        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <Link
            href="/#features"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to features
          </Link>

          <div className="mt-8 flex flex-col gap-5">
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent backdrop-blur sm:w-auto sm:justify-start">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--cyan)]" />
              {feature.eyebrow}
            </span>
            <h1 className="text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              {feature.title} <span className="text-gradient">{feature.titleAccent}</span>
            </h1>
            <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              {feature.description}
            </p>
          </div>

          <div
            className="mt-12 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-cover bg-center"
            style={{ backgroundImage: `url(${feature.hero})` }}
            role="img"
            aria-label={feature.eyebrow}
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {feature.highlights.map((h) => (
              <div
                key={h.label}
                className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur"
              >
                <div className="font-display text-3xl font-semibold text-gradient">{h.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {h.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-3">
            <h2 className="font-display text-2xl font-semibold">What it does</h2>
            <ul className="mt-2 space-y-3">
              {feature.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm sm:text-base">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-foreground/90">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <a
              href="/#waitlist"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_20px_60px_-20px_var(--primary)] transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Join the waitlist
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/#features"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/40 px-6 py-3.5 text-sm font-medium text-foreground hover:bg-card/60 sm:w-auto"
            >
              See all features
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
