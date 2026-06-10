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

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cakeylaunch.com").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cakey AI Launchpad. Intelligent trust for token launches",
    template: "%s. Cakey AI",
  },
  description:
    "Cakey is the AI-powered Web3 launchpad with behavioral trust scoring, pre-launch simulation, proof of commitment, and an insurance pool. built to end rug pulls.",
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
    title: "Cakey AI Launchpad. Intelligent trust for token launches",
    description:
      "AI-powered trust, simulation and protection for Web3 token launches. Join the waitlist.",
    // Explicit absolute URL improves reliability on WhatsApp / Telegram /
    // LinkedIn scrapers that don't always pick up Next's file-based
    // /opengraph-image route. metadataBase ensures the resolved URL is
    // absolute even if a relative path were used.
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Cakey AI Launchpad. Intelligent trust for token launches",
        type: "image/png",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cakey AI Launchpad. Intelligent trust for token launches",
    description: "AI-powered trust for Web3 launches. Join the waitlist.",
    images: ["/twitter-image"],
    creator: "@cakeyai",
    site: "@cakeyai",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: "technology",
  // Favicon + Apple touch icon come from app/icon.png + app/apple-icon.png
  // (file-based metadata). both generated from the Cakey brand logo.
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
        {/*
          Skip-link for keyboard / screen-reader users.  Hidden visually until
          focused, then appears as a high-contrast pill in the top-left.  The
          hero canvas (Spline) is `aria-hidden`, so the next focus stop should
          land on real content. the homepage exposes #top on its root section.
        */}
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Skip to content
        </a>
        <StructuredData data={globalSchema} />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
