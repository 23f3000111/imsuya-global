import type { Metadata } from "next";
import { TeamBody } from "@/components/pages/TeamBody";

export const metadata: Metadata = {
  title: "Team · Imsuya Global",
  description: "The people behind Imsuya Global. Founder, director and CTO.",
};

export default function TeamPage() {
  return <TeamBody />;
}
