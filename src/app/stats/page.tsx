import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BarChart3, Users, MousePointerClick } from "lucide-react";
import { getPublicStats } from "@/server/analytics.functions";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Stats — Cakey AI Launchpad",
  description: "Live engagement stats for the Cakey waitlist.",
};

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const stats = await getPublicStats();
  const tiles = [
    { icon: Users, label: "Waitlist signups", value: stats.signups },
    { icon: MousePointerClick, label: "Hero CTA clicks", value: stats.heroClicks },
    { icon: BarChart3, label: "Applications", value: stats.applications },
  ];
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <section className="relative isolate pt-36 pb-24">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40" />
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="mt-6 font-display text-4xl font-semibold sm:text-5xl">
            Live <span className="text-gradient">engagement</span>
          </h1>
          <p className="mt-3 text-muted-foreground">A small public window into Cakey&apos;s momentum.</p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {tiles.map((t) => (
              <div key={t.label} className="glass rounded-2xl p-6">
                <t.icon className="h-5 w-5 text-accent" />
                <div className="mt-3 font-display text-4xl font-semibold tabular-nums">
                  {t.value.toLocaleString()}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
