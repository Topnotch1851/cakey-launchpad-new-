/**
 * JSON-LD schema builders.
 *
 * One source of truth for every structured-data fragment on the site.  Builders
 * return plain objects; the `<StructuredData />` component serialises them.
 *
 * Why one module?
 *   - Stable `@id` constants (organization, website) referenced by other nodes.
 *   - Consistent absolute URLs without each call-site re-deriving them.
 *   - Easy audit: search this file to see every claim we make to Google.
 */

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cakey.ai"
).replace(/\/$/, "");

const SAME_AS = [
  // Replace with real handles when they exist; Google ignores invalid URLs without penalty.
  "https://x.com/cakeyai",
  "https://github.com/cakey-ai",
];

export const ORG_ID = `${SITE_URL}#organization`;
export const WEBSITE_ID = `${SITE_URL}#website`;
export const SOFTWARE_APPLICATION_ID = `${SITE_URL}#software`;

export type JsonLd = Record<string, unknown>;

function absUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function organizationSchema(): JsonLd {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Cakey AI",
    legalName: "Cakey AI",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absUrl("/cakey-logo.png"),
      width: 512,
      height: 512,
    },
    description:
      "AI-powered Web3 launchpad with behavioral trust scoring, pre-launch simulation, and an insurance pool — built to end rug pulls.",
    sameAs: SAME_AS,
  };
}

export function webSiteSchema(): JsonLd {
  // NOTE on `potentialAction` / SearchAction:
  // Google only renders the sitelinks search box when the target URL really
  // resolves to a search results page.  We don't have site search yet, so we
  // intentionally omit it — a broken SearchAction is worse than none.
  // When `/search?q=` exists, add:
  //   potentialAction: {
  //     "@type": "SearchAction",
  //     target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
  //     "query-input": "required name=search_term_string",
  //   }
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "Cakey AI Launchpad",
    description:
      "Launch tokens with intelligent trust. AI risk scoring, simulation, and an insurance pool.",
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function softwareApplicationSchema(): JsonLd {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_APPLICATION_ID,
    name: "Cakey AI Launchpad",
    operatingSystem: "Web",
    applicationCategory: "FinanceApplication",
    description:
      "AI-powered Web3 token launch platform with behavioral trust scoring, simulation, and insurance.",
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
      url: absUrl("/#waitlist"),
    },
  };
}

export function webPageSchema(args: {
  name: string;
  description: string;
  url: string;
}): JsonLd {
  return {
    "@type": "WebPage",
    name: args.name,
    description: args.description,
    url: absUrl(args.url),
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function breadcrumbsSchema(
  items: Array<{ name: string; url: string }>,
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.url),
    })),
  };
}

export function faqPageSchema(
  faqs: Array<{ question: string; answer: string }>,
): JsonLd {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * Combine multiple JSON-LD nodes into one `@graph` payload.
 * Single script tag is easier on parsers and matches Google's recommendation.
 */
export function combinedGraph(...nodes: JsonLd[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
