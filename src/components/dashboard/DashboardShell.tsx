"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Briefcase,
  Wallet,
  ShieldCheck,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X,
  Home,
  Sparkles,
  Rocket,
  Repeat,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useIsAdmin } from "@/features/auth/hooks/useIsAdmin";
import { signOut as signOutSvc } from "@/features/auth/services";
import { cn } from "@/lib/utils";
import { useAudience, type Audience } from "@/features/audience/hooks/useAudience";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
  group: "founder" | "investor" | "admin";
  adminOnly?: boolean;
};

const NAV: NavItem[] = [
  // Founder
  { to: "/team", label: "My projects", icon: Briefcase, group: "founder" },
  { to: "/apply", label: "Submit project", icon: Rocket, group: "founder" },
  // Investor
  { to: "/portfolio", label: "Portfolio", icon: Wallet, group: "investor" },
  { to: "/launches", label: "Browse launches", icon: Home, group: "investor" },
  { to: "/claim", label: "File a claim", icon: ShieldCheck, group: "investor" },
  // Admin
  { to: "/admin", label: "Applications", icon: FileText, group: "admin", adminOnly: true },
  { to: "/admin/claims", label: "Claims", icon: ShieldCheck, group: "admin", adminOnly: true },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3, group: "admin", adminOnly: true },
];

const GROUP_LABEL: Record<NavItem["group"], string> = {
  founder: "Founder",
  investor: "Investor",
  admin: "Cakey admin",
};

export function DashboardShell({
  title,
  eyebrow,
  description,
  actions,
  children,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const { isAdmin, checking: checkingAdmin } = useIsAdmin(user?.id);
  const router = useRouter();
  const path = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const { audience: storedAudience, setAudience } = useAudience();
  const audience: Audience = storedAudience ?? "investor";

  const switchAudience = (a: Audience) => {
    setAudience(a);
    router.push(a === "founder" ? "/team" : "/portfolio");
  };

  // Show only the chosen audience group, plus admin if elevated.
  // Admin group always shown first when elevated, regardless of audience toggle.
  const groups: NavItem["group"][] = [
    ...(isAdmin ? (["admin"] as const) : []),
    audience,
  ];

  const signOut = async () => {
    await signOutSvc();
    router.push("/auth");
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="font-display text-sm font-semibold">Cakey</span>
          <span className="rounded-md border border-border bg-background/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            Dashboard
          </span>
        </Link>
        <button
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/60"
        >
          <Menu className="h-4 w-4" />
        </button>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-background/40 backdrop-blur lg:flex lg:flex-col">
          <SidebarContent
            groups={groups}
            path={path}
            email={user?.email ?? null}
            isAdmin={isAdmin}
            checkingAdmin={checkingAdmin}
            onSignOut={signOut}
            audience={audience}
            onSwitchAudience={switchAudience}
          />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-border bg-popover">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="font-display text-sm font-semibold">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarContent
                groups={groups}
                path={path}
                email={user?.email ?? null}
                isAdmin={isAdmin}
                checkingAdmin={checkingAdmin}
                onSignOut={signOut}
                onNavigate={() => setMobileOpen(false)}
                audience={audience}
                onSwitchAudience={(a) => {
                  switchAudience(a);
                  setMobileOpen(false);
                }}
              />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                {eyebrow && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                    {eyebrow}
                  </span>
                )}
                <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  groups,
  path,
  email,
  isAdmin,
  checkingAdmin,
  onSignOut,
  onNavigate,
  audience,
  onSwitchAudience,
}: {
  groups: NavItem["group"][];
  path: string;
  email: string | null;
  isAdmin: boolean;
  checkingAdmin: boolean;
  onSignOut: () => void;
  onNavigate?: () => void;
  audience: Audience;
  onSwitchAudience: (a: Audience) => void;
}) {
  const showAudienceControls = !isAdmin;

  return (
    <div className="flex h-full flex-col">
      <div className="hidden border-b border-border px-5 py-5 lg:block">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_8px_24px_-12px_var(--primary)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-base font-semibold">Cakey</span>
          <span className="rounded-md border border-border bg-background/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            Dashboard
          </span>
        </Link>
      </div>

      {showAudienceControls && (
        <div className="px-3 pt-4">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Mode
          </div>
          <div className="flex gap-1 rounded-xl border border-border bg-background/40 p-1">
            {(["investor", "founder"] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => onSwitchAudience(a)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                  audience === a
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {a === "investor" ? <Wallet className="h-3.5 w-3.5" /> : <Rocket className="h-3.5 w-3.5" />}
                {a === "investor" ? "Invest" : "Launch"}
              </button>
            ))}
          </div>
          <div className="mt-1 flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
            <Repeat className="h-3 w-3" /> Switch any time
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {checkingAdmin && !isAdmin && (
          <div className="mb-4 rounded-xl border border-dashed border-border/60 bg-background/40 px-3 py-2 text-[11px] text-muted-foreground">
            Checking admin access…
          </div>
        )}
        {(isAdmin ? (["admin"] as const) : groups).map((g) => {
          const items = NAV.filter((i) => i.group === g);
          if (g === "admin" && !isAdmin) return null;
          return (
            <div key={g} className="mb-6">
              <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {GROUP_LABEL[g]}
              </div>
              <ul className="space-y-1">
                {items.map((item) => {
                  const active = path === item.to || path.startsWith(item.to + "/");
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <Link
                        href={item.to}
                        onClick={onNavigate}
                        className={cn(
                          "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-gradient-to-r from-primary/15 to-accent/15 text-foreground ring-1 ring-accent/30"
                            : "text-muted-foreground hover:bg-card/50 hover:text-foreground",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            active ? "text-accent" : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-3">
        <div className="rounded-xl border border-border bg-background/40 p-3">
          <div className="truncate text-xs text-muted-foreground">Signed in as</div>
          <div className="mt-0.5 truncate text-sm font-medium">{email ?? "—"}</div>
          {isAdmin && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
              <ShieldCheck className="h-3 w-3" /> Admin
            </span>
          )}
          <button
            onClick={onSignOut}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs hover:bg-card/70"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
