"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ContractPill } from "./ContractPill";

const easeCinematic = [0.22, 1, 0.36, 1] as const;

const logo = "/cakey-logo.png";

const explore = [
  { label: "About", href: "/about" },
  { label: "How it works", href: "/#how" },
  { label: "Features", href: "/#features" },
  { label: "Roadmap", href: "/#roadmap" },
  { label: "FAQ", href: "/faq" },
  { label: "Insurance", href: "/insurance" },
  { label: "Join waitlist", href: "/waitlist" },
];

const legal: { label: string; to: string }[] = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
  { label: "Disclosures", to: "/disclosures" },
];

const socials: { label: string; href: string; external: boolean }[] = [
  { label: "Twitter", href: "https://x.com/tokencakey?s=21", external: true },
  { label: "Telegram", href: "https://t.me/CAKEYTOKENCOMMUNITY", external: true },
  { label: "Website", href: "https://cakey-crypto-website-ww45.bolt.host", external: true },
];

const chains: { name: string; color: string }[] = [
  { name: "Ethereum", color: "#627EEA" },
  { name: "Base", color: "#0052FF" },
  { name: "Solana", color: "#14F195" },
  { name: "Arbitrum", color: "#28A0F0" },
  { name: "Polygon", color: "#8247E5" },
  { name: "BNB", color: "#F3BA2F" },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-border/60">
      {/* Ambient glow. barely-there gold accent against pure-black floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-56 opacity-[0.08] blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-20" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* CTA band */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.75, ease: easeCinematic }}
          className="glass relative mt-12 overflow-hidden rounded-3xl p-8 sm:p-12"
        >
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.08] blur-3xl"
            style={{ background: "var(--gradient-brand)" }}
          />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
                Limited spots
              </div>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Launch with <span className="text-accent">trust</span> baked in.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Join early access and get priority allocation, behavioral trust scoring, and rug-pull protection from day one.
              </p>
            </div>
            <Link
              href="/#waitlist"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-glow px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_14px_40px_-22px_oklch(0.72_0.14_78/0.5)] transition-[transform,background-color,box-shadow] duration-[180ms] ease-[var(--ease-out-strong)] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              Join the waitlist
            </Link>
          </div>
        </motion.div>

        {/* Link grid */}
        <div className="mt-16 grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- small static logo, next/image optimisation is overkill for a 96×96 PNG that's already in /public */}
              <img src={logo} alt="Cakey" className="h-12 w-12 object-contain" />
              <span className="font-display text-xl font-semibold tracking-tight">
                Cakey<span className="text-accent">.ai</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              The AI-powered Web3 launchpad ending rug pulls through behavioral trust scoring, pre-launch simulation, and a built-in insurance pool.
            </p>
          </div>

          <FooterCol title="Explore">
            {explore.map((l) => (
              <Link key={l.href} href={l.href} className="footer-link">
                {l.label}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title="Legal">
            {legal.map((l) => (
              <Link key={l.to} href={l.to} className="footer-link">
                {l.label}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title="Community">
            {socials.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="footer-link inline-flex items-center gap-1"
              >
                {l.label}
                <ArrowUpRight className="h-3 w-3 opacity-60" />
              </a>
            ))}
          </FooterCol>
        </div>

        {/* Built on / contract */}
        <div className="mt-14 grid gap-6 border-t border-border/60 pt-8 sm:grid-cols-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80">
              Built on
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {chains.map((c) => (
                <span
                  key={c.name}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs text-foreground/90 backdrop-blur"
                >
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full"
                    style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }}
                  />
                  {c.name}
                </span>
              ))}
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80">
              Contract
            </div>
            <ContractPill
              symbol="$CKY"
              address="0xeE06A9C439446b360520f049Eec2E43B52674444"
              status="LIVE"
            />
          </div>
        </div>

        {/* Base bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Cakey AI. Intelligent trust for token launches.</div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/disclosures" className="hover:text-foreground transition-colors">Disclosures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80">
        {title}
      </div>
      <div className="mt-4 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}
