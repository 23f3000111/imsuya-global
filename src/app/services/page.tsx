import type { Metadata } from "next";
import { ServicesBody } from "@/components/pages/ServicesBody";
import { JsonLd } from "@/components/JsonLd";
import { services } from "@/data/services";
import { absoluteUrl, breadcrumbSchema, faqSchema, graph, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/services",
  title: "Services",
  description:
    "Nine disciplines, one team: smart websites, custom web applications and software, AI automation, AI products, digital design, digital marketing, social media, merchandise and corporate gifts.",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        json={graph([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          {
            "@type": "ItemList",
            name: "Imsuya Global services",
            itemListElement: services.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.title.en,
              url: absoluteUrl(`/services/${s.slug}`),
            })),
          },
          faqSchema("services"),
        ])}
      />
      <ServicesBody />
    </>
  );
}
