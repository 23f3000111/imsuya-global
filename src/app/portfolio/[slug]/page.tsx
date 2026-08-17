import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectBody } from "@/components/pages/ProjectBody";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, graph, pageMetadata, projectSchema } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  // The sector rides in the title so sibling case studies for one brand never
  // compete on an identical string.
  return pageMetadata({
    path: `/portfolio/${project.slug}`,
    title: `${project.name} — ${project.sector.en}`,
    description: project.summary.en,
    type: "article",
    ...(project.image
      ? { image: project.image, imageAlt: `${project.name} website by Imsuya Global` }
      : {}),
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <JsonLd
        json={graph([
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/portfolio" },
            { name: project.name, path: `/portfolio/${project.slug}` },
          ]),
          projectSchema(project),
        ])}
      />
      <ProjectBody project={project} />
    </>
  );
}
