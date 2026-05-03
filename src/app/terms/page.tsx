import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Cakey AI",
  description:
    "The terms governing your use of Cakey AI — accounts, eligibility, prohibited conduct, and liability.",
  openGraph: {
    title: "Terms of Service — Cakey AI",
    description: "The terms governing your use of Cakey AI.",
  },
};

const updated = "April 30, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            Legal
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            Terms of Service
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            By using Cakey AI you agree to these terms. Read them carefully — they
            cover eligibility, conduct, risk, and what we owe each other.
          </p>
        </header>

        <article className="mt-12 space-y-10">
          <Section title="1. Eligibility">
            <p>
              You must be of legal age in your jurisdiction and not located in a
              restricted territory. You are responsible for complying with local laws
              regarding tokens and digital assets.
            </p>
          </Section>

          <Section title="2. Accounts">
            <p>
              Keep your credentials and wallet keys secure. You are responsible for
              activity under your account. Notify us immediately of unauthorized use.
            </p>
          </Section>

          <Section title="3. The platform">
            <p>
              Cakey AI provides discovery, diligence signals, and allocation tooling
              for token launches. We are not a broker‑dealer, exchange, custodian, or
              investment adviser. Listings are not endorsements.
            </p>
          </Section>

          <Section title="4. Prohibited conduct">
            <p>
              No fraud, market manipulation, sybil/multi‑account abuse, scraping at
              scale, reverse engineering, or use of the service to launder funds or
              evade sanctions. Violations result in immediate suspension.
            </p>
          </Section>

          <Section title="5. Risk">
            <p>
              Token launches are highly speculative and you can lose your entire
              contribution. Nothing on Cakey AI is financial, legal, or tax advice. Do
              your own research.
            </p>
          </Section>

          <Section title="6. Intellectual property">
            <p>
              The Cakey AI brand, software, and content are owned by us or our
              licensors. You receive a limited, revocable, non‑transferable license to
              use the service.
            </p>
          </Section>

          <Section title="7. Termination">
            <p>
              We may suspend or terminate access at any time for any reason, including
              suspected violations or legal requirements.
            </p>
          </Section>

          <Section title="8. Disclaimers & limitation of liability">
            <p>
              The service is provided &quot;as is&quot; without warranties. To the maximum extent
              permitted by law, Cakey AI is not liable for indirect, incidental, or
              consequential damages, or for losses related to third‑party token
              launches.
            </p>
          </Section>

          <Section title="9. Governing law">
            <p>
              These terms are governed by the laws of the jurisdiction stated in our
              corporate disclosures. Disputes are resolved by binding arbitration
              except where prohibited.
            </p>
          </Section>

          <Section title="10. Contact">
            <p>
              Questions?{" "}
              <a className="text-accent underline-offset-4 hover:underline" href="mailto:legal@cakey.ai">
                legal@cakey.ai
              </a>
            </p>
          </Section>

          <p className="text-xs text-muted-foreground">Last updated: {updated}</p>

          <nav className="mt-12 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6 text-sm">
            <span className="text-muted-foreground">Related:</span>
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link href="/disclosures" className="text-accent hover:underline">
              Disclosures
            </Link>
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
      <div className="text-sm leading-relaxed text-muted-foreground md:text-base">{children}</div>
    </section>
  );
}
