import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * The site had no /robots.txt at all, so every crawler was working from
 * guesswork and nothing pointed at the sitemap.
 *
 * The AI crawlers are named explicitly rather than left to the catch-all, so
 * being readable by answer engines is a recorded decision and not an accident
 * of a default — and so anyone auditing the file can see at a glance that
 * none of them are blocked. /api is the only closed door: it serves the
 * contact handler and has nothing indexable behind it.
 */

/** Retrieval and training agents we want reading the site. */
const AI_AGENTS = [
  // OpenAI: search, live user fetches, training.
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic.
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  // Perplexity.
  "PerplexityBot",
  "Perplexity-User",
  // Google's AI products (separate from Googlebot's search crawl).
  "Google-Extended",
  // Apple, Amazon, Meta, Common Crawl, Mistral.
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "CCBot",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      // Traditional search, stated for the same reason.
      { userAgent: ["Googlebot", "Bingbot"], allow: "/", disallow: ["/api/"] },
      { userAgent: AI_AGENTS, allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
