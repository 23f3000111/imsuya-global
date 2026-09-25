"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  projects,
  pickProjects,
  defaultPicks,
  HOMEPAGE_PICKS,
  type Project,
} from "@/data/projects";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLang, useT } from "@/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CARD_COPY = {
  en: { soon: "Preview coming soon", live: "LIVE SITE" },
  ms: { soon: "Pratonton akan datang", live: "LAMAN HIDUP" },
};

export function ProjectCard({
  project,
  className = "",
  eager = false,
}: {
  project: Project;
  className?: string;
  eager?: boolean;
}) {
  const t = useT();
  const { lang } = useLang();
  const copy = CARD_COPY[lang];

  // The card always opens our own project page. The live site is reachable
  // from there, so a click never leaves the site unexpectedly.
  const hasLive = project.url !== "#" && project.url.startsWith("http");

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={`work-card group block ${className}`}
      data-cursor
    >
      <div className="card relative flex h-full flex-col overflow-hidden border border-paper/[0.08] transition-colors duration-500 group-hover:border-coral/50">
        {/*
          The frame matches the captures' own 1600x748 ratio and the image is
          contained inside it, so every site is shown whole at its true
          proportions. No crop, no zoom, and nothing scales on hover.
        */}
        <div className="relative aspect-[1600/748] overflow-hidden bg-white">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.name} website by Imsuya Global`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading={eager ? "eager" : "lazy"}
              className="object-contain"
            />
          ) : (
            // Holding frame: brand furniture rather than a broken image, so the
            // grid stays even until the capture arrives.
            <div className="panel-navy absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span className="text-display text-[clamp(2rem,4vw,3rem)] uppercase text-white/85">
                {project.name}
              </span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/40">
                {copy.soon}
              </span>
              <span aria-hidden className="mt-1 grid grid-cols-4 gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={i}
                    className={`size-1.5 ${i % 3 === 0 ? "bg-coral" : "bg-white/25"}`}
                  />
                ))}
              </span>
            </div>
          )}
          {/* coral glow */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_50%_120%,rgba(240,78,35,0.25)_0%,transparent_60%)]" />
        </div>
        <div className="flex flex-1 items-center justify-between gap-4 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{project.name}</h3>
            {/* Brands with more than one build carry the version on the label. */}
            <p className="font-mono text-xs text-soft">
              {project.variant ? `${t(project.variant)} · ` : ""}
              {t(project.sector)}
            </p>
            {hasLive && (
              <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-coral/80">
                {copy.live}
              </p>
            )}
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center border border-paper/15 text-muted transition-all duration-300 group-hover:border-coral group-hover:bg-coral group-hover:text-black">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

// Drawn once per page load and cached, so getSnapshot keeps returning the same
// reference and React never loops.
let drawn: Project[] | null = null;
const clientPicks = () => (drawn ??= pickProjects(HOMEPAGE_PICKS));
const subscribeToNothing = () => () => {};

const COPY = {
  en: {
    eyebrow: "Selected work / 003",
    heading: "Built by",
    counter: (n: string) => `${n} live projects`,
    viewAll: "View all projects",
    marquee: "Selected Work · Selected Work · Selected Work ·",
  },
  ms: {
    eyebrow: "Kerja pilihan / 003",
    heading: "Dibina oleh",
    counter: (n: string) => `${n} projek hidup`,
    viewAll: "Lihat semua projek",
    marquee: "Kerja Pilihan · Kerja Pilihan · Kerja Pilihan ·",
  },
};

export function Work() {
  const ref = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const copy = COPY[lang];

  // The server snapshot is the stable slice so the markup hydrates cleanly;
  // the client snapshot is a shuffle drawn once per page load, so a different
  // five greet every visit. React swaps between them itself, which keeps the
  // randomness out of render and out of an effect.
  const picks = useSyncExternalStore(subscribeToNothing, clientPicks, () => defaultPicks);

  useGSAP(
    () => {
      gsap.fromTo(
        ".work-card",
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: { trigger: ".work-grid", start: "top 82%", once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative bg-void pb-12 pt-24 lg:pb-16 lg:pt-32">
      {/* marquee backdrop — decorative, below content */}
      <div aria-hidden className="pointer-events-none relative z-0 select-none overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          {[0, 1].map((n) => (
            <span key={n} className="ghost-text text-display text-[10vw] uppercase">
              {copy.marquee}&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-[4vw] max-w-[1600px] px-6 lg:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <Eyebrow variant="c" className="mb-4">
              {copy.eyebrow}
            </Eyebrow>
            <h2 className="text-display text-4xl uppercase lg:text-6xl">
              {copy.heading} <span className="text-coral">Imsuya</span>
            </h2>
          </div>
          <p className="hidden font-mono text-xs text-soft lg:block">
            {copy.counter(String(projects.length).padStart(2, "0"))}
          </p>
        </div>

        {/* even grid: every project gets the same frame */}
        <div className="work-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {picks.map((p, i) => (
            <ProjectCard key={p.slug} project={p} eager={i < 3} />
          ))}
        </div>

        <div className="mt-14 text-center lg:mt-16">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-4 text-2xl font-black uppercase tracking-tight lg:text-3xl"
            data-cursor
          >
            <span className="transition-colors duration-300 group-hover:text-coral">
              {copy.viewAll}
            </span>
            <span className="inline-block size-3 bg-coral transition-transform duration-300 group-hover:translate-x-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
