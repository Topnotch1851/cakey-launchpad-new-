import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { Waitlist } from "@/components/landing/Waitlist";
import { StructuredData } from "@/components/StructuredData";
import {
  breadcrumbsSchema,
  combinedGraph,
  webPageSchema,
} from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Join the Waitlist",
  description:
    "Join the Cakey AI waitlist for priority access to vetted token launches, founding-member allocation perks, and early insurance-pool participation.",
  alternates: { canonical: "/waitlist" },
  openGraph: {
    title: "Join the Cakey AI waitlist",
    description:
      "Priority access, founding-member perks, and early insurance-pool participation.",
    url: "/waitlist",
    type: "website",
  },
};

const pageSchema = combinedGraph(
  webPageSchema({
    name: "Join the Cakey AI Waitlist",
    description: metadata.description as string,
    url: "/waitlist",
  }),
  breadcrumbsSchema([
    { name: "Home", url: "/" },
    { name: "Waitlist", url: "/waitlist" },
  ]),
);

export default function WaitlistPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <StructuredData data={pageSchema} />
      <Nav />
      <div className="pt-20 sm:pt-24">
        <Waitlist />
      </div>
      <Footer />
    </main>
  );
}
