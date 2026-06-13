import type { JsonLd } from "@/lib/seo/structured-data";

/**
 * Server-renderable JSON-LD <script>.
 *
 * Use one per "page intent". root layout emits the global Org + WebSite +
 * SoftwareApplication graph; individual pages add their own (FAQPage,
 * BreadcrumbList, etc.).  Google merges all visible nodes into one entity.
 */
/**
 * Serialize a JSON-LD node for inline injection. JSON.stringify does not escape
 * `<`, `>` or `&`, so any string reaching this graph that contained `</script>`
 * would close the block early and execute (stored-XSS class, D-14). On the
 * waitlist the graph is static marketing copy today, but the escape matches the
 * platform fix and keeps the sink safe if dynamic data is ever added.
 */
function serializeJsonLd(node: JsonLd): string {
  return JSON.stringify(node)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function StructuredData({ data }: { data: JsonLd | JsonLd[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"

          dangerouslySetInnerHTML={{ __html: serializeJsonLd(node) }}
        />
      ))}
    </>
  );
}
