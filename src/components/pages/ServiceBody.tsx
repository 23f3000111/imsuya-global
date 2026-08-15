"use client";

import Image from "next/image";
import Link from "next/link";
import { process, serviceImage, type Service } from "@/data/services";
import { projects } from "@/data/projects";
import { merchandise } from "@/data/merchandise";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ServiceRail } from "@/components/ui/ServiceRail";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/home/Work";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLang, useT } from "@/i18n";

const COPY = {
  en: {
    eyebrow: (index: string) => `Service ${index} / 09`,
    process: "How we run it, and what you get",
    processIntro:
      "Six stages from first conversation to launch day. The deliverables sit against the stage that produces them.",
    youGet: "You get",
    related: "In the wild",
    merch: "Brands we have produced for",
    soon: "Coming soon",
    soonBody:
      "We are shipping work in this discipline right now. The first case studies land here shortly.",
    allProjects: "All projects →",
    readyA: "Ready when",
    readyB: "you",
    readyC: "are.",
    cta: "Start this project",
  },
  ms: {
    eyebrow: (index: string) => `Perkhidmatan ${index} / 09`,
    process: "Cara kami laksanakan, dan apa anda dapat",
    processIntro:
      "Enam peringkat dari perbualan pertama hingga hari pelancaran. Hasil kerja diletakkan pada peringkat yang menghasilkannya.",
    youGet: "Anda dapat",
    related: "Dalam dunia sebenar",
    merch: "Jenama yang kami hasilkan",
    soon: "Akan datang",
    soonBody:
      "Kami sedang menyiapkan kerja dalam disiplin ini. Kajian kes pertama akan dipaparkan di sini tidak lama lagi.",
    allProjects: "Semua projek →",
    readyA: "Sedia bila",
    readyB: "anda",
    readyC: "sedia.",
    cta: "Mulakan projek ini",
  },
};

/**
 * Which process stage hands over which deliverable. Discovery and Testing are
 * deliberately blank: they are checks on the work, not things you walk away
 * with, and forcing a card onto them would be noise.
 */
const STAGE_OF_FEATURE = [1, 2, 3, 5];

export function ServiceBody({ service }: { service: Service }) {
  const { lang } = useLang();
  const t = useT();
  const copy = COPY[lang];

  const deliverableFor = (stage: number) => {
    const idx = STAGE_OF_FEATURE.indexOf(stage);
    return idx === -1 ? undefined : service.features[idx];
  };

  const related = service.related
    .map((r) => projects.find((p) => p.slug === r))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Split the short title across two hero lines for scale.
  const words = t(service.short).split(" ");
  const mid = Math.ceil(words.length / 2);
  const lines =
    words.length > 1
      ? [words.slice(0, mid).join(" "), words.slice(mid).join(" ")]
      : [t(service.short)];

  return (
    // The rail is fixed to the left edge, so the page itself is inset at xl
    // and up to keep it clear of the headline.
    <div className="xl:pl-24">
      {/* Jump straight to any other discipline without going back a page. */}
      <ServiceRail activeSlug={service.slug} />

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

          {/* physical work, shown only where it belongs */}
          {service.slug === "merchandise-design" && (
            <div className="mt-24">
              <Eyebrow variant="a" className="mb-10">
                {copy.merch}
              </Eyebrow>
              <Reveal stagger={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {merchandise.map((m) => (
                  <figure
                    key={m.name}
                    className="card group overflow-hidden border border-paper/[0.08] transition-colors duration-500 hover:border-coral/50"
                  >
                    {/* Letterboxed, not cropped: these are full presentation
                        boards and the edges carry the detail. */}
                    <div className="panel-navy relative aspect-[3/2] overflow-hidden">
                      <Image
                        src={m.image}
                        alt={`${m.name} merchandise designed by Imsuya Global`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <figcaption className="px-5 py-4">
                      <p className="text-base font-bold tracking-tight">{m.name}</p>
                      <p className="font-mono text-xs text-soft">{t(m.kind)}</p>
                    </figcaption>
                  </figure>
                ))}
              </Reveal>
            </div>
          )}

          {/*
            One section, not two. The old page ran "What you get" and "How we
            run it" side by side and the reader had to join them up themselves.
            Now the deliverables hang off the stage of the process that actually
            produces them, so the run reads start to finish.
          */}
          <div className="mt-24">
            <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <Eyebrow variant="c">{copy.process}</Eyebrow>
              <p className="max-w-md text-sm leading-relaxed text-muted">{copy.processIntro}</p>
            </div>

            <Reveal
              stagger={0.07}
              className="grid gap-px overflow-hidden border border-paper/[0.08] bg-paper/[0.08] md:grid-cols-2 lg:grid-cols-3"
            >
              {process.map((p, i) => {
                const gain = deliverableFor(i);
                return (
                  <div
                    key={p.step.en}
                    className="group flex flex-col bg-void p-8 transition-colors duration-500 hover:bg-navy-deep/50"
                  >
                    <p className="text-display text-5xl text-paper/[0.12] transition-colors duration-500 group-hover:text-coral/60">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-6 text-lg font-black uppercase tracking-tight">{t(p.step)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t(p.detail)}</p>

                    {gain && (
                      <div className="mt-6 border-t border-paper/[0.08] pt-5">
                        <p className="text-eyebrow mb-2 text-coral">{copy.youGet}</p>
                        <p className="text-sm font-bold tracking-tight">{t(gain.name)}</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                          {t(gain.detail)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </Reveal>
          </div>

          {/* related work, or an honest placeholder where there is none yet */}
          {service.slug !== "merchandise-design" && (
            <div className="mt-24">
              <div className="mb-10 flex items-end justify-between">
                <Eyebrow variant="d">{copy.related}</Eyebrow>
                <Link href="/portfolio" className="font-mono text-xs text-soft transition-colors hover:text-coral">
                  {copy.allProjects}
                </Link>
              </div>

              {related.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {related.slice(0, 2).map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                </div>
              ) : (
                <Reveal className="panel-navy flex flex-col items-center justify-center gap-4 border border-paper/[0.08] px-6 py-20 text-center">
                  <ServiceIcon slug={service.slug} className="size-12 text-coral" />
                  <p className="text-display text-2xl uppercase text-white lg:text-3xl">
                    {copy.soon}
                  </p>
                  <p className="max-w-sm text-sm leading-relaxed text-white/60">
                    {copy.soonBody}
                  </p>
                </Reveal>
              )}
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
    </div>
  );
}
