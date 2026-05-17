"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const logo = "/cakey-logo.png";

const links = [
  { href: "/about", label: "About" },
  { href: "/#how", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/faq", label: "FAQ" },
  { href: "/waitlist", label: "Join waitlist" },
];

type DesktopItem = { href: string; label: string; description?: string };

const desktopPrimary: DesktopItem[] = [
  { href: "/about", label: "About" },
  { href: "/#features", label: "Features" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/faq", label: "FAQ" },
];

const desktopMore: DesktopItem[] = [
  { href: "/insurance", label: "Insurance", description: "On-chain protection pool" },
  { href: "/privacy", label: "Privacy", description: "How we handle your data" },
  { href: "/terms", label: "Terms", description: "Terms of service" },
  { href: "/disclosures", label: "Disclosures", description: "Risk and regulatory disclosures" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300",
            scrolled || open
              ? "border border-white/[0.10] bg-gradient-to-b from-white/[0.14] to-white/[0.07] backdrop-blur-[20px] saturate-[150%] shadow-[0_8px_30px_-12px_oklch(0_0_0/0.6)]"
              : "border border-transparent",
          )}
        >
          <a href="/" className="flex items-center gap-2.5">
            <span className="logo-coin-wrap">
              <img src={logo} alt="Cakey" className="logo-coin h-9 w-9 object-contain" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              Cakey<span className="text-accent">.ai</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {desktopPrimary.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-card/60 hover:text-foreground",
                  moreOpen ? "text-foreground bg-card/60" : "text-muted-foreground",
                )}
              >
                More
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform duration-200", moreOpen && "rotate-180")}
                />
              </button>
              {moreOpen && (
                <div
                  role="menu"
                  className="glass-strong absolute right-0 top-[calc(100%+8px)] w-64 rounded-2xl p-2 shadow-[0_20px_60px_-12px_oklch(0_0_0/0.8)]"
                >
                  {desktopMore.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex flex-col rounded-lg px-3 py-2 hover:bg-card/60"
                    >
                      <span className="text-sm font-medium text-foreground">{l.label}</span>
                      <span className="text-xs text-muted-foreground">{l.description}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/#waitlist"
              className="group relative hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-glow px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-12px_oklch(0.72_0.14_78/0.55)] transition-transform hover:scale-[1.02]"
            >
              Join waitlist
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/40 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="relative z-50 mt-2 rounded-2xl border border-border bg-popover p-4 shadow-[0_20px_60px_-12px_oklch(0_0_0/0.8)] md:hidden">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-card/60 hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="/#waitlist"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-glow px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Join waitlist →
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
