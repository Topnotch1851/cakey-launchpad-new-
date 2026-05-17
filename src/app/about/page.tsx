import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { StructuredData } from "@/components/StructuredData";
import {
  breadcrumbsSchema,
  combinedGraph,
  webPageSchema,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Cakey AI is the launchpad ending rug pulls — behavioral trust scoring, pre-launch simulation, and an on-chain insurance pool. Read the mission, the pillars, and the roadmap.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Cakey AI — The launchpad ending rug pulls",
    description:
      "Behavioral trust scoring, pre-launch simulation, and an on-chain insurance pool. Built for retail.",
    url: "/about",
    type: "article",
  },
};

const pageSchema = combinedGraph(
  webPageSchema({
    name: "About Cakey AI",
    description: metadata.description as string,
    url: "/about",
  }),
  breadcrumbsSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]),
);

const pillars = [
  {
    title: "Intelligence before listing",
    body: "Every project is run through a behavioral trust pipeline before it ever reaches investors. Wallet history, developer track record, and tokenomics are scored against patterns of 12k+ historically-scored wallets.",
  },
  {
    title: "Simulation before launch",
    body: "Liquidity curves, whale concentration, vesting cliffs, and slippage are stress-tested across 10M+ scenarios per launch — the public simulation report is attached to every approved listing.",
  },
  {
    title: "Protection after launch",
    body: "Liquidity is locked on-chain with collateral that punishes early exits. Real-time monitoring surfaces suspicious wallet movement within 400ms. A protocol-funded insurance pool compensates investors when launches fail despite passing vetting.",
  },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <StructuredData data={pageSchema} />
      <Nav />

      <section className="relative isolate pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_oklch(0.82_0.11_82/0.5)]" />
            About Cakey
          </span>
          <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            The launchpad ending <span className="text-accent">rug pulls.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            $2.8B+ has been lost to rug pulls. 70% of launchpad projects collapse within months. Cakey is the response: an AI-driven launch platform where intelligence, enforcement, and protection are part of the listing, not optional add-ons.
          </p>
        </div>
      </section>

      <section className="relative pb-20 sm:pb-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">The three pillars</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {pillars.map((p) => (
              <article
                key={p.title}
                className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur"
              >
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Where we are</h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Phase 01 (Foundation) is shipping now: public site, manual vetting, MVP launchpad. Phase 02 brings AI risk scoring, automated smart contract audit, and behavioral wallet analysis. Phase 03 ships the insurance pool, cross-chain rollout, and institutional partnerships. The roadmap is live on the homepage.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/#waitlist"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-glow"
            >
              Join the waitlist
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-card/70"
            >
              Read the FAQ
            </Link>
            <Link
              href="/#roadmap"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-card/70"
            >
              See the roadmap
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
