import type { Metadata } from "next";
import { ServicesBody } from "@/components/pages/ServicesBody";

export const metadata: Metadata = {
  title: "Services — Imsuya Global",
  description:
    "Nine disciplines, one team: websites, custom software, AI automation, AI products, design, marketing, merchandise, gifts and social media.",
};

export default function ServicesPage() {
  return <ServicesBody />;
}
