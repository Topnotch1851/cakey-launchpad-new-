"use client";

import { motion } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";
import ShaderBackground from "@/components/ui/shader-background";

export function Hero() {
  const track = useAnalytics();
  return (
    <section id="top" className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24">
      {/* Background glows */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      {/* Shader sits in the bottom half, softly faded at top so hero text stays readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%]"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
        }}
      >
        <ShaderBackground className="origin-center scale-[1.8] opacity-70 sm:scale-100" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-balance font-display text-[3.25rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Launch tokens with{" "}
            <span className="text-gradient">intelligent trust.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-8 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl"
          >
            No rugs. No noise. Just launches that earn trust.
          </motion.p>

          <motion.div
            initial={{ y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="#waitlist"
              onClick={() => track("hero_cta_click", { target: "waitlist" })}
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_20px_60px_-20px_var(--primary)] transition-transform hover:scale-[1.02]"
            >
              Join the waitlist
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
