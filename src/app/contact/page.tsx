import type { Metadata } from "next";
import { ContactBody } from "@/components/pages/ContactBody";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, breadcrumbSchema, faqSchema, graph, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact · Start a Website or AI Project in Malaysia",
  description:
    "Start a website, web app or AI project with Imsuya Global by WhatsApp, email or a 60 second brief. Studio in Damansara Perdana, Petaling Jaya, Malaysia. We reply within one business day.",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        json={graph([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
          {
            "@type": "ContactPage",
            url: absoluteUrl("/contact"),
            name: "Contact Imsuya Global",
          },
          faqSchema("engagement"),
        ])}
      />
      <ContactBody />
    </>
  );
}
