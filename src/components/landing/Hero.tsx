"use client";

import { motion } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";
import { HeroVisual } from "@/components/landing/HeroVisual";

const easeCinematic = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const track = useAnalytics();

  return (
    <section
      id="top"
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-black/[0.96]"
    >
      {/*
        Robot canvas. one transparent layer, no wrapper background.

        Mobile  : canvas anchored to the bottom and extended ~22% below the viewport.
                  Robot sits in the lower 2/3 of the screen with breathing room above for text.
        Desktop : canvas extended ~40% past the right edge while remaining left-anchored at 0.
                  Visible canvas spans the whole hero (so cursor events reach the robot anywhere),
                  but the canvas-center (where the robot lives) lands at ~70% of the viewport. clearly right of the 55% text column.
      */}
      <div
        aria-hidden="true"
        className="
          absolute z-0
          inset-x-0 top-[6%] bottom-[-22%]
          md:inset-y-0 md:right-[-40%]
        "
      >
        <HeroVisual className="h-full w-full" />
      </div>

      {/*
        Text layer. sits directly on the same canvas. No background, no surface.
        pointer-events-none allows the robot to receive cursor input through the text on desktop;
        CTAs re-enable pointer-events to stay clickable.
      */}
      <div
        className="
          pointer-events-none relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start justify-end
          min-h-[100svh] px-6 pt-28 pb-10
          md:px-10 md:pb-16
          lg:px-16 lg:pb-20
        "
      >
        <div className="max-w-md md:max-w-[52%]">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: easeCinematic }}
            className="text-balance font-display text-[2.1rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Launch tokens with{" "}
            <span className="text-accent">intelligent trust.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.28, ease: easeCinematic }}
            className="mt-5 max-w-xl text-pretty text-sm text-muted-foreground sm:text-lg"
          >
            On-chain trust scoring, commitment locks, real-time monitoring, and
            an insurance pool. built into every launch. No rugs. No noise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.42, ease: easeCinematic }}
            className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#waitlist"
              onClick={() => track("hero_cta_click", { target: "waitlist" })}
              className="pointer-events-auto group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-[transform,background-color,box-shadow] duration-[180ms] ease-[var(--ease-out-strong)] hover:bg-primary-glow active:scale-[0.98] sm:text-base"
            >
              Join the waitlist
            </a>
            <a
              href="#how"
              className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-medium text-foreground/90 backdrop-blur transition-[transform,background-color,border-color] duration-[180ms] ease-[var(--ease-out-strong)] hover:bg-white/[0.08] active:scale-[0.98] sm:text-base"
            >
              How it works
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
