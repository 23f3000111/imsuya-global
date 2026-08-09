"use client";

import { projects } from "@/data/projects";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectCard } from "@/components/home/Work";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLang } from "@/i18n";

const COPY = {
  en: {
    eyebrow: (n: string) => `Selected work / ${n} projects`,
    lines: ["Proof,", "not promises."],
    intro:
      "Every project here is live and working for a real business. Open any of them to see the full story.",
    ctaHeading: "Your project belongs on this page.",
    cta: "Start your project",
  },
  ms: {
    eyebrow: (n: string) => `Kerja pilihan / ${n} projek`,
    lines: ["Bukti,", "bukan janji."],
    intro:
      "Setiap projek di sini hidup dan bekerja untuk perniagaan sebenar. Buka mana-mana untuk melihat kisah penuhnya.",
    ctaHeading: "Projek anda layak berada di halaman ini.",
    cta: "Mulakan projek anda",
  },
};

export function PortfolioBody() {
  const { lang } = useLang();
  const copy = COPY[lang];
  const n = String(projects.length).padStart(2, "0");

  return (
    <>
      <PageHero eyebrow={copy.eyebrow(n)} lines={copy.lines} intro={copy.intro} />

      <section className="bg-void px-6 pb-32 lg:px-12">
        <div className="relative z-10 mx-auto max-w-[1600px]">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.slug}
                project={p}
                eager={i < 2}
                className={
                  i % 4 === 0 || i % 4 === 3
                    ? "lg:col-span-7"
                    : "lg:col-span-5 lg:translate-y-16"
                }
              />
            ))}
          </div>

          <Reveal className="mt-40 border-t border-paper/[0.08] pt-20 text-center">
            <h2 className="text-display mx-auto max-w-3xl text-4xl uppercase lg:text-6xl">
              {copy.ctaHeading}
            </h2>
            <div className="mt-10">
              <MagneticButton href="/contact">{copy.cta}</MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
