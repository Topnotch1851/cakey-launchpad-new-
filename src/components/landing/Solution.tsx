"use client";

import { motion } from "framer-motion";
import { Brain, FlaskConical, Lock, ShieldCheck } from "lucide-react";

const pillars = [
  {
    n: "01",
    icon: Brain,
    title: "Behavioral Trust Score",
    body: "AI scoring of developer wallet history — past projects, rug patterns, long-term credibility signals.",
    span: "lg:col-span-2 lg:row-span-2",
    feature: true,
  },
  {
    n: "02",
    icon: FlaskConical,
    title: "Pre-Launch Simulation",
    body: "Stress-test liquidity, whale impact, and tokenomics before a single token is sold.",
    span: "lg:col-span-2",
  },
  {
    n: "03",
    icon: Lock,
    title: "Proof of Commitment",
    body: "Mandatory liquidity locks, optional collateral, and penalties for early exits.",
    span: "lg:col-span-1",
  },
  {
    n: "04",
    icon: ShieldCheck,
    title: "Insurance Pool",
    body: "A shared protection layer funded by platform fees that compensates investors when projects fail.",
    span: "lg:col-span-1",
  },
];

export function Solution() {
  return (
    <section id="solution" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex max-w-3xl flex-col items-start gap-5 text-left">
          <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent backdrop-blur sm:w-auto sm:justify-start">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--cyan)]" />
            The Cakey approach
          </span>
          <h2 className="text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            Four pillars of <span className="text-gradient">protection.</span>
          </h2>
          <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            A unified intelligence and accountability layer between project teams and investors —
            enforced by smart contracts and AI.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card/40 p-6 backdrop-blur transition-colors hover:border-accent/40 sm:p-8 ${p.span}`}
            >
              {p.feature && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-60 blur-3xl"
                  style={{ background: "var(--gradient-brand)" }}
                />
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center justify-center rounded-2xl border border-border bg-background/50 ${
                      p.feature ? "h-14 w-14" : "h-11 w-11"
                    }`}
                  >
                    <p.icon className={p.feature ? "h-6 w-6 text-accent" : "h-5 w-5 text-accent"} />
                  </div>
                  <span className="font-display text-xs tracking-[0.25em] text-muted-foreground">
                    {p.n}
                  </span>
                </div>
                <h3
                  className={`mt-8 font-display font-semibold ${
                    p.feature ? "text-2xl sm:text-3xl" : "text-lg"
                  }`}
                >
                  {p.title}
                </h3>
                <p
                  className={`mt-3 leading-relaxed text-muted-foreground ${
                    p.feature ? "text-base" : "text-sm"
                  } ${p.feature ? "max-w-md" : ""}`}
                >
                  {p.body}
                </p>
                {p.feature && (
                  <div className="mt-auto flex items-center gap-2 pt-8 text-xs uppercase tracking-[0.2em] text-accent">
                    <span className="h-px w-8 bg-accent/50" />
                    Flagship intelligence layer
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
