"use client";

import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/home/Work";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLang, useT } from "@/i18n";

const COPY = {
  en: {
    eyebrow: (sector: string) => `Project / ${sector}`,
    visit: "Visit live site ↗",
    linkSoon: "Live link coming soon",
    aboutLabel: "About this project",
    aboutSoon:
      "The full case study for this project is being written. Scope, process and results will live here soon.",
    sectorLabel: "Sector",
    servicesLabel: "Delivered by",
    moreLabel: "More work",
    allProjects: "All projects →",
    ctaHeading: "Want results like this?",
    cta: "Start your project",
  },
  ms: {
    eyebrow: (sector: string) => `Projek / ${sector}`,
    visit: "Lawati laman sebenar ↗",
    linkSoon: "Pautan akan datang",
    aboutLabel: "Tentang projek ini",
    aboutSoon:
      "Kajian kes penuh untuk projek ini sedang ditulis. Skop, proses dan hasil akan dipaparkan di sini tidak lama lagi.",
    sectorLabel: "Sektor",
    servicesLabel: "Dihasilkan oleh",
    moreLabel: "Kerja lain",
    allProjects: "Semua projek →",
    ctaHeading: "Mahu hasil seperti ini?",
    cta: "Mulakan projek anda",
  },
};

export function ProjectBody({ project }: { project: Project }) {
  const { lang } = useLang();
  const t = useT();
  const copy = COPY[lang];

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow(t(project.sector))}
        lines={[project.name]}
        intro={t(project.summary)}
      />

      <section className="bg-void px-6 pb-32 lg:px-12">
        <div className="relative z-10 mx-auto max-w-[1600px]">
          {/* hero screenshot */}
          <Reveal y={60} className="img-veil card relative aspect-[16/9] w-full overflow-hidden border border-paper/[0.1]">
            <Image
              src={project.image}
              alt={`${project.name} · Imsuya Global`}
              fill
              priority
              sizes="100vw"
              className="img-cinematic object-cover object-top"
            />
            <span className="absolute bottom-5 left-5 z-10 font-mono text-[11px] tracking-[0.25em] text-white/70">
              {project.name.toUpperCase()} / IMSUYA GLOBAL
            </span>
          </Reveal>

          {/* meta + about */}
          <div className="mt-20 grid gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-4" y={40}>
              <div className="flex flex-col gap-8 border-l-2 border-coral pl-6">
                <div>
                  <p className="text-eyebrow mb-2 text-soft">{copy.sectorLabel}</p>
                  <p className="text-lg font-bold">{t(project.sector)}</p>
                </div>
                <div>
                  <p className="text-eyebrow mb-2 text-soft">{copy.servicesLabel}</p>
                  <p className="text-lg font-bold">Imsuya Global</p>
                </div>
                {project.url !== "#" ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit bg-coral px-7 py-4 text-sm font-bold uppercase tracking-wide text-black transition-colors duration-300 hover:bg-paper hover:text-void"
                  >
                    {copy.visit}
                  </a>
                ) : (
                  <p className="w-fit border border-paper/15 px-7 py-4 font-mono text-xs uppercase tracking-wide text-soft">
                    {copy.linkSoon}
                  </p>
                )}
              </div>
            </Reveal>

            <Reveal className="lg:col-span-7 lg:col-start-6" y={40}>
              <Eyebrow variant="b" className="mb-6">
                {copy.aboutLabel}
              </Eyebrow>
              {/* Placeholder until the real case-study copy is provided */}
              <p className="text-xl leading-relaxed text-muted lg:text-2xl">{copy.aboutSoon}</p>
            </Reveal>
          </div>

          {/* more work */}
          <div className="mt-28">
            <div className="mb-10 flex items-end justify-between">
              <Eyebrow variant="d">{copy.moreLabel}</Eyebrow>
              <Link
                href="/portfolio"
                className="font-mono text-xs text-soft transition-colors hover:text-coral"
              >
                {copy.allProjects}
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {others.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-32 border-t border-paper/[0.08] pt-20 text-center">
            <h2 className="text-display mx-auto max-w-3xl text-4xl uppercase lg:text-6xl">
              {copy.ctaHeading}
            </h2>
            <div className="mt-10">
              <MagneticButton href="/contact">{copy.cta}</MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
