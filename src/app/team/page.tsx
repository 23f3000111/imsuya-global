import type { Metadata } from "next";
import { TeamBody } from "@/components/pages/TeamBody";

export const metadata: Metadata = {
  title: "Team — Imsuya Global",
  description: "The people behind Imsuya Global — founder, director and engineering.",
};

export default function TeamPage() {
  return <TeamBody />;
}
