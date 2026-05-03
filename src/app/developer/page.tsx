import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Code2, KeyRound, BookOpen } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Developer Portal — Cakey AI Launchpad",
  description: "API docs, keys, and SDKs for building on Cakey AI.",
};

export default function DeveloperPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <section className="relative isolate pt-36 pb-24">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40" />

        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <div className="mt-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              <Code2 className="h-3 w-3" /> Developer portal
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
              Build on the <span className="text-gradient">Cakey trust layer.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              SDKs, REST endpoints, and webhooks for integrating Cakey&apos;s vetting, scoring, and insurance pool into your stack.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Tile icon={KeyRound} title="API keys" body="Manage scoped keys and rotate them safely." />
            <Tile icon={BookOpen} title="Documentation" body="REST + Webhooks reference, with TypeScript types." />
            <Tile icon={Code2} title="SDKs" body="First-class TypeScript SDK; community Rust + Python." />
          </div>

          <div className="glass mt-10 rounded-2xl p-6 text-sm text-muted-foreground">
            <strong className="text-foreground">Coming soon.</strong> The developer portal is under
            construction. <Link href="/early-access" className="text-accent hover:underline">Get notified</Link> when API keys are issued.
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Tile({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <Icon className="h-5 w-5 text-accent" />
      <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
