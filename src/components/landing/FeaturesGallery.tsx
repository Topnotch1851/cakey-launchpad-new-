import { Gallery6, type GalleryItem } from "@/components/ui/gallery6";

const items: GalleryItem[] = [
  {
    id: "trust-score",
    title: "Behavioral Trust Score",
    summary:
      "Wallet-level reputation built from on-chain history. Detect repeat offenders before they ever list — 12k+ wallets scored with 98% detection accuracy.",
    url: "/features/trust-score",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "simulation",
    title: "Simulation Engine",
    summary:
      "Model whale behavior, slippage, and liquidity shocks before a single token moves. 10M+ scenarios run per launch across 24 risk vectors in under 2 seconds.",
    url: "/features/simulation",
    image:
      "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "proof-of-commitment",
    title: "Proof of Commitment",
    summary:
      "On-chain locks and collateral with penalty logic that punishes early exits. 100% non-custodial, zero custody breaches, up to 12-month lock windows.",
    url: "/features/proof-of-commitment",
    image:
      "https://images.unsplash.com/photo-1620207418302-439b387441b0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "monitoring",
    title: "Real-time Monitoring",
    summary:
      "Continuous surveillance of liquidity flows and suspicious wallets after launch. 24/7 cross-chain coverage with alert latency under 400ms across 5 chains.",
    url: "/features/monitoring",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "insurance-pool",
    title: "Insurance Pool",
    summary:
      "A shared safety net funded by protocol fees, with transparent on-chain claim logic. $2.4M in auto-replenishing reserves with 100% on-chain transparency.",
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
      description="Every system works together — intelligence, enforcement, and protection in a single launch stack."
      demoUrl="/#features"
      demoLabel="Explore the full stack"
      items={items}
    />
  );
}
