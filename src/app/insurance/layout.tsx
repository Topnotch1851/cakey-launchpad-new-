import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Pool",
  description:
    "A shared safety net funded by protocol fees, with transparent on-chain claim logic and auto-replenishing reserves.",
  alternates: { canonical: "/insurance" },
  openGraph: {
    title: "Cakey Insurance Pool — Protocol-funded protection for launches",
    description:
      "On-chain insurance reserves with transparent claim logic. Built into every Cakey launch.",
    url: "/insurance",
    type: "article",
  },
};

export default function InsuranceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
