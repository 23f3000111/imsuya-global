"use client";

import Link from "next/link";
import { services } from "@/data/services";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLang, useT } from "@/i18n";

const COPY = {
  en: {
    eyebrow: "Services / 09 disciplines",
    lines: ["Everything a digital", "business needs."],
    intro: "Strategy, design, engineering and growth under one roof. Pick a discipline to see how we run it.",
    unsure: "Not sure which one you need?",
    cta: "Talk it through with us",
  },
  ms: {
    eyebrow: "Perkhidmatan / 09 disiplin",
    lines: ["Segala keperluan", "perniagaan digital."],
    intro: "Strategi, reka bentuk, kejuruteraan dan pertumbuhan di bawah satu bumbung. Pilih satu disiplin untuk lihat cara kami melaksanakannya.",
    unsure: "Tidak pasti yang mana anda perlukan?",
    cta: "Bincang dengan kami",
  },
};

export function ServicesBody() {
  const { lang } = useLang();
  const t = useT();
  const copy = COPY[lang];

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} lines={copy.lines} intro={copy.intro} />

      <section className="bg-void px-6 pb-32 lg:px-12">
        <div className="relative z-10 mx-auto max-w-[1600px]">
          <Reveal stagger={0.06} className="flex flex-col">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group relative grid items-center gap-2 border-b border-paper/[0.08] py-8 transition-colors duration-300 first:border-t hover:border-coral/40 lg:grid-cols-12 lg:gap-8 lg:py-10"
                data-cursor
              >
                <span className="font-mono text-sm text-coral lg:col-span-1">{s.index}</span>
                {/* Full service names, in the same running order as the homepage. */}
                <h2 className="text-display text-xl uppercase transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 lg:col-span-6 lg:text-3xl">
                  {t(s.title)}
                </h2>
                <p className="text-sm text-muted lg:col-span-4">{t(s.tagline)}</p>
                <span className="hidden justify-self-end text-2xl text-soft transition-all duration-300 group-hover:translate-x-2 group-hover:text-coral lg:col-span-1 lg:block">
                  →
                </span>
              </Link>
            ))}
          </Reveal>

          <div className="mt-32 text-center">
            <p className="text-eyebrow mb-8 text-soft">{copy.unsure}</p>
            <MagneticButton href="/contact">{copy.cta}</MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
}
