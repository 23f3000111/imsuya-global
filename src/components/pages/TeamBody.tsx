"use client";

import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLang } from "@/i18n";
import type { L10n } from "@/i18n/types";

// Names and full bios are placeholders — swap in the real ones when provided.
const MEMBERS: {
  role: L10n;
  focus: L10n;
  image: string;
  position: string;
  bio: L10n;
}[] = [
  {
    role: { en: "Founder", ms: "Pengasas" },
    focus: { en: "Vision & Strategy", ms: "Visi & Strategi" },
    image: "/team/founder.jpg",
    position: "object-[50%_25%]",
    bio: {
      en: "Sets the direction — which businesses we partner with, what we build for them, and the standard every project has to clear before it ships.",
      ms: "Menetapkan hala tuju — perniagaan mana kami jadikan rakan, apa yang kami bina untuk mereka, dan piawaian yang mesti dicapai setiap projek sebelum dilancarkan.",
    },
  },
  {
    role: { en: "Director", ms: "Pengarah" },
    focus: { en: "Operations & Delivery", ms: "Operasi & Penyampaian" },
    image: "/team/director.png",
    position: "object-[50%_15%]",
    bio: {
      en: "Owns the promise. Scopes, timelines and communication — the reason clients always know what's happening and when it lands.",
      ms: "Memegang janji. Skop, garis masa dan komunikasi — sebab pelanggan sentiasa tahu apa yang berlaku dan bila ia siap.",
    },
  },
  {
    role: { en: "Developer", ms: "Pembangun" },
    focus: { en: "Engineering & Systems", ms: "Kejuruteraan & Sistem" },
    image: "/team/developer.png",
    position: "object-[50%_15%]",
    bio: {
      en: "Turns ambition into working software — websites, platforms and AI systems engineered to hold up long after launch day.",
      ms: "Menukar cita-cita kepada perisian yang berfungsi — laman web, platform dan sistem AI yang kekal kukuh lama selepas hari pelancaran.",
    },
  },
];

const COPY = {
  en: {
    eyebrow: "The team — 03 people",
    lines: ["People you can", "actually reach."],
    intro:
      "No account managers between you and the people doing the work. When you work with Imsuya Global, you work with us directly.",
    nameSoon: "Name & story coming soon.",
    want: "Want us on your project?",
    cta: "Work with the team",
  },
  ms: {
    eyebrow: "Pasukan — 03 insan",
    lines: ["Insan yang benar-benar", "boleh dihubungi."],
    intro:
      "Tiada pengurus akaun antara anda dan orang yang membuat kerja. Bila anda bekerja dengan Imsuya Global, anda bekerja terus dengan kami.",
    nameSoon: "Nama & kisah akan datang.",
    want: "Mahu kami dalam projek anda?",
    cta: "Bekerja dengan pasukan",
  },
};

export function TeamBody() {
  const { lang } = useLang();
  const copy = COPY[lang];

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} lines={copy.lines} intro={copy.intro} />

      <section className="bg-void px-6 pb-32 lg:px-12">
        <div className="relative z-10 mx-auto max-w-[1600px]">
          {MEMBERS.map((m, i) => (
            <Reveal key={m.role.en} className="border-t border-paper/[0.08] py-16 last:border-b lg:py-20">
              <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
                <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2 lg:col-start-8" : ""}`}>
                  <div className="img-veil card relative aspect-[4/5] max-w-md overflow-hidden border border-paper/[0.1]">
                    <Image
                      src={m.image}
                      alt={`${m.role[lang]} — Imsuya Global`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className={`img-cinematic object-cover ${m.position}`}
                    />
                    {/* pixel corner accent */}
                    <span className="absolute right-4 top-4 z-10 grid grid-cols-2 gap-1">
                      {[0, 1, 2].map((n) => (
                        <span key={n} className={`size-1.5 ${n === 0 ? "bg-coral" : "bg-white/40"}`} />
                      ))}
                    </span>
                  </div>
                </div>
                <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
                  <Eyebrow className="mb-6">{`0${i + 1} — ${m.focus[lang]}`}</Eyebrow>
                  <h2 className="text-display text-4xl uppercase lg:text-6xl">{m.role[lang]}</h2>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-muted">{m.bio[lang]}</p>
                  <p className="mt-4 font-mono text-xs text-soft">{copy.nameSoon}</p>
                </div>
              </div>
            </Reveal>
          ))}

          <div className="mt-32 text-center">
            <p className="text-eyebrow mb-8 text-soft">{copy.want}</p>
            <MagneticButton href="/contact">{copy.cta}</MagneticButton>
          </div>
        </div>
      </section>
    </>
  );
}
