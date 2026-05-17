import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";

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

// JSON-LD structured data — picked up by search engines + knowledge-graph features.
// Single combined `@graph` payload so it ships in one script tag.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "Cakey AI",
      url: SITE_URL,
      logo: `${SITE_URL}/cakey-logo.png`,
      description:
        "AI-powered Web3 launchpad with behavioral trust scoring, pre-launch simulation, and an insurance pool.",
      sameAs: [
        "https://x.com/cakeyai",
        "https://github.com/cakey-ai",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "Cakey AI Launchpad",
      publisher: { "@id": `${SITE_URL}#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
