/**
 * Structured data, emitted from the server render so crawlers and answer
 * engines see it without executing anything. `json` is always built by
 * src/lib/seo.ts from the site's own data, never from user input.
 */
export function JsonLd({ json }: { json: string }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
