"use client";

import Image from "next/image";
import Link from "next/link";
import { process, serviceImage, type Service } from "@/data/services";
import { projects } from "@/data/projects";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/home/Work";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLang, useT } from "@/i18n";

const COPY = {
  en: {
    eyebrow: (index: string) => `Service ${index} / 09`,
    features: "What you get",
    process: "How we run it",
    related: "In the wild",
    allProjects: "All projects →",
    readyA: "Ready when",
    readyB: "you",
    readyC: "are.",
    cta: "Start this project",
  },
  ms: {
    eyebrow: (index: string) => `Perkhidmatan ${index} / 09`,
    features: "Apa yang anda dapat",
    process: "Cara kami laksanakan",
    related: "Dalam dunia sebenar",
    allProjects: "Semua projek →",
    readyA: "Sedia bila",
    readyB: "anda",
    readyC: "sedia.",
    cta: "Mulakan projek ini",
  },
};

export function ServiceBody({ service }: { service: Service }) {
  const { lang } = useLang();
  const t = useT();
  const copy = COPY[lang];

  const related = service.related
    .map((r) => projects.find((p) => p.slug === r)!)
    .filter(Boolean);

  // Split the short title across two hero lines for scale.
  const words = t(service.short).split(" ");
  const mid = Math.ceil(words.length / 2);
  const lines =
    words.length > 1
      ? [words.slice(0, mid).join(" "), words.slice(mid).join(" ")]
      : [t(service.short)];

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow(service.index)}
        lines={lines}
        intro={t(service.tagline)}
      />

      <section className="bg-void px-6 pb-28 lg:px-12">
        <div className="relative z-10 mx-auto max-w-[1600px]">
          {/* cinematic band */}
          <Reveal y={60} className="img-veil card relative mb-20 aspect-[21/9] w-full overflow-hidden border border-paper/[0.1]">
            <Image
              src={serviceImage(service.slug)}
              alt={`${t(service.title)} · Imsuya Global`}
              fill
              priority
              sizes="100vw"
              className="img-cinematic object-cover"
            />
            <span className="absolute bottom-5 left-5 z-10 font-mono text-[11px] tracking-[0.25em] text-white/70">
              {service.index} / 09 / {t(service.short).toUpperCase()}
            </span>
          </Reveal>

          <Reveal className="max-w-3xl">
            <p className="text-xl leading-relaxed text-muted lg:text-2xl">
              {t(service.description)}
            </p>
          </Reveal>

          {/* features */}
          <div className="mt-24">
            <Eyebrow variant="b" className="mb-10">
              {copy.features}
            </Eyebrow>
            <Reveal stagger={0.08} className="grid gap-5 md:grid-cols-2">
              {service.features.map((f, i) => (
                <div
                  key={f.name.en}
                  className="card border border-paper/[0.08] bg-gradient-to-b from-navy-deep/40 to-transparent p-8 transition-colors duration-500 hover:border-coral/40"
                >
                  <span className="font-mono text-xs text-coral">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-black uppercase tracking-tight">{t(f.name)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{t(f.detail)}</p>
                </div>
              ))}
            </Reveal>
          </div>

          {/* process — a real sequence, so the numbering carries meaning */}
          <div className="mt-28">
            <Eyebrow variant="c" className="mb-10">
              {copy.process}
            </Eyebrow>
            <Reveal stagger={0.07} className="grid gap-px overflow-hidden border border-paper/[0.08] bg-paper/[0.08] md:grid-cols-2 lg:grid-cols-3">
              {process.map((p, i) => (
                <div key={p.step.en} className="group bg-void p-8 transition-colors duration-500 hover:bg-navy-deep/50">
                  <p className="text-display text-5xl text-paper/[0.12] transition-colors duration-500 group-hover:text-coral/60">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-6 text-lg font-black uppercase tracking-tight">{t(p.step)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t(p.detail)}</p>
                </div>
              ))}
            </Reveal>
          </div>

          {/* related work */}
          {related.length > 0 && (
            <div className="mt-28">
              <div className="mb-10 flex items-end justify-between">
                <Eyebrow variant="d">{copy.related}</Eyebrow>
                <Link href="/portfolio" className="font-mono text-xs text-soft transition-colors hover:text-coral">
                  {copy.allProjects}
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {related.slice(0, 2).map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-32 border-t border-paper/[0.08] pt-20 text-center">
            <h2 className="text-display mx-auto max-w-3xl text-4xl uppercase lg:text-6xl">
              {copy.readyA} <span className="text-coral">{copy.readyB}</span> {copy.readyC}
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
