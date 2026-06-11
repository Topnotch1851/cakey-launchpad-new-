import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy. Cakey AI",
  description:
    "How Cakey AI collects, uses, stores and protects your information when you use our token launch trust platform.",
  openGraph: {
    title: "Privacy Policy. Cakey AI",
    description: "How Cakey AI collects, uses, stores and protects your information.",
  },
};

const updated = "April 30, 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <header className="space-y-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/45">
            Legal
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            We treat your data the way we&apos;d want ours treated. minimally collected, tightly scoped, never sold.
          </p>
        </header>

        <article className="mt-12 space-y-10">
          <Section title="1. Information we collect">
            <p>
              We collect the minimum information required to operate Cakey AI: account
              details (email, wallet address), application data you submit (project
              info, KYC artifacts where required), and product telemetry (page views,
              feature usage, error logs).
            </p>
          </Section>

          <Section title="2. How we use it">
            <p>
              Your data powers authentication, fraud and rug‑pull detection, allocation
              eligibility, customer support, and platform analytics. We never sell
              personal information to third parties.
            </p>
          </Section>

          <Section title="3. Sharing">
            <p>
              We share data only with vetted processors (hosting, analytics, KYC
              providers, email infrastructure) under data‑processing agreements, and
              when legally compelled.
            </p>
          </Section>

          <Section title="4. Retention">
            <p>
              We keep account and compliance records for as long as your account is
              active and as required by law. Telemetry is retained in aggregated form.
            </p>
          </Section>

          <Section title="5. Your rights">
            <p>
              You may request access, correction, export, or deletion of your personal
              data at any time. Contact{" "}
              <a className="text-accent underline-offset-4 hover:underline" href="mailto:privacy@cakeylaunch.com">
                privacy@cakeylaunch.com
              </a>
              .
            </p>
          </Section>

          <Section title="6. Security">
            <p>
              We use encryption in transit and at rest, role‑based access, and routine
              audits. No system is perfectly secure. report concerns to{" "}
              <a className="text-accent underline-offset-4 hover:underline" href="mailto:security@cakeylaunch.com">
                security@cakeylaunch.com
              </a>
              .
            </p>
          </Section>

          <Section title="7. Changes">
            <p>
              We may update this policy. Material changes will be announced in‑product
              and via email where applicable.
            </p>
          </Section>

          <p className="text-xs text-muted-foreground">Last updated: {updated}</p>

          <nav className="mt-12 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6 text-sm">
            <span className="text-muted-foreground">Related:</span>
            <Link href="/terms" className="text-accent hover:underline">
              Terms of Service
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
