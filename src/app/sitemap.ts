import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

/**
 * Every indexable URL, generated from the same data the pages are built from,
 * so a withdrawn project or a renamed service can never leave a 404 behind in
 * the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${site.url}${path}`;

  const statics: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/portfolio"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/team"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];

  return [
    ...statics,
    ...services.map((s) => ({
      url: url(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((p) => ({
      url: url(`/portfolio/${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
