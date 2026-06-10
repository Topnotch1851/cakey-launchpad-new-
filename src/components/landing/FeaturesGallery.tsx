import { Gallery6, type GalleryItem } from "@/components/ui/gallery6";

// Copy intentionally describes intent and design direction, not measured
// production metrics.  Phase 1 of the roadmap is "landing + manual vetting",
// so claiming live throughput / accuracy / pool size figures would be untrue
// and create regulatory exposure.  Update with measured numbers once each
// system is shipped (see PRD §10 success metrics).
const items: GalleryItem[] = [
  {
    id: "trust-score",
    title: "Behavioral Trust Score",
    summary:
      "Wallet-level reputation built from on-chain history. Designed to surface repeat offenders, copy-paste teams, and credible builders before a project ever lists.",
    url: "/features/trust-score",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "simulation",
    title: "Pre-Launch Simulation",
    summary:
      "Models whale behavior, slippage, and liquidity shocks before a token goes live. Built to expose tokenomics weaknesses while there's still time to fix them.",
    url: "/features/simulation",
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "proof-of-commitment",
    title: "Proof of Commitment",
    summary:
      "On-chain liquidity locks and optional collateral staking with penalty logic for early exits. Non-custodial by design. Cakey never holds your funds.",
    url: "/features/proof-of-commitment",
    image:
      "https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "monitoring",
    title: "Real-time Monitoring",
    summary:
      "Continuous post-launch surveillance of liquidity flows and suspicious wallet activity. Built to flag drains, dumps, and stealth transfers as they happen.",
    url: "/features/monitoring",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "insurance-pool",
    title: "Insurance Pool",
    summary:
      "A shared safety net funded by protocol fees, designed for partial compensation when projects fail. Structure and payout logic are being finalized with the community.",
    url: "/insurance",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
  },
];

export function FeaturesGallery() {
  return (
    <Gallery6
      id="features"
      eyebrow="Capabilities"
      heading={
        <>
          What makes Cakey <span className="text-accent">different.</span>
        </>
      }
      description="Every system works together. intelligence, enforcement, and protection in a single launch stack."
      demoUrl="/#features"
      demoLabel="Explore the full stack"
      items={items}
    />
  );
}
