import type { JsonLd } from "@/lib/seo/structured-data";

/**
 * Server-renderable JSON-LD <script>.
 *
 * Use one per "page intent". root layout emits the global Org + WebSite +
 * SoftwareApplication graph; individual pages add their own (FAQPage,
 * BreadcrumbList, etc.).  Google merges all visible nodes into one entity.
 */
export function StructuredData({ data }: { data: JsonLd | JsonLd[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
