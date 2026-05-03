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

export const metadata: Metadata = {
  title: "Cakey AI Launchpad — Intelligent trust for token launches",
  description:
    "Cakey is the AI-powered Web3 launchpad with behavioral trust scoring, pre-launch simulation, proof of commitment, and an insurance pool — built to end rug pulls.",
  authors: [{ name: "Cakey AI" }],
  openGraph: {
    title: "Cakey AI Launchpad — Intelligent trust for token launches",
    description:
      "AI-powered trust, simulation and protection for Web3 token launches. Join the waitlist.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
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
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
