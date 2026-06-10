import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import {
  breadcrumbsSchema,
  combinedGraph,
  webPageSchema,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Insurance Pool",
  description:
    "A shared safety net funded by protocol fees, with transparent on-chain claim logic and auto-replenishing reserves.",
  alternates: { canonical: "/insurance" },
  openGraph: {
    title: "Cakey Insurance Pool. Protocol-funded protection for launches",
    description:
      "On-chain insurance reserves with transparent claim logic. Built into every Cakey launch.",
    url: "/insurance",
    type: "article",
  },
};

const pageSchema = combinedGraph(
  webPageSchema({
    name: "Insurance Pool. Cakey AI",
    description: metadata.description as string,
    url: "/insurance",
  }),
  breadcrumbsSchema([
    { name: "Home", url: "/" },
    { name: "Insurance", url: "/insurance" },
  ]),
);

export default function InsuranceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData data={pageSchema} />
      {children}
    </>
  );
}
