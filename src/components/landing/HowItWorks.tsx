"use client";

import { FileCheck2, ShieldCheck, Lock, Activity } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

const concerns = [
  "Is this project actually legit?",
  "Will the team rug after launch?",
  "Is liquidity locked on-chain?",
  "Who audited the smart contract?",
  "Has the developer shipped before?",
  "What happens if something goes wrong?",
  "How do I recover a lost investment?",
  "Is the tokenomics sustainable?",
  "Can insiders dump on retail?",
  "Is this just another meme pump?",
  "Who holds the majority supply?",
  "How is post-launch activity monitored?",
];

const steps = [
  {
    n: "01",
    title: "Project applies",
    body: "Teams submit project details, wallets, and tokenomics. Cakey runs initial vetting.",
    icon: FileCheck2,
  },
  {
    n: "02",
    title: "AI risk scoring",
    body: "Behavioral models analyse developer history. The simulation engine stress-tests the launch.",
    icon: ShieldCheck,
  },
  {
    n: "03",
    title: "Commitment locked",
    body: "Liquidity is locked on-chain and optional collateral is staked before going live.",
    icon: Lock,
  },
  {
    n: "04",
    title: "Launch & monitor",
    body: "Investors participate with confidence. Real-time monitoring guards against post-launch foul play.",
    icon: Activity,
  },
];

export function HowItWorks() {
  const third = Math.ceil(concerns.length / 3);
  const m1 = concerns.slice(0, third);
  const m2 = concerns.slice(third, third * 2);
  const m3 = concerns.slice(third * 2);

  return (
    <section id="how" className="relative pt-20 sm:pt-32">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex max-w-3xl flex-col items-start space-y-5 text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--cyan)]" />
            How it works
          </span>
          <h2 className="text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            From application to <span className="text-gradient">protected launch.</span>
          </h2>
          <p className="max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            Every investor asks the same questions before aping in. Cakey answers them — on-chain,
            before any project goes live.
          </p>
        </div>
      </div>

      <div className="relative mt-12 w-full overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent sm:w-40" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent sm:w-40" />

        <div className="flex flex-col gap-1">
          <Marquee className="[--duration:45s] [--gap:0.75rem]" repeat={4}>
            {m1.map((q) => (
              <span
                key={q}
                className="inline-flex items-center whitespace-nowrap rounded-none border border-border bg-card/60 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur"
              >
                {q}
              </span>
            ))}
          </Marquee>

          <Marquee className="[--duration:50s] [--gap:0.75rem]" repeat={4} reverse>
            {m2.map((q) => (
              <span
                key={q}
                className="inline-flex items-center whitespace-nowrap rounded-none border border-accent/20 bg-accent/5 px-3 py-1.5 text-sm text-foreground/80 backdrop-blur"
              >
                {q}
              </span>
            ))}
          </Marquee>

          <Marquee className="[--duration:42s] [--gap:0.75rem]" repeat={4}>
            {m3.map((q) => (
              <span
                key={q}
                className="inline-flex items-center whitespace-nowrap rounded-none border border-border bg-card/60 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur"
              >
                {q}
              </span>
            ))}
          </Marquee>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">

        <div className="mt-16 grid grid-cols-1 divide-dashed divide-border border-t border-dashed border-border sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.n}
                className="flex flex-col gap-5 px-6 py-10 lg:px-8 lg:py-12"
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-10 text-accent" strokeWidth={1.5} />
                  <span className="font-display text-xs tracking-[0.25em] text-muted-foreground">
                    STEP {s.n}
                  </span>
                </div>
                <div className="flex flex-col gap-2 pt-10 lg:pt-16">
                  <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
