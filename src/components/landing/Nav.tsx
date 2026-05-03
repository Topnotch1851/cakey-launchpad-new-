"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useIsAdmin } from "@/features/auth/hooks/useIsAdmin";
import { useAudience } from "@/features/audience/hooks/useAudience";

const logo = "/cakey-logo.png";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/#waitlist", label: "Join waitlist" },
];

const routeLinks = [
  { to: "/launches", label: "Browse launches" },
  { to: "/insurance", label: "Insurance" },
  { to: "/auth", label: "Sign in" },
];

type DesktopItem = { to?: string; href?: string; label: string; description?: string };

const desktopPrimary: DesktopItem[] = [
  { to: "/launches", label: "Browse launches" },
  { href: "/#how", label: "How it works" },
  { to: "/insurance", label: "Insurance" },
];

const desktopMore: DesktopItem[] = [
  { href: "/#features", label: "Features", description: "What makes Cakey different" },
  { href: "/#roadmap", label: "Roadmap", description: "What's shipping next" },
  { to: "/apply", label: "Launch your project", description: "For founders raising on Cakey" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin(user?.id);
  const { audience } = useAudience();
  const dashboardHref = audience === "founder" ? "/team" : "/portfolio";

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
              ? "bg-gradient-to-b from-white/[0.12] to-white/[0.06] backdrop-blur-[24px] saturate-[150%] border-white/[0.08] shadow-[0_8px_30px_-12px_oklch(0_0_0/0.6)]"
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
            {desktopPrimary.map((l) =>
              l.to ? (
                <Link
                  key={l.to}
                  href={l.to as string}
                  className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
                >
                  {l.label}
                </a>
              ),
            )}
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
                  {desktopMore.map((l) =>
                    l.to ? (
                      <Link
                        key={l.to}
                        href={l.to as string}
                        onClick={() => setMoreOpen(false)}
                        className="flex flex-col rounded-lg px-3 py-2 hover:bg-card/60"
                      >
                        <span className="text-sm font-medium text-foreground">{l.label}</span>
                        <span className="text-xs text-muted-foreground">{l.description}</span>
                      </Link>
                    ) : (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setMoreOpen(false)}
                        className="flex flex-col rounded-lg px-3 py-2 hover:bg-card/60"
                      >
                        <span className="text-sm font-medium text-foreground">{l.label}</span>
                        <span className="text-xs text-muted-foreground">{l.description}</span>
                      </a>
                    ),
                  )}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            {user && isAdmin ? (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_8px_30px_-10px_var(--primary)] transition-transform hover:scale-[1.02]"
              >
                <ShieldCheck className="h-4 w-4" /> Admin
              </Link>
            ) : user ? (
              <Link
                href={dashboardHref}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_-10px_var(--primary)] transition-transform hover:scale-[1.02]"
              >
                Dashboard
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="group relative hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_-10px_var(--primary)] transition-transform hover:scale-[1.02]"
              >
                Sign in
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            )}
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
              {routeLinks.map((l) => (
                <Link
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-card/60"
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
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
              {user && isAdmin ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <ShieldCheck className="h-4 w-4" /> Cakey admin
                </Link>
              ) : user ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Open dashboard →
                </Link>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Sign in →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
