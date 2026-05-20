import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { StructuredData } from "@/components/StructuredData";
import {
  breadcrumbsSchema,
  combinedGraph,
  faqPageSchema,
  webPageSchema,
} from "@/lib/seo/structured-data";

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "What is Cakey AI?",
    answer:
      "Cakey AI is a Web3 launchpad that adds intelligence and protection to token launches. Every project is vetted with behavioral trust scoring, stress-tested against thousands of simulated scenarios, and backed by an on-chain insurance pool. so retail investors aren't carrying all the risk.",
  },
  {
    question: "How does Cakey prevent rug pulls?",
    answer:
      "Three layers work together. (1) Behavioral Trust Score: developer wallets are scored against on-chain history, repeat offenders are flagged before they can list. (2) Pre-Launch Simulation: each launch is stress-tested across many scenarios for whale dump risk and liquidity drains. (3) Proof of Commitment: liquidity is locked on-chain with collateral that penalises early exits.",
  },
  {
    question: "What chains does Cakey support?",
    answer:
      "At launch, Cakey supports Ethereum, Base, Arbitrum, Polygon, and Solana for behavioral analysis and wallet scoring. Additional chains and cross-chain settlement roll out during Phase 03 (Expansion).",
  },
  {
    question: "Do I need a wallet to join the waitlist?",
    answer:
      "No. Email is enough. Connecting a wallet is optional and only used to auto-fill your address for priority allocation perks once early access opens.",
  },
  {
    question: "What is the Cakey insurance pool?",
    answer:
      "A protocol-funded reserve that compensates investors when a launch fails despite passing vetting. The pool auto-replenishes from launch fees, and every claim is processed against transparent on-chain logic.",
  },
  {
    question: "Is Cakey custodial?",
    answer:
      "No. Cakey is 100% non-custodial. Liquidity locks, collateral, and claim payouts are governed by smart contracts; Cakey never holds participant funds.",
  },
  {
    question: "When does Cakey launch?",
    answer:
      "Phase 01 (Foundation) is shipping now. public site, manual vetting, MVP launchpad. Phase 02 brings AI integration, automated audit, and a behavioral wallet engine. Phase 03 adds the insurance pool, cross-chain rollout, and institutional partnerships.",
  },
  {
    question: "How do I get priority access?",
    answer:
      "Join the waitlist with your email and (optionally) connect a wallet. Founding members get allocation perks, early access to the insurance pool, and priority on the first slate of launches.",
  },
];

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about Cakey AI. how the launchpad works, what protects investors, supported chains, and how to join the waitlist.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ. Cakey AI",
    description: "Common questions about the Cakey AI launchpad and waitlist.",
    url: "/faq",
    type: "article",
  },
};

const pageSchema = combinedGraph(
  webPageSchema({
    name: "Cakey AI. FAQ",
    description: metadata.description as string,
    url: "/faq",
  }),
  breadcrumbsSchema([
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" },
  ]),
  faqPageSchema(FAQS),
);

export default function FaqPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <StructuredData data={pageSchema} />
      <Nav />
      <section className="relative isolate pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent backdrop-blur">
            FAQ
          </span>
          <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Questions, answered.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            What Cakey is, how it protects investors, what chains we support, and what you get for joining the waitlist.
          </p>

          <div className="mt-12 divide-y divide-border/60 border-y border-border/60">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
                  <span className="font-display text-lg font-medium text-foreground sm:text-xl">
                    {faq.question}
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-card/40 text-muted-foreground transition-transform duration-[200ms] ease-[var(--ease-out-strong)] group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
