import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { StructuredData } from "@/components/StructuredData";
import {
  combinedGraph,
  organizationSchema,
  softwareApplicationSchema,
  webSiteSchema,
} from "@/lib/seo/structured-data";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cakey.ai").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cakey AI Launchpad — Intelligent trust for token launches",
    template: "%s — Cakey AI",
  },
  description:
    "Cakey is the AI-powered Web3 launchpad with behavioral trust scoring, pre-launch simulation, proof of commitment, and an insurance pool — built to end rug pulls.",
  applicationName: "Cakey AI",
  authors: [{ name: "Cakey AI" }],
  keywords: [
    "Web3 launchpad",
    "token launch",
    "AI risk scoring",
    "rug pull protection",
    "DeFi insurance",
    "smart contract audit",
  ],
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    siteName: "Cakey AI",
    url: SITE_URL,
    title: "Cakey AI Launchpad — Intelligent trust for token launches",
    description:
      "AI-powered trust, simulation and protection for Web3 token launches. Join the waitlist.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cakey AI Launchpad — Intelligent trust for token launches",
    description: "AI-powered trust for Web3 launches. Join the waitlist.",
  },
  icons: { icon: "/favicon.ico" },
};

// Global structured-data graph emitted on every page.  Page-level schemas
// (FAQPage, BreadcrumbList, ...) are appended from each route as needed.
const globalSchema = combinedGraph(
  organizationSchema(),
  webSiteSchema(),
  softwareApplicationSchema(),
);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StructuredData data={globalSchema} />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
