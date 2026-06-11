"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Coins, FileWarning, AlertCircle } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

// Pool isn't live yet (see PRD §6.3. design is still open).  Showing fake
// dollar reserves with a disclaimer is still misleading.  Describe how the
// pool is designed to work instead, and swap in real figures once the
// contract is deployed and audited.
const stats = [
  { label: "Funding source", value: "Protocol fees", trend: "Auto-routed" },
  { label: "Coverage scope", value: "Vetted launches", trend: "Per-launch caps" },
  { label: "Payout rail", value: "On-chain", trend: "Direct to wallet" },
];

const steps = [
  {
    icon: Coins,
    title: "Fees fund the pool",
    body: "A fixed share of platform fees is auto-routed to the protection pool on every successful launch.",
  },
  {
    icon: FileWarning,
    title: "Claim is filed",
    body: "If a covered failure event is triggered (e.g. liquidity drained, lock breached), affected wallets file a claim.",
  },
  {
    icon: ShieldCheck,
    title: "Review and payout",
    body: "Claim is evaluated against on-chain evidence and the pool's coverage rules. Approved payouts are settled directly to wallets.",
  },
];

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-28">
        <section className="relative isolate overflow-hidden pb-12">
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40" />

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/45">
                Protection layer
              </div>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
                A safety net for <span className="text-gradient">every launch.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                The Cakey Insurance Pool is a shared protection layer funded by
                platform fees. It compensates investors when a vetted project
                still suffers a covered failure. turning a personal loss into a
                shared, bounded one.
              </p>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                  className="glass rounded-2xl p-5"
                >
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className="mt-1 font-display text-3xl font-semibold text-gradient">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.trend}</div>
                </motion.div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              The protection pool is in design (PRD §6.3). not yet live. Final
              parameters, audited contract, and reserve figures will be published
              before launch.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">How compensation works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-border">
                    <s.icon className="h-5 w-5 text-accent" />
                  </span>
                  <span className="font-display text-xs tracking-[0.2em] text-muted-foreground">
                    STEP {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
              style={{ background: "var(--gradient-brand)" }}
            />
            <div className="relative flex items-start gap-4">
              <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/30">
                <AlertCircle className="h-5 w-5 text-amber-300" />
              </span>
              <div>
                <div className="font-display text-xs uppercase tracking-[0.2em] text-amber-300">
                  Open design decision
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
                  The final pool model is being defined with the community.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Smart-contract pool vs. managed treasury. Automated payouts
                  vs. multisig review. Facilitator scope vs. guarantor scope.
                  These choices shape risk, speed, and accountability. and
                  they&apos;re being shaped in the open before the protection layer
                  goes live.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href="/disclosures"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/40 px-4 py-2 text-sm font-medium text-foreground transition-[transform,color,border-color,background-color] duration-[180ms] ease-[var(--ease-out-strong)] hover:border-accent/40 hover:text-accent active:scale-[0.98]"
                  >
                    Read disclosures
                  </Link>
                  <Link
                    href="/waitlist"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-[transform,background-color] duration-[180ms] ease-[var(--ease-out-strong)] hover:bg-primary-glow active:scale-[0.98]"
                  >
                    Get notified when live
                  </Link>
                  <span
                    aria-disabled="true"
                    className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-xl border border-border/60 bg-background/30 px-4 py-2 text-sm font-medium text-muted-foreground"
                    title="Claims open after the protection pool launches"
                  >
                    File a claim
                    <span className="rounded-full border border-border/60 bg-card/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Soon
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
