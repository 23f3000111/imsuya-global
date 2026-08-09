"use client";

import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { useLang } from "@/i18n";
import type { L10n } from "@/i18n/types";

// Display order puts the founder in the centre, flanked by Director and CTO.
export const TEAM: {
  role: L10n;
  focus: L10n;
  image: string;
  position: string;
  lead?: boolean;
}[] = [
  {
    role: { en: "Director", ms: "Pengarah" },
    focus: { en: "Operations & Delivery", ms: "Operasi & Penyampaian" },
    image: "/team/director.png",
    position: "object-[50%_20%]",
  },
  {
    role: { en: "Founder", ms: "Pengasas" },
    focus: { en: "Vision & Strategy", ms: "Visi & Strategi" },
    image: "/team/founder.jpg",
    position: "object-[50%_25%]",
    lead: true,
  },
  {
    role: { en: "CTO", ms: "CTO" },
    focus: { en: "Engineering & Systems", ms: "Kejuruteraan & Sistem" },
    image: "/team/developer.png",
    position: "object-[50%_20%]",
  },
];

const COPY = {
  en: {
    eyebrow: "The people / 005",
    heading: "Small team.",
    headingSoft: "Serious output.",
    cta: "Meet our team",
  },
  ms: {
    eyebrow: "Insan / 005",
    heading: "Pasukan kecil.",
    headingSoft: "Hasil serius.",
    cta: "Kenali pasukan kami",
  },
};

export function TeamPreview() {
  const { lang } = useLang();
  const copy = COPY[lang];

  return (
    <section className="relative border-y border-paper/[0.06] bg-void py-32">
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Eyebrow variant="b" className="mb-4">
              {copy.eyebrow}
            </Eyebrow>
            <h2 className="text-display text-4xl uppercase lg:text-5xl">
              {copy.heading} <span className="text-soft">{copy.headingSoft}</span>
            </h2>
          </div>
          <Link
            href="/team"
            className="group inline-flex w-fit items-center gap-3 border border-paper/20 px-6 py-3 text-eyebrow text-paper transition-all duration-300 hover:border-coral hover:bg-coral hover:text-black"
          >
            {copy.cta}
          </Link>
        </div>

        <Reveal stagger={0.12} className="grid items-center gap-6 md:grid-cols-3">
          {TEAM.map((m) => (
            <Link
              key={m.role.en}
              href="/team"
              className={`card group border border-paper/[0.08] transition-colors duration-500 hover:border-coral/40 ${
                m.lead
                  ? "p-6 md:-mt-12 md:border-coral/25 lg:p-8"
                  : "mx-auto w-full p-5 md:w-[86%]"
              }`}
            >
              <div
                className={`img-veil relative mb-6 overflow-hidden ${
                  m.lead ? "aspect-[4/5]" : "aspect-[5/6]"
                }`}
              >
                <Image
                  src={m.image}
                  alt={`${m.role[lang]} of Imsuya Global`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`img-cinematic object-cover ${m.position} transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]`}
                />
                {m.lead && (
                  <span className="absolute left-4 top-4 z-10 bg-coral px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-black">
                    {m.role[lang].toUpperCase()}
                  </span>
                )}
              </div>
              <h3
                className={`font-black uppercase tracking-tight ${
                  m.lead ? "text-2xl lg:text-3xl" : "text-xl"
                }`}
              >
                {m.role[lang]}
              </h3>
              <p className="mt-2 font-mono text-xs text-soft">{m.focus[lang]}</p>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
