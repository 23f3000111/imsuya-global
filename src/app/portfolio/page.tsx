import type { Metadata } from "next";
import { PortfolioBody } from "@/components/pages/PortfolioBody";
import { JsonLd } from "@/components/JsonLd";
import { projects } from "@/data/projects";
import { absoluteUrl, breadcrumbSchema, graph, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/portfolio",
  title: "Work · Website Design & Development Projects",
  description:
    "Selected work by Imsuya Global, a website design company in Malaysia: websites, web apps and brands for logistics, education, F&B, property, automotive and industrial clients in Malaysia and beyond.",
});

export default function PortfolioPage() {
  return (
    <>
      <JsonLd
        json={graph([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/portfolio" },
          ]),
          {
            "@type": "ItemList",
            name: "Selected work by Imsuya Global",
            itemListElement: projects.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: absoluteUrl(`/portfolio/${p.slug}`),
            })),
          },
        ])}
      />
      <PortfolioBody />
    </>
  );
}
