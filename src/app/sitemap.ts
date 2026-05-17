import type { MetadataRoute } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://cakey.ai").replace(/\/$/, "");

const STATIC_ROUTES: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/insurance", changeFrequency: "monthly", priority: 0.7 },
  { path: "/features/trust-score", changeFrequency: "monthly", priority: 0.7 },
  { path: "/features/simulation", changeFrequency: "monthly", priority: 0.7 },
  { path: "/features/proof-of-commitment", changeFrequency: "monthly", priority: 0.7 },
  { path: "/features/monitoring", changeFrequency: "monthly", priority: 0.7 },
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
