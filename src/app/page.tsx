import { Hero } from "@/components/home/Hero";
import { Story } from "@/components/home/Story";
import { Services } from "@/components/home/Services";
import { Work } from "@/components/home/Work";
import { WhyUs } from "@/components/home/WhyUs";
import { TeamPreview } from "@/components/home/Team";
import { FinalCTA } from "@/components/home/FinalCTA";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <Services />
      <Work />
      <WhyUs />
      <TeamPreview />
      <FinalCTA />
      <ContactSection />
    </>
  );
}
