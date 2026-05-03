import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclosures — Cakey AI",
  description:
    "Risk, regulatory, conflict, and operational disclosures for Cakey AI and the token launches listed on our platform.",
  openGraph: {
    title: "Disclosures — Cakey AI",
    description: "Risk and regulatory disclosures for Cakey AI.",
  },
};

const updated = "April 30, 2026";

export default function DisclosuresPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5" />
            Important
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            Disclosures
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            Plain‑language disclosures about how Cakey AI operates, the risks of token
            launches, and the limits of what our trust signals can tell you.
          </p>
        </header>

        <div className="mt-10 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 text-sm text-amber-100/90">
          <strong className="font-semibold text-amber-200">Not investment advice.</strong>{" "}
          Nothing on Cakey AI is an offer, solicitation, or recommendation to buy any
          token. Token launches are high‑risk and you can lose 100% of your
          contribution.
        </div>

        <article className="mt-10 space-y-10">
          <Section title="1. Nature of the service">
            <p>
              Cakey AI is a discovery and diligence platform. We are not a broker,
              dealer, exchange, custodian, fund, or registered investment adviser in
              any jurisdiction.
            </p>
          </Section>

          <Section title="2. Trust scores & analytics">
            <p>
              Our scores aggregate on‑chain, code, team, and social signals into a
              composite indicator. They are <em>probabilistic</em>, can be wrong, and
              must not be the sole basis of any decision. We may revise scores
              retroactively as new data emerges.
            </p>
          </Section>

          <Section title="3. Listing process">
            <p>
              Projects apply, undergo automated checks, and where applicable manual
              review. A listing reflects passage of those checks at a point in time —
              it is not an endorsement, guarantee of performance, or warranty of
              legality in your jurisdiction.
            </p>
          </Section>

          <Section title="4. Conflicts of interest">
            <p>
              Cakey AI may receive listing fees, success fees, or token allocations
              from listed projects. Where this is the case, the relationship is
              disclosed on the project page. Editorial signals are produced
              independently of commercial relationships.
            </p>
          </Section>

          <Section title="5. Jurisdictional restrictions">
            <p>
              Access from sanctioned territories and jurisdictions where token sales
              to retail are restricted is prohibited. You are responsible for
              determining whether participation is lawful for you.
            </p>
          </Section>

          <Section title="6. Custody & wallets">
            <p>
              Cakey AI never takes custody of user funds. All on‑chain actions are
              executed from your self‑custody wallet. Loss of keys means loss of
              assets — we cannot recover them.
            </p>
          </Section>

          <Section title="7. Forward‑looking statements">
            <p>
              Roadmaps, projections, and tokenomics shown on launch pages are provided
              by projects and may not be achieved. Treat them as marketing material,
              not commitments by Cakey AI.
            </p>
          </Section>

          <Section title="8. Reporting concerns">
            <p>
              Suspect a scam, exploit, or compliance issue? Email{" "}
              <a className="text-accent underline-offset-4 hover:underline" href="mailto:abuse@cakey.ai">
                abuse@cakey.ai
              </a>
              . We investigate every report.
            </p>
          </Section>

          <p className="text-xs text-muted-foreground">Last updated: {updated}</p>

          <nav className="mt-12 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6 text-sm">
            <span className="text-muted-foreground">Related:</span>
            <Link href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
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
