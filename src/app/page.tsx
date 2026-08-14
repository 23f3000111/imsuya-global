import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { Services } from "@/components/home/Services";
import { Work } from "@/components/home/Work";
import { WhyUs } from "@/components/home/WhyUs";
import { FinalCTA } from "@/components/home/FinalCTA";
import { ContactSection } from "@/components/home/ContactSection";

// The team preview lives on /team only; it was cut from the homepage because
// the nav already carries people as a destination.
export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <Services />
      <Work />
      <WhyUs />
      <FinalCTA />
      <ContactSection />
    </>
  );
}
