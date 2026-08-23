import type { Metadata } from "next";
import { site, office, socials } from "@/data/site";
import { services } from "@/data/services";
import { faqsFor, type FaqTopic } from "@/data/faqs";
import type { Project } from "@/data/projects";
import type { Service } from "@/data/services";

/**
 * One place that knows what a canonical Imsuya Global URL looks like, and one
 * place that builds a page's metadata from it. Before this, no page carried a
 * canonical at all and only the homepage carried social metadata, so every
 * host and trailing-slash variant of every URL was a candidate for indexing.
 */

export const SITE_URL = site.url;

/** Absolute, no trailing slash except at the root — the canonical form. */
export function absoluteUrl(path = "/"): string {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/+$/, "");
}

/**
 * A real 1200x630 card. The wordmark at /brand/logo.png is 15387x3422 — a
 * 4.5:1 strip that every social platform letterboxes or centre-crops into
 * nonsense — so it is not the thing to hand a share preview.
 */
const DEFAULT_OG = "/brand/og-default.png";

export function pageMetadata({
  path,
  title,
  description,
  image = DEFAULT_OG,
  imageAlt,
  type = "website",
  absoluteTitle = false,
}: {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  /** Opt out of the layout's "%s · Imsuya Global" template, for a title that
   *  already names the studio. */
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const alt = imageAlt ?? `${title} · Imsuya Global`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: "en_MY",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image, alt }],
    },
  };
}

/* ------------------------------------------------------------------ */
/* Structured data                                                      */
/* ------------------------------------------------------------------ */

type Json = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;

/**
 * ProfessionalService rather than a bare Organization: the studio sells
 * services from a real address in Petaling Jaya, and the local entity signals
 * are what the audit found missing.
 */
export function organizationSchema(): Json {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: site.name,
    url: `${SITE_URL}/`,
    // The square mark for the logo slot and the social card for image: a
    // 4.5:1 wordmark is a poor fit for both, and Google reads `logo` for the
    // knowledge panel.
    logo: { "@type": "ImageObject", url: absoluteUrl("/brand/icon.png") },
    image: absoluteUrl(DEFAULT_OG),
    slogan: site.tagline,
    description:
      "Boutique creative digital design and smart website development studio in Petaling Jaya, Malaysia. Smart websites, custom web applications and software systems, custom AI services and softwares, and custom digital design from brand identity through to merchandise.",
    email: site.email,
    telephone: `+${site.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${office.lines[0]}, ${office.lines[1]}`,
      addressLocality: "Petaling Jaya",
      addressRegion: "Selangor",
      postalCode: "47820",
      addressCountry: "MY",
    },
    // Taken from the same map pin the contact page embeds, so the coordinates
    // and the visible map can never disagree.
    geo: { "@type": "GeoCoordinates", latitude: 3.1643698, longitude: 101.6071013 },
    areaServed: [
      { "@type": "Country", name: "Malaysia" },
      { "@type": "Place", name: "Asia" },
      { "@type": "Place", name: "Africa" },
      { "@type": "Place", name: "Middle East" },
    ],
    priceRange: "$$",
    knowsAbout: [
      "Website design and development",
      "Custom web application development",
      "Custom software systems",
      "AI automation and AI agents",
      "AI products and chatbots",
      "Brand identity and digital design",
      "UI and UX design",
      "Merchandise and apparel design",
    ],
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 3 },
    sameAs: socials.map((s) => s.href),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title.en,
          url: absoluteUrl(`/services/${s.slug}`),
        },
      })),
    },
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: site.name,
    inLanguage: "en-MY",
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function serviceSchema(service: Service): Json {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(`/services/${service.slug}`)}#service`,
    name: service.title.en,
    url: absoluteUrl(`/services/${service.slug}`),
    description: service.description.en,
    serviceType: service.short.en,
    provider: { "@id": ORG_ID },
    areaServed: [
      { "@type": "Country", name: "Malaysia" },
      { "@type": "Place", name: "Worldwide" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.short.en,
      itemListElement: service.features.map((f) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: f.name.en, description: f.detail.en },
      })),
    },
  };
}

/**
 * A project page is a case study about a site we made, so the page is the
 * CreativeWork and the site is what it is about. Claiming the client's site
 * itself as our CreativeWork would overstate it.
 */
export function projectSchema(project: Project): Json {
  const url = absoluteUrl(`/portfolio/${project.slug}`);
  const live = project.url !== "#" && project.url.startsWith("http");

  return {
    "@type": "CreativeWork",
    "@id": `${url}#case-study`,
    name: `${project.name} · ${project.sector.en}`,
    url,
    headline: project.name,
    abstract: project.summary.en,
    inLanguage: "en-MY",
    creator: { "@id": ORG_ID },
    ...(project.image ? { image: absoluteUrl(project.image) } : {}),
    about: {
      "@type": "WebSite",
      name: project.name,
      ...(live ? { url: project.url } : {}),
    },
  };
}

/**
 * Marks up only the questions that are actually rendered on the calling page.
 * Each topic belongs to exactly one URL, so two pages can never ship the same
 * rich result and compete for it.
 */
export function faqSchema(topic: FaqTopic): Json {
  return {
    "@type": "FAQPage",
    mainEntity: faqsFor(topic).map((f) => ({
      "@type": "Question",
      name: f.q.en,
      acceptedAnswer: { "@type": "Answer", text: f.a.en },
    })),
  };
}

export function peopleSchema(
  members: { name: string; role: string; image: string }[]
): Json[] {
  return members.map((m) => ({
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    image: absoluteUrl(m.image),
    worksFor: { "@id": ORG_ID },
  }));
}

/**
 * Wraps a set of nodes in one @graph, which is how a page should ship them.
 * `<` is escaped so a stray "</script>" inside any copy string can never close
 * the tag the JSON is embedded in.
 */
export function graph(nodes: Json[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }).replace(
    /</g,
    "\\u003c"
  );
}
