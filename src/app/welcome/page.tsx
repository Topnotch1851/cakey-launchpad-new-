"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Wallet, Rocket, ArrowRight } from "lucide-react";
import { useAudience, type Audience } from "@/features/audience/hooks/useAudience";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useIsAdmin } from "@/features/auth/hooks/useIsAdmin";

export default function WelcomePage() {
  const router = useRouter();
  const { setAudience } = useAudience();
  const { user } = useAuth();
  const { isAdmin, checking } = useIsAdmin(user?.id);

  useEffect(() => {
    if (!checking && isAdmin) router.push("/admin");
  }, [checking, isAdmin, router]);

  if (checking || isAdmin) return null;

  const choose = (a: Audience) => {
    setAudience(a);
    router.push(a === "investor" ? "/portfolio" : "/team");
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />

      <section className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
          Welcome to Cakey
        </span>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">How will you use Cakey?</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Pick what fits today — we&apos;ll show you the right dashboard. You can switch any time from the sidebar.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <AudienceCard
            icon={Wallet}
            title="I'm here to invest"
            body="Browse vetted launches, build a watchlist, track allocations, and file insurance claims if a project fails."
            cta="Open investor dashboard"
            onClick={() => choose("investor")}
          />
          <AudienceCard
            icon={Rocket}
            title="I'm launching a project"
            body="Submit your project for review, track your application, and manage milestones once you're live."
            cta="Open founder dashboard"
            onClick={() => choose("founder")}
            accent
          />
        </div>

        <Link href="/" className="mt-10 text-xs text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </section>
    </main>
  );
}

function AudienceCard({
  icon: Icon,
  title,
  body,
  cta,
  onClick,
  accent,
}: {
  icon: typeof Wallet;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group glass relative flex flex-col gap-4 rounded-2xl p-6 text-left transition-all hover:-translate-y-0.5 hover:ring-1 hover:ring-accent/40"
    >
      <span
        className={
          "inline-flex h-11 w-11 items-center justify-center rounded-xl " +
          (accent
            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
            : "bg-background/40 text-accent ring-1 ring-border")
        }
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}
