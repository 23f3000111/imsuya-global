import type { Metadata } from "next";
import { ContactBody } from "@/components/pages/ContactBody";

export const metadata: Metadata = {
  title: "Contact · Imsuya Global",
  description: "Start a project with Imsuya Global by WhatsApp, email, or a 60 second brief.",
};

export default function ContactPage() {
  return <ContactBody />;
}
