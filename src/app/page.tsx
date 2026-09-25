import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { ClientLogos } from "@/components/ui/ClientLogos";
import { Services } from "@/components/home/Services";
import { Work } from "@/components/home/Work";
import { WhyUs } from "@/components/home/WhyUs";
import { FinalCTA } from "@/components/home/FinalCTA";
import { ContactSection } from "@/components/home/ContactSection";
import { pageMetadata } from "@/lib/seo";

// Declared in full rather than as a patch over the layout: Next replaces the
// whole `openGraph` object instead of merging into the parent's, so setting
// just `openGraph: { url }` here silently dropped the homepage's og:image,
// og:type, og:site_name and og:locale.
export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "Imsuya Global · AI Creative Agency & Website Development Studio in Malaysia",
  description:
    "Imsuya Global is an AI creative agency and custom website development studio in Malaysia: website design and development, custom web apps, AI products and systems, and AI design for businesses in Malaysia and worldwide.",
  // The title already ends in the studio name; the template would append it twice.
  absoluteTitle: true,
});

// The team preview lives on /team only; it was cut from the homepage because
// the nav already carries people as a destination.
export default function Home() {
  return (
    <>
      <Hero />
      {/* Proof first: who the studio has worked for, straight after the hero. */}
      <ClientLogos />
      <Story />
      <Services />
      <Work />
      <WhyUs />
      <FinalCTA />
      <ContactSection />
    </>
  );
}
