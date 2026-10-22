import type { Metadata } from "next";
import { TeamBody } from "@/components/pages/TeamBody";
import { team } from "@/data/team";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, graph, pageMetadata, peopleSchema } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/team",
  title: "Team · The People Behind the Studio",
  description:
    "Meet the team behind Imsuya Global, an AI creative agency and website development studio in Malaysia: Imran, founder and strategy; Rishikesh, CTO and engineering; Sumaiya, director of operations and delivery.",
});

// The same list TeamBody renders, read from a plain data module so the
// structured data stays server rendered.
const MEMBERS = team.map((m) => ({ name: m.name, role: m.schemaRole, image: m.image }));

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
