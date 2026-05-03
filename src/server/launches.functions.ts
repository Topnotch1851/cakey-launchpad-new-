/**
 * Frontend-only mocks for launches.
 */
import { fakeLatency } from "./_mock";

export type LaunchSummary = {
  id: string;
  slug: string;
  project_name: string;
  tagline: string | null;
  logo_url: string | null;
  cover_url: string | null;
  token_symbol: string | null;
  token_chain: string | null;
  price_usd: number | null;
  hard_cap_usd: number | null;
  raised_usd: number | null;
  status: "upcoming" | "live" | "ended" | "cancelled";
  trust_score: number | null;
  starts_at: string | null;
  ends_at: string | null;
  tags: string[] | null;
  featured: boolean | null;
};

const MOCK_LAUNCHES: LaunchSummary[] = [
  {
    id: "1",
    slug: "obelisk",
    project_name: "Obelisk Protocol",
    tagline: "On-chain settlement for prediction markets.",
    logo_url: null,
    cover_url: null,
    token_symbol: "OBL",
    token_chain: "Base",
    price_usd: 0.045,
    hard_cap_usd: 1_500_000,
    raised_usd: 380_000,
    status: "live",
    trust_score: 92,
    starts_at: new Date(Date.now() - 2 * 86400_000).toISOString(),
    ends_at: new Date(Date.now() + 5 * 86400_000).toISOString(),
    tags: ["DeFi", "Settlement"],
    featured: true,
  },
  {
    id: "2",
    slug: "lumen-ai",
    project_name: "Lumen AI",
    tagline: "Decentralized inference with verifiable proofs.",
    logo_url: null,
    cover_url: null,
    token_symbol: "LMN",
    token_chain: "Arbitrum",
    price_usd: 0.12,
    hard_cap_usd: 3_000_000,
    raised_usd: 0,
    status: "upcoming",
    trust_score: 87,
    starts_at: new Date(Date.now() + 4 * 86400_000).toISOString(),
    ends_at: new Date(Date.now() + 11 * 86400_000).toISOString(),
    tags: ["AI", "Compute"],
    featured: true,
  },
  {
    id: "3",
    slug: "mirage",
    project_name: "Mirage",
    tagline: "Privacy layer for institutional flows.",
    logo_url: null,
    cover_url: null,
    token_symbol: "MIR",
    token_chain: "Ethereum",
    price_usd: null,
    hard_cap_usd: 5_000_000,
    raised_usd: 5_000_000,
    status: "ended",
    trust_score: 95,
    starts_at: new Date(Date.now() - 30 * 86400_000).toISOString(),
    ends_at: new Date(Date.now() - 22 * 86400_000).toISOString(),
    tags: ["Privacy"],
    featured: false,
  },
];

export async function listLaunches(args?: {
  data?: { status?: "all" | "upcoming" | "live" | "ended" | "cancelled"; search?: string };
}) {
  await fakeLatency(350);
  const status = args?.data?.status ?? "all";
  const search = (args?.data?.search ?? "").toLowerCase();
  const launches = MOCK_LAUNCHES.filter((l) => {
    if (status !== "all" && l.status !== status) return false;
    if (search && !l.project_name.toLowerCase().includes(search)) return false;
    return true;
  });
  return { ok: true as const, launches };
}

export type LaunchDetail = LaunchSummary & {
  description?: string | null;
  long_description?: string | null;
  team?: { name: string; role: string }[] | null;
  links?: { label: string; url: string }[] | null;
  risk_breakdown?: Record<string, number> | null;
};

export async function getLaunch(args: { data: { slug: string } }) {
  await fakeLatency(350);
  const base = MOCK_LAUNCHES.find((l) => l.slug === args.data.slug);
  if (!base) return { ok: true as const, launch: null };
  const launch: LaunchDetail = {
    ...base,
    description:
      base.tagline ??
      "Mock description. Replace with backend-sourced content once the API is connected.",
    long_description:
      "Mock long description. Replace with backend-sourced content once the API is connected.",
    total_supply: 1_000_000_000,
    sale_supply: 100_000_000,
    website: "https://example.com",
    twitter: "@example",
    telegram: "https://t.me/example",
    whitepaper_url: "https://example.com/whitepaper.pdf",
    team: [
      { name: "A. Founder", role: "CEO" },
      { name: "B. Engineer", role: "CTO" },
    ],
    links: [
      { label: "Website", url: "https://example.com" },
      { label: "Docs", url: "https://example.com/docs" },
    ],
    risk_breakdown: {
      contract: 90,
      team: 88,
      tokenomics: 85,
      community: 80,
      liquidity: 92,
    },
  };
  return { ok: true as const, launch };
}
