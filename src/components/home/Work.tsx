"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects, type Project } from "@/data/projects";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLang, useT } from "@/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className={`work-card group block ${className}`}
      data-cursor
    >
      <div className="card relative flex h-full flex-col overflow-hidden border border-paper/[0.08] transition-colors duration-500 group-hover:border-coral/50">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.image}
            alt={`${project.name} website by Imsuya Global`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={eager ? "eager" : "lazy"}
            className="object-cover object-top transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          {/* lift the dark veil on hover */}
          <div className="work-veil absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-25" />
          {/* coral glow */}
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,78,69,0.25)_0%,transparent_60%)]" />
        </div>
        <div className="flex flex-1 items-center justify-between gap-4 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{project.name}</h3>
            <p className="font-mono text-xs text-soft">{t(project.sector)}</p>
          </div>
          <span className="flex size-9 items-center justify-center border border-paper/15 text-muted transition-all duration-300 group-hover:border-coral group-hover:bg-coral group-hover:text-black">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

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

// Curated running order lives in the data file; the homepage shows the
// first six of it and the portfolio page shows them all.
const picks: Project[] = projects.slice(0, 6);

export function Work() {
  const ref = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const copy = COPY[lang];

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
          scrollTrigger: { trigger: ".work-grid", start: "top 80%", once: true },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative bg-void py-32 lg:py-44">
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
        <div className="mb-16 flex items-end justify-between">
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

        <div className="mt-28 text-center">
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-4 text-2xl font-black uppercase tracking-tight lg:text-4xl"
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
