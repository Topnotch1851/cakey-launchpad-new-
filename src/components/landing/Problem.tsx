"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, EyeOff } from "lucide-react";

const easeCinematic = [0.22, 1, 0.36, 1] as const;

const issues = [
  {
    idx: "01",
    icon: AlertTriangle,
    stat: "$2.8B+",
    label: "Lost to rug pulls",
    body: "Investors funneled billions into token launches with no vetting, no accountability, and no recourse when teams disappeared.",
  },
  {
    idx: "02",
    icon: TrendingDown,
    stat: "70%+",
    label: "Of launches fail within months",
    body: "Most launchpad projects collapse quickly. There's no simulation of liquidity, whales, or tokenomics before going live.",
  },
  {
    idx: "03",
    icon: EyeOff,
    stat: "0",
    label: "Real-time monitoring today",
    body: "Once a token lists, suspicious wallet activity and liquidity drains go unnoticed until it's already too late.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: easeCinematic }}
            className="max-w-xl"
          >
            <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-warn/30 bg-warn/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-warn backdrop-blur sm:w-auto sm:justify-start">
              <span className="h-1.5 w-1.5 rounded-full bg-warn shadow-[0_0_8px_oklch(0.7_0.16_38/0.5)]" />
              The trust crisis
            </span>
            <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              Launchpads are <span className="text-warn">broken.</span>
            </h2>
            <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
              Web3 fundraising runs on hype, not evidence. Investors carry all the risk while bad
              actors walk away.
            </p>
            <div className="mt-8 hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground lg:flex">
              <span className="h-px w-10 bg-border" />
              By the numbers
            </div>
          </motion.div>

          <div className="divide-y divide-border border-y border-border">
            {issues.map((it, i) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: easeCinematic }}
                className="group grid grid-cols-[auto_1fr] items-start gap-6 py-8 sm:grid-cols-[80px_1fr_auto] sm:gap-8"
              >
                <div className="font-display text-xs tracking-[0.25em] text-muted-foreground">
                  {it.idx}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-5xl font-semibold text-warn sm:text-6xl">
                    {it.stat}
                  </div>
                  <div className="mt-2 font-display text-lg font-semibold text-foreground">
                    {it.label}
                  </div>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {it.body}
                  </p>
                </div>
                <div className="col-span-2 hidden shrink-0 sm:col-span-1 sm:flex">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-warn/30 bg-warn/10 text-warn transition-transform group-hover:rotate-6">
                    <it.icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
