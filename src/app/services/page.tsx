import type { Metadata } from "next";
import { ServicesBody } from "@/components/pages/ServicesBody";
import { JsonLd } from "@/components/JsonLd";
import { services } from "@/data/services";
import { absoluteUrl, breadcrumbSchema, faqSchema, graph, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/services",
  title: "Website Design, Web Apps & AI Services in Malaysia",
  description:
    "Four disciplines from one AI creative agency in Malaysia: website design and development, custom web applications and software systems, AI services and programmes, and digital design from brand identity to merchandise.",
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
