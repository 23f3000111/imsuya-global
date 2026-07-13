import type { Metadata } from "next";
import { PortfolioBody } from "@/components/pages/PortfolioBody";

export const metadata: Metadata = {
  title: "Work — Imsuya Global",
  description: "Selected projects by Imsuya Global — websites, platforms and brands across industries.",
};

export default function PortfolioPage() {
  return <PortfolioBody />;
}
