import type { Metadata } from "next";
import { TeamBody } from "@/components/pages/TeamBody";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, graph, pageMetadata, peopleSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/team",
  title: "Team",
  description:
    "The people behind Imsuya Global: Imran, founder and strategy; Rishikesh, CTO and engineering; Sumaiya, director of operations and delivery.",
});

// Mirrors the running order in TeamBody. Kept here rather than exported from a
// client component so the markup stays server rendered.
const MEMBERS = [
  { name: "Imran", role: "Founder", image: "/team/founder.jpg" },
  { name: "Rishikesh", role: "Chief Technology Officer", image: "/team/developer.png" },
  { name: "Sumaiya", role: "Director", image: "/team/director.png" },
];

export default function TeamPage() {
  return (
    <>
      <JsonLd
        json={graph([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Team", path: "/team" },
          ]),
          ...peopleSchema(MEMBERS),
        ])}
      />
      <TeamBody />
    </>
  );
}
