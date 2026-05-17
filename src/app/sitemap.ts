import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cakey.ai").replace(/\/$/, "");

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  // Tier 1 — brand-anchor pages.  These are the routes we want as sitelink candidates.
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/waitlist", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.8 },

  // Tier 2 — product / feature surfaces.
  { path: "/insurance", changeFrequency: "monthly", priority: 0.7 },
  { path: "/features/trust-score", changeFrequency: "monthly", priority: 0.7 },
  { path: "/features/simulation", changeFrequency: "monthly", priority: 0.7 },
  { path: "/features/proof-of-commitment", changeFrequency: "monthly", priority: 0.7 },
  { path: "/features/monitoring", changeFrequency: "monthly", priority: 0.7 },

  // Tier 3 — required legal pages.  Low priority but must be indexable.
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclosures", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
